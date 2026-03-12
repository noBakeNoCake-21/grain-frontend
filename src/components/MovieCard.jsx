import { useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
import { UserContext } from "../context";
import Button from "./Button";
import '../css/movieCard.css';

function MovieCard(props) {

    const { currentUser } = useContext(UserContext);
    const navigate = useNavigate();
    const [imgError, setImgError] = useState(false)

    const handleClick = () => {
        navigate(`/movies/${props.movie.id}`);
    };



    const posterUrl = !imgError && `${props.movie.poster_file}` ? `${encodeURI(props.movie.poster_file)}` : null;

    return (
        <div
            onClick={handleClick}
            style={{
                cursor: "pointer",
                width: "180px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                marginBottom: "20px",
            }}
        >
            <p className='movieName' style={{ textAlign: "center", fontWeight: "bold" }}>
                {props.movie.title || "Untitled Movie"}
            </p>
            {posterUrl ? (
                <img
                    src={`${props.movie.poster_file}`}//encodeURI http://localhost:3000/
                    alt={props.movie.title || "Movie poster"}
                    className="movieposter"
                    onError={() => setImgError(true)}
                />
            ) : (
                <div
                    className="unknownMovie"
                >
                    {props.movie.title || "No Image"}
                </div>)}

            {props.onDelete && (
                <Button onClick={props.onDelete}>Delete</Button>)}

        </div>


    );
}

export default MovieCard; 