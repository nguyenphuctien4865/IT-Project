import { useContext, useEffect, useRef, useState } from "react";
import { Button, Col, Form, ListGroup, Pagination, Row } from "react-bootstrap";
import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import Productss from "../../components/Products/Productss.js";
import { PaginationContext } from "../../context/PaginationContext.js";
import axios from "../../hooks/axios.js";
import "./ShopPage.css";

function ShopPage() {
  const location = useLocation();
  const productData = useRef([]);
  const idCategory = useRef("");
  const indexPage = useRef(1);
  const pageCount = 6;
  const [urlProduct, setUrlProduct] = useState("/products/");
  const [filter, setFilter] = useState("");
  const [categories, setCategories] = useState(null);

  const { products, totalPages, dispatch } = useContext(PaginationContext);

  const handleChoiceFilter = async (e) => {
    setFilter(e.target.value);
  };

  const handleChangePage = async (e) => {
    if (!Number(e.target.innerHTML)) return;
    indexPage.current = Number(e.target.innerHTML);
    dispatch({
      type: "START",
      payload: {
        items: productData.current,
        currentPage: indexPage.current,
        pageCount: pageCount,
      },
    });
  };

  const handleClickCategory = async (id) => {
    idCategory.current = id;
    let link = `/products/category/${id}`;
    if (filter !== "") link = `/products/category/sort/${id}/${filter}`;
    setUrlProduct(link);
  };

  let index = [];
  for (let number = 1; number <= totalPages; number++) {
    index.push(
      <Pagination.Item
        key={number}
        active={number === indexPage.current}
        onClick={handleChangePage}
      >
        {number}
      </Pagination.Item>
    );
  }
  useEffect(() => {
    const getCategoryList = async () => {
      const { data } = await axios.get("/categories");
      setCategories(data);
    };
    getCategoryList();
  }, []);

  useEffect(() => {
    const init = async () => {
      indexPage.current = 1;
      const { data } = await axios.get(urlProduct);
      productData.current = data;
      const result = {
        items: data,
        currentPage: indexPage.current,
        pageCount: pageCount,
      };
      dispatch({ type: "START", payload: result });
    };
    init();
  }, [urlProduct]);

  useEffect(() => {
    idCategory.current = "";
    if (location.state !== null) {
      if (filter !== "") setUrlProduct(location.state.url + "/sort/" + filter);
      else setUrlProduct(location.state.url);
    } else if (location.state === null) {
      if (filter !== "") {
        setUrlProduct("/products/sort/" + filter);
      } else {
        setUrlProduct("/products/");
      }
    }
  }, [location]);

  useEffect(() => {
    let link;
    // TH filter bằng category
    if (idCategory.current !== "") {
      if (filter === "") {
        link = "/products/category/" + idCategory.current;
      } else {
        link = `/products/category/sort/${idCategory.current}/${filter}`;
      }
      setUrlProduct(link);
      return;
    }
    // TH dùng thanh tìm kiếm có chữ != null
    if (location.state !== null) {
      link = location.state.url;
      if (filter !== null) link = link + "/sort/" + filter;
    }
    // TH dùng thanh tìm kiếm có chữ = null
    else if (location.state === null) {
      link = "/products/";
      if (filter !== "") {
        link = link + "sort/" + filter;
      }
    }
    setUrlProduct(link);
  }, [filter]);

  return (
    <div className="shop-container">
      <Helmet>
        <title>Shop</title>
      </Helmet>
      <div className="shop-header">
        <div className="image-container">
          <img
            className="image"
            src="assets/images/female-friends-out-shopping-together.jpg"
            alt="clothing"
          />
        </div>
        <div className="info-container">
          <h1 className="title">Shop</h1>
          <p className="desc">
            ADClothing is clothing designed to make everyone's life better. It
            is simple, high-quality, everyday clothing with a practical sense of
            beauty-ingenious in detail, thought through with life's needs in
            mind, and always evolving.
          </p>
        </div>
      </div>
      <Row className="shop-body">
        <Col md={9}>
          <div className="shop-result">
            <div>
              <h2>Shop</h2>
              <p>
                Showing 1-{pageCount} of{" "}
                <span>{productData.current.length}</span> results
              </p>
            </div>
            <Form.Select
              aria-label="Default select example"
              className="shop-sort"
              onChange={handleChoiceFilter}
            >
              <option value="">Default Sorting</option>
              <option value="date/desc">Sort by latest</option>
              <option value="asc">Sort by price: low to high</option>
              <option value="desc">Sort by price: high to low</option>
            </Form.Select>
          </div>
          <Productss products={products} />
          <Pagination className="shop-pagination">{index}</Pagination>
        </Col>
        <Col md={3}>
          <div className="shop-by-category mt-4">
            <h3>Shop by category</h3>
            <div>
              {categories == null ? (
                ""
              ) : (
                <ListGroup>
                  {categories.map((item) => {
                    return (
                      <ListGroup.Item
                        action
                        variant="light"
                        key={item._id}
                        onClick={() => {
                          handleClickCategory(item._id);
                        }}
                      >
                        {item.name}
                      </ListGroup.Item>
                    );
                  })}
                </ListGroup>
              )}
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default ShopPage;
