import React, { useState } from 'react';
import { useFarmData } from '../context/FarmDataContext';
import { useAuth } from '../context/AuthContext';
import DataTable from '../components/Common/DataTable';
import AlertBanner from '../components/Common/AlertBanner';
import Modal from '../components/Common/Modal';
import FormField from '../components/Common/FormField';
import { Plus, Minus, ArrowUpRight, ArrowDownRight, Package } from 'lucide-react';

const FeedInventory = () => {
  const { user } = useAuth();
  const {
    feedInventory,
    feedLogs,
    addIncomingFeed,
    logFeedConsumption,
    thresholds
  } = useFarmData();

  const [isIncomingModalOpen, setIsIncomingModalOpen] = useState(false);
  const [isConsumeModalOpen, setIsConsumeModalOpen] = useState(false);

  // Incoming Form State
  const [incomingFields, setIncomingFields] = useState({
    feedType: '',
    quantity: '',
    supplier: ''
  });
  const [incomingErrors, setIncomingErrors] = useState({});

  // Consumption Form State
  const [consumeFields, setConsumeFields] = useState({
    feedType: '',
    quantity: ''
  });
  const [consumeErrors, setConsumeErrors] = useState({});

  const isManagerOrAdmin = user?.role === 'Admin' || user?.role === 'Farm Manager';

  // Warnings calculation
  const depletedFeedItems = feedInventory.filter(f => f.stock < f.minThreshold);

  const handleOpenIncomingModal = () => {
    const defaultFeed = feedInventory.length > 0 ? feedInventory[0].type : '';
    setIncomingFields({
      feedType: defaultFeed,
      quantity: '',
      supplier: ''
    });
    setIncomingErrors({});
    setIsIncomingModalOpen(true);
  };

  const handleOpenConsumeModal = () => {
    const defaultFeed = feedInventory.length > 0 ? feedInventory[0].type : '';
    setConsumeFields({
      feedType: defaultFeed,
      quantity: ''
    });
    setConsumeErrors({});
    setIsConsumeModalOpen(true);
  };

  const handleIncomingSubmit = (e) => {
    e.preventDefault();
    const errors = {};
    if (!incomingFields.quantity || isNaN(incomingFields.quantity) || Number(incomingFields.quantity) <= 0) {
      errors.quantity = 'Quantity must be a positive number.';
    }
    if (!incomingFields.supplier.trim()) errors.supplier = 'Supplier Name is required.';

    if (Object.keys(errors).length > 0) {
      setIncomingErrors(errors);
      return;
    }

    addIncomingFeed(incomingFields.feedType, Number(incomingFields.quantity), incomingFields.supplier);
    setIsIncomingModalOpen(false);
  };

  const handleConsumeSubmit = (e) => {
    e.preventDefault();
    const errors = {};
    const feed = feedInventory.find(f => f.type === consumeFields.feedType);
    if (!consumeFields.quantity || isNaN(consumeFields.quantity) || Number(consumeFields.quantity) <= 0) {
      errors.quantity = 'Quantity must be a positive number.';
    } else if (feed && feed.stock < Number(consumeFields.quantity)) {
      errors.quantity = `Insufficient stock! Currently available: ${feed.stock} ${feed.unit}.`;
    }

    if (Object.keys(errors).length > 0) {
      setConsumeErrors(errors);
      return;
    }

    logFeedConsumption(consumeFields.feedType, Number(consumeFields.quantity), user.name);
    setIsConsumeModalOpen(false);
  };

  // Columns for Feed Logs
  const logColumns = [
    { header: 'ID', key: 'id', sortable: true },
    { header: 'Date', key: 'date', sortable: true },
    { header: 'Feed Type', key: 'feedType', sortable: true },
    {
      header: 'Quantity (kg)',
      key: 'quantity',
      render: (item) => (
        <span className={`font-bold ${item.action.includes('Incoming') ? 'text-emerald-600' : 'text-slate-700'}`}>
          {item.action.includes('Incoming') ? `+${item.quantity}` : `-${item.quantity}`}
        </span>
      )
    },
    {
      header: 'Operation',
      key: 'action',
      sortable: true,
      render: (item) => (
        <span className={`inline-flex items-center gap-1 text-xs font-bold ${item.action.includes('Incoming') ? 'text-emerald-700' : 'text-slate-600'}`}>
          {item.action.includes('Incoming') ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
          {item.action}
        </span>
      )
    },
    { header: 'Supplier', key: 'supplier', render: (item) => item.supplier || '-' },
    { header: 'Logged By', key: 'loggedBy' }
  ];

  // Options list for feed dropdowns
  const feedOptions = feedInventory.map(f => f.type);

  return (
    <div className="space-y-6">
      
      {/* Dynamic Depletion Banner */}
      {depletedFeedItems.length > 0 && (
        <div className="space-y-2">
          {depletedFeedItems.map(item => (
            <AlertBanner
              key={item.id}
              type="warning"
              message={`FEED STOCK ALERT: "${item.type}" is at ${item.stock}kg, which is below the threshold of ${item.minThreshold}kg!`}
              actionText={isManagerOrAdmin ? "Log Incoming Delivery" : null}
              onAction={isManagerOrAdmin ? handleOpenIncomingModal : null}
            />
          ))}
        </div>
      )}

      {/* Main Stock Display Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {feedInventory.map((item) => {
          const ratio = Math.min((item.stock / 1500) * 100, 100); // 1500 is mock max capacity
          const isLow = item.stock < item.minThreshold;
          return (
            <div key={item.id} className="glass-card rounded-2xl border border-slate-150/70 p-6 subtle-shadow hover-lift space-y-4 transition-all duration-300">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">{item.category}</span>
                <span className={`p-1.5 rounded-lg ${isLow ? 'bg-rose-50 text-rose-600' : 'bg-farm-50 text-farm-700'}`}>
                  <Package className="w-4.5 h-4.5" />
                </span>
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-sm">{item.type}</h4>
                <div className="flex items-baseline space-x-1 mt-1">
                  <span className="text-2xl font-bold text-slate-900">{item.stock}</span>
                  <span className="text-xs font-semibold text-slate-400">{item.unit}</span>
                </div>
              </div>
              
              {/* Progress bar to visual threshold */}
              <div className="space-y-1">
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${isLow ? 'bg-rose-500' : 'bg-farm-600'}`}
                    style={{ width: `${ratio}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-slate-400 font-semibold">
                  <span>Threshold: {item.minThreshold}kg</span>
                  <span>Cap: 1.5t</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Table grid of logs */}
      <div className="space-y-4">
        <div>
          <h3 className="text-base font-bold text-slate-800">Inventory Logs</h3>
          <p className="text-xxs text-slate-400 font-medium">Historical audit logs of feed usage and incoming loads.</p>
        </div>

        <DataTable
          columns={logColumns}
          data={feedLogs}
          searchPlaceholder="Search feed logs..."
          searchKeys={['feedType', 'action', 'loggedBy', 'supplier']}
          pageSize={5}
          actions={
            <div className="flex space-x-2">
              <button
                onClick={handleOpenConsumeModal}
                className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-lg shadow-sm flex items-center gap-1.5 focus:outline-none transition-colors cursor-pointer"
              >
                <Minus className="w-4 h-4 text-rose-500" /> Log Consumption
              </button>
              {isManagerOrAdmin && (
                <button
                  onClick={handleOpenIncomingModal}
                  className="px-4 py-2 bg-farm-600 hover:bg-farm-700 text-white font-bold text-xs rounded-lg shadow-sm hover:shadow flex items-center gap-1.5 focus:outline-none transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Add Incoming Stock
                </button>
              )}
            </div>
          }
        />
      </div>

      {/* Incoming Stock Modal */}
      <Modal
        isOpen={isIncomingModalOpen}
        onClose={() => setIsIncomingModalOpen(false)}
        title="Record Incoming Feed Intake"
        footer={
          <>
            <button
              onClick={() => setIsIncomingModalOpen(false)}
              className="px-4 py-2 border border-slate-200 hover:bg-slate-50 rounded-lg text-xs font-semibold text-slate-600 transition-colors focus:outline-none cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleIncomingSubmit}
              className="px-4 py-2 bg-farm-600 hover:bg-farm-700 text-white rounded-lg text-xs font-bold transition-colors focus:outline-none cursor-pointer"
            >
              Record Intake
            </button>
          </>
        }
      >
        <form onSubmit={handleIncomingSubmit} className="space-y-4">
          <FormField
            label="Feed Ingredient Type"
            name="feedType"
            type="select"
            value={incomingFields.feedType}
            onChange={(e) => setIncomingFields(prev => ({ ...prev, feedType: e.target.value }))}
            options={feedOptions}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              label="Quantity Received (kg)"
              name="quantity"
              type="number"
              value={incomingFields.quantity}
              onChange={(e) => setIncomingFields(prev => ({ ...prev, quantity: e.target.value }))}
              placeholder="e.g. 500"
              error={incomingErrors.quantity}
              required
            />
            <FormField
              label="Feed Supplier / Mills"
              name="supplier"
              value={incomingFields.supplier}
              onChange={(e) => setIncomingFields(prev => ({ ...prev, supplier: e.target.value }))}
              placeholder="e.g. National Feed Co."
              error={incomingErrors.supplier}
              required
            />
          </div>
        </form>
      </Modal>

      {/* Log Consumption Modal */}
      <Modal
        isOpen={isConsumeModalOpen}
        onClose={() => setIsConsumeModalOpen(false)}
        title="Log Daily Animal Feed Intake"
        footer={
          <>
            <button
              onClick={() => setIsConsumeModalOpen(false)}
              className="px-4 py-2 border border-slate-200 hover:bg-slate-50 rounded-lg text-xs font-semibold text-slate-600 transition-colors focus:outline-none cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleConsumeSubmit}
              className="px-4 py-2 bg-farm-600 hover:bg-farm-700 text-white rounded-lg text-xs font-bold transition-colors focus:outline-none cursor-pointer"
            >
              Log Consumption
            </button>
          </>
        }
      >
        <form onSubmit={handleConsumeSubmit} className="space-y-4">
          <FormField
            label="Feed Ingredient Type"
            name="feedType"
            type="select"
            value={consumeFields.feedType}
            onChange={(e) => setConsumeFields(prev => ({ ...prev, feedType: e.target.value }))}
            options={feedOptions}
            required
          />

          <FormField
            label="Quantity Consumed (kg)"
            name="quantity"
            type="number"
            value={consumeFields.quantity}
            onChange={(e) => setConsumeFields(prev => ({ ...prev, quantity: e.target.value }))}
            placeholder="e.g. 45"
            error={consumeErrors.quantity}
            required
          />
        </form>
      </Modal>

    </div>
  );
};

export default FeedInventory;
