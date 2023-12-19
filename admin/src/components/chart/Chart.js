import { addDays } from "date-fns";
import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";
import axios from "../../hooks/axios";
import DateRangePickerComp from "../calendar/DateRangePickerComp.js";
import "./chart.scss";
// const data = [
//   { name: "January", Total: 1200 },
//   { name: "February", Total: 2100 },
//   { name: "March", Total: 800 },
//   { name: "April", Total: 1600 },
//   { name: "May", Total: 900 },
//   { name: "June", Total: 1700 },
// ];

const Chart = ({ aspect, title }) => {
  const [dates, setDates] = useState([
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 7),
      key: "selection",
    },
  ]);
  const startDate = `${dates[0].startDate.getFullYear()}-${
    dates[0].startDate.getMonth() + 1
  }-${dates[0].startDate.getDate()}`;

  const endDate = `${dates[0].endDate.getFullYear()}-${
    dates[0].endDate.getMonth() + 1
  }-${dates[0].endDate.getDate() + 1}`;

  const [checkouts, setCheckouts] = useState([]);
  const handleDateRange = (input) => {
    setDates(input);
  };
  useEffect(() => {
    const fetchData = async () => {
      const { data } = await axios.get(
        `/checkouts/revenue/${startDate}/${endDate}`
      );
      setCheckouts(data);
    };
    fetchData();
  }, [dates]);
  return (
    <div className="chart">
      <DateRangePickerComp getDateRange={handleDateRange} />

      {checkouts && (
        <ResponsiveContainer width="100%" aspect={aspect}>
          <AreaChart
            width={730}
            height={250}
            data={checkouts}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="total" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#014088" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#1C97CB" stopOpacity={0.2} />
              </linearGradient>
            </defs>
            <XAxis dataKey="_id" stroke="#081118" />
            <CartesianGrid strokeDasharray="3 3" className="chartGrid" />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="total"
              stroke="#4EBBB9"
              fillOpacity={1}
              fill="url(#total)"
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default Chart;
