import { Link } from "react-router-dom";
import "./Products.css";

function Product({ product }) {
  return (
    <div style={{ textAlign: "center" }}>
      <div className="product">
        <div className="circle" />
        <img className="img" src={product.imgPath[0]} alt="product" />
        <div className="info">
          <div className="icon">
            <Link to={`/product/${product._id}`} className="no-decor">
              <i class="fa-solid fa-bag-shopping"></i>
            </Link>
          </div>
        </div>
      </div>
      <div className="detail">
        <h5>{product.name}</h5>
        <p>${product.price}</p>
      </div>
    </div>
  );
}

export default Product;
