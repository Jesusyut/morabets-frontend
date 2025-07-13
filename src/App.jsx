import React, { useEffect, useState } from 'react'

function App() {
  const [bets, setBets] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('https://morabets-backend.onrender.com/filtered_moneylines')
      .then(res => res.json())
      .then(data => {
        setBets(data)
        setLoading(false)
      })
  }, [])

  return (
    <div className="min-h-screen bg-neutral-950 text-white p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-yellow-400">
        Mora Bets — Today's Best Value Moneylines
      </h1>
      {loading ? (
        <div className="text-center text-lg">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {bets.map((bet, idx) => (
            <div
              key={idx}
              className="bg-neutral-800 rounded-2xl shadow-lg p-5 border border-neutral-700 hover:border-yellow-400 transition"
            >
              <div className="text-xl font-semibold text-yellow-300">{bet.team}</div>
              <div className="text-sm text-neutral-400 mt-1">
                Bookmaker: <span className="text-white">{bet.bookmaker}</span>
              </div>
              <div className="mt-3">
                <span className="text-neutral-400">Odds:</span>
                <span className="text-white font-bold ml-2">{bet.odds}</span>
              </div>
              <div className="mt-1">
                <span className="text-neutral-400">Implied Probability:</span>
                <span className="text-green-400 font-bold ml-2">
                  {(bet.probability * 100).toFixed(2)}%
                </span>
              </div>
              <button className="mt-4 w-full bg-yellow-400 hover:bg-yellow-300 text-black font-semibold py-2 px-4 rounded-xl transition">
                Add to Slip
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default App
