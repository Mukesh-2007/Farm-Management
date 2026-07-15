import React, { useState } from 'react';
import { useFarmData } from '../context/FarmDataContext';
import { useAuth } from '../context/AuthContext';
import DataTable from '../components/Common/DataTable';
import StatusBadge from '../components/Common/StatusBadge';
import Modal from '../components/Common/Modal';
import FormField from '../components/Common/FormField';
import { Plus, Edit2, Trash2 } from 'lucide-react';

const Animals = () => {
  const { user } = useAuth();
  const { animals, addAnimal, updateAnimal, deleteAnimal } = useFarmData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAnimal, setSelectedAnimal] = useState(null);

  // Form states
  const [formFields, setFormFields] = useState({
    type: 'Pig',
    breed: '',
    age: '',
    weight: '',
    gender: 'Female',
    shedNumber: 'Shed A',
    healthStatus: 'Healthy',
    purchaseDate: new Date().toISOString().split('T')[0]
  });

  const [formErrors, setFormErrors] = useState({});

  // Filters state
  const [filterShed, setFilterShed] = useState('');
  const [filterBreed, setFilterBreed] = useState('');
  const [filterHealth, setFilterHealth] = useState('');

  const isEditable = user?.role === 'Admin' || user?.role === 'Farm Manager';

  // Available unique breeds and sheds for filter selectors
  const uniqueSheds = [...new Set(animals.map(a => a.shedNumber))];
  const uniqueBreeds = [...new Set(animals.map(a => a.breed))];

  // Filtering data logic
  const filteredAnimals = animals.filter(animal => {
    return (
      (filterShed === '' || animal.shedNumber === filterShed) &&
      (filterBreed === '' || animal.breed === filterBreed) &&
      (filterHealth === '' || animal.healthStatus === filterHealth)
    );
  });

  const handleOpenAddModal = () => {
    setSelectedAnimal(null);
    setFormFields({
      type: 'Pig',
      breed: '',
      age: '',
      weight: '',
      gender: 'Female',
      shedNumber: 'Shed A',
      healthStatus: 'Healthy',
      purchaseDate: new Date().toISOString().split('T')[0]
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (animal) => {
    setSelectedAnimal(animal);
    setFormFields({
      type: animal.type,
      breed: animal.breed,
      age: animal.age,
      weight: animal.weight,
      gender: animal.gender,
      shedNumber: animal.shedNumber,
      healthStatus: animal.healthStatus,
      purchaseDate: animal.purchaseDate
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
    if (!formFields.breed.trim()) errors.breed = 'Breed is required.';
    if (!formFields.age.trim()) errors.age = 'Age is required (e.g. 6 months, 8 weeks).';
    if (!formFields.weight || isNaN(formFields.weight) || Number(formFields.weight) <= 0) {
      errors.weight = 'Weight must be a positive number.';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveAnimal = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const animalData = {
      ...formFields,
      weight: Number(formFields.weight)
    };

    if (selectedAnimal) {
      updateAnimal(selectedAnimal.id, animalData);
    } else {
      addAnimal(animalData);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id) => {
    if (window.confirm(`Are you sure you want to remove animal ${id}?`)) {
      deleteAnimal(id);
    }
  };

  // Table Columns config
  const columns = [
    { header: 'Animal ID', key: 'id', sortable: true },
    { header: 'Type', key: 'type', sortable: true },
    { header: 'Breed', key: 'breed', sortable: true },
    { header: 'Age', key: 'age', sortable: true },
    { header: 'Weight (kg)', key: 'weight', sortable: true },
    { header: 'Gender', key: 'gender', sortable: true },
    { header: 'Shed Number', key: 'shedNumber', sortable: true },
    {
      header: 'Health Status',
      key: 'healthStatus',
      sortable: true,
      render: (item) => <StatusBadge status={item.healthStatus} />
    },
    { header: 'Purchase Date', key: 'purchaseDate', sortable: true },
    ...(isEditable
      ? [
          {
            header: 'Actions',
            key: 'actions',
            render: (item) => (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleOpenEditModal(item)}
                  className="p-1 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-farm-600 transition-colors focus:outline-none"
                  title="Edit Animal"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-1 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-rose-600 transition-colors focus:outline-none"
                  title="Remove Animal"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )
          }
        ]
      : [])
  ];

  // Custom filters header layout
  const filterElements = (
    <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
      <select
        value={filterShed}
        onChange={(e) => setFilterShed(e.target.value)}
        className="px-2.5 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-farm-500 bg-white"
      >
        <option value="">All Sheds</option>
        {uniqueSheds.map(shed => <option key={shed} value={shed}>{shed}</option>)}
      </select>

      <select
        value={filterBreed}
        onChange={(e) => setFilterBreed(e.target.value)}
        className="px-2.5 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-farm-500 bg-white"
      >
        <option value="">All Breeds</option>
        {uniqueBreeds.map(breed => <option key={breed} value={breed}>{breed}</option>)}
      </select>

      <select
        value={filterHealth}
        onChange={(e) => setFilterHealth(e.target.value)}
        className="px-2.5 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-farm-500 bg-white"
      >
        <option value="">All Health Statuses</option>
        <option value="Healthy">Healthy</option>
        <option value="Sick">Sick</option>
        <option value="Isolated">Isolated</option>
        <option value="Under Treatment">Under Treatment</option>
      </select>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Animal Registry</h2>
          <p className="text-xs text-slate-500 mt-1">Register livestock, manage sheds, and log weight records.</p>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={filteredAnimals}
        searchPlaceholder="Search ID or Breed..."
        searchKeys={['id', 'breed', 'shedNumber']}
        pageSize={6}
        customFilters={filterElements}
        actions={
          isEditable && (
            <button
              onClick={handleOpenAddModal}
              className="px-4 py-2 bg-farm-600 hover:bg-farm-700 text-white font-bold text-xs rounded-lg shadow-sm hover:shadow flex items-center gap-1.5 focus:outline-none cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add Animal
            </button>
          )
        }
      />

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedAnimal ? `Edit Animal Profile (${selectedAnimal.id})` : 'Register New Livestock'}
        footer={
          <>
            <button
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 border border-slate-200 hover:bg-slate-50 rounded-lg text-xs font-semibold text-slate-600 transition-colors focus:outline-none cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveAnimal}
              className="px-4 py-2 bg-farm-600 hover:bg-farm-700 text-white rounded-lg text-xs font-bold transition-colors focus:outline-none cursor-pointer"
            >
              Save Profile
            </button>
          </>
        }
      >
        <form onSubmit={handleSaveAnimal} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField
              label="Livestock Category"
              name="type"
              type="select"
              value={formFields.type}
              onChange={handleInputChange}
              options={['Pig', 'Poultry Batch']}
              required
            />
            <FormField
              label="Breed"
              name="breed"
              value={formFields.breed}
              onChange={handleInputChange}
              placeholder="e.g. Landrace, White Leghorn"
              error={formErrors.breed}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              label="Age"
              name="age"
              value={formFields.age}
              onChange={handleInputChange}
              placeholder="e.g. 6 months, 12 weeks"
              error={formErrors.age}
              required
            />
            <FormField
              label="Weight (kg)"
              name="weight"
              type="number"
              value={formFields.weight}
              onChange={handleInputChange}
              placeholder="e.g. 95 or 1.8"
              error={formErrors.weight}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              label="Gender"
              name="gender"
              type="select"
              value={formFields.gender}
              onChange={handleInputChange}
              options={['Female', 'Male', 'Mixed']}
              required
            />
            <FormField
              label="Shed / Location"
              name="shedNumber"
              type="select"
              value={formFields.shedNumber}
              onChange={handleInputChange}
              options={['Shed A', 'Shed B', 'Coop 1', 'Coop 2']}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              label="Health Status"
              name="healthStatus"
              type="select"
              value={formFields.healthStatus}
              onChange={handleInputChange}
              options={['Healthy', 'Sick', 'Isolated', 'Under Treatment']}
              required
            />
            <FormField
              label="Purchase/Hatch Date"
              name="purchaseDate"
              type="date"
              value={formFields.purchaseDate}
              onChange={handleInputChange}
              required
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Animals;
