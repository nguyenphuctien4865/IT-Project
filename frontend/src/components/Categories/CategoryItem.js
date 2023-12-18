import { Link } from "react-router-dom";
import "./Categories.css";

function CategoryItem({ item }) {
  return (
    <div className={"item"}>
      <img className={"img"} src={item.img} alt="category" />
      <div className={"info"}>
        <p className={"title"}>{item.title}</p>
        <Link to="/shop">
          <button className={"buy-btn"}>Buy Now</button>
        </Link>
      </div>
    </div>
  );
}
export default CategoryItem;
