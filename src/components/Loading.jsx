import "../css/Loading.css";

function Loading() {
    return (
        <div className="reel-wrapper">
            <div className="reel">
                <div className="reel-center">
                    <div className="reel-center-inner"></div>
                </div>
                <div className="sprocket s1"></div>
                <div className="sprocket s2"></div>
                <div className="sprocket s3"></div>
                <div className="sprocket s4"></div>
                <div className="sprocket s5"></div>
                <div className="sprocket s6"></div>
            </div>
            <p className="loading-text">Loading...</p>
        </div>
    );
}

export default Loading; 