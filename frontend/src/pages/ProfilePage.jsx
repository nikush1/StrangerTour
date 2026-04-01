import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { userAPI } from '../api/api';

const ProfilePage = () => {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || '',
    profilePic: user?.profilePic || '',
    bio: user?.bio || '',
    interests: user?.interests?.join(', ') || '',
    budget: user?.budget || 'medium'
  });

  useEffect(() => {
    setForm({
      name: user?.name || '',
      profilePic: user?.profilePic || '',
      bio: user?.bio || '',
      interests: user?.interests?.join(', ') || '',
      budget: user?.budget || 'medium'
    });
  }, [user]);

  const handleSave = async () => {
    const payload = {
      name: form.name,
      profilePic: form.profilePic,
      bio: form.bio,
      interests: form.interests.split(',').map((item) => item.trim()),
      budget: form.budget
    };
    const response = await userAPI.update(payload);
    setUser(response.data);
    localStorage.setItem('st_user', JSON.stringify(response.data));
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Your profile</h2>
        <div className="mt-6 grid gap-4">
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Name"
            className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-sky-400 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
          />
          <input
            value={form.profilePic}
            onChange={(e) => setForm({ ...form, profilePic: e.target.value })}
            placeholder="Profile picture URL"
            className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-sky-400 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
          />
          <input
            value={form.interests}
            onChange={(e) => setForm({ ...form, interests: e.target.value })}
            placeholder="Interests (adventure, culture, party)"
            className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-sky-400 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
          />
          <select
            value={form.budget}
            onChange={(e) => setForm({ ...form, budget: e.target.value })}
            className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-sky-400 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
          >
            <option value="low">Low budget</option>
            <option value="medium">Medium budget</option>
            <option value="high">High budget</option>
          </select>
          <textarea
            value={form.bio}
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
            rows="4"
            placeholder="Bio"
            className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-sky-400 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
          />
          <button onClick={handleSave} className="w-full rounded-3xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-950">
            Save profile
          </button>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Profile preview</h2>
        <div className="mt-6 space-y-4">
          <div className="flex items-center gap-4">
            <img src={user?.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'Traveler')}&background=1d4ed8&color=fff`} alt={user?.name} className="h-20 w-20 rounded-3xl object-cover" />
            <div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">{user?.name}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">{user?.email}</p>
            </div>
          </div>
          <div className="rounded-3xl bg-slate-100 p-4 dark:bg-slate-950">
            <p className="text-sm text-slate-600 dark:text-slate-300">{user?.bio || 'Your bio will appear here.'}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {user?.interests?.map((interest) => (
              <span key={interest} className="rounded-full bg-sky-100 px-3 py-1 text-xs font-medium text-sky-700 dark:bg-sky-500/10 dark:text-sky-200">
                {interest}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
