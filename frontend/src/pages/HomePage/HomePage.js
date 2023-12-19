import { Col, Row } from "react-bootstrap";
import { useRef, useState } from "react";
import Slider from "../../components/Slider/Slider";
import Categories from "../../components/Categories/Categories";
import Products from "../../components/Products/Products";
import "./HomePage.css";
import { Helmet } from "react-helmet-async";
function HomePage() {
  const url = useRef("/products/");
  return (
    <div className="home-container">
      <Helmet>
        <title>AD Clothing</title>
      </Helmet>
      <Slider />
      <Categories />

      <div className="new-arr">
        <h2>New arrivals</h2>
        <p>The best Online sales to shop these weekend</p>
      </div>

      <Products limit={10} url={url.current} />
      <Row className="d-flex justify-content-between row-info">
        <Col md={3} className="d-flex justify-content-center col-info">
          <i class="fa-solid fa-truck-fast"></i>
          <div>
            <h3>Express Shipping</h3>
            <p>Delivery within 24 hours</p>
          </div>
        </Col>
        <Col md={3} className="d-flex justify-content-center col-info">
          <i class="fa-solid fa-wallet"></i>
          <div>
            <h3>30 Days Return</h3>
            <p>Money back Guarantee</p>
          </div>
        </Col>
        <Col md={3} className="d-flex justify-content-center col-info">
          <i class="fa-solid fa-shield-halved"></i>
          <div>
            <h3>Secure Checkout</h3>
            <p>100% Protected by paypal</p>
          </div>
        </Col>
        <Col md={3} className="d-flex justify-content-center col-info">
          <i class="fa-solid fa-clock"></i>
          <div>
            <h3>24/7 Support</h3>
            <p>All time customer support</p>
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default HomePage;
