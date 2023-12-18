import { Link, useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  Container,
  Form,
  Spinner,
  Col,
  Row,
} from "react-bootstrap";
import { toast } from "react-toastify";
import { useState, useEffect, useRef } from "react";
import "./SigninupPage.css";
import axios from "../../hooks/axios.js";
import { Helmet } from "react-helmet-async";

function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [codeVerify, setCodeVerify] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [set, setCode] = useState("");
  const code = useRef();
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const navigate = useNavigate();
  const handleClick = async () => {
    if (!email) {
      toast.warn("Please enter your email information", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      return;
    }
    if (await isExistedUser(email)) {
      toast.warn(`Existed user ${email}`, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      return;
    }
    setLoading(true);
  };
  const handleSignUp = async () => {
    if (!checkTextBox()) {
      toast.warn("Please complete all information", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      return;
    }
    console.log("Sign Up: ", code.current, codeVerify);
    if (code.current !== codeVerify) {
      //code.current !== codeVerify
      toast.error("Wrong verify code", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      return;
    } else if (password !== passwordConfirm) {
      toast.error("Wrong password confirm", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      return;
    }
    const user = {
      email,
      password,
      name,
      avatar: "/assets/images/default-user.png",
    };
    const msg = registerNewUser(user);
    // TODO: format code toast and navigate to home after register new user
    toast.success(msg, {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });

    navigate("/signin");
  };
  useEffect(() => {
    async function sendCode() {
      if (isLoading) {
        await sleep(1000);
        const { data } = await axios.post("/auth/code", { email: email });
        code.current = data.code;
        await sleep(1000);
        setLoading(false);
      }
    }
    sendCode();
  }, [isLoading]);
  function checkTextBox() {
    if (name && password && passwordConfirm && email && codeVerify) {
      return true;
    }
    return false;
  }
  async function isExistedUser(email) {
    const user = await axios.get(`/users/email/${email}`);
    if (user.data === null) {
      return false;
    }
    return true;
  }
  async function registerNewUser(user) {
    try {
      const result = await axios.post("/auth/register", user);
      return result;
    } catch (error) {}
  }
  return (
    <div>
      <Helmet>
        <title>Sign up</title>
      </Helmet>
      <Container className="signinup-container">
        <Card>
          <Card.Body>
            <div className="signinup-header">
              <h1>Sign Up</h1>
              <p>
                Already have an account? <Link to="/signin"> Sign in</Link>
              </p>
            </div>
            <Form>
              <Form.Group
                className="mb-3"
                controlId="name"
                onChange={(e) => setName(e.target.value)}
                value={name}
              >
                <Form.Label>Name</Form.Label>
                <Form.Control type="text" required />
              </Form.Group>
              <Form.Group
                className="mb-3"
                controlId="email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
              >
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" required />
              </Form.Group>
              <Form.Group
                as={Row}
                className="mb-3"
                controlId="codeVerify"
                onChange={(e) => setCodeVerify(e.target.value)}
                value={codeVerify}
              >
                {isLoading ? (
                  <Col>
                    <Spinner animation="border" variant="info" />
                  </Col>
                ) : (
                  <Col>
                    <Button
                      variant="primary"
                      disabled={isLoading}
                      onClick={!isLoading ? handleClick : null}
                    >
                      {isLoading ? "Loading…" : "Send code"}
                    </Button>
                  </Col>
                )}

                <Col sm="9">
                  <Form.Label>Code</Form.Label>
                  <Form.Control type="text" placeholder="Code" />
                </Col>
              </Form.Group>

              <Form.Group
                className="mb-3"
                controlId="password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
              >
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" required />
              </Form.Group>
              <Form.Group
                className="mb-3"
                controlId="passwordConfirm"
                onChange={(e) => setPasswordConfirm(e.target.value)}
                value={passwordConfirm}
              >
                <Form.Label>Password Confirm</Form.Label>
                <Form.Control type="password" required />
              </Form.Group>
              <Button
                variant="dark"
                className="signinup-button"
                onClick={handleSignUp}
              >
                Sign Up
              </Button>

              <div className="signinup-footer">
                <div className="mt-1 mb-1">OR</div>
                <button type="button" class="login-with-google-btn">
                  Sign up with Google
                </button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}

export default SignupPage;
