import "./Auth.css";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { login, reset } from "../../slices/authSlice";
import Message from "../../components/Message";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const dispatch = useDispatch();

  const { error, successMessage, loading } = useSelector((state) => state.auth);

  const handleSubmit = (e) => {
    e.preventDefault();

    const user = {
      email,
      password,
      name,
    };

    dispatch(login(user));
  };

  useEffect(() => {
    if (successMessage) {
      navigate("/");
    }

    return () => {
      dispatch(reset());
    };
  }, [dispatch, successMessage, navigate]);

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">ReactGram</div>
        <h2 className="auth-title">Sign in</h2>
        <p className="auth-subtitle">Welcome back to your feed.</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-field">
            <label htmlFor="loginName" className="auth-label">
              Name
            </label>
            <input
              type="text"
              id="loginName"
              placeholder="Enter your name"
              className="auth-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="auth-field">
            <label htmlFor="loginEmail" className="auth-label">
              Email
            </label>
            <input
              type="email"
              id="loginEmail"
              placeholder="Enter your email"
              className="auth-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="auth-field">
            <label htmlFor="loginPassword" className="auth-label">
              Password
            </label>
            <input
              type="password"
              id="loginPassword"
              placeholder="Enter your password"
              className="auth-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {!loading ? (
            <button type="submit" className="auth-button">
              Sign in
            </button>
          ) : (
            <button type="submit" className="auth-button" disabled>
              Aguarde...
            </button>
          )}

          {error && <Message msg={error} type="error" />}
          {successMessage && <Message msg={successMessage} type="success" />}
        </form>

        <p className="auth-switch">
          Don't have an account? <Link to="/register">Create one</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
