import FileInput from '../../components/FileInput.jsx';

export default function FamilyForm({ value, onChange, files, onFiles, errors = {} }) {
  const handleParent = (parent, field, val) => {
    onChange({ [parent]: { ...value[parent], [field]: val } });
  };
  const handleField = (e) => onChange({ [e.target.name]: e.target.value });

  const setParentFile = (index, file) => {
    const next = [...files];
    next[index] = file;
    onFiles(next);
  };

  const fatherErr = errors.father || {};
  const motherErr = errors.mother || {};
  const cls = (e) => `input${e ? ' input-error' : ''}`;

  return (
    <div>
      <h3>פרטי משפחה</h3>

      <fieldset className="group">
        <legend>האב</legend>
        <div className="form-grid">
          <div className="field">
            <label>תעודת זהות</label>
            <input className={cls(fatherErr.tz)} value={value.father?.tz || ''} onChange={(e) => handleParent('father', 'tz', e.target.value)} maxLength={9} />
            {fatherErr.tz && <div className="error">{fatherErr.tz}</div>}
          </div>
          <div className="field">
            <label>שם פרטי</label>
            <input className={cls(fatherErr.firstname)} value={value.father?.firstname || ''} onChange={(e) => handleParent('father', 'firstname', e.target.value)} />
            {fatherErr.firstname && <div className="error">{fatherErr.firstname}</div>}
          </div>
          <div className="field">
            <label>שם משפחה</label>
            <input className={cls(fatherErr.lastname)} value={value.father?.lastname || ''} onChange={(e) => handleParent('father', 'lastname', e.target.value)} />
            {fatherErr.lastname && <div className="error">{fatherErr.lastname}</div>}
          </div>
        </div>
      </fieldset>

      <fieldset className="group">
        <legend>האם</legend>
        <div className="form-grid">
          <div className="field">
            <label>תעודת זהות</label>
            <input className={cls(motherErr.tz)} value={value.mother?.tz || ''} onChange={(e) => handleParent('mother', 'tz', e.target.value)} maxLength={9} />
            {motherErr.tz && <div className="error">{motherErr.tz}</div>}
          </div>
          <div className="field">
            <label>שם פרטי</label>
            <input className={cls(motherErr.firstname)} value={value.mother?.firstname || ''} onChange={(e) => handleParent('mother', 'firstname', e.target.value)} />
            {motherErr.firstname && <div className="error">{motherErr.firstname}</div>}
          </div>
          <div className="field">
            <label>שם משפחה</label>
            <input className={cls(motherErr.lastname)} value={value.mother?.lastname || ''} onChange={(e) => handleParent('mother', 'lastname', e.target.value)} />
            {motherErr.lastname && <div className="error">{motherErr.lastname}</div>}
          </div>
        </div>
      </fieldset>

      <div className="form-grid">
        <div className="field">
          <label htmlFor="siblingsUnder18">מספר אחים מתחת לגיל 18</label>
          <input className={cls(errors.siblingsUnder18)} id="siblingsUnder18" type="number" min="0" name="siblingsUnder18"
            value={value.siblingsUnder18 ?? ''} onChange={handleField} />
          {errors.siblingsUnder18 && <div className="error">{errors.siblingsUnder18}</div>}
        </div>
        <div className="field">
          <label htmlFor="siblingsAbove21WithKids">אחים מעל גיל 21 עם יותר מילד אחד</label>
          <input className={cls(errors.siblingsAbove21WithKids)} id="siblingsAbove21WithKids" type="number" min="0" name="siblingsAbove21WithKids"
            value={value.siblingsAbove21WithKids ?? ''} onChange={handleField} />
          {errors.siblingsAbove21WithKids && <div className="error">{errors.siblingsAbove21WithKids}</div>}
        </div>
      </div>

      <div className="form-grid">
        <FileInput
          label="ת.ז. + ספח - הורה 1"
          file={files[0]}
          existingUrl={value.parentsIdCardsUrls?.[0]}
          onChange={(f) => setParentFile(0, f)}
          error={errors.parentsIdCardsUrls}
        />
        <FileInput
          label="ת.ז. + ספח - הורה 2"
          file={files[1]}
          existingUrl={value.parentsIdCardsUrls?.[1]}
          onChange={(f) => setParentFile(1, f)}
        />
      </div>
    </div>
  );
}
