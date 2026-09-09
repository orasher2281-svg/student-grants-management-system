const STEPS = [
  { key: 'personal', label: 'פרטים אישיים' },
  { key: 'family', label: 'פרטי משפחה' },
  { key: 'course', label: 'פרטי לימודים' },
  { key: 'bank', label: 'פרטי בנק' },
  { key: 'verify', label: 'אישור ושליחה' }
];

export default function Stepper({ activeIndex }) {
  const progress = (activeIndex / (STEPS.length - 1)) * 100;
  return (
    <div className="stepper">
      <div className="line-bg" />
      <div className="line-fill" style={{ '--progress': `${progress}%` }} />
      {STEPS.map((step, i) => (
        <div
          key={step.key}
          className={`step ${i === activeIndex ? 'active' : ''} ${i < activeIndex ? 'done' : ''}`}
        >
          <div className="dot">
            {i < activeIndex
              ? <svg viewBox="0 0 14 14" fill="none"><path d="M2 7.5l3.2 3.2L12 3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
              : i + 1}
          </div>
          <div className="label">{step.label}</div>
        </div>
      ))}
    </div>
  );
}

export { STEPS };
