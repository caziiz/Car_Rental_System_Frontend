import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AnimatedPage from "../components/AnimatedPage";
import { useAuth } from "../Context/AuthContext";
import StatCard from "../components/StatCard";
import PageHeader from "../components/Pageheader";
import ActionButtons from "../components/Actionbuttons";
import AddButton from "../components/Addbutton";
import Badge from "../components/Badge";
import ConfirmModal from "../components/ConfirmModal";
import SearchInput from "../components/SearchInput";
import api from "../Services/api";
import {
  IconUsers, IconList,
  IconUserCheck, IconShieldCheck, IconMail, IconCalendar,
} from "@tabler/icons-react";

function Users() {
  const [users_data, setUsers_data] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [confirmId, setConfirmId]   = useState(null); // userId pending delete
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();

  const loadUsersData = async () => {
    try {
      const response = await api.get(`/Users`);
      if (response.data.status) setUsers_data(response.data.data);
    } catch (error) { console.error("Error loading users data:", error); }
  };

  const requestDelete = (userId) => {
    if (userId === currentUser?.userId) {
      alert("You cannot delete your own account while logged in.");
      return;
    }
    setConfirmId(userId);
  };

  const confirmDelete = async () => {
    const userId = confirmId;
    setConfirmId(null);
    try {
      const response = await api.delete(
        `/Users/${userId}?requestedBy=${currentUser.userId}`
      );
      if (response.data.status) { alert("User deleted successfully!"); loadUsersData(); }
      else alert(response.data.message || "Failed to delete user");
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to delete user");
    }
  };

  useEffect(() => { loadUsersData(); }, []);

  const activeUsers   = users_data.filter((u) => u.isActive).length;
  const adminUsers    = users_data.filter((u) => u.role === "Admin").length;
  const filteredUsers = users_data.filter(
    (user) =>
      user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AnimatedPage>
      <div className="min-h-screen bg-slate-100 dark:bg-zinc-900 p-4 sm:p-6">

        {/* Header */}
        <PageHeader title="User Management" icon={IconUsers} />

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <StatCard label="Total Users"  value={users_data.length}  icon={IconUsers}       iconColor="text-blue-500" />
          <StatCard label="Active Users" value={activeUsers}        icon={IconUserCheck}   iconColor="text-green-500" valueColor="text-green-600" />
          <StatCard label="Admins"       value={adminUsers}         icon={IconShieldCheck} iconColor="text-red-500"   valueColor="text-red-600" />
        </div>

        {/* Users Table */}
        <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-lg overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 px-5 sm:px-6 py-4 border-b bg-slate-50 dark:bg-zinc-900 dark:border-zinc-700">
            <div className="flex items-center gap-2">
              <IconList size={22} className="text-blue-600" />
              <h2 className="font-semibold text-lg text-gray-800 dark:text-white">
                Users List <span className="ml-2 text-sm font-normal text-gray-400 dark:text-zinc-500">({filteredUsers.length})</span>
              </h2>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <SearchInput value={searchTerm} onChange={setSearchTerm} placeholder="Search by name or email..." />
              <AddButton label="Add User" to="/add-user" />
            </div>
          </div>

          {/* Desktop Table */}
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
                      <Badge label={user.role} color={user.role === "Admin" ? "red" : "green"} />
                    </td>
                    <td className="px-5 py-4">
                      <Badge label={user.isActive ? "Active" : "Inactive"} color={user.isActive ? "green" : "red"} />
                    </td>
                    <td className="px-5 py-4 text-gray-600 dark:text-zinc-300">{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td className="px-5 py-4">
                      <ActionButtons
                        onEdit={() => navigate(`/edit-user/${user.userId}`)}
                        onDelete={() => requestDelete(user.userId)}
                        showDelete={user.userId !== currentUser?.userId}
                      />
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan="7" className="text-center py-10 text-gray-500 dark:text-zinc-400">No users match your search.</td></tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
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
                        <Badge label={user.role} color={user.role === "Admin" ? "red" : "green"} />
                        <Badge label={user.isActive ? "Active" : "Inactive"} color={user.isActive ? "green" : "red"} />
                      </div>
                    </div>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-zinc-300"><IconMail size={16} className="text-gray-400 flex-shrink-0" /><span className="truncate">{user.email}</span></div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-zinc-300"><IconCalendar size={16} className="text-gray-400 flex-shrink-0" /><span>{new Date(user.createdAt).toLocaleDateString()}</span></div>
                    </div>
                    <ActionButtons
                      onEdit={() => navigate(`/edit-user/${user.userId}`)}
                      onDelete={() => requestDelete(user.userId)}
                      showDelete={user.userId !== currentUser?.userId}
                    />
                  </div>
                ))}
              </div>
            ) : <div className="text-center py-10 text-gray-500 dark:text-zinc-400">No users match your search.</div>}
          </div>

        </div>

        <ConfirmModal
          isOpen={confirmId !== null}
          title="Delete User"
          message="Are you sure you want to delete this user? This cannot be undone."
          onConfirm={confirmDelete}
          onCancel={() => setConfirmId(null)}
        />
      </div>
    </AnimatedPage>
  );
}

export default Users;