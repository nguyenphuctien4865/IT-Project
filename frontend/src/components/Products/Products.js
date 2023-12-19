import axios from "../../hooks/axios.js";
import "./Products.css";

import { popularProducts } from "../../data";
import Product from "./Product";
import { useEffect, useState } from "react";

function Products({ cat, filters, sort, limit, url }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const getProducts = async () => {
      try {
        const res = await axios.get(url);
        setProducts(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getProducts();
  }, [url]);

  return (
    <div
      className="product-container"
      //! Trường hợp getProduct By id
      style={{ justifyContent: !Array.isArray(products) && "center" }}
    >
      {products && Array.isArray(products) ? (
        //! Trường hợp getAllProducts
        products
          .slice(0, limit)
          .map((product) => (
            <Product product={product} key={product._id}></Product>
          ))
      ) : (
        //! Trường hợp getProduct By id
        <Product product={products} key={products._id}></Product>
      )}
    </div>
  );
}

export default Products;
