export default function Loading() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex items-center justify-center gap-3 py-24 text-muted"
    >
      <span
        aria-hidden="true"
        className="h-6 w-6 animate-spin rounded-full border-4 border-line border-t-brand"
      />
      <span>Loading…</span>
    </div>
  );
}