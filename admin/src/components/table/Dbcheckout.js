import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import "./table.scss";

import { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import axios from "../../hooks/axios";
import formatter from "../../hooks/formatter";
import { toast } from "react-toastify";
const DbCheckout = () => {
  const [checkouts, setCheckouts] = useState([]);
  const [refresh, setRefresh] = useState(true);
  const [show, setShow] = useState(false);
  const [productID, setProductID] = useState("");
  useEffect(() => {
    const fetchData = async () => {
      const { data } = await axios.get("/checkouts");
      setCheckouts(data);
    };
    fetchData();
  }, [refresh]);

  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);
  const handleConfirm = async () => {
    try {
      await axios.patch(`/checkouts/${productID}`, {
        isPaid: true,
      });
      toast.success("Confirm Checkout Success");
      setRefresh(!refresh);
    } catch (error) {
      console.log("Confirm Checkout Fail");
    }
    setShow(false);
  };

  const handleCheckout = async (id) => {
    setProductID(id);
    handleShow();
  };

  return (
    <>
      <TableContainer component={Paper} className="table">
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell className="tableCell">ID</TableCell>
              <TableCell className="tableCell">Customer</TableCell>
              <TableCell className="tableCell">Delivery Address</TableCell>
              <TableCell className="tableCell">Date</TableCell>
              <TableCell className="tableCell">Amount</TableCell>
              <TableCell className="tableCell">Payment Method</TableCell>
              <TableCell className="tableCell">Status</TableCell>
              <TableCell className="tableCell">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {checkouts.map((row) => (
              <TableRow key={row._id}>
                <TableCell className="tableCell">{`${row._id.slice(
                  0,
                  10
                )}...`}</TableCell>
                <TableCell className="tableCell">{`${row.user.slice(
                  0,
                  10
                )}...`}</TableCell>
                <TableCell className="tableCell">
                  <div className="cellWrapper">
                    {`${row.deliveryAddress.address}, ${row.deliveryAddress.ward}, ${row.deliveryAddress.distinct}, ${row.deliveryAddress.province}`}
                  </div>
                </TableCell>
                <TableCell className="tableCell">
                  {formatter.format(new Date(row.createdAt.substring(0, 10)))}
                </TableCell>
                <TableCell className="tableCell">${row.totalCost}</TableCell>
                <TableCell className="tableCell">{row.paymentMethod}</TableCell>
                <TableCell className="tableCell">
                  <span
                    className={`status ${row.isPaid ? "Approved" : "Pending"}`}
                  >
                    {row.isPaid ? "Approved" : "Pending"}
                  </span>
                </TableCell>
                <TableCell className="tableCell">
                  <Button
                    variant="light"
                    onClick={() => handleCheckout(row._id)}
                  >
                    <i class="fa-regular fa-money-bill-1 money"></i>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Checkout</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure to confirm this checkout?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="success" onClick={handleConfirm}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default DbCheckout;
