import "./Auth.css";
// components

import { Link } from "react-router-dom";

//Hooks
import { useState, useEffect, use } from "react";
import { useSelector, useDispatch } from "react-redux";
//redux
import { register, reset } from "../../slices/authSlice";
import Message from "../../components/Message";
const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const dispatch = useDispatch();
  const { loading, error, successMessage } = useSelector((state) => state.auth);

  const handleSubmit = (e) => {
    e.preventDefault();

    const user = {
      name,
      email,
      password,
      confirmPassword,
    };

    dispatch(register(user));
    setName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  };
  // clean all auth states
  useEffect(() => {
    dispatch(reset());
  }, [dispatch]);

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">ReactGram</div>
        <h2 className="auth-title">Create your account</h2>
        <p className="auth-subtitle">Sign up to see updated status.</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-field">
            <label htmlFor="name" className="auth-label">
              Name
            </label>
            <input
              type="text"
              id="name"
              placeholder="Enter your name"
              className="auth-input"
              onChange={(e) => {
                setName(e.target.value);
              }}
              value={name}
            />
          </div>
          <div className="auth-field">
            <label htmlFor="email" className="auth-label">
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              className="auth-input"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
          </div>
          <div className="auth-field">
            <label htmlFor="password" className="auth-label">
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="Your password"
              className="auth-input"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
          </div>
          <div className="auth-field">
            <label htmlFor="confirmPassword" className="auth-label">
              Confirm password
            </label>
            <input
              type="password"
              id="confirmPassword"
              placeholder="Confirm your password"
              className="auth-input"
              onChange={(e) => setConfirmPassword(e.target.value)}
              value={confirmPassword}
            />
          </div>
          {!loading && (
            <button type="submit" className="auth-button">
              Register
            </button>
          )}
          {loading && <input type="submit" value="Aguarde" disabled />}
          {error && <Message msg={error} type="error" />}
          {successMessage && <Message msg={successMessage} type="success" />}
        </form>
        <p className="auth-switch">
          Already have an account? <Link to="/login">Click here</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
