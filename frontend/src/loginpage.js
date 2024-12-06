import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./loginpage.css";

const LoginPage = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState(""); // For registration
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [isRegistering, setIsRegistering] = useState(false); // Toggle between login and register

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("http://127.0.0.1:5000/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (response.ok) {
                setError("");
                console.log("Login successful! Navigating to WelcomePage...");
                navigate("/welcome", { state: { username } });
            } else {
                setError(data.error || "Login failed");
            }
        } catch (error) {
            setError("An error occurred during login");
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            const response = await fetch("http://127.0.0.1:5000/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess("Registration successful! You can now log in.");
                setError("");
                setUsername("");
                setPassword("");
                setConfirmPassword("");
                setIsRegistering(false);
            } else {
                setError(data.error || "Registration failed");
            }
        } catch (error) {
            setError("An error occurred during registration");
        }
    };

    return (
        <div className="main">
            <h1>{isRegistering ? "REGISTER PAGE" : "LOGIN PAGE"}</h1>
            <h3>{isRegistering ? "Create Your Account" : "Enter Your Login Details"}</h3>

            <form onSubmit={isRegistering ? handleRegister : handleLogin}>
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

                {isRegistering && (
                    <>
                        <label htmlFor="confirmPassword">Confirm Password:</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            placeholder="Confirm your Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </>
                )}

                <div className="wrap">
                    <button type="submit">
                        {isRegistering ? "Register" : "Login"}
                    </button>
                </div>
            </form>

            {error && <p style={{ color: "red" }}>{error}</p>}
            {success && <p style={{ color: "green" }}>{success}</p>}

            <p>
                {isRegistering
                    ? "Already have an account? "
                    : "Don't have an account? "}
                <button
                    className="toggle-button"
                    onClick={() => {
                        setIsRegistering(!isRegistering);
                        setError("");
                        setSuccess("");
                    }}
                >
                    {isRegistering ? "Login here" : "Register here"}
                </button>
            </p>
        </div>
    );
};

export default LoginPage;
