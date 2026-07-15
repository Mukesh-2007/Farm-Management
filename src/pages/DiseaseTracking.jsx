import React, { useState } from 'react';
import { useFarmData } from '../context/FarmDataContext';
import { useAuth } from '../context/AuthContext';
import DataTable from '../components/Common/DataTable';
import StatusBadge from '../components/Common/StatusBadge';
import Modal from '../components/Common/Modal';
import FormField from '../components/Common/FormField';
import { AlertCircle, Plus, Eye, Stethoscope, ShieldAlert } from 'lucide-react';

const DiseaseTracking = () => {
  const { user } = useAuth();
  const { diseaseCases, animals, addDiseaseCase, updateDiseaseCase } = useFarmData();
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isTreatModalOpen, setIsTreatModalOpen] = useState(false);
  const [selectedCase, setSelectedCase] = useState(null);

  // Report Sickness form state
  const [reportFields, setReportFields] = useState({
    animalId: '',
    symptoms: '',
    status: 'Reported'
  });
  const [reportErrors, setReportErrors] = useState({});

  // Diagnosis / Treatment form state
  const [treatFields, setTreatFields] = useState({
    diseaseName: '',
    diagnosis: '',
    treatment: '',
    status: '',
    isolationStart: '',
    isolationEnd: '',
    isIsolated: false
  });
  const [treatErrors, setTreatErrors] = useState({});

  const isVetOrManager = user?.role === 'Admin' || user?.role === 'Farm Manager' || user?.role === 'Veterinarian';

  const handleOpenReportModal = () => {
    const initialId = animals.length > 0 ? animals[0].id : '';
    setReportFields({
      animalId: initialId,
      symptoms: '',
      status: 'Reported'
    });
    setReportErrors({});
    setIsReportModalOpen(true);
  };

  const handleOpenTreatModal = (caseItem) => {
    setSelectedCase(caseItem);
    setTreatFields({
      diseaseName: caseItem.diseaseName || '',
      diagnosis: caseItem.diagnosis || '',
      treatment: caseItem.treatment || '',
      status: caseItem.status,
      isolationStart: caseItem.isolationStart || '',
      isolationEnd: caseItem.isolationEnd || '',
      isIsolated: !!caseItem.isolationStart
    });
    setTreatErrors({});
    setIsTreatModalOpen(true);
  };

  const handleReportSubmit = (e) => {
    e.preventDefault();
    if (!reportFields.symptoms.trim()) {
      setReportErrors({ symptoms: 'Symptoms are required.' });
      return;
    }

    const newCase = {
      animalId: reportFields.animalId,
      symptoms: reportFields.symptoms,
      diseaseName: 'Pending Examination',
      status: reportFields.status,
      reporter: user.name,
      diagnosis: '',
      treatment: '',
      isolationStart: reportFields.status === 'Isolated' ? '2026-07-15' : '',
      isolationEnd: ''
    };

    addDiseaseCase(newCase);
    setIsReportModalOpen(false);
  };

  const handleTreatSubmit = (e) => {
    e.preventDefault();
    const errors = {};
    if (!treatFields.diseaseName.trim()) errors.diseaseName = 'Disease Name is required.';
    if (!treatFields.diagnosis.trim()) errors.diagnosis = 'Diagnosis notes are required.';
    if (!treatFields.treatment.trim()) errors.treatment = 'Treatment plan is required.';
    if (treatFields.isIsolated && !treatFields.isolationStart) {
      errors.isolationStart = 'Isolation start date is required.';
    }

    if (Object.keys(errors).length > 0) {
      setTreatErrors(errors);
      return;
    }

    const updatedData = {
      diseaseName: treatFields.diseaseName,
      diagnosis: treatFields.diagnosis,
      treatment: treatFields.treatment,
      status: treatFields.status,
      isolationStart: treatFields.isIsolated ? (treatFields.isolationStart || '2026-07-15') : '',
      isolationEnd: treatFields.status === 'Recovered' || treatFields.status === 'Closed' ? (treatFields.isolationEnd || '2026-07-15') : treatFields.isolationEnd
    };

    updateDiseaseCase(selectedCase.id, updatedData);
    setIsTreatModalOpen(false);
  };

  // Table Columns
  const columns = [
    { header: 'Case ID', key: 'id', sortable: true },
    { header: 'Animal ID', key: 'animalId', sortable: true },
    { header: 'Breed', key: 'animalBreed', sortable: true },
    { header: 'Symptoms', key: 'symptoms' },
    { header: 'Diagnosis / Disease', key: 'diseaseName', sortable: true },
    {
      header: 'Status',
      key: 'status',
      sortable: true,
      render: (item) => <StatusBadge status={item.status} />
    },
    {
      header: 'Isolation Period',
      key: 'isolation',
      render: (item) => {
        if (!item.isolationStart) return <span className="text-slate-400 font-semibold text-xs">No Isolation</span>;
        return (
          <div className="text-xs">
            <p className="font-semibold text-rose-600">Start: {item.isolationStart}</p>
            {item.isolationEnd ? (
              <p className="text-emerald-600 font-semibold">End: {item.isolationEnd}</p>
            ) : (
              <p className="text-slate-400 italic">Ongoing</p>
            )}
          </div>
        );
      }
    },
    {
      header: 'Actions',
      key: 'actions',
      render: (item) => (
        <button
          onClick={() => handleOpenTreatModal(item)}
          className="px-2.5 py-1.5 bg-farm-50 hover:bg-farm-100 text-farm-700 font-semibold border border-farm-200 text-xxs rounded-lg flex items-center gap-1 focus:outline-none transition-colors cursor-pointer"
        >
          {isVetOrManager ? (
            <>
              <Stethoscope className="w-3.5 h-3.5" /> Clinical Update
            </>
          ) : (
            <>
              <Eye className="w-3.5 h-3.5" /> View Treatment
            </>
          )}
        </button>
      )
    }
  ];

  // Options list for animals selector
  const animalOptions = animals.map(a => ({
    value: a.id,
    label: `${a.id} - ${a.breed} (${a.shedNumber} - ${a.healthStatus})`
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Disease Cases & Quarantine Logs</h2>
          <p className="text-xs text-slate-500 mt-1">Report sickness, track isolated animals, log diagnoses, and record treatments.</p>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={diseaseCases}
        searchPlaceholder="Search Case, Breed or Symptoms..."
        searchKeys={['id', 'animalId', 'animalBreed', 'diseaseName', 'symptoms']}
        pageSize={5}
        actions={
          <button
            onClick={handleOpenReportModal}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-lg shadow-sm hover:shadow flex items-center gap-1.5 focus:outline-none cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Report Sick Animal
          </button>
        }
      />

      {/* Report Sickness Modal */}
      <Modal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        title="Report Sick Animal / Log Symptoms"
        footer={
          <>
            <button
              onClick={() => setIsReportModalOpen(false)}
              className="px-4 py-2 border border-slate-200 hover:bg-slate-50 rounded-lg text-xs font-semibold text-slate-600 transition-colors focus:outline-none cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleReportSubmit}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold transition-colors focus:outline-none cursor-pointer"
            >
              Submit Sickness Report
            </button>
          </>
        }
      >
        <form onSubmit={handleReportSubmit} className="space-y-4">
          <div className="p-3.5 bg-rose-50 border border-rose-100 text-rose-800 rounded-xl flex items-start space-x-2 text-xs font-semibold">
            <AlertCircle className="w-4.5 h-4.5 flex-shrink-0 text-rose-500 mt-0.5" />
            <span>
              This will mark the animal as "Sick" or "Isolated" and trigger alert flags on the dashboards of the Manager and Veterinarian.
            </span>
          </div>

          <FormField
            label="Animal ID"
            name="animalId"
            type="select"
            value={reportFields.animalId}
            onChange={(e) => setReportFields(prev => ({ ...prev, animalId: e.target.value }))}
            options={animalOptions}
            required
          />

          <FormField
            label="Observed Symptoms"
            name="symptoms"
            type="textarea"
            placeholder="e.g. coughing, not eating, feverish skin, limping"
            value={reportFields.symptoms}
            onChange={(e) => setReportFields(prev => ({ ...prev, symptoms: e.target.value }))}
            error={reportErrors.symptoms}
            required
          />

          <FormField
            label="Initial Care Action"
            name="status"
            type="select"
            value={reportFields.status}
            onChange={(e) => setReportFields(prev => ({ ...prev, status: e.target.value }))}
            options={[
              { value: 'Reported', label: 'Reported (Leaves in current pen)' },
              { value: 'Isolated', label: 'Isolated (Immediately move to quarantine pen)' }
            ]}
            required
          />
        </form>
      </Modal>

      {/* Clinical Treatment / Update Modal */}
      <Modal
        isOpen={isTreatModalOpen}
        onClose={() => setIsTreatModalOpen(false)}
        title={isVetOrManager ? `Clinical Sickness Update (${selectedCase?.id})` : `Treatment Details (${selectedCase?.id})`}
        footer={
          <>
            <button
              onClick={() => setIsTreatModalOpen(false)}
              className="px-4 py-2 border border-slate-200 hover:bg-slate-50 rounded-lg text-xs font-semibold text-slate-600 transition-colors focus:outline-none cursor-pointer"
            >
              Cancel
            </button>
            {isVetOrManager && (
              <button
                onClick={handleTreatSubmit}
                className="px-4 py-2 bg-farm-600 hover:bg-farm-700 text-white rounded-lg text-xs font-bold transition-colors focus:outline-none cursor-pointer"
              >
                Save Record
              </button>
            )}
          </>
        }
      >
        <form onSubmit={handleTreatSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-3 rounded-xl border border-slate-100">
            <div>
              <span className="text-slate-400 font-bold block uppercase">Animal Profile</span>
              <p className="font-bold text-slate-800">{selectedCase?.animalBreed} ({selectedCase?.animalId})</p>
            </div>
            <div>
              <span className="text-slate-400 font-bold block uppercase">Logged Symptoms</span>
              <p className="text-slate-700 italic font-medium">"{selectedCase?.symptoms}"</p>
            </div>
            <div className="col-span-2 pt-2 border-t border-slate-100 flex items-center justify-between">
              <span>Reported By: <strong>{selectedCase?.reporter}</strong></span>
              <span>Reported Date: <strong>{selectedCase?.reportDate}</strong></span>
            </div>
          </div>

          <FormField
            label="Diagnosis / Disease Name"
            name="diseaseName"
            value={treatFields.diseaseName}
            onChange={(e) => setTreatFields(prev => ({ ...prev, diseaseName: e.target.value }))}
            placeholder="e.g. Swine Influenza, Fowl Pox, Physical Trauma"
            disabled={!isVetOrManager}
            error={treatErrors.diseaseName}
            required
          />

          <FormField
            label="Clinical Findings (Diagnosis details)"
            name="diagnosis"
            type="textarea"
            value={treatFields.diagnosis}
            onChange={(e) => setTreatFields(prev => ({ ...prev, diagnosis: e.target.value }))}
            placeholder="Log details of temperature, tests, or examination findings..."
            disabled={!isVetOrManager}
            error={treatErrors.diagnosis}
            required
          />

          <FormField
            label="Treatment Plan / Prescriptions"
            name="treatment"
            type="textarea"
            value={treatFields.treatment}
            onChange={(e) => setTreatFields(prev => ({ ...prev, treatment: e.target.value }))}
            placeholder="Log medication, doses, schedules, and daily guidelines..."
            disabled={!isVetOrManager}
            error={treatErrors.treatment}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              label="Sickness Status"
              name="status"
              type="select"
              value={treatFields.status}
              onChange={(e) => setTreatFields(prev => ({ ...prev, status: e.target.value }))}
              options={['Reported', 'Under Treatment', 'Isolated', 'Recovered', 'Closed']}
              disabled={!isVetOrManager}
              required
            />

            <FormField
              label="Isolation Pen Active"
              name="isIsolated"
              type="checkbox"
              placeholder="Shed quarantine required"
              value={treatFields.isIsolated}
              onChange={(e) => setTreatFields(prev => ({ ...prev, isIsolated: e.target.checked }))}
              disabled={!isVetOrManager}
            />
          </div>

          {treatFields.isIsolated && (
            <div className="grid grid-cols-2 gap-4 p-3 bg-rose-50/20 border border-rose-100/50 rounded-xl">
              <FormField
                label="Isolation Start Date"
                name="isolationStart"
                type="date"
                value={treatFields.isolationStart}
                onChange={(e) => setTreatFields(prev => ({ ...prev, isolationStart: e.target.value }))}
                disabled={!isVetOrManager}
                error={treatErrors.isolationStart}
                required
              />
              <FormField
                label="Isolation End Date"
                name="isolationEnd"
                type="date"
                value={treatFields.isolationEnd}
                onChange={(e) => setTreatFields(prev => ({ ...prev, isolationEnd: e.target.value }))}
                disabled={!isVetOrManager}
              />
            </div>
          )}
        </form>
      </Modal>
    </div>
  );
};

export default DiseaseTracking;
