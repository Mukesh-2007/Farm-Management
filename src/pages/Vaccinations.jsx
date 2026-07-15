import React, { useState } from 'react';
import { useFarmData } from '../context/FarmDataContext';
import { useAuth } from '../context/AuthContext';
import DataTable from '../components/Common/DataTable';
import StatusBadge from '../components/Common/StatusBadge';
import Modal from '../components/Common/Modal';
import FormField from '../components/Common/FormField';
import { Plus, Check, ShieldCheck, CalendarRange } from 'lucide-react';

const Vaccinations = () => {
  const { user } = useAuth();
  const { vaccinations, animals, addVaccination, completeVaccination } = useFarmData();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form fields state
  const [formFields, setFormFields] = useState({
    animalId: '',
    vaccineName: '',
    dose: '',
    adminDate: '',
    nextDueDate: '',
    status: 'Scheduled'
  });

  const [formErrors, setFormErrors] = useState({});

  // Filters state
  const [filterStatus, setFilterStatus] = useState('');

  const canSchedule = user?.role === 'Admin' || user?.role === 'Farm Manager' || user?.role === 'Veterinarian';

  const handleOpenAddModal = () => {
    // Prep initial state with first animal ID
    const initialAnimalId = animals.length > 0 ? animals[0].id : '';
    setFormFields({
      animalId: initialAnimalId,
      vaccineName: '',
      dose: '',
      adminDate: '',
      nextDueDate: '',
      status: 'Scheduled'
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormFields(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const errors = {};
    if (!formFields.animalId) errors.animalId = 'Please select an animal.';
    if (!formFields.vaccineName.trim()) errors.vaccineName = 'Vaccine Name is required.';
    if (!formFields.dose.trim()) errors.dose = 'Dose size is required (e.g. 2 ml, 1 dose).';
    if (!formFields.nextDueDate) errors.nextDueDate = 'Next Due Date is required.';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveVaccination = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    addVaccination(formFields);
    setIsModalOpen(false);
  };

  const handleComplete = (id) => {
    if (window.confirm(`Mark vaccination record ${id} as completed today?`)) {
      completeVaccination(id);
    }
  };

  // Filter selection helper
  const filteredVaccinations = vaccinations.filter(v => {
    return filterStatus === '' || v.status === filterStatus;
  });

  // Table Columns config
  const columns = [
    { header: 'ID', key: 'id', sortable: true },
    { header: 'Animal ID', key: 'animalId', sortable: true },
    { header: 'Breed Group', key: 'animalBreed', sortable: true },
    { header: 'Vaccine Name', key: 'vaccineName', sortable: true },
    { header: 'Dose Size', key: 'dose' },
    {
      header: 'Administered Date',
      key: 'adminDate',
      render: (item) => item.adminDate ? item.adminDate : <span className="text-slate-400 font-medium">Pending</span>
    },
    { header: 'Next Due Date', key: 'nextDueDate', sortable: true },
    {
      header: 'Status',
      key: 'status',
      sortable: true,
      render: (item) => <StatusBadge status={item.status} />
    },
    {
      header: 'Actions',
      key: 'actions',
      render: (item) => {
        if (item.status === 'Completed') {
          return (
            <span className="text-emerald-600 font-bold text-xs flex items-center gap-1">
              <ShieldCheck className="w-4.5 h-4.5" /> Done
            </span>
          );
        }
        return (
          <button
            onClick={() => handleComplete(item.id)}
            className="px-2.5 py-1 bg-farm-50 hover:bg-farm-100 text-farm-700 font-semibold border border-farm-200 text-xxs rounded-lg flex items-center gap-1 focus:outline-none transition-colors cursor-pointer"
          >
            <Check className="w-3.5 h-3.5" /> Mark Completed
          </button>
        );
      }
    }
  ];

  // Options list for animals selector
  const animalOptions = animals.map(a => ({
    value: a.id,
    label: `${a.id} - ${a.breed} (${a.shedNumber})`
  }));

  const filterElement = (
    <select
      value={filterStatus}
      onChange={(e) => setFilterStatus(e.target.value)}
      className="px-2.5 py-2 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-farm-500 bg-white"
    >
      <option value="">All Statuses</option>
      <option value="Completed">Completed</option>
      <option value="Scheduled">Scheduled</option>
      <option value="Overdue">Overdue</option>
    </select>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Vaccination Management</h2>
          <p className="text-xs text-slate-500 mt-1">Schedule disease immunizations, log booster doses, and track compliance.</p>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={filteredVaccinations}
        searchPlaceholder="Search Vaccine or Animal..."
        searchKeys={['vaccineName', 'animalId', 'animalBreed']}
        pageSize={6}
        customFilters={filterElement}
        actions={
          canSchedule && (
            <button
              onClick={handleOpenAddModal}
              className="px-4 py-2 bg-farm-600 hover:bg-farm-700 text-white font-bold text-xs rounded-lg shadow-sm hover:shadow flex items-center gap-1.5 focus:outline-none cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Schedule Vaccine
            </button>
          )
        }
      />

      {/* Schedule Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Schedule Vaccine Administration"
        footer={
          <>
            <button
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 border border-slate-200 hover:bg-slate-50 rounded-lg text-xs font-semibold text-slate-600 transition-colors focus:outline-none cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveVaccination}
              className="px-4 py-2 bg-farm-600 hover:bg-farm-700 text-white rounded-lg text-xs font-bold transition-colors focus:outline-none cursor-pointer"
            >
              Schedule Event
            </button>
          </>
        }
      >
        <form onSubmit={handleSaveVaccination} className="space-y-4">
          <FormField
            label="Select Animal ID"
            name="animalId"
            type="select"
            value={formFields.animalId}
            onChange={handleInputChange}
            options={animalOptions}
            error={formErrors.animalId}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              label="Vaccine Name"
              name="vaccineName"
              value={formFields.vaccineName}
              onChange={handleInputChange}
              placeholder="e.g. Swine Erysipelas, Fowl Pox"
              error={formErrors.vaccineName}
              required
            />
            <FormField
              label="Dose Quantity"
              name="dose"
              value={formFields.dose}
              onChange={handleInputChange}
              placeholder="e.g. 2 ml, Oral dose"
              error={formErrors.dose}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              label="Date Administered (Optional)"
              name="adminDate"
              type="date"
              value={formFields.adminDate}
              onChange={handleInputChange}
            />
            <FormField
              label="Next Due Date"
              name="nextDueDate"
              type="date"
              value={formFields.nextDueDate}
              onChange={handleInputChange}
              error={formErrors.nextDueDate}
              required
            />
          </div>

          <FormField
            label="Schedule Status"
            name="status"
            type="select"
            value={formFields.status}
            onChange={handleInputChange}
            options={['Scheduled', 'Completed', 'Overdue']}
            required
          />
        </form>
      </Modal>
    </div>
  );
};

export default Vaccinations;
