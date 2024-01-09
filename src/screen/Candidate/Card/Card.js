import React from "react";
import "./Card.css";
function Card(props) {
  return (
    <div className="card-container">
      <div className="left-card">
        <span>01. Candidate Name Here</span>
        <div className="candidate-id">
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M2 2H10C10.55 2 11 2.45 11 3V9C11 9.55 10.55 10 10 10H2C1.45 10 1 9.55 1 9V3C1 2.45 1.45 2 2 2Z"
              stroke="#827C7C"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M11 3L6 6.5L1 3"
              stroke="#827C7C"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <span>username@webiste.com | </span>
          <span>
            {props.shortlisted ? (
              <sapn style={{ color: "#00C49A", fontWeight: "500" }}>
                Shortlisted
              </sapn>
            ) : (
              "Test Taken"
            )}
          </span>
        </div>
      </div>
      <div className="right-card">
        <span>20</span>
        <p>Tests Attempted</p>
      </div>
    </div>
  );
}

export default Card;
