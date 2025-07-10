import { useEffect, useState } from 'react';

export default function App() {
  const [picks, setPicks] = useState([]);
  const [statsOptions, setStatsOptions] = useState([]);
  const [selectedStat, setSelectedStat] = useState(null);

  useEffect(() => {
    fetch('https://morabets-backend.onrender.com/api/stats-options')
      .then(res => res.json())
      .then(data => setStatsOptions(data));

    fetch('https://morabets-backend.onrender.com/api/players')
      .then(res => res.json())
      .then(data => setPicks(data));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Mora Bets Daily Picks</h1>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Stat Categories</h2>
        <ul className="space-y-1">
          {statsOptions.map((option, i) => (
            <li
              key={i}
              className={`cursor-pointer p-2 rounded ${selectedStat === option.name ? 'bg-blue-200' : 'bg-gray-100'}`}
              onClick={() => setSelectedStat(option.name)}
            >
              {option.name} (line: {option.defaultLine})
            </li>
          ))}
        </ul>
      </div>

      {picks.length > 0 ? (
        <ul className="space-y-2">
          {picks.map((pick, i) => (
            <li key={i} className="bg-white shadow p-4 rounded">
              <strong>{pick.player}</strong> - {pick.stat} over {pick.line}  
              <span className="block text-green-600 font-semibold">Probability: {Math.round(pick.probability * 100)}%</span>
            </li>
          ))}
        </ul>
      ) : (
        <p>Loading picks...</p>
      )}
    </div>
  );
}
