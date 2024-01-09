import React, { useState, useEffect, useContext } from "react";
import "./index.css";
import NavigationBar from "../../component/NavigationBar/NavigationBar";
import AssessmentPreviewSideBar from "../../component/AssessmentOverviewSidebar";
import SnapshotPopup from "../../component/SnapshotPopup";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { backend_url, getCookie } from "../../constant";
import { toast } from "react-toastify";
import TestSummaryContext from "../../store/TestSummaryContext";
import moment from "moment/moment";

function SingleCandidate() {
  const context = useContext(TestSummaryContext);

  let navigate = useNavigate();
  const [snapshot, setSnapshot] = useState(false);
  const [candidate, setCandidate] = useState(null);
  const { state } = useLocation();
  const [loading, setLoading] = useState(false);
  const [test, setTest] = useState(context.test);
  const [testSkill, settestSkill] = useState([]);
  const [testQuestions, settestQuestions] = useState([]);
  const [attemptedQuestion, setattemptedQuestion] = useState([]);
  const [selectedSkill, setselectedSkill] = useState("");
  const [isCandidateShortlisted, setisCandidateShortlisted] = useState(false);
  const [selectedQuestion, setselectedQuestion] = useState("");

  useEffect(() => {
    window.addEventListener("popstate", function (event) {});
    getCandidateById();
  }, []);

  const getCandidateById = async () => {
    try {
      const token = getCookie("Xh7ERL0G");
      const response = await axios.get(
        `${backend_url}candidateResult/getCandidateResultByInviteId/${state.id}`,
        { headers: { token: token } }
      );
      setTest(response.data.data.test_id);
      const randomAttemptedQuestion =
        response?.data?.data?.candidate_test_questions
          ?.filter(
            (questionId) =>
              questionId.question_random_object?._id !== undefined &&
              questionId?.isBookMarked
          )
          .map((questionId) => questionId.question_random_object._id);
      const nonrandomAttemptedQuestion =
        response?.data?.data?.candidate_test_questions
          ?.filter(
            (questionId) =>
              questionId.question_static_object !== undefined &&
              questionId?.isBookMarked
          )
          .map((questionId) => questionId.question_static_object);
      const allAttemptedQuestion = [
        ...randomAttemptedQuestion,
        ...nonrandomAttemptedQuestion,
      ];
      setattemptedQuestion([...new Set(allAttemptedQuestion)]);
      const testsummaryData = await axios.get(
        `${backend_url}testsummary/find/summary/${response.data.data.test_id._id}`,
        {
          headers: { token: token },
        }
      );

      const allQuestions = [];
      const testSkills = [];
      console.log(response?.data?.data?.candidate_test_questions);
      response?.data?.data?.candidate_test_questions
        ?.filter(
          (questionId) => questionId.question_random_object?._id !== undefined
        )
        .forEach((element) => {
          allQuestions.push(element.question_random_object);
        });

      for (const element of testsummaryData.data.data.skills) {
        testSkills.push(element.skill_id.skills);

        const allQuestion = [
          ...element.easy_question,
          ...element.medium_question,
          ...element.hard_question,
        ];
        if (!element.isRandom) {
          allQuestions.push(...allQuestion);
        }
      }
      settestSkill((prev) => [...prev, ...testSkills]);
      setselectedSkill(testSkills[0]);
      settestQuestions((prev) => [
        ...prev,
        ...allQuestions.filter(
          (v, i, a) => a.findIndex((v2) => v2._id === v._id) === i
        ),
      ]);
      setCandidate(response.data.data);
      console.log(allQuestions);
    } catch (error) {
      console.log(error);
    }
  };

  const updateCandidateStatus = async () => {
    try {
      setLoading(true);
      const token = getCookie("Xh7ERL0G");
      const candidateData = context.testTakenCandidates.filter(
        (data) => data.invite._id === state.id
      );
      candidateData[0].invite.status.push({
        currentStatus: "shortlisted",
        statusDate: new Date(),
      });

      const res = axios.put(
        `${backend_url}invites/moveToReviewCandidate/${state.id}`,
        { status: candidateData[0].invite.status }
      );
      setisCandidateShortlisted(true);
      setLoading(false);
      toast.success("Candidate shortlisted.");
    } catch (error) {
      setisCandidateShortlisted(false);
      setLoading(false);
      toast.error("Opps, Please try again!");
    }
    // window.location.reload();
  };

  const getSkillWiseAttemptedQuestion = (skill) => {
    const questions = testQuestions.filter((question) => {
      const skillExits = question?.skillsId
        ?.map((data) => data.skills.skills)
        .filter(Boolean);
      return (
        skillExits?.includes(skill) && attemptedQuestion?.includes(question._id)
      );
    });
    return questions.length;
  };

  const getSkillWiseTotalQuestion = (skill) => {
    const questions = testQuestions.filter((question) => {
      const skillExits = question?.skillsId
        ?.map((data) => data.skills.skills)
        .filter(Boolean);
      return skillExits?.includes(skill);
    });
    return questions.length;
  };

  const getSkillScoreObtain = (skill) => {
    const questions = testQuestions.filter((question) => {
      const skillExits = question?.skillsId
        ?.map((data) => data.skills.skills)
        .filter(Boolean);
      return (
        skillExits?.includes(skill) && attemptedQuestion?.includes(question._id)
      );
    });
    return questions.reduce((skillwiseScore, questionData) => {
      skillwiseScore =
        skillwiseScore +
        candidate.candidate_test_questions.filter(
          (questionId) =>
            (questionId?.question_static_object !== undefined
              ? questionId?.question_static_object
              : questionId?.question_random_object._id) === questionData._id
        )[0]?.candidate_score;
      return skillwiseScore;
    }, 0);
  };

  const getSkillTotalScoreInTest = (skill) => {
    const questions = testQuestions.filter((question) => {
      const skillExits = question?.skillsId
        ?.map((data) => data.skills.skills)
        .filter(Boolean);
      return skillExits?.includes(skill);
    });
    return questions.reduce((skillwiseScore, questionData) => {
      skillwiseScore = skillwiseScore + questionData.score;
      return skillwiseScore;
    }, 0);
  };

  return (
    <div className="single-candidate">
      <NavigationBar />
      {snapshot && (
        <SnapshotPopup
          close={() => {
            setSnapshot(false);
          }}
          snapshot={candidate?.candidate_snapshot}
        />
      )}
      <div className="single-candidate-container">
        <div className="single-candidate-container-left">
          <AssessmentPreviewSideBar
            testType={test?.status}
            testDetails={test}
            testName={test?.name}
            active={"candidates"}
          />
        </div>
        <div className="single-candidate-container-right">
          <div className="single-candidate-content">
            <div className="candidate-header">
              <div className="header-content">
                <div
                  className="heading-title"
                  onClick={() => {
                    navigate(`/candidatetesttaken/${candidate?.test_id?._id}`);
                  }}
                >
                  <svg
                    width="24"
                    height="25"
                    viewBox="0 0 24 25"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M19 12.5H5"
                      stroke="black"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M12 19.5L5 12.5L12 5.5"
                      stroke="black"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                  <span>Candidate Details</span>
                </div>
                <div className="candidateStatus">
                  <div className="curruntStatus">
                    Currunt Status:
                    <span>
                      {" "}
                      {isCandidateShortlisted
                        ? "Shortlisted"
                        : candidate?.candidate_invite_id?.status[
                            candidate?.candidate_invite_id.status.length - 1
                          ]?.currentStatus
                            .charAt(0)
                            .toUpperCase() +
                          candidate?.candidate_invite_id?.status[
                            candidate?.candidate_invite_id.status.length - 1
                          ]?.currentStatus.slice(1)}
                    </span>
                  </div>
                  {candidate?.candidate_invite_id?.status[
                    candidate?.candidate_invite_id.status.length - 1
                  ]?.currentStatus === "appeared" ? (
                    <>
                      {isCandidateShortlisted ? (
                        <></>
                      ) : (
                        <button
                          className="shortlisted-button"
                          onClick={() => {
                            updateCandidateStatus();
                          }}
                        >
                          <svg
                            width="14"
                            height="15"
                            viewBox="0 0 14 15"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <g clip-path="url(#clip0_3187_2014)">
                              <path
                                d="M9.33594 12.75V11.5833C9.33594 10.9645 9.0901 10.371 8.65252 9.93342C8.21493 9.49583 7.62144 9.25 7.0026 9.25H2.91927C2.30043 9.25 1.70694 9.49583 1.26936 9.93342C0.83177 10.371 0.585938 10.9645 0.585938 11.5833V12.75"
                                stroke="white"
                                stroke-width="1.5"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              />
                              <path
                                d="M4.95833 6.91667C6.247 6.91667 7.29167 5.872 7.29167 4.58333C7.29167 3.29467 6.247 2.25 4.95833 2.25C3.66967 2.25 2.625 3.29467 2.625 4.58333C2.625 5.872 3.66967 6.91667 4.95833 6.91667Z"
                                stroke="white"
                                stroke-width="1.5"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              />
                              <path
                                d="M11.6641 5.16699V8.66699"
                                stroke="white"
                                stroke-width="1.5"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              />
                              <path
                                d="M13.4141 6.91699H9.91406"
                                stroke="white"
                                stroke-width="1.5"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              />
                            </g>
                            <defs>
                              <clipPath id="clip0_3187_2014">
                                <rect
                                  width="14"
                                  height="14"
                                  fill="white"
                                  transform="translate(0 0.5)"
                                />
                              </clipPath>
                            </defs>
                          </svg>
                          {loading ? "Loading..." : "Shortlist"}
                        </button>
                      )}
                    </>
                  ) : (
                    <></>
                  )}
                </div>
              </div>
              <div className="horizontal-line"></div>
            </div>

            <div className="candidate-details">
              <div className="candidate-bio">
                <div className="first-box">
                  <div className="first-candidate">
                    <svg
                      width="56"
                      height="55"
                      viewBox="0 0 56 55"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle cx="28.0078" cy="27.5" r="27.5" fill="#384455" />
                      <path
                        d="M36.8031 38.5004V36.3004C36.8031 35.1334 36.3396 34.0143 35.5144 33.1891C34.6892 32.364 33.5701 31.9004 32.4031 31.9004H23.6031C22.4362 31.9004 21.317 32.364 20.4919 33.1891C19.6667 34.0143 19.2031 35.1334 19.2031 36.3004V38.5004"
                        stroke="#FCF9F9"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M28.0016 27.5002C30.4316 27.5002 32.4016 25.5302 32.4016 23.1002C32.4016 20.6701 30.4316 18.7002 28.0016 18.7002C25.5715 18.7002 23.6016 20.6701 23.6016 23.1002C23.6016 25.5302 25.5715 27.5002 28.0016 27.5002Z"
                        stroke="#FCF9F9"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                    <div className="candidate-name">
                      <span style={{ textTransform: "capitalize" }}>
                        {candidate?.candidate_invite_id?.candidateName}
                      </span>
                      <p>
                        <svg
                          width="12"
                          height="14"
                          viewBox="0 0 12 14"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M11.0654 3.58415L8.08641 0.605181C8.03908 0.55932 7.97585 0.53353 7.90995 0.533203H1.84753C1.49241 0.533817 1.152 0.675163 0.900886 0.926277C0.649772 1.17739 0.508426 1.5178 0.507812 1.87293V12.6604C0.508426 13.0155 0.649772 13.3559 0.900886 13.607C1.152 13.8581 1.49241 13.9995 1.84753 14.0001H9.79299C10.1481 13.9995 10.4885 13.8581 10.7396 13.607C10.9908 13.3559 11.1321 13.0155 11.1327 12.6604V3.749C11.1329 3.71844 11.127 3.68815 11.1155 3.65986C11.1039 3.63157 11.0869 3.60584 11.0654 3.58415ZM8.14214 1.32728L10.3317 3.51681H8.14214V1.32728ZM9.79299 13.5357H1.84753C1.73258 13.5357 1.61876 13.5131 1.51255 13.4691C1.40635 13.4251 1.30985 13.3606 1.22857 13.2793C1.14729 13.198 1.08281 13.1015 1.03882 12.9953C0.994829 12.8891 0.972187 12.7753 0.972187 12.6604V1.87293C0.972187 1.64077 1.06441 1.41812 1.22857 1.25396C1.39273 1.0898 1.61538 0.997578 1.84753 0.997578H7.67776V3.749C7.67776 3.81058 7.70222 3.86964 7.74577 3.91318C7.78931 3.95672 7.84837 3.98119 7.90995 3.98119H10.6683V12.6604C10.6683 12.7753 10.6457 12.8891 10.6017 12.9953C10.5577 13.1015 10.4932 13.198 10.412 13.2793C10.3307 13.3606 10.2342 13.4251 10.128 13.4691C10.0218 13.5131 9.90794 13.5357 9.79299 13.5357Z"
                            fill="#827C7C"
                          />
                          <path
                            d="M3.50211 5.57879C4.01467 5.57879 4.50627 5.37534 4.86892 5.01312C5.23157 4.65091 5.43562 4.15955 5.43623 3.64699C5.33872 1.09293 1.66551 1.09293 1.57031 3.64699C1.57093 4.15915 1.77465 4.65015 2.1368 5.0123C2.49895 5.37445 2.98996 5.57818 3.50211 5.57879ZM3.50211 2.17725C3.89172 2.17786 4.2652 2.3329 4.5407 2.6084C4.8162 2.8839 4.97125 3.25738 4.97186 3.64699C4.9022 5.5904 2.10202 5.5904 2.03469 3.64699C2.03469 3.25759 2.18922 2.88411 2.46435 2.60854C2.73947 2.33298 3.11271 2.17786 3.50211 2.17725Z"
                            fill="#827C7C"
                          />
                          <path
                            d="M2.65739 4.73355C2.6859 4.74437 2.71626 4.74948 2.74674 4.74857C2.77722 4.74766 2.80723 4.74076 2.83504 4.72826C2.86286 4.71575 2.88794 4.69789 2.90885 4.67569C2.92976 4.65349 2.94609 4.62739 2.95691 4.59888L3.20999 3.93482H3.80207L4.05516 4.59888C4.07702 4.65645 4.12086 4.70299 4.17703 4.72824C4.2332 4.7535 4.2971 4.75541 4.35468 4.73355C4.41226 4.71168 4.45879 4.66785 4.48405 4.61168C4.5093 4.5555 4.51121 4.4916 4.48935 4.43402L3.73242 2.42328C3.71571 2.37923 3.68599 2.3413 3.64721 2.31454C3.60844 2.28777 3.56244 2.27344 3.51532 2.27344C3.4682 2.27344 3.4222 2.28777 3.38343 2.31454C3.34465 2.3413 3.31493 2.37923 3.29822 2.42328L2.53201 4.43402C2.50961 4.49043 2.5102 4.55336 2.53363 4.60935C2.55707 4.66533 2.60149 4.70991 2.65739 4.73355ZM3.62329 3.47045H3.3911L3.50023 3.15699L3.62329 3.47045Z"
                            fill="#827C7C"
                          />
                          <path
                            d="M9.46354 6.69531H2.1775C2.11592 6.69531 2.05686 6.71977 2.01332 6.76332C1.96977 6.80686 1.94531 6.86592 1.94531 6.9275C1.94531 6.98908 1.96977 7.04814 2.01332 7.09168C2.05686 7.13522 2.11592 7.15969 2.1775 7.15969H9.46354C9.52512 7.15969 9.58418 7.13522 9.62772 7.09168C9.67127 7.04814 9.69573 6.98908 9.69573 6.9275C9.69573 6.86592 9.67127 6.80686 9.62772 6.76332C9.58418 6.71977 9.52512 6.69531 9.46354 6.69531Z"
                            fill="#827C7C"
                          />
                          <path
                            d="M9.46354 8.4043H2.1775C2.11592 8.4043 2.05686 8.42876 2.01332 8.4723C1.96977 8.51585 1.94531 8.5749 1.94531 8.63648C1.94531 8.69806 1.96977 8.75712 2.01332 8.80067C2.05686 8.84421 2.11592 8.86867 2.1775 8.86867H9.46354C9.52512 8.86867 9.58418 8.84421 9.62772 8.80067C9.67127 8.75712 9.69573 8.69806 9.69573 8.63648C9.69573 8.5749 9.67127 8.51585 9.62772 8.4723C9.58418 8.42876 9.52512 8.4043 9.46354 8.4043Z"
                            fill="#827C7C"
                          />
                          <path
                            d="M9.46354 10.1152H2.1775C2.11592 10.1152 2.05686 10.1397 2.01332 10.1832C1.96977 10.2268 1.94531 10.2858 1.94531 10.3474C1.94531 10.409 1.96977 10.4681 2.01332 10.5116C2.05686 10.5551 2.11592 10.5796 2.1775 10.5796H9.46354C9.52512 10.5796 9.58418 10.5551 9.62772 10.5116C9.67127 10.4681 9.69573 10.409 9.69573 10.3474C9.69573 10.2858 9.67127 10.2268 9.62772 10.1832C9.58418 10.1397 9.52512 10.1152 9.46354 10.1152Z"
                            fill="#827C7C"
                          />
                          <path
                            d="M9.46354 11.8242H2.1775C2.11592 11.8242 2.05686 11.8487 2.01332 11.8922C1.96977 11.9358 1.94531 11.9948 1.94531 12.0564C1.94531 12.118 1.96977 12.177 2.01332 12.2206C2.05686 12.2641 2.11592 12.2886 2.1775 12.2886H9.46354C9.52512 12.2886 9.58418 12.2641 9.62772 12.2206C9.67127 12.177 9.69573 12.118 9.69573 12.0564C9.69573 11.9948 9.67127 11.9358 9.62772 11.8922C9.58418 11.8487 9.52512 11.8242 9.46354 11.8242Z"
                            fill="#827C7C"
                          />
                        </svg>
                        {(
                          (attemptedQuestion?.length /
                            candidate?.test_id?.totalNoOfQuestions) *
                          100
                        ).toFixed(0)}
                        % Test Attempted
                      </p>
                    </div>
                  </div>
                </div>
                <div className="second-box">
                  <div className="box-content">
                    <span>#{state.rank}</span>
                    <p>Candidate Rank</p>
                  </div>
                </div>
                <div className="third-box">
                  <div className="box-content">
                    <span>
                      {candidate?.candidate_total_Score}/
                      {candidate?.test_id?.totalScore}
                    </span>
                    <p>Candidate Score</p>
                  </div>
                </div>
                <div className="fourth-box">
                  <div className="box-content">
                    <span style={{ color: "#000000" }}>
                      {(
                        parseInt(candidate?.candidate_total_time_spent) / 60
                      ).toFixed(2)}
                    </span>
                    <p>Duration (mins)</p>
                  </div>
                </div>
              </div>
              <div className="candidate-test">
                <div className="about-candidate">
                  <span>About Candidate</span>
                  <div className="candidate-info">
                    <ul>
                      <li>
                        Email: {candidate?.candidate_invite_id?.candidateEmail}
                      </li>
                      <li>
                        Phone: {candidate?.candidate_invite_id?.candidateMobile}
                      </li>
                      <li>
                        Address:{" "}
                        {
                          candidate?.candidate_invite_id?.extraFieldObject[
                            "address"
                          ]
                        }
                      </li>
                      <li>
                        Country:{" "}
                        {
                          candidate?.candidate_invite_id?.extraFieldObject[
                            "country"
                          ]
                        }
                      </li>
                      <li>
                        Age:{" "}
                        {
                          candidate?.candidate_invite_id?.extraFieldObject[
                            "age"
                          ]
                        }
                      </li>
                      <li>
                        Education:{" "}
                        {
                          candidate?.candidate_invite_id?.extraFieldObject[
                            "education"
                          ]
                        }
                      </li>
                      <li>
                        Portfolio:{" "}
                        {
                          candidate?.candidate_invite_id?.extraFieldObject[
                            "portfolio"
                          ]
                        }
                      </li>
                      <li>
                        Github:{" "}
                        {
                          candidate?.candidate_invite_id?.extraFieldObject[
                            "gitlab"
                          ]
                        }
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="about-test">
                  <div className="snapshots">
                    <svg
                      width="51"
                      height="51"
                      viewBox="0 0 51 51"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle cx="25.5" cy="25.0049" r="25" fill="#00C49A" />
                      <g clip-path="url(#clip0_3187_2081)">
                        <path
                          d="M36.5 32.0049C36.5 32.5353 36.2893 33.044 35.9142 33.4191C35.5391 33.7942 35.0304 34.0049 34.5 34.0049H16.5C15.9696 34.0049 15.4609 33.7942 15.0858 33.4191C14.7107 33.044 14.5 32.5353 14.5 32.0049V21.0049C14.5 20.4744 14.7107 19.9657 15.0858 19.5907C15.4609 19.2156 15.9696 19.0049 16.5 19.0049H20.5L22.5 16.0049H28.5L30.5 19.0049H34.5C35.0304 19.0049 35.5391 19.2156 35.9142 19.5907C36.2893 19.9657 36.5 20.4744 36.5 21.0049V32.0049Z"
                          stroke="white"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path
                          d="M25.5 30.0049C27.7091 30.0049 29.5 28.214 29.5 26.0049C29.5 23.7957 27.7091 22.0049 25.5 22.0049C23.2909 22.0049 21.5 23.7957 21.5 26.0049C21.5 28.214 23.2909 30.0049 25.5 30.0049Z"
                          stroke="white"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_3187_2081">
                          <rect
                            width="24"
                            height="24"
                            fill="white"
                            transform="translate(13.5 13.0049)"
                          />
                        </clipPath>
                      </defs>
                    </svg>
                    <div
                      style={{ cursor: "pointer" }}
                      className="group-content"
                      onClick={() => {
                        setSnapshot(true);
                      }}
                    >
                      <span>
                        {candidate?.candidate_snapshot?.length} Snapshots Taken
                      </span>
                      <p>View Snapshots</p>
                    </div>
                  </div>
                  <div className="snapshots-bottom">
                    <div className="tab-switched">
                      <svg
                        width="51"
                        height="51"
                        viewBox="0 0 51 51"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <circle cx="25.5" cy="25.0049" r="25" fill="#00C49A" />
                        <path
                          d="M31.9075 24.6839V30.4531C31.9075 30.9632 31.7048 31.4523 31.3442 31.8129C30.9835 32.1736 30.4944 32.3762 29.9844 32.3762H19.4075C18.8974 32.3762 18.4083 32.1736 18.0476 31.8129C17.687 31.4523 17.4844 30.9632 17.4844 30.4531V19.8762C17.4844 19.3662 17.687 18.877 18.0476 18.5164C18.4083 18.1557 18.8974 17.9531 19.4075 17.9531H25.1767"
                          stroke="white"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path
                          d="M29.0234 15.0684H34.7927V20.8376"
                          stroke="white"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path
                          d="M24.2188 25.6453L34.7957 15.0684"
                          stroke="white"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                      <div className="group-content">
                        <span>Tabs switched</span>
                        <p>{candidate?.candidate_tab_switch_count} Times</p>
                      </div>
                    </div>
                    <div className="plag">
                      <svg
                        width="51"
                        height="51"
                        viewBox="0 0 51 51"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <circle cx="25.5" cy="25.0049" r="25" fill="#FF6812" />
                        <path
                          d="M29.5 31.0049L35.5 25.0049L29.5 19.0049"
                          stroke="white"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path
                          d="M21.5 19.0049L15.5 25.0049L21.5 31.0049"
                          stroke="white"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                      <div className="group-content">
                        <span>Plagarism (%)</span>
                        <p>Not Found</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="test-body">
              <div className="test-analysis">
                <span className="title">Test Time Analysis</span>
                <div className="test-info">
                  <div className="info-content">
                    <span>Test Invite Time</span>
                    <p>
                      {moment(
                        candidate?.candidate_invite_id?.inviteTime
                      ).format("MMM DD YYYY, hh:mm:ss A")}
                    </p>
                  </div>
                  <div className="info-content">
                    <span>Test Start Time</span>
                    <p>
                      {moment(
                        candidate?.candidate_invite_id?.testStartTime
                      ).format("MMM DD YYYY, hh:mm:ss A")}
                    </p>
                  </div>
                  <div className="info-content">
                    <span>Test End Time</span>
                    <p>
                      {moment(
                        candidate?.candidate_invite_id?.testEndTime
                      ).format("MMM DD YYYY, hh:mm:ss A")}
                    </p>
                  </div>
                  <div className="info-content">
                    <span>Test Duration</span>
                    <p>{candidate?.test_id?.totalTiming} min </p>
                  </div>
                </div>
              </div>
              <div className="skillwise-performance">
                <span className="skillwise-title">
                  Check Skill-wise Performance
                </span>

                <div className="skillwise-info">
                  <div className="first-info-box">
                    <div className="select-box">
                      <select
                        value={selectedSkill}
                        onChange={(e) => setselectedSkill(e.target.value)}
                        name=""
                        id=""
                      >
                        {testSkill?.map((skillItem) => {
                          return <option value={skillItem}>{skillItem}</option>;
                        })}
                      </select>
                    </div>
                  </div>
                  <div className="second-info-box">
                    <div className="box-content">
                      <span>
                        {getSkillWiseAttemptedQuestion(selectedSkill)}/
                        {getSkillWiseTotalQuestion(selectedSkill)}
                      </span>
                      <p>Attempted Questions</p>
                    </div>
                  </div>
                  <div className="third-info-box">
                    <div className="box-content">
                      <span>{getSkillScoreObtain(selectedSkill)}</span>
                      <p>Marks Obtained</p>
                    </div>
                  </div>
                  <div className="fourth-info-box">
                    <div className="box-content">
                      <span style={{ color: "#000000" }}>
                        {getSkillTotalScoreInTest(selectedSkill)}
                      </span>
                      <p>Total Score Of skill within test</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="question-report">
              <div className="question-title">
                <span>Question Report</span>
                <div className="select-box" style={{ width: "172px" }}>
                  <select name="" id="">
                    <option value="MCQ Questions">MCQ Questions</option>
                  </select>
                </div>
              </div>
              <div className="question-table">
                <table cellSpacing="0">
                  <tr>
                    <th>#</th>
                    <th>MCQ Questions</th>
                    <th>Result</th>
                    <th>
                      Score ({candidate?.candidate_total_Score}/
                      {candidate?.test_id?.totalScore})
                    </th>
                  </tr>
                  {testQuestions
                    // ?.filter((questionData) =>
                    //   attemptedQuestion.includes(questionData._id)
                    // )
                    ?.map((questionData) => {
                      return (
                        <tr
                          onClick={(e) => {
                            e.stopPropagation();
                            setselectedQuestion(questionData._id);
                          }}
                        >
                          <td>
                            {selectedQuestion === questionData._id ? (
                              <svg
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setselectedQuestion("");
                                }}
                                width="22"
                                height="21"
                                viewBox="0 0 22 21"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M6 8L11.25 13L16.5 8"
                                  stroke="black"
                                  stroke-width="2"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                />
                              </svg>
                            ) : (
                              <svg
                                width="21"
                                height="21"
                                viewBox="0 0 21 21"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M8.0625 15.7383L13.0625 10.7383L8.0625 5.73828"
                                  stroke="black"
                                  stroke-width="2"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                />
                              </svg>
                            )}
                          </td>
                          <td>
                            {questionData?.html ? (
                              <div
                                className="sun-editor-editable sun-editor-editable2"
                                dangerouslySetInnerHTML={{
                                  __html: questionData?.html,
                                }}
                              />
                            ) : (
                              <>{questionData?.question}</>
                            )}
                            {selectedQuestion === questionData._id ? (
                              <div className="show-question-options-container">
                                {questionData.answersObjectArray.map(
                                  (optionsData, index) => {
                                    return (
                                      <span
                                        className="show-question-options"
                                        style={
                                          questionData.correctAnswerObjectArray.includes(
                                            optionsData.optionId
                                          )
                                            ? { color: "#00C49A" }
                                            : attemptedQuestion.includes(
                                                questionData._id
                                              ) &&
                                              candidate?.candidate_test_questions
                                                .filter(
                                                  (questionId) =>
                                                    (questionId?.question_static_object !==
                                                    undefined
                                                      ? questionId?.question_static_object
                                                      : questionId
                                                          ?.question_random_object
                                                          ._id) ===
                                                    questionData._id
                                                )[0]
                                                ?.candidate_answer.includes(
                                                  optionsData.optionId
                                                )
                                            ? { color: "#FF6812" }
                                            : {}
                                        }
                                      >
                                        {index + 1}.{" "}
                                        {optionsData.html ? (
                                          <span
                                            className="sun-editor-editable sun-editor-editable2 question-option-html"
                                            dangerouslySetInnerHTML={{
                                              __html: optionsData.html,
                                            }}
                                            style={
                                              questionData.correctAnswerObjectArray.includes(
                                                optionsData.optionId
                                              )
                                                ? { color: "#00C49A" }
                                                : attemptedQuestion.includes(
                                                    questionData._id
                                                  ) &&
                                                  candidate?.candidate_test_questions
                                                    .filter(
                                                      (questionId) =>
                                                        (questionId?.question_static_object !==
                                                        undefined
                                                          ? questionId?.question_static_object
                                                          : questionId
                                                              ?.question_random_object
                                                              ._id) ===
                                                        questionData._id
                                                    )[0]
                                                    ?.candidate_answer.includes(
                                                      optionsData.optionId
                                                    )
                                                ? { color: "#FF6812" }
                                                : {}
                                            }
                                          />
                                        ) : (
                                          <>{optionsData.option}</>
                                        )}
                                      </span>
                                    );
                                  }
                                )}
                              </div>
                            ) : (
                              <></>
                            )}
                          </td>
                          <td>
                            {attemptedQuestion.includes(questionData._id) ? (
                              candidate?.candidate_test_questions.filter(
                                (questionId) =>
                                  (questionId?.question_static_object !==
                                  undefined
                                    ? questionId?.question_static_object
                                    : questionId?.question_random_object
                                        ._id) === questionData._id
                              )[0]?.candidate_score === questionData?.score ? (
                                <svg
                                  width="20"
                                  height="21"
                                  viewBox="0 0 20 21"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <g clip-path="url(#clip0_3187_2154)">
                                    <path
                                      d="M18.6667 8.57144V9.3381C18.6656 11.1351 18.0838 12.8837 17.0078 14.323C15.9318 15.7622 14.4194 16.8152 12.6961 17.3247C10.9729 17.8342 9.13105 17.773 7.44539 17.1503C5.75973 16.5275 4.32055 15.3765 3.34247 13.869C2.36439 12.3615 1.89983 10.5782 2.01806 8.78503C2.1363 6.99191 2.83101 5.28504 3.99857 3.919C5.16613 2.55295 6.74399 1.60092 8.49682 1.20489C10.2497 0.808861 12.0836 0.990051 13.725 1.72144"
                                      stroke="#00C49A"
                                      stroke-width="2"
                                      stroke-linecap="round"
                                      stroke-linejoin="round"
                                    />
                                    <path
                                      d="M18.3333 3.84277L10 12.1844L7.5 9.68444"
                                      stroke="#00C49A"
                                      stroke-width="2"
                                      stroke-linecap="round"
                                      stroke-linejoin="round"
                                    />
                                  </g>
                                  <defs>
                                    <clipPath id="clip0_3187_2154">
                                      <rect
                                        width="20"
                                        height="20"
                                        fill="white"
                                        transform="translate(0 0.509766)"
                                      />
                                    </clipPath>
                                  </defs>
                                </svg>
                              ) : (
                                <svg
                                  width="20"
                                  height="21"
                                  viewBox="0 0 20 21"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M9.9974 18.8434C14.5998 18.8434 18.3307 15.1125 18.3307 10.5101C18.3307 5.90772 14.5998 2.17676 9.9974 2.17676C5.39502 2.17676 1.66406 5.90772 1.66406 10.5101C1.66406 15.1125 5.39502 18.8434 9.9974 18.8434Z"
                                    stroke="#FF6812"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                  />
                                  <path
                                    d="M12.5 8.00977L7.5 13.0098"
                                    stroke="#FF6812"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                  />
                                  <path
                                    d="M7.5 8.00977L12.5 13.0098"
                                    stroke="#FF6812"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                  />
                                </svg>
                              )
                            ) : (
                              <svg
                                width="16"
                                height="16"
                                viewBox="0 0 16 16"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <circle
                                  cx="8"
                                  cy="8"
                                  r="7"
                                  stroke="#bfbfbf"
                                  stroke-width="2"
                                />
                                <path
                                  d="M4.5 4.5L11.5 11.5"
                                  stroke="#bfbfbf"
                                  stroke-width="2"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                />
                              </svg>
                            )}
                          </td>
                          <td>
                            {
                              candidate?.candidate_test_questions.filter(
                                (questionId) =>
                                  (questionId?.question_static_object !==
                                  undefined
                                    ? questionId?.question_static_object
                                    : questionId?.question_random_object
                                        ._id) === questionData?._id
                              )[0]?.candidate_score
                            }
                            /{questionData?.score}
                          </td>
                        </tr>
                      );
                    })}
                </table>
              </div>

              {/* <tr>
                                <td>
                                    <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M8.0625 15.7383L13.0625 10.7383L8.0625 5.73828" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                    </svg>
                                </td>
                                <td>Lorem ipsum dolor sit amet, consectetur adipiscing elit?</td>
                                <td>
                                    <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <g clip-path="url(#clip0_3187_2154)">
                                            <path d="M18.6667 8.57144V9.3381C18.6656 11.1351 18.0838 12.8837 17.0078 14.323C15.9318 15.7622 14.4194 16.8152 12.6961 17.3247C10.9729 17.8342 9.13105 17.773 7.44539 17.1503C5.75973 16.5275 4.32055 15.3765 3.34247 13.869C2.36439 12.3615 1.89983 10.5782 2.01806 8.78503C2.1363 6.99191 2.83101 5.28504 3.99857 3.919C5.16613 2.55295 6.74399 1.60092 8.49682 1.20489C10.2497 0.808861 12.0836 0.990051 13.725 1.72144" stroke="#00C49A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                            <path d="M18.3333 3.84277L10 12.1844L7.5 9.68444" stroke="#00C49A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                        </g>
                                        <defs>
                                            <clipPath id="clip0_3187_2154">
                                                <rect width="20" height="20" fill="white" transform="translate(0 0.509766)" />
                                            </clipPath>
                                        </defs>
                                    </svg>
                                </td>
                                <td>1/1</td>
                            </tr>
                            <tr>
                                <td>
                                    <svg width="22" height="21" viewBox="0 0 22 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M6 8L11.25 13L16.5 8" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                    </svg>

                                </td>
                                <td>Lorem ipsum dolor sit amet, consectetur adipiscing elit?</td>
                                <td>
                                    <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <g clip-path="url(#clip0_3187_2154)">
                                            <path d="M18.6667 8.57144V9.3381C18.6656 11.1351 18.0838 12.8837 17.0078 14.323C15.9318 15.7622 14.4194 16.8152 12.6961 17.3247C10.9729 17.8342 9.13105 17.773 7.44539 17.1503C5.75973 16.5275 4.32055 15.3765 3.34247 13.869C2.36439 12.3615 1.89983 10.5782 2.01806 8.78503C2.1363 6.99191 2.83101 5.28504 3.99857 3.919C5.16613 2.55295 6.74399 1.60092 8.49682 1.20489C10.2497 0.808861 12.0836 0.990051 13.725 1.72144" stroke="#00C49A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                            <path d="M18.3333 3.84277L10 12.1844L7.5 9.68444" stroke="#00C49A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                        </g>
                                        <defs>
                                            <clipPath id="clip0_3187_2154">
                                                <rect width="20" height="20" fill="white" transform="translate(0 0.509766)" />
                                            </clipPath>
                                        </defs>
                                    </svg>
                                </td>
                                <td>1/1</td>
                            </tr>
                        </table>
                    </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SingleCandidate;
