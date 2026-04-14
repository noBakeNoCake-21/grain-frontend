import { useState, useContext, useRef } from "react";
import { UserContext } from "../context";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Button from "../components/Button";
import Loading from "../components/Loading";
import axios from "axios";
import '../css/MoviePage.css'
import { Navigate, useNavigate } from "react-router";
import { Upload as TusUpload } from "tus-js-client";


function Upload() {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        movieFile: null,
        posterFile: null,
        genre: ""
    });

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const movieInputRef = useRef();
    const posterInputRef = useRef();

    const navigate = useNavigate();

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
        const { title, description, movieFile, posterFile, genre } = formData

        const errors = {};

        // Title
        if (!title.trim()) {
            errors.title = "Title is required";
        }

        // Description
        if (!description.trim()) {
            errors.description = "Description is required";
        }

        // Genre (no spaces, short)
        const genreRegex = /^[a-zA-Z]{1,10}$/;
        if (!genreRegex.test(genre)) {
            errors.genre = "Genre must be one word, letters only (max 10 chars)";
        }

        // Movie file check
        if (!movieFile) {
            errors.movieFile = "Movie file is required";
        } else {
            if (!movieFile.type.startsWith("video/")) {
                errors.movieFile = "File must be a video";
            }

            // const maxSize = 2 * 1024 * 1024 * 1024; // 2GB
            // if (movieFile.size > maxSize) {
            //     errors.movieFile = "Video file is too large (max 2GB)";

        }

        // Poster file
        if (!posterFile) {
            errors.posterFile = "Poster image is required";
        } else {
            if (!posterFile.type.startsWith("image/")) {
                errors.posterFile = "File must be an image";
            }

            // const maxSize = 5 * 1024 * 1024; // 5MB
            // if (posterFile.size > maxSize) {
            //     errors.posterFile = "Image too large (max 5MB)";
            // }
        }

        setError(errors);
        return Object.keys(errors).length === 0;
    }



    // handle submit 
    async function handleSubmit(e) {
        e.preventDefault();
        console.log("submit triggered");

        //Check form 
        if (!validateForm()) {
            setIsLoading(false);
            return;
        }

        //Set Loading now, if set before form validation, I could stay in loading forever 
        setIsLoading(true);

        //Get MovieFile MetaData
        const getVideoData = (file) => {
            return new Promise((resolve, reject) => {
                const url = URL.createObjectURL(file);
                const video = document.createElement('video');

                video.preload = 'metadata';
                video.src = url;

                video.onloadedmetadata = () => {
                    URL.revokeObjectURL(url);
                    resolve({
                        duration: Math.ceil(video.duration),
                        name: file.name,
                        filetype: file.type
                    });
                };

                video.onerror = (err) => {
                    reject(err);
                };
            });
        };



        const file = formData.movieFile;
        let duration, name, filetype;

        try {
            ({ duration, name, filetype } = await getVideoData(file));
        } catch (err) {
            setError(prev => ({ ...prev, movieFile: "Could not read video file" }));
            setIsLoading(false);
            return;
        }



        const upload = new TusUpload(file, {
            endpoint: '/api/users/streamupload',
            storeFingerprintForResuming: false,
            removeFingerprintOnSuccess: true,
            overridePatchMethod: false,
            withCredentials: true,
            chunkSize: 50 * 1024 * 1024,
            metadata: {
                name: name,
                filetype: filetype,
                maxdurationseconds: String(duration)
            },
            onError: (err) => {
                console.error("Tus upload failed:", err);
                setIsLoading(false);
            },
            onProgress: (bytesUploaded, bytesTotal) => {
                const percentage = ((bytesUploaded / bytesTotal) * 100).toFixed(2);
                console.log(`Upload progress: ${percentage}%`);
            },
            onSuccess: () => {

                const uid = upload.url.split('/').pop();

                console.log("TUS Upload finished:", uid);

                const signupData = new FormData();
                Object.entries(formData).forEach(([key, value]) => {
                    if (key === "movieFile") {
                        signupData.append(key, uid); // Send UID instead of file
                    } else {
                        signupData.append(key, value);
                    }
                });

                axios.post('/api/users/upload', signupData, {
                    withCredentials: true, headers: {
                        "Content-Type": "multipart/form-data"
                    }
                }).then((res) => {
                    setFormData(
                        {
                            title: "",
                            description: "",
                            movieFile: null,
                            posterFile: null,
                            genre: ""
                        });
                    movieInputRef.current.value = "";
                    posterInputRef.current.value = "";
                    navigate('/dashboard');
                }).catch(err => {
                    console.error(err);
                    setIsLoading(false);
                });
            },

        });
        upload.start();
    }



    return (
        <div>
            <Header />
            <div className="formbackground">
                <form className="loginform" onSubmit={handleSubmit}>
                    <label className="label" htmlFor="title">Title</label>
                    <input
                        className="input"
                        id="title"
                        type="text"
                        name="title"
                        placeholder="Movie Title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                    />
                    {error?.title && <p className="error">{error.title}</p>}

                    <label className="label" htmlFor="description">Description</label>
                    <textarea
                        className="input"
                        id="description"
                        name="description"
                        placeholder="Description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={4}
                        required
                    />
                    {error?.description && <p className="error">{error.description}</p>}
                    <label className="label" htmlFor="genre">Genre</label>
                    <input
                        className="input"
                        id="genre"
                        name="genre"
                        placeholder="Genre - One Word, No space"
                        value={formData.genre}
                        onChange={handleChange}
                        maxLength={10}
                        pattern="\S+"
                        required
                    />
                    {error?.genre && <p className="error">{error.genre}</p>}
                    <label className="label">Upload Movie</label>
                    <input
                        className="input"
                        id="file"
                        type="file"
                        name="movieFile"
                        accept="video/*"
                        onChange={handleChange}
                        ref={movieInputRef}
                        required
                    />
                    {error?.movieFile && <p className="error">{error.movieFile}</p>}

                    {formData.movieFile && <p>Selected movie: {formData.movieFile.name}</p>}

                    <label className="label" htmlFor="img">Upload Poster</label>
                    <input
                        className="input"
                        id="img"
                        type="file"
                        name="posterFile"
                        accept="image/*"
                        onChange={handleChange}
                        ref={posterInputRef}
                        required
                    />
                    {error?.posterFile && <p className="error">{error.posterFile}</p>}
                    {formData.posterFile && <p>Selected poster: {formData.posterFile.name}</p>}

                    <Button type='submit' disabled={isLoading}>
                        {isLoading ? "Uploading..." : "Submit"}
                    </Button>
                </form>
                {isLoading && <Loading />}
                <div className="movieFormat">
                    <h3>Please upload to these file specifications</h3>
                    <p>Resolution: 1920x1080</p>
                    <p>Codec: h264</p>
                    <p>FileWrapper: mp4</p>
                    <p>Poster Ratio Size: 2:3</p>
                </div>
            </div>
            <div>
                <Footer />
            </div>
        </div>
    )
}

export default Upload; 