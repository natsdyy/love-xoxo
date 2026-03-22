import { useState, useEffect } from 'react';
import { Users, Clock, LogOut, Plus, X, Edit2, Eye, EyeOff } from 'lucide-react';
import { toast } from 'react-toastify';
import { getAllUsers, addUserManually, updateUserProfile, updateUserPassword } from '../../lib/firebaseAuth';

interface UserData {
  id: string;
  username: string;
  displayName: string;
  role: 'admin' | 'owner';
  lastLogin: any;
  lastLoginFormatted: string;
  isActive: boolean;
  device: string;
}

function AddUserModal({ isOpen, onClose, onAdd }: { isOpen: boolean; onClose: () => void; onAdd: () => void }) {
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [password, setPassword] = useState('xzshop123');
  const [role, setRole] = useState<'admin' | 'owner'>('admin');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username || !displayName || !password) {
      setError('Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsSubmitting(true);
    try {
      await addUserManually(username, displayName, role, password);
      toast.success('✅ User added to Firebase Auth and Firestore successfully!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
      });
      setUsername('');
      setDisplayName('');
      setPassword('xzshop123');
      setRole('admin');
      setError('');
      onAdd();
      onClose();
    } catch (err: any) {
      console.error('Error adding user:', err);
      const errorMessage = err.message || 'Failed to add user';
      setError(errorMessage);
      toast.error(errorMessage, {
        position: 'top-right',
        autoClose: 3000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden border border-pink-50">
        <div className="bg-white px-8 pt-8 pb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-[#ee6996]">Add New User</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-pink-50 rounded-full text-slate-300 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 text-red-600 text-xs font-bold p-3 rounded-xl text-center border border-red-200">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
              Username <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g., admin_cherry or ownereli"
              className="w-full bg-pink-50/30 border-2 border-pink-100/30 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-[#ee6996] focus:bg-white transition-all"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
              Display Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="e.g., Cherry, Mir, Sica, Eli"
              className="w-full bg-pink-50/30 border-2 border-pink-100/30 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-[#ee6996] focus:bg-white transition-all"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
              Password <span className="text-red-500">*</span>
            </label>
            <div className="relative group">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min 6 characters"
                className="w-full bg-pink-50/30 border-2 border-pink-100/30 rounded-2xl px-4 py-3 pr-12 text-sm focus:outline-none focus:border-[#ee6996] focus:bg-white transition-all"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-pink-600 transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <p className="text-xs text-gray-400">Default: xzshop123</p>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
              Role <span className="text-red-500">*</span>
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as 'admin' | 'owner')}
              className="w-full bg-pink-50/30 border-2 border-pink-100/30 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-[#ee6996] focus:bg-white transition-all"
            >
              <option value="admin">Admin</option>
              <option value="owner">Owner</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 bg-pink-50 text-[#ee6996] rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-pink-100 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`flex-1 py-3 rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg transition-all ${
                isSubmitting
                  ? 'bg-gray-400 text-white cursor-not-allowed'
                  : 'bg-gradient-to-r from-[#ee6996] to-[#f58eb2] text-white hover:scale-[1.02] active:scale-[0.98] shadow-pink-200/50'
              }`}
            >
              {isSubmitting ? 'Adding...' : 'Add User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function EditUserModal({ isOpen, onClose, user, onEdit }: { isOpen: boolean; onClose: () => void; user: UserData | null; onEdit: () => void }) {
  const [displayName, setDisplayName] = useState('');
  const [role, setRole] = useState<'admin' | 'owner'>('admin');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName);
      setRole(user.role);
      setPassword('');
      setShowPassword(false);
      setError('');
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    setError('');

    if (!displayName) {
      setError('Display name is required');
      return;
    }

    if (password && password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsSubmitting(true);
    try {
      // Update user profile (display name and role)
      await updateUserProfile(user.id, role, displayName);
      
      // Update password if provided
      if (password) {
        await updateUserPassword(user.username, password);
      }
      
      toast.success('✅ User updated successfully!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
      });
      setError('');
      onEdit();
      onClose();
    } catch (err: any) {
      console.error('Error updating user:', err);
      const errorMessage = err.message || 'Failed to update user';
      setError(errorMessage);
      toast.error(errorMessage, {
        position: 'top-right',
        autoClose: 3000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden border border-pink-50">
        <div className="bg-white px-8 pt-8 pb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-[#ee6996]">Edit User</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-pink-50 rounded-full text-slate-300 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 text-red-600 text-xs font-bold p-3 rounded-xl text-center border border-red-200">
              {error}
            </div>
          )}

          <div className="bg-gray-50 p-4 rounded-xl text-sm text-gray-600">
            <p><span className="font-bold">Username:</span> {user.username}</p>
            <p><span className="font-bold">Email:</span> {user.username}@xoxoxz.site</p>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
              Display Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="e.g., Cherry, Mir, Sica, Eli"
              className="w-full bg-pink-50/30 border-2 border-pink-100/30 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-[#ee6996] focus:bg-white transition-all"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
              Role <span className="text-red-500">*</span>
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as 'admin' | 'owner')}
              className="w-full bg-pink-50/30 border-2 border-pink-100/30 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-[#ee6996] focus:bg-white transition-all"
            >
              <option value="admin">Admin</option>
              <option value="owner">Owner</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
              New Password (Optional)
            </label>
            <div className="relative group">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Leave empty to keep current password"
                className="w-full bg-pink-50/30 border-2 border-pink-100/30 rounded-2xl px-4 py-3 pr-12 text-sm focus:outline-none focus:border-[#ee6996] focus:bg-white transition-all"
              />
              {password && (
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-pink-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              )}
            </div>
            <p className="text-xs text-gray-400">Min 6 characters if changing password</p>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 bg-pink-50 text-[#ee6996] rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-pink-100 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`flex-1 py-3 rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg transition-all ${
                isSubmitting
                  ? 'bg-gray-400 text-white cursor-not-allowed'
                  : 'bg-gradient-to-r from-[#ee6996] to-[#f58eb2] text-white hover:scale-[1.02] active:scale-[0.98] shadow-pink-200/50'
              }`}
            >
              {isSubmitting ? 'Updating...' : 'Update User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function UsersPage() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'admins' | 'active'>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUserForEdit, setSelectedUserForEdit] = useState<UserData | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const userData = await getAllUsers();
      setUsers(userData);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user => {
    if (activeTab === 'admins') return user.role === 'admin';
    if (activeTab === 'active') return user.isActive;
    return true;
  });

  const stats = {
    totalUsers: users.length,
    totalAdmins: users.filter(u => u.role === 'admin').length,
    activeUsers: users.filter(u => u.isActive).length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin">
          <div className="w-12 h-12 border-4 border-pink-200 border-t-pink-500 rounded-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Add User Button */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Users & Activity</h1>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#ee6996] to-[#f58eb2] text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-pink-200/50 hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          <Plus size={18} strokeWidth={2.5} />
          Add User
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-pink-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Total Users</p>
              <p className="text-3xl font-black text-gray-800 mt-2">{stats.totalUsers}</p>
            </div>
            <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center text-pink-600">
              <Users size={24} strokeWidth={2} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-pink-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Total Admins</p>
              <p className="text-3xl font-black text-[#ee6996] mt-2">{stats.totalAdmins}</p>
            </div>
            <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center text-[#ee6996]">
              <Users size={24} strokeWidth={2} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-pink-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Active Users</p>
              <p className="text-3xl font-black text-emerald-600 mt-2">{stats.activeUsers}</p>
            </div>
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600">
              <LogOut size={24} strokeWidth={2} />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 bg-white p-2 rounded-full shadow-sm border border-pink-50 w-fit">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all ${
            activeTab === 'all'
              ? 'bg-[#ee6996] text-white shadow-md shadow-pink-200'
              : 'text-gray-400 hover:text-pink-600'
          }`}
        >
          All Users
        </button>
        <button
          onClick={() => setActiveTab('admins')}
          className={`px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all ${
            activeTab === 'admins'
              ? 'bg-[#ee6996] text-white shadow-md shadow-pink-200'
              : 'text-gray-400 hover:text-pink-600'
          }`}
        >
          Admins Only
        </button>
        <button
          onClick={() => setActiveTab('active')}
          className={`px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all ${
            activeTab === 'active'
              ? 'bg-[#ee6996] text-white shadow-md shadow-pink-200'
              : 'text-gray-400 hover:text-pink-600'
          }`}
        >
          Active
        </button>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-[2rem] shadow-sm border border-pink-50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#fff9fb]">
                <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Username</th>
                <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Display Name</th>
                <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Role</th>
                <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Last Login</th>
                <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Status</th>
                <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-pink-50">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-8 py-12 text-center text-gray-500">
                    No users found. Click "Add User" to create one.
                  </td>
                </tr>
              ) : (
                filteredUsers.map(user => (
                  <tr key={user.id} className="hover:bg-pink-50/20 transition-colors">
                    <td className="px-8 py-5">
                      <p className="text-sm font-bold text-gray-800">{user.username}</p>
                    </td>
                    <td className="px-8 py-5">
                      <p className="text-sm font-medium text-gray-600">{user.displayName}</p>
                    </td>
                    <td className="px-8 py-5">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                        user.role === 'admin'
                          ? 'bg-pink-100 text-[#ee6996]'
                          : 'bg-purple-100 text-purple-600'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2 text-sm">
                        <Clock size={14} className="text-gray-400" />
                        <span className="text-gray-600">{user.lastLoginFormatted}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                        user.isActive
                          ? 'bg-emerald-50 text-emerald-600'
                          : 'bg-gray-50 text-gray-600'
                      }`}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <button
                        onClick={() => {
                          setSelectedUserForEdit(user);
                          setIsEditModalOpen(true);
                        }}
                        className="p-2 hover:bg-pink-100 rounded-lg text-[#ee6996] transition-colors"
                        title="Edit user"
                      >
                        <Edit2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      <AddUserModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={fetchUsers}
      />

      {/* Edit User Modal */}
      <EditUserModal 
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedUserForEdit(null);
        }}
        user={selectedUserForEdit}
        onEdit={fetchUsers}
      />
    </div>
  );
}
