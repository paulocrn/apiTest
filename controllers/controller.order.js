const db = require("../models");
const Order = db.order;
const User = db.users;

const pushNotification = require("../middlewares/pushNotification");
const stripe = require("stripe")(process.env.STRIPE_SECRET_TOKEN);
const { v4: uuidv4 } = require("uuid");
const {
  transporter,
  sendUserOrderTemplate,
} = require("../middlewares/emailTemplate");

const order_get = (req, res) => {
  console.log("back fetching");
  Order.findAll({order: [['id', 'DESC']]})
    //.populate("items.item")
    //.populate("userId")
    .then((data) => {
      //console.log("exito back fetching", data);
      return res.status(200).send({
        status: "OK",
        message: "Get Orders Successfully",
        content: data,
      });
    })
    .catch((err) => {
      return res.status(400).send({
        status: "ERR_SERVER",
        message: err.message,
        content: null,
      });
    });
};
const order_post = async (req, res) => {
  const { items, totalAmount } = req.body.orderInfo;
  const { token } = req.body;
  const orders = items.map((item) => {
    return `itemID: ${item.item}, quantity:${item.quantity}`;
  });
  console.log("in post");
  if (!req.body) {
    return res.status(200).send({
      status: "ERR_REQUEST",
      message: "Please check your request!",
      content: null,
    });
  }
  let content = {
    title: "Orden de actualización",
    body: `Tu pedido ha sido realizado con éxito.`,
  };

  const order = new Order(req.body.orderInfo);

  if (Object.keys(token).length !== 0) {
    try {
      console.log("in try 1");
      stripe.charges.create({
        amount: totalAmount,
        currency: "usd",
        description: `Order Items: ${orders}`,
        source: token.id,
      });
    } catch (err) {
      res.send(err);
    }
  }
  try {
    //console.log("in try 2");
    //console.log("order ", order.dataValues.items);

    order.dataValues.items = JSON.stringify(order.dataValues.items);

    const resOrder = await order.save();
    
    /*order.save()
    .then((data) => {
      //console.log("resOrder ", data);
      resOrder = data;
    })
    .catch((err) => console.log(err));*/

    
    const user = await User.findByPk(resOrder.userId);
    pushNotification(user.pushTokens, content, "");
    transporter.sendMail(sendUserOrderTemplate(resOrder, user), (err, info) => {
      if (err) {
        res.status(500).send({ err: "Error enviando email" });
      } else {
        console.log(`** Email enviado **`, info);
      }
    });
    res.status(200).send({
      status: "OK",
      message: "Added Order Successfully",
      content: resOrder,
    });
  } catch (err) {
    return res.status(400).send({
      status: "ERR_SERVER",
      message: err.message,
      content: null,
    });
  }
};
const order_update = async (req, res) => {
  const { id } = req.params;
  const updateStatus = req.body.status;
  if (!req.params.id) {
    return res.status(200).send({
      status: "ERR_REQUEST",
      message: "Please check your ID request",
      content: null,
    });
  }
  let content = {
    title: "Orden de actualización",
    body: `Su Orden ${id.substr(id.length - 10)} se actualizó de estado a ${updateStatus}.`,
  };
  try {
    let resOrder;
    Order.findOne({where:{id: id}}).then((data)=>{
      if(data != null){
        //data.set();
      }
      resOrder = data;
      console.log("find dta ", data);
    });
    
    return res.status(200).send({
      status: "OK",
      message: "Updated Order Successfully",
      content: resOrder,
    });
  } catch (err) {
    return res.status(400).send({
      status: "ERR_SERVER",
      message: err.message,
      content: null,
    });
  }
};

module.exports = {
  order_get,
  order_post,
  order_update,
};
