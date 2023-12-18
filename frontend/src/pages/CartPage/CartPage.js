import { useContext, useEffect, useState } from "react";
import { Button, Card, Col, ListGroup, Row } from "react-bootstrap";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AuthContext } from "../../context/AuthContext";
import { Store } from "../../Store";
import axios from "./../../hooks/axios";
import "./CartPage.css";

function CartPage() {
  const { user } = useContext(AuthContext);
  const { state, contextDispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;
  const [products, setProducts] = useState([]);

  const navigate = useNavigate();
  useEffect(() => {
    cartItems.forEach(async (element) => {
      const { data } = await axios.get(`/products/${element._id}`);

      setProducts((preProducts) => [
        ...preProducts,
        {
          ...data,
          quantity: element.quantity,
          sizeProduct: element.sizeProduct,
          colorProduct: element.colorProduct,
          indexItem: element.indexItem,
        },
      ]);
    });
  }, [cartItems]);

  const handleDeleteProduct = (product) => {
    try {
      setProducts([]);
      console.log(product);
      contextDispatch({ type: "CART_REMOVE_ITEM", payload: product });
      toast.success("Delete product successfully");
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleProceedToCheckout = () => {
    if (!user) {
      navigate("/signin?redirect=/checkout");
    } else {
      navigate("/checkout");
    }
  };

  return (
    <div className="cart-container">
      <Helmet>
        <title>Cart</title>
      </Helmet>
      <div className="shop-header">
        <div className="image-container">
          <img
            className="image"
            src="assets/images/cart-home.jpg"
            alt="clothing"
          />
        </div>
        <div className="info-container">
          <h1 className="title">Cart</h1>
          <p className="desc">
            ADClothing is clothing designed to make everyone's life better. It
            is simple, high-quality, everyday clothing with a practical sense of
            beauty-ingenious in detail, thought through with life's needs in
            mind, and always evolving.
          </p>
        </div>
      </div>
      <h1 className="cart-title">Cart</h1>
      <Row className="cart-content">
        <Col md={8} style={{ textAlign: cartItems.length === 0 && "center" }}>
          {cartItems.length === 0 ? (
            <img src="/assets/images/cart-empty.jpg" alt="Empty Cart" />
          ) : (
            <ListGroup>
              <ListGroup.Item>
                <Row className="align-items-center">
                  <Col md={4}>
                    <strong>Product</strong>
                  </Col>
                  <Col md={2}>
                    <strong>Quantity</strong>
                  </Col>
                  <Col md={2}>
                    <strong>Price</strong>
                  </Col>
                  <Col md={2}>
                    <strong>Size</strong>
                  </Col>
                  <Col md={1}>
                    <strong>Color</strong>
                  </Col>
                  <Col md={1}>
                    <strong>Delete</strong>
                  </Col>
                </Row>
              </ListGroup.Item>
              {products.map((product, index) => (
                <ListGroup.Item key={index}>
                  <Row className="align-items-center">
                    <Col md={4}>
                      <img
                        src={product.imgPath[0]}
                        alt="product"
                        className="img-fluid rounded img-thumbnail product-img"
                      />
                      <Link
                        to={`/product/${product._id}`}
                        className="product-name"
                      >
                        {product.name.substring(0, 20) + "..."}
                      </Link>
                    </Col>
                    <Col md={2}>
                      <span style={{ marginLeft: "28px" }}>
                        {product.quantity}
                      </span>
                    </Col>
                    <Col md={2}>${product.price}</Col>
                    <Col md={2}>
                      <span style={{ marginLeft: "8px" }}>
                        {product.sizeProduct}
                      </span>
                    </Col>
                    <Col md={1}>
                      <button
                        style={{ backgroundColor: product.colorProduct }}
                        className="product-color"
                      />
                    </Col>
                    <Col md={1}>
                      <Button
                        variant="light"
                        onClick={() => handleDeleteProduct(product)}
                      >
                        <i className="fas fa-trash"></i>
                      </Button>
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Col>
        <Col md={4}>
          <Card>
            <Card.Body>
              <ListGroup>
                <ListGroup.Item>
                  <h2>
                    Subtotal (
                    {cartItems.reduce(
                      (accumulate, currentValue) =>
                        accumulate + currentValue.quantity,
                      0
                    )}{" "}
                    items):$
                    {cartItems.reduce(
                      (accumulate, currentValue) =>
                        accumulate + currentValue.price * currentValue.quantity,
                      0
                    )}
                  </h2>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Button
                    type="button"
                    variant="dark"
                    disabled={cartItems.length === 0}
                    onClick={handleProceedToCheckout}
                  >
                    {/* <Link to="/checkout" className="no-decor"> */}
                    Proceed to Checkout
                    {/* </Link> */}
                  </Button>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default CartPage;
