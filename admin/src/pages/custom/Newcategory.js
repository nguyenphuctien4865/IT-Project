import { useState } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import "./custom.scss";

import "filepond/dist/filepond.min.css";
// Register the plugin

import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import { Button, Col, Form, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "../../hooks/axios";

const NewCategory = ({ title }) => {
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.get("/categories");
      if (data.map((item) => item.name).includes(name)) {
        toast.error("This category is exist");
        return;
      }
      await axios.post("/categories", {
        name,
      });
      toast.success("Category created");
      navigate("/dashboard/categories");
    } catch (error) {
      toast.error(error.message);
    }
  };
  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        <div className="top">
          <h1>{title}</h1>
        </div>
        <div className="bottom">
          <Form
            onSubmit={handleSubmit}
            name="form_name"
            id="form_name"
            style={{ width: "100%" }}
          >
            <Row>
              <Col md={6}>
                <label htmlFor="name">Name</label>
                <br />
                <input
                  type="text"
                  name="name"
                  id="name"
                  style={{ minWidth: "500px" }}
                  value={name}
                  required
                  onChange={(e) => setName(e.target.value)}
                />
                <Button variant="dark" type="submit">
                  Add
                </Button>
              </Col>
            </Row>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default NewCategory;
