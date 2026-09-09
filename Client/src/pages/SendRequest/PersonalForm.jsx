import FileInput from '../../components/FileInput.jsx';

export default function PersonalForm({ value, onChange, file, onFile, errors = {} }) {
  const handle = (e) => onChange({ [e.target.name]: e.target.value });
  const cls = (name) => `input${errors[name] ? ' input-error' : ''}`;

  return (
    <div>
      <h3>פרטים אישיים</h3>
      <fieldset className="group">
        <legend>פרטי המשתמש (קבועים)</legend>
        <div className="form-grid">
          <div className="field">
            <label>תעודת זהות</label>
            <input className="input" value={value.tz || ''} readOnly />
          </div>
          <div className="field">
            <label>שם פרטי</label>
            <input className="input" value={value.firstname || ''} readOnly />
          </div>
          <div className="field">
            <label>שם משפחה</label>
            <input className="input" value={value.lastname || ''} readOnly />
          </div>
        </div>
      </fieldset>

      <div className="form-grid">
        <div className="field">
          <label htmlFor="dateOfBirth">תאריך לידה</label>
          <input className={cls('dateOfBirth')} id="dateOfBirth" type="date" name="dateOfBirth"
            value={value.dateOfBirth ? value.dateOfBirth.substring(0, 10) : ''} onChange={handle} />
          {errors.dateOfBirth && <div className="error">{errors.dateOfBirth}</div>}
        </div>
        <div className="field">
          <label htmlFor="city">עיר מגורים</label>
          <input className={cls('city')} id="city" name="city" value={value.city || ''} onChange={handle} />
          {errors.city && <div className="error">{errors.city}</div>}
        </div>
      </div>

      <div className="field">
        <label htmlFor="address">כתובת מגורים</label>
        <input className={cls('address')} id="address" name="address" value={value.address || ''} onChange={handle} />
        {errors.address && <div className="error">{errors.address}</div>}
      </div>

      <div className="form-grid">
        <div className="field">
          <label htmlFor="mobilePhone">טלפון נייד</label>
          <input className={cls('mobilePhone')} id="mobilePhone" name="mobilePhone" value={value.mobilePhone || ''} onChange={handle} placeholder="050-1234567" />
          {errors.mobilePhone && <div className="error">{errors.mobilePhone}</div>}
        </div>
        <div className="field">
          <label htmlFor="landlinePhone">טלפון נייח (אופציונלי)</label>
          <input className={cls('landlinePhone')} id="landlinePhone" name="landlinePhone" value={value.landlinePhone || ''} onChange={handle} placeholder="03-1234567" />
          {errors.landlinePhone && <div className="error">{errors.landlinePhone}</div>}
        </div>
      </div>

      <FileInput
        label="צילום תעודת זהות + ספח"
        file={file}
        existingUrl={value.studentIdCardUrl}
        onChange={onFile}
        error={errors.studentIdCardUrl}
      />
    </div>
  );
}
