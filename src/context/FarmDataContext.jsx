import React, { createContext, useContext, useState, useEffect } from 'react';

const FarmDataContext = createContext(null);

// Initial Mock Data Seeding
const INITIAL_ANIMALS = [
  { id: 'ANI-001', type: 'Pig', breed: 'Landrace', age: '6 months', weight: 92, gender: 'Female', shedNumber: 'Shed A', healthStatus: 'Healthy', purchaseDate: '2026-01-15' },
  { id: 'ANI-002', type: 'Pig', breed: 'Yorkshire', age: '8 months', weight: 115, gender: 'Male', shedNumber: 'Shed A', healthStatus: 'Healthy', purchaseDate: '2025-12-10' },
  { id: 'ANI-003', type: 'Pig', breed: 'Duroc', age: '5 months', weight: 78, gender: 'Female', shedNumber: 'Shed B', healthStatus: 'Sick', purchaseDate: '2026-02-20' },
  { id: 'ANI-004', type: 'Poultry Batch', breed: 'White Leghorn', age: '12 weeks', weight: 1.8, gender: 'Mixed', shedNumber: 'Coop 1', healthStatus: 'Healthy', purchaseDate: '2026-04-10', quantity: 250 },
  { id: 'ANI-005', type: 'Poultry Batch', breed: 'Rhode Island Red', age: '16 weeks', weight: 2.1, gender: 'Mixed', shedNumber: 'Coop 2', healthStatus: 'Isolated', purchaseDate: '2026-03-05', quantity: 180 },
  { id: 'ANI-006', type: 'Pig', breed: 'Landrace', age: '4 months', weight: 55, gender: 'Male', shedNumber: 'Shed B', healthStatus: 'Healthy', purchaseDate: '2026-03-25' },
  { id: 'ANI-007', type: 'Pig', breed: 'Yorkshire', age: '7 months', weight: 104, gender: 'Female', shedNumber: 'Shed A', healthStatus: 'Under Treatment', purchaseDate: '2026-01-05' },
  { id: 'ANI-008', type: 'Poultry Batch', breed: 'White Leghorn', age: '8 weeks', weight: 1.1, gender: 'Mixed', shedNumber: 'Coop 1', healthStatus: 'Healthy', purchaseDate: '2026-05-12', quantity: 400 }
];

const INITIAL_VACCINATIONS = [
  { id: 'VAC-001', animalId: 'ANI-001', animalBreed: 'Landrace', vaccineName: 'Erysipelas Vaccine', dose: '2 ml', adminDate: '2026-07-02', nextDueDate: '2027-01-02', status: 'Completed' },
  { id: 'VAC-002', animalId: 'ANI-003', animalBreed: 'Duroc', vaccineName: 'Parvovirus Vaccine', dose: '2 ml', adminDate: '', nextDueDate: '2026-07-20', status: 'Scheduled' },
  { id: 'VAC-003', animalId: 'ANI-004', animalBreed: 'White Leghorn (Batch)', vaccineName: 'Newcastle Disease B1', dose: 'Drinking water', adminDate: '2026-06-15', nextDueDate: '2026-07-18', status: 'Scheduled' },
  { id: 'VAC-004', animalId: 'ANI-005', animalBreed: 'Rhode Island Red (Batch)', vaccineName: 'Fowl Pox Vaccine', dose: 'Wing web puncture', adminDate: '2026-05-20', nextDueDate: '2026-08-20', status: 'Completed' },
  { id: 'VAC-005', animalId: 'ANI-002', animalBreed: 'Yorkshire', vaccineName: 'Swine Influenza', dose: '2 ml', adminDate: '', nextDueDate: '2026-07-12', status: 'Overdue' }
];

