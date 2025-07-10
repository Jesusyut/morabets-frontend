// Enhanced SearchBar with auto-suggestions, team filter, and voice-to-text
import { useEffect, useRef, useState } from 'react';

const teams = [
  "ATL", "LAD", "NYY", "BOS", "TOR", "CHC", "HOU", "TEX", "PHI", "SD", // add more
];

export default function SearchBar({ players, onSearch }) {
  const [query, setQuery] = useState('');
  const [filteredPlayers, setFilteredPlayers] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState('');
  const recognitionRef = useRef(null);

  useEffect(() => {
    if (!query) return setFilteredPlayers([]);
    const filtered = players.filter(player =>
      player.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredPlayers(filtered);
  }, [query, players]);

  const handleSearch = (term = query) => {
    if (term.trim()) onSearch({ name: term.trim(), team: selectedTeam });
  };

  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Voice search not supported in this browser');
      return;
    }
    recognitionRef.current = new window.webkitSpeechRecognition();
    recognitionRef.current.lang = 'en-US';
    recognitionRef.current.start();
    recognitionRef.current.onresult = (event) => {
      const speech = event.results[0][0].transcript;
      setQuery(speech);
      handleSearch(speech);
    };
  };

  return (
    <div className="flex flex-col items-center mt-6">
      <div className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          placeholder="Search player..."
          className="bg-gray-800 text-white px-4 py-2 rounded-md w-64 focus:ring-2 focus:ring-green-400"
        />
        <select
          value={selectedTeam}
          onChange={(e) => setSelectedTeam(e.target.value)}
          className="bg-gray-800 text-white px-2 py-2 rounded-md"
        >
          <option value="">All Teams</option>
          {teams.map((team) => (
            <option key={team} value={team}>{team}</option>
          ))}
        </select>
        <button
          onClick={handleSearch}
          className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
        >
          Search
        </button>
        <button
          onClick={handleVoiceInput}
          className="bg-blue-500 text-white px-2 rounded-full"
        >🎤</button>
      </div>
      {filteredPlayers.length > 0 && (
        <div className="bg-gray-700 mt-2 w-64 rounded-md text-white">
          {filteredPlayers.slice(0, 8).map((player) => (
            <div
              key={player}
              onClick={() => {
                setQuery(player);
                setFilteredPlayers([]);
                handleSearch(player);
              }}
              className="px-4 py-2 hover:bg-gray-600 cursor-pointer"
            >
              {player}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
