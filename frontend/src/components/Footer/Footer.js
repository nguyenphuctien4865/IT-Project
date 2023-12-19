import "./Footer.css";
function Footer() {
  return (
    <div className={"footer-container"}>
      <div className={"left"}>
        <h3 className={"brand"}>ADClothing</h3>
        <p className={"description"}>
          Shop the ADClothing Official Website. Browse the latest collections,
          explore the campaigns and discover our online assortment of clothing
          and accessories.
        </p>
        <div className={"social-container"}>
          <div className={"social-logo"}>
            <i class="fa-brands fa-facebook"></i>
          </div>
          <div className={"social-logo"}>
            <i class="fa-brands fa-instagram"></i>
          </div>
        </div>
      </div>
      <div className={"center"}>
        <h3 className={"title"}>Opening Hours</h3>
        <ul className={"link-list"}>
          <li className={"link-item"}>
            Monday-Friday: <span>8.00h-20.00h</span>
          </li>
          <li className={"link-item"}>
            Saturday: <span>10.00h-20.00h</span>
          </li>
          <li className={"link-item"}>
            Sunday: <span>12.00h-20.00h</span>
          </li>
        </ul>
      </div>
      <div className={"right"}>
        <h3 className={"title"}>Contact</h3>
        <ul className={"contact-list"}>
          <li className={"contact-item"}>
            <i class="fa-solid fa-location-dot"></i>
            <span>
              Số 1 Đ. Võ Văn Ngân, Linh Chiểu, Thành Phố Thủ Đức, Thành phố Hồ
              Chí Minh
            </span>
          </li>
          <li className={"contact-item"}>
            <i class="fa-solid fa-phone"></i>
            <span> 0709991111 </span>
          </li>
          <li className={"contact-item"}>
            <i class="fa-solid fa-envelope"></i>
            <span>
              20110573@student.hcmute.edu.vn || 21110834@student.hcmute.edu.vn || 21110855@student.hcmute.edu.vn ||
            </span>
          </li>
        </ul>
        <img src="https://i.ibb.co/Qfvn4z6/payment.png" alt="payment" />
      </div>
    </div>
  );
}

export default Footer;
