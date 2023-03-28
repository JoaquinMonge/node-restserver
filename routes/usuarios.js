const { Router } = require("express");
const { check } = require("express-validator");
const {
  esRoleValido,
  emailExiste,
  usuarioExistePorID,
} = require("../helpers/db-validators");

const { validarCampos } = require("../middlewares/validar-campos");

const router = Router();

const {
  usuariosGet,
  usuariosPost,
  usuariosDelete,
  usuariosPatch,
  usuariosPut,
} = require("../controllers/usuarios");

router.get("/", usuariosGet);
router.put(
  "/:id",
  [
    check("id", "No es un ID valido").isMongoId(),
    check("id").custom(usuarioExistePorID),
    check("rol").custom(esRoleValido),
    validarCampos,
  ],
  usuariosPut
);
router.post(
  "/",
  [
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check(
      "password",
      "El password es obligatorio y debe ser de mas de 6 letras"
    ).isLength({ min: 6 }),

    check("correo", "El correo no es valido").isEmail(),
    check("correo").custom(emailExiste),
    // check("rol", "No es un rol valido").isIn(["ADMIN_ROLE", "USER_ROLE"]),
    check("rol").custom((rol) => esRoleValido(rol)),
    validarCampos,
  ],
  usuariosPost
);
router.delete(
  "/:id",
  [
    check("id", "No es un ID valido").isMongoId(),
    check("id").custom(usuarioExistePorID),
    validarCampos,
  ],
  usuariosDelete
);
router.patch("/", usuariosPatch);

module.exports = router;
