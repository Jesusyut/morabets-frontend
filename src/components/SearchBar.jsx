// src/components/SearchBar.jsx
import { useState, useEffect, useRef } from 'react';

const teams = [
  "ATL", "LAD", "NYY", "BOS", "TOR", "CHC", "HOU", "TEX", "PHI", "SD", // add more as needed
];

export default function SearchBar({ query, setQuery, selectedTeam, setSelectedTeam, onSearch }) {
  const [suggestions, setSuggestions] = useState([]);
  const recognitionRef = useRef(null);

  useEffect(() => {
    if (!query) {
      setSuggestions([]);
      return;
    }

    // Simulate suggestions from local list or fetched props
    const terms = [query, selectedTeam]; // Extend this with actual logic if needed
    setSuggestions(
      terms.filter(Boolean).slice(0, 5)
    );
  }, [query, selectedTeam]);

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
      onSearch(speech, selectedTeam);
    };
  };

  return (
    <div className="flex flex-wrap items-center gap-2 mb-6 justify-center">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && onSearch(query, selectedTeam)}
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
        onClick={() => onSearch(query, selectedTeam)}
        className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
      >
        Search
      </button>

      <button
        onClick={handleVoiceInput}
        className="bg-blue-500 text-white px-3 py-2 rounded-md"
      >
        mic
      </button>
    </div>
  );
}

