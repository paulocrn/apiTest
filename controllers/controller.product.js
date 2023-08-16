const db = require("../models");

//console.log("db ", db);

const Product = db.product;

const product_get = (req, res) => {
  let page = parseInt(req.query.page) || 0; //for next page pass 1 here
  let limit = parseInt(req.query.limit) || 0;

  //console.log("opt ", page, limit);

  const title = req.query.title;
  var condition = title ? { title: { [Op.like]: `%${title}%` } } : null;

  const {rows, count} = Product.findAndCountAll({ where: condition }).then(data => {
    console.log("data ", rows);
    return res.json({
      total: count,
      page: page,
      pageSize: data.length,
      content: data,
    });
    //res.send(data);
    
  }).catch(err => {
    res.status(500).send({
      message:
        err.message || "Some error have occurred when retrieving the tutorials."
    });
  });

  //console.log("request  ", req);
  console.log("data ", rows);
  console.log("in products ", Product);

  /*Product.find()
    .sort({ update_at: -1 })
    .skip(page * limit) //Notice here
    .limit(limit)
    // eslint-disable-next-line consistent-return
    .exec((err, data) => {
      if (err) {
        return res.status(400).send({
          status: "ERR_SERVER",
          message: err.message,
          content: null,
        });
      }
      Product.countDocuments().exec((count_error, count) => {
        if (err) {
          return res.json(count_error);
        }
        return res.json({
          total: count,
          page: page,
          pageSize: data.length,
          content: data,
        });
      });
    });*/
};

const product_post = (req, res) => {
  //const host = process.env.HOST_NAME;
  //const filename = req.body.filename.replace(/ +/g, "");
  if (!req.body) {
    return res.status(200).send({
      status: "ERR_REQUEST",
      message: "Please check your request!",
      content: null,
    });
  }

  /*const imageUrl =
    host + "/public/api/static/images/productPictures/" + filename + ".jpg";
  const resizeUrl =
    host +
    "/public/api/static/images/productPictures/" +
    "256x144-" +
    filename +
    ".jpg";*/

  const product = new Product({
    codigo: req.body.codigo,
    nombre: req.body.nombre,
    descripcion: req.body.descripcion,
    precio: req.body.precio,
    cantidad: req.body.cantidad,
    productPicture: req.body.imagen,
    categoria: req.body.categoria
  });
  console.log("new prod ", product);
  return product
    .save()
    .then((data) => {
      console.log("saving  ", data);
      return res.status(200).send({
        status: "OK",
        message: "Added Product Successfully",
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

// eslint-disable-next-line consistent-return
const product_update = async (req, res) => {
  const id = req.params.id;
  const host = process.env.HOST_NAME;
  let filename = "";
  let imageUrl = "";
  let resizeUrl = "";
  if (!req.params.id || !req.body) {
    return res.status(200).send({
      status: "ERR_REQUEST",
      message: "Please check your ID request",
      content: null,
    });
  }
  if (req.file) {
    filename = await req.body.filename.replace(/ +/g, "");
    imageUrl =
      host + "/public/api/static/images/productPictures/" + filename + ".jpg";
    resizeUrl =
      host +
      "/public/api/static/images/productPictures/" +
      "256x144-" +
      filename +
      ".jpg";
  }

  const product = req.file
    ? {
      filename: req.body.filename,
      price: req.body.price,
      color: req.body.color,
      origin: req.body.origin,
      standard: req.body.standard,
      description: req.body.description,
      url: imageUrl,
      thumb: resizeUrl,
      type: req.body.type,
    }
    : req.body;
  console.log(product);
  Product.findByIdAndUpdate(id, product)
    .then((data) => {
      return res.status(200).send({
        status: "OK",
        message: "Updated Product Successfully",
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

const product_delete = (req, res) => {
  const id = req.params.id;
  Product.findByIdAndDelete(id)
    .then((data) => {
      return res.status(200).send({
        status: "OK",
        message: "Deleted Product Successfully",
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

module.exports = {
  product_get,
  product_post,
  product_update,
  product_delete,
};
