import { sliderItems } from "../../data";
import { useState } from "react";
import "./Slider.css";
import { Link } from "react-router-dom";

function Slider() {
  const [sliderNumber, setSliderNumber] = useState(0);
  const handleChangeSlider = (direction) => {
    if (direction === "left") {
      if (sliderNumber > 0) {
        setSliderNumber(sliderNumber - 1);
      } else {
        setSliderNumber(sliderItems.length - 1);
      }
    } else {
      if (sliderNumber === sliderItems.length - 1) {
        setSliderNumber(0);
      } else {
        setSliderNumber(sliderNumber + 1);
      }
    }
  };

  return (
    <div className={"slider-container"}>
      <div className={"arrow-left"} onClick={() => handleChangeSlider("left")}>
        <i class="fa-solid fa-arrow-left"></i>
      </div>
      <div
        className={"wrapper"}
        style={{ transform: `translateX(${sliderNumber * -100}vw)` }}
      >
        {sliderItems.map((sliderItem) => (
          <div
            className={"slide"}
            key={sliderItem.id}
            style={{ backgroundColor: `#${sliderItem.bg}` }}
          >
            <div className={"image-container"}>
              <img className={"image"} src={sliderItem.img} alt="clothing" />
            </div>
            <div className={"info-container"}>
              <h1 className={"title"}>{sliderItem.title}</h1>
              <p className={"desc"}>{sliderItem.desc}</p>
              <Link to="/shop">
                <button className={"button"}>BUY NOW</button>
              </Link>
            </div>
          </div>
        ))}
      </div>
      <div
        className={"arrow-right"}
        onClick={() => handleChangeSlider("right")}
      >
        <i class="fa-solid fa-arrow-right"></i>
      </div>
    </div>
  );
}

export default Slider;
