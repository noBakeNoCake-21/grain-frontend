import { useState, useContext, useEffect, } from "react";
import { useNavigate } from "react-router";
import { UserContext } from "../context";
import axios from "axios";
import Button from "../components/Button";
import Header from "../components/Header";
import Footer from "../components/Footer";

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

    function handleChange(e) {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            const data = { email: formData.email, password: formData.password }
            //login api needed 
            const response = await axios.post("/api/login", data);
            const user = response.data;
            setCurrentUser(user);
            setError('');
            setFormData({ email: "", password: "", });
        } catch (error) {
            console.log(error);
            setError('Invaild Password or Email');
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
                        type='text'
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

                    <Button type='submit'>Submit</Button>
                    {error && <p>{error}</p>}
                </form>
            </div>
            <div>
                <Footer />
            </div>
        </>
    )
}

export default Login; 