import React from "react";
import "./index.css";
import { useNavigate } from "react-router-dom";
import moment from "moment";

function TestTakenCard(props) {
  const navigate = useNavigate();
  console.log(props);

  return (
    <div
      className="test-taken-card"
      onClick={() => {
        navigate("/singlecandidate", {
          state: { id: props.candidate.invite._id, rank: props.no },
        });
      }}
    >
      <div className="first">
        <div className="header">
          {props.selectedCandidates.some(
            (e) => e.invite._id === props.candidate.invite._id
          ) ? (
            <svg
              className="selected-check-box"
              onClick={(e) => {
                e.stopPropagation();
                const removedArray = props.selectedCandidates.filter(
                  (data) => data.invite._id !== props.candidate.invite._id
                );
                props.setSelectedCandidates(removedArray);
                props.setSelectedAll(false);
              }}
              width="20"
              height="20"
              viewBox="0 0 15 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="15" height="15" rx="2" fill="#FF6812" />
              <path
                d="M12 4.5L6.5 10L4 7.5"
                stroke="white"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          ) : (
            <svg
              className="check-box"
              onClick={(e) => {
                e.stopPropagation();
                props.setSelectedCandidates([
                  ...props.selectedCandidates,
                  props.candidate,
                ]);
              }}
              width="20"
              height="21"
              viewBox="0 0 20 21"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                x="0.5"
                y="1.30664"
                width="19"
                height="19"
                rx="1.5"
                stroke="#DDDDDD"
              />
            </svg>
          )}

          <span style={{ textTransform: "capitalize" }}>
            {props.no}. {props.candidate.invite.candidateName}
          </span>
          <div
            className="status"
            onClick={(e) => {
              e.stopPropagation();
              props.moveToPass(props.candidate.invite._id);
              //updateCandidateStatus()
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

            <span>Move back to passed</span>
          </div>
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
                d="M13.4938 9.26504L9.0125 13.7463C8.89641 13.8625 8.75855 13.9547 8.6068 14.0176C8.45505 14.0805 8.29239 14.1129 8.12813 14.1129C7.96386 14.1129 7.8012 14.0805 7.64945 14.0176C7.4977 13.9547 7.35984 13.8625 7.24375 13.7463L1.875 8.38379V2.13379H8.125L13.4938 7.50254C13.7266 7.73674 13.8572 8.05356 13.8572 8.38379C13.8572 8.71402 13.7266 9.03084 13.4938 9.26504V9.26504Z"
                stroke="#827C7C"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M5 5.25879H5.00625"
                stroke="#827C7C"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>

            <span>
              Reviewed At:{" "}
              {props.finishedDate !== undefined
                ? moment(props.finishedDate).format("DD-MM-YYYY hh:mm A")
                : "-"}
            </span>
          </div>
        </div>
      </div>
      <div className="second">
        <span className="score">
          {props.candidate.candidateResult.candidate_total_Score}/
          {props.candidate.invite.testId.totalScore}
        </span>
        <p>Candidate Score</p>
      </div>
      <div className="third">
        <span>
          {(
            props.candidate.candidateResult.candidate_total_time_spent / 60
          ).toFixed(2)}
        </span>
        <p>Duration (mins)</p>
      </div>
      <div className="fourth">
        <button
          style={{ cursor: "pointer" }}
          onClick={(e) => {
            e.stopPropagation();
            props.setLoaderIndex(props.no - 1);
            props.moveToShortlisted(props.candidate.invite._id);
          }}
        >
          <svg
            width="14"
            height="15"
            viewBox="0 0 14 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clip-path="url(#clip0_3068_2027)">
              <path
                d="M9.33594 13.1338V11.9671C9.33594 11.3483 9.0901 10.7548 8.65252 10.3172C8.21493 9.87962 7.62144 9.63379 7.0026 9.63379H2.91927C2.30043 9.63379 1.70694 9.87962 1.26936 10.3172C0.83177 10.7548 0.585938 11.3483 0.585938 11.9671V13.1338"
                stroke="white"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M4.95833 7.30046C6.247 7.30046 7.29167 6.25579 7.29167 4.96712C7.29167 3.67846 6.247 2.63379 4.95833 2.63379C3.66967 2.63379 2.625 3.67846 2.625 4.96712C2.625 6.25579 3.66967 7.30046 4.95833 7.30046Z"
                stroke="white"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M11.6641 5.55078V9.05078"
                stroke="white"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M13.4141 7.30078H9.91406"
                stroke="white"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </g>
            <defs>
              <clipPath id="clip0_3068_2027">
                <rect
                  width="14"
                  height="14"
                  fill="white"
                  transform="translate(0 0.883789)"
                />
              </clipPath>
            </defs>
          </svg>
          {props.loading && props.loaderIndex === props.no - 1
            ? "Shortlisting..."
            : "Shortlist"}
        </button>
      </div>
    </div>
  );
}

export default TestTakenCard;
