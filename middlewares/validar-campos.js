const { validationResult } = require("express-validator");

const validarCampos = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json(errors);
  }

  //si no cayo en el return siga con el siguiente middleware y si no hay entonces con el siguiente controlador
  next();
};

module.exports = {
  validarCampos,
};
