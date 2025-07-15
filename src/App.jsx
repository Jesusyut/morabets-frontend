import React, { useEffect, useState } from "react";
import "./index.css";

function App() {
  const [activeTab, setActiveTab] = useState("matchups");
  const [matchups, setMatchups] = useState([]);
  const [props, setProps] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (activeTab === "matchups") {
      fetch("https://morabets-backend.onrender.com/matchups")
        .then((res) => res.json())
        .then((data) => setMatchups(data));
    } else if (activeTab === "player_props" || activeTab === "props_stats") {
      fetch("https://morabets-backend.onrender.com/player_props")
        .then((res) => res.json())
        .then((data) => setProps(data));
    }
  }, [activeTab]);

  const filteredMatchups = matchups.filter((game) =>
    game.matchup.toLowerCase().includes(search.toLowerCase())
  );

  const filteredProps = props.filter((p) =>
    p.player.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-black min-h-screen text-white p-6">
      <h1 className="text-3xl font-bold text-yellow-400 mb-4">
        Mora Bets —{" "}
        {activeTab === "matchups"
          ? "Matchups"
          : activeTab === "player_props"
          ? "Player Props"
          : "Props + Stats"}
      </h1>

      <div className="mb-4 flex gap-2">
        <button
          onClick={() => setActiveTab("matchups")}
          className={`px-4 py-2 rounded ${
            activeTab === "matchups"
              ? "bg-gray-700 text-white"
              : "bg-yellow-400 text-black"
          }`}
        >
          Matchups
        </button>
        <button
          onClick={() => setActiveTab("player_props")}
          className={`px-4 py-2 rounded ${
            activeTab === "player_props"
              ? "bg-gray-700 text-white"
              : "bg-yellow-400 text-black"
          }`}
        >
          Player Props
        </button>
        <button
          onClick={() => setActiveTab("props_stats")}
          className={`px-4 py-2 rounded ${
            activeTab === "props_stats"
              ? "bg-gray-700 text-white"
              : "bg-yellow-400 text-black"
          }`}
        >
          Props + Stats
        </button>
      </div>

      <input
        type="text"
        placeholder="Search player or team..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-6 w-full p-2 rounded text-black"
      />

      {activeTab === "matchups" ? (
        <div className="grid gap-4">
          {filteredMatchups.map((game, idx) => (
            <div
              key={idx}
              className="bg-slate-900 p-4 rounded border border-yellow-400"
            >
              <h2 className="text-lg font-bold mb-2">{game.matchup}</h2>
              <p className="mb-2">
                Start: {new Date(game.start_time).toLocaleString()}
              </p>
              {game.bookmakers.map((book, i) => (
                <div key={i} className="mb-2">
                  <h3 className="font-semibold">{book.bookmaker}</h3>
                  {book.markets.map((market, j) => (
                    <p key={j}>
                      {market.team}: {market.odds} (
                      {market.implied_probability}%)
                    </p>
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredProps.map((prop, index) => (
            <div
              key={index}
              className="bg-slate-900 p-4 rounded border border-yellow-400"
            >
              <h2 className="text-lg font-bold">{prop.player}</h2>
              <p>
                {prop.stat} – {prop.line}
              </p>
              <p>Bookmaker: {prop.bookmaker}</p>
              <p>Odds: {prop.odds}</p>
              <p className="text-green-400">
                Probability: {prop.implied_probability}%
              </p>
              {activeTab === "props_stats" && prop.stats && (
                <div className="mt-2 text-sm text-gray-300">
                  <p>Hits: {prop.stats.hits}</p>
                  <p>Total Bases: {prop.stats.total_bases}</p>
                  <p>Home Runs: {prop.stats.home_runs}</p>
                  <p>RBIs: {prop.stats.rbis}</p>
                  <p>Strikeouts: {prop.stats.strikeouts}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;

