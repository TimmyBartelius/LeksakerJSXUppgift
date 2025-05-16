export default function TextField({
  label,
  value,
  onChange,
  placeholder,
  error,
}) {
  return (
    <div style={{ marginBottom: "0.5rem" }}>
      <label style={{ display: "block", fontWeight: "bold" }}>{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{ borderColor: error ? "red" : "#ccc" }}
      />
      {error && (
        <p style={{ color: "red", margin: 0, fontSize: "0.8rem" }}>{error}</p>
      )}
    </div>
  );
}
