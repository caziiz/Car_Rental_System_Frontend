// components/StatCard.jsx
// Reusable stat card matching the Car Rental dashboard design

function StatCard({ label, value, icon: Icon, iconColor = "text-blue-500", valueColor = "text-gray-800 dark:text-white" }) {
  return (
    <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-md p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 dark:text-zinc-400 text-sm">{label}</p>
          <h3 className={`text-3xl font-bold ${valueColor}`}>{value}</h3>
        </div>
        {Icon && <Icon size={40} className={iconColor} />}
      </div>
    </div>
  );
}

export default StatCard;