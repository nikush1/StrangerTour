import { useState } from 'react';

const CreateTripModal = ({ open, onClose, onCreate }) => {
  const [form, setForm] = useState({
    destination: '',
    startDate: '',
    endDate: '',
    budget: 'medium',
    description: '',
    maxGroupSize: 4,
    image: ''
  });

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const submit = () => {
    onCreate(form);
    setForm({
      destination: '',
      startDate: '',
      endDate: '',
      budget: 'medium',
      description: '',
      maxGroupSize: 4,
      image: ''
    });
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4 py-6">
      <div className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-xl dark:bg-slate-950">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Create a new trip</h3>
          <button onClick={onClose} className="text-slate-500 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100">Close</button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <input
            value={form.destination}
            onChange={(e) => handleChange('destination', e.target.value)}
            placeholder="Destination"
            className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-sky-400 dark:border-slate-700 dark:bg-slate-900"
          />
          <input
            type="date"
            value={form.startDate}
            onChange={(e) => handleChange('startDate', e.target.value)}
            className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-sky-400 dark:border-slate-700 dark:bg-slate-900"
          />
          <input
            type="date"
            value={form.endDate}
            onChange={(e) => handleChange('endDate', e.target.value)}
            className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-sky-400 dark:border-slate-700 dark:bg-slate-900"
          />
          <select
            value={form.budget}
            onChange={(e) => handleChange('budget', e.target.value)}
            className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-sky-400 dark:border-slate-700 dark:bg-slate-900"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <input
            type="number"
            min="2"
            max="20"
            value={form.maxGroupSize}
            onChange={(e) => handleChange('maxGroupSize', Number(e.target.value))}
            placeholder="Max group size"
            className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-sky-400 dark:border-slate-700 dark:bg-slate-900"
          />
          <input
            value={form.image}
            onChange={(e) => handleChange('image', e.target.value)}
            placeholder="Trip image URL"
            className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-sky-400 dark:border-slate-700 dark:bg-slate-900"
          />
        </div>
        <textarea
          value={form.description}
          onChange={(e) => handleChange('description', e.target.value)}
          rows="4"
          placeholder="Trip description"
          className="mt-4 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-sky-400 dark:border-slate-700 dark:bg-slate-900"
        />
        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onClose} className="rounded-3xl border border-slate-200 px-5 py-3 text-sm text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800">
            Cancel
          </button>
          <button onClick={submit} className="rounded-3xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-950">
            Create Trip
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateTripModal;
