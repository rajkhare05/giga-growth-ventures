import NavigationBar from "./NavigationBar";
import SearchStock from "./SearchStock";

export default function Dashboard({ info }) {
    return (
        <div>
            <NavigationBar email = { info.email } />
            <SearchStock firstName = { info.firstName } />
        </div>
    );
}

