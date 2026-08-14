import "./Profile.css";
import { upload } from "../../utils/config";
import Message from "../../components/Message";
import { Link } from "react-router-dom";
import { BsFillEyeFill, BsPencilFill, BsXLg } from "react-icons/bs";
import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import {
  getUserDetails,
  resetMessage,
  updateProfile,
} from "../../slices/userSlice";
import {
  uploadPhoto,
  getUserPhotos,
  deletePhoto,
  updatePhoto,
} from "../../slices/photoSlice";

const Profile = () => {
  const dispatch = useDispatch();
  const { id } = useParams();

  // dados do userSlice(usuário que está sendo visualizado)
  const { user, loading } = useSelector((state) => state.user);
  // dados do authSlice(usuário autenticado)
  const { user: userAuth } = useSelector((state) => state.auth);
  // dados do photoSlice(fotos do usuário)
  const {
    photos,
    uploadLoading,
    error: photoError,
    message: photoMessage,
  } = useSelector((state) => state.photo);

  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [showEmptyMessage, setShowEmptyMessage] = useState(false);
  const [editImage, setEditImage] = useState("");
  const [editedTitle, setEditedTitle] = useState("");
  const [editId, setEditId] = useState("");

  const newFormRef = useRef();
  const editFormRef = useRef();

  useEffect(() => {
    const userId = id || userAuth?._id;
    if (userId) {
      dispatch(getUserDetails(userId));
      dispatch(getUserPhotos(userId));
    }
  }, [dispatch, id, userAuth]);

  const handleFile = (e) => {
    const image = e.target.files[0];
    setImage(image);
  };

  const submitHandle = async (e) => {
    e.preventDefault();

    if (!image) {
      setShowEmptyMessage(true);
      return;
    }

    const titleToSend =
      title && title.trim().length >= 3 ? title.trim() : "Untitled";

    const formData = new FormData();
    formData.append("title", titleToSend);
    formData.append("image", image);

    try {
      // dispatch and unwrap to catch errors from the thunk
      await dispatch(uploadPhoto(formData)).unwrap();

      const userId = id || userAuth?._id;
      if (userId) {
        dispatch(getUserPhotos(userId));
      }

      setTitle("");
      setImage("");
      setShowEmptyMessage(false);
    } catch (err) {
      console.error("Upload photo error:", err);
    } finally {
      setTimeout(() => {
        dispatch(resetMessage());
      }, 2000);
    }
  };
  // show or hide forms
  const hideOrShowForms = () => {
    newFormRef.current.classList.toggle("hide");
    editFormRef.current.classList.toggle("hide");
  };
  // update photo
  const handleUpdate = async (e) => {
    e.preventDefault();
    const photoData = { title: editedTitle, id: editId };
    dispatch(updatePhoto(photoData));
    setTimeout(() => {
      dispatch(resetMessage());
    }, 2000);
  };

  const handleCancelEdit = () => {
    hideOrShowForms();
  };

  if (loading) {
    return <p className="profile-loading">Loading...</p>;
  }
  const handleEdit = (photo) => {
    if (editFormRef.current.classList.contains("hide")) {
      hideOrShowForms();
    }
    setEditId(photo._id);
    setEditedTitle(photo.title);

    setEditImage(photo.image);
  };

  const handleDelete = (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(deletePhoto(id));
    setTimeout(() => {
      dispatch(resetMessage());
    }, 2000);
  };
  const isOwnProfile = !id || id === userAuth?._id;

  return (
    <div id="profile" className="profile-page">
      <div className="profile-card">
        <div className="profile-header">
          <div>
            <span className="profile-badge">Profile</span>
            <h1 className="profile-title">Profile</h1>
            <p className="profile-subtitle">User account information</p>
          </div>
        </div>

        {user?._id ? (
          <div className="profile-meta">
            <div className="profile-info">
              <span className="profile-label">Name</span>
              <p className="profile-value">{user.name}</p>
            </div>
            <div className="profile-info">
              <span className="profile-label">Email</span>
              <p className="profile-value">{user.email}</p>
            </div>
            <div className="profile-info">
              <span className="profile-label">Bio</span>
              <p className="profile-value">{user.bio || "No bio provided."}</p>
            </div>
          </div>
        ) : (
          <p className="profile-empty">No user found.</p>
        )}
      </div>

      {isOwnProfile && (
        <div className="profile-actions" ref={newFormRef}>
          <div className="edit-photo hide" ref={editFormRef}>
            <p>Editing: </p>
            {editImage && (
              <img src={`${upload}/photos/${editImage}`} alt={editedTitle} />
            )}
            <form onSubmit={handleUpdate} className="edit-photo-form">
              <input
                type="text"
                id="edit-title"
                placeholder="Enter a title..."
                onChange={(e) => setEditedTitle(e.target.value)}
                value={editedTitle || ""}
              />
              <input type="submit" disabled value="Update" />
              <button className="edit-photo-cancel" onClick={handleCancelEdit}>
                Cancel the edit
              </button>
            </form>
          </div>
          <h3>Share some good moments!</h3>
          <form onSubmit={submitHandle} className="profile-post-form">
            <label htmlFor="post-content">
              What's on your mind?
              <input
                type="text"
                id="post-content"
                placeholder="Write your post..."
                onChange={(e) => setTitle(e.target.value)}
                value={title || ""}
              />
            </label>
            <label htmlFor="post-image">
              Upload an image:
              <input type="file" id="post-image" onChange={handleFile} />
            </label>
            {!uploadLoading && <button type="submit">Post</button>}
            {uploadLoading && (
              <button type="submit" disabled>
                Posting...
              </button>
            )}
          </form>
          {photoError && <Message msg={photoError} type="error" />}
          {photoMessage && <Message msg={photoMessage} type="success" />}
          {showEmptyMessage && (
            <p className="profile-empty">
              Please select an image before posting.
            </p>
          )}
        </div>
      )}

      <div className="profile-photos">
        <h2>Published Photos</h2>
        <div className="photo-container">
          {photos && photos.length > 0 ? (
            photos.map((photo) => (
              <div className="photos" key={photo._id}>
                {photo.image && (
                  <img
                    src={`${upload}/photos/${photo.image}`}
                    alt={photo.title}
                  />
                )}

                {isOwnProfile ? (
                  <div className="photo-actions">
                    <button
                      type="button"
                      className="photo-action-btn edit"
                      onClick={() => handleEdit(photo)}
                      aria-label="Edit photo"
                    >
                      <BsPencilFill />
                    </button>
                    <button
                      type="button"
                      className="photo-action-btn delete"
                      onClick={(e) => handleDelete(e, photo._id)}
                      aria-label="Delete photo"
                    >
                      <BsXLg />
                    </button>
                  </div>
                ) : (
                  <Link
                    className="profile-photo-link"
                    to={`/photos/${photo._id}`}
                    aria-label="View photo"
                  >
                    <BsFillEyeFill />
                  </Link>
                )}
              </div>
            ))
          ) : (
            <p className="profile-empty">No photos found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
