import React, { useEffect, useState } from "react";
import "./index.css";

function App() {
  const [activeTab, setActiveTab] = useState("matchups");
  const [matchups, setMatchups] = useState([]);
  const [props, setProps] = useState([]);

  useEffect(() => {
    if (activeTab === "matchups") {
      fetch("https://morabets-backend.onrender.com/matchups")
        .then((res) => res.json())
        .then((data) => setMatchups(data));
    } else if (activeTab === "player_props") {
      fetch("https://morabets-backend.onrender.com/player_props")
        .then((res) => res.json())
        .then((data) => setProps(data));
    }
  }, [activeTab]);

  return (
    <div className="bg-black min-h-screen text-white p-6">
      <h1 className="text-3xl font-bold text-yellow-400 mb-4">
        Mora Bets — {activeTab === "matchups" ? "Matchups" : "Player Props"}
      </h1>

      <div className="mb-6">
        <button
          onClick={() => setActiveTab("matchups")}
          className={`px-4 py-2 mr-2 rounded ${
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
      </div>

      {activeTab === "matchups" ? (
        <div className="grid gap-4">
          {matchups.map((game, idx) => (
            <div
              key={idx}
              className="bg-slate-900 p-4 rounded border border-yellow-400"
            >
              <h2 className="text-lg font-bold mb-2">{game.matchup}</h2>
              <p className="mb-2">Start: {new Date(game.start_time).toLocaleString()}</p>
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
          {props.map((prop, index) => (
            <div
              key={index}
              className="bg-slate-900 p-4 rounded border border-yellow-400"
            >
              <h2 className="text-lg font-bold">{prop.player}</h2>
              <p>{prop.stat} – {prop.line}</p>
              <p>Bookmaker: {prop.bookmaker}</p>
              <p>Odds: {prop.odds}</p>
              <p className="text-green-400">
                Probability: {prop.implied_probability}%
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
