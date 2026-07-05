// components/ActionButtons.jsx
// Reusable edit + delete button pair used in every data table

import { IconEdit, IconTrash } from "@tabler/icons-react";

function ActionButtons({ onEdit, onDelete, showEdit = true, showDelete = true }) {
  return (
    <div className="flex justify-center gap-2">
      {showEdit && (
        <button
          onClick={onEdit}
          className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg transition shadow-sm"
        >
          <IconEdit size={18} />
        </button>
      )}
      {showDelete && (
        <button
          onClick={onDelete}
          className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition shadow-sm"
        >
          <IconTrash size={18} />
        </button>
      )}
    </div>
  );
}

export default ActionButtons;