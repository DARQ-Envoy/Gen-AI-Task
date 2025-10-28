export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
      <div className="text-center">
        <div className="relative mb-8">
          <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl mx-auto flex items-center justify-center animate-pulse">
            <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
        <h2 className="text-3xl font-bold text-white mb-4">Loading Experiments...</h2>
        <p className="text-lg text-purple-200">Fetching your experiment data</p>
      </div>
    </div>
  );
}
