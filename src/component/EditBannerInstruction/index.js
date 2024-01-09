import React from "react";
import { useState } from "react";
import "./index.css";
// import { registerLocale, setDefaultLocale, getDefaultLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { enGB } from "date-fns/locale";
import DatePicker from "react-datepicker";
import { toast } from "react-toastify";
import axios from "axios";
import { backend_url, getCookie } from "../../constant";

function EditBannerInstruction(props) {
  const [testData, setTestData] = useState(props.testData);
  const [loading, setLoading] = useState(false);

  const updateTest = async () => {
    try {
      setLoading(true);
      const token = getCookie("Xh7ERL0G");
      const response = await axios.put(
        `${backend_url}test/update/${props.testData._id}`,
        testData,
        { headers: { token: token } }
      );
      if (response.status === 200) {
        setLoading(false);
        props.closeEditBannerInstruction();
        return toast.success("Test Details updated successfully");
      }
    } catch (error) {
      setLoading(false);
      toast.error("Failed to update test details.");
    }
  };

  return (
    <div className="edit-banner-instruction">
      <div className="edit-banner-instruction-box">
        <div className="header">
          <div className="title">
            <span>Edit Test Details</span>
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              onClick={props.closeEditBannerInstruction}
              style={{ cursor: "pointer" }}
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M12.0032 13.6551L7.00642 8.65882L2.01082 13.6551C1.55102 14.1148 0.805358 14.1151 0.345266 13.6554C-0.114825 13.1957 -0.115113 12.4499 0.344547 11.99L5.34122 6.99369L0.344476 1.99628C-0.102534 1.534 -0.0962087 0.798602 0.358851 0.34437C0.813839 -0.110149 1.54922 -0.115324 2.01082 0.332296L7.00642 5.32856L12.0032 0.332296C12.4666 -0.103824 13.1925 -0.0928997 13.6426 0.35702C14.0927 0.806652 14.1041 1.53256 13.6684 1.99628L8.67162 6.99369L13.6684 11.99C14.1157 12.4519 14.1098 13.1873 13.6551 13.6419C13.2004 14.0967 12.4651 14.1024 12.0031 13.6551H12.0032Z"
                fill="#99B2C6"
              />
            </svg>
          </div>
          <div className="header-border"></div>
        </div>

        <div className="row1">
          <div className="fields" style={{ width: "63%" }}>
            <span>Test Heading</span>
            <input
              type="text"
              placeholder="MERN stack Developer Test"
              value={testData.name}
              onChange={(e) => {
                setTestData({ ...testData, name: e.target.value });
              }}
            />
          </div>

          <div className="fields" style={{ width: "32%" }}>
            <span>Test Time</span>
            <input
              type="text"
              value={testData.totalTiming}
              onChange={(e) => {
                setTestData({ ...testData, totalTiming: e.target.value });
              }}
            />
          </div>
        </div>

        <div className="row1">
          <div className="date-settings" style={{ width: "63%" }}>
            <div className="date-fields">
              <span>Starts On</span>

              <div className="date-input-box">
                <svg
                  width="21"
                  height="20"
                  viewBox="0 0 21 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M15.849 3.33301H4.18229C3.26182 3.33301 2.51562 4.0792 2.51562 4.99967V16.6663C2.51562 17.5868 3.26182 18.333 4.18229 18.333H15.849C16.7694 18.333 17.5156 17.5868 17.5156 16.6663V4.99967C17.5156 4.0792 16.7694 3.33301 15.849 3.33301Z"
                    stroke="#00C49A"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M13.3477 1.66699V5.00033"
                    stroke="#00C49A"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M6.68359 1.66699V5.00033"
                    stroke="#00C49A"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M2.51562 8.33301H17.5156"
                    stroke="#00C49A"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>

                <DatePicker
                  placeholderText={"Select date"}
                  locale={enGB}
                  selected={new Date(testData.startDate)}
                  dateFormat="dd/MM/yyyy"
                  type="date"
                  onChange={(date) => {
                    setTestData({ ...testData, startDate: date });
                  }}
                />
              </div>
            </div>

            <div className="date-fields">
              <span>Ends On</span>
              <div className="date-input-box">
                <svg
                  width="21"
                  height="20"
                  viewBox="0 0 21 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M15.849 3.33301H4.18229C3.26182 3.33301 2.51562 4.0792 2.51562 4.99967V16.6663C2.51562 17.5868 3.26182 18.333 4.18229 18.333H15.849C16.7694 18.333 17.5156 17.5868 17.5156 16.6663V4.99967C17.5156 4.0792 16.7694 3.33301 15.849 3.33301Z"
                    stroke="#00C49A"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M13.3477 1.66699V5.00033"
                    stroke="#00C49A"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M6.68359 1.66699V5.00033"
                    stroke="#00C49A"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M2.51562 8.33301H17.5156"
                    stroke="#00C49A"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>

                <DatePicker
                  placeholderText={"Select date"}
                  locale={enGB}
                  selected={new Date(testData.endDate)}
                  dateFormat="dd/MM/yyyy"
                  type="date"
                  onChange={(date) => {
                    setTestData({ ...testData, endDate: date });
                  }}
                />
              </div>
            </div>
          </div>

          <div className="time-settings" style={{ width: "32%" }}>
            <div className="test-fields">
              <span>Test Score</span>
              <div className="input-box">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clip-path="url(#clip0_5258_2714)">
                    <path
                      d="M9.83333 11.6667C13.055 11.6667 15.6667 9.05499 15.6667 5.83333C15.6667 2.61167 13.055 0 9.83333 0C6.61167 0 4 2.61167 4 5.83333C4 9.05499 6.61167 11.6667 9.83333 11.6667Z"
                      stroke="black"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M6.84036 11.5747L5.83203 19.1664L9.9987 16.6664L14.1654 19.1664L13.157 11.5664"
                      stroke="black"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_5258_2714">
                      <rect width="20" height="20" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
                <input
                  type="number"
                  placeholder="700"
                  value={testData.totalScore}
                  onChange={(e) => {
                    setTestData({ ...testData, totalScore: e.target.value });
                  }}
                />
              </div>
            </div>
            <div className="test-fields">
              <span>Cutoff Score</span>
              <div className="input-box">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9.83333 12.6667C13.055 12.6667 15.6667 10.055 15.6667 6.83333C15.6667 3.61167 13.055 1 9.83333 1C6.61167 1 4 3.61167 4 6.83333C4 10.055 6.61167 12.6667 9.83333 12.6667Z"
                    stroke="black"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M6.84036 11.5747L5.83203 19.1664L9.9987 16.6664L14.1654 19.1664L13.157 11.5664"
                    stroke="black"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <line x1="7" y1="6.5" x2="13" y2="6.5" stroke="black" />
                </svg>
                <input
                  type="number"
                  placeholder="20"
                  value={testData.cutOff}
                  onChange={(e) => {
                    setTestData({ ...testData, cutOff: e.target.value });
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="test-type">
          <div className="test-title">
            <span>Test Type</span>
            <svg
              width="17"
              height="16"
              viewBox="0 0 17 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clip-path="url(#clip0_2432_6385)">
                <path
                  d="M8.01432 14.6663C11.6962 14.6663 14.681 11.6816 14.681 7.99967C14.681 4.31778 11.6962 1.33301 8.01432 1.33301C4.33242 1.33301 1.34766 4.31778 1.34766 7.99967C1.34766 11.6816 4.33242 14.6663 8.01432 14.6663Z"
                  stroke="#384455"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M8.01562 5.33301V7.99967"
                  stroke="#384455"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M8.01562 10.667H8.02146"
                  stroke="#384455"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </g>
              <defs>
                <clipPath id="clip0_2432_6385">
                  <rect
                    width="16"
                    height="16"
                    fill="white"
                    transform="translate(0.015625)"
                  />
                </clipPath>
              </defs>
            </svg>
          </div>
          <div className="test-button-banner" style={{ width: "100%" }}>
            <div className="temp">
              <div
                onClick={() => {
                  setTestData({ ...testData, testType: "public" });
                }}
                className={
                  testData.testType === "public"
                    ? "selected-banner-test"
                    : "unselected-test"
                }
              >
                <div className="auto-test">
                  {testData.testType === "public" ? (
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 18 18"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle
                        cx="9"
                        cy="9"
                        r="8"
                        fill="white"
                        stroke="#00C49A"
                        stroke-width="2"
                      />
                      <circle cx="9" cy="9" r="4.5" fill="#00C49A" />
                    </svg>
                  ) : (
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 18 18"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle
                        cx="9"
                        cy="9"
                        r="8"
                        fill="white"
                        stroke="#AAAAAA"
                        stroke-width="2"
                      />
                    </svg>
                  )}

                  <span>Public</span>
                </div>
              </div>
              <div
                onClick={() => {
                  setTestData({ ...testData, testType: "private" });
                }}
                className={
                  testData.testType === "private"
                    ? "selected-banner-test"
                    : "unselected-test"
                }
              >
                <div className="auto-test">
                  {testData.testType === "private" ? (
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 18 18"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle
                        cx="9"
                        cy="9"
                        r="8"
                        fill="white"
                        stroke="#00C49A"
                        stroke-width="2"
                      />
                      <circle cx="9" cy="9" r="4.5" fill="#00C49A" />
                    </svg>
                  ) : (
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 18 18"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle
                        cx="9"
                        cy="9"
                        r="8"
                        fill="white"
                        stroke="#AAAAAA"
                        stroke-width="2"
                      />
                    </svg>
                  )}
                  <span>Private</span>
                </div>
              </div>
              <div
                onClick={() => {
                  setTestData({ ...testData, testType: "invite only" });
                }}
                className={
                  testData.testType === "invite only"
                    ? "selected-banner-test"
                    : "unselected-test"
                }
              >
                <div className="auto-test">
                  <svg
                    width="21"
                    height="20"
                    viewBox="0 0 21 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect
                      x="0.015625"
                      width="20"
                      height="20"
                      rx="2"
                      fill={
                        testData.testType === "invite only"
                          ? "#FF6812"
                          : "#999999"
                      }
                    />
                    <path
                      d="M14.0156 8L8.51562 13.5L6.01562 11"
                      stroke="white"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                  <span>Invite Only</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          className="edit-test-instruction-btn"
          style={{ marginTop: "46px" }}
        >
          <button
            style={{ cursor: "pointer" }}
            className="cancel"
            onClick={props.closeEditBannerInstruction}
          >
            <svg
              width="18"
              height="19"
              viewBox="0 0 18 19"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="9" cy="9.5166" r="9" fill="white" />
              <path
                d="M12.5 6.0166L5.5 13.0166"
                stroke="#827C7C"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M5.5 6.0166L12.5 13.0166"
                stroke="#827C7C"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            Cancel
          </button>
          <button
            onClick={() => {
              updateTest();
            }}
            style={{ cursor: "pointer" }}
            className="save"
          >
            <svg
              width="18"
              height="19"
              viewBox="0 0 18 19"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="9" cy="9.5166" r="9" fill="white" />
              <path
                d="M11.9557 7.4248L7.3724 12.0081L5.28906 9.9248"
                stroke="#00C49A"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            {loading ? "Saving" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditBannerInstruction;
