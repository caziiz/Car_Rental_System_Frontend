// components/AddButton.jsx
// Reusable "Add" button used across all list pages

import { IconPlus } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";

function AddButton({ label, to }) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(to)}
      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-all duration-200 shadow w-full sm:w-auto"
    >
      <IconPlus size={18} />
      {label}
    </button>
  );
}

export default AddButton;