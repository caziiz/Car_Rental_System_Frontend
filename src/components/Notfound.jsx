import { useNavigate } from "react-router-dom";
import { IconError404, IconArrowLeft } from "@tabler/icons-react";

function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-lg p-12 text-center max-w-md">
        <div className="flex justify-center mb-4 text-blue-600">
          <IconError404 size={80} />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Page Not Found</h1>
        <p className="text-gray-500 mb-6">Oops! The page you are looking for does not exist.</p>
        <button
          onClick={() => navigate("/users")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 mx-auto transition"
        >
          <IconArrowLeft size={18} />
          Go Back Home
        </button>
      </div>
    </div>
  );
}

export default NotFound;