const { Router } = require("express");
const { check } = require("express-validator");
const {
  obtenerProductos,
  obtenerProducto,
  crearProducto,
  actualizarProducto,
  borrarProducto,
} = require("../controllers/productos");

const { existeProductoPorId } = require("../helpers/db-validators");
const { validarCampos, validarJWT, esAdminRole } = require("../middlewares");

const router = Router();

//Endpoints

//obtener todas los productos -publico
router.get("/", obtenerProductos);

//obtener un prodcuto por id-publico
router.get(
  "/:id",
  [
    check("id", "No es un id de mongo valido").isMongoId(),
    check("id").custom(existeProductoPorId),
    validarCampos,
  ],
  obtenerProducto
);

//crear nueva categoria - privado - cualquier persona con un token valido

router.post(
  "/",
  [
    validarJWT,
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    validarCampos,
  ],
  crearProducto
);

//actualizar - privado cualquiera con token

router.put(
  "/:id",
  [
    validarJWT,
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("id").custom(existeProductoPorId),
    validarCampos,
  ],
  actualizarProducto
);

//borrar una categoria- admin

router.delete(
  "/:id",
  [
    validarJWT,
    esAdminRole,
    check("id", "No es un id de mongo valido").isMongoId(),
    check("id").custom(existeProductoPorId),
    validarCampos,
  ],
  borrarProducto
);

module.exports = router;
