import "./Comentarios.css";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { commentPhoto } from "../slices/photoSlice";
import { upload } from "../utils/config";

export const Comentarios = ({ photo: propPhoto }) => {
  const dispatch = useDispatch();
  const statePhoto = useSelector((state) => state.photo.photo);
  const photo = propPhoto || statePhoto;
  const [commentText, setCommentText] = useState("");

  const handleComment = (e) => {
    e.preventDefault();

    if (!commentText.trim() || !photo?._id) return;

    const payload = {
      id: photo._id,
      comment: commentText,
    };

    dispatch(commentPhoto(payload));
    setCommentText("");
  };

  const comments = photo?.comments || [];

  return (
    <div className="comentarios">
      <div className="comentarios__header">
        <h3>Comments ({comments.length})</h3>
      </div>

      <form className="comentarios__form" onSubmit={handleComment}>
        <input
          type="text"
          placeholder="Write a comment"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
        />
        <button type="submit">Comment</button>
      </form>

      {comments.length === 0 ? (
        <p className="comentarios__empty">There are no comments yet.</p>
      ) : (
        <div className="comentarios__list">
          {comments.map((comment, index) => (
            <article
              className="comment"
              key={`${comment.userId || "user"}-${index}`}
            >
              <div className="comment__author">
                {comment.userImage ? (
                  <img
                    src={`${upload}/users/${comment.userImage}`}
                    alt={comment.userName || "User"}
                  />
                ) : (
                  <div className="comment__avatar" />
                )}
                <div className="comment__meta">
                  <Link to={`/users/${comment.userId}`}>
                    {comment.userName || "User"}
                  </Link>
                  <span>commented</span>
                </div>
              </div>
              <p className="comment__text">{comment.comment}</p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default Comentarios;
