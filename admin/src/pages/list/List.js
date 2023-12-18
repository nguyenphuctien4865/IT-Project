import "./list.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Dbuser from "../../components/DBuser/DBuser";
import Dbproduct from "../../components/dbproduct/DBproduct";
import Dbcategory from "../../components/DBcategory/DBcategory";

const List = ({ type }) => {
  return (
    <div className="list">
      <Sidebar />
      <div className="listContainer">
        {type === 1 && <Dbuser />}
        {type === 2 && <Dbproduct />}
        {type === 3 && <Dbcategory />}
      </div>
    </div>
  );
};

export default List;
