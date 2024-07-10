// src/Login.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import WarningIcon from '@mui/icons-material/Warning';

const Login = () => {
  const [users, setUsers] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetch("./src/accounts.json")
      .then((response) => response.json())
      .then((data) => setUsers(data))
      .catch((error) => console.error("Error fetching users:", error));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const user = users.find((user) => user.username === username);

    if (user) {
      if (user.password === password) {
        setUsernameError("");
        setPasswordError("");
        navigate("/register", { state: { username } });
      } else {
        setUsernameError("Account exists, Incorrect Password");
        setPasswordError("");
      }
    } else {
      setUsernameError("");
      setPasswordError("Account Credentials are Invalid");
    }
  };

  return (
    <div className="form-Container">
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="username">username</label>
          <input
            type="text"
            id="username"
            className="input-field"
            placeholder="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          {usernameError && (
            <p style={{ color: "red" }}>
              <WarningIcon style={{ verticalAlign: 'middle', marginRight: '5px' }} />
              {usernameError}
            </p>
          )}
        </div>
        <div className="input-group">
          <label htmlFor="password">password</label>
          <input
            type="password"
            id="password"
            className="input-field"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {passwordError && (
            <p style={{ color: "red" }}>
              <WarningIcon style={{ verticalAlign: 'middle', marginRight: '5px' }} />
              {passwordError}
            </p>
          )}
        </div>
        <button type="submit" className="login-button">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
