const { Categoria, Producto } = require("../models");
const Role = require("../models/role");
const Usuario = require("../models/usuario");

const esRoleValido = async (rol = "") => {
  const existeRol = await Role.findOne({ rol });
  if (!existeRol) {
    throw new Error(`El rol ${rol} no esta registrado en la BD`);
  }
};

const emailExiste = async (correo = "") => {
  const existeEmail = await Usuario.findOne({ correo: correo });
  if (existeEmail) {
    throw new Error(`El correo ${correo} ya esta registrado`);
  }
};
const usuarioExistePorID = async (id) => {
  const existe = await Usuario.findById(id);
  if (!existe) {
    throw new Error(`El ID: ${id} no existe`);
  }
};

//validators de categorias

const existeCategoriaPorId = async (id) => {
  const existeCategoria = await Categoria.findById(id);
  if (!existeCategoria) {
    throw new Error(`El ID: ${id} no existe`);
  }
};
const existeProductoPorId = async (id) => {
  const existeProducto = await Producto.findById(id);
  if (!existeProducto) {
    throw new Error(`El ID: ${id} no existe`);
  }
};

// Validar las colecciones permitidas

const coleccionesPermitidas = (coleccion = "", colecciones = []) => {
  const incluida = colecciones.includes(coleccion);
  if (!incluida) {
    throw new Error(
      `La coleccion ${coleccion} no es permitida,  ${colecciones}`
    );
  }
  return true;
};

module.exports = {
  esRoleValido,
  emailExiste,
  usuarioExistePorID,
  existeCategoriaPorId,
  existeProductoPorId,
  coleccionesPermitidas,
};
