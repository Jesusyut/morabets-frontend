import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
useEffect(() => {
  fetch("https://morabets-backend.onrender.com/matchups")
    .then(res => res.json())
    .then(data => {
      if (Array.isArray(data)) {
        setMatchups(data);
      } else {
        console.error("Expected array but got:", data);
        setMatchups([]); // fallback to prevent crash
      }
    })
    .catch(err => {
      console.error("Failed to fetch matchups", err);
    });
}, []);


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
