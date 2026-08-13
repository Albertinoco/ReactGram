const mongoose = require("mongoose");
const User = require("../models/User");
// para encriptar a senha
const bcrypt = require("bcryptjs");
// para gerar token de autenticação
const jwt = require("jsonwebtoken");
// segredo para gerar token, deve ser uma string longa e difícil de adivinhar,
// e deve ser mantida em segredo
const jwtSecret = process.env.JWT_SECRET;
// para gerar token de autenticação, precisamos do id do usuário e do segredo
// gerar token
const generateToken = (id) => {
  return jwt.sign({ id }, jwtSecret, {
    expiresIn: "7d",
  });
};

// registrar usuário
const register = async (req, res) => {
  // lógica para registrar usuário
  const { name, email, password } = req.body;
  // verificar se o usuário já existe
  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: "User already exists" });
  }
  // gerar hash da senha
  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(password, salt);
  // criar usuário
  const newUser = await User.create({
    name,
    email,
    password: hashedPassword,
  });
  // if user created successfully, return token
  if (newUser) {
    return res.status(201).json({
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      token: generateToken(newUser._id),
    });
  } else {
    return res.status(400).json({ message: "Invalid user data" });
  }
};

const login = async (req, res) => {
  // lógica para login de usuário
  const { email, password } = req.body;
  // verificar se o usuário existe
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // verificar se a senha está correta
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  // gerar token
  const token = generateToken(user._id);

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    token,
  });
};
// get current user
const getCurrentUser = (req, res) => {
  const user = req.user;
  res.status(200).json(user);
};
// update user profile

const update = async (req, res) => {
  try {
    const { name, password, bio } = req.body;
    const reqUser = req.user;

    const userToUpdate = await User.findById(reqUser._id).select("-password");

    if (!userToUpdate) {
      return res.status(404).json({ message: "User not found" });
    }

    if (name) {
      userToUpdate.name = name;
    }
    if (password) {
      const salt = await bcrypt.genSalt();
      const passwordHash = await bcrypt.hash(password, salt);
      userToUpdate.password = passwordHash;
    }
    if (req.file) {
      userToUpdate.profileImage = req.file.filename;
    }
    if (bio) {
      userToUpdate.bio = bio;
    }

    await userToUpdate.save();
    return res.status(200).json(userToUpdate);
  } catch (error) {
    console.error("Update user error:", error);
    return res.status(500).json({ message: "Error updating user profile" });
  }
};
// get user by id
// get user by id
const getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const userFound = await User.findById(id).select("-password");

    if (!userFound) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(userFound);
  } catch (error) {
    // Isso aqui só será chamado se algo estiver muito errado com a base de dados
    return res.status(400).json({ message: "Invalid user ID format" });
  }
};
module.exports = {
  register,
  login,
  getCurrentUser,
  update,
  getUserById,
};
