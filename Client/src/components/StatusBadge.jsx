import { STATUS_LABELS } from '../constants/options.js';

const CLASS_MAP = {
  Draft: 'draft',
  Pending: 'pending',
  Approved: 'approved',
  Rejected: 'rejected'
};

const ICONS = {
  Draft: <path d="M4 11h8M4 7h8M4 3h5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />,
  Pending: <path d="M7 3v4l2.5 2.5M13 7A6 6 0 1 1 1 7a6 6 0 0 1 12 0z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />,
  Approved: <path d="M2 7.5l3.2 3.2L12 3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />,
  Rejected: <path d="M3 3l8 8M11 3l-8 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
};

export default function StatusBadge({ status }) {
  const cls = CLASS_MAP[status] || 'draft';
  const label = STATUS_LABELS[status] || status;
  return (
    <span className={`stamp ${cls}`}>
      <svg viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg">{ICONS[status] || ICONS.Draft}</svg>
      {label}
    </span>
  );
}