const INITIAL_DISEASE_CASES = [
  { id: 'DIS-001', animalId: 'ANI-003', animalBreed: 'Duroc', symptoms: 'Lethargy, high temperature, red skin blotches', diseaseName: 'Pending Lab Report', status: 'Isolated', reporter: 'Amit Patel', reportDate: '2026-07-13', diagnosis: 'Suspected Erysipelas or Heat Stress', treatment: 'Administered cooling bath, isolate from herd, oral electrolytes.', isolationStart: '2026-07-13', isolationEnd: '' },
  { id: 'DIS-002', animalId: 'ANI-007', animalBreed: 'Yorkshire', symptoms: 'Coughing, nasal discharge, heavy breathing', diseaseName: 'Swine Influenza', status: 'Under Treatment', reporter: 'Vikram Rathore', reportDate: '2026-07-11', diagnosis: 'Swine Influenza Type A', treatment: 'Broad-spectrum antibiotics for secondary infection, ventilation check.', isolationStart: '2026-07-11', isolationEnd: '' },
  { id: 'DIS-003', animalId: 'ANI-005', animalBreed: 'Rhode Island Red (Batch)', symptoms: 'Lesions around comb and wattle', diseaseName: 'Fowl Pox', status: 'Isolated', reporter: 'Amit Patel', reportDate: '2026-07-12', diagnosis: 'Dry Fowl Pox outbreak', treatment: 'Iodine application on lesions, added vitamin booster to drinking water.', isolationStart: '2026-07-12', isolationEnd: '' },
  { id: 'DIS-004', animalId: 'ANI-006', animalBreed: 'Landrace', symptoms: 'Limping on rear right foot', diseaseName: 'Physical Injury', status: 'Recovered', reporter: 'Sunita Devi', reportDate: '2026-07-01', diagnosis: 'Minor hoof bruise', treatment: 'Cleaned hoof, applied zinc oxide ointment. Cured.', isolationStart: '', isolationEnd: '' }
];

const INITIAL_FEED_INVENTORY = [
  { id: 'FEED-001', type: 'Grower Mash', category: 'Poultry Feed', stock: 520, unit: 'kg', minThreshold: 150, supplier: 'Agro-Feeds India' },
  { id: 'FEED-002', type: 'Starter Crumbs', category: 'Poultry Feed', stock: 85, unit: 'kg', minThreshold: 100, supplier: 'Pranav Feed Mills' }, // Low stock!
  { id: 'FEED-003', type: 'Finisher Pellets', category: 'Pig Feed', stock: 1250, unit: 'kg', minThreshold: 300, supplier: 'National Livestock Feeds' },
  { id: 'FEED-004', type: 'Sow Breeder Feed', category: 'Pig Feed', stock: 240, unit: 'kg', minThreshold: 150, supplier: 'National Livestock Feeds' }
];

const INITIAL_FEED_LOGS = [
  { id: 'FL-001', date: '2026-07-15', feedType: 'Grower Mash', quantity: 45, loggedBy: 'Amit Patel', action: 'Consumption' },
  { id: 'FL-002', date: '2026-07-15', feedType: 'Finisher Pellets', quantity: 90, loggedBy: 'Amit Patel', action: 'Consumption' },
  { id: 'FL-003', date: '2026-07-14', feedType: 'Starter Crumbs', quantity: 20, loggedBy: 'Vikram Rathore', action: 'Consumption' },
  { id: 'FL-004', date: '2026-07-12', feedType: 'Finisher Pellets', quantity: 500, loggedBy: 'Sanjay Singh', action: 'Incoming Stock', supplier: 'National Livestock Feeds' }
];

const INITIAL_MEDICINE_INVENTORY = [
  { id: 'MED-001', name: 'Penicillin G Injection', stock: 18, unit: 'Vials', expiryDate: '2026-08-15', supplier: 'Hindustan Pharma' }, // Expiring soon
  { id: 'MED-002', name: 'Albendazole Dewormer', stock: 4, unit: 'Liters', expiryDate: '2027-04-10', supplier: 'Arogya Vet Care' },
  { id: 'MED-003', name: 'Newcastle Vaccine (B1)', stock: 50, unit: 'Doses', expiryDate: '2026-07-28', supplier: 'Hindustan Pharma' }, // Expiring very soon!
  { id: 'MED-004', name: 'Multi-Vitamin Booster', stock: 12, unit: 'Bottles', expiryDate: '2026-12-05', supplier: 'Arogya Vet Care' }
];

const INITIAL_MEDICINE_LOGS = [
  { id: 'ML-001', date: '2026-07-14', medicineName: 'Penicillin G Injection', quantity: 2, action: 'Purchased', expiryDate: '2026-08-15' },
  { id: 'ML-002', date: '2026-07-13', medicineName: 'Newcastle Vaccine (B1)', quantity: 50, action: 'Purchased', expiryDate: '2026-07-28' }
];

const INITIAL_WORKERS = [
  { id: 'W-001', name: 'Amit Patel', phone: '9876543210', role: 'Feeding & Log Attendant', joiningDate: '2024-05-10', status: 'Active' },
  { id: 'W-002', name: 'Vikram Rathore', phone: '9876543211', role: 'Shed & Biosecurity Cleaner', joiningDate: '2025-01-15', status: 'Active' },
  { id: 'W-003', name: 'Sunita Devi', phone: '9876543212', role: 'Health Watcher', joiningDate: '2025-06-20', status: 'Active' },
  { id: 'W-004', name: 'Ramesh Chawla', phone: '9876543213', role: 'General Laborer', joiningDate: '2026-02-01', status: 'Inactive' }
];

