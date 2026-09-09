
import { Request } from "../models/request.js";
import { User } from "../models/user.js";
import path from "path";
import { sendEmail } from "../service/emailService.js";

const buildFileFields = (files, draft) => {
    // ✅ בדיקה: אם אין files, החזר ערכים ישנים
    if (!files) {
        return {
            personalInfo: { studentIdCardUrl: draft.personalInfo?.studentIdCardUrl },
            familyInfo: { parentsIdCardsUrls: draft.familyInfo?.parentsIdCardsUrls },
            educationInfo: { enrollmentCertificateUrl: draft.educationInfo?.enrollmentCertificateUrl },
            bankInfo: { bankAccountConfirmationUrl: draft.bankInfo?.bankAccountConfirmationUrl }
        };
    }

    return {
        personalInfo: {
            studentIdCardUrl: files?.studentIdCard?.length > 0
                ? `/uploads/${files.studentIdCard[0].filename}`
                : draft.personalInfo?.studentIdCardUrl
        },
        familyInfo: {
            parentsIdCardsUrls: files?.parentsIdCards?.length > 0
                ? files.parentsIdCards.map(f => `/uploads/${f.filename}`)
                : draft.familyInfo?.parentsIdCardsUrls || []
        },
        educationInfo: {
            enrollmentCertificateUrl: files?.enrollmentCertificate?.length > 0
                ? `/uploads/${files.enrollmentCertificate[0].filename}`
                : draft.educationInfo?.enrollmentCertificateUrl
        },
        bankInfo: {
            bankAccountConfirmationUrl: files?.bankAccountConfirmation?.length > 0
                ? `/uploads/${files.bankAccountConfirmation[0].filename}`
                : draft.bankInfo?.bankAccountConfirmationUrl
        }
    };
};

export const saveDraft = async (req, res) => {
    try {
        const userId = req.userId;
        const files = req.files || {}; // הגנה אם אין קבצים

        // הגנה על ה-JSON.parse - אם ה-requestData ריק, נשתמש באובייקט ריק
        let textData = {};
        if (req.body.requestData) {
            try {
                textData = JSON.parse(req.body.requestData);
            } catch (e) {
                console.error("Error parsing requestData:", e);
                // אפשר להמשיך גם אם ה-JSON לא תקין, או להחזיר 400
            }
        }

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "המשתמש לא נמצא" });

        // מציאת טיוטה
        let draft = await Request.findOne({ userId: userId, status: "Draft" });

        if (!draft) {
            draft = new Request({
                userId: userId,
                status: "Draft",
                personalInfo: { tz: user.tz, firstname: user.firstname, lastname: user.lastname }
            });
        }

        const fileFields = buildFileFields(files, draft);

        // עדכון בטוח - שימוש ב-set של Mongoose
        draft.set({
            ...textData,
            personalInfo: {
                ...(draft.personalInfo ? draft.personalInfo.toObject() : {}),
                ...(textData.personalInfo || {}),
                ...fileFields.personalInfo
            },
            familyInfo: {
                ...(draft.familyInfo ? draft.familyInfo.toObject() : {}),
                ...(textData.familyInfo || {}),
                ...fileFields.familyInfo
            },
            educationInfo: {
                ...(draft.educationInfo ? draft.educationInfo.toObject() : {}),
                ...(textData.educationInfo || {}),
                ...fileFields.educationInfo
            },
            bankInfo: {
                ...(draft.bankInfo ? draft.bankInfo.toObject() : {}),
                ...(textData.bankInfo || {}),
                ...fileFields.bankInfo
            },
            status: "Draft"
        });

        await draft.save({ validateBeforeSave: false });

        if (!user.draftId) {
            user.draftId = draft._id;
            await user.save();
        }

        res.status(200).json({ message: "נשמר", draft });

    } catch (error) {
        console.error('[saveDraft Server Error]', error);
        res.status(500).json({ message: "שגיאת שרת פנימית", error: error.message });
    }
};
export const submitRequest = async (req, res) => {
    try {
        const userId = req.userId;
        const files = req.files;

        if (!req.body.requestData) {
            return res.status(400).json({ message: "לא התקבלו נתוני טקסט בבקשה" });
        }
        const textData = JSON.parse(req.body.requestData);

        // בדיקה שהמשתמש קיים
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "המשתמש לא נמצא במערכת" });
        }

        // בדיקה שיש טיוטה
        const draft = await Request.findOne({ userId: userId, status: "Draft" });
        if (!draft) {
            draft = new Request({
                userId: userId,
                status: "Draft",
                personalInfo: { tz: user.tz, firstname: user.firstname, lastname: user.lastname }
            });
        }

        // בניית הנתונים לקבצים
        const fileFields = buildFileFields(files, draft);
        // 1. ניקוי המידע (כדי לוודא שזה אובייקט רגיל ללא "קסמי" Mongoose)
        const currentPersonalInfo = draft.personalInfo?.toObject ? draft.personalInfo.toObject() : (draft.personalInfo || {});
        const currentFamilyInfo = draft.familyInfo?.toObject ? draft.familyInfo.toObject() : (draft.familyInfo || {});
        const currentEducationInfo = draft.educationInfo?.toObject ? draft.educationInfo.toObject() : (draft.educationInfo || {});
        const currentBankInfo = draft.bankInfo?.toObject ? draft.bankInfo.toObject() : (draft.bankInfo || {});

        // עדכון הכל
        draft.set({
            ...textData,
            personalInfo: {
                ...draft.personalInfo,
                ...textData.personalInfo,
                ...fileFields.personalInfo
            },
            familyInfo: {
                ...draft.familyInfo,
                ...textData.familyInfo,
                ...fileFields.familyInfo
            },
            educationInfo: {
                ...draft.educationInfo,
                ...textData.educationInfo,
                ...fileFields.educationInfo
            },
            bankInfo: {
                ...draft.bankInfo,
                ...textData.bankInfo,
                ...fileFields.bankInfo
            },
            status: "Pending",
            dateSubmitted: new Date()
        });

        // שמירה בדאטהבייס
        await draft.save();
        await User.findByIdAndUpdate(userId, { $push: { requests: draft._id }, $set: { draftId: null } }).exec();
        try {
            await sendEmail(
                user.email,
                "ברוכים הבאים למערכת המענקים לסטודנטים",
                `<p>שלום ${user.firstname},</p><p>ההרשמה שלך למערכת המענקים הושלמה בהצלחה.</p>`
            );
        } catch (emailError) {
            console.error('שליחת מייל הברוכים הבאים נכשלה:', emailError.message);
        }
        res.status(200).json({
            message: "הבקשה נקלטה במערכת בהצלחה והועברה לסטטוס בהמתנה",
            requestId: draft._id
        });


    } catch (error) {
        console.error('[submitRequest Error]', error);
        res.status(400).json({
            message: "הגשת הבקשה נכשלה - נתונים חסרים או לא תקינים",
            error: error.message
        });
    }
};


