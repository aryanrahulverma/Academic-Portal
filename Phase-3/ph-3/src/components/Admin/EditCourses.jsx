import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import NavBar from "../UniversalComponents/NavBar";
import './EditCourses.css';

function EditCourses() {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const [courseData, setCourseData] = useState({
        COURSE: "",
        CODE: "",
        INSTRUCTOR: "",
        ROOM_NUMBER: "",
        SYLLABUS: "",
        TIME: "",
        OBJECTIVE: "",
    });
    const [error, setError] = useState(null);
    useEffect(() => {
        fetch(`http://localhost/backend/fetchCourseData.php?id=${courseId}`, {
            credentials: 'include',
          })
          .then((response) => {
            if (response.ok) {
              return response.json();
            } else {
              throw new Error(`Response status is not 200: ${response.status}`);
            }
          })
            .then((data) => {
                if (data.length == 0){
                    // courseId = "Course Not Found"
                    setCourseData({
                        COURSE: "Not Found",
                        CODE: "Not Found",
                        INSTRUCTOR: "Not Found",
                        ROOM_NUMBER: "Not Found",
                        SYLLABUS: "Not Found",
                        TIME: "Not Found",
                        OBJECTIVE: "Not Found",
                    });
                    
                }
                else{
                    setCourseData(data[0]);
                    // console.log(data.length);
                }
                
            })
            .catch((error) => setError(error));
    }, [courseId]);
    if (error) {
        // Handle the error condition, e.g., server is down
        return <div>Access Denied: Server is not responding.</div>;
      }

    const handleEdit = () => {
        const updatedCourseData = {
            COURSE: courseData.COURSE,
            CODE: courseData.CODE,
            INSTRUCTOR: courseData.INSTRUCTOR,
            ROOM_NUMBER: courseData.ROOM_NUMBER,
            SYLLABUS: courseData.SYLLABUS,
            TIME: courseData.TIME,
            OBJECTIVE: courseData.OBJECTIVE,
        };
        console.log(JSON.stringify(updatedCourseData));
        fetch(`http://localhost/backend/updateCourseData.php`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedCourseData),
            credentials: 'include',
        })
        .then((response) => response.json())
        .then((data) => {
            if (data.message) {
                // alert(data.message);
                navigate("/admin/course");
            } else {
                alert(data.error);
            }
        })
        .catch((error) => {
            console.error("Error updating course data:", error);
        });
    };

    // Helper function to update the state when a field changes
    const updateField = (field, value) => {
        setCourseData({ ...courseData, [field]: value });
    };

    return (
        <div>
            <NavBar x="admin" />
            <section className="editCourse-section">
                <div className="course-label">Edit course details: <b>{courseData.CODE}</b></div>
                <input
                    className="editinput"
                    type="text"
                    name="course-name"
                    placeholder="Enter course name"
                    value={courseData.COURSE}
                    onChange={(e) => updateField("COURSE", e.target.value)}
                />
                <input
                    className="editinput"
                    type="text"
                    name="course-code"
                    placeholder="Enter course code"
                    value={courseData.CODE}
                    readOnly
                /><br />
                <input
                    className="editinput"
                    type="text"
                    name="course-instructor"
                    placeholder="Enter instructor name"
                    value={courseData.INSTRUCTOR}
                    onChange={(e) => updateField("INSTRUCTOR", e.target.value)}
                />
                <input
                    className="editinput"
                    type="text"
                    name="room-number"
                    placeholder="Enter room number"
                    value={courseData.ROOM_NUMBER}
                    onChange={(e) => updateField("ROOM_NUMBER", e.target.value)}
                /><br />
                <input
                    className="editinput"
                    type="text"
                    name="syllabus"
                    placeholder="Enter syllabus link"
                    value={courseData.SYLLABUS}
                    onChange={(e) => updateField("SYLLABUS", e.target.value)}
                />
                <input
                    className="editinput"
                    type="text"
                    name="meeting-time"
                    placeholder="Enter meeting time"
                    value={courseData.TIME}
                    onChange={(e) => updateField("TIME", e.target.value)}
                /><br />
                <textarea
                    className="editinput"
                    name=""
                    id=""
                    cols="30"
                    rows="10"
                    placeholder="Enter course objectives"
                    value={courseData.OBJECTIVE}
                    onChange={(e) => updateField("OBJECTIVE", e.target.value)}
                ></textarea><br />
                <button type="submit" className="edit-course" onClick={handleEdit} disabled={courseData.COURSE === "Not Found"}>Submit</button>
            </section>
        </div>
    );
}

export default EditCourses;
