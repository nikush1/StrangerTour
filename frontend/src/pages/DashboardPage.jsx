import { useEffect, useState } from 'react';
import { tripsAPI, userAPI } from '../api/api';
import { useAuth } from '../context/AuthContext';
import CreateTripModal from '../components/CreateTripModal';
import TripCard from '../components/TripCard';
import UserCard from '../components/UserCard';

const DashboardPage = () => {
  const { user } = useAuth();
  const [recommended, setRecommended] = useState([]);
  const [suggested, setSuggested] = useState([]);
  const [myTrips, setMyTrips] = useState({ owned: [], joined: [] });
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    tripsAPI.recommended().then((res) => setRecommended(res.data)).catch(console.error);
    userAPI.suggested().then((res) => setSuggested(res.data)).catch(console.error);
    tripsAPI.mine().then((res) => setMyTrips(res.data)).catch(console.error);
  }, []);

  const handleCreate = async (payload) => {
    await tripsAPI.create(payload);
    setModalOpen(false);
    tripsAPI.mine().then((res) => setMyTrips(res.data)).catch(console.error);
  };

  return (
    <div className="space-y-8">
      <section className="grid gap-6 md:grid-cols-[1.6fr_1fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-semibold text-slate-900 dark:text-slate-100">Hello, {user?.name}</h1>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Discover trips, connect with fellow travelers, and plan your next adventure.</p>
            </div>
            <button onClick={() => setModalOpen(true)} className="rounded-3xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-950">
              Create trip
            </button>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl bg-sky-500/10 p-4 text-slate-900 dark:bg-slate-100/10 dark:text-slate-100">
              <p className="text-sm uppercase tracking-[0.24em] text-sky-600">Trips joined</p>
              <p className="mt-3 text-3xl font-semibold">{myTrips.joined.length}</p>
            </div>
            <div className="rounded-3xl bg-slate-100 p-4 text-slate-900 dark:bg-slate-800 dark:text-slate-100">
              <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Trips created</p>
              <p className="mt-3 text-3xl font-semibold">{myTrips.owned.length}</p>
            </div>
          </div>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Suggested travelers</h2>
          <div className="mt-6 space-y-4">
            {suggested.map((traveler) => (
              <UserCard key={traveler._id} traveler={traveler} />
            ))}
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Recommended Trips</h2>
          <span className="text-sm text-slate-500 dark:text-slate-400">Based on your interests</span>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {recommended.map((trip) => (
            <TripCard key={trip._id} trip={trip} />
          ))}
        </div>
      </section>

      <CreateTripModal open={modalOpen} onClose={() => setModalOpen(false)} onCreate={handleCreate} />
    </div>
  );
};

export default DashboardPage;
