export default function LoadingScreen() {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ background: '#070d0a' }}
      role="status"
      aria-label="Loading EcoPulse AI"
    >
      <style>{`
        @keyframes ep-spin { to { transform: rotate(360deg); } }
        @keyframes ep-pulse { 0%,100%{opacity:.3} 50%{opacity:1} }
        .ep-loader-spin { animation: ep-spin 2s linear infinite; }
        .ep-loader-dot { animation: ep-pulse 1.2s ease-in-out infinite; }
        .ep-loader-dot:nth-child(2) { animation-delay: 0.2s; }
        .ep-loader-dot:nth-child(3) { animation-delay: 0.4s; }
      `}</style>
      <div className="flex flex-col items-center gap-4">
        <div
          className="ep-loader-spin w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
          style={{ background: 'linear-gradient(135deg, #1a6b47, #22c55e)' }}
          aria-hidden="true"
        >
          🌿
        </div>
        <div className="flex gap-1" aria-hidden="true">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="ep-loader-dot w-2 h-2 rounded-full"
              style={{ background: '#22c55e' }}
            />
          ))}
        </div>
        <p className="text-sm" style={{ color: '#9ca3af' }}>Loading EcoPulse AI…</p>
      </div>
    </div>
  );
}
