import React from "react";
import { Link } from "react-router-dom";

function NavBar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <a className="navbar-brand" href="/">
        Home
      </a>
      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav">
          <li className="nav-item active">
            <a className="nav-link" href="/Listing">
              Listing <span className="sr-only"></span>
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="/Photo">
              Photos
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="/UrlUpload">
              Single Image
            </a>
          </li>
          {/* <li className="nav-item">
            <a className="nav-link" href="/ComputerUpload">
              Computer Upload
            </a>
          </li> */}
        </ul>
      </div>
    </nav>
  );
}

export default NavBar;
