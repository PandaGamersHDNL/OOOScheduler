import Profile from "./Profile/Profile";
import './Navigation.sass'
import { Link } from "react-router-dom";
import { useState } from "react";
import { LogOut } from "../../services/MsalService";
import { IsTeams } from "../../services/AuthService";

export default function Navigation() {
  const [show, setShow] = useState(false)
  
  return (
    <nav className="HeaderStyle NavText">
      <div className="BrandStyle">
        <img src={"/delaware-logo-white-rgb.svg"} alt="delaware" />
        <h1>OOOScheduler</h1>
      </div>
      <div className="UserStyle NavText">
        <Link to="/"><h1 className="Devider">Dashboard</h1></Link>
        <Link to="/messages"><h1 className="Devider">Messages</h1> </Link>
        <div className="DropDown" onClick={() => setShow(!show)}>
          <Profile />
          <div className={"DropDownContent " + (show ? "show" : "")}>
            <Link to="/settings"><h1>Settings</h1></Link>
            {!IsTeams() && <h1 onClick={LogOut}>sign out</h1>}
          </div>
        </div>
      </div>
    </nav>
  )
}
