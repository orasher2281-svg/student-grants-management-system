# Client - מערכת מענקים לסטודנטים (React)

## הרצה

```
cd client
npm install
npm run dev
```

האפליקציה תרוץ על `http://localhost:5173` ותתקשר עם השרת ב-`http://localhost:5555`
(הכתובת מוגדרת בקובץ `src/api/axios.js`, משתנה `API_BASE`).

יש להריץ את שרת ה-Node.js במקביל (`npm run dev` בתיקיית השרת), כולל חיבור ל-MongoDB.

## מבנה הפרויקט

```
src/
  api/axios.js          קליינט axios עם הזרקת טוקן אוטומטית מ-localStorage
  context/AuthContext.jsx   מצב התחברות גלובלי (login / register / logout / loginByToken)
  constants/options.js     רשימות המגמות והבנקים, תואמות בדיוק ל-constants.js בשרת
  components/              Navbar, Stepper, StatusBadge, ProtectedRoute, AdminRoute
  pages/
    Home, Login, Register, ViewStatus
    SendRequest/            הטופס הרב-שלבי: PersonalForm, FamilyForm, CourseForm, BankForm, Verify
    Admin/                  ViewRequests (טבלה + סינון/מיון), RequestDetails (אישור/דחייה + צפייה בקבצים)
```

## ⚠️ הערה - מתודת ה-HTTP בנתיב עדכון הסטטוס

ב-`Api/routers/request.js` יש כיום:

```js
router.get('/changeStatus/:requestId', checkAdmin, updateRequestStatus);
router.get('/getRequestDetails/:requestId', checkAdmin, getRequestDetails);
```

`updateRequestStatus` קורא את הסטטוס מ-`req.body`, אבל בקשות **GET** לא אמורות
(ולרוב גם לא יכולות, ב-`fetch`/`axios`) לשאת body - כך שהעדכון לא יעבוד.
יש לשנות רק את המתודה של אותה שורה ל-**PUT**:

```js
router.put('/changeStatus/:requestId', checkAdmin, updateRequestStatus);
```

שורת `getRequestDetails` יכולה להישאר GET כמו שהיא - היא רק קוראת נתונים.

הקליינט כבר קורא לנתיבים הנכונים:
- `GET /request/getRequestDetails/:requestId` - שליפת פרטי הבקשה
- `PUT /request/changeStatus/:requestId` עם `{ status }` בגוף הבקשה - אישור/דחייה

## הערה נוספת - שדות בטבלת הבקשות

ב-`getUnapprovedRequests` ה-`select` כתוב כ-
`"personalInfo.tz personalInfo.lastName personalInfo.firstName educationInfo.major status"`,
אך בסכמה (`models/request.js`) השדות נקראים `firstname` / `lastname` (אות קטנה).
כיום זה גורם לכך שהשם הפרטי ושם המשפחה לא חוזרים בפועל מהשרת לרשימת הבקשות.
הקליינט מתמודד עם זה (מציג "—" אם השם לא קיים), אבל מומלץ לתקן בשרת ל-
`"personalInfo.tz personalInfo.lastname personalInfo.firstname educationInfo.major status"`.
