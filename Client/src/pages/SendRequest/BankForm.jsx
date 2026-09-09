import FileInput from '../../components/FileInput.jsx';
import { ALLOWED_BANKS } from '../../constants/options.js';

export default function BankForm({ value, onChange, file, onFile, errors = {} }) {
  const handle = (e) => onChange({ [e.target.name]: e.target.value });
  const cls = (name) => `input${errors[name] ? ' input-error' : ''}`;

  return (
    <div>
      <h3>פרטי חשבון בנק</h3>

      <div className="form-grid">
        <div className="field">
          <label htmlFor="accountHolderId">ת.ז. בעל החשבון</label>
          <input className={cls('accountHolderId')} id="accountHolderId" name="accountHolderId" value={value.accountHolderId || ''} onChange={handle} maxLength={9} />
          {errors.accountHolderId && <div className="error">{errors.accountHolderId}</div>}
        </div>
        <div className="field">
          <label htmlFor="accountHolderName">שם בעל החשבון</label>
          <input className={cls('accountHolderName')} id="accountHolderName" name="accountHolderName" value={value.accountHolderName || ''} onChange={handle} />
          {errors.accountHolderName && <div className="error">{errors.accountHolderName}</div>}
        </div>
      </div>

      <div className="field">
        <label htmlFor="bankName">בנק</label>
        <select className={cls('bankName')} id="bankName" name="bankName" value={value.bankName || ''} onChange={handle}>
          <option value="">בחר/י בנק...</option>
          {ALLOWED_BANKS.map((b) => <option key={b} value={b}>{b}</option>)}
        </select>
        {errors.bankName && <div className="error">{errors.bankName}</div>}
      </div>

      <div className="form-grid">
        <div className="field">
          <label htmlFor="branchNumber">מספר סניף</label>
          <input className={cls('branchNumber')} id="branchNumber" name="branchNumber" value={value.branchNumber || ''} onChange={handle} />
          {errors.branchNumber && <div className="error">{errors.branchNumber}</div>}
        </div>
        <div className="field">
          <label htmlFor="accountNumber">מספר חשבון</label>
          <input className={cls('accountNumber')} id="accountNumber" name="accountNumber" value={value.accountNumber || ''} onChange={handle} />
          {errors.accountNumber && <div className="error">{errors.accountNumber}</div>}
        </div>
      </div>

      <FileInput
        label="אישור ניהול חשבון / צ'ק מבוטל"
        file={file}
        existingUrl={value.bankAccountConfirmationUrl}
        onChange={onFile}
        error={errors.bankAccountConfirmationUrl}
      />
    </div>
  );
}
