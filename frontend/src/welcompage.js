import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const WelcomePage = () => {
    const location = useLocation();
    const username = location.state?.username || "User";
    const navigate = useNavigate();

    const [students, setStudents] = useState([]);
    const [editingStudent, setEditingStudent] = useState(null);
    const [newName, setNewName] = useState("");
    const [newAge, setNewAge] = useState("");

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const response = await fetch("http://localhost:5000/api/getstudents");
                if (!response.ok) {
                    throw new Error("Failed to fetch students");
                }
                const data = await response.json();
                setStudents(data);
            } catch (error) {
                console.error("Error fetching students:", error);
            }
        };

        fetchStudents();
    }, []);

    const handleBack = () => {
        navigate("/");
    };

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`http://localhost:5000/api/dstudents/${id}`, {
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

    const handleEdit = (student) => {
        setEditingStudent(student);
        setNewName(student.name);
        setNewAge(student.age);
    };

    const handleSave = async () => {
        if (!editingStudent) return;

        try {
            const updatedStudent = {
                name: newName,
                age: newAge,
            };
            const response = await fetch(
                `http://localhost:5000/api/ustudents/${editingStudent.id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(updatedStudent),
                }
            );
            if (!response.ok) {
                throw new Error("Failed to update student");
            }
            setStudents(
                students.map((student) =>
                    student.id === editingStudent.id ? { ...student, ...updatedStudent } : student
                )
            );
            setEditingStudent(null);
        } catch (error) {
            console.error("Error updating student:", error);
        }
    };

    return (
        <div className="main1">
            <h1>Welcome, {username}!</h1>
            <h2>Login successful!</h2>

            <button
                onClick={handleBack}
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
                style={{ width: "100%", textAlign: "left", height: "100%" }}
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
                                <td>
                                    {editingStudent && editingStudent.id === student.id ? (
                                        <input
                                            type="text"
                                            value={newName}
                                            onChange={(e) => setNewName(e.target.value)}
                                        />
                                    ) : (
                                        student.name
                                    )}
                                </td>
                                <td>
                                    {editingStudent && editingStudent.id === student.id ? (
                                        <input
                                            type="number"
                                            value={newAge}
                                            onChange={(e) => setNewAge(e.target.value)}
                                        />
                                    ) : (
                                        student.age
                                    )}
                                </td>
                                <td>
                                    {editingStudent && editingStudent.id === student.id ? (
                                        <>
                                            <button
                                                onClick={handleSave}
                                                style={{
                                                    padding: "5px 10px",
                                                    backgroundColor: "green",
                                                    borderRadius: "2px",
                                                    cursor: "pointer",
                                                    marginRight: "10px",
                                                }}
                                            >
                                                Save
                                            </button>
                                            <button
                                                onClick={() => setEditingStudent(null)}
                                                style={{
                                                    padding: "5px 10px",
                                                    backgroundColor: "red",
                                                    color: "#fff",
                                                    borderRadius: "5px",
                                                    cursor: "pointer",
                                                }}
                                            >
                                                Cancel
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button
                                                onClick={() => handleEdit(student)}
                                                style={{
                                                    padding: "5px 10px",
                                                    backgroundColor: "green",
                                                    borderRadius: "5px",
                                                    cursor: "pointer",
                                                    marginRight: "8px",
                                                }}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(student.id)}
                                                style={{
                                                    padding: "5px 10px",
                                                    backgroundColor: "red",
                                                    borderRadius: "5px",
                                                    cursor: "pointer",
                                                }}
                                            >
                                                Delete
                                            </button>
                                        </>
                                    )}
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
