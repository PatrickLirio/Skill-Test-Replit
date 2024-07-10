import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import WarningIcon from "@mui/icons-material/Warning";

const Register = () => {
  const location = useLocation();
  const initialUsername = location.state?.username || "";
  const [username, setUsername] = useState(initialUsername);
  const [password, setPassword] = useState("");
  const [accounts, setAccounts] = useState([]);
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await fetch("./src/accounts.json");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const accountsData = await response.json();
        setAccounts(accountsData);

        const loggedInUser = accountsData.find(
          (account) => account.username === initialUsername
        );

        if (loggedInUser) {
          setPassword(loggedInUser.password);
        }
      } catch (error) {
        console.error("Error fetching accounts:", error);
      }
    };

    fetchAccounts();
  }, [initialUsername]);

  const handleUpdate = (e) => {
    e.preventDefault();

    if (
      username !== initialUsername &&
      accounts.some((account) => account.username === username)
    ) {
      setUsernameError("Username should be unique");
      return;
    } else {
      setUsernameError("");
    }

    const passwordValidation = validatePassword(password);
    if (passwordValidation) {
      setPasswordError(passwordValidation);
      return;
    } else {
      setPasswordError("");
    }

    const updatedAccounts = accounts.map((account) => {
      if (account.username === initialUsername) {
        return { ...account, username, password };
      }
      return account;
    });

    setAccounts(updatedAccounts);
    localStorage.setItem("accounts", JSON.stringify(updatedAccounts));

    alert("Accounts updated successfully");
  };

  const validatePassword = (password) => {
    const errors = [];

    if (password.length < 8) {
      errors.push("at least 8 characters");
    }
    if (!/[A-Z]/.test(password)) {
      errors.push("one uppercase letter");
    }
    if (!/[a-z]/.test(password)) {
      errors.push("one lowercase letter");
    }
    if (!/[0-9]/.test(password)) {
      errors.push("one number");
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push("one symbol");
    }

    if (errors.length > 0) {
      return `Password should have ${errors.join(", ")}.`;
    }

    return "";
  };

  const handleLogout = (e) => {
    e.preventDefault();
    navigate("/");
  };

  return (
    <div className="form-Container">
      <form className="register-form">
        <h2>Hi {initialUsername},</h2>

        <div className="input-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            className="input-field"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          {usernameError && (
            <p style={{ color: "red" }}>
              <WarningIcon
                style={{ verticalAlign: "middle", marginRight: "5px" }}
              />
              {usernameError}
            </p>
          )}
        </div>

        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            className="input-field"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {passwordError && (
            <p style={{ color: "red" }}>
              <WarningIcon
                style={{ verticalAlign: "middle", marginRight: "5px", marginBottom: "5px" }}
              />
              {passwordError}
            </p>
          )}
        </div>

        <div className="button-container">
          <button className="update-button" onClick={handleUpdate}>
            Update Details
          </button>
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </form>
    </div>
  );
};

export default Register;
