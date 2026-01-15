export function Footer() {
  return (
    <footer
      className="
        border-t
        border-slate-200/60 dark:border-white/10
        py-10 text-center text-sm
        text-slate-600 dark:text-slate-500
        bg-white dark:bg-black
      "
    >
      © {new Date().getFullYear()} ChatScale · Distributed by design
    </footer>
  );
}
