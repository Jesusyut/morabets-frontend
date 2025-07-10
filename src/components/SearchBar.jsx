import { useState, useEffect, useRef } from 'react';

export default function SearchBar({ value, onChange, suggestions, selectedTeam, onTeamChange }) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filtered, setFiltered] = useState([]);
  const recognitionRef = useRef(null);

  useEffect(() => {
    if (!value) return setFiltered([]);

    const allSuggestions = Array.from(new Set(
      suggestions.flatMap(p => [p.player, p.team, p.opponent])
    )).filter(Boolean);

    const result = allSuggestions.filter(s =>
      s.toLowerCase().includes(value.toLowerCase())
    ).slice(0, 10);

    setFiltered(result);
  }, [value, suggestions]);

  const handleVoiceSearch = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Voice search not supported');
      return;
    }
    recognitionRef.current = new window.webkitSpeechRecognition();
    recognitionRef.current.lang = 'en-US';
    recognitionRef.current.start();
    recognitionRef.current.onresult = (event) => {
      const speech = event.results[0][0].transcript;
      onChange(speech);
    };
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center gap-3 justify-center mb-6">
      {/* Input with suggestions */}
      <div className="relative w-full max-w-md">
        <input
          type="text"
          value={value}
          placeholder="Search player, team, or opponent..."
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
          className="w-full p-3 rounded bg-gray-800 border border-gray-700 text-white"
        />
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

      {/* Team filter */}
      <select
        value={selectedTeam}
        onChange={(e) => onTeamChange(e.target.value)}
        className="bg-gray-800 text-white px-4 py-2 rounded border border-gray-700"
      >
        <option value="">All Teams</option>
        {[...new Set(suggestions.map(p => p.team).filter(Boolean))].sort().map((team, i) => (
          <option key={i} value={team}>{team}</option>
        ))}
      </select>

      {/* Voice button */}
      <button
        onClick={handleVoiceSearch}
        className="bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600"
      >
        🎤
      </button>
    </div>
  );
}
