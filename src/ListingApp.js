import { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// import FileUpload from "./component";
// import SuccessPage from "./SuccessPage";
import axios from "axios";
import NavBar from "./NavBar";

const ListingApp = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  // const http = new XMLHttpRequest();
  const [code, setCode] = useState(null);
  const [json, setJson] = useState(null);
  const [elastic, setElastic] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCheckboxChange = (event) => {
    setElastic(event.target.checked);
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("elasticBool", elastic);

      setLoading(true);
      // Make the POST request
      const response = await axios.post(
        "http://127.0.0.1:5000/ListingUpload",
        formData,
        {
          responseType: "blob", // Set the response type to 'blob' to handle file download
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setLoading(false);
      // console.log(response);
      console.log(response);
      setCode(response.status);
      console.log(code);
      setJson(response.data);
      console.log(response.data);

      const current = new Date();
      const date = `${current.getDate()}/${
        current.getMonth() + 1
      }/${current.getFullYear()}`;

      // Create a Blob from the response data
      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      // Create a URL for the Blob
      const downloadUrl = URL.createObjectURL(blob);

      // Create a temporary link element
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = date + "_SKUCreation.csv";

      // Simulate a click event to trigger the download
      link.click();

      // Cleanup by revoking the URL and removing the link element
      URL.revokeObjectURL(downloadUrl);
      link.remove();
    } catch (error) {
      setLoading(false);

      if (error.response) {
        // Request made and server responded
        const blob = await error.response.data;
        const errorMessage = await blob.text();
        alert("Error: " + errorMessage);
      } else {
        alert(
          "Error: " +
            error.message +
            "\n\nPlease verify the excel sheet and contact the IT department if unresolved."
        );
      }

      // Handle errors here
      // console.error(error);
    }
  };

  return (
    <div>
      <NavBar />
      <div className="container mt-5">
        <h2>Select a SKU Creation Listing</h2>

        <input
          className="form-control"
          type="file"
          accept=".xlsx"
          onChange={handleFileChange}
        />
        <div className="row g-3 mt-1">
          <div className="col-auto">
            <label className="form-check-label">
              Is this a sheet from Elastic?
            </label>
          </div>
          <div className="col-auto">
            <input
              className="form-check-input"
              type="checkbox"
              onChange={handleCheckboxChange}
            />
          </div>
        </div>
        <div className="row g-3 mt-1">
          <div className="col-auto">
            <button
              className="btn btn-primary btn-block btn-large"
              onClick={handleSubmit}
              disabled={!selectedFile}>
              Upload
            </button>
          </div>
          {loading && (
            <div className="col-auto">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListingApp;
