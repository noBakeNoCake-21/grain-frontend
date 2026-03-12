import { useState, useContext, useRef } from "react";
import { UserContext } from "../context";
import Header from "../components/Header";
import Button from "../components/Button";
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

    const movieInputRef = useRef();
    const posterInputRef = useRef();

    const navigate = useNavigate();

    function handleChange(e) {
        const { name, value, files, type } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: type === "file" ? files[0] : value  // store the File object
        }));
    };



    // handle submit 
    async function handleSubmit(e) {
        e.preventDefault();
        console.log("submit triggered");

        if (!formData.movieFile || !formData.posterFile) {
            alert("Please select both a movie file and a poster image.");
            return;
        }
        setIsLoading(true);
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

        const { duration, name, filetype } = await getVideoData(file);


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
                    setIsLoading(false);
                    console.log(res);
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
                    console.log("submit fired");
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
                    {formData.posterFile && <p>Selected poster: {formData.posterFile.name}</p>}

                    <Button type='submit'>Upload</Button>
                </form>
                {isLoading && <p>Uploading...</p>}
                <div className="movieFormat">
                    <h3>Please upload to these file specifications</h3>
                    <p>Resolution: 1920x1080</p>
                    <p>Codec: h264</p>
                    <p>FileWrapper: mp4</p>
                    <p>Poster Ratio Size: 2:3</p>
                </div>
            </div>
        </div>
    )
}

export default Upload; 