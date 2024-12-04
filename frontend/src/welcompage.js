import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const WelcomePage = () => {
    const location = useLocation();
    const username = location.state?.username || "User";
    const navigate = useNavigate();

    const [students, setStudents] = useState([]);

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const response = await fetch("http://localhost:5000/api/getstudents");
                if (!response.ok) {
                    throw new Error("Failed to fetch students");
                }
                const data = await response.json();
                console.log(data);
                setStudents(data);
            } catch (error) {
                console.error("Error fetching students:", error);
            }
        };

        fetchStudents();
    }, []);

    const back = () => {
        navigate("/");
    };

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`http://localhost:5000/api/dstudents`, {
                method: "DELETE",
            });
            if (!response.ok) {
                throw new Error("Failed to delete student");
            }

            setStudents(students.filter((student) => student.id !== id));
        } catch (error) {
            console.error("Error deleting student:", error);
        }
    };

    const handleEdit = async (id) => {
        try {
            const response = await fetch(`http://localhost:5000/api/ustudents`, {
                method: "PUT",
            });
            if (!response.ok) {
                throw new Error("Failed to update student");
            }

            setStudents(students.filter((student) => student.id !== id));
        } catch (error) {
            console.error("Error updateing student:", error);
        }
    };


    return (
        <div className="main1">
            <h1>Welcome, {username}!</h1>
            <h2>Login successful!</h2>

            <button
                onClick={back}
                style={{
                    padding: "10px 20px",
                    margin: "20px 0",
                    backgroundColor: "#007bff",
                    color: "#fff",
                    borderRadius: "5px",
                    cursor: "pointer",
                }}
            >
                Back to Login
            </button>

            <h2>Student List</h2>
            <table
                border="1"
                style={{ width: "85%", margin: "20px auto", textAlign: "left" }}
            >
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Age</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {students.length > 0 ? (
                        students.map((student) => (
                            <tr key={student.id}>
                                <td>{student.id}</td>
                                <td>{student.name}</td>
                                <td>{student.age}</td>
                                <td>
                                    <button
                                        onClick={() => handleEdit(student.id)}
                                        style={{
                                            padding: "5px 10px",
                                            backgroundColor: "#28a745",
                                            color: "#fff",
                                            border: "none",
                                            borderRadius: "5px",
                                            cursor: "pointer",
                                            marginRight: "10px",
                                        }}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(student.id)}
                                        style={{
                                            padding: "5px 10px",
                                            backgroundColor: "#dc3545",
                                            color: "#fff",
                                            border: "none",
                                            borderRadius: "5px",
                                            cursor: "pointer",
                                        }}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4" style={{ textAlign: "center" }}>
                                No students found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default WelcomePage;
