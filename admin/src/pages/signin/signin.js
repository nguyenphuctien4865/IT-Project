import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, Container, Form, Spinner } from "react-bootstrap";
import "./SigninupPage.css";
import { toast } from "react-toastify";
import axios from "./../../hooks/axios";
import Cookies from "js-cookie";
import { AuthContext } from "../../context/AuthContext";
import { useEffect, useRef } from "react";
import { notice } from "../../hooks/toast.js";
function Signin() {
  const codeVerify = useRef();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { user, loading, error, dispatch } = useContext(AuthContext);
  const [rePassword, setRePassword] = useState("");
  const [flagForget, setFlagForget] = useState(false);
  const [code, setCode] = useState();
  const [isLoading, setLoading] = useState(false);
  const [isVerify, setVerify] = useState(false);

  const navigate = useNavigate();
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [navigate, user]);
  const checkFormPassword = (input) => {
    if (input.length < 8) {
      return false;
    }
    return true;
  };
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
      if (data.success === false) {
        toast.error("Wrong email or password");
        return;
      }
      if (data.isAdmin === false) {
        toast.error("You are not admin");
        return;
      }
      toast.success("Success Sign in");
      Cookies.set("userInfo", JSON.stringify(data));
      dispatch({ type: "LOGIN_SUCCESS", payload: data });

      navigate("/dashboard", { state: { user: data } });
    } catch (err) {
      console.log(err.message);
      toast.error("Invalid username or password");
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
  return (
    <Container className="signinup-container">
      {flagForget ? (
        <Card>
          <Card.Body>
            <div className="signinup-header">
              <h1>Forget Password</h1>
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
              <Button
                variant="dark"
                type="submit"
                className="signinup-button mt-3"
              >
                Sign In
              </Button>
              <div className="signinup-forget">
                <div>or</div>
                <Button variant="light" onClick={handleForgetPwd}>
                  Forget password
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      )}
    </Container>
  );
}

export default Signin;
