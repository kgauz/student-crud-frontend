import { useEffect, useState } from "react";

//export const API_URL = "http://localhost:5000/api/students"; 
const API_URL = "https://student-crud-gryw.onrender.com/api/students";

function App() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({ fullName: "", email: "", course: "" });
  const [editingId, setEditingId] = useState(null);

  // Fetch all students
  const fetchStudents = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setStudents(data);
    } catch (err) {
      console.error("Failed to fetch students:", err);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Handle form submit (create or update)
  const submit = async (e) => {
    e.preventDefault();

    if (editingId) {
      await fetch(`${API_URL}/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setEditingId(null);
    } else {
      await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    }

    setForm({ fullName: "", email: "", course: "" });
    fetchStudents();
  };

  const remove = async (id) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      fetchStudents();
    }
  };

  const startEdit = (student) => {
    setEditingId(student._id);
    setForm({
      fullName: student.fullName,
      email: student.email,
      course: student.course,
    });
  };

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 20, fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ textAlign: "center", marginBottom: 30 }}>Student Management System</h1>

      {/* Form Card */}
      <div style={{
        backgroundColor: "#f4f6f8",
        padding: 20,
        borderRadius: 10,
        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
        marginBottom: 30
      }}>
        <form onSubmit={submit} style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <input
            placeholder="Full Name"
            value={form.fullName}
            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            style={{ flex: "1 1 200px", padding: 10, borderRadius: 5, border: "1px solid #ccc" }}
            required
          />
          <input
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            style={{ flex: "1 1 200px", padding: 10, borderRadius: 5, border: "1px solid #ccc" }}
            required
            type="email"
          />
          <input
            placeholder="Course"
            value={form.course}
            onChange={(e) => setForm({ ...form, course: e.target.value })}
            style={{ flex: "1 1 150px", padding: 10, borderRadius: 5, border: "1px solid #ccc" }}
            required
          />
          <button type="submit" style={{
            padding: "10px 20px",
            borderRadius: 5,
            border: "none",
            backgroundColor: "#007bff",
            color: "white",
            cursor: "pointer"
          }}>
            {editingId ? "Update Student" : "Add Student"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setForm({ fullName: "", email: "", course: "" });
              }}
              style={{
                padding: "10px 20px",
                borderRadius: 5,
                border: "none",
                backgroundColor: "#6c757d",
                color: "white",
                cursor: "pointer"
              }}
            >
              Cancel
            </button>
          )}
        </form>
      </div>

      {/* Students Table */}
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead style={{ backgroundColor: "#007bff", color: "white" }}>
            <tr>
              <th style={{ padding: 10 }}>Name</th>
              <th style={{ padding: 10 }}>Email</th>
              <th style={{ padding: 10 }}>Course</th>
              <th style={{ padding: 10 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s, index) => (
              <tr key={s._id} style={{ backgroundColor: index % 2 === 0 ? "#f9f9f9" : "white" }}>
                <td style={{ padding: 10 }}>{s.fullName}</td>
                <td style={{ padding: 10 }}>{s.email}</td>
                <td style={{ padding: 10 }}>{s.course}</td>
                <td style={{ padding: 10 }}>
                  <button
                    onClick={() => startEdit(s)}
                    style={{
                      marginRight: 5,
                      padding: "5px 10px",
                      borderRadius: 5,
                      border: "none",
                      backgroundColor: "#28a745",
                      color: "white",
                      cursor: "pointer"
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => remove(s._id)}
                    style={{
                      padding: "5px 10px",
                      borderRadius: 5,
                      border: "none",
                      backgroundColor: "#dc3545",
                      color: "white",
                      cursor: "pointer"
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;

