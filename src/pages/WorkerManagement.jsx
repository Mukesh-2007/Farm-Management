import React, { useState } from 'react';
import { useFarmData } from '../context/FarmDataContext';
import { useAuth } from '../context/AuthContext';
import DataTable from '../components/Common/DataTable';
import StatusBadge from '../components/Common/StatusBadge';
import Modal from '../components/Common/Modal';
import FormField from '../components/Common/FormField';
import { Plus, Users, CalendarCheck, ClipboardList, Trash2, Edit2 } from 'lucide-react';

const WorkerManagement = () => {
  const { user } = useAuth();
  const {
    workers,
    attendance,
    tasks,
    saveWorkerProfile,
    deleteWorker,
    markAttendance,
    addTask,
    toggleTaskStatus
  } = useFarmData();

  const [activeTab, setActiveTab] = useState('workers');
  const [isWorkerModalOpen, setIsWorkerModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState(null);

  // Date selection for attendance
  const [attendanceDate, setAttendanceDate] = useState('2026-07-15');

  // Worker Form State
  const [workerFields, setWorkerFields] = useState({
    name: '',
    phone: '',
    role: '',
    status: 'Active'
  });
  const [workerErrors, setWorkerErrors] = useState({});

  // Task Form State
  const [taskFields, setTaskFields] = useState({
    title: '',
    description: '',
    assignedTo: ''
  });
  const [taskErrors, setTaskErrors] = useState({});

  const isManagerOrAdmin = user?.role === 'Admin' || user?.role === 'Farm Manager';

  // Open Handlers
  const handleOpenWorkerAdd = () => {
    setSelectedWorker(null);
    setWorkerFields({
      name: '',
      phone: '',
      role: '',
      status: 'Active'
    });
    setWorkerErrors({});
    setIsWorkerModalOpen(true);
  };

  const handleOpenWorkerEdit = (worker) => {
    setSelectedWorker(worker);
    setWorkerFields({
      name: worker.name,
      phone: worker.phone,
      role: worker.role,
      status: worker.status
    });
    setWorkerErrors({});
    setIsWorkerModalOpen(true);
  };

  const handleOpenTaskModal = () => {
    const defaultWorker = workers.length > 0 ? workers[0].id : '';
    setTaskFields({
      title: '',
      description: '',
      assignedTo: defaultWorker
    });
    setTaskErrors({});
    setIsTaskModalOpen(true);
  };

  // Submit Handlers
  const handleWorkerSubmit = (e) => {
    e.preventDefault();
    const errors = {};
    if (!workerFields.name.trim()) errors.name = 'Worker name is required.';
    if (!workerFields.phone.trim() || isNaN(workerFields.phone) || workerFields.phone.length < 10) {
      errors.phone = 'Please enter a valid 10-digit phone number.';
    }
    if (!workerFields.role.trim()) errors.role = 'Worker job role is required.';

    if (Object.keys(errors).length > 0) {
      setWorkerErrors(errors);
      return;
    }

    saveWorkerProfile({
      id: selectedWorker?.id,
      ...workerFields
    });
    setIsWorkerModalOpen(false);
  };

  const handleTaskSubmit = (e) => {
    e.preventDefault();
    const errors = {};
    if (!taskFields.title.trim()) errors.title = 'Task Title is required.';
    if (!taskFields.description.trim()) errors.description = 'Task description is required.';

    if (Object.keys(errors).length > 0) {
      setTaskErrors(errors);
      return;
    }

    addTask(taskFields);
    setIsTaskModalOpen(false);
  };

  const handleAttendanceChange = (workerId, workerName, newStatus) => {
    markAttendance(attendanceDate, workerId, newStatus, workerName);
  };

  const handleTaskToggle = (taskId, currentStatus) => {
    const newStatus = currentStatus === 'Completed' ? 'Pending' : 'Completed';
    toggleTaskStatus(taskId, newStatus);
  };

  const handleDeleteWorker = (id) => {
    if (window.confirm('Mark this worker profile as Inactive?')) {
      deleteWorker(id);
    }
  };

  // Workers Columns
  const workerColumns = [
    { header: 'Worker ID', key: 'id', sortable: true },
    { header: 'Full Name', key: 'name', sortable: true },
    { header: 'Phone Number', key: 'phone' },
    { header: 'Job Role', key: 'role', sortable: true },
    { header: 'Joining Date', key: 'joiningDate', sortable: true },
    {
      header: 'Status',
      key: 'status',
      sortable: true,
      render: (item) => <StatusBadge status={item.status} />
    },
    ...(isManagerOrAdmin
      ? [
          {
            header: 'Actions',
            key: 'actions',
            render: (item) => (
              <div className="flex space-x-2">
                <button
                  onClick={() => handleOpenWorkerEdit(item)}
                  className="p-1 hover:bg-slate-100 rounded text-slate-500 hover:text-farm-600 transition-colors focus:outline-none"
                  title="Edit Worker Profile"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteWorker(item.id)}
                  className="p-1 hover:bg-slate-100 rounded text-slate-500 hover:text-rose-600 transition-colors focus:outline-none"
                  title="Deactivate Worker"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )
          }
        ]
      : [])
  ];

  // Attendance Grid preparation
  const activeWorkers = workers.filter(w => w.status === 'Active');
  const attendanceRecordsForDate = attendance.filter(att => att.date === attendanceDate);

  // Tasks Columns
  const taskColumns = [
    { header: 'Task ID', key: 'id', sortable: true },
    { header: 'Date', key: 'date', sortable: true },
    { header: 'Task Title', key: 'title', sortable: true },
    { header: 'Description', key: 'description' },
    { header: 'Assigned To', key: 'workerName', sortable: true },
    {
      header: 'Status',
      key: 'status',
      sortable: true,
      render: (item) => <StatusBadge status={item.status} />
    },
    {
      header: 'Toggle Status',
      key: 'actions',
      render: (item) => {
        // If the logged in user is worker, they can only toggle tasks assigned to them.
        // Manager/Admin can toggle anything.
        const canToggle = isManagerOrAdmin || (user.role === 'Farm Worker' && item.assignedTo === 'W-001'); // Mock worker W-001
        return (
          <input
            type="checkbox"
            checked={item.status === 'Completed'}
            onChange={() => handleTaskToggle(item.id, item.status)}
            disabled={!canToggle}
            className="w-4.5 h-4.5 text-farm-600 border-slate-300 rounded focus:ring-farm-500 accent-farm-600 cursor-pointer disabled:cursor-not-allowed"
          />
        );
      }
    }
  ];

  // Options list for workers selection
  const workerOptions = workers.map(w => ({
    value: w.id,
    label: `${w.name} (${w.role})`
  }));

  return (
    <div className="space-y-6">
      
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Labor & Task Management</h2>
          <p className="text-xs text-slate-500 mt-1">Manage farm staff profiles, log daily attendance sheets, and delegate duties.</p>
        </div>
      </div>

      {/* Navigation tabs */}
      <div className="flex space-x-2 border-b border-slate-200 pb-px">
        <button
          onClick={() => setActiveTab('workers')}
          className={`pb-3 px-4 text-sm font-semibold transition-all border-b-2 focus:outline-none flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'workers'
              ? 'border-farm-600 text-farm-700 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <Users className="w-4.5 h-4.5" /> Worker Directory
        </button>
        <button
          onClick={() => setActiveTab('attendance')}
          className={`pb-3 px-4 text-sm font-semibold transition-all border-b-2 focus:outline-none flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'attendance'
              ? 'border-farm-600 text-farm-700 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <CalendarCheck className="w-4.5 h-4.5" /> Attendance Sheet
        </button>
        <button
          onClick={() => setActiveTab('tasks')}
          className={`pb-3 px-4 text-sm font-semibold transition-all border-b-2 focus:outline-none flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'tasks'
              ? 'border-farm-600 text-farm-700 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <ClipboardList className="w-4.5 h-4.5" /> Task Delegation
        </button>
      </div>

      {/* Tab Panel contents */}
      {activeTab === 'workers' && (
        <DataTable
          columns={workerColumns}
          data={workers}
          searchPlaceholder="Search staff names or roles..."
          searchKeys={['name', 'role', 'id']}
          pageSize={5}
          actions={
            isManagerOrAdmin && (
              <button
                onClick={handleOpenWorkerAdd}
                className="px-4 py-2 bg-farm-600 hover:bg-farm-700 text-white font-bold text-xs rounded-lg shadow-sm hover:shadow flex items-center gap-1.5 focus:outline-none cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Add Staff Profile
              </button>
            )
          }
        />
      )}

      {activeTab === 'attendance' && (
        <div className="space-y-4">
          <div className="bg-slate-50 p-4 border border-slate-100 rounded-xl flex items-center justify-between">
            <div className="flex items-center space-x-2 text-xs font-semibold text-slate-700">
              <span>Select Evaluation Date:</span>
              <input
                type="date"
                value={attendanceDate}
                onChange={(e) => setAttendanceDate(e.target.value)}
                className="px-3 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-farm-500 bg-white"
              />
            </div>
            <span className="text-xxs text-slate-400 font-bold block uppercase">Attendance changes update in real-time</span>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            <table className="w-full text-left border-collapse text-slate-600 text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 font-semibold text-slate-500 text-xs uppercase tracking-wider">
                  <th className="px-6 py-3.5">Worker Name</th>
                  <th className="px-6 py-3.5">Job Role</th>
                  <th className="px-6 py-3.5">Attendance Status</th>
                  <th className="px-6 py-3.5">Visual Badge</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {activeWorkers.map((worker) => {
                  const record = attendanceRecordsForDate.find(att => att.workerId === worker.id);
                  const currentStatus = record ? record.status : 'Absent';
                  return (
                    <tr key={worker.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 font-bold text-slate-800">{worker.name}</td>
                      <td className="px-6 py-4">{worker.role}</td>
                      <td className="px-6 py-4">
                        <select
                          value={currentStatus}
                          onChange={(e) => handleAttendanceChange(worker.id, worker.name, e.target.value)}
                          disabled={!isManagerOrAdmin}
                          className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-farm-500 bg-white cursor-pointer disabled:cursor-not-allowed"
                        >
                          <option value="Present">Present</option>
                          <option value="Absent">Absent</option>
                          <option value="Leave">Leave</option>
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={currentStatus} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'tasks' && (
        <DataTable
          columns={taskColumns}
          data={tasks}
          searchPlaceholder="Search task titles..."
          searchKeys={['title', 'description', 'workerName']}
          pageSize={5}
          actions={
            isManagerOrAdmin && (
              <button
                onClick={handleOpenTaskModal}
                className="px-4 py-2 bg-farm-600 hover:bg-farm-700 text-white font-bold text-xs rounded-lg shadow-sm hover:shadow flex items-center gap-1.5 focus:outline-none cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Delegate New Task
              </button>
            )
          }
        />
      )}

      {/* Add/Edit Worker Modal */}
      <Modal
        isOpen={isWorkerModalOpen}
        onClose={() => setIsWorkerModalOpen(false)}
        title={selectedWorker ? `Modify Worker Profile (${selectedWorker.id})` : 'Create Staff Profile'}
        footer={
          <>
            <button
              onClick={() => setIsWorkerModalOpen(false)}
              className="px-4 py-2 border border-slate-200 hover:bg-slate-50 rounded-lg text-xs font-semibold text-slate-600 transition-colors focus:outline-none cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleWorkerSubmit}
              className="px-4 py-2 bg-farm-600 hover:bg-farm-700 text-white rounded-lg text-xs font-bold transition-colors focus:outline-none cursor-pointer"
            >
              Save Profile
            </button>
          </>
        }
      >
        <form onSubmit={handleWorkerSubmit} className="space-y-4">
          <FormField
            label="Worker Full Name"
            name="name"
            value={workerFields.name}
            onChange={(e) => setWorkerFields(prev => ({ ...prev, name: e.target.value }))}
            placeholder="e.g. Vikram Rathore"
            error={workerErrors.name}
            required
          />

          <FormField
            label="Worker Phone Number"
            name="phone"
            value={workerFields.phone}
            onChange={(e) => setWorkerFields(prev => ({ ...prev, phone: e.target.value }))}
            placeholder="e.g. 9876543210"
            error={workerErrors.phone}
            required
          />

          <FormField
            label="Job Role / Responsibility"
            name="role"
            value={workerFields.role}
            onChange={(e) => setWorkerFields(prev => ({ ...prev, role: e.target.value }))}
            placeholder="e.g. Animal Feeder, Cleaner, Medical Logger"
            error={workerErrors.role}
            required
          />

          <FormField
            label="Employment Status"
            name="status"
            type="select"
            value={workerFields.status}
            onChange={(e) => setWorkerFields(prev => ({ ...prev, status: e.target.value }))}
            options={['Active', 'Inactive']}
            required
          />
        </form>
      </Modal>

      {/* Task Delegation Modal */}
      <Modal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        title="Delegate New Task / Chore"
        footer={
          <>
            <button
              onClick={() => setIsTaskModalOpen(false)}
              className="px-4 py-2 border border-slate-200 hover:bg-slate-50 rounded-lg text-xs font-semibold text-slate-600 transition-colors focus:outline-none cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleTaskSubmit}
              className="px-4 py-2 bg-farm-600 hover:bg-farm-700 text-white rounded-lg text-xs font-bold transition-colors focus:outline-none cursor-pointer"
            >
              Delegate Task
            </button>
          </>
        }
      >
        <form onSubmit={handleTaskSubmit} className="space-y-4">
          <FormField
            label="Task / Chore Title"
            name="title"
            value={taskFields.title}
            onChange={(e) => setTaskFields(prev => ({ ...prev, title: e.target.value }))}
            placeholder="e.g. Spray bio-disinfectant in Coop 1"
            error={taskErrors.title}
            required
          />

          <FormField
            label="Detailed Chore Instructions"
            name="description"
            type="textarea"
            value={taskFields.description}
            onChange={(e) => setTaskFields(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Describe what needs to be cleaned, quantity of feed, or specific animals to examine..."
            error={taskErrors.description}
            required
          />

          <FormField
            label="Assign To Worker"
            name="assignedTo"
            type="select"
            value={taskFields.assignedTo}
            onChange={(e) => setTaskFields(prev => ({ ...prev, assignedTo: e.target.value }))}
            options={workerOptions}
            required
          />
        </form>
      </Modal>

    </div>
  );
};

export default WorkerManagement;
