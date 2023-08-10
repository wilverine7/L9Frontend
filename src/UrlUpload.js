import React from "react";
import NavBar from "./NavBar";
import axios from "axios";
import { useState } from "react";

const UrlUpload = () => {
  const [url, setUrl] = useState(null);
  const [sku, setSku] = useState(null);
  const [imageNumber, setImageNumber] = useState(null);
  const [removeBackground, setRemoveBackground] = useState(false);
  const [flag, setFlag] = useState(false);
  const [displayImage, setDisplayImage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCheckboxChange = (event) => {
    setRemoveBackground(event.target.checked);
  };

  const deleteImage = async () => {
    try {
      const formData = new FormData();
      formData.append("sku", sku);
      formData.append("imageNumber", imageNumber);
      

      // Make the POST request
      const response = await axios.post(
        "http://127.0.0.1:5000/DeleteSingleImage",
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      
      setDisplayImage(null);
      setError("Deleted");
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    
    try {
      setDisplayImage(null);

      const formData = new FormData();
      formData.append("url", url);
      formData.append("sku", sku);
      formData.append("imageNumber", imageNumber);
      formData.append("removeBackground", removeBackground);
      formData.append("flag", flag);

      // Make the POST request
      const response = await axios.post(
        "http://127.0.0.1:5000/UrlUpload",
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status !== 200) throw new Error("Error uploading file");
      setFlag(false);
      setError(null);
      if (response.data.error) {
        setError(response.data.error);
        if (response.data.flag) setFlag(true);
      }

      console.log(response.data.displayImage);

      setDisplayImage(response.data.displayImage);
      console.log(response);
      setLoading(false);
    } catch (error) {
      // Handle errors here
      console.error(error.message);
    }
    // }
  };
  return (
    <div>
      <NavBar />
      <div className="container mt-5">
        <h2>Single Image Upload</h2>
        <div>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">URL or full file path:</label>
              <input
                className="form-control"
                type="text"
                name="url"
                onChange={(event) => setUrl(event.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">SKU:</label>
              <input
                className="form-control"
                type="text"
                name="sku"
                onChange={(event) => setSku(event.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Image Number:</label>
              <input
                className="form-control w-25"
                type="number"
                name="image_number"
                min={1}
                max={10}
                onChange={(event) => setImageNumber(event.target.value)}
                required
              />
            </div>
            <div className="form-group mt-1">
              <div className="form-check">
                <label className="form-check-label">Remove Background</label>
                <input
                  className="form-check-input"
                  type="checkbox"
                  name="removeBackground"
                  value={false}
                  onChange={handleCheckboxChange}
                  defaultChecked={false}
                />
              </div>
            </div>
            {error && (
              <div className="row">
                <div className="">{error}</div>
                {flag && <div className="col"><input className="btn btn-danger" type="submit" value="Yes" />
                </div>}
              </div>
            )}
            <input type="hidden" name="flag" value={flag} />
            <div className="row g-3 mt-1">
              <div class="col-auto">
                <input
                  className="btn btn-primary"
                  type="submit"
                  value="Submit"
                />
              </div>
              {loading && (
                <div class="col-auto">
                  <div class="spinner-border" role="status">
                    <span class="visually-hidden">Loading...</span>
                  </div>
                </div>
              )}
            </div>
          </form>
        </div>
        {displayImage && (
          <div>
            {/* button that allows you to copy the displayImage text to clipboard */}
            <button
              className="btn btn-primary mt-1 mb-1"
              ß
              onClick={() => {
                navigator.clipboard.writeText(displayImage);
              }}>
              Copy Image URL
            </button>
            <h3>Thumbnail</h3>
            <div>
              {/* Date.now() is needed so that the page rerenders the new image if the user overwrites the old image */}
              <img
                src={`${displayImage}?${Date.now()}`}
                alt="displayImage"
                style={{
                  width: "250px",
                  height: "250px",
                  padding: "10px",
                  margin: "10px",
                }}
              />
            </div>
            <h3>Product Page</h3>
            <div>
              {/* Date.now() is needed so that the page rerenders the new image if the user overwrites the old image */}
              <img
                src={`${displayImage}?${Date.now()}`}
                alt="displayImage"
                style={{
                  width: "700px",
                  height: "700px",
                  padding: "10px",
                  margin: "10px",
                }}
              />
            </div>
            <input
              className="btn btn-danger mb-5"
              type="button"
              value={"Delete"}
              onClick={deleteImage}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default UrlUpload;
