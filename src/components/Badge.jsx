// components/Badge.jsx
// Reusable pill badge used across all pages for roles, statuses, categories

const colorMap = {
  green:  "bg-green-100 text-green-700",
  red:    "bg-red-100 text-red-700",
  blue:   "bg-blue-100 text-blue-700",
  orange: "bg-orange-100 text-orange-700",
  indigo: "bg-indigo-100 text-indigo-700",
  gray:   "bg-gray-100 text-gray-700",
};

function Badge({ label, color = "gray" }) {
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${colorMap[color]}`}>
      {label}
    </span>
  );
}

export default Badge;