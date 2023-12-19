import DashboardIcon from "@mui/icons-material/Dashboard";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import StoreIcon from "@mui/icons-material/Store";
import CategoryIcon from "@mui/icons-material/Category";
import { Link } from "react-router-dom";
import "./sidebar.scss";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
const Sidebar = () => {
  const { dispatch } = useContext(AuthContext);
  const navigate = useNavigate();
  const logout = async () => {
    navigate("/signin");
    await dispatch({ type: "LOGOUT" });
    Cookies.remove("userInfo");
    window.open("http://localhost:8800/auth/logoutAdmin", "_self");
  };
  return (
    <div className="sidebar">
      {/* <div className="top">
        <Link to="/" style={{ textDecoration: "none" }}>
          <span className="logo">ADClothing</span>
        </Link>
      </div> */}
      <hr />
      <div className="center">
        <ul>
          <p className="title">MAIN</p>
          <Link to="/dashboard" style={{ textDecoration: "none" }}>
            <li>
              <DashboardIcon className="icon" />
              <span>Dashboard</span>
            </li>
          </Link>
          <p className="title">LISTS</p>
          <Link to="/dashboard/categories" style={{ textDecoration: "none" }}>
            <li>
              <CategoryIcon className="icon" />
              <span>Categories</span>
            </li>
          </Link>
          <Link to="/dashboard/users" style={{ textDecoration: "none" }}>
            <li>
              <PersonOutlineIcon className="icon" />
              <span>Users</span>
            </li>
          </Link>
          <Link to="/dashboard/products" style={{ textDecoration: "none" }}>
            <li>
              <StoreIcon className="icon" />
              <span>Products</span>
            </li>
          </Link>
          <p className="title">USER</p>
          {/* <li>
            <AccountCircleOutlinedIcon className="icon" />
            <span>Profile</span>
          </li> */}
          <li onClick={logout}>
            <ExitToAppIcon className="icon" />
            <span>Logout</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
