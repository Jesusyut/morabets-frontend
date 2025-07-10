import { useEffect, useState } from 'react';
import SearchBar from './components/SearchBar';

export default function App() {
  const [players, setPlayers] = useState([]);
  const [filter, setFilter] = useState('');
  const [teamFilter, setTeamFilter] = useState('');
  const [opponentFilter, setOpponentFilter] = useState('');

  useEffect(() => {
    fetch('https://morabets-backend.onrender.com/api/players')
      .then(res => res.json())
      .then(data => setPlayers(data));
  }, []);

  const uniqueTeams = [...new Set(players.map(p => p.team).filter(Boolean))].sort();
  const uniqueOpponents = [...new Set(players.map(p => p.opponent).filter(Boolean))].sort();

  const filteredPlayers = players.filter(p =>
    (p.player.toLowerCase().includes(filter.toLowerCase()) ||
     p.team?.toLowerCase().includes(filter.toLowerCase()) ||
     p.opponent?.toLowerCase().includes(filter.toLowerCase())) &&
    (teamFilter === '' || p.team === teamFilter) &&
    (opponentFilter === '' || p.opponent === opponentFilter)
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-4xl font-bold mb-6 text-center">Mora Bets - Today's Props</h1>

      <SearchBar value={filter} onChange={setFilter} suggestions={players} />

      <div className="flex flex-col md:flex-row gap-4 mb-6 justify-center">
        <select
          className="bg-gray-800 border border-gray-700 text-white p-2 rounded"
          value={teamFilter}
          onChange={(e) => setTeamFilter(e.target.value)}
        >
          <option value="">All Teams</option>
          {uniqueTeams.map((team, idx) => (
            <option key={idx} value={team}>{team}</option>
          ))}
        </select>

        <select
          className="bg-gray-800 border border-gray-700 text-white p-2 rounded"
          value={opponentFilter}
          onChange={(e) => setOpponentFilter(e.target.value)}
        >
          <option value="">All Opponents</option>
          {uniqueOpponents.map((opp, idx) => (
            <option key={idx} value={opp}>{opp}</option>
          ))}
        </select>
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
            <div className="text-sm text-gray-400 mb-2">
              Game: {new Date(player.time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
            </div>
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
