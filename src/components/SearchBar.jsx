// Enhanced SearchBar with auto-suggestions and team filter
import { useState } from 'react';

const allTeams = [
  "ATL", "BAL", "BOS", "CHC", "CIN", "CLE", "COL", "CWS", "DET",
  "HOU", "KC", "LAA", "LAD", "MIA", "MIL", "MIN", "NYM", "NYY",
  "OAK", "PHI", "PIT", "SD", "SEA", "SF", "STL", "TB", "TEX", "TOR", "WSH"
];

export default function SearchBar({ value, onChange, suggestions, selectedTeam, onTeamChange }) {
  const [showSuggestions, setShowSuggestions] = useState(false);

  const allSuggestions = Array.from(new Set(
    suggestions.flatMap(p => [
      p.player,
      p.team || '',
      p.opponent || ''
    ])
  )).filter(Boolean);

  const filtered = value
    ? allSuggestions.filter(s =>
        s.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 10)
    : [];

  return (
    <div className="relative w-full max-w-2xl mx-auto mb-6 flex flex-col gap-2">
      {/* Input and team filter */}
      <div className="flex gap-2">
        <input
          className="w-full p-3 rounded bg-gray-800 border border-gray-700 text-white"
          type="text"
          placeholder="Search player, team, or opponent..."
          value={value}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
          onChange={(e) => onChange(e.target.value)}
        />
        <select
          className="p-3 rounded bg-gray-800 border border-gray-700 text-white"
          value={selectedTeam}
          onChange={(e) => onTeamChange(e.target.value)}
        >
          <option value="">All Teams</option>
          {allTeams.map(team => (
            <option key={team} value={team}>{team}</option>
          ))}
        </select>
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && filtered.length > 0 && (
        <ul className="absolute z-10 w-full mt-1 bg-gray-800 border border-gray-700 rounded shadow-lg max-h-60 overflow-y-auto">
          {filtered.map((item, idx) => (
            <li
              key={idx}
              onMouseDown={() => onChange(item)}
              className="p-2 hover:bg-gray-700 cursor-pointer text-white"
            >
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
