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
        native: "",
        teacherName: "",
    });
    const [addForm, setAddForm] = useState({
        id: "",
        name: "",
        age: "",
        class: "",
        gender: "",
        native: "",
        teacherName: "",
    });
    const [sortConfig, setSortConfig] = useState({ key: null, direction: null });

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

    const handleBack = () => {
        navigate("/");
    };

    const handleEdit = (student) => {
        console.log("Editing Student ID:", student.id);

        setEditingStudentId(student.id);
        setEditForm({ ...student });
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

            const updatedStudentData = await response.json();
            console.log("Updated Student Data:", updatedStudentData); // Debug


            setStudents((prevStudents) =>
                prevStudents.map((student) =>
                    student.id === editingStudentId ? updatedStudentData : student
                )
            );

            setEditingStudentId(null);
            setEditForm({
                id: "",
                name: "",
                age: "",
                class: "",
                gender: "",
                native: "",
                teacherName: "",
            });
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
                native: "",
                teacherName: "",
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

    const sortStudents = (key) => {
        let direction = "asc";
        if (sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc";
        }

        const sortedData = [...students].sort((a, b) => {
            if (a[key] < b[key]) {
                return direction === "asc" ? -1 : 1;
            }
            if (a[key] > b[key]) {
                return direction === "asc" ? 1 : -1;
            }
            return 0;
        });

        setStudents(sortedData);
        setSortConfig({ key, direction });
    };

    const getSortButtonLabel = (key) => {
        if (sortConfig.key === key) {
            return sortConfig.direction === "asc" ? "Desc" : "Asc";
        }
        return "Asc";
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
                        <th>
                            <div className="sortable-header">
                                Name
                                <button onClick={() => sortStudents("name")}>
                                    {getSortButtonLabel("name")}
                                </button>
                            </div>
                        </th>
                        <th>
                            <div className="sortable-header">
                                Age
                                <button onClick={() => sortStudents("age")}>
                                    {getSortButtonLabel("age")}
                                </button>
                            </div>
                        </th>
                        <th>Class</th>
                        <th>Gender</th>
                        <th>Native</th>
                        <th>Teacher Name</th>
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
                                        <input
                                            type="text"
                                            name="native"
                                            value={editForm.native}
                                            onChange={handleInputChange}
                                        />
                                    ) : (
                                        student.native
                                    )}
                                </td>
                                <td>
                                    {editingStudentId === student.id ? (
                                        <input
                                            type="text"
                                            name="teacherName"
                                            value={editForm.teacherName}
                                            onChange={handleInputChange}
                                        />
                                    ) : (
                                        student.teacherName
                                    )}
                                </td>
                                <td>
                                    {editingStudentId === student.id ? (
                                        <>
                                            <button onClick={handleSave}>Save</button>
                                            <button onClick={handleCancelEdit}>Cancel</button>
                                        </>
                                    ) : (
                                        <>
                                            <button onClick={() => handleEdit(student)}>Edit</button>
                                            <button onClick={() => handleDelete(student.id)}>
                                                Delete
                                            </button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="8">No students found</td>
                        </tr>
                    )}
                </tbody>
            </table>

            <h2>Add Student</h2>
            <div className="add-student-form">
                <input
                    type="text"
                    name="id"
                    value={addForm.id}
                    onChange={handleAddInputChange}
                    placeholder="Student ID"
                />
                <input
                    type="text"
                    name="name"
                    value={addForm.name}
                    onChange={handleAddInputChange}
                    placeholder="Name"
                />
                <input
                    type="number"
                    name="age"
                    value={addForm.age}
                    onChange={handleAddInputChange}
                    placeholder="Age"
                />
                <select
                    name="class"
                    value={addForm.class}
                    onChange={handleAddInputChange}
                >
                    <option value="">Select Class</option>
                    <option value="1">Class 1</option>
                    <option value="2">Class 2</option>
                    <option value="3">Class 3</option>
                    <option value="4">Class 4</option>
                    <option value="5">Class 5</option>
                    <option value="6">Class 6</option>
                    <option value="7">Class 7</option>
                    <option value="8">Class 8</option>
                    <option value="9">Class 9</option>
                    <option value="10">Class 10</option>
                    <option value="11">Class 11</option>
                    <option value="12">Class 12</option>
                </select>
                <select
                    name="gender"
                    value={addForm.gender}
                    onChange={handleAddInputChange}
                >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                </select>
                <input
                    type="text"
                    name="native"
                    value={addForm.native}
                    onChange={handleAddInputChange}
                    placeholder="Native"
                />
                <input
                    type="text"
                    name="teacherName"
                    value={addForm.teacherName}
                    onChange={handleAddInputChange}
                    placeholder="Teacher Name"
                />
                <button onClick={handleAdd}>Add Student</button>
            </div>
        </div>
    );
};

export default WelcomePage;