import NavBar from "./NavBar";
import React, { useState } from "react";
import axios from "axios";

const PhotoApp = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [code, setCode] = useState(null);
  const [json, setJson] = useState(null);
  const [df, setDf] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [postError, setPostError] = useState(null);
  const [folderBool, setFolderBool] = useState(false);
  const [folder, setFolder] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteUrl, setDeleteUrl] = useState(null);
  const [errorDict, setErrorDict] = useState(null);
  const [downloadWithErrors, setDownloadWithErrors] = useState(false);

  const handleCheckboxChange = (event) => {
    setFolderBool(event.target.checked);
  };

  const handleErrorChange = (event) => {
    setDownloadWithErrors(event.target.checked);
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("file", selectedFile);
      if (folderBool) {
        folder.forEach((file) => formData.append("file[]", file));
      } else {
        formData.append("file[]", "null");
      }

      // Make the POST request
      const response = await axios.post(
        "http://127.0.0.1:5000/ImageCsvTest",
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) setCode(200);

      // console.log(response.data);
      setJson(response.data.df);
      setDf(response.data.df);
      setErrorDict(response.data.errorDict);
      console.log(response.data.errorDict);
      setPostError(null);
    } catch (error) {
      // Handle errors here
      setPostError(error.message);
      console.error(error.message);
      console.log(error.response.data);
      if (error.status === 400) {
        alert(
          "Error: " +
            error.response.data +
            "\n\nPlease verify the excel sheet and contact the IT department if unresolved."
        );
      } else {
        alert(
          "There was an error uploading your file. Please verify your file. \n\nIf the problem persists, please contact the IT department."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const deleteImage = async (key) => {
    try {
      setDeleteLoading(true);
      console.log("delete image with key:", key);
      setDeleteUrl(key);
      const formData = new FormData();
      formData.append("url", key);
      formData.append("df", json);
      const response = await axios.post(
        "http://127.0.0.1:5000/DeleteImage",
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log(response.data);
      setJson(response.data);
      setDf(response.data);
      // You can implement your delete image logic here
    } catch (error) {
      console.error(error.message);
    } finally {
      setDeleteLoading(false);
    }
  };

  const renderImages = (images) => {
    const imageKeys = Object.keys(images).filter(
      (key) => key.startsWith("Server Image") && images[key]
    );

    return (
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3">
        {imageKeys.map((key) => {
          const imageUrl = images[key];
          const isDeleting = deleteUrl === imageUrl && deleteLoading;

          return (
            <div key={imageUrl} className="col mb-3">
              <div className="text-center">
                <p>Image {key.slice(-1)}</p>
                <img
                  style={{ maxWidth: "100%", height: "auto" }}
                  src={imageUrl}
                  alt={key}
                  className="border"
                />
                {isDeleting && (
                  <div className="col-auto">
                    <div className="spinner-border" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                )}
                <button
                  className="btn btn-danger mt-2"
                  onClick={() => deleteImage(imageUrl)}>
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const downloadCSV = async () => {
    try {
      const formData = new FormData();
      formData.append("df", df);
      formData.append("downloadWithErrors", downloadWithErrors);
      formData.append("errorDict", JSON.stringify(errorDict));
      if (folderBool) {
        formData.append("bool", "true");
      } else {
        formData.append("bool", "false");
      }

      // Make the GET request to download the file
      const downloadResponse = await axios.post(
        "http://127.0.0.1:5000/downloadTest",
        formData,
        { responseType: "blob", withCredentials: true }
      );
      if (downloadResponse.status !== 200) {
        throw new Error("Error downloading file");
      }

      const url = window.URL.createObjectURL(new Blob([downloadResponse.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "session.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      setPostError(null);
      console.log(downloadResponse);
    } catch (error) {
      // Handle errors here
      setPostError(error.message);
      console.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <NavBar />
      <div className="container mt-5">
        <h2>Select an Image Sourcing CSV</h2>

        <input
          className="form-control"
          type="file"
          accept=".csv"
          onChange={handleFileChange}
        />

        <div className="row g-3 mt-1">
          <div className="col-auto">
            <label className="form-check-label">
              Is this a child only random sheet?
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
        {folderBool && (
          <div className="row g-3 mt-1">
            <div className="col-auto">
              <label className="form-label">
                Select a folder with product images.
              </label>
            </div>
            <div className="col-auto">
              <input
                required
                type="file"
                webkitdirectory="true"
                directory=""
                className="form-control"
                onChange={(event) => {
                  const files = [];
                  const fileList = event.dataTransfer
                    ? event.dataTransfer.files
                    : event.target.files;
                  for (let i = 0; i < fileList.length; i++) {
                    files.push(fileList[i]);
                  }

                  setFolder(files);
                }}
              />
            </div>
          </div>
        )}
        <div className="row g-3 mt-1">
          <div className="col-auto">
            <button
              className="btn btn-primary btn-block btn-large"
              onClick={handleSubmit}
              disabled={!selectedFile}>
              Upload
            </button>
          </div>
        </div>

        {code === 200 && (
          <button
            className="btn btn-primary btn-block btn-large mt-1 mb-2"
            onClick={downloadCSV}>
            Download CSV
          </button>
        )}

        {isLoading && (
          <div className="col-auto mt-1">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )}

        {errorDict && (
          <div>
            <div className="row g-3">
              <div className="col-auto">
                <label className="form-check-label">
                  Download the CSV with the errors?
                </label>
              </div>
              <div className="col-auto">
                <input
                  className="form-check-input"
                  type="checkbox"
                  onChange={handleErrorChange}
                />
              </div>
            </div>
            <h2>Errors</h2>
            <p>These images were not uploaded successfully. </p>
            <ul>
              {Object.keys(errorDict).map((key) => (
                <li key={key}>
                  {key}: {errorDict[key]}
                </li>
              ))}
            </ul>
          </div>
        )}

        {json && (
          <div>
            {Object.entries(JSON.parse(json)).map(([sku, skuData]) => (
              <div key={sku} className="card mb-3">
                <div className="card-body">
                  <h2 className="card-title">{skuData.Title}</h2>
                  <p className="card-title">SKU: {sku}</p>
                  {renderImages(skuData)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PhotoApp;