export const getActiveDraft = async (req, res) => {
    try {
        const userId = req.userId;
        const draft = await Request.findOne({ userId: userId, status: "Draft" });

        if (!draft) {
            return res.status(200).json({ message: "לא נמצאה טיוטה קיימת", draft: null });
        }

        res.status(200).json({ draft });
    } catch (error) {
        res.status(500).json({ message: "שגיאה בשליפת הטיוטה", error: error.message });
    }
};

export const getRequestStatus = async (req, res) => {
    try {
        const userId = req.userId;
        const user = await User.findById(userId).populate("requests");

        if (!user || !user.requests || user.requests.length === 0) {
            return res.status(404).json({ message: "לא נמצאו בקשות עבור המשתמש במערכת" });
        }

        const latestRequest = user.requests[user.requests.length - 1];

        return res.status(200).json({
            status: latestRequest.status,
            dateSubmitted: latestRequest.dateSubmitted
        });

    } catch (error) {
        res.status(500).json({ message: "שגיאה בשליפת סטטוס הבקשה", error: error.message });
    }
};

export const getUnapprovedRequests = async (req, res) => {
    try {
        const {
            tz, fromDate, toDate, specificDate,
            maxSiblings, minSiblings, city,
            minAnnualTuition, maxAnnualTuition, sort
        } = req.query;

        const queryRequests = { status: "Pending" };

        // 1. סינון תאריכים
        if (specificDate) {
            const start = new Date(specificDate);
            start.setHours(0, 0, 0, 0);
            const end = new Date(specificDate);
            end.setHours(23, 59, 59, 999);
            queryRequests["dateSubmitted"] = { $gte: start, $lte: end };
        } else if (fromDate || toDate) {
            queryRequests["dateSubmitted"] = {};
            if (fromDate) queryRequests["dateSubmitted"].$gte = new Date(fromDate);
            if (toDate) {
                const end = new Date(toDate);
                end.setHours(23, 59, 59, 999);
                queryRequests["dateSubmitted"].$lte = end;
            }
        }

        // 2. סינון מספרי
        const addRangeQuery = (field, min, max) => {
            const range = {};
            if (min !== undefined && min !== null && min !== '') range.$gte = Number(min);
            if (max !== undefined && max !== null && max !== '') range.$lte = Number(max);
            if (Object.keys(range).length > 0) queryRequests[field] = range;
        };

        addRangeQuery("familyInfo.siblingsUnder18", minSiblings, maxSiblings);
        addRangeQuery("educationInfo.annualTuition", minAnnualTuition, maxAnnualTuition);

        // 3. סינון טקסטואלי
        if (city) queryRequests["personalInfo.city"] = city;
        if (tz) queryRequests["personalInfo.tz"] = tz;

        // 4. מיון
        let sortQuery = { dateSubmitted: -1 };
        if (sort) {
            try {
                const sortArray = typeof sort === 'string' ? JSON.parse(sort) : sort;
                const fieldMapping = {
                    "tuition": "educationInfo.annualTuition",
                    "siblings": "familyInfo.siblingsUnder18",
                    "date": "dateSubmitted"
                };

                const dynamicSort = {};
                sortArray.forEach(item => {
                    if (fieldMapping[item.field]) {
                        dynamicSort[fieldMapping[item.field]] = item.order === "desc" ? -1 : 1;
                    }
                });

                if (Object.keys(dynamicSort).length > 0) sortQuery = dynamicSort;
            } catch (e) {
                console.error("Sort parsing error:", e);
            }
        }

        // 5. שליפה מהדאטהבייס עם סינון, מיון ובחירת שדות
        const requests = await Request.find(queryRequests)
            .sort(sortQuery)
            .select("personalInfo.tz personalInfo.lastName personalInfo.firstName educationInfo.major status");

        return res.status(200).json(requests);

    } catch (error) {
        return res.status(500).json({ message: "שגיאה בשרת", error: error.message });
    }
};
export const updateRequestStatus = async (req, res) => {
    try {
        const { requestId } = req.params;
        const { status } = req.body;

        const updatedRequest = await Request.findByIdAndUpdate(
            requestId,
            { status: status },
            { new: true }
        ).populate('userId');

        if (!updatedRequest) {
            return res.status(404).json({ message: "בקשה לא נמצאה" });
        }
        try {
            await sendEmail(
                updatedRequest.userId.email,
                `עדכון סטטוס לבקשה שלך: ${status}`,
                `<p>שלום,</p>
                 <p>אנו שמחים לעדכן אותך שהסטטוס של הבקשה שלך עודכן ל: <b>${status}</b>.</p>
                 <p>ניתן להיכנס לאתר כדי לראות את פרטי הבקשה.</p>
                 <p>בברכה, צוות האתר</p>`
            );
        } catch (emailError) {
            console.error("שליחת מייל נכשלה (לא קריטי):", emailError);
        }

        res.status(200).json({ message: "הסטטוס עודכן בהצלחה", updatedRequest });
    } catch (error) {
        res.status(500).json({ message: "שגיאה בעדכון הסטטוס" });
    }
};

