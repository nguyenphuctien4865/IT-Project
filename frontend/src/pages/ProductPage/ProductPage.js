import { useContext, useEffect, useRef, useState } from "react";
import { Button, Col, OverlayTrigger, Row, Tooltip } from "react-bootstrap";
import { Helmet } from "react-helmet-async";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Products from "../../components/Products/Products";
import Reviews from "../../components/Reviews/Review";
import Star from "../../components/Star/Star";
import { AuthContext } from "../../context/AuthContext";
import Rating from "./../../components/Rating/Rating";
import axios from "./../../hooks/axios";
import { Store } from "./../../Store";
import "./ProductPage.css";
function ProductPage() {
  const { state, contextDispatch } = useContext(Store);
  const {
    cart: { indexItem, cartItems },
  } = state;
  const { user } = useContext(AuthContext);
  const { id } = useParams();
  const [product, setProduct] = useState();
  const [amount, setAmount] = useState(1);
  const [colorProduct, setColorProduct] = useState("");
  const [sizeProduct, setSizeProduct] = useState("");
  const url = useRef("/products/");
  const [indexImg, setIndexImg] = useState(0);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await axios.get(`/products/${id}`);
      setProduct(data);
      setSizeProduct(data.size[0]);
      setColorProduct(data.color[0]);
    };
    fetchData();
  }, [id]);

  const handleChooseImg = (i) => {
    setIndexImg(i);
  };

  const handleAddReview = async () => {
    try {
      const { data } = await axios.post("/reviews", {
        user: user._id,
        product: product._id,
        review,
        rating,
      });
      setReview("");
      setRating(0);
      if (data.message) toast.error(data.message);
      else {
        toast.success("Review has been created");
      }
    } catch (err) {
      console.log(err);
      toast.error(err.message);
    }
  };
  const handleAddtoCart = async () => {
    let existItem = cartItems.find(
      (item) =>
        item._id === product._id &&
        item.sizeProduct === sizeProduct &&
        item.colorProduct === colorProduct
    );
    const quantity = existItem ? existItem.quantity + amount : amount;
    contextDispatch({
      type: "CART_ADD_ITEM",
      payload: {
        _id: product._id,
        name: product.name,
        price: product.price,
        quantity,
        sizeProduct,
        colorProduct,
        indexItem,
      },
    });
    contextDispatch({
      type: "ADD_INDEX",
    });
    toast.success("Product has been added");
  };
  const handleChoiceColor = async (color) => {
    const indexImg = product.color.indexOf(color);
    setColorProduct(color);
    setIndexImg(indexImg);
  };
  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      {!user && "You must Sign in to add review"}
    </Tooltip>
  );
  return (
    product && (
      <div className="product-container">
        <Helmet>
          <title>{product.name}</title>
        </Helmet>
        <Row className="product-content">
          <Col md={5} className="product-img-container">
            <div className="product-main-img-container">
              <div
                className={"arrow-left"}
                onClick={() =>
                  handleChooseImg(indexImg === 0 ? 0 : indexImg - 1)
                }
              >
                <i class="fa-solid fa-angle-left"></i>
              </div>
              <img
                src={product.imgPath[indexImg]}
                alt="product"
                className="product-main-img"
              />
              <div
                className={"arrow-right"}
                onClick={() =>
                  handleChooseImg(indexImg === 2 ? 2 : indexImg + 1)
                }
              >
                <i class="fa-solid fa-angle-right"></i>
              </div>
            </div>
            <div className="product-sub-container">
              {product.imgPath.map((img, index) => {
                return (
                  <img
                    key={index}
                    src={img}
                    alt="product"
                    className="product-sub-img"
                    onClick={() => handleChooseImg(index)}
                  />
                );
              })}
            </div>
          </Col>
          <Col md={7} className="info-container">
            <p className="name">{product.name}</p>
            <p className="description">{product.description}</p>
            <p className="price">${product.price}</p>
            <Rating
              rating={Math.round(product.ratingAverage)}
              numReviews={product.ratingQuantity}
            />
            <div className="filter-container">
              <div className="color-filter">
                <span>Color</span>
                <div className="color-list">
                  {/* TODO: add key id */}
                  {product.color.map((color, index) => {
                    return (
                      <button
                        //{backgroundColor: {color === "blue" ? "#2196f3" : color === "red" ? "#c64747" : color === "black" ? "#282626" : color === "white" ?"#fff" : color==="yellow" ? "#e2df08" : color }
                        style={{ backgroundColor: color }}
                        onClick={() => handleChoiceColor(color)}
                        className={`color-btn ${
                          colorProduct === color ? "active" : null
                        }`}
                        key={color}
                      >
                        {/* {color}
                        {index} */}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="size-filter">
                <span>Size</span>
                <select
                  name="size"
                  value={sizeProduct}
                  onChange={(e) => setSizeProduct(e.target.value)}
                  className="size-select"
                >
                  <option value="" disabled>
                    Choose Size
                  </option>
                  {product.size.map((s) => (
                    <option value={s} key={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="count-container">
              <div className="count-filter">
                <div className="count-icon">
                  <i
                    class="fa-solid fa-minus"
                    onClick={() =>
                      amount === 1 ? setAmount(1) : setAmount(amount - 1)
                    }
                  ></i>
                </div>
                <span className="counter">{amount}</span>
                <div
                  className="count-icon"
                  onClick={() => setAmount(amount + 1)}
                >
                  <i class="fa-solid fa-plus"></i>
                </div>
              </div>
              <button className="addBtn" onClick={handleAddtoCart}>
                ADD TO CART
              </button>
            </div>
            <div>
              <p className="product-category">
                Category: <strong>{product.category?.name}</strong>
              </p>
            </div>
          </Col>
        </Row>
        <Row className="mt-5 review-container">
          <Col md={8}>
            <h4>Feature Reviews</h4>
            <Reviews
              limit={2}
              id={product._id}
              isReload={rating === 0 ? true : false}
            />
            <Link to={`/reviews/${product._id}`}>
              <Button variant="dark" className="mt-3">
                See All Reviews <i class="fa-solid fa-right-long"></i>
              </Button>
            </Link>
          </Col>
          <Col md={4}>
            <h4>Add a Review</h4>
            <Star setRating={setRating} />
            <textarea
              placeholder="Text your review here"
              className="product-review-textarea"
              value={review}
              required
              onChange={(e) => setReview(e.target.value)}
            />
            <OverlayTrigger
              placement="right"
              delay={{ show: 250, hide: 400 }}
              overlay={renderTooltip}
            >
              <span>
                <Button
                  variant="dark"
                  onClick={handleAddReview}
                  disabled={user ? false : true}
                >
                  Add
                </Button>
              </span>
            </OverlayTrigger>
          </Col>
        </Row>
        <div className="new-arr">
          <h2>You May Like This</h2>
          <p>The best Online sales to shop these weekend</p>
        </div>
        <Products limit={4} url={url.current} />
      </div>
    )
  );
}

export default ProductPage;
