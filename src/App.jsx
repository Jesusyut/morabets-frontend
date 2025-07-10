import { useEffect, useState } from 'react';

export default function App() {
  const [picks, setPicks] = useState([]);

  useEffect(() => {
    fetch('https://your-backend.onrender.com/api/today-picks') // replace with actual URL
      .then(res => res.json())
      .then(data => setPicks(data));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Mora Bets Daily Picks</h1>
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
