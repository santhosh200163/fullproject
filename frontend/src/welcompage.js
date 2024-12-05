import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const WelcomePage = () => {
    const location = useLocation();
    const username = location.state?.username || "User";
    const navigate = useNavigate();

    const [students, setStudents] = useState([]);
    const [editingStudentId, setEditingStudentId] = useState(null);
    const [newName, setNewName] = useState("");
    const [newAge, setNewAge] = useState("");
    const [newClass, setNewClass] = useState("");
    const [newGender, setNewGender] = useState("");
    const [newStudentId, setNewStudentId] = useState("");
    const [newStudentName, setNewStudentName] = useState("");
    const [newStudentAge, setNewStudentAge] = useState("");
    const [newStudentClass, setNewStudentClass] = useState("");
    const [newStudentGender, setNewStudentGender] = useState("");

    //const [sortNameAsc, setSortNameAsc] = useState(true);
    const [sortAgeAsc, setSortAgeAsc] = useState(true);

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
        setEditingStudentId(student.id);
        setNewName(student.name);
        setNewAge(student.age);
        setNewClass(student.class);
        setNewGender(student.gender);
    };

    const handleSave = async () => {
        if (!editingStudentId) return;

        try {
            const updatedStudent = {
                name: newName,
                age: newAge,
                class: newClass,
                gender: newGender,
            };
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
            setStudents(
                students.map((student) =>
                    student.id === editingStudentId ? { ...student, ...updatedStudent } : student
                )
            );
            setEditingStudentId(null);
        } catch (error) {
            console.error("Error updating student:", error);
        }
    };

    const handleAddStudent = async () => {
        const newStudent = {
            id: newStudentId,
            name: newStudentName,
            age: newStudentAge,
            class: newStudentClass,
            gender: newStudentGender,
        };

        try {
            const response = await fetch("http://localhost:5000/api/adstudents", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newStudent),
            });

            if (!response.ok) {
                throw new Error("Failed to add new student");
            }

            const addedStudent = await response.json();
            setStudents((prevStudents) => [...prevStudents, addedStudent]);
            setNewStudentId("");
            setNewStudentName("");
            setNewStudentAge("");
            setNewStudentClass("");
            setNewStudentGender("");
        } catch (error) {
            console.error("Error adding new student:", error);
        }
    };




    const handleSortByAge = () => {
        const sortedStudents = [...students].sort((a, b) => {
            return sortAgeAsc ? a.age - b.age : b.age - a.age;
        });
        setStudents(sortedStudents);
        setSortAgeAsc(!sortAgeAsc);
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
                style={{
                    width: "100%",
                    height: "auto",
                    margin: "0 auto",
                    textAlign: "left",
                    borderCollapse: "collapse",
                    backgroundColor: "#f9f9f9",
                    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
                    borderRadius: "8px",
                    padding: "10px",


                }}
            >
                <thead>
                    <tr style={{ width: "100%", textAlign: "left", height: "100%" }}>
                        <th>ID</th>
                        <th>name</th>
                        <th>
                            Age
                            <button onClick={handleSortByAge} style={{ marginLeft: "10px", width: "80%", height: "5%" }}>
                                {sortAgeAsc ? "Des" : "Asc"}
                            </button>
                        </th>
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
                                            value={newName}
                                            onChange={(e) => setNewName(e.target.value)}
                                        />
                                    ) : (
                                        student.name
                                    )}
                                </td>
                                <td>
                                    {editingStudentId === student.id ? (
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
                                    {editingStudentId === student.id ? (
                                        <input
                                            type="text"
                                            value={newClass}
                                            onChange={(e) => setNewClass(e.target.value)}
                                        />
                                    ) : (
                                        student.class
                                    )}
                                </td>
                                <td>
                                    {editingStudentId === student.id ? (
                                        <input
                                            type="text"
                                            value={newGender}
                                            onChange={(e) => setNewGender(e.target.value)}
                                        />
                                    ) : (
                                        student.gender
                                    )}
                                </td>
                                <td>
                                    {editingStudentId === student.id ? (
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
                                                onClick={() => setEditingStudentId(null)}
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
                                                    backgroundColor: "yellowgreen",
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
                                                    backgroundColor: "red",
                                                    color: "#fff",
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
                            <td colSpan="6">No students available</td>
                        </tr>
                    )}
                </tbody>
            </table>

            <h3>Add New Student</h3>
            <div style={{ marginBottom: "20px" }}>
                <input
                    type="text"
                    placeholder="ID"
                    value={newStudentId}
                    onChange={(e) => setNewStudentId(e.target.value)}
                    style={{ padding: "5px", margin: "5px" }}
                />
                <input
                    type="text"
                    placeholder="Name"
                    value={newStudentName}
                    onChange={(e) => setNewStudentName(e.target.value)}
                    style={{ padding: "5px", margin: "5px" }}
                />
                <input
                    type="number"
                    placeholder="Age"
                    value={newStudentAge}
                    onChange={(e) => setNewStudentAge(e.target.value)}
                    style={{ padding: "5px", margin: "5px" }}
                />
                <input
                    type="text"
                    placeholder="Class"
                    value={newStudentClass}
                    onChange={(e) => setNewStudentClass(e.target.value)}
                    style={{ padding: "5px", margin: "5px" }}
                />
                <input
                    type="text"
                    placeholder="Gender"
                    value={newStudentGender}
                    onChange={(e) => setNewStudentGender(e.target.value)}
                    style={{ padding: "5px", margin: "5px" }}
                />
                <button
                    onClick={handleAddStudent}
                    style={{
                        padding: "5px 10px",
                        backgroundColor: "#007bff",
                        color: "#fff",
                        borderRadius: "5px",
                        cursor: "pointer",
                    }}
                >
                    Add Student
                </button>
            </div>
        </div>
    );
};

export default WelcomePage;
