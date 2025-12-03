export default function Loader() {
  return (
    <div className="loader" aria-busy="true">
      {Array.from({ length: 6 }).map((_, idx) => (
        <div className="skeleton" key={idx} />
      ))}
    </div>
  );
}
