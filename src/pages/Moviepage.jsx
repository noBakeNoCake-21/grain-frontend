//react Routing
import { useParams, useNavigate, NavLink } from "react-router";

//React Hooks 
import { useEffect, useState } from "react";

//axios
import axios from "axios";

//components 
import Header from "../components/Header";

//css
import '../css/MoviePage.css';





function Movie() {

    const { id } = useParams();
    const [movie, setMovie] = useState(null);
    const navigate = useNavigate();



    useEffect(() => {
        async function fetchMovie() {
            try {
                const response = await axios.get(`/api/movies/${id}`);
                setMovie(response.data);
            } catch (err) {
                console.error(err);
            }
        }
        fetchMovie();
    }, [id]);

    if (!movie) { return <p>Loading...</p> }
    console.log(movie.video_file);
    return (
        <>
            <Header />
            <div>
                <div className="movieInfo">
                    <h1>{movie.title}</h1>
                    <img src={`http://localhost:3000/${movie.poster_file}`} alt={movie.title} />
                    <p>{movie.description}</p>
                    <p>Genre: {movie.genre}</p>
                </div>

                {/* Video player */}
                <div className="movieHolder">
                    <video className="movie" controls width="640">
                        <source src={`http://localhost:3000/${movie.video_file}`} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                </div>
                <div className="movieMeta">
                    <NavLink to={`/profile/${movie.user_id}`} className={({ isActive }) => isActive ? 'pro active' : 'pro'}>Uploader's Profile</NavLink>
                </div>
            </div>

        </>
    )
}

export default Movie; 