import axios from 'axios'
import { useNavigate, useParams } from "react-router"
import { useState, useEffect } from "react";
import Header from '../components/Header';
import '../css/profile.css';


//components 
import MovieCard from "../components/MovieCard";

function Profile() {

    const navigate = useNavigate();

    const { id } = useParams();

    const [user, setUser] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function fetchUser() {
            try {
                //fetch movies and user - make sure to make an api just for this call. 
                const response = await axios.get(`/api/users/${id}`);
                setUser(response.data);
            } catch (err) {
                setError("User not found");
            } finally {
                setLoading(false);
            }
        }
        fetchUser();
    }, [id]);



    if (loading) return <div><p>Loading...</p></div>;
    if (error) return <div><p>{error}</p></div>;
    if (!user) return <di> <p>No user found.</p></di>;

    return (
        <>
            <Header />
            <main className="profilePage">


                <div className="profileHeader">
                    <div className="profilePicHolder">
                        <img src={`${user.profile_pic}`} alt={user.username} />
                    </div>
                    <div className="profileInfo">
                        <h1>{user.username}</h1>
                        <p>{user.bio}</p>
                    </div>
                </div>

                {/* Movies Section */}
                <h2 className="sectionTitle">Movies</h2>
                <div className="movieRow">
                    {user.movies.map(m => (
                        <MovieCard key={m.id} movie={m} />
                    ))}
                </div>
            </main>
            <div>
                <Footer />
            </div>
        </>
    )
}


export default Profile