import "./custom.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { useEffect, useState, useRef } from "react";
import { FilePond, registerPlugin } from "react-filepond";

import "filepond/dist/filepond.min.css";
import FilePondPluginImageResize from "filepond-plugin-image-resize";
import FilePondPluginFileEncode from "filepond-plugin-file-encode";
import FilePondPluginImageValidateSize from "filepond-plugin-image-validate-size";
import FilePondPluginFileValidateSize from "filepond-plugin-file-validate-size";
// Register the plugin
// Import the Image EXIF Orientation and Image Preview plugins
// Note: These need to be installed separately
// `npm i filepond-plugin-image-preview filepond-plugin-image-exif-orientation --save`
import FilePondPluginImagePreview from "filepond-plugin-image-preview";

import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import { Col, Form, Row } from "react-bootstrap";
import axios from "../../hooks/axios";
import { useNavigate, useParams } from "react-router-dom";
import { notice } from "../../hooks/toast.js";
// Register the plugins
registerPlugin(
  FilePondPluginFileValidateSize,
  FilePondPluginImageValidateSize,
  FilePondPluginFileEncode,
  FilePondPluginImagePreview,
  FilePondPluginImageResize
);

const EditProduct = ({ title }) => {
  // const [files, setFiles] = useState([]);
  const [files, setFiles] = useState([]);
  const flagChangeFile = useRef(false);
  const nameOrigin = useRef();
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState();
  const [categories, setCategories] = useState([]);
  const [colorRed, setColorRed] = useState(false);
  const [colorBlue, setColorBlue] = useState(false);
  const [colorBlack, setColorBlack] = useState(false);
  const [colorWhite, setColorWhite] = useState(false);
  const [colorYellow, setColorYellow] = useState(false);
  const [sizeS, setSizeS] = useState(false);
  const [sizeM, setSizeM] = useState(false);
  const [sizeL, setSizeL] = useState(false);
  const [sizeXL, setSizeXL] = useState(false);
  const [sizeXXL, setSizeXXL] = useState(false);
  const [description, setDescription] = useState("");

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    function checkBoxLimit() {
      var checkBoxGroup = document.forms["form_name"]["color"];
      var limit = 3;
      for (var i = 0; i < checkBoxGroup.length; i++) {
        checkBoxGroup[i].onclick = function () {
          var checkedcount = 0;
          for (var i = 0; i < checkBoxGroup.length; i++) {
            checkedcount += checkBoxGroup[i].checked ? 1 : 0;
          }
          if (checkedcount > limit) {
            console.log("You can select maximum of " + limit + " color.");
            alert("You can select maximum of " + limit + " color.");
            this.checked = false;
          }
        };
      }
    }
    checkBoxLimit();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const { data: cat } = await axios.get("/categories");
      setCategories(cat);
      const { data } = await axios.get(`/products/${id}`);
      nameOrigin.current = data.name;
      setName(data.name);
      setPrice(data.price);
      setCategory(data.category._id);
      setColorRed(data.color.includes("red"));
      setColorBlue(data.color.includes("blue"));
      setColorBlack(data.color.includes("black"));
      setColorWhite(data.color.includes("white"));
      setColorYellow(data.color.includes("yellow"));
      setSizeS(data.size.includes("S"));
      setSizeM(data.size.includes("M"));
      setSizeL(data.size.includes("L"));
      setSizeXL(data.size.includes("XL"));
      setSizeXXL(data.size.includes("XXL"));
      setDescription(data.description);
      setFiles(data.imgPath);
    };
    fetchData();
  }, [id]);

  const setColor = () => {
    var color = [];
    if (colorRed) {
      color.push("red");
    }
    if (colorBlue) {
      color.push("blue");
    }
    if (colorBlack) {
      color.push("black");
    }
    if (colorWhite) {
      color.push("white");
    }
    if (colorYellow) {
      color.push("yellow");
    }
    return color;
  };
  const setSize = () => {
    var size = [];
    if (sizeS) {
      size.push("S");
    }
    if (sizeM) {
      size.push("M");
    }
    if (sizeL) {
      size.push("L");
    }
    if (sizeXL) {
      size.push("XL");
    }
    if (sizeXXL) {
      size.push("XXL");
    }
    return size;
  };
  const checkFrom = () => {
    if (files.length === 0) {
      notice("warn", "You must add a photo for the product", 2000);
      return false;
    } else if (
      name.trim() === "" ||
      description.trim() === "" ||
      typeof price !== "number"
    ) {
      notice("warn", "Name, price and description cannot be left blank", 2000);
      return false;
    } else if (setSize().length === 0) {
      notice("warn", "You must choose the size for the product", 2000);
      return false;
    }
    return true;
  };
  const checkProductName = async (name) => {
    try {
      const { data } = await axios.get(`/products/check/${name}`);
      if (
        data.length === 0 ||
        (data.length === 1 && data[0].name.trim() === nameOrigin.current.trim())
      ) {
        return true;
      } else {
        notice(
          "warn",
          `"${name}" already exists, please choose another name`,
          2000
        );
        return false;
      }
    } catch (error) {
      notice("error", "Wrong something", 2000);
      console.log(error);
    }
  };
  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      if (checkFrom() === false) {
        return;
      } else if ((await checkProductName(name.trim())) === false) {
        return;
      }
      const img = getImageData(files);
      const { data } = await axios.put(`/products/${id}`, {
        name: name.trim(),
        price,
        category,
        color: setColor(),
        size: setSize(),
        description,
        img: img,
      });
      if (data._id) {
        notice("success", "Update successful", 2000);
      } else {
        notice("error", "Update failed", 2000);
      }
      navigate("/dashboard/products");
    } catch (error) {
      notice("error", "Wrong something", 2000);
      console.log(error);
    }
  };
  const getImageData = (files) => {
    let rs = [];
    files.forEach((item) => {
      var imgData = `{"type":"${
        item.fileType.split(";")[0]
      }","data":"${item.getFileEncodeBase64String()}"}`;

      rs.push(imgData);
    });
    return rs;
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
                  onChange={async (e) => {
                    checkProductName(e.target.value.trim());
                    setName(e.target.value);
                  }}
                />
                <br />
                <label htmlFor="price" id="price">
                  Price
                </label>
                <br />
                <input
                  type="number"
                  name="price"
                  style={{ minWidth: "500px" }}
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
                <br />
                <label>Category</label>
                <br />
                <select
                  id="category"
                  name="category"
                  onChange={(e) => setCategory(e.target.value)}
                  style={{ width: "100%" }}
                >
                  {categories?.map((c) => (
                    <option
                      key={c._id}
                      value={c._id}
                      selected={c._id === category}
                    >
                      {c.name}
                    </option>
                  ))}
                </select>
                <br />
                <label>Color (Choose base on order of img) </label>
                <br />
                <input
                  type="checkbox"
                  id="red"
                  name="color"
                  value="red"
                  checked={colorRed}
                  onChange={(e) => setColorRed(e.target.checked)}
                />
                <label htmlFor="red" style={{ color: "red" }}>
                  Red
                </label>
                <br />
                <input
                  type="checkbox"
                  id="blue"
                  name="color"
                  value="blue"
                  checked={colorBlue}
                  onChange={(e) => setColorBlue(e.target.checked)}
                />
                <label htmlFor="blue" style={{ color: "blue" }}>
                  Blue
                </label>
                <br />
                <input
                  type="checkbox"
                  id="black"
                  name="color"
                  value="black"
                  checked={colorBlack}
                  onChange={(e) => setColorBlack(e.target.checked)}
                />
                <label htmlFor="black" style={{ color: "black" }}>
                  Black
                </label>
                <br />
                <input
                  type="checkbox"
                  id="white"
                  name="color"
                  value="white"
                  checked={colorWhite}
                  onChange={(e) => setColorWhite(e.target.checked)}
                />
                <label
                  htmlFor="white"
                  style={{ color: "white", textShadow: "1px 1px #000" }}
                >
                  White
                </label>
                <br />
                <input
                  type="checkbox"
                  id="yellow"
                  name="color"
                  value="yellow"
                  checked={colorYellow}
                  onChange={(e) => setColorYellow(e.target.checked)}
                />
                <label
                  htmlFor="yellow"
                  style={{ color: "yellow", textShadow: "1px 1px #000" }}
                >
                  Yellow
                </label>
                <br />
                <label>Size</label>
                <br />
                <input
                  type="checkbox"
                  id="S"
                  name="size"
                  value="S"
                  checked={sizeS}
                  onChange={(e) => setSizeS(e.target.checked)}
                />
                <label htmlFor="S">S</label>
                <br />
                <input
                  type="checkbox"
                  id="M"
                  name="size"
                  value="M"
                  checked={sizeM}
                  onChange={(e) => setSizeM(e.target.checked)}
                />
                <label htmlFor="M">M</label>
                <br />
                <input
                  type="checkbox"
                  id="L"
                  name="size"
                  value="L"
                  checked={sizeL}
                  onChange={(e) => setSizeL(e.target.checked)}
                />
                <label htmlFor="L">L</label>
                <br />
                <input
                  type="checkbox"
                  id="XL"
                  name="size"
                  value="XL"
                  checked={sizeXL}
                  onChange={(e) => setSizeXL(e.target.checked)}
                />
                <label htmlFor="XL">XL</label>
                <br />
                <input
                  type="checkbox"
                  id="XXL"
                  name="size"
                  value="XXL"
                  checked={sizeXXL}
                  onChange={(e) => setSizeXXL(e.target.checked)}
                />
                <label htmlFor="XXL">XXL</label>
                <br />
                <label htmlFor="description" id="description">
                  Description
                </label>
                <br />
                <textarea
                  type="text"
                  name="description"
                  style={{ height: "100px", minWidth: "500px" }}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </Col>
              <Col md={6}>
                <FilePond
                  files={files}
                  onupdatefiles={setFiles}
                  allowMultiple={true}
                  maxFiles={3}
                  maxFileSize="3MB"
                  //server="/api"
                  name="img"
                  labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
                />
                <input type="submit" value="Edit Product" />
              </Col>
            </Row>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default EditProduct;
