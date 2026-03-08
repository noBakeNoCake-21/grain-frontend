import axios from "axios";
import { createContext, useEffect, useState } from "react";

const UserContext = createContext();

function UserProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        async function verifyUser() {
            try {
                const response = await axios.get('/api/login/me', { withCredentials: true });
                setCurrentUser(response.data);
            } catch (error) {
                console.log(error);
                setCurrentUser(null);
            }
        }
        verifyUser();
    }, [])

    return (
        <UserContext.Provider value={{ currentUser, setCurrentUser }}>
            {children}
        </UserContext.Provider>
    );
}

export { UserContext, UserProvider } 