const INITIAL_ATTENDANCE = [
  { id: 'ATT-01', date: '2026-07-15', workerId: 'W-001', name: 'Amit Patel', status: 'Present' },
  { id: 'ATT-02', date: '2026-07-15', workerId: 'W-002', name: 'Vikram Rathore', status: 'Present' },
  { id: 'ATT-03', date: '2026-07-15', workerId: 'W-003', name: 'Sunita Devi', status: 'Leave' },
  { id: 'ATT-04', date: '2026-07-14', workerId: 'W-001', name: 'Amit Patel', status: 'Present' },
  { id: 'ATT-05', date: '2026-07-14', workerId: 'W-002', name: 'Vikram Rathore', status: 'Present' },
  { id: 'ATT-06', date: '2026-07-14', workerId: 'W-003', name: 'Sunita Devi', status: 'Present' }
];

const INITIAL_TASKS = [
  { id: 'TSK-001', title: 'Feed pigs in Shed A & Shed B', description: 'Morning schedule: 8:00 AM. Feed quantity: Finisher Pellets.', assignedTo: 'W-001', workerName: 'Amit Patel', date: '2026-07-15', status: 'Completed' },
  { id: 'TSK-002', title: 'Replenish footbath disinfectant at Shed A', description: 'Prepare 5% dilution of Phenolic compound.', assignedTo: 'W-002', workerName: 'Vikram Rathore', date: '2026-07-15', status: 'In Progress' },
  { id: 'TSK-003', title: 'Isolate ANI-003 and report vitals to Vet', description: 'Take temperature and ensure isolation pen is secure.', assignedTo: 'W-003', workerName: 'Sunita Devi', date: '2026-07-15', status: 'Pending' },
  { id: 'TSK-004', title: 'Clean and spray Coop 1 poultry layout', description: 'Remove manure, spray bio-safe virucide disinfectant.', assignedTo: 'W-002', workerName: 'Vikram Rathore', date: '2026-07-15', status: 'Pending' }
];

const INITIAL_VISITORS = [
  { id: 'VIS-001', date: '2026-07-15', name: 'Dr. Neha Sharma', agency: 'Govt Veterinary Hospital', purpose: 'Scheduled Health Checkup', vehicleNo: 'DL-3C-AS-1290', entryTime: '09:30 AM', exitTime: '11:45 AM', temperature: 36.6, status: 'Checked Out' },
  { id: 'VIS-002', date: '2026-07-15', name: 'Raj Kumar', agency: 'National Feed Co', purpose: 'Feed Bag Delivery', vehicleNo: 'HR-55-P-4402', entryTime: '02:15 PM', exitTime: '', temperature: 36.8, status: 'Checked In' },
  { id: 'VIS-003', date: '2026-07-14', name: 'Satish Gupta', agency: 'SafeShield Biosecurity', purpose: 'Disinfection Audit', vehicleNo: 'UP-16-BD-8833', entryTime: '11:00 AM', exitTime: '01:30 PM', temperature: 36.4, status: 'Checked Out' }
];

const INITIAL_BIOSECURITY_LOGS = [
  { id: 'BIO-001', date: '2026-07-15', shift: 'Morning', footbathChecked: true, footbathConcentration: 'Optimal', ppeCompliance: '100% Compliant', shedCleaned: 'Shed A, Coop 1', notes: 'All workers wearing respirators.' },
  { id: 'BIO-002', date: '2026-07-14', shift: 'Morning', footbathChecked: true, footbathConcentration: 'Low (Diluted)', ppeCompliance: '85% Compliant', shedCleaned: 'Shed B, Coop 2', notes: 'Footbath chemical refilled by worker.' }
];

