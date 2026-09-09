import mongoose from "mongoose";
import { ALLOWED_BANKS, MAJORS } from "./constants.js";

const requestSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: {
            values: ["Draft", "Pending", "Approved", "Rejected"],
            message: 'סטטוס "{VALUE}" אינו תקין'
        },
        default: "Draft" // הגדרת ברירת המחדל האוטומטית
    },
    dateSubmitted: {
        type: Date,
        default: Date.now
    },
    personalInfo: {
        tz: {
            type: String,
            required: [true, "חובה להזין תעודת זהות"],
            match: [/^\d{9}$/, "תעודת זהות חייבת להכיל 9 ספרות בדיוק"],
            trim: true
        },
        firstname: {
            type: String,
            required: [true, "חובה להזין שם פרטי"],
            trim: true
        },
        lastname: {
            type: String,
            required: [true, "חובה להזין שם משפחה"],
            trim: true
        },
        dateOfBirth: {
            type: Date,
            required: [function () { return this.status !== "Draft"; }, "חובה להזין תאריך לידה"],
        },
        city: {
            type: String,
            required: [function () { return this.status !== "Draft"; }, "חובה להזין עיר מגורים"],
            trim: true
        },
        address: {
            type: String,
            required: [function () { return this.status !== "Draft"; }, "חובה להזין כתובת מגורים"],
            trim: true
        },
        mobilePhone: {
            type: String,
            required: [function () { return this.status !== "Draft"; }, "חובה להזין מספר טלפון נייד"],
            trim: true,
            // ולידציה לנייד ישראלי (תומך בפורמט עם או בלי מקף, למשל: 0501234567 או 050-1234567)
            match: [/^05\d-?\d{7}$/, "מספר הטלפון הנייד אינו תקין"]
        },
        landlinePhone: {
            type: String,
            trim: true,
            // ולידציה לטלפון קווי ישראלי (למשל: 021234567, 03-1234567 וכדומה)
            match: [/^0[23489]-?\d{7}$|^07\d-?\d{7}$/, "מספר הטלפון הקווי אינו תקין"]
        },
        studentIdCardUrl: {
            type: String,
            required: [function () { return this.status !== "Draft"; }, "חובה להעלות צילום תעודת זהות וספח של הסטודנט"],
            trim: true
        }
    },
    familyInfo: {
        father: {
            tz: {
                type: String,
                required: [function () { return this.status !== "Draft"; }, "חובה להזין תעודת זהות של האב"],
                match: [/^\d{9}$/, "תעודת זהות של האב חייבת להכיל 9 ספרות בדיוק"], // הוספת בדיקה לאב
                trim: true
            },
            firstname: { type: String, required: [function () { return this.status !== "Draft"; }, "חובה להזין שם אב"], trim: true },
            lastname: { type: String, required: [function () { return this.status !== "Draft"; }, "חובה להזין שם משפחה של האב"], trim: true }
        },
        mother: {
            tz: {
                type: String,
                required: [function () { return this.status !== "Draft"; }, "חובה להזין תעודת זהות של האם"],
                match: [/^\d{9}$/, "תעודת זהות של האם חייבת להכיל 9 ספרות בדיוק"], // הוספת בדיקה לאם
                trim: true
            },
            firstname: { type: String, required: [function () { return this.status !== "Draft"; }, "חובה להזין שם אם"], trim: true },
            lastname: { type: String, required: [function () { return this.status !== "Draft"; }, "חובה להזין שם משפחה של האם"], trim: true }
        },
        siblingsUnder18: {
            type: Number,
            required: [function () { return this.status !== "Draft"; }, "חובה להזין מספר אחים מתחת לגיל 18"],
            min: [0, "מספר אחים לא יכול להיות מספר שלילי"],
            default: undefined
        },
        siblingsAbove21WithKids: {
            type: Number,
            required: [function () { return this.status !== "Draft"; }, "חובה להזין מספר אחים נשואים מעל גיל 21 שיש להם יותר מילד אחד"],
            min: [0, "מספר אחים לא יכול להיות מספר שלילי"],
            default: undefined
        },
        parentsIdCardsUrls: {
            type: [String],
            validate: {
                validator: function (v) {
                    if (this.status === "Draft") return true;
                    return Array.isArray(v) && v.length > 0;
                },
                message: "חובה להעלות צילום תעודת זהות וספח של ההורים"
            }
        }
    },
    educationInfo: {
        major: {
            type: String,
            required: [function () { return this.status !== "Draft"; }, "חובה לבחור מגמת לימוד"],
            enum: { // תיקון: עטיפת ה-enum במבנה הנכון של Mongoose להודעות דינמיות
                values: MAJORS,
                message: 'המגמה "{VALUE}" אינה קיימת במערכת'
            },
            trim: true
        },
        institutionName: {
            type: String,
            required: [function () { return this.status !== "Draft"; }, "חובה להזין את שם מוסד הלימוד"],
            trim: true
        },
        educationYears: {
            type: Number,
            required: [function () { return this.status !== "Draft"; }, "חובה להזין את מספר שנות הלימוד"],
            min: [0, "מספר שנות הלימוד לא יכול להיות שלילי"]
        },
        annualTuition: {
            type: Number,
            required: [function () { return this.status !== "Draft"; }, "חובה להזין את גובה שכר הלימוד השנתי"],
            min: [0, "שכר הלימוד השנתי לא יכול להיות שלילי"]
        },
        enrollmentCertificateUrl: {
            type: String,
            required: [function () { return this.status !== "Draft"; }, "חובה להעלות אישור לימודים בתוקף"],
            trim: true
        }
    },
    bankInfo: {
        accountHolderId: {
            type: String,
            required: [function () { return this.status !== "Draft"; }, "חובה להזין תעודת זהות של בעל החשבון"],
            trim: true,
            match: [/^\d{9}$/, "תעודת זהות של בעל החשבון חייבת להכיל 9 ספרות בדיוק"]
        },
        accountHolderName: {
            type: String,
            required: [function () { return this.status !== "Draft"; }, "חובה להזין את שם בעל החשבון"],
            trim: true
        },
        bankName: {
            type: String,
            required: [function () { return this.status !== "Draft"; }, "חובה לבחור בנק מהרשימה"],
            enum: {
                values: ALLOWED_BANKS,
                message: 'הבנק שבחרת אינו מופיע ברשימת הבנקים המורשים'
            },
            trim: true
        },
        branchNumber: {
            type: String,
            required: [function () { return this.status !== "Draft"; }, "חובה להזין מספר סניף"],
            trim: true,
            match: [/^\d+$/, "מספר סניף חייב להכיל ספרות בלבד"]
        },
        accountNumber: {
            type: String,
            required: [function () { return this.status !== "Draft"; }, "חובה להזין מספר חשבון בנק"],
            trim: true,
            match: [/^\d+$/, "מספר חשבון חייב להכיל ספרות בלבד"]
        },
        bankAccountConfirmationUrl: {
            type: String,
            required: [function () { return this.status !== "Draft"; }, "חובה להעלות אישור ניהול חשבון או צילום צ'ק מבוטל"],
            trim: true
        }
    }
}, { timestamps: true });
export const Request = mongoose.models.Request || mongoose.model('Request', requestSchema);
