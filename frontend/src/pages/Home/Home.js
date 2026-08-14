import "./Home.css";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { getPhotos } from "../../slices/photoSlice";
import PhotoItem from "../../components/PhotoItem";
import LikeContainer from "../../components/LikeContainer";
import { likePhoto } from "../../slices/photoSlice";
import Comentarios from "../../components/Comentarios";
const Home = () => {
  const { user } = useSelector((state) => state.auth);
  const { photos, loading } = useSelector((state) => state.photo);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getPhotos());
  }, [dispatch]);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <main className="home">
      <section className="home__hero">
        <div className="home__panel home__panel--primary">
          <span className="home__badge">ReactGram</span>
          <h1 className="home__title">
            {user
              ? `Welcome back, ${user.name}!`
              : "Capture every moment in one place."}
          </h1>
          <p className="home__description">
            Share your best photos, discover inspiring profiles, and keep your
            visual feed fresh every day.
          </p>

          <div className="home__actions">
            {!user ? (
              <>
                <Link to="/login" className="home__button home__button--ghost">
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="home__button home__button--solid"
                >
                  Create account
                </Link>
              </>
            ) : (
              <Link
                to={`/users/${user._id || "profile"}`}
                className="home__button home__button--solid"
              >
                View profile
              </Link>
            )}
          </div>
        </div>
      </section>

      <section className="home__grid">
        {photos && photos.length > 0 ? (
          photos.map((photo) => (
            <article key={photo._id} className="home__card">
              <img
                src={`http://localhost:5000/uploads/photos/${photo.image}`}
                alt={photo.title}
              />
              <h2 className="home__card-title">published by {user?.name}</h2>
              <LikeContainer
                photo={photo}
                user={user}
                handleLike={() => dispatch(likePhoto(photo._id))}
              />
              <Comentarios photo={photo} user={user} />
            </article>
          ))
        ) : (
          <p>there are no photos to display</p>
        )}
      </section>
    </main>
  );
};

export default Home;
