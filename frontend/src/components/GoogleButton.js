import Button from "react-bootstrap/Button";
import "../styles/googleButton.css";

export default function GoogleSignUpButton() {
    const BACKEND_URI = process.env.REACT_APP_BACKEND_URI;
    const clickHandler = () => {
        window.location.assign(`${BACKEND_URI}/auth/callback/google/`);
    };

    return (
        <div className = 'login'>
            <header> STOCK PRICES </header>
            <Button onClick = { clickHandler } size = "lg" > Continue With Google </Button>
        </div>
    );
}

