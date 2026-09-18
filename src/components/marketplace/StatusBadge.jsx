const STATUS_STYLES = {
  pending:     "bg-gray-100 text-gray-600",
  open:        "bg-green-100 text-green-700",
  in_progress: "bg-blue-100 text-blue-700",
  completed:   "bg-charcoal text-white",
  rejected:    "bg-red-100 text-red-600",
  assigned:    "bg-purple-100 text-purple-700",
};

const STATUS_LABELS = {
  pending:     "Pending",
  open:        "Open",
  in_progress: "In Progress",
  completed:   "Completed",
  rejected:    "Rejected",
  assigned:    "Assigned",
};

export default function StatusBadge({ status, className = "" }) {
  const s = status?.toLowerCase().replace(/ /g, "_") || "pending";
  return (
    <span className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-widest ${STATUS_STYLES[s] || STATUS_STYLES.pending} ${className}`}>
      {STATUS_LABELS[s] || status}
    </span>
  );
}
