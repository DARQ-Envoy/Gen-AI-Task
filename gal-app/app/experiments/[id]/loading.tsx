export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="bg-black/30 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center animate-pulse">
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            </div>
            <div>
              <div className="h-6 w-32 bg-white/20 rounded animate-pulse mb-2"></div>
              <div className="h-4 w-24 bg-white/10 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
      
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="space-y-6">
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
            <div className="h-6 w-48 bg-white/20 rounded animate-pulse mb-4"></div>
            <div className="h-4 w-64 bg-white/10 rounded animate-pulse"></div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6">
                <div className="h-6 w-24 bg-white/20 rounded animate-pulse mb-4"></div>
                <div className="h-32 bg-black/30 rounded-lg animate-pulse mb-4"></div>
                <div className="space-y-2">
                  <div className="h-4 w-full bg-white/10 rounded animate-pulse"></div>
                  <div className="h-4 w-3/4 bg-white/10 rounded animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
