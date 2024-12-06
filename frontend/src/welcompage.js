import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./welcomepage.css";

const WelcomePage = () => {
    const location = useLocation();
    const username = location.state?.username || "User";
    const navigate = useNavigate();

    const [students, setStudents] = useState([]);
    const [editingStudentId, setEditingStudentId] = useState(null);
    const [editForm, setEditForm] = useState({
        id: "",
        name: "",
        age: "",
        class: "",
        gender: "",
    });
    const [addForm, setAddForm] = useState({
        id: "",
        name: "",
        age: "",
        class: "",
        gender: "",

    });

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

    const handleEdit = (student) => {
        setEditingStudentId(student.id);
        setEditForm({
            name: student.name,
            age: student.age,
            class: student.class,
            gender: student.gender,
        });
    };

    const handleSave = async () => {
        if (!editingStudentId) return;

        try {
            const updatedStudent = { ...editForm };
            const response = await fetch(
                `http://localhost:5000/api/ustudents/${editingStudentId}`,
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

            setStudents((prevStudents) =>
                prevStudents.map((student) =>
                    student.id === editingStudentId
                        ? { ...student, ...updatedStudent }
                        : student
                )
            );
            setEditingStudentId(null);
        } catch (error) {
            console.error("Error updating student:", error);
        }
    };

    const handleCancelEdit = () => {
        setEditingStudentId(null);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditForm((prevForm) => ({
            ...prevForm,
            [name]: value,
        }));
    };

    const handleAddInputChange = (e) => {
        const { name, value } = e.target;
        setAddForm((prevForm) => ({
            ...prevForm,
            [name]: value,
        }));
    };

    const handleAdd = async () => {
        try {
            const newStudent = { ...addForm };
            const response = await fetch("http://localhost:5000/api/adstudents", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newStudent),
            });

            if (!response.ok) {
                throw new Error("Failed to add student");
            }

            const addedStudent = await response.json();
            setStudents((prevStudents) => [...prevStudents, addedStudent]);
            setAddForm({
                id: "",
                name: "",
                age: "",
                class: "",
                gender: "",
            });
        } catch (error) {
            console.error("Error adding student:", error);
        }
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

    return (
        <div className="welcome-container">
            <h1>Welcome, {username}!</h1>
            <button className="back-button" onClick={handleBack}>
                Back to Login
            </button>

            <h2>Student List</h2>
            <table className="student-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Age</th>
                        <th>Class</th>
                        <th>Gender</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {students.length > 0 ? (
                        students.map((student) => (
                            <tr key={student.id}>
                                <td>{student.id}</td>
                                <td>
                                    {editingStudentId === student.id ? (
                                        <input
                                            type="text"
                                            name="name"
                                            value={editForm.name}
                                            onChange={handleInputChange}
                                        />
                                    ) : (
                                        student.name
                                    )}
                                </td>
                                <td>
                                    {editingStudentId === student.id ? (
                                        <input
                                            type="number"
                                            name="age"
                                            value={editForm.age}
                                            onChange={handleInputChange}
                                        />
                                    ) : (
                                        student.age
                                    )}
                                </td>
                                <td>
                                    {editingStudentId === student.id ? (
                                        <input
                                            type="text"
                                            name="class"
                                            value={editForm.class}
                                            onChange={handleInputChange}
                                        />
                                    ) : (
                                        student.class
                                    )}
                                </td>
                                <td>
                                    {editingStudentId === student.id ? (
                                        <input
                                            type="text"
                                            name="gender"
                                            value={editForm.gender}
                                            onChange={handleInputChange}
                                        />
                                    ) : (
                                        student.gender
                                    )}
                                </td>
                                <td>
                                    {editingStudentId === student.id ? (
                                        <>
                                            <button
                                                className="save-button"
                                                onClick={handleSave}
                                            >
                                                Save
                                            </button>
                                            <button
                                                className="cancel-button"
                                                onClick={handleCancelEdit}
                                            >
                                                Cancel
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button
                                                className="edit-button"
                                                onClick={() => handleEdit(student)}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="delete-button"
                                                onClick={() => handleDelete(student.id)}
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
                            <td colSpan="6">No students available</td>
                        </tr>
                    )}
                </tbody>
            </table>

            <h2>Add New Student</h2>
            <div className="add-form">
                <input
                    type="number"
                    name="id"
                    placeholder="id"
                    value={addForm.id}
                    onChange={handleAddInputChange}
                />
                <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={addForm.name}
                    onChange={handleAddInputChange}
                />
                <input
                    type="number"
                    name="age"
                    placeholder="Age"
                    value={addForm.age}
                    onChange={handleAddInputChange}
                />
                <input
                    type="text"
                    name="class"
                    placeholder="Class"
                    value={addForm.class}
                    onChange={handleAddInputChange}
                />
                <input
                    type="text"
                    name="gender"
                    placeholder="Gender"
                    value={addForm.gender}
                    onChange={handleAddInputChange}
                />
                <button className="add-button" onClick={handleAdd}>
                    Add Student
                </button>
            </div>
        </div>
    );
};

export default WelcomePage;
