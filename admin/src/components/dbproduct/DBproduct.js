import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { productColumns } from "../../datatablesource";
import axios from "../../hooks/axios";
import { toast } from "react-toastify";
import "./datatable.scss";

const DBproduct = () => {
  const [textSearch, setTextSearch] = useState("");
  const [data, setData] = useState([]);
  const [refresh, setRefresh] = useState(false);
  useEffect(() => {
    try {
      const fetchData = async () => {
        const res = await axios.get("/products");
        const myArr = res.data.map((item) => {
          return {
            id: item._id,
            name: item.name,
            category: item.category?.name,
            color: item.color,
            size: item.size.join(", "),
            price: item.price,
            description: item.description,
            imgPath: item.imgPath,
          };
        });
        setData(myArr);
      };
      fetchData();
    } catch (err) {
      console.log(err.message);
    }
  }, [refresh]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/products/${id}`);
      toast.success("Delete product successfully");
      setRefresh(!refresh);
    } catch (err) {
      console.log(err);
    }
  };

  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      width: 140,
      renderCell: (params) => {
        return (
          <div className="cellAction">
            <Link
              to={`/dashboard/products/edit/${params.row.id}`}
              style={{ textDecoration: "none" }}
            >
              <div className="viewButton">Edit</div>
            </Link>
            <div
              className="deleteButton"
              onClick={() => handleDelete(params.row.id)}
            >
              Delete
            </div>
          </div>
        );
      },
    },
  ];
  const handleSearch = async (e) => {
    try {
      const input = String(textSearch).replaceAll(" ", "-");
      if (textSearch.trim() === "") {
        const res = await axios.get("/products");
        const myArr = res.data.map((item) => {
          return {
            id: item._id,
            name: item.name,
            color: item.color,
            category: item.category,
            size: item.size.join(", "),
            price: item.price,
            description: item.description,
            imgPath: item.imgPath,
          };
        });
        setData(myArr);
        return;
      }
      const res = await axios.get(`/search/${input}`);
      const myArr = res.data.map((item) => {
        return {
          id: item._id,
          name: item.name,
          category: item.category,
          color: item.color,
          size: item.size.join(", "),
          price: item.price,
          description: item.description,
          imgPath: item.imgPath,
        };
      });
      setData(myArr);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="datatable">
      <div className="datatableTitle">
        Products
        <Link to="/dashboard/products/new" className="link">
          Add New
        </Link>
      </div>
      <div class="input-group mb-3">
        <input
          type="text"
          class="form-control"
          placeholder="Find something..."
          aria-label="Find something..."
          aria-describedby="button-addon2"
          onChange={(e) => setTextSearch(e.target.value)}
          onKeyDown={(event) => {
            if (event.which === 13) {
              handleSearch(event);
            }
          }}
        />
        <button
          class="btn btn-outline-primary"
          type="button"
          id="button-addon2"
          onClick={handleSearch}
        >
          Search
        </button>
      </div>
      {data && (
        <DataGrid
          className="datagrid"
          rows={data}
          columns={productColumns.concat(actionColumn)}
          pageSize={9}
          rowsPerPageOptions={[9]}
          // checkboxSelection
        />
      )}
    </div>
  );
};

export default DBproduct;
