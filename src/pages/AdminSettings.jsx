import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useFarmData } from '../context/FarmDataContext';
import DataTable from '../components/Common/DataTable';
import StatusBadge from '../components/Common/StatusBadge';
import Modal from '../components/Common/Modal';
import FormField from '../components/Common/FormField';
import { Settings, Users, Key, Plus, Edit2, Trash2, ShieldAlert, Check } from 'lucide-react';

const AdminSettings = () => {
  const { users, addUser, updateUser, deleteUser } = useAuth();
  const { thresholds, setThresholds } = useFarmData();

  const [activeTab, setActiveTab] = useState('users');
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // User form fields state
  const [userFields, setUserFields] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Farm Worker'
  });
  const [userErrors, setUserErrors] = useState({});

  // Threshold form fields state
  const [thresholdFields, setThresholdFields] = useState({
    lowStockFeedLimit: thresholds.lowStockFeedLimit,
    expiryWindowDays: thresholds.expiryWindowDays,
    outbreakCountLimit: thresholds.outbreakCountLimit
  });
  const [thresholdSuccess, setThresholdSuccess] = useState(false);

  // User CRUD handlers
  const handleOpenUserAdd = () => {
    setSelectedUser(null);
    setUserFields({
      name: '',
      email: '',
      password: '',
      role: 'Farm Worker'
    });
    setUserErrors({});
    setIsUserModalOpen(true);
  };

  const handleOpenUserEdit = (u) => {
    setSelectedUser(u);
    setUserFields({
      name: u.name,
      email: u.email,
      password: u.password || '••••••••',
      role: u.role
    });
    setUserErrors({});
    setIsUserModalOpen(true);
  };

  const handleUserSubmit = (e) => {
    e.preventDefault();
    const errors = {};
    if (!userFields.name.trim()) errors.name = 'Full Name is required.';
    if (!userFields.email.trim() || !userFields.email.includes('@')) errors.email = 'Please enter a valid email address.';
    if (!selectedUser && (!userFields.password || userFields.password.length < 6)) {
      errors.password = 'Password must be at least 6 characters.';
    }

    if (Object.keys(errors).length > 0) {
      setUserErrors(errors);
      return;
    }

    if (selectedUser) {
      const updateData = {
        name: userFields.name,
        email: userFields.email,
        role: userFields.role
      };
      if (userFields.password !== '••••••••') {
        updateData.password = userFields.password;
      }
      updateUser(selectedUser.id, updateData);
    } else {
      addUser(userFields);
    }
    setIsUserModalOpen(false);
  };

  const handleDeleteUser = (id) => {
    if (window.confirm('Are you sure you want to deactivate and delete this user?')) {
      deleteUser(id);
    }
  };

  // Threshold handlers
  const handleThresholdSave = (e) => {
    e.preventDefault();
    setThresholds({
      lowStockFeedLimit: Number(thresholdFields.lowStockFeedLimit),
      expiryWindowDays: Number(thresholdFields.expiryWindowDays),
      outbreakCountLimit: Number(thresholdFields.outbreakCountLimit)
    });
    setThresholdSuccess(true);
    setTimeout(() => setThresholdSuccess(false), 4000);
  };

  // Users Table columns
  const userColumns = [
    { header: 'User ID', key: 'id', sortable: true },
    { header: 'Full Name', key: 'name', sortable: true },
    { header: 'Email Address', key: 'email', sortable: true },
    {
      header: 'System Role',
      key: 'role',
      sortable: true,
      render: (item) => <StatusBadge status={item.role} />
    },
    {
      header: 'Actions',
      key: 'actions',
      render: (item) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleOpenUserEdit(item)}
            className="p-1 hover:bg-slate-100 rounded text-slate-500 hover:text-farm-600 transition-colors focus:outline-none"
            title="Edit User Details"
          >
            <Edit2 className="w-4.5 h-4.5" />
          </button>
          <button
            onClick={() => handleDeleteUser(item.id)}
            className="p-1 hover:bg-slate-100 rounded text-slate-500 hover:text-rose-600 transition-colors focus:outline-none"
            title="Delete User"
          >
            <Trash2 className="w-4.5 h-4.5" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Admin Control Panel</h2>
          <p className="text-xs text-slate-500 mt-1">Configure security credentials, manage system roles, and adjust telemetry warning thresholds.</p>
        </div>
      </div>

      {/* Navigation tabs */}
      <div className="flex space-x-2 border-b border-slate-200 pb-px">
        <button
          onClick={() => setActiveTab('users')}
          className={`pb-3 px-4 text-sm font-semibold transition-all border-b-2 focus:outline-none flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'users'
              ? 'border-farm-600 text-farm-700 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <Users className="w-4.5 h-4.5" /> User Access Management
        </button>
        <button
          onClick={() => setActiveTab('thresholds')}
          className={`pb-3 px-4 text-sm font-semibold transition-all border-b-2 focus:outline-none flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'thresholds'
              ? 'border-farm-600 text-farm-700 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <Settings className="w-4.5 h-4.5" /> Alarm & Telemetry Config
        </button>
      </div>

      {/* Tab Panel contents */}
      {activeTab === 'users' ? (
        <DataTable
          columns={userColumns}
          data={users}
          searchPlaceholder="Search system users..."
          searchKeys={['name', 'email', 'role']}
          pageSize={5}
          actions={
            <button
              onClick={handleOpenUserAdd}
              className="px-4 py-2 bg-farm-600 hover:bg-farm-700 text-white font-bold text-xs rounded-lg shadow-sm hover:shadow flex items-center gap-1.5 focus:outline-none transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add User Profile
            </button>
          }
        />
      ) : (
        <div className="max-w-2xl bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-6">
          <div className="flex items-start gap-3 p-4 bg-farm-50/50 border border-farm-100 rounded-2xl">
            <ShieldAlert className="w-5.5 h-5.5 text-farm-700 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-bold text-farm-900">Warning Telemetry Settings</h4>
              <p className="text-xs text-farm-750/90 leading-relaxed mt-1">
                Threshold limits entered here will affect the global notifications dispatch loop. Low feed stocks, pharmaceutical expiry windows, and outbreak quarantine alerts will dynamically update across all dashboards.
              </p>
            </div>
          </div>

          {thresholdSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-250 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-1.5 animate-in fade-in duration-200">
              <Check className="w-4 h-4 text-emerald-600" /> Settings updated successfully! Warning monitors refreshed.
            </div>
          )}

          <form onSubmit={handleThresholdSave} className="space-y-4">
            <FormField
              label="Low Stock Warning Limit for Feed (kg)"
              name="lowStockFeedLimit"
              type="number"
              value={thresholdFields.lowStockFeedLimit}
              onChange={(e) => setThresholdFields(prev => ({ ...prev, lowStockFeedLimit: e.target.value }))}
              placeholder="e.g. 150"
              required
            />

            <FormField
              label="Medicine Expiry Warning Window (Days before date)"
              name="expiryWindowDays"
              type="number"
              value={thresholdFields.expiryWindowDays}
              onChange={(e) => setThresholdFields(prev => ({ ...prev, expiryWindowDays: e.target.value }))}
              placeholder="e.g. 30"
              required
            />

            <FormField
              label="Outbreak Case Count Limit (Shed Sickness Trigger)"
              name="outbreakCountLimit"
              type="number"
              value={thresholdFields.outbreakCountLimit}
              onChange={(e) => setThresholdFields(prev => ({ ...prev, outbreakCountLimit: e.target.value }))}
              placeholder="e.g. 2"
              required
            />

            <button
              type="submit"
              className="px-5 py-2.5 bg-farm-600 hover:bg-farm-700 text-white font-bold text-xs rounded-xl shadow-md hover:shadow-lg transition-all focus:outline-none cursor-pointer"
            >
              Save Alarm Settings
            </button>
          </form>
        </div>
      )}

      {/* User CRUD Modal */}
      <Modal
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
        title={selectedUser ? `Modify User Details (${selectedUser.id})` : 'Create User Credentials'}
        footer={
          <>
            <button
              onClick={() => setIsUserModalOpen(false)}
              className="px-4 py-2 border border-slate-200 hover:bg-slate-50 rounded-lg text-xs font-semibold text-slate-600 transition-colors focus:outline-none cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleUserSubmit}
              className="px-4 py-2 bg-farm-600 hover:bg-farm-700 text-white rounded-lg text-xs font-bold transition-colors focus:outline-none cursor-pointer"
            >
              Save Account
            </button>
          </>
        }
      >
        <form onSubmit={handleUserSubmit} className="space-y-4">
          <FormField
            label="User Full Name"
            name="name"
            value={userFields.name}
            onChange={(e) => setUserFields(prev => ({ ...prev, name: e.target.value }))}
            placeholder="e.g. Sanjay Singh"
            error={userErrors.name}
            required
          />

          <FormField
            label="User Email Address"
            name="email"
            type="email"
            value={userFields.email}
            onChange={(e) => setUserFields(prev => ({ ...prev, email: e.target.value }))}
            placeholder="e.g. manager@farm.com"
            error={userErrors.email}
            required
          />

          <FormField
            label="Security Password"
            name="password"
            type="password"
            value={userFields.password}
            onChange={(e) => setUserFields(prev => ({ ...prev, password: e.target.value }))}
            placeholder="••••••••"
            error={userErrors.password}
            required={!selectedUser}
          />

          <FormField
            label="Assign Access Role"
            name="role"
            type="select"
            value={userFields.role}
            onChange={(e) => setUserFields(prev => ({ ...prev, role: e.target.value }))}
            options={['Admin', 'Farm Manager', 'Farm Worker', 'Veterinarian']}
            required
          />
        </form>
      </Modal>

    </div>
  );
};

export default AdminSettings;
