import "./featured.scss";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpOutlinedIcon from "@mui/icons-material/KeyboardArrowUpOutlined";
import { useEffect, useState } from "react";
import axios from "../../hooks/axios";
import formatter from "../../hooks/formatter";

const Featured = () => {
  const [yesterRevenue, setYesTerRevenue] = useState(0);
  const [todayRevenue, setTodayRevenue] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await axios.get("/checkouts");
      const revenue = data
        .map((item) => {
          return {
            name: formatter.format(new Date(item.createdAt.substring(0, 10))),
            Total: item.totalCost,
          };
        })
        .filter((item) => item.name === formatter.format(new Date()))
        .reduce(
          (accumulate, currentValue) => accumulate + currentValue.Total,
          0
        );

      setTodayRevenue(revenue);
    };
    fetchData();
  }, []);
  console.log("Yesterday: " + yesterRevenue);
  console.log("Today: " + todayRevenue);
  useEffect(() => {
    const fetchData = async () => {
      const { data } = await axios.get("/checkouts");
      const revenue = data
        .map((item) => {
          return {
            name: formatter.format(new Date(item.createdAt.substring(0, 10))),
            Total: item.totalCost,
          };
        })
        .filter((item) => {
          const today = new Date();
          const yesterday = today.setDate(today.getDate() - 1);
          return item.name === formatter.format(yesterday);
        })
        .reduce(
          (accumulate, currentValue) => accumulate + currentValue.Total,
          0
        );
      setYesTerRevenue(revenue);
    };
    fetchData();
  }, []);
  return (
    <div className="featured">
      <div className="top">
        <h1 className="title">Total Revenue</h1>
        <MoreVertIcon fontSize="small" />
      </div>
      <div className="bottom">
        <span className="title">KPI today: $100</span>
        <div className="featuredChart">
          <CircularProgressbar
            value={todayRevenue > 100 ? 100 : todayRevenue}
            text={`${todayRevenue > 100 ? 100 : todayRevenue}%`}
            strokeWidth={5}
          />
        </div>
        <p className="title">Total today</p>
        <div className="ratio-month">
          <p className="amount">${todayRevenue}</p>
          <div className="summary">
            <div className="item">
              {todayRevenue > yesterRevenue ? (
                <div className="itemResult positive">
                  <KeyboardArrowUpOutlinedIcon fontSize="small" />
                  <div className="resultAmount">
                    ${todayRevenue - yesterRevenue}
                  </div>
                </div>
              ) : (
                <div className="itemResult negative">
                  <KeyboardArrowDownIcon fontSize="small" />
                  <div className="resultAmount">
                    ${yesterRevenue - todayRevenue}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <p className="desc">
          Previous transactions processing. Last payments may not be included.
        </p>
      </div>
    </div>
  );
};

export default Featured;
