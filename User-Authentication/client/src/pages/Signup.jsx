import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useCookies } from "react-cookie";

const Signup = () => {
  const navigate = useNavigate();
  const [cookies] = useCookies([]);
  const [inputValue, setInputValue] = useState({
    email: "",
    password: "",
    username: "",
  });

  // Check if user is already logged in
  useEffect(() => {
    if (cookies.token) {
      navigate("/");
    }
  }, [cookies, navigate]);

  const { email, password, username } = inputValue;
  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setInputValue({
      ...inputValue,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        "http://localhost:4000/signup",
        {
          ...inputValue,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (data.success) {
        navigate("/", { replace: true });
      }
    } catch (error) {
      // Silently handle the error without showing toast
      console.error("Signup error:", error);
    }

    setInputValue({
      email: "",
      password: "",
      username: "",
    });
  };

  return (
    <div className="form_container">
      <h2>Signup Account</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            value={email}
            placeholder="Enter your email"
            onChange={handleOnChange}
            required
          />
        </div>
        <div>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            name="username"
            value={username}
            placeholder="Enter your username"
            onChange={handleOnChange}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            value={password}
            placeholder="Enter your password"
            onChange={handleOnChange}
            required
          />
        </div>
        <button type="submit">Submit</button>
        <span>
          Already have an account? <Link to={"/login"}>Login</Link>
        </span>
      </form>
    </div>
  );
};

export default Signup;
