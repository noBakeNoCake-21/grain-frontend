
//react 
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router";
import { NavLink } from "react-router";

//axios
import axios from "axios";

//context
import { UserContext } from "../context";

//components
import Header from "../components/Header";
import MovieCard from "../components/MovieCard";
import Button from "../components/Button";
import Footer from "../components/Footer";
import GenreRow from "../components/GenreRow";
import Loading from "../components/Loading";


//css
import '../css/dashboard.css';
import '../css/MoviePage.css';



function Dashboard() {

    const { currentUser, setCurrentUser } = useContext(UserContext);
    //if  this is the user then list there movies. 
    //go through the user, if this is the user, get all the movies related to this user. 

    const [userMovies, setUserMovies] = useState([]);

    const [isLoading, setIsLoading] = useState(null);

    const navigate = useNavigate();



    useEffect(() => {
        async function fetchUserMovies() {
            try {
                //make sure backend authenticates this route. this is getting movies of the user who is logged in. 
                const response = await axios.get("/api/movies/my-movies", { withCredentials: true });
                setUserMovies(response.data);
            } catch (error) {
                console.log(error);
            }
        }
        if (currentUser) {
            fetchUserMovies();
        }
    }, [currentUser])



    async function handleDeleteAccount() {
        const confirmDelete = window.confirm(
            "Are you sure you want to permanently delete your account?"
        );

        const confirmDeleteTwo = window.confirm(
            "Serioulsy, this is permanent. It will permanently delete your accout. Permanently..."
        )

        if (!confirmDelete) return;
        if (!confirmDeleteTwo) return;

        try {
            await axios.delete("/api/users/delete-account", { withCredentials: true });

            localStorage.removeItem("token");
            setCurrentUser(null);

            // Redirect to homepage
            navigate('/');


        } catch (err) {
            console.error(err);
        }
    }

    async function handleDelete(movieId) {
        try {
            setIsLoading(true);
            await axios.delete(`/api/movies/${movieId}`, { withCredentials: true });

            setUserMovies(prev =>
                prev.filter(movie => movie.id !== movieId)
            );
            navigate('/dashboard');

        } catch (err) {
            setIsLoading(false);
            console.error(err);
        }
    }

    async function logout() {

        try {

            await axios.post('/api/users/logout', { withCredentials: true });
            setCurrentUser(null);
            navigate('/');

        } catch (error) {
            console.log(error);
            navigate('/login');
        }

    }


    return (
        <main>
            <div>
                <Header />
            </div>

            <div className="dashboardheader">
                <div className="dashPicHolder">
                    <img className="dashpic" src={`${currentUser.profile_pic}`} />
                </div>
                <div className="dashboardh2">
                    <h2>Welcome {currentUser.username}</h2>
                </div>
            </div>

            <div className="dashboardbutton">
                <Button onClick={handleDeleteAccount}>Delete Account</Button>
                <Button onClick={logout}>Log Out</Button>
            </div>
            <div className="movieList">
                {userMovies.map(m => {
                    return (<div style={{ display: "flex", flexDirection: "column", gap: "20px", padding: "40px" }} key={m.id}>
                        <MovieCard key={m.id} movie={m} onDelete={() => handleDelete(m.id)} />
                    </div>)
                })}
            </div>

            <div>
                <Footer />
            </div>
        </main>
    )
}

export default Dashboard;

// 