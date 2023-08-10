// this page was integrated into the PhotoApp.js page so
// we can pass data back to the API which I couldn't do when it was a child component

import React from "react";
import axios from "axios";

const PreviewPage = ({ json }) => {
  const data = JSON.parse(json);
  const renderImages = (images) => {
    const imageKeys = Object.keys(images).filter(
      (key) => key.startsWith("Server Image") && images[key]
    );

    const deleteImage = async (key) => {
      console.log("delete image with key:", images[key]);
      const formData = new FormData();
      formData.append("url", images[key]);
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
      console.log(response);
      // You can implement your delete image logic here
    };

    return (
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3">
        {imageKeys.map((key) => (
          <div key={key} className="col mb-3">
            <div className="text-center">
              <p>Image {key.slice(-1)}</p>
              <img
                style={{ maxWidth: "100%", height: "auto" }}
                src={images[key]}
                alt={key}
                className="border"
              />
              <button
                className="btn btn-danger mt-2"
                onClick={() => deleteImage(key)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div>
      {Object.entries(data).map(([sku, skuData]) => (
        <div key={sku} className="card mb-3">
          <div className="card-body">
            <h2 className="card-title">{skuData.Title}</h2>
            <p className="card-title">SKU: {sku}</p>
            {renderImages(skuData)}
          </div>
        </div>
      ))}
    </div>
  );
};

export default PreviewPage;
