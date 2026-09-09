// כל הביטויים הרגולריים והכללים כאן מועתקים בדיוק מ-Api/models/request.js ו-Api/models/user.js בשרת.
// המטרה: לתפוס שגיאות בצד הלקוח לפני השליחה, כדי שמה שמגיע לשרת יעבור תמיד.

export const TZ_REGEX = /^\d{9}$/;
export const MOBILE_REGEX = /^05\d-?\d{7}$/;
export const LANDLINE_REGEX = /^0[23489]-?\d{7}$|^07\d-?\d{7}$/;
export const DIGITS_ONLY_REGEX = /^\d+$/;
export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const req = (v) => v === undefined || v === null || String(v).trim() === '';

// ===== הרשמה / התחברות (תואם Api/models/user.js) =====
export function validateRegister(form) {
  const e = {};
  if (req(form.tz)) e.tz = 'חובה להזין תעודת זהות';
  else if (!TZ_REGEX.test(form.tz)) e.tz = 'תעודת זהות חייבת להכיל 9 ספרות בדיוק';

  if (req(form.firstname)) e.firstname = 'חובה להזין שם פרטי';
  if (req(form.lastname)) e.lastname = 'חובה להזין שם משפחה';

  if (req(form.email)) e.email = 'חובה להזין דוא"ל';
  else if (!EMAIL_REGEX.test(form.email)) e.email = 'כתובת דוא"ל אינה תקינה';

  if (req(form.password)) e.password = 'חובה להזין סיסמה';

  return e;
}

export function validateLogin(form) {
  const e = {};
  if (req(form.tz)) e.tz = 'חובה להזין תעודת זהות';
  else if (!TZ_REGEX.test(form.tz)) e.tz = 'תעודת זהות חייבת להכיל 9 ספרות בדיוק';
  if (req(form.password)) e.password = 'חובה להזין סיסמה';
  return e;
}

// ===== שלבי טופס הבקשה (תואם Api/models/request.js, required מותנה ב-status !== "Draft") =====

export function validatePersonal(p = {}, file) {
  const e = {};
  if (req(p.dateOfBirth)) e.dateOfBirth = 'חובה להזין תאריך לידה';
  if (req(p.city)) e.city = 'חובה להזין עיר מגורים';
  if (req(p.address)) e.address = 'חובה להזין כתובת מגורים';

  if (req(p.mobilePhone)) e.mobilePhone = 'חובה להזין מספר טלפון נייד';
  else if (!MOBILE_REGEX.test(p.mobilePhone)) e.mobilePhone = 'מספר הטלפון הנייד אינו תקין';

  if (!req(p.landlinePhone) && !LANDLINE_REGEX.test(p.landlinePhone)) {
    e.landlinePhone = 'מספר הטלפון הקווי אינו תקין';
  }

  if (!file && req(p.studentIdCardUrl)) {
    e.studentIdCardUrl = 'חובה להעלות צילום תעודת זהות וספח של הסטודנט';
  }
  return e;
}

export function validateFamily(f = {}, parentFiles = []) {
  const e = { father: {}, mother: {} };

  if (req(f.father?.tz)) e.father.tz = 'חובה להזין תעודת זהות של האב';
  else if (!TZ_REGEX.test(f.father.tz)) e.father.tz = 'תעודת זהות של האב חייבת להכיל 9 ספרות בדיוק';
  if (req(f.father?.firstname)) e.father.firstname = 'חובה להזין שם אב';
  if (req(f.father?.lastname)) e.father.lastname = 'חובה להזין שם משפחה של האב';

  if (req(f.mother?.tz)) e.mother.tz = 'חובה להזין תעודת זהות של האם';
  else if (!TZ_REGEX.test(f.mother.tz)) e.mother.tz = 'תעודת זהות של האם חייבת להכיל 9 ספרות בדיוק';
  if (req(f.mother?.firstname)) e.mother.firstname = 'חובה להזין שם אם';
  if (req(f.mother?.lastname)) e.mother.lastname = 'חובה להזין שם משפחה של האם';

  if (req(f.siblingsUnder18)) e.siblingsUnder18 = 'חובה להזין מספר אחים מתחת לגיל 18';
  else if (Number(f.siblingsUnder18) < 0) e.siblingsUnder18 = 'מספר אחים לא יכול להיות מספר שלילי';

  if (req(f.siblingsAbove21WithKids)) e.siblingsAbove21WithKids = 'חובה להזין מספר אחים נשואים מעל גיל 21 שיש להם יותר מילד אחד';
  else if (Number(f.siblingsAbove21WithKids) < 0) e.siblingsAbove21WithKids = 'מספר אחים לא יכול להיות מספר שלילי';

  const hasExisting = Array.isArray(f.parentsIdCardsUrls) && f.parentsIdCardsUrls.length > 0;
  const hasNew = Array.isArray(parentFiles) && parentFiles.some(Boolean);
  if (!hasExisting && !hasNew) {
    e.parentsIdCardsUrls = 'חובה להעלות צילום תעודת זהות וספח של ההורים';
  }

  if (Object.keys(e.father).length === 0) delete e.father;
  if (Object.keys(e.mother).length === 0) delete e.mother;
  return e;
}

