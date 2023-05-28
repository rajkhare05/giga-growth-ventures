import { useEffect, useState } from "react";
import Dashboard from "./components/Dashboard";
import GoogleButton from "./components/GoogleButton";

function App() {

    const [session, setSession] = useState(null);
    const [loggedIn, setLoggedIn] = useState(false);

    const sessionManager = async () => {
        try {
            const res = await fetch('http://127.0.0.1:4000/session', {
                method: 'GET',
                mode: 'cors',
                credentials: 'include' 
            });

            const data = await res.json();

            if (Object.keys(data).length === 0) {
                setSession(null);
                setLoggedIn(false);

            } else { 
                setSession(data);
                setLoggedIn(true);
            }
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        sessionManager();
        const interval = setInterval(sessionManager, 60 * 60 * 1000);

        return () => {
            clearInterval(interval);
        };
    }, []);

    return (
        <div className="App">
            { loggedIn ? <Dashboard info = { session } /> : <GoogleButton /> }
        </div>
    );
}

export default App;