export const getRequestDetails = async (req, res) => {
    try {
        const { requestId } = req.params;
        const request = await Request.findById(requestId);
        if (!request) {
            return res.status(404).json({ message: "בקשה לא נמצאה" });
        }
        res.status(200).json(request);
    } catch (error) {
        res.status(500).json({ message: "שגיאה בשליפת הפרטים" });
    }
};

export const getRequestFile = async (req, res) => {
    try {
        const { requestId, fileKey } = req.params;
        const request = await Request.findById(requestId);

        if (!request) {
            return res.status(404).json({ message: "הבקשה לא נמצאה" });
        }

        const fileMap = {
            studentIdCardUrl: request.personalInfo?.studentIdCardUrl,
            parentsIdCardsUrls: request.familyInfo?.parentsIdCardsUrls,
            enrollmentCertificateUrl: request.educationInfo?.enrollmentCertificateUrl,
            bankAccountConfirmationUrl: request.bankInfo?.bankAccountConfirmationUrl
        };

        const fileValue = fileMap[fileKey];

        if (!fileValue || (Array.isArray(fileValue) && fileValue.length === 0)) {
            return res.status(404).json({ message: "הקובץ לא נמצא" });
        }

        const resolvedPath = Array.isArray(fileValue) ? fileValue[0] : fileValue;
        const filePath = path.join(process.cwd(), resolvedPath);
        res.sendFile(filePath);
    } catch (error) {
        res.status(500).json({ message: "שגיאה בשליפת הקובץ" });
    }
};
