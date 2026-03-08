import { useEffect } from "react";
import { useState, useContext } from "react";
import { useNavigate } from "react-router";
import axios from "axios";


//Components 
import Header from "../components/Header";
import Button from "../components/Button";
import { UserContext } from "../context";



function Signup() {

    const { currentUser, setCurrentUser } = useContext(UserContext);

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        username: "",
        profilePic: null,
        email: "",
        password: "",

    });


    function handleChange(e) {
        const { name, value, files, type } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: type === "file" ? files[0] : value  // store the File object
        }));
    };


    function handleSubmit(e) {
        e.preventDefault();
        const signupData = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            if (key === 'profilePic') {

                if (value) signupData.append(key, value);

            } else {
                signupData.append(key, value);
            }
        });

        axios.post("/api/signup", signupData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }).then(res => {
            console.log("User signed up!", res.data);
            setCurrentUser(res.data);
            setFormData({
                firstName: "",
                lastName: "",
                username: "",
                profilePic: null,
                email: "",
                password: "",
            });
            navigate('/dashboard');

        }).catch(err => console.error(err));
    }


    return (
        <div>
            <Header />
            <div className="formbackground">
                <form className="loginform" onSubmit={handleSubmit}>
                    <label className="label" htmlFor="firstname">First Name</label>
                    <input
                        className="input"
                        id='firstname'
                        type='text'
                        name='firstName'
                        placeholder='First Name'
                        value={formData.firstName}
                        onChange={handleChange}
                        required />
                    <label className="label" htmlFor="lastname">Last Name</label>
                    <input
                        className="input"
                        id='lastname'
                        type='text'
                        name='lastName'
                        placeholder='Last Name'
                        value={formData.lastName}
                        onChange={handleChange}
                        required />
                    <label className="label" htmlFor="username">User Name</label>
                    <input
                        className="input"
                        id='username'
                        type='text'
                        name='username'
                        placeholder='User Name'
                        value={formData.username}
                        onChange={handleChange}
                        required />
                    <label className="label" htmlFor="email">Email</label>
                    <input
                        className="input"
                        id='email'
                        type='text'
                        name='email'
                        placeholder='Email'
                        value={formData.email}
                        onChange={handleChange}
                        required />
                    <label className="label" htmlFor="password">Password</label>
                    <input
                        className="input"
                        id='password'
                        type='password'
                        name='password'
                        placeholder='Password'
                        value={formData.password}
                        onChange={handleChange}
                        required />
                    <label className="label" htmlFor="profilePic">Profile Picture</label>
                    <input
                        className="input"
                        id="profilePic"
                        type="file"
                        name="profilePic"
                        accept="image/*"
                        onChange={handleChange}
                    />
                    <Button type='submit'>Submit</Button>
                </form>
            </div>
        </div>
    )
}


export default Signup; 