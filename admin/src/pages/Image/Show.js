import React from "react";
import axios from "../../hooks/axios.js";
import { useState, useEffect } from "react";
const Show = () => {
  const [imgs, setImgs] = useState([]);
  useEffect(() => {
    async function fetchData() {
      try {
        // select a img
        const res = await axios.get("/products/6379d16c389ff389cc4234db");
        const imgs = res.data.imgPath;
        console.log("🚀 ~ file: show.js ~ line 25 ~ fetchData ~ url", imgs);

        setImgs(imgs);
      } catch (err) {
        console.log(err);
      }
    }
    fetchData();
  }, []);
  return (
    <div style={{ padding: 20 }}>
      {imgs.map((img) => (
        <img src={img}></img>
      ))}
    </div>
  );
};
export default Show;
