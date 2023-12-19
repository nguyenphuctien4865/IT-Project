import axios from "../../hooks/axios.js";
import "./Products.css";

import { popularProducts } from "../../data";
import Product from "./Product";
import { useEffect, useState } from "react";

function Products({ products }) {



    return (
        <div
            className="product-container"
            //! Trường hợp getProduct By id
            style={{ justifyContent: !Array.isArray(products) && "center" }}
        >
            {products && Array.isArray(products) ? (
                //! Trường hợp getAllProducts
                products
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
