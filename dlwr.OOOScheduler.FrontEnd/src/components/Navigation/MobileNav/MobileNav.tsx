import { Link } from "react-router-dom";
import Profile from "../Profile/Profile";
import { LogOut } from "../../../services/MsalService";
import { useState } from "react";
import { IsTeams } from "../../../services/AuthService";

export function MobileNav() {
  const [show, setShow] = useState(false)

    return (
        <nav className="HeaderStyle NavText">
            <img src={"/delaware-logo-white-rgb.svg"} alt="delaware" />
            <div className="DropDown" onClick={() => setShow(!show)}>
                <Profile />
                <div className={"DropDownContent Mobile " + (show ? "show" : "")}>
                    <Link to="/settings" className="DeviderHoriz">Settings</Link>
                    <Link to="/" className="DeviderHoriz">Dashboard</Link>
                    <Link to="/messages" className="DeviderHoriz">Messages </Link>
                    {!IsTeams() && <a onClick={LogOut}>Sign out</a>}
                </div>
            </div>

        </nav>
    );
}