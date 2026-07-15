import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useFarmData } from '../context/FarmDataContext';
import {
  Sprout,
  Activity,
  Syringe,
  FileWarning,
  TrendingDown,
  Calendar,
  ClipboardList,
  AlertTriangle,
  HeartPulse,
  UserCheck
} from 'lucide-react';
import StatCard from '../components/Common/StatCard';
import AlertBanner from '../components/Common/AlertBanner';
import { Link, useNavigate } from 'react-router-dom';

// ChartJS setup
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Pie, Line as LineChart } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const {
    animals,
    vaccinations,
    diseaseCases,
    feedInventory,
    medicineInventory,
    tasks,
    notifications,
    feedLogs
  } = useFarmData();

  if (!user) return null;

  // Global calculations
  const totalPigsCount = animals.filter(a => a.type === 'Pig').length;
  const totalPoultryCount = animals
    .filter(a => a.type === 'Poultry Batch')
    .reduce((sum, batch) => sum + (batch.quantity || 0), 0);
  const totalAnimalsText = `${totalPigsCount} Pigs / ${totalPoultryCount} Birds`;

  const sickAnimalsCount = animals.filter(a => a.healthStatus === 'Sick' || a.healthStatus === 'Under Treatment' || a.healthStatus === 'Isolated').length;
  const pendingVaccinesCount = vaccinations.filter(v => v.status === 'Scheduled' || v.status === 'Overdue').length;
  const lowFeedStocksCount = feedInventory.filter(f => f.stock < f.minThreshold).length;
  
  // Medicine alert count
  const medicinesWarningCount = medicineInventory.filter(m => {
    const exp = new Date(m.expiryDate);
    const today = new Date('2026-07-15');
    const diffDays = Math.ceil((exp - today) / (1000 * 60 * 60 * 24));
    return diffDays <= 30; // expired or expiring in 30 days
  }).length;

  // Activity stream (compiled from multiple sources)
  const activities = [
    { type: 'sick', message: 'Amit Patel reported animal ANI-003 as Sick (Symptomatic)', date: '2026-07-15' },
    { type: 'feed', message: 'Sanjay Singh added 500kg of Finisher Pellets', date: '2026-07-15' },
    { type: 'vaccine', message: 'Vaccinated animal ANI-001 (Erysipelas Vaccine)', date: '2026-07-14' },
    { type: 'visitor', message: 'Dr. Neha Sharma checked out from Scheduled Audit', date: '2026-07-14' },
    { type: 'task', message: 'Vikram Rathore completed footbath disinfection at Shed A', date: '2026-07-13' }
  ];

  // Role-specific worker details
  const workerTasks = tasks.filter(t => t.assignedTo === 'W-001'); // Assume W-001 for logged worker Amit
  const completedWorkerTasks = workerTasks.filter(t => t.status === 'Completed').length;
  const pendingWorkerTasks = workerTasks.filter(t => t.status !== 'Completed').length;

  // Chart Data: Health distribution
  const healthChartData = {
    labels: ['Healthy', 'Under Treatment', 'Isolated', 'Sick'],
    datasets: [
      {
        data: [
          animals.filter(a => a.healthStatus === 'Healthy').length,
          animals.filter(a => a.healthStatus === 'Under Treatment').length,
          animals.filter(a => a.healthStatus === 'Isolated').length,
          animals.filter(a => a.healthStatus === 'Sick').length
        ],
        backgroundColor: ['#10b981', '#3b82f6', '#d97706', '#ef4444'],
        borderWidth: 1,
      },
    ],
  };

  // Chart Data: Feed Consumption (Log aggregates)
  const feedChartData = {
    labels: ['Starter Crumbs', 'Sow Breeder', 'Grower Mash', 'Finisher Pellets'],
    datasets: [
      {
        label: 'Current Stock Level (kg)',
        data: [
          feedInventory.find(f => f.type === 'Starter Crumbs')?.stock || 0,
          feedInventory.find(f => f.type === 'Sow Breeder Feed')?.stock || 0,
          feedInventory.find(f => f.type === 'Grower Mash')?.stock || 0,
          feedInventory.find(f => f.type === 'Finisher Pellets')?.stock || 0,
        ],
        backgroundColor: '#059669',
        borderRadius: 8
      },
      {
        label: 'Minimum Warning Level (kg)',
        data: [100, 150, 150, 300],
        backgroundColor: '#fde68a',
        borderRadius: 8
      }
    ],
  };

  // Line Chart Data: Weekly Mortalities or Health incidents
  const incidenceHistoryData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Disease Reports',
        data: [1, 0, 2, 0, 1, 3, 1],
        borderColor: '#f59e0b',
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        fill: true,
        tension: 0.4
      },
      {
        label: 'Treatments Commenced',
        data: [0, 1, 1, 0, 2, 1, 2],
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  };

  return (
    <div className="space-y-6">
      
      {/* Alert banners list */}
      <div className="space-y-2">
        {notifications.slice(0, 2).map((n) => (
          <AlertBanner
            key={n.id}
            type={n.severity === 'high' ? 'error' : 'warning'}
            message={n.message}
            actionText="Go to inventory"
            onAction={() => navigate(n.type.includes('Feed') ? '/feed' : '/medicine')}
          />
        ))}
      </div>

      {/* Welcome Widget */}
      <div className="bg-gradient-to-r from-farm-700 via-emerald-800 to-farm-900 rounded-3xl p-7 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4 border border-farm-600/30">
        <div>
          <h2 className="text-xl font-bold">Welcome back, {user.name}!</h2>
          <p className="text-sm text-farm-100 mt-1">
            Current Farm Status: All systems operational. Low-stock levels detected in {lowFeedStocksCount} feeds.
          </p>
        </div>
        <div className="flex space-x-3 text-xs font-semibold">
          <div className="bg-farm-700/50 px-3.5 py-2 rounded-xl border border-farm-600/30 flex items-center gap-1.5">
            <Calendar className="w-4 h-4" />
            <span>Ref. Date: July 15, 2026</span>
          </div>
          <div className="bg-farm-700/50 px-3.5 py-2 rounded-xl border border-farm-600/30 flex items-center gap-1.5">
            <UserCheck className="w-4 h-4" />
            <span>Role: {user.role}</span>
          </div>
        </div>
      </div>

      {/* ROLE LAYOUTS: Admin and Farm Manager Dashboard */}
      {(user.role === 'Admin' || user.role === 'Farm Manager') && (
        <>
          {/* KPI Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5">
            <StatCard
              title="Total Animals"
              value={animals.length}
              subtext={totalAnimalsText}
              icon={Sprout}
            />
            <StatCard
              title="Sick Animals"
              value={sickAnimalsCount}
              subtext="Shed A & B isolation pens"
              icon={Activity}
              trendType={sickAnimalsCount > 2 ? 'down' : 'up'}
            />
            <StatCard
              title="Pending Vaccines"
              value={pendingVaccinesCount}
              subtext="Scheduled/Overdue"
              icon={Syringe}
            />
            <StatCard
              title="Low Stock Feeds"
              value={lowFeedStocksCount}
              subtext="Below threshold alert"
              icon={FileWarning}
              trend={lowFeedStocksCount > 0 ? `${lowFeedStocksCount} items` : 'Optimal'}
              trendType={lowFeedStocksCount > 0 ? 'down' : 'up'}
            />
            <StatCard
              title="Expiring Medicines"
              value={medicinesWarningCount}
              subtext="Expiry within 30 days"
              icon={HeartPulse}
              trendType={medicinesWarningCount > 0 ? 'down' : 'up'}
            />
          </div>

          {/* Charts & Graphs Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Stock Bar Chart */}
            <div className="glass-card rounded-3xl border border-slate-150/70 p-6 lg:col-span-2 subtle-shadow hover-lift">
              <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-1.5">
                <TrendingDown className="w-4.5 h-4.5 text-farm-600" /> Feed Levels vs Minimum Thresholds
              </h3>
              <div className="h-64">
                <Bar 
                  data={feedChartData} 
                  options={{ 
                    responsive: true, 
                    maintainAspectRatio: false,
                    plugins: { legend: { position: 'bottom', labels: { boxWidth: 12, font: { weight: 'bold', size: 11 } } } },
                    scales: { y: { beginAtZero: true, grid: { borderDash: [4, 4] } } }
                  }} 
                />
              </div>
            </div>

            {/* Health Pie Chart */}
            <div className="glass-card rounded-3xl border border-slate-150/70 p-6 subtle-shadow hover-lift">
              <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-1.5">
                <HeartPulse className="w-4.5 h-4.5 text-farm-600" /> Herd Health Distribution
              </h3>
              <div className="h-64 flex items-center justify-center">
                <Pie 
                  data={healthChartData} 
                  options={{ 
                    responsive: true, 
                    maintainAspectRatio: false,
                    plugins: { legend: { position: 'bottom', labels: { boxWidth: 10, font: { weight: 'bold', size: 10 } } } }
                  }} 
                />
              </div>
            </div>
          </div>

          {/* Bottom Dashboard Layout: Weekly Incidence Log & Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Line graph */}
            <div className="glass-card rounded-3xl border border-slate-150/70 p-6 lg:col-span-2 subtle-shadow hover-lift">
              <h3 className="text-sm font-bold text-slate-800 mb-4">Weekly Sickness Incident & Treatment Log</h3>
              <div className="h-64">
                <LineChart 
                  data={incidenceHistoryData} 
                  options={{ 
                    responsive: true, 
                    maintainAspectRatio: false,
                    plugins: { legend: { position: 'bottom', labels: { boxWidth: 12, font: { weight: 'bold', size: 11 } } } },
                    scales: { y: { grid: { borderDash: [4, 4] }, beginAtZero: true } }
                  }} 
                />
              </div>
            </div>

            {/* Activity Stream */}
            <div className="glass-card rounded-3xl border border-slate-150/70 p-6 subtle-shadow hover-lift">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                  <ClipboardList className="w-4.5 h-4.5 text-farm-600" /> Recent Activities
                </h3>
              </div>
              <div className="space-y-4">
                {activities.map((act, idx) => (
                  <div key={idx} className="flex gap-3 text-xs leading-normal">
                    <div className="w-2.5 h-2.5 rounded-full bg-farm-600 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-slate-600 font-semibold">{act.message}</p>
                      <span className="text-slate-400 block mt-0.5">{act.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {/* ROLE LAYOUTS: Veterinarian Dashboard */}
      {user.role === 'Veterinarian' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-6 lg:col-span-2">
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <StatCard title="Active Sickness Cases" value={sickAnimalsCount} subtext="Requires evaluation" icon={Activity} />
              <StatCard title="Isolated Animals" value={animals.filter(a => a.healthStatus === 'Isolated').length} subtext="Strict quarantine" icon={AlertTriangle} />
              <StatCard title="Pending Vaccinations" value={pendingVaccinesCount} subtext="Scheduled for this week" icon={Syringe} />
            </div>

            {/* Clinical Cases Review */}
            <div className="glass-card rounded-3xl border border-slate-150/70 p-6 subtle-shadow">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-slate-800">Cases Requiring Veterinary Diagnosis</h3>
                <Link to="/diseases" className="text-xs font-bold text-farm-600 hover:underline">View All</Link>
              </div>
              <div className="divide-y divide-slate-100">
                {diseaseCases.filter(dc => dc.status === 'Isolated' || dc.status === 'Reported').map(dc => (
                  <div key={dc.id} className="py-3 flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-sm text-slate-700">{dc.animalBreed} ({dc.animalId})</p>
                      <p className="text-xs text-slate-500 mt-0.5">Symptoms: {dc.symptoms}</p>
                    </div>
                    <Link to="/diseases" className="px-3 py-1.5 text-xs font-bold bg-farm-50 hover:bg-farm-100 text-farm-700 rounded-lg transition-colors border border-farm-100">
                      Diagnose
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Secondary stats/activities */}
          <div className="glass-card rounded-3xl border border-slate-150/70 p-6 subtle-shadow">
            <h3 className="text-sm font-bold text-slate-800 mb-4">Clinical Incident Logs</h3>
            <div className="space-y-4">
              {diseaseCases.slice(0, 4).map((dc) => (
                <div key={dc.id} className="text-xs flex gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full mt-1.5 ${dc.status === 'Recovered' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                  <div>
                    <p className="font-semibold text-slate-700">{dc.animalId} marked as {dc.status}</p>
                    <span className="text-slate-400 font-normal">{dc.reportDate}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ROLE LAYOUTS: Farm Worker Dashboard */}
      {user.role === 'Farm Worker' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-6 lg:col-span-2">
            
            {/* Task stats */}
            <div className="grid grid-cols-3 gap-4">
              <StatCard title="Assigned Tasks" value={workerTasks.length} subtext="Total tasks today" icon={ClipboardList} />
              <StatCard title="Completed Tasks" value={completedWorkerTasks} subtext="Attendance logged" icon={UserCheck} />
              <StatCard title="Pending Tasks" value={pendingWorkerTasks} subtext="Due by end of shift" icon={AlertTriangle} />
            </div>

            {/* Quick Actions Panel */}
            <div className="glass-card rounded-3xl border border-slate-150/70 p-6.5 subtle-shadow space-y-4">
              <h3 className="text-base font-bold text-slate-800">Quick Worker Actions</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <button 
                  onClick={() => navigate('/diseases')} 
                  className="p-4 border border-rose-100 bg-rose-50/15 hover:bg-rose-50/40 rounded-xl text-left transition-colors cursor-pointer group flex flex-col justify-between"
                >
                  <Activity className="w-6 h-6 text-rose-500 group-hover:scale-110 transition-transform" />
                  <div className="mt-4">
                    <span className="text-sm font-bold text-slate-800 block">Report Sick Animal</span>
                    <span className="text-xs text-slate-500">Log symptoms immediately</span>
                  </div>
                </button>

                <button 
                  onClick={() => navigate('/feed')} 
                  className="p-4 border border-farm-100 bg-farm-50/15 hover:bg-farm-50/40 rounded-xl text-left transition-colors cursor-pointer group flex flex-col justify-between"
                >
                  <Sprout className="w-6 h-6 text-farm-600 group-hover:scale-110 transition-transform" />
                  <div className="mt-4">
                    <span className="text-sm font-bold text-slate-800 block">Log Feed Intake</span>
                    <span className="text-xs text-slate-500">Log daily mash consumption</span>
                  </div>
                </button>

                <button 
                  onClick={() => navigate('/biosecurity')} 
                  className="p-4 border border-blue-100 bg-blue-50/15 hover:bg-blue-50/40 rounded-xl text-left transition-colors cursor-pointer group flex flex-col justify-between"
                >
                  <ClipboardList className="w-6 h-6 text-blue-500 group-hover:scale-110 transition-transform" />
                  <div className="mt-4">
                    <span className="text-sm font-bold text-slate-800 block">Biosecurity Checklist</span>
                    <span className="text-xs text-slate-500">Mark sanitation tasks</span>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Pending Tasks Sidebar */}
          <div className="glass-card rounded-3xl border border-slate-150/70 p-6 subtle-shadow">
            <h3 className="text-sm font-bold text-slate-800 mb-4">My Tasks Today</h3>
            <div className="space-y-3">
              {workerTasks.length > 0 ? (
                workerTasks.map((t) => (
                  <div key={t.id} className="p-3 border border-slate-50 hover:border-slate-100 rounded-xl flex items-center justify-between text-xs transition-colors">
                    <div>
                      <p className="font-bold text-slate-800">{t.title}</p>
                      <p className="text-slate-400 mt-0.5">{t.description}</p>
                    </div>
                    <span className={`px-2 py-0.5 font-bold rounded ${t.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                      {t.status}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center text-xs text-slate-400 py-8">
                  No tasks assigned to you today.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Dashboard;
