import "./EditProfile.css";
import { upload } from "../../utils/config";
// hooks
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getUserDetails,
  resetMessage,
  updateProfile,
} from "../../slices/userSlice";

// components
import Message from "../../components/Message";

const EditProfile = () => {
  const dispatch = useDispatch();
  const { user, loading, error, messageSuccess } = useSelector(
    (state) => state.user,
  );
  const { user: userAuth } = useSelector((state) => state.auth);

  // states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [bio, setBio] = useState("");
  const [previewImage, setPreviewImage] = useState("");

  // load user data by authenticated user id
  useEffect(() => {
    if (userAuth?._id) {
      dispatch(getUserDetails(userAuth._id));
    }
  }, [dispatch, userAuth]);

  useEffect(() => {
    if (user?._id) {
      setName(user.name || "");
      setEmail(user.email || "");
      setBio(user.bio || "");
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userData = { name };
    if (profileImage) userData.profileImage = profileImage;
    if (bio) userData.bio = bio;
    if (password) userData.password = password;

    const formData = new FormData();
    Object.keys(userData).forEach((key) => {
      formData.append(key, userData[key]);
    });

    await dispatch(updateProfile(formData));

    setTimeout(() => {
      dispatch(resetMessage());
    }, 2000);
  };

  const handleFile = (e) => {
    const image = e.target.files?.[0];
    if (!image) return;

    setPreviewImage(image);
    setProfileImage(image);
  };

  const currentProfileImage = previewImage
    ? URL.createObjectURL(previewImage)
    : user?.profileImage
      ? `${upload}/users/${user.profileImage}`
      : null;

  return (
    <div className="edit-profile-page">
      <div className="edit-profile-card">
        <div className="edit-profile-header">
          <span className="edit-profile-badge">Edit Profile</span>
          <h2 className="edit-profile-title">Personal details</h2>
          <p className="edit-profile-subtitle">
            Update your information and keep your profile fresh.
          </p>
          {currentProfileImage && (
            <div className="edit-profile-image-preview">
              <img src={currentProfileImage} alt="Profile Preview" />
            </div>
          )}
        </div>

        <form className="edit-profile-form" onSubmit={handleSubmit}>
          <div className="edit-profile-field">
            <label className="edit-profile-label" htmlFor="name">
              Name
            </label>
            <input
              className="edit-profile-input"
              id="name"
              type="text"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="edit-profile-field">
            <label className="edit-profile-label" htmlFor="email">
              Email
            </label>
            <input
              className="edit-profile-input"
              id="email"
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled
            />
          </div>

          <div className="edit-profile-field">
            <label className="edit-profile-label" htmlFor="profilePicture">
              Profile Picture
            </label>
            <input
              className="edit-profile-file"
              id="profilePicture"
              type="file"
              name="profilePicture"
              onChange={handleFile}
            />
          </div>

          <div className="edit-profile-field">
            <label className="edit-profile-label" htmlFor="biography">
              Biography
            </label>
            <textarea
              className="edit-profile-textarea"
              id="biography"
              name="biography"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            ></textarea>
          </div>

          <label className="edit-profile-checkbox">
            <input type="checkbox" name="changePassword" />
            <span>Do you want to change your password?</span>
          </label>

          <button
            className="edit-profile-button"
            type="submit"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
          {error && <Message msg={error} type="error" />}
          {messageSuccess && <Message msg={messageSuccess} type="success" />}
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
