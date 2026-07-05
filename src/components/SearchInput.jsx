import { IconSearch } from "@tabler/icons-react";

function SearchInput({ value, onChange, placeholder = "Search...", className = "" }) {
  return (
    <div className={`flex items-center gap-2 bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-600 rounded-lg px-3 py-2 shadow-sm w-full sm:w-72 ${className}`}>
      <IconSearch size={18} className="text-gray-400 flex-shrink-0" />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="outline-none text-sm text-gray-700 dark:text-white dark:bg-zinc-800 w-full"
      />
    </div>
  );
}

export default SearchInput;