import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./welcomepage.css";

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

    const [sortNameAsc, setSortNameAsc] = useState(true);
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

    const handleSortByName = () => {
        const sortedStudents = [...students].sort((a, b) => {
            return sortNameAsc
                ? a.name.localeCompare(b.name)
                : b.name.localeCompare(a.name);
        });
        setStudents(sortedStudents);
        setSortNameAsc(!sortNameAsc);
    };

    const handleSortByAge = () => {
        const sortedStudents = [...students].sort((a, b) => {
            return sortAgeAsc ? a.age - b.age : b.age - a.age;
        });
        setStudents(sortedStudents);
        setSortAgeAsc(!sortAgeAsc);
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
                            Name
                            <button className="sort-button" onClick={handleSortByName}>
                                {sortNameAsc ? "Des" : "Asc"}
                            </button>
                        </th>
                        <th>
                            Age
                            <button className="sort-button" onClick={handleSortByAge}>
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
                                <td>{student.name}</td>
                                <td>{student.age}</td>
                                <td>{student.class}</td>
                                <td>{student.gender}</td>
                                <td>
                                    <button className="edit-button" onClick={() => handleEdit(student)}>
                                        Edit
                                    </button>
                                    <button className="delete-button" onClick={() => handleDelete(student.id)}>
                                        Delete
                                    </button>
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
            <div className="add-student-form">
                <input
                    type="text"
                    placeholder="ID"
                    value={newStudentId}
                    onChange={(e) => setNewStudentId(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Name"
                    value={newStudentName}
                    onChange={(e) => setNewStudentName(e.target.value)}
                />
                <input
                    type="number"
                    placeholder="Age"
                    value={newStudentAge}
                    onChange={(e) => setNewStudentAge(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Class"
                    value={newStudentClass}
                    onChange={(e) => setNewStudentClass(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Gender"
                    value={newStudentGender}
                    onChange={(e) => setNewStudentGender(e.target.value)}
                />
                <button className="add-button" onClick={handleAddStudent}>
                    Add Student
                </button>
            </div>
        </div>
    );
};

export default WelcomePage;
