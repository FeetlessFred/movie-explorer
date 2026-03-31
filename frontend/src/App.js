import React, { useEffect, useState } from "react";

function App() {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [seen, setSeen] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:5000/movies/${page}`)
      .then(res => res.json())
      .then(data => setMovies(data.results));
    fetch(`http://localhost:5000/seen`)
      .then(res => res.json())
      .then(data => setSeen(data));
  }, [page]);

  const addSeen = (movie) => {
    fetch("http://localhost:5000/seen/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(movie),
    })
      .then(res => res.json())
      .then(data => setSeen(data.seen_movies));
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Movie Explorer</h1>

      <h2>Popular Movies (Page {page})</h2>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {movies.map(m => (
          <div key={m.id} style={{ margin: "10px", width: "200px" }}>
            <img
              src={`https://image.tmdb.org/t/p/w200${m.poster_path}`}
              alt={m.title}
              style={{ width: "100%" }}
            />
            <h3>{m.title}</h3>
            <button onClick={() => addSeen(m)}>I've Seen This</button>
          </div>
        ))}
      </div>

      <div style={{ marginTop: "20px" }}>
        <button onClick={() => setPage(Math.max(page - 1, 1))}>Prev</button>
        <button onClick={() => setPage(page + 1)}>Next</button>
      </div>

      <h2 style={{ marginTop: "40px" }}>My Seen Movies</h2>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {seen.map(m => (
          <div key={m.id} style={{ margin: "10px", width: "150px" }}>
            <img
              src={`https://image.tmdb.org/t/p/w200${m.poster_path}`}
              alt={m.title}
              style={{ width: "100%" }}
            />
            <p>{m.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
