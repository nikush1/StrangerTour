import { useEffect, useState } from 'react';
import TripCard from '../components/TripCard';
import { tripsAPI } from '../api/api';

const TripsPage = () => {
  const [trips, setTrips] = useState([]);
  const [filters, setFilters] = useState({ location: '', budget: '', startDate: '', endDate: '' });

  useEffect(() => {
    tripsAPI.all().then((res) => setTrips(res.data)).catch(console.error);
  }, []);

  const filteredTrips = trips.filter((trip) => {
    if (filters.location && !trip.destination.toLowerCase().includes(filters.location.toLowerCase())) return false;
    if (filters.budget && trip.budget !== filters.budget) return false;
    if (filters.startDate && new Date(trip.startDate) < new Date(filters.startDate)) return false;
    if (filters.endDate && new Date(trip.endDate) > new Date(filters.endDate)) return false;
    return true;
  });

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Trip feed</h1>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Browse public group trips and discover your next adventure.</p>
          </div>
        </div>
        <div className="mt-6 grid gap-3 md:grid-cols-4">
          <input
            value={filters.location}
            onChange={(e) => setFilters({ ...filters, location: e.target.value })}
            placeholder="Search destination"
            className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-sky-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          />
          <select
            value={filters.budget}
            onChange={(e) => setFilters({ ...filters, budget: e.target.value })}
            className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-sky-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          >
            <option value="">All budgets</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <input
            type="date"
            value={filters.startDate}
            onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
            className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-sky-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          />
          <input
            type="date"
            value={filters.endDate}
            onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
            className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-sky-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          />
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {filteredTrips.map((trip) => (
          <TripCard key={trip._id} trip={trip} />
        ))}
      </div>
    </div>
  );
};

export default TripsPage;
