import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./index.css";
import { backend_url } from "../../constant";
import axios from "axios";
import { getCookie } from "../../constant";
import jwtDecode from "jwt-decode";

function CandidateInvite(props) {
  let navigate = useNavigate();
  const [personName, setPersonName] = useState("");
  const [email, setEmail] = useState("");
  const [validity, setValidity] = useState("1");

  const sendInvite = () => {
    if (personName.length > 0 && email.length > 0 && validity.length > 0) {
      const token = getCookie("Xh7ERL0G");
      const decode = jwtDecode(token);
      const companyEmail = decode?.client?.companyEmail.split("@")[1];
      if (props?.testData?.testType === "private") {
        if (email.split("@")[1] === companyEmail) {
          inviteCandidate();
        } else {
          toast.error(
            "Only candidates within the company can be invited in private test"
          );
        }
      } else {
        if (email.split("@")[1] !== companyEmail) {
          inviteCandidate();
        } else {
          toast.error(
            "Only candidates outside the company can be invited in public test"
          );
        }
      }
    } else if (personName.length == 0) toast.error("Person Name is required");
    else if (email.length == 0) toast.error("Valid email is required");
    else {
      toast.error("Select Validity of invite");
    }
  };

  const inviteCandidate = async () => {
    try {
      const token = getCookie("Xh7ERL0G");
      const decode = jwtDecode(token);
      const currentDate =
        new Date(props.testData.startDate) > new Date()
          ? new Date(props.testData.startDate)
          : new Date();
      const validityEndDate = new Date(currentDate);

      validityEndDate.setDate(currentDate.getDate() + parseInt(validity));
      const res = await axios.post(
        `${backend_url}invites/create`,
        {
          testId: props.testId,
          candidateName: personName,
          candidateEmail: email,
          validity: validity,
          validityStartDate: currentDate,
          validityEndDate:
            validityEndDate > new Date(props.testData.endDate)
              ? new Date(props.testData.endDate)
              : validityEndDate,
          status: [{ currentStatus: "Invited", statusDate: validityEndDate }],
          invitedBy: decode.user_id,
          inviteTime: new Date(),
        },
        { headers: { token: token } }
      );
      if (Object.keys(res.data.data).length > 0) {
        props.invitedCandidate();
      } else {
        toast.error("candidate has already invited!");
      }
    } catch (error) {
      toast.error(error);
    }
  };

  const handleNameChange = (e) => {
    const newName = e.target.value;

    // Check if the new name contains numeric characters
    if (!/\d/.test(newName)) {
      setPersonName(newName);
    }
  };

  return (
    <div className="candidate-invite-container">
      <div className="invite-box">
        <div className="header">
          <div className="title">
            <span>Invite Candidates</span>
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              onClick={() => {
                props.closePopup();
              }}
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

        <div className="name-field">
          <span>Name</span>
          <div className="input-field">
            <svg
              width="18"
              height="19"
              viewBox="0 0 18 19"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15 15.5166V14.0166C15 13.221 14.6839 12.4579 14.1213 11.8953C13.5587 11.3327 12.7957 11.0166 12 11.0166H6C5.20435 11.0166 4.44129 11.3327 3.87868 11.8953C3.31607 12.4579 3 13.221 3 14.0166V15.5166"
                stroke="#333333"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M9 8.0166C10.6569 8.0166 12 6.67346 12 5.0166C12 3.35975 10.6569 2.0166 9 2.0166C7.34315 2.0166 6 3.35975 6 5.0166C6 6.67346 7.34315 8.0166 9 8.0166Z"
                stroke="#333333"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <input
              value={personName}
              onChange={handleNameChange}
              type="text"
              placeholder="Person Name Here"
            />
          </div>
        </div>

        <div className="email-validity">
          <div className="email-field">
            <span>Email</span>
            <div className="input-field">
              <svg
                width="19"
                height="18"
                viewBox="0 0 19 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3.5 3H15.5C16.325 3 17 3.675 17 4.5V13.5C17 14.325 16.325 15 15.5 15H3.5C2.675 15 2 14.325 2 13.5V4.5C2 3.675 2.675 3 3.5 3Z"
                  stroke="#333333"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M17 4.5L9.5 9.75L2 4.5"
                  stroke="#333333"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              <input
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                type="text"
                placeholder="Something@something.com"
              />
            </div>
          </div>
          <div className="validity-field">
            <span>Validity</span>
            <div className="select-input">
              <select
                onChange={(e) => {
                  setValidity(e.target.value);
                }}
                name=""
                id=""
              >
                <option value="1">1 Day</option>
                <option value="2">2 Days</option>
                <option value="3">3 Days</option>
                <option value="4">4 Days</option>
                <option value="5">5 Days</option>
                <option value="6">6 Days</option>
                <option value="7">7 Days</option>
              </select>
            </div>
          </div>
        </div>

        <div className="button-container">
          <button
            className="send-invite"
            onClick={() => {
              sendInvite();
            }}
          >
            <svg
              width="21"
              height="20"
              viewBox="0 0 21 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="10.5" cy="10" r="10" fill="white" />
              <path
                d="M15.5 5L10 10.5"
                stroke="#FF6812"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M15.5 5L12 15L10 10.5L5.5 8.5L15.5 5Z"
                stroke="#FF6812"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            Send Invite
          </button>
          <span>OR</span>
          <button
            className="candidate-invite-bulk-invite"
            onClick={() => {
              navigate("/bulkinvite");
            }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="10" cy="10" r="10" fill="#00C49A" />
              <g clip-path="url(#clip0_3117_3124)">
                <path
                  d="M15 6L9.5 11.5"
                  stroke="white"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M15 6L11.5 16L9.5 11.5L5 9.5L15 6Z"
                  stroke="white"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </g>
              <defs>
                <clipPath id="clip0_3117_3124">
                  <rect
                    width="12"
                    height="12"
                    fill="white"
                    transform="translate(4 5)"
                  />
                </clipPath>
              </defs>
            </svg>
            Bulk Invite
          </button>
        </div>
      </div>
    </div>
  );
}

export default CandidateInvite;
