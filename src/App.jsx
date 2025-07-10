 import { useEffect, useState } from 'react';

export default function App() {
  const [players, setPlayers] = useState([]);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    fetch('https://morabets-backend.onrender.com/api/players')
      .then(res => res.json())
      .then(data => setPlayers(data));
  }, []);

  const filteredPlayers = players.filter(p =>
    p.player.toLowerCase().includes(filter.toLowerCase()) ||
    p.team?.toLowerCase().includes(filter.toLowerCase()) ||
    p.opponent?.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-4xl font-bold mb-6 text-center">Mora Bets - Today's Props</h1>

      <div className="mb-6 max-w-md mx-auto">
        <input
          className="w-full p-3 rounded bg-gray-800 border border-gray-700 text-white"
          placeholder="Search player, team, or opponent..."
          value={filter}
          onChange={e => setFilter(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPlayers.map((player, idx) => (
          <div key={idx} className="bg-gray-800 p-4 rounded shadow">
            <div className="flex items-center mb-3">
              <div className="w-12 h-12 rounded-full bg-gray-700 mr-4 overflow-hidden">
                <img
                  src={`https://images.mlbstatic.com/mlb-photos/image/upload/headshots/current/60x60/${player.player.replace(/\s/g, '').toLowerCase()}.png`}
                  alt={player.player}
                  onError={(e) => e.target.style.display='none'}
                />
              </div>
              <div>
                <div className="font-semibold text-lg">{player.player}</div>
                <div className="text-sm text-gray-400">{player.team} vs {player.opponent}</div>
              </div>
            </div>
            <div className="text-sm text-gray-400 mb-2">Game: {new Date(player.time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
            <div className="space-y-2">
              {player.props.map((prop, i) => (
                <div key={i} className="bg-gray-700 p-3 rounded flex justify-between">
                  <div>
                    <div className="text-sm">{prop.stat}</div>
                    <div className="text-xs text-gray-400">Line: {prop.line}</div>
                  </div>
                  <div className="text-green-400 font-semibold">{Math.round(prop.probability * 100)}%</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

