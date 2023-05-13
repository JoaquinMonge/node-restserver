const { Router } = require("express");
const { check } = require("express-validator");
const {
  crearCategoria,
  obtenerCategorias,
  obtenerCategoria,
  actualizarCategoria,
  borrarCategoria,
} = require("../controllers/categorias");
const { existeCategoriaPorId } = require("../helpers/db-validators");
const { validarJWT, validarCampos, esAdminRole } = require("../middlewares");

const router = Router();

//{{url}}/api/categorias

//ENDPOINTS

//obtener todas las categorias - publico
router.get("/", obtenerCategorias);

//obtener una categoria por id - publico
router.get(
  "/:id",
  [
    check("id", "No es un id de mongo valido").isMongoId(),
    check("id").custom(existeCategoriaPorId),
    validarCampos,
  ],
  obtenerCategoria
);

//crear nueva categoria - privado- cualquier persona con un token valido
router.post(
  "/",
  [
    validarJWT,
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    validarCampos,
  ],
  crearCategoria
);

// Actualizar - privado, cualquiera con token
router.put(
  "/:id",
  [
    validarJWT,
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("id").custom(existeCategoriaPorId),
    validarCampos,
  ],
  actualizarCategoria
);

//borrar una categoria - admin
router.delete(
  "/:id",
  [
    validarJWT,
    esAdminRole,
    check("id", "No es un id de mongo valido").isMongoId(),
    check("id").custom(existeCategoriaPorId),
    validarCampos,
  ],
  borrarCategoria
);

module.exports = router;
