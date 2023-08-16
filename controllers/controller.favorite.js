/* eslint-disable consistent-return */
const db = require("../models");
const Favorite = db.favorite;

const favorite_get = (req, res) => {
  Favorite.findAll()
    //.populate("items") //access to items ref from product
    .then((data) => {
      return res.status(200).send({
        status: "OK",
        message: "Lista de Favoritos",
        content: data,
      });
    })
    .catch((err) => {
      console.log("en error");
      return res.status(400).send({
        status: "ERR_SERVER",
        message: err.message,
        content: null,
      });
    });
};

const favorite_post = (req, res) => {
  let arr_items = [];
  let f_result = [];
  if (!req.body) {
    return res.status(400).send({
      status: "ERR_REQUEST",
      message: "Please check your request!",
      content: null,
    });
  }

  arr_items.push(req.body.items[0].item);

  console.log("back add fav ", arr_items);

  Favorite.findOne({where:{userId: req.body.userId}}).then((result) => {
    if (result != null) {
      f_result = [...arr_items, ...JSON.parse(result.dataValues.items)];

      result.set({"items": JSON.stringify(f_result)});

      result
        .save()
        .then((data) => {
          console.log("daata save ", data);
          return res.status(200).send({
            status: "OK",
            message: "Elemento favorito agregado con éxito",
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
    } else {
      const favorite = new Favorite({
        userId: req.body.userId,
        items: JSON.stringify(arr_items),
      });
      favorite
        .save()
        .then((data) => {
          return res.status(200).send({
            status: "OK",
            message: "Elemento favorito agregado con éxito",
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
    }

  });
  
    
    /*(err, result) => {
    console.log("controller bef3 ", req.body.userId);
    if (err) {
      console.log(err);
    }
    console.log("controller ", result);
    if (result) {
      result.items.push(req.body.items[0].item);
      result
        .save()
        .then((data) => {
          return res.status(200).send({
            status: "OK",
            message: "Elemento favorito agregado con éxito",
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
    } else {
      const favorite = new Favorite({
        userId: req.body.userId,
        items: req.body.items[0].item,
      });
      favorite
        .save()
        .then((data) => {
          return res.status(200).send({
            status: "OK",
            message: "Elemento favorito agregado con éxito",
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
    }
  });*/

  //console.log("controller rp ", rp);
};

const favorite_deleteItem = (req, res) => {
  const { userId } = req.params;
  const { item } = req.body;
  if (!req.body || !req.params.userId) {
    return res.status(200).send({
      status: "ERR_REQUEST",
      message: "Please check your ID request",
      content: null,
    });
  }
  console.log(userId);
  console.log(item);
  Favorite.findOne({where: { userId: userId }}).then((data) => {

console.log("in find ", data);

      if (data != null) {
        //console.log("BEF indx find ", item);
        let new_data = JSON.parse(data.dataValues.items);
        const favoriteIndex = new_data.findIndex((product) => {
          return product === item;
        });
        //console.log(favoriteIndex);
        new_data.splice(favoriteIndex, 1);

        //console.log("new_data ", new_data);

        data.set({"items": JSON.stringify(new_data)});

        data.save();
  
        return res.status(200).send({
          status: "OK",
          message: "Remove Favorite Item Successfully",
          content: data,
        });
      }else{
        console.log(err);
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

module.exports = {
  favorite_get,
  favorite_post,
  favorite_deleteItem,
};
