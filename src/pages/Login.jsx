import { useState, useContext, useEffect, } from "react";
import { useNavigate } from "react-router";
import { UserContext } from "../context";
import axios from "axios";
import Button from "../components/Button";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Loading from "../components/Loading";

//css
import '../css/Login.css';



function Login() {

    const { currentUser, setCurrentUser } = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (currentUser) {
            navigate("/dashboard");
        }
    }, [currentUser, navigate])



    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    function handleChange(e) {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError(null);
        const cleanedEmail = formData.email.trim().toLowerCase();
        const cleanedPassword = formData.password.trim();

        if (!cleanedEmail || !cleanedPassword) {
            setError("Email and password are required");
            return;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(cleanedEmail)) {
            setError("Enter a valid email");
            return;
        }
        if (cleanedPassword.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }
        const data = { email: cleanedEmail, password: cleanedPassword };
        try {

            setIsLoading(true);

            const response = await axios.post("/api/login", data);
            const user = response.data;
            setCurrentUser(user);
            setFormData({ email: "", password: "", });

        } catch (error) {
            console.log(error);
            setError('Invalid Password or Email');

        } finally {
            setIsLoading(false);
        }

    }
    return (
        <>
            <Header />
            <div className="formbackground">
                <form className='loginform' onSubmit={handleSubmit}>
                    <label className='label' htmlFor='email'>Email</label>
                    <input
                        id='email'
                        type='email'
                        name='email'
                        placeholder='Email'
                        value={formData.email}
                        onChange={handleChange}
                        className="input" />

                    <label className='label' htmlFor="password">Password</label>
                    <input
                        id='password'
                        type='password'
                        name='password'
                        placeholder='password'
                        value={formData.password}
                        onChange={handleChange}
                        className='input' />

                    <Button type='submit' disabled={isLoading}>
                        {isLoading ? "Logging in..." : "Submit"}
                    </Button>
                    {error && <p className="error">{error}</p>}
                </form>
            </div>
            <div>
                <Footer />
            </div>
        </>
    )
}

export default Login; 