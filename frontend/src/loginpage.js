import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./loginpage.css";

const LoginPage = () => {
    const defaultUsers = [{ username: "admin", password: "admin123" }];

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();

        const user = defaultUsers.find(
            (u) => u.username === username && u.password === password
        );

        if (user) {
            console.log("Login successful! Navigating to WelcomePage...");
            navigate("/welcome", { state: { username } });
        } else {
            setError("Invalid username or password");
        }
    };

    return (
        <div className="main">
            <h1>LOGIN PAGE</h1>
            <h3>Enter Your Login Details</h3>

            <form onSubmit={handleLogin}>
                <label htmlFor="username">Username:</label>
                <input
                    type="text"
                    id="username"
                    name="username"
                    placeholder="Enter your Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />

                <label htmlFor="password">Password:</label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    placeholder="Enter your Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <div className="wrap">
                    <button type="submit">Submit</button>
                </div>
            </form>
            <p style={{ color: "red" }}>{error}</p>
        </div>
    );
};

export default LoginPage;
