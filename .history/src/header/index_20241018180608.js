import "./style.css";

import React from "react";
import { VscGrabber, FaSmile } from "react-icons/vsc";
import { logotext, socialprofils } from "../content_option";

import { Link } from "react-router-dom";
import Themetoggle from "../components/themetoggle";
import bunnyIcon from "../assets/images/icon.jpg";

const Headermain = () => {
  return (
    <>
      <header className="fixed-top site__header">
        <div className="d-flex align-items-center justify-content-between">
          <Link className="navbar-brand nav_ac" to="/">
            {logotext}
          </Link>
          <div className="d-flex align-items-center">
            <nav>
              <ul className="nav_links">
                <li>
                  <Link to="/">Home</Link>
                </li>
                <li>
                  <Link to="/portfolio">Research</Link>
                </li>
                <li>
                  <Link to="/projects">Software Tools & Projects</Link>
                </li>
                <li>
                  <Link to="/about">CV (About Me)</Link>
                </li>
              </ul>
            </nav>
            
          </div>
        </div>
      </header>
      <div className="br-top"></div>
      <div className="br-bottom"></div>
      <div className="br-left"></div>
      <div className="br-right"></div>
    </>
  );
};

export default Headermain;
