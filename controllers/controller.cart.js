/* eslint-disable consistent-return */
const db = require("../models");
const Cart = db.cart;

const cart_get = (req, res) => {
  Cart.findAll()
    //.populate("items.item") //access to items ref from product
    .then((data) => {
      return res.status(200).send({
        status: "OK",
        message: "Get Users Carts Successfully",
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

const cart_post = (req, res) => {
  let arr_items = [];
  let f_result = [];
  if (!req.body) {
    return res.status(400).send({
      status: "ERR_REQUEST",
      message: "Please check your request!",
      content: null,
    });
  }

  //console.log("req ", req.body.items);
  console.log("req ", req.body.items);

  arr_items.push(req.body.items[0]);

  Cart.findOne({where:{ userId: req.body.userId }}).then((result) => {
    //console.log("result ", result);

    if (result != null) {

      //f_result = [...arr_items, ...JSON.parse(result.dataValues.items)];

      //result.set({"items": JSON.stringify(f_result)});

      console.log("no f ", f_result);

      const item = req.body.items[0].item;

      const cartIndex = JSON.parse(result.dataValues.items).findIndex((obj) => { return obj.item == item });

      console.log("cartIndex ", cartIndex);

      /*if(bd_cart >= 0){
        let n_arr = JSON.parse(result.dataValues.items);

        n_arr[bd_cart].quantity += 1;

        f_result = [...n_arr];

      }else{
        f_result = [...arr_items, ...JSON.parse(result.dataValues.items)];
      }*/
      
      /*console.log("result.dataValues ", result.dataValues.items);
      const cartIndex = JSON.parse(result.dataValues.items).findIndex((cart) => {
        console.log("cart item ", cart.item.toString() === item);
        return cart.item.toString() === item;
      });
      console.log("cartIndex ", cartIndex);*/
      if (cartIndex < 0) {
        //result.items.push(req.body.items[0]);
        f_result = [...arr_items, ...JSON.parse(result.dataValues.items)];

        result.set({"items": JSON.stringify(f_result)});

        result
          .save()
          .then((data) => {
            return res.status(200).send({
              status: "OK",
              message: "Added Cart Successfully",
              content: data,
            });
          })
          .catch((err) => console.log(err));
      } else {
        let n_arr = JSON.parse(result.dataValues.items);

        //console.log("f_result ", n_arr);

        n_arr[cartIndex].quantity =  Number(n_arr[cartIndex].quantity) + 1;

        f_result = [...n_arr];

        result.set({"items": JSON.stringify(f_result)});

        result
          .save()
          .then((data) => {
            return res.status(200).send({
              status: "OK",
              message: "Added Cart Successfully",
              content: data,
            });
          })
          .catch((err) => console.log(err));
      }
    } else {
      console.log("new ");
      const cart = new Cart({
        userId: req.body.userId,
        items: JSON.stringify(arr_items),
      });
      cart
        .save()
        .then((data) => {
          return res.status(200).send({
            status: "OK",
            message: "Added Cart Successfully",
            content: data,
          });
        })
        .catch((err) => console.log(err));
    }
  }).catch((err) => {
    return res.status(400).send({
      status: "ERR_SERVER",
      message: err.message,
      content: null,
    });
  });
};
const cart_update = (req, res) => {
  const id = req.params.id;
  const { item, quantity } = req.body;
  console.log("FromDecrese ", id, item, quantity);
  if (!req.body || !id) {
    return res.status(200).send({
      status: "ERR_REQUEST",
      message: "Please check your request",
      content: null,
    });
  }
  Cart.findByPk(id).then((data) => {

    console.log("result data ", data);

    if (data != null) {
      const cartIndex = JSON.parse(data.dataValues.items).findIndex((cart) => {
        return cart.item === item;
      });

      const result = JSON.parse(data.dataValues.items);

      console.log("result ", cartIndex, result[cartIndex]);

      if (quantity === "increase") {
        result[cartIndex].quantity = (
          Number(result[cartIndex].quantity) + 1
        ).toString();

        data.set({"items": JSON.stringify(result)});

        data
          .save()
          .then((data) => {
            return res.status(200).send({
              status: "OK",
              message: "Increase Cart Successfully",
              content: data.content,
            });
          })
          .catch((err) => console.log(err));

        //result.save();
      } else if (Number(result[cartIndex].quantity) === 1) {
        result.splice(cartIndex, 1);
        result.save();
      } else {
        result[cartIndex].quantity = (
          Number(result[cartIndex].quantity) - 1
        ).toString();
        
        data.set({"items": JSON.stringify(result)});

        data
          .save()
          .then((data) => {
            return res.status(200).send({
              status: "OK",
              message: "Decrese Cart Successfully",
              content: data,
            });
          })
          .catch((err) => console.log(err));


      }
    }


      /*return res.status(200).send({
        status: "OK",
        message: "Updated Cart Successfully",
        content: data,
      });*/
    })
    .catch((err) => {
      return res.status(400).send({
        status: "ERR_SERVER",
        message: err.message,
        content: null,
      });
    });
};
const cart_deleteCartItem = (req, res) => {
  const { id } = req.params;
  const { item } = req.body;
  //console.log("delete cart ", id, item);
  if (!req.body || !req.params.id) {
    return res.status(200).send({
      status: "ERR_REQUEST",
      message: "Please check your ID request",
      content: null,
    });
  }
  //console.log("aft delete cart ");
  Cart.findOne({where:{id: id}}).then((data) => {
      if(data != null){
        //console.log("BEF cart index ", JSON.parse(data.dataValues.items));

        const cartIndex = JSON.parse(data.dataValues.items).findIndex((cart) => {
          //console.log("cart item ", cart, item);
          //console.log("idx ", cart.item, item);
          return cart.item.toString() == item;
        });

        //let f_result = [];
        let n_arr = JSON.parse(data.dataValues.items);

        //console.log("f_result ", n_arr);

        //console.log("cart index ", cartIndex, data);

        n_arr.splice(cartIndex, 1);

        //console.log("f result ", n_arr, f_result);

        data.set({"items": JSON.stringify(n_arr)});

        

        data.save();


        return res.status(200).send({
          status: "OK",
          message: "Delete Cart Item Successfully",
          content: data,
        });
      }
    })
    .catch((err) => {
      return res.status(400).send({
        status: "ERR_SERVER",
        message: err.message,
        content: null,
      });
    });
};

const cart_delete = async(req, res) => {
  const id = req.params.id;
  /*Cart.findByIdAndDelete(id)
    .then((data) => {
      return res.status(200).send({
        status: "OK",
        message: "Delete Cart Successfully",
        content: data,
      });
    })
    .catch((err) => {
      return res.status(400).send({
        status: "ERR_SERVER",
        message: err.message,
        content: null,
      });
    });*/

  
    Cart.destroy({ where: { id: id } })
    .then((data) => {
      return res.status(200).send({
        status: "OK",
        message: "Delete Cart Successfully",
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


    //const count = await Invoice.destroy({ where: { id: 2 } });

};

module.exports = {
  cart_get,
  cart_post,
  cart_update,
  cart_deleteCartItem,
  cart_delete,
};
