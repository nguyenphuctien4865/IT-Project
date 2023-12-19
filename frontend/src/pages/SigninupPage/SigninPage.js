import { useContext, useState, useEffect, useRef } from "react";
import {
  Button,
  Card,
  Container,
  Form,
  Spinner,
  Col,
  Row,
} from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { notice } from "../../hooks/toast.js";
import { Store } from "../../Store";
import axios from "./../../hooks/axios";
import "./SigninupPage.css";
import Cookies from "js-cookie";
import { AuthContext } from "../../context/AuthContext.js";
import { Helmet } from "react-helmet-async";

// TODO: baro mat khi khong nhap gi ma van verify thanh cong
function SigninPage() {
  const codeVerify = useRef();
  const { user, loading, error, dispatch } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [flagForget, setFlagForget] = useState(false);
  const [code, setCode] = useState();
  const [isLoading, setLoading] = useState(false);
  const [isVerify, setVerify] = useState(false);
  // console.log("🚀 ~ ", codeVerify, password, rePassword, email, code);
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const { search } = useLocation();
  const redirectInUrl = new URLSearchParams(search).get("redirect");
  const redirect = redirectInUrl ? redirectInUrl : "/";

  const navigate = useNavigate();

  const google = () => {
    window.open("http://localhost:8800/auth/google", "_self");
    // navigate(redirect || "/");
  };
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [navigate, user]);

  async function isExistedUser(email) {
    const user = await axios.get(`/users/email/${email}`);
    if (user.data === null) {
      return false;
    }
    return true;
  }
  const submithandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("/auth/login", {
        email: email,
        password: password,
      });
      // contextDispatch({
      //   type: "USER_SIGNIN",
      //   payload: data,
      // });
      if (data.success === false) {
        notice("error", "Wrong email or password", 1500);
        return;
      }
      notice("success", "Success Sign in", 1500);
      Cookies.set("userInfo", JSON.stringify(data));
      dispatch({ type: "LOGIN_SUCCESS", payload: data });

      navigate(redirect || "/", { state: { user: data } });
    } catch (err) {
      console.log(err.message);

      notice("error", "Invalid username or password", 1500);
    }
  };
  const handleChangePassword = async () => {
    console.log(email);
    if (password !== rePassword) {
      notice("warn", "Re-password incorrect", 2000);
    } else {
      if (checkFormPassword(password) === false) {
        notice("warn", "Password must be at least 8 characters", 2000);
        return;
      }
      try {
        const result = await axios.patch(`/users/${email}`, { password });
        if (result.data !== null) {
          notice("success", "Change password successfully !", 2000);
          codeVerify.current = "";
          await setFlagForget(false);
          await setVerify(false);
          await setPassword("");
          await setRePassword("");
          await setEmail("");
          navigate("/signin");
        }
      } catch (error) {
        console.log(error);
      }
    }
  };
  const handleForgetPwd = async () => {
    setFlagForget(true);
  };
  const handleCancel = async () => {
    codeVerify.current = "";
    setVerify(false);
    setCode("");
    setFlagForget(false);
  };
  const handleVerify = async () => {
    if (codeVerify.current === String(code)) {
      setRePassword("");
      setCode("");
      setVerify(true);
    } else {
      notice("warn", "Wrong code", 1500);
    }
  };
  const handleSendCode = async () => {
    if (!email) {
      notice("warn", "Please enter your email information", 2000);
      return;
    }
    if ((await isExistedUser(email)) === false) {
      notice("warn", `User ${email} is not exist`, 1500);
      return;
    }
    setLoading(true);
  };
  useEffect(() => {
    async function sendCode() {
      if (isLoading) {
        await sleep(1000);
        const { data } = await axios.post("/auth/code", { email: email });
        codeVerify.current = data.code;
        await sleep(1000);
        setLoading(false);
      }
    }
    sendCode();
  }, [isLoading]);
  const checkFormPassword = (input) => {
    if (input.length < 8) {
      return false;
    }
    return true;
  };
  return (
    <div>
      <Helmet>
        <title>Sign in</title>
      </Helmet>
      <Container className="signinup-container">
        {flagForget ? (
          <Card>
            <Card.Body>
              <div className="signinup-header">
                <h1>Forgot Password</h1>
              </div>

              {!isVerify ? (
                // form verify code
                <Form>
                  <div className="input-group">
                    {isLoading ? (
                      <div className="input-group-text" id="btnGroupAddon">
                        <Spinner animation="border" variant="info" />
                      </div>
                    ) : (
                      <Button
                        className="input-group-text"
                        id="btnGroupAddon"
                        variant="primary"
                        disabled={isLoading}
                        onClick={!isLoading ? handleSendCode : null}
                      >
                        {isLoading ? "Loading…" : "Send code"}
                      </Button>
                    )}
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Email"
                      aria-label="Input group example"
                      aria-describedby="btnGroupAddon"
                      onChange={(e) => setEmail(e.target.value)}
                      value={email}
                    />
                  </div>
                  <label className="form-label" htmlFor="code">
                    Code
                  </label>
                  <input
                    required
                    id="code"
                    className="form-control"
                    onChange={(e) => setCode(e.target.value)}
                    value={code}
                  />

                  <button
                    type="submit"
                    variant="dark"
                    className="btn btn-danger btn-fg"
                    onClick={handleCancel}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary btn-fg"
                    onClick={handleVerify}
                  >
                    Verfify
                  </button>
                </Form>
              ) : (
                // form change password
                <Form>
                  <Form.Group>
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      required
                      type="password"
                      className="mb-3"
                      controlId="password"
                      onChange={(e) => setPassword(e.target.value)}
                      value={password}
                    />
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>Re-Password</Form.Label>
                    <Form.Control
                      required
                      type="password"
                      className="mb-3"
                      controlId="rePassword"
                      onChange={(e) => setRePassword(e.target.value)}
                      value={rePassword}
                    />
                  </Form.Group>
                  <button
                    type="submit"
                    variant="dark"
                    className="btn btn-danger btn-fg"
                    onClick={handleCancel}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary btn-fg"
                    onClick={handleChangePassword}
                  >
                    Change Password
                  </button>
                </Form>
              )}
            </Card.Body>
          </Card>
        ) : (
          <Card>
            <Card.Body>
              <div className="signinup-header">
                <h1>Sign In</h1>
                <p>
                  Don’t have an account?{" "}
                  <Link to="/signup"> Create a free account</Link>
                  <p>or</p>
                  <Button variant="light" onClick={handleForgetPwd}>
                    <p>Forgot password</p>
                  </Button>
                </p>
              </div>
              <Form onSubmit={submithandler}>
                <div className="input-group mb-3">
                  <span
                    className="input-group-text"
                    id="inputGroup-sizing-default"
                  >
                    Email
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    aria-label="Sizing example input"
                    aria-describedby="inputGroup-sizing-default"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                  />
                </div>
                <div className="input-group mb-3">
                  <span
                    className="input-group-text"
                    id="inputGroup-sizing-default"
                  >
                    Password
                  </span>
                  <input
                    type="password"
                    className="form-control"
                    aria-label="Sizing example input"
                    aria-describedby="inputGroup-sizing-default"
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                  />
                </div>

                {/* <Form onSubmit={submithandler}>
                <Form.Group
                  className="mb-3"
                  controlId="userName"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                >
                  <Form.Label>Email</Form.Label>
                  <Form.Control required />
                </Form.Group>

                <Form.Group
                  className="mb-3"
                  controlId="password"
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                >
                  <Form.Label>Password</Form.Label>
                  <Form.Control type="password" required />
                </Form.Group> */}
                <Button
                  variant="dark"
                  type="submit"
                  className="signinup-button mt-3"
                >
                  Sign In
                </Button>

                <div className="signinup-footer">
                  <div className="mt-1 mb-1">OR</div>
                  <button
                    type="button"
                    className="login-with-google-btn"
                    onClick={google}
                  >
                    Sign in with Google
                  </button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        )}
      </Container>
    </div>
  );
}

export default SigninPage;
