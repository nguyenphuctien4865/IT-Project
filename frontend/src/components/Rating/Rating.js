import "./Rating.css";
function Rating({ rating, numReviews, caption }) {
  return (
    <div className="rating">
      <div>
        <span>
          {rating >= 1 ? (
            <i class="fa-solid fa-star"></i>
          ) : rating >= 0.5 ? (
            <i class="fa-solid fa-star-half-stroke"></i>
          ) : (
            <i class="fa-regular fa-star"></i>
          )}
        </span>
        <span>
          {rating >= 2 ? (
            <i class="fa-solid fa-star"></i>
          ) : rating >= 1.5 ? (
            <i class="fa-solid fa-star-half-stroke"></i>
          ) : (
            <i class="fa-regular fa-star"></i>
          )}
        </span>
        <span>
          {rating >= 3 ? (
            <i class="fa-solid fa-star"></i>
          ) : rating >= 2.5 ? (
            <i class="fa-solid fa-star-half-stroke"></i>
          ) : (
            <i class="fa-regular fa-star"></i>
          )}
        </span>
        <span>
          {rating >= 4 ? (
            <i class="fa-solid fa-star"></i>
          ) : rating >= 3.5 ? (
            <i class="fa-solid fa-star-half-stroke"></i>
          ) : (
            <i class="fa-regular fa-star"></i>
          )}
        </span>
        <span>
          {rating >= 5 ? (
            <i class="fa-solid fa-star"></i>
          ) : rating >= 4.5 ? (
            <i class="fa-solid fa-star-half-stroke"></i>
          ) : (
            <i class="fa-regular fa-star"></i>
          )}
        </span>
      </div>
      {caption ? (
        <span>{caption}</span>
      ) : (
        <span>{numReviews + " reviews"}</span>
      )}
    </div>
  );
}

export default Rating;
