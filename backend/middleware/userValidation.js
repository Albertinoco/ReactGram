const { body } = require("express-validator");
const userCreateValidation = () => {
  return [
    body("name")
      .isString()
      .withMessage("Name is required")
      .isLength({ min: 3 })
      .withMessage("Name must be at least 3 characters long"),
    body("email").isEmail().withMessage("Email is required").normalizeEmail(),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
    body("confirmPassword")
      .isString()
      .withMessage("Confirm Password is required")
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error("Passwords do not match");
        }
        return true;
      }),
  ];
};
// validação para o cadastro do usuário, onde verificamos se o nome é uma string, se o email é válido e se a senha tem pelo menos 6 caracteres, além de verificar se a confirmação da senha é igual à senha.

const loginValidation = () => {
  return [
    body("email")
      .isString()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Invalid email format"),
    body("password")
      .isString()
      .withMessage("Password is required")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
  ];
};
const userUpdateValidation = () => {
  return [
    body("name")
      .optional()
      .isString()
      .withMessage("Name must be a string")
      .isLength({ min: 3 })
      .withMessage("Name must be at least 3 characters long"),
    body("password")
      .optional()
      .isString()
      .withMessage("Password must be a string")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
  ];
};

module.exports = {
  userCreateValidation,
  loginValidation,
  userUpdateValidation,
};
