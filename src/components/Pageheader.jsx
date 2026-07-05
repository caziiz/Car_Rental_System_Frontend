// components/PageHeader.jsx
// Reusable blue gradient page header used across all pages

function PageHeader({ title, icon: Icon, subtitle, rightContent }) {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-lg p-5 sm:p-6 mb-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center justify-center md:justify-start gap-3 text-white">
          {Icon && <Icon size={30} className="flex-shrink-0" />}
          <div>
            {subtitle && <p className="text-blue-200 text-sm">{subtitle}</p>}
            <h1 className="text-2xl sm:text-3xl font-bold text-white">{title}</h1>
          </div>
        </div>
        {rightContent && (
          <div className="text-blue-200 text-sm text-center md:text-right">
            {rightContent}
          </div>
        )}
      </div>
    </div>
  );
}

export default PageHeader;