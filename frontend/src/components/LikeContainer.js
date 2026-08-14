import "./LikeContainer.css";
import { BsHeart, BsHeartFill } from "react-icons/bs";
export const LikeContainer = ({ photo, user, handleLike }) => {
  const likes = photo.likes ?? photo.likes?.likePhotos ?? [];
  const userId = user?.id ?? null;
  const userLiked = userId ? likes.includes(userId) : false;
  return (
    <div className="like">
      {userLiked ? (
        <BsHeart onClick={() => handleLike(photo._id)} />
      ) : (
        <BsHeartFill onClick={() => handleLike(photo._id)} />
      )}
      <p>{photo.likes.length} like(s)</p>
    </div>
  );
};

export default LikeContainer;
