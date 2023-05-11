const { response, json } = require("express");
const bcryptjs = require("bcryptjs");
const Usuario = require("../models/usuario");
const { generarJWT } = require("../helpers/generarJWT");
const { googleVerify } = require("../helpers/google-verify");
const usuario = require("../models/usuario");
const { DefaultTransporter } = require("google-auth-library");

const login = async (req, res = response) => {
  const { correo, password } = req.body;

  try {
    const usuario = await Usuario.findOne({ correo });

    //verificar si el correo existe
    if (!usuario) {
      return res.status(400).json({
        msg: "Usuario/Password no son correctos - correo",
      });
    }

    //verificar si el usuario esta activo en la bd
    if (!usuario.estado) {
      return res.status(400).json({
        msg: "Usuario/Password no son correctos - estado:false",
      });
    }

    //verificar la contrasena
    const validPassword = bcryptjs.compareSync(password, usuario.password);
    if (!validPassword) {
      return res.status(400).json({
        msg: "Usuario/Password no son correctos - password",
      });
    }

    //generar el JWT
    const token = await generarJWT(usuario.id);

    res.json({
      usuario,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Algo Salio mal",
    });
  }
};

const googleSignIn = async (req, res = response) => {
  const { id_token } = req.body;
  let usuario;

  try {
    const { correo, nombre, img } = await googleVerify(id_token);

    usuario = await Usuario.findOne({ correo });

    if (!usuario) {
      //crear el usuario si no existe
      const data = {
        nombre,
        correo,
        password: "123456",
        img,
        google: true,
        rol: "ADMIN_ROLE",
      };
      usuario = new Usuario(data);
      await usuario.save();
    }

    //Si el usuario en BD
    if (!usuario.estado) {
      return res.status(401).json({
        msg: "Hable con el administrado-usuario bloqueado",
      });
    }

    //generar el jwt
    const token = await generarJWT(usuario.id);

    res.json({
      usuario,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      ok: false,
      msg: "El token no se pudo verificar",
      error,
    });
  }
};

module.exports = {
  login,
  googleSignIn,
};
