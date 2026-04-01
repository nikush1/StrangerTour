const UserCard = ({ traveler }) => {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center gap-4">
        <img src={traveler.profilePic || `https://ui-avatars.com/api/?name=${encodeURIComponent(traveler.name)}&background=1d4ed8&color=fff`} alt={traveler.name} className="h-16 w-16 rounded-2xl object-cover" />
        <div>
          <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{traveler.name}</h4>
          <p className="text-sm text-slate-500 dark:text-slate-400">{traveler.budget} traveler</p>
        </div>
      </div>
      <p className="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-300">{traveler.bio || 'Adventure traveler who loves discovering new cities and meeting new people.'}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {traveler.interests?.slice(0, 4).map((interest) => (
          <span key={interest} className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700 dark:bg-slate-800 dark:text-slate-200">
            {interest}
          </span>
        ))}
      </div>
    </div>
  );
};

export default UserCard;
