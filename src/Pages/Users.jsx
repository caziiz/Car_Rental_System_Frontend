import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AnimatedPage from "../components/AnimatedPage";
import { useAuth } from "../Context/AuthContext";
import {
  IconUsers, IconUserPlus, IconEdit, IconTrash, IconList,
  IconUserCheck, IconShieldCheck, IconMail, IconCalendar,
} from "@tabler/icons-react";

function Users() {
  const [users_data, setUsers_data] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const API_URL = import.meta.env.VITE_API_CAR_RENTAL;

  const loadUsersData = async () => {
    try {
      const response = await axios.get(`${API_URL}/Users`);
      if (response.data.status) setUsers_data(response.data.data);
    } catch (error) { console.error("Error loading users data:", error); }
  };

  const handleDelete = async (userId) => {
    if (userId === currentUser?.userId) {
      alert("You cannot delete your own account while logged in.");
      return;
    }
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      const response = await axios.delete(
        `${API_URL}/Users/${userId}?requestedBy=${currentUser.userId}`
      );
      if (response.data.status) { alert("User deleted successfully!"); loadUsersData(); }
      else alert(response.data.message || "Failed to delete user");
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to delete user");
    }
  };

  useEffect(() => { loadUsersData(); }, []);

  const activeUsers = users_data.filter((u) => u.isActive).length;
  const adminUsers = users_data.filter((u) => u.role === "Admin").length;
  const filteredUsers = users_data.filter(
    (user) =>
      user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AnimatedPage>
      <div className="min-h-screen bg-slate-100 dark:bg-zinc-900 p-4 sm:p-6">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-lg p-5 sm:p-6 mb-6">
          <div className="flex items-center justify-center gap-3 text-white text-center">
            <IconUsers size={28} className="sm:size-[34px] flex-shrink-0" />
            <h1 className="text-2xl sm:text-3xl font-bold">User Management</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-md p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 dark:text-zinc-400 text-sm">Total Users</p>
                <h3 className="text-3xl font-bold text-gray-800 dark:text-white">{users_data.length}</h3>
              </div>
              <IconUsers size={40} className="text-blue-500" />
            </div>
          </div>
          <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-md p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 dark:text-zinc-400 text-sm">Active Users</p>
                <h3 className="text-3xl font-bold text-green-600">{activeUsers}</h3>
              </div>
              <IconUserCheck size={40} className="text-green-500" />
            </div>
          </div>
          <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-md p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 dark:text-zinc-400 text-sm">Admins</p>
                <h3 className="text-3xl font-bold text-red-600">{adminUsers}</h3>
              </div>
              <IconShieldCheck size={40} className="text-red-500" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-lg overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 px-5 sm:px-6 py-4 border-b bg-slate-50 dark:bg-zinc-900 dark:border-zinc-700">
            <div className="flex items-center gap-2">
              <IconList size={22} className="text-blue-600" />
              <h2 className="font-semibold text-lg text-gray-800 dark:text-white">
                Users List <span className="ml-2 text-sm font-normal text-gray-400 dark:text-zinc-500">({filteredUsers.length})</span>
              </h2>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <input type="text" placeholder="Search by name or email..." value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border border-gray-300 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white rounded-lg px-4 py-2 w-full sm:w-72 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <button onClick={() => navigate("/add-user")}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-all duration-200 shadow w-full sm:w-auto">
                <IconUserPlus size={18} /> Add User
              </button>
            </div>
          </div>

          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-100 dark:bg-zinc-700 text-slate-700 dark:text-zinc-300">
                  <th className="px-5 py-4 text-left font-semibold">ID</th>
                  <th className="px-5 py-4 text-left font-semibold">Full Name</th>
                  <th className="px-5 py-4 text-left font-semibold">Email</th>
                  <th className="px-5 py-4 text-left font-semibold">Role</th>
                  <th className="px-5 py-4 text-left font-semibold">Status</th>
                  <th className="px-5 py-4 text-left font-semibold">Created At</th>
                  <th className="px-5 py-4 text-center font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length > 0 ? filteredUsers.map((user) => (
                  <tr key={user.userId} className="border-b dark:border-zinc-700 hover:bg-slate-50 dark:hover:bg-zinc-700 transition">
                    <td className="px-5 py-4 dark:text-zinc-300">{user.userId}</td>
                    <td className="px-5 py-4 font-medium text-gray-800 dark:text-white">{user.fullName}</td>
                    <td className="px-5 py-4 text-gray-600 dark:text-zinc-300">{user.email}</td>
                    <td className="px-5 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${user.role === "Admin" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>{user.role}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${user.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>{user.isActive ? "Active" : "Inactive"}</span>
                    </td>
                    <td className="px-5 py-4 text-gray-600 dark:text-zinc-300">{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td className="px-5 py-4">
                      <div className="flex justify-center gap-2">
                        <button onClick={() => navigate(`/edit-user/${user.userId}`)} className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg transition shadow-sm"><IconEdit size={18} /></button>
                        {user.userId !== currentUser?.userId && (
                          <button onClick={() => handleDelete(user.userId)} className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition shadow-sm"><IconTrash size={18} /></button>
                        )}
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan="7" className="text-center py-10 text-gray-500 dark:text-zinc-400">No users match your search.</td></tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="md:hidden">
            {filteredUsers.length > 0 ? (
              <div className="divide-y divide-gray-100 dark:divide-zinc-700">
                {filteredUsers.map((user) => (
                  <div key={user.userId} className="p-4">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <p className="font-semibold text-gray-800 dark:text-white">{user.fullName}</p>
                        <p className="text-xs text-gray-400 dark:text-zinc-500">#{user.userId}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${user.role === "Admin" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>{user.role}</span>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${user.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>{user.isActive ? "Active" : "Inactive"}</span>
                      </div>
                    </div>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-zinc-300"><IconMail size={16} className="text-gray-400 flex-shrink-0" /><span className="truncate">{user.email}</span></div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-zinc-300"><IconCalendar size={16} className="text-gray-400 flex-shrink-0" /><span>{new Date(user.createdAt).toLocaleDateString()}</span></div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => navigate(`/edit-user/${user.userId}`)} className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition shadow-sm flex items-center justify-center gap-2 text-sm font-medium"><IconEdit size={16} />Edit</button>
                      {user.userId !== currentUser?.userId && (
                        <button onClick={() => handleDelete(user.userId)} className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg transition shadow-sm flex items-center justify-center gap-2 text-sm font-medium"><IconTrash size={16} />Delete</button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : <div className="text-center py-10 text-gray-500 dark:text-zinc-400">No users match your search.</div>}
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
}

export default Users;