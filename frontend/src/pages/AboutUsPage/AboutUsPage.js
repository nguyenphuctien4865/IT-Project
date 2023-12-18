import { Button } from "react-bootstrap";
import { Helmet } from "react-helmet-async";
import "./AboutUsPage.css";

function AboutUsPage() {
  return (
    <div className="aboutus-container">
      <Helmet>
        <title>About Us</title>
      </Helmet>
      <div className="aboutus-card">
        <img
          className="aboutus-dev-avatar"
          src="assets/images/avatar-20110573.jpg"
          alt="John"
        />
        <h1>Nguyễn Phúc Tiền</h1>
        <h2 className="aboutus-code">20110573</h2>
        <p className="aboutus-desc">
          HCMC University of Technology and Education
        </p>
        <p>
          <a href="#" className="aboutus-link">
            <Button variant="dark" className="aboutus-btn-contact">
              Contact
            </Button>
          </a>
        </p>
      </div>
      <div className="aboutus-card">
        <img
          className="aboutus-dev-avatar"
          src="assets/images/avatar-21110834.jpg"
          alt="John"
        />
        <h1>Trần Trọng Khang</h1>
        <h2 className="aboutus-code">21110834</h2>
        <p className="aboutus-desc">
          HCMC University of Technology and Education
        </p>
        <p>
          <a href="#">
            <Button variant="dark" className="aboutus-btn-contact">
              Contact
            </Button>
          </a>
        </p>
      </div>
      <div className="aboutus-card">
        <img
          className="aboutus-dev-avatar"
          src="assets/images/avatar-21110855.jpg"
          alt="John"
        />
        <h1>Đặng Minh Thiện </h1>
        <h2 className="aboutus-code">21110855</h2>
        <p className="aboutus-desc">
          HCMC University of Technology and Education
        </p>
        <p>
          <a href="#" className="aboutus-link">
            <Button variant="dark" className="aboutus-btn-contact">
              Contact
            </Button>
          </a>
        </p>
      </div>
    </div>
  );
}

export default AboutUsPage;
