/* eslint-disable consistent-return */
const db = require("../models");
const User = db.users;
const {
  registerValidation,
  loginValidation,
  editUserValidation,
} = require('../middlewares/validation');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {
  transporter,
  getPasswordResetURL,
  resetPasswordTemplate,
  registerUserTemplate,
} = require('../middlewares/emailTemplate');
const usePasswordHashToMakeToken = require('../middlewares/createUserToken');
const pushNotification = require('../middlewares/pushNotification');

const user_register = async (req, res) => {
  //validation
  const { error } = registerValidation(req.body);
  //console.log("error ", error);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  //check email if exist
  const emailExist = await User.findOne({where: { email: req.body.email }});
  if (emailExist) {
    return res.status(400).send({ err: 'The email already exists' });
  }
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(req.body.password, salt);
  const user = new User({
    nombre: req.body.nombre,
    apellido: req.body.apellido,
    cedula: req.body.cedula,
    email: req.body.email.toLowerCase(),
    password: hashedPassword,
    pushTokens: req.body.pushTokens,
    phone: '',
    direccion: '',
    profilePicture: '',
  });
  try {
    const resUser = await user.save();
    const sendEmail = () => {
      transporter.sendMail(registerUserTemplate(resUser), (err, info) => {
        if (err) {
          //res.status(500).send({ err: 'Error sending email' });
          console.log(`** error sent **`, err, info);
        } else {
          console.log(`** Email sent **`, info);
        }
      });
    };
    sendEmail();
    res.status(200).json(resUser);
  } catch (err) {
    res.status(400).send(err);
  }
};

const user_login = async (req, res) => {
  const { error } = loginValidation(req.body);
  const email = req.body.email.toLowerCase();
  const { password } = req.body;
  //const pushTokens = req.body.pushTokens;
  const pushTokens = [];

  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  //admin login
  if (
    email === process.env.DEFAULT_ADMINNAME &&
    password === process.env.DEFAULT_PASSWORD
  ) {
    jwt.sign(
      { name: 'admin' },
      process.env.SECRET_TOKEN,
      { expiresIn: '3600s' },
      (err, token) => {
        if (err) {
          return res.status(400).err;
        }
        res.header('auth-token', token).send({
          name: 'admin',
          token: token,
          loginAt: Date.now(),
          expireTime: Date.now() + 60 * 60 * 1000,
        });
      },
    );
  } else {
    //user account
    const user = await User.findOne({where: { email: email }});
    //console.log("user ", user.id);
    if (!user) {
      return res.status(400).send({ err: 'Email o contraseña incorectos' });
    }
    const passMatching = await bcrypt.compare(password, user.password);
    if (!passMatching) {
      return res.status(400).send({ err: 'Email o contraseña incorectos' });
    }
    let checkPushToken;
    if (pushTokens.length > 0) {
      const check = user.pushTokens.some((userPushToken) => {
        return userPushToken === pushTokens[0];
      });
      checkPushToken = check;
    }
    if (checkPushToken !== undefined) {
      user.pushTokens.push(pushTokens[0]);
      await user.save();
    }
    try {
      jwt.sign(
        { userId: user.id },
        process.env.SECRET_TOKEN,
        { expiresIn: '3600s' },
        (err, token) => {
          if (err) {
            return res.status(400).err;
          }
          return res.status(200).send({
            id: user.id,
            nombre: user.nombre,
            password,
            email: user.email,
            phone: user.phone,
            direccion: user.direccion,
            profilePicture: user.profilePicture,
            token: token,
            loginAt: Date.now(),
            expireTime: Date.now() + 60 * 60 * 1000,
          });
        },
      );
    } catch (err) {
      res.status(400).send(err);
    }
  }
};

const user_edit = async(req, res) => {
  //validation
  const { error } = editUserValidation(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const { id } = req.params;
  const new_data = req.body;

  const user = await User.findOne({where: { id: id }});

  if (!user) {
    return res.status(400).send({ err: 'Usuario no existente' });
  }

  user.set(new_data);

  //saving the changes
  user.save();
  return res.status(200).send({ success: 'Usuario actualizado' });
  
};

const user_photoUpload = (req, res) => {
  const host = process.env.HOST_NAME;
  const { id } = req.params;
  console.log(req.body);

  if (!req.body || !req.file) {
    return res.status(200).send({
      status: 'ERR_REQUEST',
      message: 'Please check your request!',
      content: null,
    });
  } else {
    const imageUrl =
      host + '/public/api/static/images/userprofile/' + id + '.jpg';
    User.findOneAndUpdate({ _id: id }, { profilePicture: imageUrl })
      .then((result) => {
        return res.status(200).send('Uploaded profile picture');
      })
      .catch((err) => {
        res.status(400).send(err);
      });
  }
};

const user_resetpw = async (req, res) => {
  const email = req.body.email.toLowerCase();
  if (!email) {
    return res.status(400).send({ err: 'Email is wrong' });
  }
  let user;
  try {
    user = await User.findOne({ email });
  } catch (err) {
    res.status(404).send({ err: 'Email is not exist' });
  }
  const token = usePasswordHashToMakeToken(user);
  const url = getPasswordResetURL(user, token);
  const emailTemplate = resetPasswordTemplate(user, url);
  const sendEmail = () => {
    transporter.sendMail(emailTemplate, (err, info) => {
      if (err) {
        res.status(500).send({ err: 'Error sending email' });
      } else {
        console.log(`** Email sent **`, info);
        res.send({ res: 'Sent reset Email' });
      }
    });
  };

  sendEmail();
};
const user_receivepw = async (req, res) => {
  const { userId, token } = req.params;
  const { password } = req.body;
  let content = {
    title: 'Security',
    body: `Reset Password Successfully.`,
  };
  // highlight-start
  const user = await User.findOne({ _id: userId });
  if (!user) {
    res.status(404).send({ err: 'Invalid user' });
  }
  const secret = user.password + '-' + user.createdAt;
  const payload = jwt.decode(token, secret);
  console.log(payload);
  if (payload._id === userId) {
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
    try {
      const updateUser = await User.findOneAndUpdate(
        { _id: userId },
        { password: hashedPassword },
      );
      pushNotification(updateUser.pushTokens, content, ''),
        res.status(202).send('Password is changed');
    } catch (err) {
      res.status(500).send({ err });
    }
  } else {
    res.status(500).send({ err: 'Token is invalid' });
  }
};

module.exports = {
  user_register,
  user_login,
  user_resetpw,
  user_receivepw,
  user_edit,
  user_photoUpload,
};
