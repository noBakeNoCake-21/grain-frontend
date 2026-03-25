//react Routing
import { useParams, useNavigate, NavLink } from "react-router";

//React Hooks 
import { useEffect, useState } from "react";

//axios
import axios from "axios";

//components 
import Header from "../components/Header";
import Footer from "../components/Footer";

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
    return (
        <>
            <Header />
            <div>
                <div className="movieInfo">
                    <h1>{movie.title}</h1>
                    <img src={`${movie.poster_file}`} alt={movie.title} />
                    <p>{movie.description}</p>
                    <p>Genre: {movie.genre}</p>
                </div>

                {/* Video player */}
                <div className="movieHolder">
                    {movie.video_file ? (
                        <iframe
                            className="movie"
                            width="640"
                            src={`https://iframe.videodelivery.net/${movie.video_file}`}
                            allowFullScreen
                        />
                    ) : (
                        <p>Video File not available</p>
                    )}
                </div>
                <div className="movieMeta">
                    <NavLink to={`/profile/${movie.user_id}`} className={({ isActive }) => isActive ? 'pro active' : 'pro'}>Uploader's Profile</NavLink>
                </div>
            </div>
            <div>
                <Footer />
            </div>
        </>
    )
}

export default Movie;


