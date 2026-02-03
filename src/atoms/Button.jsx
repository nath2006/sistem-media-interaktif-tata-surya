export default function Button({ children, className = "", ...props }) {
  return (
    <button
      {...props}
      className={
        "rounded-xl bg-white/10 px-3 py-2 text-sm text-white " +
        "hover:bg-white/15 active:bg-white/20 transition " +
        "border border-white/10 " +
        className
      }
    >
      {children}
    </button>
  );
}
