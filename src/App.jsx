import React, { useEffect, useState } from "react";

function App() {
  const [activeTab, setActiveTab] = useState("matchups");
  const [matchups, setMatchups] = useState([]);
  const [props, setProps] = useState([]);

  useEffect(() => {
    fetch("https://morabets-backend.onrender.com/matchups")
      .then((res) => res.json())
      .then(setMatchups);

    fetch("https://morabets-backend.onrender.com/player_props")
      .then((res) => res.json())
      .then(setProps);
  }, []);

  return (
    <div className="bg-black min-h-screen text-white p-6">
      <h1 className="text-3xl font-bold text-center text-yellow-400 mb-4">
        Mora Bets — {activeTab === "matchups" ? "Today's Matchups & Probabilities" : "Player Props"}
      </h1>

      <div className="flex justify-center gap-4 mb-6">
        <button
          className={`px-4 py-2 rounded ${
            activeTab === "matchups" ? "bg-yellow-400 text-black" : "bg-gray-700"
          }`}
          onClick={() => setActiveTab("matchups")}
        >
          Matchups
        </button>
        <button
          className={`px-4 py-2 rounded ${
            activeTab === "props" ? "bg-yellow-400 text-black" : "bg-gray-700"
          }`}
          onClick={() => setActiveTab("props")}
        >
          Player Props
        </button>
      </div>

      {activeTab === "matchups" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {matchups.map((game, idx) => (
            <div key={idx} className="bg-gray-900 rounded-xl shadow-md p-4 border border-yellow-500">
              <h2 className="text-xl font-semibold mb-2">{game.matchup}</h2>
              <p className="text-sm text-gray-400 mb-3">
                Start Time: {new Date(game.start_time).toLocaleString()}
              </p>
              {game.bookmakers.map((book, i) => (
                <div key={i} className="mb-4">
                  <h3 className="text-yellow-300 font-medium">{book.bookmaker}</h3>
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    {book.markets.map((mkt, j) => (
                      <div key={j} className="bg-gray-800 p-2 rounded-md border border-gray-700">
                        <span className="font-semibold">{mkt.team}</span>
                        <span className="text-sm">Odds: {mkt.odds}</span>
                        <span className="text-green-400 text-sm">Probability: {mkt.implied_probability}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {props.map((prop, idx) => (
            <div key={idx} className="bg-gray-900 border border-yellow-400 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-white mb-1">{prop.player}</h3>
              <p className="text-sm text-gray-300 mb-2">
                {prop.stat} – {prop.line}
              </p>
              <p className="text-sm">Bookmaker: {prop.bookmaker}</p>
              <p className="text-sm">Odds: {prop.odds > 0 ? `+${prop.odds}` : prop.odds}</p>
              <p className="text-green-400 text-sm">Probability: {prop.implied_probability}%</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;

