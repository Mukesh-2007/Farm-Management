import React, { useState } from 'react';
import { useFarmData } from '../context/FarmDataContext';
import { useAuth } from '../context/AuthContext';
import DataTable from '../components/Common/DataTable';
import StatusBadge from '../components/Common/StatusBadge';
import Modal from '../components/Common/Modal';
import FormField from '../components/Common/FormField';
import AlertBanner from '../components/Common/AlertBanner';
import { Plus, HeartPulse, ShieldAlert, BadgeAlert } from 'lucide-react';

const MedicineInventory = () => {
  const { user } = useAuth();
  const {
    medicineInventory,
    medicineLogs,
    purchaseMedicine,
    useMedicine,
    thresholds
  } = useFarmData();

  const [isModalOpen, setIsModalOpen] = useState(false);

  // Purchase Form State
  const [formFields, setFormFields] = useState({
    name: '',
    quantity: '',
    expiryDate: '',
    supplier: ''
  });
  const [formErrors, setFormErrors] = useState({});

  const isVetOrManager = user?.role === 'Admin' || user?.role === 'Farm Manager' || user?.role === 'Veterinarian';

  // Expiry alerts calculation
  const today = new Date('2026-07-15');
  const alertMedicines = medicineInventory.filter(m => {
    const expDate = new Date(m.expiryDate);
    const diffDays = Math.ceil((expDate - today) / (1000 * 60 * 60 * 24));
    return diffDays <= thresholds.expiryWindowDays;
  });

  const handleOpenModal = () => {
    setFormFields({
      name: '',
      quantity: '',
      expiryDate: new Date(today.getTime() + (90 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0], // default 90 days out
      supplier: ''
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
    if (!formFields.name.trim()) errors.name = 'Medicine Name is required.';
    if (!formFields.quantity || isNaN(formFields.quantity) || Number(formFields.quantity) <= 0) {
      errors.quantity = 'Quantity must be a positive number.';
    }
    if (!formFields.expiryDate) errors.expiryDate = 'Expiry Date is required.';
    if (!formFields.supplier.trim()) errors.supplier = 'Supplier is required.';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePurchaseSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    purchaseMedicine(
      formFields.name,
      Number(formFields.quantity),
      formFields.expiryDate,
      formFields.supplier
    );
    setIsModalOpen(false);
  };

  // Medicine logs columns
  const logColumns = [
    { header: 'Date Logged', key: 'date', sortable: true },
    { header: 'Medicine Name', key: 'medicineName', sortable: true },
    {
      header: 'Operation',
      key: 'action',
      sortable: true,
      render: (item) => (
        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${
          item.action === 'Purchased' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
        }`}>
          {item.action}
        </span>
      )
    },
    { header: 'Quantity', key: 'quantity', render: (item) => `${item.quantity} units` }
  ];

  // Medicine stock columns
  const stockColumns = [
    { header: 'Drug Code', key: 'id', sortable: true },
    { header: 'Medicine Name', key: 'name', sortable: true },
    { header: 'Current Stock', key: 'stock', render: (item) => `${item.stock} ${item.unit}` },
    {
      header: 'Expiry Date',
      key: 'expiryDate',
      sortable: true,
      render: (item) => {
        const exp = new Date(item.expiryDate);
        const diff = Math.ceil((exp - today) / (1000 * 60 * 60 * 24));
        if (diff <= 0) {
          return <span className="text-rose-600 font-bold flex items-center gap-1"><BadgeAlert className="w-4 h-4 animate-ping" /> Expired ({item.expiryDate})</span>;
        }
        if (diff <= thresholds.expiryWindowDays) {
          return <span className="text-amber-600 font-bold">Expires in {diff} days</span>;
        }
        return <span className="text-slate-600 font-medium">{item.expiryDate}</span>;
      }
    },
    { header: 'Supplier', key: 'supplier', sortable: true }
  ];

  return (
    <div className="space-y-6">
      
      {/* Expiry alerts banners list */}
      {alertMedicines.length > 0 && (
        <div className="space-y-2">
          {alertMedicines.map(item => {
            const exp = new Date(item.expiryDate);
            const diff = Math.ceil((exp - today) / (1000 * 60 * 60 * 24));
            const isExpired = diff <= 0;
            return (
              <AlertBanner
                key={item.id}
                type="error"
                message={
                  isExpired 
                    ? `DRUG EXPIRED: Medicine "${item.name}" expired on ${item.expiryDate}! Please dispose safely.`
                    : `EXPIRY WARNING: Medicine "${item.name}" expires in ${diff} days (${item.expiryDate}).`
                }
              />
            );
          })}
        </div>
      )}

      {/* Main Stock Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-800">Veterinary Dispensary Stock</h3>
            <p className="text-xxs text-slate-400 font-medium">Overview of available medical stocks, vaccine doses, and health supplements.</p>
          </div>
        </div>

        <DataTable
          columns={stockColumns}
          data={medicineInventory}
          searchPlaceholder="Search drugs..."
          searchKeys={['name', 'supplier', 'id']}
          pageSize={5}
          actions={
            isVetOrManager && (
              <button
                onClick={handleOpenModal}
                className="px-4 py-2 bg-farm-600 hover:bg-farm-700 text-white font-bold text-xs rounded-lg shadow-sm hover:shadow flex items-center gap-1.5 focus:outline-none transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Purchase Medicine
              </button>
            )
          }
        />
      </div>

      {/* Audit Log Table */}
      <div className="space-y-4 pt-4">
        <div>
          <h3 className="text-base font-bold text-slate-800">Dispensary Audit Trail</h3>
          <p className="text-xxs text-slate-400 font-medium">History of restock purchases and clinical usage logs.</p>
        </div>
        <DataTable
          columns={logColumns}
          data={medicineLogs}
          searchPlaceholder="Search audit logs..."
          searchKeys={['medicineName', 'action']}
          pageSize={4}
        />
      </div>

      {/* Restock Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Purchase & Stock Medicines"
        footer={
          <>
            <button
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 border border-slate-200 hover:bg-slate-50 rounded-lg text-xs font-semibold text-slate-600 transition-colors focus:outline-none cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handlePurchaseSubmit}
              className="px-4 py-2 bg-farm-600 hover:bg-farm-700 text-white rounded-lg text-xs font-bold transition-colors focus:outline-none cursor-pointer"
            >
              Log Purchase
            </button>
          </>
        }
      >
        <form onSubmit={handlePurchaseSubmit} className="space-y-4">
          <FormField
            label="Medicine/Vaccine Name"
            name="name"
            value={formFields.name}
            onChange={handleInputChange}
            placeholder="e.g. Newcastle Vaccine (B1), Penicillin G"
            error={formErrors.name}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              label="Purchase Quantity"
              name="quantity"
              type="number"
              value={formFields.quantity}
              onChange={handleInputChange}
              placeholder="e.g. 50"
              error={formErrors.quantity}
              required
            />
            <FormField
              label="Expiry Date"
              name="expiryDate"
              type="date"
              value={formFields.expiryDate}
              onChange={handleInputChange}
              error={formErrors.expiryDate}
              required
            />
          </div>

          <FormField
            label="Pharmaceutical Supplier"
            name="supplier"
            value={formFields.supplier}
            onChange={handleInputChange}
            placeholder="e.g. Hindustan Pharma Ltd"
            error={formErrors.supplier}
            required
          />
        </form>
      </Modal>

    </div>
  );
};

export default MedicineInventory;
