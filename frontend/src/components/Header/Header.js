import { Link } from "react-router-dom";
import {
  Badge,
  Button,
  Form,
  InputGroup,
  Nav,
  NavDropdown,
} from "react-bootstrap";
import { useContext, useState } from "react";
import Cookies from "js-cookie";
import { AuthContext } from "../../context/AuthContext.js";
import { Store } from "./../../Store";
import "./Header.css";
import axios from "../../hooks/axios.js";
import { useNavigate } from "react-router-dom"
function Header({ user }) {
  const navigate = useNavigate();
  const { state } = useContext(Store);
  const [textSearch, setTextSearch] = useState("");
  const {
    cart: { cartItems },
  } = state;
  const { dispatch } = useContext(AuthContext);

  const logout = async () => {
    navigate("/");
    user = null;
    await dispatch({ type: "LOGOUT" });
    Cookies.remove("userInfo");
    window.open("http://localhost:8800/auth/logout", "_self");
  };
  const handleSearch = async (e) => {
    try {
      const input = String(textSearch).replaceAll(" ", "-");
      let url;
      if (input.trim() !== "") {
        url = `/search/${input}`;
        navigate("/shop", { state: { url } });
      }
      else {
        navigate("/shop");
      }
      //const { data } = await axios.get(url);
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div className="header">
      <Link to="/" className="no-decor">
        <h3>ADClothing</h3>
      </Link>
      <div className="header-info">
        <Link to="/" className="no-decor">
          <div>Home</div>
        </Link>
        <Link to="/shop" className="no-decor">
          <div>Shop</div>
        </Link>
        <Link to="/aboutus" className="no-decor">
          <div>About Us</div>
        </Link>
      </div>
      <div className="header-right">
        <InputGroup className="header-search">
          <Form.Control
            placeholder="Find any product"
            aria-label="Find any product"
            aria-describedby="basic-addon2"
            onChange={e => setTextSearch(e.target.value)}
          />
          <Button variant="outline-secondary" type="submit" id="button-addon2" onClick={handleSearch}>
            <i class="fa-solid fa-magnifying-glass"></i>
          </Button>
        </InputGroup>
        <Link to="/cart" className="no-decor">
          <div className="cart-container">
            <i class="fa-solid fa-cart-shopping"></i>
            {cartItems.length > 0 && (
              <Badge pill bg="danger" className="badge-notification">
                {cartItems.reduce(
                  (accumulate, currentValue) =>
                    accumulate + currentValue.quantity,
                  0
                )}
              </Badge>
            )}
          </div>
        </Link>
        {user ? (
          <Nav>
            <div className="list">
              <img
                src={user.imgPath}
                alt=""
                className="avatar"
                referrerPolicy="no-referrer"
              />

              <NavDropdown title={user.name} className="header-user">
                <NavDropdown.Item>
                  <Link to="/myprofile" className="no-decor">
                    My profile
                  </Link>
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item>
                  <Link to="/checkouthistory" className="no-decor">
                    Checkout History
                  </Link>
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={logout}>Logout</NavDropdown.Item>
              </NavDropdown>
            </div>
          </Nav>
        ) : (
          <div className="list">
            <Link className="link no-decor" to="signin">
              Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default Header;
