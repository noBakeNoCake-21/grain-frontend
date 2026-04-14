import { useEffect } from "react";
import { useState, useContext } from "react";
import { useNavigate } from "react-router";
import axios from "axios";


//Components 
import Header from "../components/Header";
import Button from "../components/Button";
import Loading from "../components/Loading";
import { UserContext } from "../context";
import Footer from "../components/Footer";



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

    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);


    function handleChange(e) {
        const { name, value, files, type } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: type === "file" ? files[0] : value  // store the File object
        }));

        setError(prev => ({
            ...prev,
            [name]: null
        }));
    };

    function validateForm() {
        const { firstName, lastName, username, email, password, profilePic } = formData;
        const errors = {};

        // First/Last names
        if (!firstName.trim()) errors.firstName = "First name is required";
        if (!lastName.trim()) errors.lastName = "Last name is required";

        // Profile picture
        if (!profilePic) errors.profilePic = "Profile picture must be set";

        // Username: 5–15 chars, letters, numbers, _ or -
        const usernameRegex = /^[a-zA-Z0-9_-]{5,15}$/;
        if (!usernameRegex.test(username)) {
            errors.username = "Username must be 5–15 characters and contain only letters, numbers, _ or -";
        }

        // Email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            errors.email = "Please enter a valid email address";
        }

        // Password: min 6 chars, at least one letter and one number
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/;
        if (!passwordRegex.test(password)) {
            errors.password = "Password must be at least 6 characters and include at least one letter and one number";
        }

        setError(errors); // now an object keyed by field
        return Object.keys(errors).length === 0; // true if no errors
    }




    function handleSubmit(e) {
        e.preventDefault();

        if (!validateForm()) {
            console.log("Form blocked");
            return;
        };

        setLoading(true);

        const signupData = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            if (key === 'profilePic') {

                if (value) signupData.append(key, value);

            } else {
                signupData.append(key, value);
            }
        });

        axios.post("/api/signup", signupData, {
            withCredentials: true,
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }).then(res => {
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

        }).catch(err => {
            console.error(err);
            setError({ general: "Signup failed. Please try again." });
        }).finally(() => {
            setLoading(false);
        })
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
                    {error?.firstName && <p className="error">{error.firstName}</p>}
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
                    {error?.lastName && <p className="error">{error.lastName}</p>}
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
                    {error?.username && <p className="error">{error.username}</p>}
                    <label className="label" htmlFor="email">Email</label>
                    <input
                        className="input"
                        id='email'
                        type='email'
                        name='email'
                        placeholder='Email'
                        value={formData.email}
                        onChange={handleChange}
                        required />
                    {error?.email && <p className="error">{error.email}</p>}
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
                    {error?.password && <p className="error">{error.password}</p>}
                    <label className="label" htmlFor="profilePic">Profile Picture</label>
                    <input
                        className="input"
                        id="profilePic"
                        type="file"
                        name="profilePic"
                        accept="image/*"
                        onChange={handleChange}
                        required />
                    {error?.profilePic && <p className="error">{error.profilePic}</p>}
                    <Button type='submit' disabled={loading}>
                        {loading ? "Signing up..." : "Submit"}
                    </Button>
                    {error?.general && <p className="error">{error.general}</p>}
                </form>
            </div>
            <div>
                <Footer />
            </div>
        </div>
    )
}


export default Signup;












// 1. Email field is type='text'

// Currently:

// <input type='text' name='email' />
// Issue: HTML will not validate the email format.
// Fix: Use type='email' for native browser validation.

// 2. No frontend validation beyond required
// Right now, anything that passes “not empty” will go through.
// Could validate:
// Email format (includes('@'))
// Password strength (min length, maybe letters + numbers)
// Username restrictions (length, allowed characters)

// 3. No error handling for Axios

// Currently:

// .catch(err => console.error(err))
// Issues:
// User sees nothing if signup fails
// Backend errors (duplicate email, weak password, server errors) are hidden
// Fix: Store error in state and display under the form.

// 4. No loading state
// Users could click submit multiple times → duplicate requests
// Fix: Add isLoading state, disable button, maybe show a spinner.

// 5. Profile picture optional but not clear
// Currently it’s optional → good, but consider:
// Max file size
// Accepted formats
// Maybe a preview before submit

// 6. Password visibility
// Users can mistype password and don’t see it
// Optional: add a “show password” toggle

// 7. No early client-side validation
// Right now, all fields are sent to backend even if invalid
// Could validate before FormData:
// firstName/lastName non-empty
// username length and characters
// email format
// password length & strength

// This reduces unnecessary backend requests.

// 8. No feedback for successful signup
// Currently, redirect happens, but maybe show “Welcome!” message or toast.

// 9. Potential file overwrite issue
// Using files[0] → only the first file is stored, which is fine
// Could add checks:
// Confirm it’s actually an image
// Reject files above X MB