export default function Range({ className = "", ...props }) {
  return (
    <input
      type="range"
      className={"accent-white " + className}
      {...props}
    />
  );
}
