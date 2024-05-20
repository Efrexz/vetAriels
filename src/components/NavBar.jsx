import {Logo} from "./Logo.jsx";

function NavBar() {
    return (
        <nav>
            <Logo/>
            <ul>
                <li>Home</li>
                <li>About</li>
                <li>Contact</li>
            </ul>
        </nav>
    )
}

export {NavBar}