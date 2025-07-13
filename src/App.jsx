import React, { useEffect, useState } from "react";

function App() {
  const [matchups, setMatchups] = useState([]);

  useEffect(() => {
    fetch("https://morabets-backend.onrender.com/matchups")
      .then((res) => res.json())
      .then((data) => setMatchups(data))
      .catch((err) => console.error("Error fetching matchups:", err));
  }, []);

  return (
    <div className="bg-black min-h-screen text-white p-6">
      <h1 className="text-3xl font-bold text-center text-yellow-400 mb-6">
        Mora Bets — Today's Matchups & Probabilities
      </h1>

      {matchups.length === 0 ? (
        <p className="text-center text-gray-400">Loading matchups...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {matchups.map((game, idx) => (
            <div key={idx} className="bg-gray-900 rounded-xl shadow-md p-4 border border-yellow-500">
              <h2 className="text-xl font-semibold mb-2 text-white">
                {game.matchup}
              </h2>
              <p className="text-sm text-gray-400 mb-3">
                Start Time: {new Date(game.start_time).toLocaleString()}
              </p>

              {game.bookmakers.map((book, i) => (
                <div key={i} className="mb-4">
                  <h3 className="text-yellow-300 font-medium">{book.bookmaker}</h3>
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    {book.markets.map((mkt, j) => (
                      <div
                        key={j}
                        className="bg-gray-800 p-2 rounded-md flex flex-col justify-between border border-gray-700"
                      >
                        <span className="font-semibold text-white">
                          {mkt.team}
                        </span>
                        <span className="text-sm">Odds: {mkt.odds}</span>
                        <span className="text-green-400 text-sm">
                          Probability: {mkt.implied_probability}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
