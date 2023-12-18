import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { categoryColumns } from "../../datatablesource";
import axios from "../../hooks/axios";
import { toast } from "react-toastify";
import "./datatable.scss";

const DBCategory = () => {
  const [data, setData] = useState([]);
  const [refresh, setRefresh] = useState(false);
  useEffect(() => {
    try {
      const fetchData = async () => {
        const res = await axios.get("/categories");
        const myArr = res.data.map((item) => {
          return {
            id: item._id,
            name: item.name,
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
      await axios.delete(`/categories/${id}`);
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
              to={`/dashboard/categories/edit/${params.row.id}`}
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
  return (
    <div className="datatable">
      <div className="datatableTitle">
        Categories
        <Link to="/dashboard/categories/new" className="link">
          Add New
        </Link>
      </div>
      {data && (
        <DataGrid
          className="datagrid"
          rows={data}
          columns={categoryColumns.concat(actionColumn)}
          pageSize={9}
          rowsPerPageOptions={[9]}
        />
      )}
    </div>
  );
};

export default DBCategory;
