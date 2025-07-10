import { useEffect, useState } from 'react';
import SearchBar from './components/SearchBar';

export default function App() {
  const [players, setPlayers] = useState([]);
  const [query, setQuery] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('');
  const [show60Plus, setShow60Plus] = useState(false);

  useEffect(() => {
    // Initial load
    fetchPlayers();
  }, []);

  const fetchPlayers = async (name = '', team = '') => {
    try {
      const params = new URLSearchParams();
      if (name) params.append('name', name);
      if (team) params.append('team', team);

      const res = await fetch(`https://morabets-backend.onrender.com/api/players?${params}`);
      const data = await res.json();
      setPlayers(data);
    } catch (err) {
      console.error('Failed to fetch props:', err);
    }
  };

  const filteredPlayers = players.filter((p) =>
    (query === '' || p.player.toLowerCase().includes(query.toLowerCase())) &&
    (selectedTeam === '' || p.team === selectedTeam)
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-4xl font-bold mb-6 text-center">Mora Bets - Today's Props</h1>

      {/* Search + Filters */}
      <SearchBar
        query={query}
        setQuery={setQuery}
        selectedTeam={selectedTeam}
        setSelectedTeam={setSelectedTeam}
        onSearch={fetchPlayers}
      />

      {/* Checkbox */}
      <div className="flex justify-center mb-6">
        <label className="flex items-center space-x-2 text-sm">
          <input
            type="checkbox"
            checked={show60Plus}
            onChange={(e) => setShow60Plus(e.target.checked)}
            className="form-checkbox h-4 w-4 text-green-500"
          />
          <span>Only show props above 60%</span>
        </label>
      </div>

      {/* Props */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPlayers.map((player, idx) => (
          <div key={idx} className="bg-gray-800 p-4 rounded shadow">
            <div className="flex items-center mb-3">
              <div className="w-12 h-12 rounded-full bg-gray-700 mr-4 overflow-hidden">
                <img
                  src={`https://images.mlbstatic.com/mlb-photos/image/upload/headshots/current/60x60/${player.player.replace(/\s/g, '').toLowerCase()}.png`}
                  alt={player.player}
                  onError={(e) => (e.target.style.display = 'none')}
                />
              </div>
              <div>
                <div className="font-semibold text-lg">{player.player}</div>
                <div className="text-sm text-gray-400">{player.team} vs {player.opponent}</div>
              </div>
            </div>
            <div className="text-sm text-gray-400 mb-2">
              Game: {new Date(player.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
            <div className="space-y-2">
              {player.props
                .filter((prop) => !show60Plus || prop.probability >= 0.6)
                .map((prop, i) => (
                  <div key={i} className="bg-gray-700 p-3 rounded flex justify-between">
                    <div>
                      <div className="text-sm">{prop.stat}</div>
                      <div className="text-xs text-gray-400">Line: {prop.line}</div>
                    </div>
                    <div className="text-green-400 font-semibold">
                      {Math.round(prop.probability * 100)}%
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
