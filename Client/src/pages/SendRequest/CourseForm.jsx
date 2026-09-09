import FileInput from '../../components/FileInput.jsx';
import { MAJORS } from '../../constants/options.js';

export default function CourseForm({ value, onChange, file, onFile, errors = {} }) {
  const handle = (e) => onChange({ [e.target.name]: e.target.value });
  const cls = (name) => `input${errors[name] ? ' input-error' : ''}`;

  return (
    <div>
      <h3>פרטי לימודים</h3>

      <div className="field">
        <label htmlFor="major">מגמת לימוד</label>
        <select className={cls('major')} id="major" name="major" value={value.major || ''} onChange={handle}>
          <option value="">בחר/י מגמה...</option>
          {MAJORS.map((m) => <option key={m} value={m}>{m}</option>)}
        </select>
        {errors.major && <div className="error">{errors.major}</div>}
      </div>

      <div className="field">
        <label htmlFor="institutionName">שם מוסד הלימודים</label>
        <input className={cls('institutionName')} id="institutionName" name="institutionName" value={value.institutionName || ''} onChange={handle} />
        {errors.institutionName && <div className="error">{errors.institutionName}</div>}
      </div>

      <div className="form-grid">
        <div className="field">
          <label htmlFor="educationYears">מספר שנות לימוד</label>
          <input className={cls('educationYears')} id="educationYears" type="number" min="0" name="educationYears" value={value.educationYears ?? ''} onChange={handle} />
          {errors.educationYears && <div className="error">{errors.educationYears}</div>}
        </div>
        <div className="field">
          <label htmlFor="annualTuition">שכר לימוד שנתי (₪)</label>
          <input className={cls('annualTuition')} id="annualTuition" type="number" min="0" name="annualTuition" value={value.annualTuition ?? ''} onChange={handle} />
          {errors.annualTuition && <div className="error">{errors.annualTuition}</div>}
        </div>
      </div>

      <FileInput
        label="אישור לימודים בתוקף"
        file={file}
        existingUrl={value.enrollmentCertificateUrl}
        onChange={onFile}
        error={errors.enrollmentCertificateUrl}
      />
    </div>
  );
}
