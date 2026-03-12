import { useEffect, useState } from 'react'
import axios from 'axios';
import '../css/App.css';
import { Outlet } from 'react-router';

//Components 
import GenreRow from '../components/GenreRow';
import Header from '../components/Header';



function Homepage() {


  const [movies, setMovies] = useState([]);

  useEffect(() => {

    async function getMovies() {
      try {
        const response = await axios.get('/api/movies');
        const movies = response.data;
        setMovies(movies);
      } catch (error) {
        console.error("you are fukcing up", error);
      }
    }

    getMovies();

  }, [])

  const genres = [...new Set(movies.map(movie => movie.genre))];


  return (
    (<div>
      <Header />
      <main>
        <div style={{ display: "flex", flexDirection: "column", gap: "20px", padding: "20px" }}>
          {(genres || []).map(genre => {
            const moviesForGenre = movies.filter(movie => movie.genre === genre);
            return (
              <GenreRow
                key={genre}
                genreName={genre}
                movies={moviesForGenre}
              />
            );
          })}
        </div>
      </main>
    </div>)
  )
}

export default Homepage; 
