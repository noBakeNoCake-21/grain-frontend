import Button from './Button';
import '../css/Footer.css';


function Footer() {


    return (

        <>
            <div className="divider" />

            <footer className="footer">
                <div className="footerContent">

                    <p className="brand">
                        Grain — A platform for filmmakers
                    </p>

                    <p className="creator">
                        Built by Lakshay Guliani
                    </p>

                    <a
                        href="https://github.com/noBakeNoCake-21"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <Button className="login">
                            View on GitHub
                        </Button>
                    </a>

                    <p className="copyright">
                        © 2026 Grain. All rights reserved.
                    </p>

                </div>
            </footer>
        </>
    )
}

export default Footer; 