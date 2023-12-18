import Sidebar from "../../components/sidebar/Sidebar";
import "./home.scss";
import Featured from "../../components/featured/Featured";
import Chart from "../../components/chart/Chart";
import DbCheckout from "../../components/table/Dbcheckout";

const Home = () => {
  return (
    <div className="home">
      <Sidebar />
      <div className="homeContainer">
        {/* <Navbar /> */}

        <div className="charts">
          <Featured />
          <Chart title="Weekly (Revenue)" aspect={2 / 1} />
        </div>
        <div className="listContainer">
          <div className="listTitle">Latest Transactions</div>
          <DbCheckout />
        </div>
      </div>
    </div>
  );
};

export default Home;
