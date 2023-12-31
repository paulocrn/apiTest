const express = require("express");
const app = express();
//const mongoose = require("mongoose");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const path = require("path");
const cors = require("cors");
const os = require("os");
const fs = require('fs');

const networkInterfaces = os.networkInterfaces();
/*console.log("opt ", typeof(networkInterfaces.Ethernet));
console.log("net ", networkInterfaces);*/

//let ip = "127.0.0.1";
let ip;

if (typeof (networkInterfaces.Ethernet) == "undefined") {
  //ip = networkInterfaces["Wi-Fi"][1].address;
  //console.log("net in ", networkInterfaces);
  if (typeof (networkInterfaces["Wi-Fi"]) != "undefined") {
    networkInterfaces["Wi-Fi"].map((net_item)=>{
      if(net_item.family == "IPv4"){
        ip = net_item.address;
      }
    })
  }else{
    networkInterfaces["eth0"].map((net_item)=>{
      if(net_item.family == "IPv4"){
        ip = net_item.address;
      }
    })
  }
} else {
  ip = networkInterfaces.Ethernet[1].address;
}

console.log("backend in ", ip);

//config
require("dotenv/config");

//import routes
const productRoute = require("./routes/product");
const cartRoute = require("./routes/cart");
const orderRoute = require("./routes/order");
const favoriteRoute = require("./routes/favorite");
const authRoute = require("./routes/auth");
const notification = require("./middlewares/pushNotification");


//const dbConfig = require("./models");

ip = "0.0.0.0";

console.log("process ip ", ip);

app.listen(process.env.PORT, ip);
let dirPath = path.join(
  __dirname,
  "public/api/static/images/productPictures"
);
let dirPathUser = path.join(
  __dirname,
  "public/api/static/images/userprofile"
);
createDir(dirPath);
createDir(dirPathUser);
console.log("Connected to DB");


//Connect to DB
/*const dbURI = process.env.DB_CONNECTION;
mongoose.connect(
  dbURI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  },
  () => {
    app.listen(process.env.PORT, ip);
    let dirPath = path.join(
      __dirname,
      "public/api/static/images/productPictures"
    );
    let dirPathUser = path.join(
      __dirname,
      "public/api/static/images/userprofile"
    );
    createDir(dirPath);
    createDir(dirPathUser);
    console.log("Connected to DB");
  }
);*/

function createDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true }, (err) => {
      if (err) {
        console.error("createDir Error:", err);
      } else {
        console.log("Directory is made!");
      }
    });
  }
}

//middleware & static files
app.use(morgan("dev"));
app.use("/public", express.static(path.join(__dirname, "public")));
app.use(cors());
app.use(express.json());
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ extended: false, limit: "10mb" }));

//db
const db = require("./models");

db.sequelize.sync()
  .then(() => {
    console.log("Synced db.");
  })
  .catch((err) => {
    console.log("Failed to sync db: " + err.message);
  });

// // drop the table if it already exists
/*db.sequelize.sync({ force: true }).then(() => {
  console.log("Drop and re-sync db.");
});*/

//routes
app.get("/expo", (req, res) => {
  const id = req.query.userid;
  const token = req.query.token;
  console.log(id, token);
  res.writeHead(301, {
    Location: `exp://${ip}:19000/--/ResetPw?userid=${id}&token=${token}`,
  });
  res.end();
});
app.use(`/api/${process.env.VERSION}/product`, productRoute);
app.use(`/api/${process.env.VERSION}/cart`, cartRoute);
app.use(`/api/${process.env.VERSION}/order`, orderRoute);
app.use(`/api/${process.env.VERSION}/favoritelist`, favoriteRoute);
app.use(`/api/${process.env.VERSION}/user`, authRoute);
app.use(`/api/notification`, notification);
