import { useNavigate } from 'react-router-dom';

const TripCard = ({ trip }) => {
  const navigate = useNavigate();
  return (
    <div className="group rounded-3xl border border-slate-200 bg-white p-5 shadow-soft transition hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-4 h-52 overflow-hidden rounded-3xl bg-slate-100 dark:bg-slate-800">
        <img src={trip.image || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80'} alt={trip.destination} className="h-full w-full object-cover" />
      </div>
      <div className="mb-4">
        <p className="text-xs uppercase tracking-[0.3em] text-sky-600">{trip.budget} budget</p>
        <h3 className="mt-2 text-xl font-semibold text-slate-900 dark:text-slate-100">{trip.destination}</h3>
        <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{trip.description.slice(0, 100)}...</p>
      </div>
      <div className="flex items-center justify-between gap-3 text-sm text-slate-500 dark:text-slate-400">
        <span>{new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}</span>
        <button
          onClick={() => navigate(`/trips/${trip._id}`)}
          className="rounded-full bg-slate-950 px-4 py-2 text-white transition hover:bg-slate-700 dark:bg-slate-100 dark:text-slate-950"
        >
          View
        </button>
      </div>
    </div>
  );
};

export default TripCard;
