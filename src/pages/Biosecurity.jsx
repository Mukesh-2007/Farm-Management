import React, { useState } from 'react';
import { useFarmData } from '../context/FarmDataContext';
import { useAuth } from '../context/AuthContext';
import DataTable from '../components/Common/DataTable';
import StatusBadge from '../components/Common/StatusBadge';
import Modal from '../components/Common/Modal';
import FormField from '../components/Common/FormField';
import { ShieldCheck, Plus, CheckSquare, ClipboardList, Thermometer, UserMinus } from 'lucide-react';

const Biosecurity = () => {
  const { user } = useAuth();
  const {
    visitors,
    addVisitorLog,
    checkoutVisitor,
    biosecurityLogs,
    addBiosecurityLog
  } = useFarmData();

  const [activeTab, setActiveTab] = useState('visitors');
  const [isVisitorModalOpen, setIsVisitorModalOpen] = useState(false);
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);

  // Visitor Form State
  const [visitorFields, setVisitorFields] = useState({
    name: '',
    agency: '',
    purpose: '',
    vehicleNo: '',
    entryTime: '',
    temperature: '36.5'
  });
  const [visitorErrors, setVisitorErrors] = useState({});

  // Checklist Form State
  const [checklistFields, setChecklistFields] = useState({
    shift: 'Morning',
    footbathChecked: true,
    footbathConcentration: 'Optimal',
    ppeCompliance: '100% Compliant',
    shedCleaned: '',
    notes: ''
  });
  const [checklistErrors, setChecklistErrors] = useState({});

  const handleOpenVisitorModal = () => {
    setVisitorFields({
      name: '',
      agency: '',
      purpose: '',
      vehicleNo: '',
      entryTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      temperature: '36.5'
    });
    setVisitorErrors({});
    setIsVisitorModalOpen(true);
  };

  const handleOpenLogModal = () => {
    setChecklistFields({
      shift: 'Morning',
      footbathChecked: true,
      footbathConcentration: 'Optimal',
      ppeCompliance: '100% Compliant',
      shedCleaned: 'Shed A',
      notes: ''
    });
    setChecklistErrors({});
    setIsLogModalOpen(true);
  };

  const handleVisitorSubmit = (e) => {
    e.preventDefault();
    const errors = {};
    if (!visitorFields.name.trim()) errors.name = 'Visitor Name is required.';
    if (!visitorFields.agency.trim()) errors.agency = 'Agency/Company is required.';
    if (!visitorFields.purpose.trim()) errors.purpose = 'Purpose of visit is required.';
    if (!visitorFields.vehicleNo.trim()) errors.vehicleNo = 'Vehicle number is required.';
    if (!visitorFields.temperature || isNaN(visitorFields.temperature) || Number(visitorFields.temperature) < 35 || Number(visitorFields.temperature) > 42) {
      errors.temperature = 'Please enter a valid body temperature (°C).';
    }

    if (Object.keys(errors).length > 0) {
      setVisitorErrors(errors);
      return;
    }

    addVisitorLog({
      ...visitorFields,
      temperature: Number(visitorFields.temperature),
      exitTime: ''
    });
    setIsVisitorModalOpen(false);
  };

  const handleChecklistSubmit = (e) => {
    e.preventDefault();
    if (!checklistFields.shedCleaned.trim()) {
      setChecklistErrors({ shedCleaned: 'Please list which sheds were sanitized.' });
      return;
    }

    addBiosecurityLog(checklistFields);
    setIsLogModalOpen(false);
  };

  const handleCheckout = (id) => {
    const exitTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    checkoutVisitor(id, exitTime);
  };

  // Visitor Columns
  const visitorColumns = [
    { header: 'Visitor ID', key: 'id', sortable: true },
    { header: 'Date', key: 'date', sortable: true },
    { header: 'Full Name', key: 'name', sortable: true },
    { header: 'Company', key: 'agency', sortable: true },
    { header: 'Purpose', key: 'purpose' },
    { header: 'Vehicle Plate', key: 'vehicleNo' },
    {
      header: 'Temp (°C)',
      key: 'temperature',
      render: (item) => (
        <span className={`inline-flex items-center gap-1 font-bold text-xs ${item.temperature > 37.5 ? 'text-rose-600' : 'text-slate-700'}`}>
          <Thermometer className="w-3.5 h-3.5" /> {item.temperature}°C
        </span>
      )
    },
    { header: 'Check In', key: 'entryTime' },
    {
      header: 'Check Out',
      key: 'exitTime',
      render: (item) => item.exitTime ? item.exitTime : <span className="text-amber-600 font-semibold italic">On Premise</span>
    },
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
        if (item.exitTime) return <span className="text-slate-400 font-semibold text-[11px]">Completed</span>;
        return (
          <button
            onClick={() => handleCheckout(item.id)}
            className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-700 font-semibold border border-amber-200 text-xxs rounded-lg flex items-center gap-1 focus:outline-none transition-colors cursor-pointer"
          >
            <UserMinus className="w-3.5 h-3.5" /> Checkout
          </button>
        );
      }
    }
  ];

  // Checklist Columns
  const logColumns = [
    { header: 'Log ID', key: 'id', sortable: true },
    { header: 'Date', key: 'date', sortable: true },
    { header: 'Shift', key: 'shift', sortable: true },
    {
      header: 'Footbath Checked',
      key: 'footbathChecked',
      render: (item) => (
        <span className={`font-semibold text-xs ${item.footbathChecked ? 'text-emerald-600' : 'text-rose-600'}`}>
          {item.footbathChecked ? 'Yes' : 'No'}
        </span>
      )
    },
    { header: 'Concentration Level', key: 'footbathConcentration' },
    {
      header: 'PPE Compliance',
      key: 'ppeCompliance',
      render: (item) => <StatusBadge status={item.ppeCompliance} />
    },
    { header: 'Shed Sanitized', key: 'shedCleaned' },
    { header: 'Observations / Notes', key: 'notes' }
  ];

  return (
    <div className="space-y-6">
      
      {/* Header banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Biosecurity & Sanitation Logs</h2>
          <p className="text-xs text-slate-500 mt-1">Control farm boundaries, log visitor disinfection checklists, and audit PPE compliance.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-slate-200 pb-px">
        <button
          onClick={() => setActiveTab('visitors')}
          className={`pb-3 px-4 text-sm font-semibold transition-all border-b-2 focus:outline-none flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'visitors'
              ? 'border-farm-600 text-farm-700 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <ClipboardList className="w-4.5 h-4.5" /> Visitor & Vehicle Registry
        </button>
        <button
          onClick={() => setActiveTab('checklists')}
          className={`pb-3 px-4 text-sm font-semibold transition-all border-b-2 focus:outline-none flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'checklists'
              ? 'border-farm-600 text-farm-700 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <CheckSquare className="w-4.5 h-4.5" /> Disinfection & Cleaning Checklists
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === 'visitors' ? (
        <DataTable
          columns={visitorColumns}
          data={visitors}
          searchPlaceholder="Search visitor or vehicle..."
          searchKeys={['name', 'agency', 'vehicleNo', 'purpose']}
          pageSize={5}
          actions={
            <button
              onClick={handleOpenVisitorModal}
              className="px-4 py-2 bg-farm-600 hover:bg-farm-700 text-white font-bold text-xs rounded-lg shadow-sm hover:shadow flex items-center gap-1.5 focus:outline-none cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Log Visitor Entry
            </button>
          }
        />
      ) : (
        <DataTable
          columns={logColumns}
          data={biosecurityLogs}
          searchPlaceholder="Search sanitations or notes..."
          searchKeys={['shedCleaned', 'notes', 'shift']}
          pageSize={5}
          actions={
            <button
              onClick={handleOpenLogModal}
              className="px-4 py-2 bg-farm-600 hover:bg-farm-700 text-white font-bold text-xs rounded-lg shadow-sm hover:shadow flex items-center gap-1.5 focus:outline-none cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Log Cleaning Shift
            </button>
          }
        />
      )}

      {/* Visitor Entry Modal */}
      <Modal
        isOpen={isVisitorModalOpen}
        onClose={() => setIsVisitorModalOpen(false)}
        title="Visitor & Vehicle Entry Registry"
        footer={
          <>
            <button
              onClick={() => setIsVisitorModalOpen(false)}
              className="px-4 py-2 border border-slate-200 hover:bg-slate-50 rounded-lg text-xs font-semibold text-slate-600 transition-colors focus:outline-none cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleVisitorSubmit}
              className="px-4 py-2 bg-farm-600 hover:bg-farm-700 text-white rounded-lg text-xs font-bold transition-colors focus:outline-none cursor-pointer"
            >
              Register & Check-in
            </button>
          </>
        }
      >
        <form onSubmit={handleVisitorSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField
              label="Visitor Full Name"
              name="name"
              value={visitorFields.name}
              onChange={(e) => setVisitorFields(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g. Dr. Neha Sharma"
              error={visitorErrors.name}
              required
            />
            <FormField
              label="Representing Agency"
              name="agency"
              value={visitorFields.agency}
              onChange={(e) => setVisitorFields(prev => ({ ...prev, agency: e.target.value }))}
              placeholder="e.g. SafeShield audit co."
              error={visitorErrors.agency}
              required
            />
          </div>

          <FormField
            label="Purpose of Visit"
            name="purpose"
            value={visitorFields.purpose}
            onChange={(e) => setVisitorFields(prev => ({ ...prev, purpose: e.target.value }))}
            placeholder="e.g. Feed Delivery, Vet consultation"
            error={visitorErrors.purpose}
            required
          />

          <div className="grid grid-cols-3 gap-4">
            <FormField
              label="Vehicle Plate No"
              name="vehicleNo"
              value={visitorFields.vehicleNo}
              onChange={(e) => setVisitorFields(prev => ({ ...prev, vehicleNo: e.target.value }))}
              placeholder="e.g. DL-3C-AS-12"
              error={visitorErrors.vehicleNo}
              required
            />
            <FormField
              label="Temp Checked (°C)"
              name="temperature"
              type="number"
              value={visitorFields.temperature}
              onChange={(e) => setVisitorFields(prev => ({ ...prev, temperature: e.target.value }))}
              placeholder="e.g. 36.5"
              error={visitorErrors.temperature}
              required
            />
            <FormField
              label="Check-in Time"
              name="entryTime"
              value={visitorFields.entryTime}
              onChange={(e) => setVisitorFields(prev => ({ ...prev, entryTime: e.target.value }))}
              required
            />
          </div>
        </form>
      </Modal>

      {/* Sanitation Shift Modal */}
      <Modal
        isOpen={isLogModalOpen}
        onClose={() => setIsLogModalOpen(false)}
        title="Sanitation & Disinfection Checklist Log"
        footer={
          <>
            <button
              onClick={() => setIsLogModalOpen(false)}
              className="px-4 py-2 border border-slate-200 hover:bg-slate-50 rounded-lg text-xs font-semibold text-slate-600 transition-colors focus:outline-none cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleChecklistSubmit}
              className="px-4 py-2 bg-farm-600 hover:bg-farm-700 text-white rounded-lg text-xs font-bold transition-colors focus:outline-none cursor-pointer"
            >
              Submit Shift Log
            </button>
          </>
        }
      >
        <form onSubmit={handleChecklistSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField
              label="Shift Block"
              name="shift"
              type="select"
              value={checklistFields.shift}
              onChange={(e) => setChecklistFields(prev => ({ ...prev, shift: e.target.value }))}
              options={['Morning', 'Afternoon', 'Evening']}
              required
            />
            <FormField
              label="Footbath Checked"
              name="footbathChecked"
              type="checkbox"
              placeholder="Disinfectant refilled?"
              value={checklistFields.footbathChecked}
              onChange={(e) => setChecklistFields(prev => ({ ...prev, footbathChecked: e.target.checked }))}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              label="Footbath Concentration"
              name="footbathConcentration"
              type="select"
              value={checklistFields.footbathConcentration}
              onChange={(e) => setChecklistFields(prev => ({ ...prev, footbathConcentration: e.target.value }))}
              options={['Optimal', 'Low (Diluted)', 'Diluted - Chemical Added']}
              required
            />
            <FormField
              label="PPE Compliance Rate"
              name="ppeCompliance"
              type="select"
              value={checklistFields.ppeCompliance}
              onChange={(e) => setChecklistFields(prev => ({ ...prev, ppeCompliance: e.target.value }))}
              options={['100% Compliant', '85% Compliant', '50% Compliant', 'Non-Compliant Alert']}
              required
            />
          </div>

          <FormField
            label="Sheds Cleaned & Sanitized"
            name="shedCleaned"
            value={checklistFields.shedCleaned}
            onChange={(e) => setChecklistFields(prev => ({ ...prev, shedCleaned: e.target.value }))}
            placeholder="e.g. Shed A, Coop 1"
            error={checklistErrors.shedCleaned}
            required
          />

          <FormField
            label="Observations / Incidents"
            name="notes"
            type="textarea"
            placeholder="e.g. minor dust levels in Shed B, all doors locked."
            value={checklistFields.notes}
            onChange={(e) => setChecklistFields(prev => ({ ...prev, notes: e.target.value }))}
          />
        </form>
      </Modal>

    </div>
  );
};

export default Biosecurity;
