import React, { useRef, useState } from "react";
import axios from "axios";
import { backend_url, getCookie } from "../../constant";
import "./index.css";
import { toast } from "react-toastify";
const EditTestCandidateDetails = ({
  close,
  testDetails,
  updateTestDetailsOnPage,
}) => {
  const [candidateSetting, setcandidateSetting] = useState(
    testDetails.candiateSettings
  );

  const updateTestDetails = async () => {
    try {
      if (candidateSetting.length) {
        const token = getCookie("Xh7ERL0G");
        const requestBody = {
          candiateSettings: candidateSetting,
          name: testDetails.name,
          startDate: testDetails.startDate,
          endDate: testDetails.endDate,
          cutOff: testDetails.cutOff,
          totalTiming: testDetails.totalTiming,
          totalScore: testDetails.totalScore,
          testType: testDetails?.testType,
          testInviteOnly: testDetails?.testInviteOnly,
        };

        const url = `${backend_url}test/update/${testDetails._id}`;

        const config = {
          headers: { token: token },
        };

        const res = await axios.put(url, requestBody, config);
        updateTestDetailsOnPage(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const removeDetails = (val) => {
    if (val !== "Name" && val !== "Email") {
      setcandidateSetting(
        candidateSetting.filter((data, index) => {
          return data !== val;
        })
      );
    } else {
      toast.error("Name and email are compulsory fields");
    }
  };

  const addTestCandidateData = (value) => {
    if (value === "") {
      return;
    }
    if (candidateSetting?.includes(value)) {
      toast.error("Already Selected");
    } else {
      setcandidateSetting((prev) => [...prev, value]);
    }
  };

  return (
    <div className="edit-candidate-details-modal-container">
      <div className="edit-candidate-details-modal">
        <div className="heading-of-edit-test-details">
          <span>Edit Test Candidate Setting</span>

          {/* cancel icon */}
          <svg
            onClick={close}
            style={{ cursor: "pointer" }}
            width="15"
            height="14"
            viewBox="0 0 15 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M12.9863 13.6551L7.97706 8.65882L2.96898 13.6551C2.50802 14.1148 1.7605 14.1151 1.29925 13.6554C0.838013 13.1957 0.837725 12.4499 1.29853 11.99L6.3077 6.99369L1.29846 1.99628C0.850335 1.534 0.856676 0.798602 1.31287 0.34437C1.769 -0.110149 2.50622 -0.115324 2.96898 0.332296L7.97706 5.32856L12.9863 0.332296C13.4508 -0.103824 14.1786 -0.0928997 14.6298 0.35702C15.081 0.806652 15.0925 1.53256 14.6557 1.99628L9.64642 6.99369L14.6557 11.99C15.1041 12.4519 15.0982 13.1873 14.6423 13.6419C14.1866 14.0967 13.4493 14.1024 12.9862 13.6551H12.9863Z"
              fill="#99B2C6"
            />
          </svg>
        </div>

        <div className="border-of-edit-test-details"></div>

        <div className="custom-input-box">
          <span>
            Candidate Data To Be Collected{" "}
            <label style={{ color: "red" }}>*</label>
          </span>
          <div className="select-box-container">
            <div className="select-box">
              <select
                name=""
                id=""
                onChange={(e) => addTestCandidateData(e.target.value)}
              >
                <option value="Select">Select</option>

                {!candidateSetting.includes("Name") && (
                  <option value="Name">Name</option>
                )}
                {!candidateSetting.includes("Email") && (
                  <option value="Email">Email</option>
                )}
                {!candidateSetting.includes("Phone No.") && (
                  <option value="Phone No.">Phone No.</option>
                )}
                {!candidateSetting.includes("College") && (
                  <option value="College">College</option>
                )}
                {/* <option value="">Select</option>
                <option value="Name">Name</option>
                <option value="Email">Email</option>
                <option value="Phone No.">Phone No.</option>
                <option value="College">College</option> */}
              </select>
              <svg
                className="vector-svg"
                width="14"
                height="8"
                viewBox="0 0 14 8"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1 1L7 7L13 1"
                  stroke="black"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>
          </div>
          {candidateSetting?.length === 0 ? (
            <p style={{ color: "red", fontSize: 12, fontWeight: "normal" }}>
              Please add alteast one candidate data
            </p>
          ) : (
            <div></div>
          )}
          <div
            style={!candidateSetting?.length ? { marginTop: "0px" } : {}}
            className="candidate-list-item-container"
          >
            {candidateSetting?.map((data, index) => {
              return (
                <button>
                  <span>{data}</span>
                  <svg
                    onClick={() => {
                      removeDetails(data);
                    }}
                    width="20"
                    height="21"
                    viewBox="0 0 20 21"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle cx="10" cy="10.5" r="10" fill="#00C49A" />
                    <path
                      d="M13 7.5L7 13.5"
                      stroke="white"
                      stroke-linecap="round"
                    />
                    <path
                      d="M13 13.5L7.00019 7.50019"
                      stroke="white"
                      stroke-linecap="round"
                    />
                  </svg>
                </button>
              );
            })}
          </div>
        </div>
        <div className="bottom-save-cancel-container">
          <div className="save-cancel-container">
            <button onClick={close}>
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

              <span>Cancel</span>
            </button>
            <button onClick={() => updateTestDetails()}>
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
              <span>Save</span>{" "}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditTestCandidateDetails;
