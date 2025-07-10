import { useEffect, useState } from 'react';
import SearchBar from './components/SearchBar';

export default function App() {
  const [players, setPlayers] = useState([]);
  const [query, setQuery] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('');
  const [onlyHighProb, setOnlyHighProb] = useState(false);

  useEffect(() => {
    fetch('https://morabets-backend.onrender.com/api/players')
      .then(res => res.json())
      .then(data => setPlayers(data))
      .catch(err => console.error('Error fetching players:', err));
  }, []);

  const filteredPlayers = players
    .filter(p => {
      const matchesQuery =
        query === '' ||
        p.player.toLowerCase().includes(query.toLowerCase()) ||
        p.team?.toLowerCase().includes(query.toLowerCase()) ||
        p.opponent?.toLowerCase().includes(query.toLowerCase());

      const matchesTeam = selectedTeam === '' || p.team === selectedTeam;

      return matchesQuery && matchesTeam;
    })
    .map(p => {
      const props = onlyHighProb
        ? p.props.filter(prop => prop.probability >= 0.6)
        : p.props;

      return { ...p, props };
    })
    .filter(p => p.props.length > 0);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-4xl font-bold mb-6 text-center">Mora Bets - Today's Props</h1>

      {/* Search & Filters */}
      <SearchBar
        value={query}
        onChange={setQuery}
        suggestions={players}
        selectedTeam={selectedTeam}
        onTeamChange={setSelectedTeam}
      />

      <div className="max-w-md mx-auto mb-6 text-sm flex items-center justify-center gap-3">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={onlyHighProb}
            onChange={() => setOnlyHighProb(prev => !prev)}
            className="accent-green-500"
          />
          <span>Only show props above 60%</span>
        </label>
      </div>

      {/* Player Props Grid */}
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
              {player.props.map((prop, i) => (
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
