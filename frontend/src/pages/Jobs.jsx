import "./Jobs.css";
import NavBar from "../components/NavBar";
import { useState } from "react";
import { apiUrl } from "../api";
import { showErrorAlert, showSuccessAlert } from "../alerts";

function Jobs() {
  const [isCreateJobEnabled, setIsCreateJobEnabled] = useState(false);

  const [jobTitle, setJobTitle] = useState("");
  const [department, setDepartment] = useState("");
  const [description, setDescription] = useState("");
  const [requirements, setRequirements] = useState("");

  const handleCreateJob = () => {
    setIsCreateJobEnabled(true);
  };

  const handleCancel = () => {
    setIsCreateJobEnabled(false);
  };

  const handleSubmitJob = async (event) => {
    event.preventDefault();

    const jobData = {
      title: jobTitle,
      department: department,
      description: description,
      requirements: requirements,
    };

    try {
      const response = await fetch(apiUrl("/create-job"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("Token")}`,
        },
        body: JSON.stringify(jobData),
      });

      const result = await response.json();

      if (!response.ok) {
        showErrorAlert(result.detail || "Failed to create job.");
        return;
      }

      showSuccessAlert(result.message || "Job created successfully.");
      setIsCreateJobEnabled(false);
      setJobTitle("");
      setDepartment("");
      setDescription("");
      setRequirements("");
    } catch (error) {
      console.error("Error creating job:", error);
      showErrorAlert("Cannot connect to the server. Please try again.");
    }
  };

  return (
    <>
      <NavBar />

      {!isCreateJobEnabled ? (
        <div className="jobs-page">
          <div className="jobs-header">
            <div className="jobs-header-left">
              <h2>Jobs</h2>
              <p>Create and manage job openings for AI interviews.</p>
            </div>

            <div className="jobs-header-right">
              <button className="create-job-button" onClick={handleCreateJob}>
                Create Job
              </button>
            </div>
          </div>

          <div className="jobs-cards"></div>
          <div className="jobs-table"></div>
        </div>
      ) : (
        <div className="create-job-page">
          <div className="create-job-form">
            <h2>Create New Job</h2>
            <p>Enter the details for your new job opening.</p>

            <form onSubmit={handleSubmitJob}>
              <div className="create-job-form-group">
                <label htmlFor="jobTitle">Job Title</label>
                <input
                  id="jobTitle"
                  type="text"
                  placeholder="e.g. Frontend Developer"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  required
                  maxLength={150}
                />
              </div>

              <div className="create-job-form-group">
                <label htmlFor="department">Department</label>
                <input
                  id="department"
                  type="text"
                  placeholder="e.g. Engineering"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  required
                />
              </div>

              <div className="create-job-form-group">
                <label htmlFor="description">Job Description</label>
                <textarea
                  id="description"
                  placeholder="Describe the job responsibilities..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={5}
                  required
                />
              </div>

              <div className="create-job-form-group">
                <label htmlFor="requirements">Requirements</label>
                <textarea
                  id="requirements"
                  placeholder="Enter the skills and qualifications required..."
                  value={requirements}
                  onChange={(e) => setRequirements(e.target.value)}
                  rows={5}
                  required
                />
              </div>

              <div className="create-job-actions">
                <button
                  type="button"
                  className="cancel-job-button"
                  onClick={handleCancel}
                >
                  Cancel
                </button>

                <button type="submit" className="submit-job-button">
                  Create Job
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default Jobs;
