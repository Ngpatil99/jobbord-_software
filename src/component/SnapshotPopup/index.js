import React, { useState } from "react";
import "./index.css";
import snapshot from "../../assets/images/snapshot.png";

function SnapshotPopup(props) {
  const [all, setAll] = useState(false);
  const [missing, setMissing] = useState(false);
  const [multiple, setMultiple] = useState(false);
  const [selectedPhoto, setselectedPhoto] = useState(0);

  const prevSnapShot = () => {
    if (selectedPhoto !== 0) {
      setselectedPhoto(() => selectedPhoto - 1);
    }
  };

  const nextSnapShot = () => {
    if (selectedPhoto !== props.snapshot.length - 1) {
      setselectedPhoto(() => selectedPhoto + 1);
    }
  };

  return (
    <div className="snapshot">
      <div className="snapshot-box">
        <div className="snapshot-header">
          <span>Candidate Snapshots</span>
          <svg
            style={{ cursor: "pointer" }}
            onClick={() => {
              props.close();
            }}
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M12.0032 13.6551L7.00642 8.65882L2.01082 13.6551C1.55102 14.1148 0.805358 14.1151 0.345266 13.6554C-0.114825 13.1957 -0.115113 12.4499 0.344547 11.99L5.34122 6.99369L0.344476 1.99628C-0.102534 1.534 -0.0962087 0.798602 0.358851 0.34437C0.813839 -0.110149 1.54922 -0.115324 2.01082 0.332296L7.00642 5.32856L12.0032 0.332296C12.4666 -0.103824 13.1925 -0.0928997 13.6426 0.35702C14.0927 0.806652 14.1041 1.53256 13.6684 1.99628L8.67162 6.99369L13.6684 11.99C14.1157 12.4519 14.1098 13.1873 13.6551 13.6419C13.2004 14.0967 12.4651 14.1024 12.0031 13.6551H12.0032Z"
              fill="#99B2C6"
            />
          </svg>
        </div>
        <div className="snapshot-check-box">
          <div className="snapshot-input">
            {all ? (
              <svg
                onClick={() => {
                  setAll(false);
                }}
                width="15"
                height="16"
                viewBox="0 0 15 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  y="0.257812"
                  width="15"
                  height="15"
                  rx="2"
                  fill="#FF6812"
                />
                <path
                  d="M12 4.75781L6.5 10.2578L4 7.75781"
                  stroke="white"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            ) : (
              <svg
                onClick={() => {
                  setAll(true);
                }}
                width="15"
                height="16"
                viewBox="0 0 20 21"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  x="0.5"
                  y="1.38086"
                  width="19"
                  height="19"
                  rx="1.5"
                  stroke="#827C7C"
                />
              </svg>
            )}
            <span>All({props?.snapshot?.length})</span>
          </div>
          <div className="snapshot-input">
            {missing ? (
              <svg
                onClick={() => {
                  setMissing(false);
                }}
                width="15"
                height="16"
                viewBox="0 0 15 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  y="0.257812"
                  width="15"
                  height="15"
                  rx="2"
                  fill="#FF6812"
                />
                <path
                  d="M12 4.75781L6.5 10.2578L4 7.75781"
                  stroke="white"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            ) : (
              <svg
                onClick={() => {
                  setMissing(true);
                }}
                width="15"
                height="16"
                viewBox="0 0 20 21"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  x="0.5"
                  y="1.38086"
                  width="19"
                  height="19"
                  rx="1.5"
                  stroke="#827C7C"
                />
              </svg>
            )}
            <span>Candidate Missing</span>
          </div>
          <div className="snapshot-input">
            {multiple ? (
              <svg
                onClick={() => {
                  setMultiple(false);
                }}
                width="15"
                height="16"
                viewBox="0 0 15 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  y="0.257812"
                  width="15"
                  height="15"
                  rx="2"
                  fill="#FF6812"
                />
                <path
                  d="M12 4.75781L6.5 10.2578L4 7.75781"
                  stroke="white"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            ) : (
              <svg
                onClick={() => {
                  setMultiple(true);
                }}
                width="15"
                height="16"
                viewBox="0 0 20 21"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  x="0.5"
                  y="1.38086"
                  width="19"
                  height="19"
                  rx="1.5"
                  stroke="#827C7C"
                />
              </svg>
            )}
            <span>Multiple Candidates</span>
          </div>
        </div>

        <div className="snapshot-pic-container">
          <div className="snapshot-left-container">
            {props.snapshot.map((snapshot, index) => (
              <div key={index} className="row">
                <img src={snapshot} alt={`Snapshot ${index + 1}`} />
              </div>
            ))}
          </div>
          <div className="snapshot-right-cotnainer">
            <div className="right-box">
              <img src={props.snapshot[selectedPhoto]} alt="" />
              <svg
                style={{ marginTop: "20px" }}
                width="344"
                height="16"
                viewBox="0 0 344 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <line
                  y1="6.57715"
                  x2="344"
                  y2="6.57715"
                  stroke="#FEE9E1"
                  stroke-width="3"
                />
                <line
                  y1="7.5"
                  x2={(344 / props?.snapshot?.length) * (1 + selectedPhoto)}
                  y2="7.5"
                  stroke="#FF6812"
                  stroke-width="3"
                />
                <circle
                  cx={(336 / props?.snapshot?.length) * (1 + selectedPhoto)}
                  cy="8"
                  r="8"
                  fill="#FF6812"
                />
              </svg>
              <div className="navigation">
                <svg
                  onClick={prevSnapShot}
                  width="8"
                  height="14"
                  viewBox="0 0 8 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6.9375 0.945312L1.14625 6.91352L6.9375 12.8817"
                    stroke="black"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                <span>
                  {selectedPhoto + 1}/{props.snapshot.length}
                </span>
                <svg
                  onClick={nextSnapShot}
                  width="7"
                  height="15"
                  viewBox="0 0 7 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M0.804688 13.374L5.98633 7.40582L0.804687 1.43762"
                    stroke="black"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SnapshotPopup;
