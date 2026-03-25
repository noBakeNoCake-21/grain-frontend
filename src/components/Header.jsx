import { NavLink } from "react-router";
import { useContext } from "react";
import { UserContext } from "../context";
import '../css/MoviePage.css';

function Header() {

    const { currentUser } = useContext(UserContext);

    return (
        <>
            <header className="header">
                <NavLink to={'/'} className={({ isActive }) => isActive ? 'appname active' : 'appname'}>GRAIN</NavLink>
            </header>
            <nav className="nav">
                {currentUser ? null : <NavLink to={'/login'} className={({ isActive }) => isActive ? 'login active' : 'login'}>Login</NavLink>}
                {currentUser ? null : <NavLink to={'/signup'} className={({ isActive }) => isActive ? 'login active' : 'login'}>Sign Up</NavLink>}
                {currentUser ? <NavLink to={'/dashboard'} className={({ isActive }) => isActive ? 'login active' : 'login'}>Dashboard</NavLink> : null}
                {currentUser ? <NavLink to={'/upload'} className={({ isActive }) => isActive ? 'uploadButton active' : 'uploadButton'}>Upload</NavLink> : null}
                <NavLink to={'/About'} className={({ isActive }) => isActive ? 'login active' : 'login'}>About</NavLink>
            </nav>
            <div className="divider" />
        </>

    )
}

export default Header; 