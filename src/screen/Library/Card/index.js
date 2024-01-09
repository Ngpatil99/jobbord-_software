import React from "react";
import ReactTooltip from "react-tooltip";
import "./index.css";
import { backend_url, getCookie } from "../../../constant";
import { toast } from "react-toastify";
import axios from "axios";

const LibraryCard = (props) => {
  console.log(props.data);
  const token = getCookie("Xh7ERL0G");
  const {
    question,
    difficultyLevelId,
    Section_header,
    score,
    type,
    skillsId,
    noOfTimesUsed,
    clientId,
  } = props.data;
  const healthaCalculate = () => {
    if (noOfTimesUsed >= 0 && noOfTimesUsed <= 10) {
      return 1;
    } else if (noOfTimesUsed > 10 && noOfTimesUsed <= 20) {
      return 2;
    } else if (noOfTimesUsed > 20 && noOfTimesUsed <= 30) {
      return 3;
    } else if (noOfTimesUsed > 30 && noOfTimesUsed <= 40) {
      return 4;
    } else if (noOfTimesUsed > 40 && noOfTimesUsed <= 50) {
      return 5;
    } else if (noOfTimesUsed > 50 && noOfTimesUsed <= 60) {
      return 6;
    } else if (noOfTimesUsed > 60 && noOfTimesUsed <= 70) {
      return 7;
    } else if (noOfTimesUsed > 70 && noOfTimesUsed <= 80) {
      return 8;
    } else if (noOfTimesUsed > 80 && noOfTimesUsed <= 90) {
      return 9;
    } else if (noOfTimesUsed > 90) {
      return 10;
    }
  };
  const handleQuestionCard = (e) => {
    e.stopPropagation();
    props.sourceSelected !== "Draft"
      ? props.onClickQuestion(props.data)
      : props.onClickQuestion(props.data);
  };

  const onClickDeleteButton = (e) => {
    e.stopPropagation();
    props.deleteQuestionAsPerQuestionID();
  };

  const onClickTryQuestion = (e) => {
    e.stopPropagation();
    let url = `https://www.assessment.theeliteqa.com/preview/question/${props.data?._id}`;
    window.open(url, "_blank");
  };

  const truncateQuestionHeader = (questionHeader) => {
    if (questionHeader?.length > 93) {
      return questionHeader.substring(0, 93) + "...";
    }
    return questionHeader;
  };

  const truncateQuestionContent = (questionContent) => {
    if (questionContent?.length > 119) {
      return questionContent.substring(0, 119) + "...";
    }
    return questionContent;
  };

  return (
    <div
      style={{ cursor: "pointer" }}
      onClick={handleQuestionCard}
      className="library-card-container"
    >
      <div className="library-header-container">
        {props.sourceSelected !== "Draft" && (
          <button
            style={
              difficultyLevelId?.level === "easy"
                ? {}
                : difficultyLevelId?.level === "medium"
                ? { background: "#FEE9E1" }
                : { background: "#FFE4CB" }
            }
            className="status-button"
          >
            <div
              style={
                difficultyLevelId?.level === "easy"
                  ? {}
                  : difficultyLevelId?.level === "medium"
                  ? { background: "#FF9736" }
                  : { background: "#FF6812" }
              }
              className="circle"
            >
              {/* Document Icon */}
              <svg
                width="15"
                height="15"
                viewBox="0 0 15 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7.5 9.375C9.91625 9.375 11.875 7.41625 11.875 5C11.875 2.58375 9.91625 0.625 7.5 0.625C5.08375 0.625 3.125 2.58375 3.125 5C3.125 7.41625 5.08375 9.375 7.5 9.375Z"
                  stroke="white"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M5.13125 8.68105L4.375 14.3748L7.5 12.4998L10.625 14.3748L9.86875 8.6748"
                  stroke="white"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>
            <span>{difficultyLevelId?.level}</span>
          </button>
        )}
        <label>
          {props?.name === "mcqbulkpreview" ? `Q${props?.questionNo + 1}.` : ""}{" "}
          {truncateQuestionHeader(Section_header)}
        </label>
      </div>

      <p>{truncateQuestionContent(question)}</p>
      <div className="border"></div>
      {props.sourceSelected !== "Draft" ? (
        <div className="library-bottom-container">
          <div className="library-left-side">
            <span data-tip="Health">
              <svg
                width="15"
                height="15"
                viewBox="0 0 15 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12.5378 3.25091C11.3304 1.99709 9.33361 1.99709 8.12623 3.25091L7.52255 3.90103C7.47611 3.94747 7.3368 3.94747 7.29036 3.90103L6.68667 3.25091C5.4793 1.99709 3.52892 1.99709 2.32155 3.25091C1.11417 4.50472 1.11417 6.54797 2.32155 7.80178L3.06455 8.54478L7.3368 12.9563C7.38323 13.0028 7.52255 13.0028 7.56898 12.9563L11.8412 8.54478L12.5842 7.80178C13.7916 6.54797 13.7916 4.50472 12.5378 3.25091Z"
                  stroke="#F23E3E"
                  stroke-miterlimit="10"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M4.17969 6.96539H5.57281L6.50156 6.03664L7.43031 7.89414L8.35906 5.57227L9.28781 6.96539H10.6809"
                  stroke="#F23E3E"
                  stroke-miterlimit="10"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              <p>Health {healthaCalculate()}/10</p>
            </span>

            <div className="card-border"></div>

            <span data-tip="Score">
              <svg
                width="11"
                height="15"
                viewBox="0 0 11 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10.6748 3.81754L7.69579 0.83858C7.64846 0.792718 7.58523 0.766928 7.51933 0.766602H1.45691C1.10178 0.767215 0.761375 0.908561 0.510261 1.15968C0.259147 1.41079 0.117801 1.7512 0.117188 2.10632V12.8938C0.117801 13.2489 0.259147 13.5893 0.510261 13.8404C0.761375 14.0915 1.10178 14.2329 1.45691 14.2335H9.40237C9.75749 14.2329 10.0979 14.0915 10.349 13.8404C10.6001 13.5893 10.7415 13.2489 10.7421 12.8938V3.9824C10.7423 3.95184 10.7364 3.92155 10.7249 3.89326C10.7133 3.86497 10.6963 3.83924 10.6748 3.81754ZM7.75151 1.56068L9.94104 3.75021H7.75151V1.56068ZM9.40237 13.7691H1.45691C1.34196 13.7691 1.22813 13.7465 1.12193 13.7025C1.01573 13.6585 0.919229 13.594 0.837946 13.5127C0.756662 13.4314 0.692185 13.3349 0.648194 13.2287C0.604204 13.1225 0.581562 13.0087 0.581562 12.8938V2.10632C0.581562 1.87417 0.673786 1.65152 0.837946 1.48736C1.00211 1.3232 1.22475 1.23098 1.45691 1.23098H7.28714V3.9824C7.28714 4.04398 7.3116 4.10304 7.35514 4.14658C7.39869 4.19012 7.45775 4.21459 7.51933 4.21459H10.2777V12.8938C10.2777 13.0087 10.2551 13.1225 10.2111 13.2287C10.1671 13.3349 10.1026 13.4314 10.0213 13.5127C9.94005 13.594 9.84355 13.6585 9.73735 13.7025C9.63114 13.7465 9.51732 13.7691 9.40237 13.7691Z"
                  fill="#827C7C"
                />
                <path
                  d="M3.10758 5.81219C3.62014 5.81219 4.11174 5.60874 4.47439 5.24652C4.83704 4.8843 5.04109 4.39295 5.0417 3.88039C4.94418 1.32633 1.27098 1.32633 1.17578 3.88039C1.1764 4.39255 1.38012 4.88355 1.74227 5.2457C2.10442 5.60785 2.59542 5.81158 3.10758 5.81219ZM3.10758 2.41064C3.49719 2.41126 3.87067 2.5663 4.14617 2.8418C4.42167 3.1173 4.57671 3.49078 4.57733 3.88039C4.50767 5.8238 1.70749 5.8238 1.64016 3.88039C1.64016 3.49099 1.79468 3.11751 2.06981 2.84194C2.34494 2.56638 2.71818 2.41126 3.10758 2.41064Z"
                  fill="#827C7C"
                />
                <path
                  d="M2.26481 4.96694C2.29332 4.97777 2.32368 4.98288 2.35416 4.98197C2.38465 4.98106 2.41465 4.97416 2.44247 4.96165C2.47028 4.94915 2.49536 4.93129 2.51627 4.90909C2.53718 4.88689 2.55351 4.86079 2.56433 4.83228L2.81742 4.16822H3.40949L3.66258 4.83228C3.68444 4.88985 3.72828 4.93639 3.78445 4.96164C3.84062 4.9869 3.90452 4.98881 3.9621 4.96694C4.01968 4.94508 4.06621 4.90125 4.09147 4.84507C4.11672 4.7889 4.11863 4.725 4.09677 4.66742L3.33984 2.65668C3.32313 2.61263 3.29341 2.5747 3.25464 2.54793C3.21586 2.52117 3.16986 2.50684 3.12274 2.50684C3.07563 2.50684 3.02963 2.52117 2.99085 2.54793C2.95207 2.5747 2.92236 2.61263 2.90565 2.65668L2.13943 4.66742C2.11704 4.72383 2.11762 4.78676 2.14106 4.84274C2.16449 4.89873 2.20891 4.94331 2.26481 4.96694ZM3.23071 3.70384H2.99852L3.10765 3.39039L3.23071 3.70384Z"
                  fill="#827C7C"
                />
                <path
                  d="M9.07292 6.92871H1.78687C1.72529 6.92871 1.66624 6.95317 1.62269 6.99672C1.57915 7.04026 1.55469 7.09932 1.55469 7.1609C1.55469 7.22248 1.57915 7.28154 1.62269 7.32508C1.66624 7.36862 1.72529 7.39309 1.78687 7.39309H9.07292C9.1345 7.39309 9.19356 7.36862 9.2371 7.32508C9.28064 7.28154 9.30511 7.22248 9.30511 7.1609C9.30511 7.09932 9.28064 7.04026 9.2371 6.99672C9.19356 6.95317 9.1345 6.92871 9.07292 6.92871Z"
                  fill="#827C7C"
                />
                <path
                  d="M9.07292 8.6377H1.78687C1.72529 8.6377 1.66624 8.66216 1.62269 8.7057C1.57915 8.74924 1.55469 8.8083 1.55469 8.86988C1.55469 8.93146 1.57915 8.99052 1.62269 9.03406C1.66624 9.07761 1.72529 9.10207 1.78687 9.10207H9.07292C9.1345 9.10207 9.19356 9.07761 9.2371 9.03406C9.28064 8.99052 9.30511 8.93146 9.30511 8.86988C9.30511 8.8083 9.28064 8.74924 9.2371 8.7057C9.19356 8.66216 9.1345 8.6377 9.07292 8.6377Z"
                  fill="#827C7C"
                />
                <path
                  d="M9.07292 10.3486H1.78687C1.72529 10.3486 1.66624 10.3731 1.62269 10.4166C1.57915 10.4602 1.55469 10.5192 1.55469 10.5808C1.55469 10.6424 1.57915 10.7015 1.62269 10.745C1.66624 10.7885 1.72529 10.813 1.78687 10.813H9.07292C9.1345 10.813 9.19356 10.7885 9.2371 10.745C9.28064 10.7015 9.30511 10.6424 9.30511 10.5808C9.30511 10.5192 9.28064 10.4602 9.2371 10.4166C9.19356 10.3731 9.1345 10.3486 9.07292 10.3486Z"
                  fill="#827C7C"
                />
                <path
                  d="M9.07292 12.0576H1.78687C1.72529 12.0576 1.66624 12.0821 1.62269 12.1256C1.57915 12.1692 1.55469 12.2282 1.55469 12.2898C1.55469 12.3514 1.57915 12.4104 1.62269 12.454C1.66624 12.4975 1.72529 12.522 1.78687 12.522H9.07292C9.1345 12.522 9.19356 12.4975 9.2371 12.454C9.28064 12.4104 9.30511 12.3514 9.30511 12.2898C9.30511 12.2282 9.28064 12.1692 9.2371 12.1256C9.19356 12.0821 9.1345 12.0576 9.07292 12.0576Z"
                  fill="#827C7C"
                />
              </svg>
              <p>Score: {score}</p>
            </span>

            <span>
              <svg
                width="16"
                height="15"
                viewBox="0 0 16 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M13.7281 8.38125L9.24688 12.8625C9.13078 12.9787 8.99292 13.0709 8.84118 13.1338C8.68943 13.1967 8.52677 13.2291 8.3625 13.2291C8.19823 13.2291 8.03557 13.1967 7.88382 13.1338C7.73208 13.0709 7.59422 12.9787 7.47813 12.8625L2.10938 7.5V1.25H8.35938L13.7281 6.61875C13.9609 6.85295 14.0916 7.16977 14.0916 7.5C14.0916 7.83023 13.9609 8.14705 13.7281 8.38125V8.38125Z"
                  stroke="#827C7C"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M5.23438 4.375H5.24063"
                  stroke="#827C7C"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              <div
                data-tip={skillsId.map((data) => {
                  return data?.skills?.skills;
                })}
              >
                {skillsId.map((data, index) => {
                  if (index < 2) {
                    return (
                      <p>
                        {data?.skills?.skills}
                        {index !== skillsId?.length - 1 ? "," : ""}
                      </p>
                    );
                  } else if (index === 2) {
                    return <p>+{skillsId?.length - 2}</p>;
                  }
                })}
              </div>
            </span>
          </div>

          <div className="library-right-side">
            <span
              data-tip="Try question"
              onClick={onClickTryQuestion}
              style={{ cursor: "pointer" }}
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 15 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M11.1449 8.04901V11.764C11.1449 12.0924 11.0145 12.4074 10.7822 12.6396C10.55 12.8719 10.235 13.0023 9.90659 13.0023H3.09576C2.76733 13.0023 2.45235 12.8719 2.22012 12.6396C1.98789 12.4074 1.85742 12.0924 1.85742 11.764V4.95318C1.85742 4.62475 1.98789 4.30978 2.22012 4.07754C2.45235 3.84531 2.76733 3.71484 3.09576 3.71484H6.81075"
                  stroke="#827C7C"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M9.28711 1.85742H13.0021V5.57242"
                  stroke="#827C7C"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M6.19141 8.66825L13.0022 1.85742"
                  stroke="#827C7C"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>

              <p>Try Question</p>
            </span>
            {props.userClientID === "632c16db596546cfa858136f" ||
            props.sourceSelected !== "EliteQA Library" ? (
              <span
                data-tip="Delete question"
                onClick={onClickDeleteButton}
                style={{ cursor: "pointer" }}
              >
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 15 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1.875 3.75H3.125H13.125"
                    stroke="#827C7C"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M11.875 3.75V12.5C11.875 12.8315 11.7433 13.1495 11.5089 13.3839C11.2745 13.6183 10.9565 13.75 10.625 13.75H4.375C4.04348 13.75 3.72554 13.6183 3.49112 13.3839C3.2567 13.1495 3.125 12.8315 3.125 12.5V3.75M5 3.75V2.5C5 2.16848 5.1317 1.85054 5.36612 1.61612C5.60054 1.3817 5.91848 1.25 6.25 1.25H8.75C9.08152 1.25 9.39946 1.3817 9.63388 1.61612C9.8683 1.85054 10 2.16848 10 2.5V3.75"
                    stroke="#827C7C"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M6.25 6.875V10.625"
                    stroke="#827C7C"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M8.75 6.875V10.625"
                    stroke="#827C7C"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>

                <p>Delete Question</p>
              </span>
            ) : (
              <></>
            )}
            {props.sourceSelected ? (
              <>
                <div className="card-border"></div>
                <div className="library-name-container">
                  {props.sourceSelected}
                </div>
              </>
            ) : (
              <></>
            )}
            <div className="card-border"></div>
            <label data-tip={type}>{type}</label>
          </div>
        </div>
      ) : (
        <div className="library-bottom-container">
          <div className="draft-library-left-side">
            <label>{type}</label>
            <div className="card-border"></div>
            {props.userClientID === "632c16db596546cfa858136f" ||
            props.sourceSelected !== "EliteQA Library" ? (
              <span onClick={onClickDeleteButton} style={{ cursor: "pointer" }}>
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 15 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1.875 3.75H3.125H13.125"
                    stroke="#827C7C"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M11.875 3.75V12.5C11.875 12.8315 11.7433 13.1495 11.5089 13.3839C11.2745 13.6183 10.9565 13.75 10.625 13.75H4.375C4.04348 13.75 3.72554 13.6183 3.49112 13.3839C3.2567 13.1495 3.125 12.8315 3.125 12.5V3.75M5 3.75V2.5C5 2.16848 5.1317 1.85054 5.36612 1.61612C5.60054 1.3817 5.91848 1.25 6.25 1.25H8.75C9.08152 1.25 9.39946 1.3817 9.63388 1.61612C9.8683 1.85054 10 2.16848 10 2.5V3.75"
                    stroke="#827C7C"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M6.25 6.875V10.625"
                    stroke="#827C7C"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M8.75 6.875V10.625"
                    stroke="#827C7C"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>

                <p>Delete Question</p>
              </span>
            ) : (
              <></>
            )}
          </div>

          <div className="draft-library-right-side">
            <button
              onClick={(e) => {
                e.stopPropagation();
                props.onClickEditDraft(props.data);
              }}
              // style={{ marginLeft: 100 }}
            >
              {/* edit Icon */}
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clip-path="url(#clip0_2151_1949)">
                  <path
                    d="M6.41602 2.33301H2.33268C2.02326 2.33301 1.72652 2.45592 1.50772 2.67472C1.28893 2.89351 1.16602 3.19026 1.16602 3.49967V11.6663C1.16602 11.9758 1.28893 12.2725 1.50772 12.4913C1.72652 12.7101 2.02326 12.833 2.33268 12.833H10.4993C10.8088 12.833 11.1055 12.7101 11.3243 12.4913C11.5431 12.2725 11.666 11.9758 11.666 11.6663V7.58301"
                    stroke="#514D4D"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M10.791 1.45814C11.0231 1.22608 11.3378 1.0957 11.666 1.0957C11.9942 1.0957 12.309 1.22608 12.541 1.45814C12.7731 1.6902 12.9035 2.00495 12.9035 2.33314C12.9035 2.66133 12.7731 2.97608 12.541 3.20814L6.99935 8.74981L4.66602 9.33314L5.24935 6.99981L10.791 1.45814Z"
                    stroke="#514D4D"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_2151_1949">
                    <rect width="14" height="14" fill="white" />
                  </clipPath>
                </defs>
              </svg>

              <span>Edit</span>
            </button>
          </div>
        </div>
      )}
      <ReactTooltip />
    </div>
  );
};

export default LibraryCard;
