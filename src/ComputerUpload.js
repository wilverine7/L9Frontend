//This page was used to allow user to upload a folder of images to the server
// it got integrated into the UrlUpload.js page that now accepts a url do upload just one image

import React from "react";
import NavBar from "./NavBar";
import axios from "axios";
import { useState } from "react";

const ComputerUpload = () => {
  const [file1, setFile1] = useState(null);
  const [file2, setFile2] = useState(null);
  const [data, setData] = useState(null);
  const [data2, setData2] = useState(null);
  const [columnName, setColumnName] = useState(null);

  const [csvBool, setCsvBool] = useState(false);

  const handleCheckboxChange = (event) => {
    setCsvBool(event.target.checked);
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    file1.forEach((file) => formData.append("file[]", file));
    formData.append("file2", file2);
    formData.append("csvBool", csvBool);
    formData.append("columnName", columnName);

    // Make the POST request
    const response = await axios.post(
      "http://127.0.0.1:5000/ComputerUpload",
      formData,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    if (csvBool) {
      setData(response.data);
    } else {
      setData2(response.data);
    }
  };

  return (
    <div>
      <NavBar />
      <h1>Elastic Images</h1>
      <h2>Select a folder to upload images from:</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          webkitdirectory="true"
          directory=""
          onChange={(event) => {
            const files = [];
            const fileList = event.dataTransfer
              ? event.dataTransfer.files
              : event.target.files;
            for (let i = 0; i < fileList.length; i++) {
              files.push(fileList[i]);
            }

            setFile1(files);
          }}
          required
        />
        <br />
        <label>Do you have a CSV to try and match MPN and filename?</label>
        <input type="checkbox" onChange={handleCheckboxChange} />
        <br />
        <br />
        {csvBool && (
          <div>
            <h2>Select a CSV</h2>
            <input
              type="file"
              onChange={(event) => {
                setFile2(event.target.files[0]);
              }}
              required
            />
            <br />
            <br />
            <p>What column matches the filename?</p>
            <input
              type="text"
              name="filename"
              onChange={(event) => {
                setColumnName(event.target.value);
              }}
              required
            />
          </div>
        )}
        <input type="submit" value="Upload" className="button" />
      </form>
      {data && (
        <div>
          <ul>
            {Object.keys(data["Inventory Number"]).map((key) => (
              <li key={key}>
                <h3>SKU: {data["Inventory Number"][key]}</h3>
                <br />
                <img
                  src={data["Picture URLs"][key]}
                  alt={`Item ${key}`}
                  style={{ width: "250px", height: "250px" }}
                />
              </li>
            ))}
          </ul>
        </div>
      )}
      {data2 && (
        <div>
          <ul>
            {data2.map((item) => (
              <li key={item}>
                <h2>URL:</h2> <h4>{item}</h4>
                <br />
                <img
                  src={item}
                  alt={`Item ${item}`}
                  style={{ width: "250px", height: "250px" }}
                />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ComputerUpload;
