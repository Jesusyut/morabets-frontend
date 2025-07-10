import SearchBar from './components/SearchBar';
import { useEffect, useState } from 'react';

export default function App() {
  const [players, setPlayers] = useState([]);
  const [query, setQuery] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('');
  const [above60, setAbove60] = useState(false);

  const fetchPlayers = () => {
    let url = 'https://morabets-backend.onrender.com/api/players';
    const params = [];

    if (query) params.push(`name=${encodeURIComponent(query)}`);
    if (selectedTeam) params.push(`team=${selectedTeam}`);

    if (params.length > 0) {
      url += '?' + params.join('&');
    }

    fetch(url)
      .then(res => res.json())
      .then(data => {
        const filtered = above60
          ? data.map(p => ({
              ...p,
              props: p.props.filter(prop => prop.probability >= 0.6)
            })).filter(p => p.props.length > 0)
          : data;

        setPlayers(filtered);
      });
  };

  // 🔁 Auto-load all props on first render
  useEffect(() => {
    fetchPlayers();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-4xl font-bold mb-6 text-center">Mora Bets - Today's Props</h1>

      <SearchBar
        value={query}
        onChange={setQuery}
        suggestions={players}
        selectedTeam={selectedTeam}
        onTeamChange={setSelectedTeam}
        onSearch={fetchPlayers}
      />

      <div className="text-center mb-4">
        <label>
          <input
            type="checkbox"
            className="mr-2"
            checked={above60}
            onChange={(e) => setAbove60(e.target.checked)}
          />
          Only show props above 60%
        </label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {players.map((player, idx) => (
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
