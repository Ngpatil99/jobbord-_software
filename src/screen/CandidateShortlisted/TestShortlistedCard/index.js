import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import "./index.css";
import axios from "axios";
import { backend_url, getCookie } from "../../../constant";
import { toast } from "react-toastify";
import TestSummaryContext from "../../../store/TestSummaryContext";
import moment from "moment";

function TestShortlistedCard(props) {
  const navigate = useNavigate();
  const context = useContext(TestSummaryContext);
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "April",
    "May",
    "June",
    "July",
    "Aug",
    "Sept",
    "Oct",
    "Nov",
    "Dec",
  ];

  const formateDate = (time) => {
    const date = new Date(time);
    const day = days[date.getDay()];
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    let hours = date.getHours();
    let minutes = date.getMinutes();

    let ampm = hours >= 12 ? "pm" : "am";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? "0" + minutes : minutes;
    const strTime = hours + ":" + minutes + " " + ampm;

    return ` ${day}-${month}-${year} at ${strTime}`;
  };
  const updateCandidateStatus = async () => {
    try {
      const token = getCookie("Xh7ERL0G");
      const body = {
        testId: props.candidate.testId,
        candidateName: props.candidate.candidateName,
        candidateMobile: props.candidate.candidateMobile,
        candidateCollege: props.candidate.candidateCollege,
        candidateEmail: props.candidate.candidateEmail,
        validity: props.candidate.validity,
        validityStartDate: props.candidate.validityStartDate,
        validityEndDate: props.candidate.validityEndDate,
        testScore: props.candidate.testScore,
        status: "reviewed",
      };
      const response = await axios.put(
        `${backend_url}invites/update/${props.candidate._id}`,
        body,
        { headers: { token: token } }
      );
      if (response.status === 200) {
        context.getCandidates();
      }
    } catch (error) {
      toast.error("Opps, Please try again!");
    }
  };
  return (
    <div
      className="test-shortlisted-card"
      onClick={() => {
        navigate("/singlecandidate", {
          state: { id: props.candidate.invite._id, rank: props.no },
        });
      }}
    >
      <div className="first">
        <div className="header">
          <span>
            {props.no}. {props.candidate.invite.candidateName}{" "}
          </span>
          {props.candidate?.candidateResult?.candidate_total_Score <
          context.cutOffScore ? (
            <svg
              width="16"
              height="17"
              viewBox="0 0 16 17"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8.0023 12.2139C8.15806 12.2139 8.28872 12.1612 8.39427 12.0558C8.49983 11.9505 8.5526 11.8199 8.5526 11.6642C8.5526 11.5084 8.49993 11.3778 8.39457 11.2722C8.2892 11.1666 8.15865 11.1139 8.0029 11.1139C7.84715 11.1139 7.71649 11.1665 7.61094 11.2719C7.50538 11.3773 7.4526 11.5078 7.4526 11.6636C7.4526 11.8193 7.50528 11.95 7.61064 12.0555C7.716 12.1611 7.84656 12.2139 8.0023 12.2139ZM7.5526 9.66387H8.5526V5.4472H7.5526V9.66387ZM8.00704 15.5472C7.08777 15.5472 6.22388 15.3722 5.41537 15.0222C4.60686 14.6722 3.89983 14.1944 3.29427 13.5889C2.68872 12.9833 2.21094 12.2759 1.86094 11.4665C1.51094 10.6572 1.33594 9.79241 1.33594 8.8722C1.33594 7.95199 1.51094 7.08722 1.86094 6.27788C2.21094 5.46854 2.68872 4.76387 3.29427 4.16387C3.89983 3.56387 4.60728 3.08887 5.41662 2.73887C6.22595 2.38887 7.09073 2.21387 8.01094 2.21387C8.93115 2.21387 9.79592 2.38887 10.6053 2.73887C11.4146 3.08887 12.1193 3.56387 12.7193 4.16387C13.3193 4.76387 13.7943 5.46942 14.1443 6.28053C14.4943 7.09165 14.6693 7.95683 14.6693 8.8761C14.6693 9.79537 14.4943 10.6593 14.1443 11.4678C13.7943 12.2763 13.3193 12.9823 12.7193 13.5858C12.1193 14.1893 11.4137 14.6671 10.6026 15.0191C9.79149 15.3712 8.9263 15.5472 8.00704 15.5472ZM8.01094 14.5472C9.58316 14.5472 10.9193 13.9944 12.0193 12.8889C13.1193 11.7833 13.6693 10.4444 13.6693 8.8722C13.6693 7.29998 13.1203 5.96387 12.0224 4.86387C10.9245 3.76387 9.58455 3.21387 8.0026 3.21387C6.43594 3.21387 5.09983 3.76282 3.99427 4.86073C2.88872 5.95866 2.33594 7.29859 2.33594 8.88053C2.33594 10.4472 2.88872 11.7833 3.99427 12.8889C5.09983 13.9944 6.43872 14.5472 8.01094 14.5472Z"
                fill="#EA3A3D"
              />
            </svg>
          ) : (
            <></>
          )}

          {props.candidate?.candidateResult?.candidate_total_Score <
          context.cutOffScore ? (
            <div
              className="status"
              onClick={(e) => {
                e.stopPropagation();
                props.moveToPass(props.candidate.invite._id);
              }}
              style={{
                cursor: "pointer",
              }}
            >
              <svg
                width="14"
                height="15"
                viewBox="0 0 14 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M11.0859 7.88086L2.91927 7.88086"
                  stroke="#FF6812"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M7 11.9639L2.91667 7.88053L7 3.7972"
                  stroke="#FF6812"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>

              <span>Move back to test taken</span>
            </div>
          ) : (
            <div
              className="status"
              onClick={(e) => {
                e.stopPropagation();
                props.moveToPass(props.candidate.invite._id);
              }}
              style={{
                cursor: "pointer",
              }}
            >
              <svg
                width="14"
                height="15"
                viewBox="0 0 14 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M11.0859 7.88086L2.91927 7.88086"
                  stroke="#FF6812"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M7 11.9639L2.91667 7.88053L7 3.7972"
                  stroke="#FF6812"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>

              <span>Move back to pass</span>
            </div>
          )}
        </div>

        <div className="bottom" style={{ marginTop: "12px" }}>
          <div className="tags">
            <svg
              width="11"
              height="15"
              viewBox="0 0 11 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10.5576 3.97282L7.5786 0.993853C7.53127 0.947992 7.46804 0.922202 7.40214 0.921875H1.33972C0.984594 0.922489 0.644187 1.06383 0.393073 1.31495C0.14196 1.56606 0.000613878 1.90647 0 2.2616V13.049C0.000613878 13.4042 0.14196 13.7446 0.393073 13.9957C0.644187 14.2468 0.984594 14.3881 1.33972 14.3887H9.28518C9.64031 14.3881 9.98071 14.2468 10.2318 13.9957C10.4829 13.7446 10.6243 13.4042 10.6249 13.049V4.13767C10.6251 4.10711 10.6192 4.07682 10.6077 4.04853C10.5961 4.02024 10.5791 3.99451 10.5576 3.97282ZM7.63433 1.71596L9.82385 3.90548H7.63433V1.71596ZM9.28518 13.9244H1.33972C1.22477 13.9244 1.11094 13.9017 1.00474 13.8577C0.898539 13.8138 0.802042 13.7493 0.720758 13.668C0.639475 13.5867 0.574997 13.4902 0.531007 13.384C0.487016 13.2778 0.464375 13.164 0.464375 13.049V2.2616C0.464375 2.02944 0.556599 1.80679 0.720758 1.64263C0.884918 1.47847 1.10757 1.38625 1.33972 1.38625H7.16995V4.13767C7.16995 4.19925 7.19441 4.25831 7.23796 4.30185C7.2815 4.3454 7.34056 4.36986 7.40214 4.36986H10.1605V13.049C10.1605 13.164 10.1379 13.2778 10.0939 13.384C10.0499 13.4902 9.98542 13.5867 9.90414 13.668C9.82286 13.7493 9.72636 13.8138 9.62016 13.8577C9.51396 13.9017 9.40013 13.9244 9.28518 13.9244Z"
                fill="#827C7C"
              />
              <path
                d="M2.9943 5.96746C3.50686 5.96746 3.99846 5.76401 4.36111 5.40179C4.72376 5.03958 4.92781 4.54822 4.92842 4.03566C4.8309 1.4816 1.1577 1.4816 1.0625 4.03566C1.06311 4.54782 1.26684 5.03882 1.62899 5.40097C1.99114 5.76312 2.48214 5.96685 2.9943 5.96746ZM2.9943 2.56592C3.38391 2.56653 3.75739 2.72158 4.03289 2.99707C4.30839 3.27257 4.46343 3.64605 4.46405 4.03566C4.39439 5.97907 1.59421 5.97907 1.52687 4.03566C1.52687 3.64627 1.6814 3.27278 1.95653 2.99722C2.23166 2.72165 2.6049 2.56653 2.9943 2.56592Z"
                fill="#827C7C"
              />
              <path
                d="M2.14958 5.12222C2.17808 5.13305 2.20845 5.13815 2.23893 5.13724C2.26941 5.13634 2.29942 5.12943 2.32723 5.11693C2.35505 5.10442 2.38012 5.08656 2.40103 5.06436C2.42194 5.04216 2.43828 5.01606 2.4491 4.98755L2.70218 4.32349H3.29426L3.54734 4.98755C3.5692 5.04513 3.61304 5.09166 3.66921 5.11692C3.72539 5.14217 3.78929 5.14408 3.84687 5.12222C3.90444 5.10036 3.95098 5.05652 3.97623 5.00035C4.00149 4.94418 4.0034 4.88027 3.98153 4.8227L3.2246 2.81195C3.20789 2.7679 3.17818 2.72997 3.1394 2.70321C3.10062 2.67644 3.05462 2.66211 3.00751 2.66211C2.96039 2.66211 2.91439 2.67644 2.87561 2.70321C2.83684 2.72997 2.80712 2.7679 2.79041 2.81195L2.02419 4.8227C2.0018 4.8791 2.00239 4.94204 2.02582 4.99802C2.04926 5.054 2.09368 5.09858 2.14958 5.12222ZM3.11548 3.85912H2.88329L2.99242 3.54566L3.11548 3.85912Z"
                fill="#827C7C"
              />
              <path
                d="M8.95573 7.08398H1.66969C1.60811 7.08398 1.54905 7.10845 1.50551 7.15199C1.46196 7.19553 1.4375 7.25459 1.4375 7.31617C1.4375 7.37775 1.46196 7.43681 1.50551 7.48035C1.54905 7.5239 1.60811 7.54836 1.66969 7.54836H8.95573C9.01731 7.54836 9.07637 7.5239 9.11991 7.48035C9.16346 7.43681 9.18792 7.37775 9.18792 7.31617C9.18792 7.25459 9.16346 7.19553 9.11991 7.15199C9.07637 7.10845 9.01731 7.08398 8.95573 7.08398Z"
                fill="#827C7C"
              />
              <path
                d="M8.95573 8.79297H1.66969C1.60811 8.79297 1.54905 8.81743 1.50551 8.86097C1.46196 8.90452 1.4375 8.96358 1.4375 9.02516C1.4375 9.08674 1.46196 9.14579 1.50551 9.18934C1.54905 9.23288 1.60811 9.25734 1.66969 9.25734H8.95573C9.01731 9.25734 9.07637 9.23288 9.11991 9.18934C9.16346 9.14579 9.18792 9.08674 9.18792 9.02516C9.18792 8.96358 9.16346 8.90452 9.11991 8.86097C9.07637 8.81743 9.01731 8.79297 8.95573 8.79297Z"
                fill="#827C7C"
              />
              <path
                d="M8.95573 10.5039H1.66969C1.60811 10.5039 1.54905 10.5284 1.50551 10.5719C1.46196 10.6155 1.4375 10.6745 1.4375 10.7361C1.4375 10.7977 1.46196 10.8567 1.50551 10.9003C1.54905 10.9438 1.60811 10.9683 1.66969 10.9683H8.95573C9.01731 10.9683 9.07637 10.9438 9.11991 10.9003C9.16346 10.8567 9.18792 10.7977 9.18792 10.7361C9.18792 10.6745 9.16346 10.6155 9.11991 10.5719C9.07637 10.5284 9.01731 10.5039 8.95573 10.5039Z"
                fill="#827C7C"
              />
              <path
                d="M8.95573 12.2129H1.66969C1.60811 12.2129 1.54905 12.2374 1.50551 12.2809C1.46196 12.3244 1.4375 12.3835 1.4375 12.4451C1.4375 12.5067 1.46196 12.5657 1.50551 12.6093C1.54905 12.6528 1.60811 12.6773 1.66969 12.6773H8.95573C9.01731 12.6773 9.07637 12.6528 9.11991 12.6093C9.16346 12.5657 9.18792 12.5067 9.18792 12.4451C9.18792 12.3835 9.16346 12.3244 9.11991 12.2809C9.07637 12.2374 9.01731 12.2129 8.95573 12.2129Z"
                fill="#827C7C"
              />
            </svg>
            <span>
              {(
                (props.candidate.candidateResult.candidate_test_questions.filter(
                  (ques) => ques.isBookMarked
                ).length /
                  props.candidate.invite.testId.totalNoOfQuestions) *
                100
              ).toFixed(0)}
              {"% "}
              Test Attempted
            </span>
          </div>
          <div className="date-time">
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M13.4938 9.26211L9.0125 13.7434C8.89641 13.8596 8.75855 13.9518 8.6068 14.0147C8.45505 14.0776 8.29239 14.11 8.12813 14.11C7.96386 14.11 7.8012 14.0776 7.64945 14.0147C7.4977 13.9518 7.35984 13.8596 7.24375 13.7434L1.875 8.38086V2.13086H8.125L13.4938 7.49961C13.7266 7.73381 13.8572 8.05063 13.8572 8.38086C13.8572 8.71109 13.7266 9.02791 13.4938 9.26211V9.26211Z"
                stroke="#827C7C"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M5 5.25586H5.00625"
                stroke="#827C7C"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>

            <span>
              Shortlisted At:{" "}
              {props.finishedDate !== undefined
                ? moment(props.finishedDate).format("DD-MM-YYYY hh:mm A")
                : "-"}
            </span>
          </div>
        </div>
      </div>
      <div className="right-side-border"></div>
      <div className="second">
        <div className="content">
          <span className="score">
            {props.candidate?.candidateResult?.candidate_total_Score}/
            {props.candidate.invite.testId.totalScore}
          </span>
          <p>Candidate Score</p>
        </div>
      </div>
      <div className="right-side-border"></div>
      <div className="third">
        <div className="content">
          <span>
            {(
              props.candidate?.candidateResult?.candidate_total_time_spent / 60
            ).toFixed(2)}
          </span>
          <p>Duration (mins)</p>
        </div>
      </div>
    </div>
  );
}

export default TestShortlistedCard;
