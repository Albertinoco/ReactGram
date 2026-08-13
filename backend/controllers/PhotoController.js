const Photo = require("../models/Photos");
const mongoose = require("mongoose");
const User = require("../models/User");
// controllers

// insert photo
const insertPhoto = async (req, res) => {
  try {
    const { title } = req.body;
    const image = req.file.filename;
    const reqUsr = req.user;

    const user = await User.findById(reqUsr._id);

    const newPhoto = await Photo.create({
      title,
      image,
      userId: user._id,
      userName: user.name,
    });
    // sucess
    if (!newPhoto) {
      return res.status(422).json({
        errors: ["Houve um problema, por favor tente novamente mais tarde."],
      });
    }

    return res
      .status(200)
      .json({ newPhoto, message: "Foto cadastrada com sucesso!" });
  } catch (error) {
    console.error("Error inserting photo:", error);
    return res
      .status(500)
      .json({ errors: ["Erro ao cadastrar a foto. Tente novamente."] });
  }
};

// remove photo
const deletePhoto = async (req, res) => {
  try {
    const { id } = req.params;
    const reqUsr = req.user;

    if (!reqUsr || !reqUsr._id) {
      return res.status(401).json({ errors: ["Você precisa estar autenticado."] });
    }

    const photo = await Photo.findById(id);

    if (!photo) {
      return res.status(404).json({ errors: ["Foto não encontrada."] });
    }

    const photoOwnerId = photo.userId?.toString();
    const currentUserId = reqUsr._id.toString();

    if (photoOwnerId !== currentUserId) {
      return res
        .status(401)
        .json({ errors: ["Você não tem permissão para deletar esta foto."] });
    }

    await Photo.findByIdAndDelete(photo._id);

    return res.status(200).json({ message: "Foto deletada com sucesso." });
  } catch (error) {
    console.error("Delete photo error:", error);
    return res
      .status(500)
      .json({ errors: ["Erro ao deletar a foto. Tente novamente."] });
  }
};
// get all photos and send to backend

const getAllPhotos = async (req, res) => {
  const photos = await Photo.find({})
    .sort([["createDAt", -1]])
    .exec();
  return res.status(200).json(photos);
};

// get user photos

const getUserPhotos = async (req, res) => {
  const { id } = req.params;
  const photos = await Photo.find({ userId: id })
    .sort([["createAt", -1]])
    .exec();
  return res.status(200).json(photos);
};

// update foto

const updatePhoto = async (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  const reqUser = req.user;
  const photo = await Photo.findById(id);

  if (!photo) {
    res.status(404).json({ errors: ["foto nao encontrada"] });
    return;
  }

  // se a foto pertence
  if (!photo.userId.equals(reqUser._id)) {
    res.status(422).json({ errors: ["ocorreu um erro"] });
    return;
  }

  if (title) {
    photo.title = title;
  }
  await photo.save();
  res.status(200).json({ photo, message: "foto atualizada com sucesso" });
};

// like functionality

const likePhoto = async (req, res) => {
  const { id } = req.params;
  const reqUser = req.user;
  const photo = await Photo.findById(id);
  if (!photo) {
    res.status(404).json({ errors: ["foto nao encontrada"] });
    return;
  }
  // se o usuario ja deu like

  if (photo.likes.includes(reqUser._id)) {
    res.status(422).json({ errors: [""] });
    return;
  }
  photo.likes.push(reqUser._id);
  photo.save();
  res.status(200).json({ photoIde: id, userId: reqUser._id, message: "liked" });
};

// coment functionality

const commentPhoto = async (req, res) => {
  const { id } = req.params;
  const { comment } = req.body;
  const reqUser = req.user;
  const user = await User.findById(reqUser._id);
  const photo = await Photo.findById(id);

  if (!photo) {
    res.status(404).json({ errors: ["foto nao encontrada"] });
    return;
  }
  // put comment
  const userComment = {
    comment,
    userName: user.name,
    userImage: user.profileImage,
    userId: user._id,
  };
  photo.comments.push(userComment);

  await photo.save();
  res.status(200).json({ comment: userComment, message: "done" });
};

// search by title

const searchPhotos = async (req, res) => {
  const { q } = req.query;
  const photos = await Photo.find({ title: new RegExp(q, "i") }).exec();

  res.status(200).json(photos);
};

module.exports = {
  insertPhoto,
  deletePhoto,
  getAllPhotos,
  getUserPhotos,
  updatePhoto,
  likePhoto,
  commentPhoto,
  searchPhotos,
};
