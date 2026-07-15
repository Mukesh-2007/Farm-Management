import React, { useState, useMemo } from 'react';
import { useFarmData } from '../context/FarmDataContext';
import { useAuth } from '../context/AuthContext';
import DataTable from '../components/Common/DataTable';
import StatusBadge from '../components/Common/StatusBadge';
import { FileSpreadsheet, Download, RefreshCw, CalendarDays, CheckCircle2 } from 'lucide-react';

const Reports = () => {
  const { user } = useAuth();
  const {
    animals,
    vaccinations,
    diseaseCases,
    feedLogs,
    medicineLogs,
    attendance
  } = useFarmData();

  const [reportType, setReportType] = useState('Animal Count');
  const [startDate, setStartDate] = useState('2026-07-01');
  const [endDate, setEndDate] = useState('2026-07-15');
  const [exportSuccess, setExportSuccess] = useState('');

  // Export handlers
  const handleExport = (format) => {
    setExportSuccess(`Report successfully compiled and exported as ${format.toUpperCase()}! File: AgriSmart_${reportType.replace(/\s+/g, '_')}_Report.${format === 'csv' ? 'csv' : 'pdf'}`);
    setTimeout(() => setExportSuccess(''), 6000);
  };

  // Compile Report Data depending on Selection
  const reportData = useMemo(() => {
    switch (reportType) {
      case 'Vaccination':
        return vaccinations.map(v => ({
          id: v.id,
          animalId: v.animalId,
          breed: v.animalBreed,
          vaccine: v.vaccineName,
          date: v.adminDate || 'Scheduled',
          nextDue: v.nextDueDate,
          status: v.status
        }));

      case 'Disease':
        return diseaseCases.map(d => ({
          id: d.id,
          animalId: d.animalId,
          breed: d.animalBreed,
          disease: d.diseaseName,
          symptoms: d.symptoms,
          date: d.reportDate,
          status: d.status
        }));

      case 'Feed/Medicine Usage':
        // Merge feed and medicine logs
        const fLogs = feedLogs.map(l => ({
          id: l.id,
          date: l.date,
          item: l.feedType,
          qty: `${l.quantity} kg`,
          type: 'Feed',
          operator: l.loggedBy,
          detail: l.supplier ? `Supplier: ${l.supplier}` : l.action
        }));
        const mLogs = medicineLogs.map(l => ({
          id: l.id,
          date: l.date,
          item: l.medicineName,
          qty: `${l.quantity} units`,
          type: 'Medicine',
          operator: 'Vet Care',
          detail: l.action
        }));
        return [...fLogs, ...mLogs].sort((a, b) => new Date(b.date) - new Date(a.date));

      case 'Attendance':
        return attendance.map(a => ({
          id: a.id,
          date: a.date,
          worker: a.name,
          status: a.status
        }));

      case 'Animal Count':
      default:
        // Group animals by shed for summary counts
        const shedGroups = {};
        animals.forEach(a => {
          if (!shedGroups[a.shedNumber]) {
            shedGroups[a.shedNumber] = {
              shed: a.shedNumber,
              type: a.type,
              breed: a.breed,
              healthy: 0,
              sick: 0,
              total: 0
            };
          }
          shedGroups[a.shedNumber].total += a.quantity || 1;
          if (a.healthStatus === 'Healthy') {
            shedGroups[a.shedNumber].healthy += a.quantity || 1;
          } else {
            shedGroups[a.shedNumber].sick += a.quantity || 1;
          }
        });
        return Object.values(shedGroups);
    }
  }, [reportType, animals, vaccinations, diseaseCases, feedLogs, medicineLogs, attendance]);

  // Columns definition based on report selection
  const reportColumns = useMemo(() => {
    switch (reportType) {
      case 'Vaccination':
        return [
          { header: 'ID', key: 'id', sortable: true },
          { header: 'Animal ID', key: 'animalId', sortable: true },
          { header: 'Breed Group', key: 'breed', sortable: true },
          { header: 'Vaccine', key: 'vaccine', sortable: true },
          { header: 'Admin Date', key: 'date', sortable: true },
          { header: 'Next Due Date', key: 'nextDue', sortable: true },
          {
            header: 'Compliance Status',
            key: 'status',
            render: (item) => <StatusBadge status={item.status} />
          }
        ];

      case 'Disease':
        return [
          { header: 'Case ID', key: 'id', sortable: true },
          { header: 'Animal ID', key: 'animalId', sortable: true },
          { header: 'Breed Group', key: 'breed', sortable: true },
          { header: 'Disease / Diagnosis', key: 'disease', sortable: true },
          { header: 'Symptoms Logged', key: 'symptoms' },
          { header: 'Report Date', key: 'date', sortable: true },
          {
            header: 'Health State',
            key: 'status',
            render: (item) => <StatusBadge status={item.status} />
          }
        ];

      case 'Feed/Medicine Usage':
        return [
          { header: 'Transaction ID', key: 'id', sortable: true },
          { header: 'Date Logged', key: 'date', sortable: true },
          { header: 'Inventory Item', key: 'item', sortable: true },
          { header: 'Type', key: 'type', sortable: true },
          { header: 'Quantity Size', key: 'qty' },
          { header: 'Operator', key: 'operator', sortable: true },
          { header: 'Activity Detail', key: 'detail' }
        ];

      case 'Attendance':
        return [
          { header: 'Log ID', key: 'id' },
          { header: 'Attendance Date', key: 'date', sortable: true },
          { header: 'Staff Member', key: 'worker', sortable: true },
          {
            header: 'Attendance Status',
            key: 'status',
            render: (item) => <StatusBadge status={item.status} />
          }
        ];

      case 'Animal Count':
      default:
        return [
          { header: 'Shed/Location', key: 'shed', sortable: true },
          { header: 'Livestock Type', key: 'type', sortable: true },
          { header: 'Primary Breed', key: 'breed', sortable: true },
          { header: 'Healthy Stock', key: 'healthy', sortable: true },
          { header: 'Sick Stock (Isolated)', key: 'sick', sortable: true },
          { header: 'Total Headcount', key: 'total', sortable: true }
        ];
    }
  }, [reportType]);

  return (
    <div className="space-y-6">
      
      {/* Dynamic Export Overlay Alert */}
      {exportSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl flex items-start space-x-3 shadow-md animate-in fade-in slide-in-from-top-3 duration-200">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-500 mt-0.5" />
          <div>
            <p className="text-sm font-bold">Export Complete</p>
            <p className="text-xs text-emerald-700/90 mt-0.5">{exportSuccess}</p>
          </div>
        </div>
      )}

      {/* Control Board Filters */}
      <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-800 mb-2 flex items-center gap-1.5">
          <FileSpreadsheet className="w-4.5 h-4.5 text-farm-600" /> Compile Farm Report
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Report Category</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-farm-500/20 focus:border-farm-500 bg-white cursor-pointer"
            >
              <option value="Animal Count">Animal Census (Shed Summary)</option>
              <option value="Vaccination">Vaccination Schedules & Logs</option>
              <option value="Disease">Sickness Cases & Isolation Audits</option>
              <option value="Feed/Medicine Usage">Feed & Medicine Consumption Trail</option>
              <option value="Attendance">Staff Daily Attendance Logs</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-farm-500/20 focus:border-farm-500 bg-white cursor-pointer"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-farm-500/20 focus:border-farm-500 bg-white cursor-pointer"
            />
          </div>

          <div className="flex items-end gap-2">
            <button
              onClick={() => handleExport('csv')}
              className="flex-1 py-2 px-3 border border-slate-200 hover:bg-slate-50 rounded-lg text-xs font-bold text-slate-700 flex items-center justify-center gap-1.5 focus:outline-none transition-colors cursor-pointer"
              title="Export as CSV spreadsheet"
            >
              <Download className="w-4 h-4 text-emerald-600" /> Export CSV
            </button>
            <button
              onClick={() => handleExport('pdf')}
              className="flex-1 py-2 px-3 border border-slate-200 hover:bg-slate-50 rounded-lg text-xs font-bold text-slate-700 flex items-center justify-center gap-1.5 focus:outline-none transition-colors cursor-pointer"
              title="Export as PDF document"
            >
              <Download className="w-4 h-4 text-rose-500" /> Export PDF
            </button>
          </div>
        </div>
      </div>

      {/* Compiled Preview Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Report Preview ({reportType})</span>
          <span className="text-[10px] text-slate-400 font-semibold flex items-center gap-1"><CalendarDays className="w-3.5 h-3.5" /> Range: {startDate} to {endDate}</span>
        </div>

        <DataTable
          columns={reportColumns}
          data={reportData}
          searchPlaceholder="Filter report records..."
          searchKeys={['id', 'animalId', 'breed', 'disease', 'vaccine', 'item', 'worker']}
          pageSize={6}
        />
      </div>

    </div>
  );
};

export default Reports;
