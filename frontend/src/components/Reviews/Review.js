import { useEffect, useState } from "react";
import axios from "./../../hooks/axios";
import Rating from "../Rating/Rating";
import formatter from "../../hooks/formatter";

function Reviews({ id, limit, isReload }) {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await axios.get(`/reviews/${id}`);
      setReviews(data);
    };
    fetchData();
  }, [id, isReload, setReviews]);

  return (
    <div className="product-review-container">
      {reviews &&
        reviews.slice(0, limit).map((review) => (
          <div className="product-review-content" key={review._id}>
            <img src={review.imgPath} alt="avatar" />
            <div className="product-review-text">
              <Rating rating={review.rating} caption={" "} />
              <div className="d-flex justify-content-between">
                <span className="product-review-name">{review.name}</span>
                <span className="product-review-date">
                  {formatter.format(new Date(review.createdAt))}
                </span>
              </div>
              <p className="product-review-detail">{review.review}</p>
            </div>
          </div>
        ))}
    </div>
  );
}

export default Reviews;
