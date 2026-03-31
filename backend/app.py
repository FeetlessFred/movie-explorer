from flask import Flask, request, jsonify, session
import requests
import os
from dotenv import load_dotenv

load_dotenv()  # loads .env if present

app = Flask(__name__)
app.secret_key = "supersecretkey"

# You can either use environment variable or hardcode your key
TMDB_API_KEY = os.environ.get("TMDB_API_KEY", "b5318b6f00f1bac7037e6d65a17e52ff")
TMDB_BASE_URL = "https://api.themoviedb.org/3"

# In-memory storage for seen movies (for prototype)
seen_movies = {}

@app.route("/movies/<int:page>")
def get_movies(page):
    url = f"{TMDB_BASE_URL}/movie/popular?api_key={TMDB_API_KEY}&language=en-US&page={page}"
    response = requests.get(url)
    return jsonify(response.json())

@app.route("/movie/<int:movie_id>")
def get_movie(movie_id):
    url = f"{TMDB_BASE_URL}/movie/{movie_id}?api_key={TMDB_API_KEY}&language=en-US"
    response = requests.get(url)
    return jsonify(response.json())

@app.route("/seen/add", methods=["POST"])
def add_seen():
    movie = request.json
    user = session.get("user", "default")
    seen_movies.setdefault(user, [])
    if movie not in seen_movies[user]:
        seen_movies[user].append(movie)
    return {"status": "added", "seen_movies": seen_movies[user]}

@app.route("/seen")
def get_seen():
    user = session.get("user", "default")
    return jsonify(seen_movies.get(user, []))

if __name__ == "__main__":
    app.run(debug=True)
