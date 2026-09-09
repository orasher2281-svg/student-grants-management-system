export default function Loader({ label = 'טוען...' }) {
  return (
    <div className="loader-wrap">
      <span className="loader-ring" />
      <span className="loader-label">{label}</span>
    </div>
  );
}
