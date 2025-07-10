import { useEffect, useState } from 'react';

export default function App() {
  const [picks, setPicks] = useState([]);

  useEffect(() => {
    fetch('https://morabets-backend.onrender.com/api/players')
      .then(res => res.json())
      .then(data => setPicks(data));
  }, []);

  return (
    <div className="bg-black min-h-screen text-white p-4 font-sans">
      <header className="text-center mb-6">
        <h1 className="text-3xl font-bold">Mora Bets</h1>
        <p className="text-sm text-gray-400">Today’s MLB Player Props</p>
      </header>

      <div className="grid gap-4">
        {picks.length > 0 ? (
          picks.map((pick, i) => (
            <div key={i} className="bg-gray-900 rounded-xl p-4 shadow-md">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-semibold">{pick.player}</h2>
                <span className="text-xs text-gray-400">vs {pick.opponent} @ {pick.time}</span>
              </div>

              {pick.props && pick.props.length > 0 ? (
                <div className="grid gap-2">
                  {pick.props.map((prop, j) => (
                    <div key={j} className="flex justify-between items-center bg-gray-800 p-2 rounded-lg">
                      <div>
                        <div className="text-sm font-medium">{prop.stat}</div>
                        <div className="text-xs text-gray-400">Line: {prop.line}</div>
                      </div>
                      <div className="flex space-x-2">
                        <button className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-xs">
                          Higher
                        </button>
                        <button className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-xs">
                          Lower
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No available props</p>
              )}
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">Loading today’s props...</p>
        )}
      </div>
    </div>
  );
}
