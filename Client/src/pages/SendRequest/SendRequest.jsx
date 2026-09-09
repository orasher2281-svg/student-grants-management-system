import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUser } from '../../store/authReducer.js';
import { getUserProfile } from '../../api/authApi.js';
import { getActiveDraft, saveDraft as saveDraftApi, submitRequest as submitRequestApi } from '../../api/requestApi.js';
import Stepper from '../../components/Stepper.jsx';
import Loader from '../../components/Loader.jsx';
import PersonalForm from './PersonalForm.jsx';
import FamilyForm from './FamilyForm.jsx';
import CourseForm from './CourseForm.jsx';
import BankForm from './BankForm.jsx';
import Verify from './Verify.jsx';
import {
  validatePersonal, validateFamily, validateCourse, validateBank,
  validateFullRequest, hasAnyError
} from '../../utils/validators.js';

const EMPTY_DATA = {
  personalInfo: { tz: '', firstname: '', lastname: '', dateOfBirth: '', city: '', address: '', mobilePhone: '', landlinePhone: '', studentIdCardUrl: '' },
  familyInfo: {
    father: { tz: '', firstname: '', lastname: '' },
    mother: { tz: '', firstname: '', lastname: '' },
    siblingsUnder18: '', siblingsAbove21WithKids: '', parentsIdCardsUrls: []
  },
  educationInfo: { major: '', institutionName: '', educationYears: '', annualTuition: '', enrollmentCertificateUrl: '' },
  bankInfo: { accountHolderId: '', accountHolderName: '', bankName: '', branchNumber: '', accountNumber: '', bankAccountConfirmationUrl: '' }
};

const EMPTY_ERRORS = { personalInfo: {}, familyInfo: {}, educationInfo: {}, bankInfo: {} };

