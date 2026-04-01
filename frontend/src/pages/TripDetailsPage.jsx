import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { tripsAPI } from '../api/api';
import { useAuth } from '../context/AuthContext';
import ChatBox from '../components/ChatBox';

const TripDetailsPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [trip, setTrip] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    tripsAPI.details(id).then((res) => setTrip(res.data)).catch(console.error);
  }, [id]);

  const handleJoin = async () => {
    await tripsAPI.requestJoin(id);
    setTrip((prev) => ({ ...prev }));
  };

  const handleRequestAction = async (requestId, action) => {
    await tripsAPI.updateRequest(id, requestId, action);
    tripsAPI.details(id).then((res) => setTrip(res.data)).catch(console.error);
  };

  if (!trip) {
    return <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center text-slate-500 shadow-soft dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">Loading trip details…</div>;
  }

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
        <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          <div>
            <h1 className="text-3xl font-semibold text-slate-900 dark:text-slate-100">{trip.destination}</h1>
            <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">{trip.description}</p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-3xl bg-slate-50 p-4 dark:bg-slate-950">
                <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Dates</p>
                <p className="mt-2 text-base font-semibold text-slate-900 dark:text-slate-100">{new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}</p>
              </div>
              <div className="rounded-3xl bg-slate-50 p-4 dark:bg-slate-950">
                <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Group size</p>
                <p className="mt-2 text-base font-semibold text-slate-900 dark:text-slate-100">{trip.members.length}/{trip.maxGroupSize}</p>
              </div>
            </div>
            <div className="mt-6 flex flex-wrap gap-3 text-sm text-slate-500 dark:text-slate-400">
              <div className="rounded-full border border-slate-200 px-3 py-2 dark:border-slate-700">Budget: {trip.budget}</div>
              <div className="rounded-full border border-slate-200 px-3 py-2 dark:border-slate-700">Created by: {trip.creatorId.name}</div>
            </div>
          </div>
          <div className="space-y-4">
            <img src={trip.image || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80'} alt={trip.destination} className="h-full min-h-[240px] w-full rounded-3xl object-cover" />
            <div className="rounded-3xl bg-slate-50 p-4 dark:bg-slate-950">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Members</h2>
              <div className="mt-3 space-y-3">
                {trip.members.map((member) => (
                  <div key={member._id || member} className="rounded-3xl bg-white p-3 shadow-sm dark:bg-slate-900">
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{member.name || member}</p>
                  </div>
                ))}
              </div>
            </div>
            {!trip.members.some((member) => member._id === user._id) && (
              <button onClick={handleJoin} className="w-full rounded-3xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-950">
                Request to join
              </button>
            )}
          </div>
        </div>
      </div>

      {trip.creatorId._id === user._id && trip.requests.length > 0 && (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Join requests</h2>
          <div className="mt-4 space-y-3">
            {trip.requests.map((request) => (
              <div key={request._id} className="flex flex-col gap-3 rounded-3xl border border-slate-200 p-4 dark:border-slate-800">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-slate-100">{request.userId.name}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{request.status}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleRequestAction(request._id, 'accept')} className="rounded-3xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-600">Accept</button>
                    <button onClick={() => handleRequestAction(request._id, 'reject')} className="rounded-3xl bg-rose-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-600">Reject</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <ChatBox tripId={id} user={user} />
    </div>
  );
};

export default TripDetailsPage;
