import "./Photo.css";
import { upload } from "../../utils/config";

//components
import Message from "../../components/Message";
import { Link } from "react-router-dom";
import PhotoItem from "../../components/PhotoItem";
import LikeContainer from "../../components/LikeContainer";
import Comentarios from "../../components/Comentarios";
//hooks
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
//redux
import { getPhoto, likePhoto } from "../../slices/photoSlice";

export const Photo = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { photo, loading, error } = useSelector((state) => state.photo);
  // comment
  const [commentText, setCommentText] = useState("");

  useEffect(() => {
    dispatch(getPhoto(id));
  }, [dispatch, id]);
  // like and comment
  const handleLike = () => {
    dispatch(likePhoto(photo._id));
  };

  if (loading) {
    return <p>Loading ...</p>;
  }
  return (
    <div id="photo">
      <PhotoItem photo={photo} />
      <LikeContainer photo={photo} user={user} handleLike={handleLike} />
      <Comentarios photo={photo} user={user} />
    </div>
  );
};

export default Photo;
