const { body } = require("express-validator");

const photoCreateValidation = () => {
  return [
    body("title")
      .trim()
      .notEmpty()
      .withMessage("O título é obrigatório")
      .isLength({ min: 3 })
      .withMessage("O título deve ter pelo menos 3 caracteres"),
    body("image").custom((value, { req }) => {
      if (!req.file) {
        throw new Error("A imagem é obrigatória");
      }

      const allowedMimes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/jpg",
      ];
      if (!allowedMimes.includes(req.file.mimetype)) {
        throw new Error("Formato de imagem inválido (jpeg, png ou gif)");
      }

      const maxSize = 5 * 1024 * 1024; // 5MB
      if (req.file.size > maxSize) {
        throw new Error("A imagem não pode ser maior que 5MB");
      }

      return true;
    }),
  ];
};

module.exports = { photoCreateValidation };
