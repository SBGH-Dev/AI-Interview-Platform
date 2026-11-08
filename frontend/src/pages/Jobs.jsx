import "./Jobs.css";
import NavBar from "../components/NavBar";
import { useState, useEffect } from "react";
import { apiUrl } from "../api";
import { showErrorAlert, showSuccessAlert } from "../alerts";

function Jobs() {
  const [isCreateJobEnabled, setIsCreateJobEnabled] = useState(false);

  const [jobTitle, setJobTitle] = useState("");
  const [department, setDepartment] = useState("");
  const [description, setDescription] = useState("");
  const [requirements, setRequirements] = useState("");

  const [jobStats, setJobStats] = useState({
    total_jobs: 0,
    open_jobs: 0,
    closed_jobs: 0,
    total_candidates: 0,
  });
  const [jobs, setJobs] = useState([]);

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

  useEffect(() => {
    const fetchJobStats = async () => {
      try {
        const response = await fetch(apiUrl("/jobs-count"), {
          method: "GET",
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("Token")}`,
          },
        });

        if (!response.ok) {
          showErrorAlert("Failed to fetch job statistics");
        }

        const data = await response.json();
        setJobStats(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchJobStats();
  }, []);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch(apiUrl("/jobs"), {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("Token")}`,
          },
        });

        if (!response.ok) {
          showErrorAlert("Failed to fetch jobs");
        }

        const data = await response.json();
        setJobs(data.jobs);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };

    fetchJobs();
  }, []);

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

          <div className="jobs-cards">
            <div className="job-card">
              <p>Total Jobs</p>
              <h2>{jobStats.total_jobs}</h2>
            </div>

            <div className="job-card">
              <p>Open Jobs</p>
              <h2>{jobStats.open_jobs}</h2>
            </div>

            <div className="job-card">
              <p>Closed Jobs</p>
              <h2>{jobStats.closed_jobs}</h2>
            </div>

            <div className="job-card">
              <p>Total Candidates</p>
              <h2>{jobStats.total_candidates}</h2>
            </div>
          </div>
          <div className="jobs-table">
            <h3>All Jobs</h3>

            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Job ID</th>
                    <th>Job Title</th>
                    <th>Department</th>
                    <th>Status</th>
                    <th>Created Date</th>
                  </tr>
                </thead>

                <tbody>
                  {jobs.length === 0 ? (
                    <tr>
                      <td colSpan="5">No jobs found</td>
                    </tr>
                  ) : (
                    jobs.map((job) => (
                      <tr key={job.id}>
                        <td>#{job.id}</td>
                        <td>{job.title}</td>
                        <td>{job.department}</td>
                        <td>
                          <span className={`job-status ${job.status}`}>
                            {job.status}
                          </span>
                        </td>
                        <td>{new Date(job.created_at).toLocaleDateString()}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
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
