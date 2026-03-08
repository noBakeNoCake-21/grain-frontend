import MovieCard from "./MovieCard";

function GenreRow({ genreName, movies }) {
    return (
        <div className="genreNameHolder" style={{ marginBottom: "40px" }}>
            <h2 className="genreName" style={{ marginLeft: "40px" }}>{genreName}</h2>
            <div className="genreRow"
                style={{
                    display: "flex",
                    gap: "50px",      // ← spacing between cards
                    overflowX: "auto", // optional, horizontal scroll like Netflix
                    padding: "10px",
                }}
            >
                {movies.map((movie) => (
                    <MovieCard key={movie.id} movie={movie} />
                ))}
            </div>
        </div>
    );
}

export default GenreRow; 