export const FarmDataProvider = ({ children }) => {
  const [animals, setAnimals] = useState(INITIAL_ANIMALS);
  const [vaccinations, setVaccinations] = useState(INITIAL_VACCINATIONS);
  const [diseaseCases, setDiseaseCases] = useState(INITIAL_DISEASE_CASES);
  const [feedInventory, setFeedInventory] = useState(INITIAL_FEED_INVENTORY);
  const [feedLogs, setFeedLogs] = useState(INITIAL_FEED_LOGS);
  const [medicineInventory, setMedicineInventory] = useState(INITIAL_MEDICINE_INVENTORY);
  const [medicineLogs, setMedicineLogs] = useState(INITIAL_MEDICINE_LOGS);
  const [workers, setWorkers] = useState(INITIAL_WORKERS);
  const [attendance, setAttendance] = useState(INITIAL_ATTENDANCE);
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [visitors, setVisitors] = useState(INITIAL_VISITORS);
  const [biosecurityLogs, setBiosecurityLogs] = useState(INITIAL_BIOSECURITY_LOGS);

  // Settings & Thresholds
  const [thresholds, setThresholds] = useState({
    lowStockFeedLimit: 150, // kg
    expiryWindowDays: 30,  // days
    outbreakCountLimit: 2   // count of sick animals to warn
  });

  const [notifications, setNotifications] = useState([]);

  // Hook to calculate Alerts / Notifications dynamically based on state & thresholds
  useEffect(() => {
    const list = [];
    let notifId = 1;

    // 1. Low feed stock alerts
    feedInventory.forEach(f => {
      if (f.stock < thresholds.lowStockFeedLimit) {
        list.push({
          id: `N-${notifId++}`,
          type: 'Stock Alert',
          severity: 'high',
          message: `Low Feed Stock: "${f.type}" is at ${f.stock} ${f.unit} (Threshold: ${thresholds.lowStockFeedLimit} ${f.unit}).`,
          time: 'Just now',
          read: false
        });
      }
    });

    // 2. Expiry warnings for medicines
    const today = new Date('2026-07-15'); // Reference date
    medicineInventory.forEach(m => {
      const expDate = new Date(m.expiryDate);
      const diffTime = expDate - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays <= 0) {
        list.push({
          id: `N-${notifId++}`,
          type: 'Medicine Alert',
          severity: 'high',
          message: `Medicine Expired: "${m.name}" expired on ${m.expiryDate}!`,
          time: 'Expired',
          read: false
        });
      } else if (diffDays <= thresholds.expiryWindowDays) {
        list.push({
          id: `N-${notifId++}`,
          type: 'Medicine Alert',
          severity: 'medium',
          message: `Medicine Expiring: "${m.name}" expires in ${diffDays} days (${m.expiryDate}).`,
          time: 'Warning',
          read: false
        });
      }
    });

    // 3. Overdue vaccinations
    vaccinations.forEach(v => {
      if (v.status === 'Overdue') {
        list.push({
          id: `N-${notifId++}`,
          type: 'Vaccination Alert',
          severity: 'high',
          message: `Overdue Vaccination: ${v.vaccineName} for Animal ${v.animalId} due since ${v.nextDueDate}.`,
          time: 'Immediate',
          read: false
        });
      } else if (v.status === 'Scheduled') {
        const dueDate = new Date(v.nextDueDate);
        const diffDays = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
        if (diffDays >= 0 && diffDays <= 7) {
          list.push({
            id: `N-${notifId++}`,
            type: 'Vaccination Alert',
            severity: 'medium',
            message: `Vaccination Scheduled: ${v.vaccineName} for Animal ${v.animalId} in ${diffDays} days (${v.nextDueDate}).`,
            time: 'Due soon',
            read: false
          });
        }
      }
    });

    // 4. Disease outbreak warning
    const activeSickSheds = {};
    diseaseCases.forEach(c => {
      if (c.status === 'Isolated' || c.status === 'Under Treatment') {
        // Find animal shed
        const anim = animals.find(a => a.id === c.animalId);
        if (anim) {
          activeSickSheds[anim.shedNumber] = (activeSickSheds[anim.shedNumber] || 0) + 1;
        }
      }
    });

    Object.keys(activeSickSheds).forEach(shed => {
      if (activeSickSheds[shed] >= thresholds.outbreakCountLimit) {
        list.push({
          id: `N-${notifId++}`,
          type: 'Disease Outbreak Alert',
          severity: 'high',
          message: `Outbreak Alert: ${activeSickSheds[shed]} sick/isolated animals in ${shed} (Threshold: ${thresholds.outbreakCountLimit}).`,
          time: 'Active Outbreak',
          read: false
        });
      }
    });

    setNotifications(list);
  }, [animals, vaccinations, diseaseCases, feedInventory, medicineInventory, thresholds]);

  // Notifications API
  const markNotificationAsRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  // Animals CRUD
  const addAnimal = (animal) => {
    const newId = `ANI-${String(animals.length + 1).padStart(3, '0')}`;
    setAnimals(prev => [...prev, { ...animal, id: newId }]);
  };

  const updateAnimal = (id, updatedFields) => {
    setAnimals(prev => prev.map(a => a.id === id ? { ...a, ...updatedFields } : a));
    // Sync health status with disease cases if health status changes
    if (updatedFields.healthStatus) {
      if (updatedFields.healthStatus === 'Healthy') {
        // Mark active disease cases for this animal as Recovered
        setDiseaseCases(prev => prev.map(dc => 
          dc.animalId === id && (dc.status === 'Isolated' || dc.status === 'Under Treatment') 
            ? { ...dc, status: 'Recovered', isolationEnd: '2026-07-15' } 
            : dc
        ));
      }
    }
  };

  const deleteAnimal = (id) => {
    setAnimals(prev => prev.filter(a => a.id !== id));
  };

  // Vaccinations CRUD
  const addVaccination = (vac) => {
    const newId = `VAC-${String(vaccinations.length + 1).padStart(3, '0')}`;
    const anim = animals.find(a => a.id === vac.animalId);
    setVaccinations(prev => [...prev, {
      ...vac,
      id: newId,
      animalBreed: anim ? anim.breed : 'Unknown',
      status: vac.status || 'Scheduled'
    }]);
  };

  const completeVaccination = (id) => {
    setVaccinations(prev => prev.map(v => 
      v.id === id 
        ? { ...v, status: 'Completed', adminDate: '2026-07-15' } 
        : v
    ));
  };

  // Disease Cases CRUD
  const addDiseaseCase = (dc) => {
    const newId = `DIS-${String(diseaseCases.length + 1).padStart(3, '0')}`;
    const anim = animals.find(a => a.id === dc.animalId);
    setDiseaseCases(prev => [...prev, {
      ...dc,
      id: newId,
      animalBreed: anim ? anim.breed : 'Unknown',
      status: dc.status || 'Reported',
      reportDate: '2026-07-15'
    }]);

    // Update Animal status
    if (anim) {
      updateAnimal(dc.animalId, { healthStatus: dc.status === 'Isolated' ? 'Isolated' : 'Sick' });
    }
  };

  const updateDiseaseCase = (id, updatedFields) => {
    setDiseaseCases(prev => prev.map(dc => {
      if (dc.id === id) {
        const updated = { ...dc, ...updatedFields };
        // Sync Animal health state
        let newHealth = 'Healthy';
        if (updated.status === 'Isolated') newHealth = 'Isolated';
        else if (updated.status === 'Under Treatment') newHealth = 'Under Treatment';
        else if (updated.status === 'Reported') newHealth = 'Sick';
        else if (updated.status === 'Recovered' || updated.status === 'Closed') newHealth = 'Healthy';
        
        updateAnimal(dc.animalId, { healthStatus: newHealth });
        return updated;
      }
      return dc;
    }));
  };

  // Feed Log / Stock Methods
  const addIncomingFeed = (feedType, qty, supplier) => {
    setFeedInventory(prev => prev.map(f => 
      f.type === feedType ? { ...f, stock: f.stock + qty } : f
    ));
    setFeedLogs(prev => [
      {
        id: `FL-${Date.now()}`,
        date: '2026-07-15',
        feedType,
        quantity: qty,
        loggedBy: 'Sanjay Singh (Manager)',
        action: 'Incoming Stock',
        supplier
      },
      ...prev
    ]);
  };

  const logFeedConsumption = (feedType, qty, workerName) => {
    let success = false;
    setFeedInventory(prev => prev.map(f => {
      if (f.type === feedType) {
        if (f.stock >= qty) {
          success = true;
          return { ...f, stock: f.stock - qty };
        }
      }
      return f;
    }));

    if (success) {
      setFeedLogs(prev => [
        {
          id: `FL-${Date.now()}`,
          date: '2026-07-15',
          feedType,
          quantity: qty,
          loggedBy: workerName || 'Amit Patel',
          action: 'Consumption'
        },
        ...prev
      ]);
    }
    return success;
  };

  // Medicine Inventory Methods
  const purchaseMedicine = (name, qty, expiryDate, supplier) => {
    let exists = false;
    setMedicineInventory(prev => prev.map(m => {
      if (m.name.toLowerCase() === name.toLowerCase()) {
        exists = true;
        return { ...m, stock: m.stock + qty, expiryDate, supplier };
      }
      return m;
    }));

    if (!exists) {
      setMedicineInventory(prev => [...prev, {
        id: `MED-${String(medicineInventory.length + 1).padStart(3, '0')}`,
        name,
        stock: qty,
        unit: 'Vials',
        expiryDate,
        supplier
      }]);
    }

    setMedicineLogs(prev => [
      {
        id: `ML-${Date.now()}`,
        date: '2026-07-15',
        medicineName: name,
        quantity: qty,
        action: 'Purchased',
        expiryDate
      },
      ...prev
    ]);
  };

  const useMedicine = (name, qty) => {
    let success = false;
    setMedicineInventory(prev => prev.map(m => {
      if (m.name.toLowerCase() === name.toLowerCase()) {
        if (m.stock >= qty) {
          success = true;
          return { ...m, stock: m.stock - qty };
        }
      }
      return m;
    }));

    if (success) {
      setMedicineLogs(prev => [
        {
          id: `ML-${Date.now()}`,
          date: '2026-07-15',
          medicineName: name,
          quantity: qty,
          action: 'Used'
        },
        ...prev
      ]);
    }
    return success;
  };

  // Biosecurity
  const addVisitorLog = (visitor) => {
    const newId = `VIS-${String(visitors.length + 1).padStart(3, '0')}`;
    setVisitors(prev => [
      {
        ...visitor,
        id: newId,
        date: '2026-07-15',
        status: visitor.exitTime ? 'Checked Out' : 'Checked In'
      },
      ...prev
    ]);
  };

  const checkoutVisitor = (id, exitTime) => {
    setVisitors(prev => prev.map(v => 
      v.id === id ? { ...v, exitTime, status: 'Checked Out' } : v
    ));
  };

  const addBiosecurityLog = (log) => {
    const newId = `BIO-${String(biosecurityLogs.length + 1).padStart(3, '0')}`;
    setBiosecurityLogs(prev => [
      {
        ...log,
        id: newId,
        date: '2026-07-15'
      },
      ...prev
    ]);
  };

  // Worker Management & Attendance & Tasks
  const saveWorkerProfile = (worker) => {
    if (worker.id) {
      setWorkers(prev => prev.map(w => w.id === worker.id ? { ...w, ...worker } : w));
    } else {
      const newId = `W-${String(workers.length + 1).padStart(3, '0')}`;
      setWorkers(prev => [...prev, { ...worker, id: newId, status: 'Active', joiningDate: '2026-07-15' }]);
    }
  };

  const deleteWorker = (id) => {
    setWorkers(prev => prev.map(w => w.id === id ? { ...w, status: 'Inactive' } : w));
  };

  const markAttendance = (date, workerId, status, name) => {
    setAttendance(prev => {
      const exists = prev.find(att => att.date === date && att.workerId === workerId);
      if (exists) {
        return prev.map(att => att.date === date && att.workerId === workerId ? { ...att, status } : att);
      } else {
        return [
          ...prev,
          {
            id: `ATT-${Date.now()}`,
            date,
            workerId,
            name,
            status
          }
        ];
      }
    });
  };

  const addTask = (task) => {
    const newId = `TSK-${String(tasks.length + 1).padStart(3, '0')}`;
    const w = workers.find(work => work.id === task.assignedTo);
    setTasks(prev => [...prev, {
      ...task,
      id: newId,
      workerName: w ? w.name : 'Unassigned',
      date: '2026-07-15',
      status: 'Pending'
    }]);
  };

  const toggleTaskStatus = (id, newStatus) => {
    setTasks(prev => prev.map(t => 
      t.id === id ? { ...t, status: newStatus } : t
    ));
  };

  return (
    <FarmDataContext.Provider value={{
      animals, addAnimal, updateAnimal, deleteAnimal,
      vaccinations, addVaccination, completeVaccination,
      diseaseCases, addDiseaseCase, updateDiseaseCase,
      feedInventory, feedLogs, addIncomingFeed, logFeedConsumption,
      medicineInventory, medicineLogs, purchaseMedicine, useMedicine,
      workers, saveWorkerProfile, deleteWorker,
      attendance, markAttendance,
      tasks, addTask, toggleTaskStatus,
      visitors, addVisitorLog, checkoutVisitor,
      biosecurityLogs, addBiosecurityLog,
      thresholds, setThresholds,
      notifications, markNotificationAsRead, markAllNotificationsAsRead
    }}>
      {children}
    </FarmDataContext.Provider>
  );
};

export const useFarmData = () => {
  const context = useContext(FarmDataContext);
  if (!context) {
    throw new Error('useFarmData must be used within a FarmDataProvider');
  }
  return context;
};
