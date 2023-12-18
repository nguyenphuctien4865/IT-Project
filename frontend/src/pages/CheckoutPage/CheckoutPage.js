import { useContext, useEffect, useMemo, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Row, Form, Col, Card, ListGroup, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import { Store } from "./../../Store";
import axios from "./../../hooks/axios";
import { default as axiosOriginal } from "axios";
import "./CheckoutPage.css";
import { AuthContext } from "../../context/AuthContext";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { Helmet } from "react-helmet-async";

function CheckoutPage() {
  const provinceCode = useRef();
  const distinctCode = useRef();
  const wardCode = useRef();
  const navigate = useNavigate();
  const { state, contextDispatch } = useContext(Store);
  const {
    cart: { cartItems, deliveryAddress },
  } = state;
  const { user } = useContext(AuthContext);
  const getAddress = () => {
    const arr = user.address.split("%");
    return {
      address: arr[0],
      ward: arr[1],
      distinct: arr[2],
      province: arr[3],
    };
  };
  const addressInfo = useRef();
  addressInfo.current = getAddress();

  //initData();
  const [fullName, setFullName] = useState(user.name || "");
  const [phoneNumber, setPhoneNumber] = useState(
    user.phoneNumber || deliveryAddress.phoneNumber || ""
  );
  const [email, setEmail] = useState(user.email || "");
  const provinceArray = useRef([]);
  const distinctArray = useRef([]);
  const wardArray = useRef([]);
  const [provinceText, setProvinceText] = useState();
  const [distinctText, setDistinctText] = useState(
    addressInfo.current.distinct
  );
  const [wardText, setWardText] = useState(addressInfo.current.ward);
  const [address, setAddress] = useState(addressInfo.current.address);
  const [note, setNote] = useState("");
  const shippingCost = 2;
  const [paid, setPaid] = useState(false);
  const totalCost = useMemo(
    () =>
      cartItems.reduce(
        (accumulate, currentValue) =>
          accumulate + currentValue.price * currentValue.quantity,
        0
      ) + shippingCost,
    [cartItems]
  );

  // chạy đầu tiên sau render
  useEffect(() => {
    const fetchData = async () => {
      try {
        // chạy câu dưới nhưng không thục thi và chạy những sync khác
        const proData = await axiosOriginal.get(
          `https://provinces.open-api.vn/api/p/search/?q=${addressInfo.current.province}`
        );
        // sau khi thực thi tất cả các sync, sẽ thực thi câu lệnh trên, sau đó chạy và thực thi các hàm dưới
        provinceCode.current = proData.data[0].code;

        const distData = await axiosOriginal.get(
          `https://provinces.open-api.vn/api/d/search/?q=${addressInfo.current.distinct}&p=${provinceCode.current}`
        );
        distinctCode.current = distData.data[0].code;

        const wardData = await axiosOriginal.get(
          `https://provinces.open-api.vn/api/w/search/?q=${addressInfo.current.ward}&d=${distinctCode.current}&p=${provinceCode.current}`
        );
        wardCode.current = wardData.data[0].code;

        const proList = await axiosOriginal.get(
          "https://provinces.open-api.vn/api/?depth=1"
        );
        provinceArray.current = proList.data;

        const distList = await axiosOriginal.get(
          `https://provinces.open-api.vn/api/p/${provinceCode.current}/?depth=2`
        );
        distinctArray.current = distList.data.districts;

        const wardList = await axiosOriginal.get(
          `https://provinces.open-api.vn/api/d/${distinctCode.current}/?depth=2`
        );
        wardArray.current = wardList.data.wards;

        // gặp setState (nhưng chưa re-render, phải đợi các await (nếu có), async r mới re-render)
        setProvinceText(addressInfo.current.province);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // chạy câu lệnh dưới nhưng không thực thi và
        const { data } = await axiosOriginal.get(
          `https://provinces.open-api.vn/api/p/${provinceCode.current}/?depth=2`
        );
        distinctArray.current = data.districts;

        // Nếu lần đầu truy cập thì next, không thì vào
        if (distinctCode.current === 0) {
          wardCode.current = 0;
          distinctCode.current = data.districts[0].code;
          setDistinctText(data.districts[0].name);
        }
      } catch (err) {
        console.log(err);
      }
    };

    // provinceCode.current lần đầu = undefined nên không chạy fetchData()
    if (provinceCode.current) {
      fetchData();
    }
  }, [provinceText]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axiosOriginal.get(
          `https://provinces.open-api.vn/api/d/${distinctCode.current}/?depth=2`
        );
        wardArray.current = data.wards;
        if (wardCode.current === 0) {
          wardCode.current = data.wards[0].code;
          setWardText(data.wards[0].name);
        }
      } catch (err) {
        console.log(err);
      }
    };
    if (distinctCode.current) {
      fetchData();
    }
  }, [distinctText]);

  const handleCheckout = async (paymentMethod) => {
    if (!fullName || !phoneNumber || !email || !address) return;
    if (
      address.includes("~") ||
      address.includes("!") ||
      address.includes("@") ||
      address.includes("#") ||
      address.includes("$") ||
      address.includes("%") ||
      address.includes("^") ||
      address.includes("&") ||
      address.includes("*")
    ) {
      toast.error("Address cannot contain special characters like ~!@#$%^&* ");
      return;
    }
    try {
      const data = {
        productItems: cartItems,
        deliveryAddress: {
          fullName,
          phoneNumber,
          email,
          province: provinceText,
          distinct: distinctText,
          ward: wardText,
          address,
          note,
        },
        user: user._id,
        shippingCost,
        totalCost,
        paymentMethod,
        isPaid: paymentMethod === "COD" ? false : true,
      };
      await axios.post("/checkouts", data);

      contextDispatch({
        type: "SAVE_DELIVERY_ADDRESS",
        payload: JSON.stringify({
          fullName,
          phoneNumber,
          email,
          province: provinceText,
          distinct: distinctText,
          ward: wardText,
          address,
          note,
        }),
      });
      contextDispatch({ type: "CART_CLEAR" });
      contextDispatch({ type: "REMOVE_INDEX" });

      toast.success("Checkout Success");
      window.setTimeout(() => {
        navigate("/");
      }, 3000);
    } catch (err) {
      console.log(err);
      toast.error(err.message);
    }
  };
  useEffect(() => {
    if (paid) {
      handleCheckout("Paypal");
    }
  }, [paid]);
  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="checkout-container">
      <Helmet>
        <title>Checkout</title>
      </Helmet>
      <div className="shop-header">
        <div className="image-container">
          <img
            className="image"
            src="assets/images/person-writing-laptop-with-credit-card.jpg"
            alt="clothing"
          />
        </div>
        <div className="info-container">
          <h1 className="title">Checkout</h1>
          <p className="desc">
            ADClothing is clothing designed to make everyone's life better. It
            is simple, high-quality, everyday clothing with a practical sense of
            beauty-ingenious in detail, thought through with life's needs in
            mind, and always evolving.
          </p>
        </div>
      </div>
      <h1>Checkout</h1>
      <Form onSubmit={handleSubmit}>
        <Row className="checkout-container">
          <Col md={8} className="checkout-details">
            <h2>Billing Address</h2>
            <Form.Group className="mb-3" controlId="fullName">
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                value={fullName}
                onChange={(e) => {
                  setFullName(e.target.value);
                }}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="phoneNumber">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="province">
              <Form.Label>Province</Form.Label>
              <Form.Select
                value={provinceCode.current}
                onChange={(e) => {
                  const index = e.nativeEvent.target.selectedIndex;
                  provinceCode.current = e.target.value;
                  distinctCode.current = 0;
                  setProvinceText(e.nativeEvent.target[index].text);
                  //setProvince(e.target.value);
                }}
                required
              >
                <option value="" key="default" disabled>
                  Choose one Province
                </option>
                {provinceArray.current.map((element) => {
                  if (element.code === Number(provinceCode.current)) {
                    // provinceCode.current = element.code;
                    return (
                      <option value={element.code} key={element.code} selected>
                        {element.name}
                      </option>
                    );
                  } else {
                    return (
                      <option value={element.code} key={element.code}>
                        {element.name}
                      </option>
                    );
                  }
                })}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3" controlId="distinct">
              <Form.Label>Distinct</Form.Label>
              <Form.Select
                value={distinctCode.current}
                onChange={(e) => {
                  const index = e.nativeEvent.target.selectedIndex;
                  distinctCode.current = e.target.value;
                  wardCode.current = 0;
                  setDistinctText(e.nativeEvent.target[index].text);
                }}
                required
              >
                <option value="" key="default" disabled>
                  Choose one Distinct
                </option>
                {distinctArray.current.map((element) => {
                  if (element.code === Number(distinctCode.current)) {
                    //distinctCode.current = element.code;
                    return (
                      <option value={element.code} key={element.code} selected>
                        {element.name}
                      </option>
                    );
                  } else {
                    return (
                      <option value={element.code} key={element.code}>
                        {element.name}
                      </option>
                    );
                  }
                })}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3" controlId="ward">
              <Form.Label>Ward</Form.Label>
              <Form.Select
                value={wardCode.current}
                onChange={(e) => {
                  const index = e.nativeEvent.target.selectedIndex;
                  wardCode.current = e.target.value;
                  setWardText(e.nativeEvent.target[index].text);
                  // setWard(e.target.value);
                }}
                required
              >
                <option value="" key="default" disabled>
                  Choose one Ward
                </option>
                {wardArray.current.map((element) => {
                  if (element.name === Number(wardCode.current)) {
                    //wardCode.current = element.code;
                    return (
                      <option value={element.code} key={element.code} selected>
                        {element.name}
                      </option>
                    );
                  } else {
                    return (
                      <option value={element.code} key={element.code}>
                        {element.name}
                      </option>
                    );
                  }
                })}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3" controlId="address">
              <Form.Label>Address</Form.Label>
              <Form.Control
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="note">
              <Form.Label>Note</Form.Label>
              <br />
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Note for the your order, ex: time or guide for shipper"
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
                    {cartItems.map((item, index) => (
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
                      <Col>${shippingCost}</Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Row>
                      <Col>
                        <strong>Order Total</strong>
                      </Col>
                      <Col>
                        <strong>${totalCost}</strong>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <div className="d-grid">
                      <Button
                        type="submit"
                        variant="dark"
                        onClick={() => handleCheckout("COD")}
                      >
                        Check out by COD
                      </Button>
                    </div>
                    <div className="d-grid mt-3">
                      {/* <Button type="button" variant="light">
                        Check out by Paypal
                      </Button> */}
                      <PayPalScriptProvider
                        options={{
                          "client-id":
                            "AZJXkD3NTX9_mMJ1o9JObSSM9GCYQmbY3kBXEE4-t36AC-YrNqyM_6Oy5VKrTK7Ilf-8uUaxy00z7kQb",
                        }}
                      >
                        <PayPalButtons
                          fundingSource="paypal"
                          createOrder={(data, actions) => {
                            return actions.order.create({
                              purchase_units: [
                                {
                                  amount: {
                                    value: `${totalCost}`,
                                  },
                                },
                              ],
                            });
                          }}
                          onApprove={async (data, actions) => {
                            return actions.order.capture().then((details) => {
                              setPaid(true);
                              const name = details.payer.name.given_name;
                              alert(`Transaction completed by ${name}`);
                            });
                          }}
                        />
                      </PayPalScriptProvider>
                    </div>
                  </ListGroup.Item>
                </ListGroup>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Form>
    </div>
  );
}

export default CheckoutPage;
