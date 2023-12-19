import { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Row, Form, Col, Card, ListGroup, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import { Store } from "./../../Store";
import axios from "./../../hooks/axios";
import { default as axiosOriginal } from "axios";
import "./CheckoutPage.css";
import { AuthContext } from "../../context/AuthContext";
import { Helmet } from "react-helmet-async";
function CheckoutDetailsPage() {
  const { id } = useParams();
  const [checkout, setCheckout] = useState();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`/checkouts/${id}`);
        setCheckout(data);
      } catch (err) {
        console.log(err.message);
      }
    };
    fetchData();
  }, [id]);
  return (
    <div className="checkout-container">
      <Helmet>
        <title>Checkout Details</title>
      </Helmet>
      <div className="shop-header">
        <div className="image-container">
          <img
            className="image"
            src="/assets/images/person-writing-laptop-with-credit-card.jpg"
            alt="clothing"
          />
        </div>
        <div className="info-container">
          <h1 className="title">Checkout Details</h1>
          <p className="desc">
            ADClothing is clothing designed to make everyone's life better. It
            is simple, high-quality, everyday clothing with a practical sense of
            beauty-ingenious in detail, thought through with life's needs in
            mind, and always evolving.
          </p>
        </div>
      </div>
      <h1>Checkout Details</h1>

      {checkout && (
        <Form>
          <Row className="checkout-container">
            <Col md={8} className="checkout-details">
              <h2>Billing Address</h2>
              <Form.Group className="mb-3" controlId="fullName">
                <Form.Label>Full Name</Form.Label>
                <Form.Control
                  value={checkout.deliveryAddress.fullName}
                  disabled
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="phoneNumber">
                <Form.Label>Phone Number</Form.Label>
                <Form.Control
                  value={checkout.deliveryAddress.phoneNumber}
                  disabled
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="email">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  value={checkout.deliveryAddress.email}
                  disabled
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="province">
                <Form.Label>Province</Form.Label>
                <Form.Control
                  value={checkout.deliveryAddress.province}
                  disabled
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="distinct">
                <Form.Label>Distinct</Form.Label>
                <Form.Control
                  value={checkout.deliveryAddress.distinct}
                  disabled
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="ward">
                <Form.Label>Ward</Form.Label>
                <Form.Control
                  value={checkout.deliveryAddress.ward}
                  disabled
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="address">
                <Form.Label>Address</Form.Label>
                <Form.Control
                  value={checkout.deliveryAddress.address}
                  disabled
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="note">
                <Form.Label>Note</Form.Label>
                <br />
                <textarea
                  value={checkout.deliveryAddress.note}
                  disabled
                  className="checkout-note"
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Card className="checkout-summary">
                <Card.Body>
                  <Card.Title>Order Summary</Card.Title>
                  <ListGroup variant="flush">
                    <ListGroup.Item>
                      {checkout.productItems.map((item, index) => (
                        <Row key={index}>
                          <Col>{`${item.name} - ${
                            item.sizeProduct
                          } - ${item.colorProduct.toUpperCase()}`}</Col>
                          <Col>{`${item.quantity} x $${item.price}`}</Col>
                        </Row>
                      ))}
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <Row>
                        <Col>Shipping (Fixed)</Col>
                        <Col>${checkout.shippingCost}</Col>
                      </Row>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <Row>
                        <Col>
                          <strong>Order Total</strong>
                        </Col>
                        <Col>
                          <strong>${checkout.totalCost}</strong>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      {checkout.paymentMethod === "COD" && (
                        <div className="d-grid">
                          <Button type="submit" variant="dark" disabled>
                            Check out by COD
                          </Button>
                        </div>
                      )}
                      {checkout.paymentMethod === "Paypal" && (
                        <div className="d-grid mt-3">
                          <Button type="button" variant="light" disabled>
                            Check out by Paypal
                          </Button>
                        </div>
                      )}
                    </ListGroup.Item>
                  </ListGroup>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Form>
      )}
    </div>
  );
}

export default CheckoutDetailsPage;