export default function SendRequest() {
  const user = useSelector(selectUser);
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [data, setData] = useState(EMPTY_DATA);
  const [files, setFiles] = useState({ studentIdCard: null, parentsIdCards: [], enrollmentCertificate: null, bankAccountConfirmation: null });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [confirmed, setConfirmed] = useState(false);
  const [errors, setErrors] = useState(EMPTY_ERRORS);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    Promise.all([
      getUserProfile(),
      getActiveDraft()
    ]).then(([profile, draftRes]) => {
      const draft = draftRes.draft;
      setData((prev) => ({
        ...prev,
        ...(draft || {}),
        personalInfo: {
          ...prev.personalInfo,
          ...(draft?.personalInfo || {}),
          tz: profile.tz,
          firstname: profile.firstname,
          lastname: profile.lastname
        },
        familyInfo: { ...prev.familyInfo, ...(draft?.familyInfo || {}) },
        educationInfo: { ...prev.educationInfo, ...(draft?.educationInfo || {}) },
        bankInfo: { ...prev.bankInfo, ...(draft?.bankInfo || {}) }
      }));
    }).catch(() => {
      setMessage({ type: 'error', text: 'לא ניתן היה לטעון את הטיוטה הקיימת' });
    }).finally(() => setLoading(false));
  }, [user]);

  const updateSection = (section, value) => {
    setData((prev) => ({ ...prev, [section]: { ...prev[section], ...value } }));
  };

  const buildFormData = () => {
    const fd = new FormData();
    fd.append('requestData', JSON.stringify(data));
    if (files.studentIdCard) fd.append('studentIdCard', files.studentIdCard);
    files.parentsIdCards.forEach((f) => f && fd.append('parentsIdCards', f));
    if (files.enrollmentCertificate) fd.append('enrollmentCertificate', files.enrollmentCertificate);
    if (files.bankAccountConfirmation) fd.append('bankAccountConfirmation', files.bankAccountConfirmation);
    return fd;
  };

  const saveDraft = async () => {
    if (!user) {
      setMessage({ type: 'info', text: 'יש להתחבר למערכת כדי לשמור טיוטה' });
      return;
    }
    setSaving(true);
    setMessage(null);
    try {
      const res = await saveDraftApi(buildFormData());
      if (res?.draft) {
        setData((prev) => ({ ...prev, ...res.draft }));
      }
      setMessage({ type: 'success', text: 'הטיוטה נשמרה בהצלחה' });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'שמירת הטיוטה נכשלה' });
    } finally {
      setSaving(false);
    }
  };

  // ולידציה של שלב בודד - רצה גם בלחיצה על "הבא" וגם כחלק מהוולידציה המלאה
  const STEP_VALIDATORS = [
    () => ({ personalInfo: validatePersonal(data.personalInfo, files.studentIdCard) }),
    () => ({ familyInfo: validateFamily(data.familyInfo, files.parentsIdCards) }),
    () => ({ educationInfo: validateCourse(data.educationInfo, files.enrollmentCertificate) }),
    () => ({ bankInfo: validateBank(data.bankInfo, files.bankAccountConfirmation) })
  ];

  const next = () => {
    if (step <= 3) {
      const stepErrors = STEP_VALIDATORS[step]();
      setErrors((prev) => ({ ...prev, ...stepErrors }));
      if (hasAnyError(stepErrors)) {
        setMessage({ type: 'error', text: 'יש לתקן את השדות המסומנים באדום לפני שממשיכים' });
        return;
      }
    }
    setMessage(null);
    setStep((s) => Math.min(s + 1, 4));
  };
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const submit = async () => {
    if (!user) {
      setMessage({ type: 'info', text: 'יש להתחבר למערכת כדי להגיש בקשה' });
      return;
    }

    const fullErrors = validateFullRequest(data, files);
    setErrors(fullErrors);
    if (hasAnyError(fullErrors)) {
      const sectionOrder = ['personalInfo', 'familyInfo', 'educationInfo', 'bankInfo'];
      const firstInvalid = sectionOrder.findIndex((key) => hasAnyError(fullErrors[key]));
      setStep(firstInvalid === -1 ? 0 : firstInvalid);
      setMessage({ type: 'error', text: 'יש שדות שלא מולאו כנדרש - מסומנים באדום. נא לתקן ולנסות שוב.' });
      return;
    }

    setSaving(true);
    setMessage(null);
    try {
      await submitRequestApi(buildFormData());
      navigate('/status');
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'הגשת הבקשה נכשלה' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="app-shell"><Loader label="טוען טופס..." /></div>;
  }

  return (
    <div className="app-shell">
      <div className="page-head">
        <div className="eyebrow">טופס מקוון</div>
        <h1>הגשת בקשה למענק</h1>
        <p className="sub">ניתן לשמור טיוטה בכל שלב ולהמשיך במועד מאוחר יותר. שדות חובה מסומנים באדום אם לא תקינים.</p>
      </div>

      {!user && (
        <div className="banner info">
          ניתן לעיין בטופס ולמלא אותו, אך כדי לשמור טיוטה או להגיש בקשה יש <b>להתחבר</b> או <b>להירשם</b> למערכת.
        </div>
      )}
      {message && <div className={`banner ${message.type}`}>{message.text}</div>}

      <Stepper activeIndex={step} />

      <div className="card">
        {step === 0 && (
          <PersonalForm
            value={data.personalInfo}
            onChange={(v) => updateSection('personalInfo', v)}
            file={files.studentIdCard}
            onFile={(f) => setFiles((p) => ({ ...p, studentIdCard: f }))}
            errors={errors.personalInfo}
          />
        )}
        {step === 1 && (
          <FamilyForm
            value={data.familyInfo}
            onChange={(v) => updateSection('familyInfo', v)}
            files={files.parentsIdCards}
            onFiles={(arr) => setFiles((p) => ({ ...p, parentsIdCards: arr }))}
            errors={errors.familyInfo}
          />
        )}
        {step === 2 && (
          <CourseForm
            value={data.educationInfo}
            onChange={(v) => updateSection('educationInfo', v)}
            file={files.enrollmentCertificate}
            onFile={(f) => setFiles((p) => ({ ...p, enrollmentCertificate: f }))}
            errors={errors.educationInfo}
          />
        )}
        {step === 3 && (
          <BankForm
            value={data.bankInfo}
            onChange={(v) => updateSection('bankInfo', v)}
            file={files.bankAccountConfirmation}
            onFile={(f) => setFiles((p) => ({ ...p, bankAccountConfirmation: f }))}
            errors={errors.bankInfo}
          />
        )}
        {step === 4 && <Verify data={data} confirmed={confirmed} onConfirmedChange={setConfirmed} />}

        <div className="btn-row">
          {step > 0 && <button className="btn btn-ghost" onClick={back} type="button">חזרה</button>}
          <button className="btn btn-outline" onClick={saveDraft} type="button" disabled={saving}>
            {saving ? 'שומר/ת...' : 'שמירת טיוטה'}
          </button>
          {step < 4 && <button className="btn btn-gold" onClick={next} type="button">הבא</button>}
          {step === 4 && (
            <>
              <button className="btn btn-danger" onClick={() => navigate('/')} type="button">ביטול</button>
              <button className="btn btn-gold" onClick={submit} type="button" disabled={saving || !confirmed}>
                {saving ? 'שולח/ת...' : 'הגשת הבקשה'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
