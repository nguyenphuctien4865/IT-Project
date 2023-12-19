export const userColumns = [
  { field: "id", headerName: "ID", width: 70 },
  {
    field: "name",
    headerName: "User",
    width: 180,
    renderCell: (params) => {
      return (
        <div className="cellWithImg">
          <img className="cellImg" src={params.row.avatar} alt="avatar" />
          {params.row.name}
        </div>
      );
    },
  },
  {
    field: "email",
    headerName: "Email",
    width: 230,
  },
  {
    field: "address",
    headerName: "Address",
    width: 530,
  },
  {
    field: "role",
    headerName: "Role",
    width: 100,
  },
];

// export const userColumns = [
//   { field: "id", headerName: "ID", width: 70 },
//   {
//     field: "user",
//     headerName: "User",
//     width: 230,
//     renderCell: (params) => {
//       return (
//         <div className="cellWithImg">
//           <img className="cellImg" src={params.row.img} alt="avatar" />
//           {params.row.username}
//         </div>
//       );
//     },
//   },
//   {
//     field: "email",
//     headerName: "Email",
//     width: 230,
//   },

//   {
//     field: "age",
//     headerName: "Age",
//     width: 100,
//   },
//   {
//     field: "status",
//     headerName: "Status",
//     width: 160,
//     renderCell: (params) => {
//       return (
//         <div className={`cellWithStatus ${params.row.status}`}>
//           {params.row.status}
//         </div>
//       );
//     },
//   },
// ];

//temporary data
export const userRows = [
  {
    id: 1,
    username: "Snow",
    img: "https://images.pexels.com/photos/1820770/pexels-photo-1820770.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
    status: "active",
    email: "1snow@gmail.com",
    age: 35,
  },
  {
    id: 2,
    username: "Jamie Lannister",
    img: "https://images.pexels.com/photos/1820770/pexels-photo-1820770.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
    email: "2snow@gmail.com",
    status: "passive",
    age: 42,
  },
  {
    id: 3,
    username: "Lannister",
    img: "https://images.pexels.com/photos/1820770/pexels-photo-1820770.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
    email: "3snow@gmail.com",
    status: "pending",
    age: 45,
  },
  {
    id: 4,
    username: "Stark",
    img: "https://images.pexels.com/photos/1820770/pexels-photo-1820770.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
    email: "4snow@gmail.com",
    status: "active",
    age: 16,
  },
  {
    id: 5,
    username: "Targaryen",
    img: "https://images.pexels.com/photos/1820770/pexels-photo-1820770.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
    email: "5snow@gmail.com",
    status: "passive",
    age: 22,
  },
  {
    id: 6,
    username: "Melisandre",
    img: "https://images.pexels.com/photos/1820770/pexels-photo-1820770.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
    email: "6snow@gmail.com",
    status: "active",
    age: 15,
  },
  {
    id: 7,
    username: "Clifford",
    img: "https://images.pexels.com/photos/1820770/pexels-photo-1820770.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
    email: "7snow@gmail.com",
    status: "passive",
    age: 44,
  },
  {
    id: 8,
    username: "Frances",
    img: "https://images.pexels.com/photos/1820770/pexels-photo-1820770.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
    email: "8snow@gmail.com",
    status: "active",
    age: 36,
  },
  {
    id: 9,
    username: "Roxie",
    img: "https://images.pexels.com/photos/1820770/pexels-photo-1820770.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
    email: "snow@gmail.com",
    status: "pending",
    age: 65,
  },
  {
    id: 10,
    username: "Roxie",
    img: "https://images.pexels.com/photos/1820770/pexels-photo-1820770.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
    email: "snow@gmail.com",
    status: "active",
    age: 65,
  },
];

export const categoryColumns = [
  { field: "id", headerName: "ID", width: 70 },
  {
    field: "name",
    headerName: "Name",
    width: 230,
  },
];
export const productColumns = [
  { field: "id", headerName: "ID", width: 70 },
  {
    field: "name",
    headerName: "Name",
    width: 230,
  },
  {
    field: "imgPath",
    headerName: "Image",
    width: 230,
    renderCell: (params) => {
      const imgUrl = params.row.imgPath;
      return (
        <div className="cellWithImg">
          {imgUrl.map((item, index) => {
            return (
              <img key={index} className="cellImg" src={item} alt="avatar" />
            );
          })}
        </div>
      );
    },
  },

  {
    field: "size",
    headerName: "Size",
    width: 140,
  },
  {
    field: "color",
    headerName: "Color",
    width: 160,
    renderCell: (params) => {
      return (
        <div className="cellWithImg">
          {params.row.color.map((item) => (
            <div
              key={item}
              style={{
                width: "20px",
                height: "20px",
                borderRadius: "50%",
                margin: "0 4px",
                backgroundColor: item,
                border: item === "white" && "1px solid #ccc",
              }}
            />
          ))}
        </div>
      );
    },
  },
  {
    field: "category",
    headerName: "Category",
    width: 140,
  },
  {
    field: "description",
    headerName: "Description",
    width: 160,
  },
  {
    field: "price",
    headerName: "Price",
    width: 100,
  },
];

export const productRows = [
  {
    id: 1,
    name: "Snow",
    img: "https://images.pexels.com/photos/1820770/pexels-photo-1820770.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
    description: "active",
    price: "21,500,000",
  },
  {
    id: 2,
    name: "Snow",
    img: "https://images.pexels.com/photos/1820770/pexels-photo-1820770.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
    description: "hot",
    price: "21,500,000",
  },
  {
    id: 3,
    name: "Snow",
    img: "https://images.pexels.com/photos/1820770/pexels-photo-1820770.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
    description: "oke",
    price: "21,500,000",
  },
  {
    id: 4,
    name: "Snow",
    img: "https://images.pexels.com/photos/1820770/pexels-photo-1820770.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
    description: "oke",
    price: "21,500,000",
  },
];
