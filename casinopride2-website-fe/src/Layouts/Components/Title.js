import React from "react";
import "../../assets/Styles/style.css";

const Title = ({ name, size }) => {
  return (
    <div>
      <ul class="nav nav-tabs row justify-content-center" role="tablist">
        <li className={`nav-item col-lg-${size}`}>
          <p
            class="nav-link active "
            data-toggle="tab"
            href="#tabs-1"
            role="tab"
            style={{
              textAlign: size == "6" ? "center" : "left",
              backgroundColor: "#D3AA1A",
              borderRadius: "0px",
              marginBottom: "10px",
              paddingLeft: size == "6" ? "0px" : "20px",
            }}
          >
            {name}
          </p>
        </li>
      </ul>
    </div>
  );
};

export default Title;