export function validateCourse(c = {}, file) {
  const e = {};
  if (req(c.major)) e.major = 'חובה לבחור מגמת לימוד';
  if (req(c.institutionName)) e.institutionName = 'חובה להזין את שם מוסד הלימוד';

  if (req(c.educationYears)) e.educationYears = 'חובה להזין את מספר שנות הלימוד';
  else if (Number(c.educationYears) < 0) e.educationYears = 'מספר שנות הלימוד לא יכול להיות שלילי';

  if (req(c.annualTuition)) e.annualTuition = 'חובה להזין את גובה שכר הלימוד השנתי';
  else if (Number(c.annualTuition) < 0) e.annualTuition = 'שכר הלימוד השנתי לא יכול להיות שלילי';

  if (!file && req(c.enrollmentCertificateUrl)) {
    e.enrollmentCertificateUrl = 'חובה להעלות אישור לימודים בתוקף';
  }
  return e;
}

export function validateBank(b = {}, file) {
  const e = {};
  if (req(b.accountHolderId)) e.accountHolderId = 'חובה להזין תעודת זהות של בעל החשבון';
  else if (!TZ_REGEX.test(b.accountHolderId)) e.accountHolderId = 'תעודת זהות של בעל החשבון חייבת להכיל 9 ספרות בדיוק';

  if (req(b.accountHolderName)) e.accountHolderName = 'חובה להזין את שם בעל החשבון';
  if (req(b.bankName)) e.bankName = 'חובה לבחור בנק מהרשימה';

  if (req(b.branchNumber)) e.branchNumber = 'חובה להזין מספר סניף';
  else if (!DIGITS_ONLY_REGEX.test(b.branchNumber)) e.branchNumber = 'מספר סניף חייב להכיל ספרות בלבד';

  if (req(b.accountNumber)) e.accountNumber = 'חובה להזין מספר חשבון בנק';
  else if (!DIGITS_ONLY_REGEX.test(b.accountNumber)) e.accountNumber = 'מספר חשבון חייב להכיל ספרות בלבד';

  if (!file && req(b.bankAccountConfirmationUrl)) {
    e.bankAccountConfirmationUrl = 'חובה להעלות אישור ניהול חשבון או צילום צ\'ק מבוטל';
  }
  return e;
}

/** וולידציה מלאה לכל ארבעת השלבים (לפני הגשה סופית) */
export function validateFullRequest(data, files) {
  return {
    personalInfo: validatePersonal(data.personalInfo, files.studentIdCard),
    familyInfo: validateFamily(data.familyInfo, files.parentsIdCards),
    educationInfo: validateCourse(data.educationInfo, files.enrollmentCertificate),
    bankInfo: validateBank(data.bankInfo, files.bankAccountConfirmation)
  };
}

/** בדיקה רקורסיבית האם יש שגיאה כלשהי בתוך אובייקט שגיאות */
export function hasAnyError(errorsObj) {
  if (!errorsObj) return false;
  return Object.values(errorsObj).some((v) => {
    if (v && typeof v === 'object') return hasAnyError(v);
    return Boolean(v);
  });
}
