import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CreateTest5Sidebar from "../../component/CreateTest5Sidebar";
import NavigationBar from "../../component/NavigationBar/NavigationBar";
import TestCard from "./TestCard";
import "./index.css";
import CreateTestContext from "../../store/CreateTestContext";
import axios from "axios";
import { backend_url, getCookie } from "../../constant";
import jwtDecode from "jwt-decode";
import { toast } from "react-toastify";
import TestCreationDataLossPopup from "../../component/TestCreationDataLossPopup";
import PublishTest from "../../component/PublishTest";

function TestTest() {
  const createTestContext = useContext(CreateTestContext);
  let navigate = useNavigate();
  const [selected1, setSelected1] = useState(false);
  const [selected4, setSelected4] = useState(false);
  const [loading, setloading] = useState(false);
  const [draftLoading, setdraftLoading] = useState(false);
  const [selectedSkill, setselectedSkill] = useState("");
  const [isNavItem, setisNavItem] = useState(false);
  const [selectedNavItem, setselectedNavItem] = useState("");
  const skillsExits = createTestContext.addedSkills
    .filter((data) => data.random)
    .map((data) => data.skillId);
  const [isQuestionInTest, setisQuestionInTest] = useState(false);

  useEffect(() => {
    window.history.pushState(null, null, document.URL);
    window.addEventListener("popstate", function (event) {
      navigate("/testsettings");
    });
  }, []);

  const getTotalMCQQuestionScore = () => {
    const skills = createTestContext.addedSkills
      .filter((data) => data.random)
      .map((data) => data.skillId);

    let toalMCQQuestionScore = createTestContext.question.reduce(
      (totalScore, question) => {
        if (selectedSkill !== "" ? question.skillId === selectedSkill : true) {
          if (
            question.questions.type === "MCQ" &&
            !skills.includes(question.skillId)
          ) {
            totalScore += question.questions.score;
          }
        }
        return totalScore;
      },
      0
    );

    if (skills.length) {
      createTestContext.addedSkills.forEach((data) => {
        if (selectedSkill !== "" ? data.skillId === selectedSkill : true) {
          if (data.questionType === "MCQ") {
            toalMCQQuestionScore =
              toalMCQQuestionScore +
              (data.random
                ? isNaN(data.score)
                  ? parseInt(
                      data.score?.split(",")[0]?.replace(/\D/g, "") *
                        data.level?.split(",")[0].replace(/\D/g, "")
                    ) +
                    parseInt(
                      data.score?.split(",")[1]?.replace(/\D/g, "") *
                        data.level?.split(",")[1].replace(/\D/g, "")
                    ) +
                    parseInt(
                      data.score?.split(",")[2]?.replace(/\D/g, "") *
                        data.level?.split(",")[2].replace(/\D/g, "")
                    )
                  : 0
                : 0);
          }
        }
      });
    }
    return toalMCQQuestionScore;
  };

  const getTotalProgrammingQuestionScore = () => {
    const skills = createTestContext.addedSkills
      .filter((data) => data.random)
      .map((data) => data.skillId);

    let toalProgrammingQuestionScore = createTestContext.question.reduce(
      (totalScore, question) => {
        if (selectedSkill !== "" ? question.skillId === selectedSkill : true) {
          if (
            question.questions.type === "Programming" &&
            !skills.includes(question.skillId)
          ) {
            totalScore += question.questions.score;
          }
        }
        return totalScore;
      },
      0
    );
    if (skills.length) {
      createTestContext.addedSkills.forEach((data) => {
        if (selectedSkill !== "" ? data.skillId === selectedSkill : true) {
          if (data.questionType === "Programming") {
            toalProgrammingQuestionScore =
              toalProgrammingQuestionScore +
              (data.random
                ? isNaN(data.score)
                  ? parseInt(
                      data.score?.split(",")[0]?.replace(/\D/g, "") *
                        data.level?.split(",")[0].replace(/\D/g, "")
                    ) +
                    parseInt(
                      data.score?.split(",")[1]?.replace(/\D/g, "") *
                        data.level?.split(",")[1].replace(/\D/g, "")
                    ) +
                    parseInt(
                      data.score?.split(",")[2]?.replace(/\D/g, "") *
                        data.level?.split(",")[2].replace(/\D/g, "")
                    )
                  : 0
                : 0);
          }
        }
      });
    }
    return toalProgrammingQuestionScore;
  };

  const getTotalMCQQuestion = () => {
    const totalmcqquestion = createTestContext.question.reduce(
      (mcqquestion, question) => {
        if (selectedSkill !== "" ? question.skillId === selectedSkill : true) {
          if (question.questions.type === "MCQ") {
            mcqquestion += 1;
          }
        }
        return mcqquestion;
      },
      0
    );
    return totalmcqquestion;
  };

  const getTotalProgrammingQuestion = () => {
    const totalProgrammingquestion = createTestContext.question.reduce(
      (Programmingquestion, question) => {
        let searchSkill = question?.questions.skillsId.map((data) => {
          return data?.skills?.skills;
        });
        if (selectedSkill !== "" ? question.skillId === selectedSkill : true) {
          if (question.questions.type === "Programming") {
            Programmingquestion += 1;
          }
        }
        return Programmingquestion;
      },
      0
    );
    return totalProgrammingquestion;
  };

  const getJobRoleData = () => {
    const testName = createTestContext.jobRoleData.filter((data) => {
      return data._id === createTestContext.jobRole;
    });
    return testName[0]?.jobrole;
  };

  const saveAsDraft = async () => {
    setdraftLoading(true);
    try {
      const token = getCookie("Xh7ERL0G");
      const decode = jwtDecode(token);
      let testAdminData = [];
      createTestContext.testAdmins.forEach((data) => {
        if (data._id !== null || data._id !== undefined) {
          const obj = { admin: data._id, access: "All Access" };
          testAdminData.push(obj);
        }
      });
      const testName = createTestContext.jobRoleData.filter((data) => {
        return data._id === createTestContext.jobRole;
      });
      await axios.put(
        `${backend_url}test/update/${createTestContext.testId}`,
        {
          name: createTestContext.testHeading,
          description: extractPlainText(createTestContext.testDescription),
          jobRole: testName[0]._id,
          createdBy: decode.user_id,
          creationDateTime: new Date(),
          experience: createTestContext.experience,
          startDate: createTestContext.startDate,
          endDate: createTestContext.endDate,
          testCreationType: createTestContext.testCreationType,
          testCreationTypeDetails: createTestContext.testCreationTypeDetails,
          cutOff: createTestContext.testCutOff,
          totalTiming: createTestContext.testTime,
          totalScore: createTestContext.testScore,
          totalNoOfQuestions: createTestContext.question.length,
          link: createTestContext.testLink,
          instruction: createTestContext.testInstructions,
          testType: createTestContext.testType,
          proctoringSettings: createTestContext.proctoringSetting,
          candiateSettings: createTestContext.testCandidateData,
          isActive: false,
          status: "draft",
          testAdmins: testAdminData,
          testInviteOnly:
            createTestContext.testInviteType === "Yes" ? true : false,
          html: "",
          image: "",
        },
        { headers: { token: token } }
      );
      setdraftLoading(false);
      toast.success("assessment is saved as draft");
      createTestContext.clearState();
      navigate("/assessment");
    } catch (error) {
      toast.error(`${error}`);
      setdraftLoading(false);
    }
  };

  const extractPlainText = (html) => {
    const tempElement = document.createElement("div");
    tempElement.innerHTML = html;
    return tempElement.textContent || tempElement.innerText || "";
  };

  const updateTest = async () => {
    try {
      const testId = createTestContext.testId;
      const startDate = createTestContext.startDate;
      const endDate = createTestContext.endDate;
      setloading(true);
      if (!createTestContext.question.length) {
        setisQuestionInTest(true);
        setloading(false);
      } else {
        const token = getCookie("Xh7ERL0G");
        const decode = jwtDecode(token);
        let testAdminData = [];
        createTestContext.testAdmins.forEach((data) => {
          if (data._id !== null || data._id !== undefined) {
            const obj = { admin: data._id, access: "All Access" };
            testAdminData.push(obj);
          }
        });
        const testName = createTestContext.jobRoleData.filter((data) => {
          return data._id === createTestContext.jobRole;
        });
        await axios.put(
          `${backend_url}test/update/${createTestContext.testId}`,
          {
            name: createTestContext.testHeading,
            description: extractPlainText(createTestContext.testDescription),
            jobRole: testName[0]._id,
            createdBy: decode.user_id,
            creationDateTime: new Date(),
            experience: createTestContext.experience,
            startDate: createTestContext.startDate,
            endDate: createTestContext.endDate,
            testCreationType: createTestContext.testCreationType,
            testCreationTypeDetails: createTestContext.testCreationTypeDetails,
            cutOff: createTestContext.testCutOff,
            totalTiming: createTestContext.testTime,
            totalScore: createTestContext.testScore,
            totalNoOfQuestions: createTestContext.question.length,
            link: createTestContext.testLink,
            instruction: createTestContext.testInstructions,
            testType: createTestContext.testType,
            proctoringSettings: createTestContext.proctoringSetting,
            candiateSettings: createTestContext.testCandidateData.length
              ? createTestContext.testCandidateData
              : ["Name", "Email"],
            isActive: true,
            status: "published",
            testAdmins: testAdminData,
            testInviteOnly:
              createTestContext.testInviteType === "Yes" ? true : false,
            html: createTestContext.testDescription,
            image: "",
          },
          { headers: { token: token } }
        );
        setloading(false);
        navigate("/testpublished", {
          state: { id: testId, startDate: startDate, endDate: endDate },
        });
        createTestContext.clearState();
      }
    } catch (error) {
      setloading(false);
      toast.error(error);
    }
  };

  const navigatePage = (page) => {
    navigate(page);
    createTestContext.clearState();
  };

  const onClickPreview = (e) => {
    e.stopPropagation();
    let url = `https://www.assessment.theeliteqa.com/preview?testId=${createTestContext.testId}`;
    window.open(url, "_blank");
  };

  return (
    <div className="the-test">
      <NavigationBar
        onClickNavItem={(page) => {
          setselectedNavItem(page);
          setisNavItem(true);
        }}
        settingPreview={true}
        assessment2={false}
        onClickPreview={(e) => onClickPreview(e)}
      />
      {isNavItem ? (
        <TestCreationDataLossPopup
          closeButton={() => setisNavItem(false)}
          onClickNo={() => setisNavItem(false)}
          onClickYes={() => navigatePage(selectedNavItem)}
        />
      ) : (
        <></>
      )}
      {isQuestionInTest ? (
        <PublishTest closeButton={() => setisQuestionInTest(false)} />
      ) : (
        <></>
      )}
      <div className="the-test-container">
        <div className="container-left">
          <CreateTest5Sidebar />
        </div>
        <div className="container-right">
          <div className="the-test-content">
            <div className="col">
              <div className="header">
                <div className="title">
                  <svg
                    width="48"
                    height="48"
                    viewBox="0 0 48 48"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle
                      cx="24"
                      cy="24"
                      r="24"
                      fill="#00C49A"
                      fill-opacity="0.1"
                    />
                    <g clip-path="url(#clip0_1897_1286)">
                      <path
                        d="M33.444 16.833H15.5551C15.2162 16.833 14.8912 16.9676 14.6516 17.2073C14.412 17.4469 14.2773 17.7719 14.2773 18.1108V30.8886C14.2773 31.2275 14.412 31.5525 14.6516 31.7921C14.8912 32.0317 15.2162 32.1663 15.5551 32.1663H33.444C33.7829 32.1663 34.1079 32.0317 34.3475 31.7921C34.5872 31.5525 34.7218 31.2275 34.7218 30.8886V18.1108C34.7218 17.7719 34.5872 17.4469 34.3475 17.2073C34.1079 16.9676 33.7829 16.833 33.444 16.833ZM33.444 30.8886H15.5551V18.1108H33.444V30.8886Z"
                        fill="#00C49A"
                      />
                      <path
                        d="M18.7502 21.9448H30.2502C30.4197 21.9448 30.5822 21.8775 30.702 21.7576C30.8218 21.6378 30.8891 21.4753 30.8891 21.3059C30.8891 21.1364 30.8218 20.9739 30.702 20.8541C30.5822 20.7343 30.4197 20.667 30.2502 20.667H18.7502C18.5808 20.667 18.4183 20.7343 18.2985 20.8541C18.1786 20.9739 18.1113 21.1364 18.1113 21.3059C18.1113 21.4753 18.1786 21.6378 18.2985 21.7576C18.4183 21.8775 18.5808 21.9448 18.7502 21.9448Z"
                        fill="#00C49A"
                      />
                      <path
                        d="M18.7502 24.5004H30.2502C30.4197 24.5004 30.5822 24.4331 30.702 24.3133C30.8218 24.1935 30.8891 24.031 30.8891 23.8615C30.8891 23.6921 30.8218 23.5296 30.702 23.4098C30.5822 23.29 30.4197 23.2227 30.2502 23.2227H18.7502C18.5808 23.2227 18.4183 23.29 18.2985 23.4098C18.1786 23.5296 18.1113 23.6921 18.1113 23.8615C18.1113 24.031 18.1786 24.1935 18.2985 24.3133C18.4183 24.4331 18.5808 24.5004 18.7502 24.5004Z"
                        fill="#00C49A"
                      />
                      <path
                        d="M18.7502 27.0551H25.1391C25.3085 27.0551 25.4711 26.9878 25.5909 26.868C25.7107 26.7482 25.778 26.5857 25.778 26.4162C25.778 26.2468 25.7107 26.0843 25.5909 25.9645C25.4711 25.8447 25.3085 25.7773 25.1391 25.7773H18.7502C18.5808 25.7773 18.4183 25.8447 18.2985 25.9645C18.1786 26.0843 18.1113 26.2468 18.1113 26.4162C18.1113 26.5857 18.1786 26.7482 18.2985 26.868C18.4183 26.9878 18.5808 27.0551 18.7502 27.0551Z"
                        fill="#00C49A"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_1897_1286">
                        <rect
                          width="23"
                          height="23"
                          fill="white"
                          transform="translate(13 13)"
                        />
                      </clipPath>
                    </defs>
                  </svg>
                  <div className="group">
                    <span>The Test</span>
                    <p>
                      You can view the preview of the test that you have created
                    </p>
                  </div>
                </div>

                <div className="button-container">
                  <div
                    className="back-button"
                    onClick={() => navigate("/testsettings")}
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle cx="10" cy="10" r="10" fill="white" />
                      <path
                        d="M13 4.9595L7 9.61256L13 14.2656"
                        stroke="#827C7C"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>

                    <span>Back</span>
                  </div>
                  <button onClick={saveAsDraft} className="save-as-draft">
                    {draftLoading ? (
                      <div className="loader"></div>
                    ) : (
                      <>
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <circle cx="10" cy="10" r="10" fill="white" />
                          <path
                            d="M14.875 15.625H6.125C5.79348 15.625 5.47554 15.4933 5.24112 15.2589C5.0067 15.0245 4.875 14.7065 4.875 14.375V5.625C4.875 5.29348 5.0067 4.97554 5.24112 4.74112C5.47554 4.5067 5.79348 4.375 6.125 4.375H13L16.125 7.5V14.375C16.125 14.7065 15.9933 15.0245 15.7589 15.2589C15.5245 15.4933 15.2065 15.625 14.875 15.625Z"
                            stroke="#827C7C"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                          <path
                            d="M13.625 15.625V10.625H7.375V15.625"
                            stroke="#827C7C"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                          <path
                            d="M7.375 4.375V7.5H12.375"
                            stroke="#827C7C"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                        </svg>
                        Save As Draft
                      </>
                    )}
                  </button>
                  <div className="next-button" onClick={() => updateTest()}>
                    {loading ? (
                      <div className="loader"></div>
                    ) : (
                      <>
                        <svg
                          width="20"
                          height="21"
                          viewBox="0 0 20 21"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <ellipse
                            cx="10"
                            cy="10.4887"
                            rx="10"
                            ry="9.77778"
                            fill="white"
                          />
                          <g clip-path="url(#clip0_1492_5412)">
                            <path
                              d="M15.8346 9.96445V10.4892C15.8339 11.7192 15.4266 12.9159 14.6734 13.9011C13.9202 14.8862 12.8616 15.6068 11.6553 15.9556C10.449 16.3043 9.1597 16.2624 7.97974 15.8362C6.79978 15.4099 5.79235 14.6222 5.1077 13.5903C4.42304 12.5585 4.09785 11.3379 4.18061 10.1106C4.26338 8.88335 4.74967 7.7151 5.56697 6.78012C6.38426 5.84514 7.48876 5.19352 8.71575 4.92246C9.94273 4.6514 11.2265 4.77542 12.3755 5.27601"
                              stroke="#00C49A"
                              stroke-width="2"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                            <path
                              d="M15.8333 5.92578L10 11.6352L8.25 9.92408"
                              stroke="#00C49A"
                              stroke-width="2"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                          </g>
                          <defs>
                            <clipPath id="clip0_1492_5412">
                              <rect
                                width="14"
                                height="13.6889"
                                fill="white"
                                transform="translate(3 3.64453)"
                              />
                            </clipPath>
                          </defs>
                        </svg>

                        <span>Publish</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="header-bar"></div>
            </div>

            <div style={{ marginTop: "30px" }} className="the-test-banner">
              <div className="banner-title">
                <span>{createTestContext.testHeading}</span>
                <div className="banner-info">
                  <button>
                    {createTestContext.testType}{" "}
                    {createTestContext.testInviteType === "Yes"
                      ? "+ Invite Only"
                      : ""}
                  </button>
                  <button>Duration: {createTestContext.testTime} Mins</button>
                </div>
              </div>
              <div className="banner-bottom">
                <div className="banner-details">
                  <span>
                    From {new Date(createTestContext.startDate).toDateString()}{" "}
                    To {new Date(createTestContext.endDate).toDateString()}
                  </span>
                </div>
              </div>
            </div>
            <div className="test-banner-bottom">
              <div className="test-score">
                <svg
                  width="15"
                  height="14"
                  viewBox="0 0 15 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M2.3 0.5H12.7C13.0448 0.5 13.3754 0.652182 13.6192 0.923068C13.863 1.19395 14 1.56135 14 1.94444V6.27778C14 8.19323 13.3152 10.0302 12.0962 11.3847C10.8772 12.7391 9.22391 13.5 7.5 13.5C6.64641 13.5 5.80117 13.3132 5.01256 12.9502C4.22394 12.5873 3.50739 12.0553 2.90381 11.3847C1.68482 10.0302 1 8.19323 1 6.27778V1.94444C1 1.56135 1.13696 1.19395 1.38076 0.923068C1.62456 0.652182 1.95522 0.5 2.3 0.5V0.5Z"
                    stroke="#827C7C"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M4.91016 5.55664L7.51016 8.44553L10.1102 5.55664"
                    stroke="#827C7C"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                <span>Score: {createTestContext.testScore}</span>
              </div>
              <div className="test-cutoff-score">
                <svg
                  width="15"
                  height="14"
                  viewBox="0 0 15 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M2.3 0.5H12.7C13.0448 0.5 13.3754 0.652182 13.6192 0.923068C13.863 1.19395 14 1.56135 14 1.94444V6.27778C14 8.19323 13.3152 10.0302 12.0962 11.3847C10.8772 12.7391 9.22391 13.5 7.5 13.5C6.64641 13.5 5.80117 13.3132 5.01256 12.9502C4.22394 12.5873 3.50739 12.0553 2.90381 11.3847C1.68482 10.0302 1 8.19323 1 6.27778V1.94444C1 1.56135 1.13696 1.19395 1.38076 0.923068C1.62456 0.652182 1.95522 0.5 2.3 0.5V0.5Z"
                    stroke="#827C7C"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M4.91016 5.55664L7.51016 8.44553L10.1102 5.55664"
                    stroke="#827C7C"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                <span>CutOff Score: {createTestContext.testCutOff}</span>
              </div>
              <div className="test-job-role">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M13.3346 14V12.6667C13.3346 11.9594 13.0537 11.2811 12.5536 10.781C12.0535 10.281 11.3752 10 10.668 10H5.33464C4.62739 10 3.94911 10.281 3.44902 10.781C2.94892 11.2811 2.66797 11.9594 2.66797 12.6667V14"
                    stroke="#827C7C"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M7.9987 7.33333C9.47146 7.33333 10.6654 6.13943 10.6654 4.66667C10.6654 3.19391 9.47146 2 7.9987 2C6.52594 2 5.33203 3.19391 5.33203 4.66667C5.33203 6.13943 6.52594 7.33333 7.9987 7.33333Z"
                    stroke="#827C7C"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                <span>Job Role: {getJobRoleData()}</span>
              </div>
            </div>

            <div style={{ marginTop: "30px" }} className="question-title">
              <div className="test-title">
                <div className="test-title-left">
                  <span>MCQ ({getTotalMCQQuestion()})</span>
                  <p>Total Score: {getTotalMCQQuestionScore()}</p>
                </div>
                <div className="test-title-right">
                  <div className="all">
                    <select
                      value={selectedSkill}
                      onChange={(e) => {
                        setselectedSkill(e.target.value);
                      }}
                      name=""
                      id=""
                    >
                      <option value="">All</option>
                      {createTestContext.addedSkills
                        .filter(
                          (v, i, a) =>
                            a.findIndex((v2) => v2.skill === v.skill) === i
                        )
                        .map((data) => {
                          if (data.questions > 0) {
                            return (
                              <option label={data.skill} value={data.skillId} />
                            );
                          }
                        })}
                    </select>
                  </div>
                </div>
              </div>
              {getTotalMCQQuestion() > 0 ? (
                <div className="card-container">
                  {createTestContext.question
                    .filter((question) =>
                      createTestContext.addedSkills.some(
                        (skills) =>
                          skills.skillId === question.skillId && !skills.random
                      )
                    )
                    .map((question, index) => {
                      if (
                        selectedSkill !== ""
                          ? question.skillId === selectedSkill
                          : true
                      ) {
                        return question.questions.type === "MCQ" &&
                          !skillsExits.includes(question.skillId) ? (
                          <TestCard
                            questionNo={index}
                            select={selected1}
                            removeSelection={() => {
                              setSelected1(!selected1);
                            }}
                            data={question.questions}
                          />
                        ) : (
                          <></>
                        );
                      }
                    })}
                  {createTestContext.addedSkills
                    .filter((data) => data.random)
                    .map((data) => {
                      if (
                        selectedSkill !== ""
                          ? data.skillId === selectedSkill
                          : true
                      ) {
                        return data.questionType === "MCQ" ? (
                          <div className="random-skill-container">
                            {" "}
                            <span>
                              {data.skill} score:{" "}
                              {parseInt(
                                data.level.split(",")[0]?.replace(/\D/g, "") *
                                  data.score.split(",")[0]?.replace(/\D/g, "")
                              ) +
                                parseInt(
                                  data.level.split(",")[1]?.replace(/\D/g, "") *
                                    data.score.split(",")[1]?.replace(/\D/g, "")
                                ) +
                                parseInt(
                                  data.level.split(",")[2]?.replace(/\D/g, "") *
                                    data.score.split(",")[2]?.replace(/\D/g, "")
                                )}
                            </span>
                            <div className="easy-container">
                              <svg
                                width="27"
                                height="26"
                                viewBox="0 0 27 26"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <circle
                                  cx="13.4265"
                                  cy="13.1921"
                                  r="12.5867"
                                  fill="#00C49A"
                                />
                                <g clip-path="url(#clip0_1492_5412)">
                                  <path
                                    d="M13.8167 14.273C15.7174 14.273 17.2583 12.7321 17.2583 10.8313C17.2583 8.93053 15.7174 7.38965 13.8167 7.38965C11.9159 7.38965 10.375 8.93053 10.375 10.8313C10.375 12.7321 11.9159 14.273 13.8167 14.273Z"
                                    stroke="white"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                  />
                                  <path
                                    d="M11.9543 13.7276L11.3594 18.2067L13.8177 16.7317L16.276 18.2067L15.6811 13.7227"
                                    stroke="white"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                  />
                                </g>
                                <defs>
                                  <clipPath id="clip0_1492_5412">
                                    <rect
                                      width="11.8"
                                      height="11.8"
                                      fill="white"
                                      transform="translate(7.91797 6.89844)"
                                    />
                                  </clipPath>
                                </defs>
                              </svg>
                              {data.level.split(",")[0]?.replace(/\D/g, "") >
                              0 ? (
                                <>
                                  {data.level.split(",")[0]?.replace(/\D/g, "")}{" "}
                                  Easy questions with{" "}
                                  {data.score.split(",")[0]?.replace(/\D/g, "")}{" "}
                                  marks
                                </>
                              ) : (
                                <>No quextion selection</>
                              )}{" "}
                            </div>
                            <div className="easy-container">
                              <svg
                                width="26"
                                height="26"
                                viewBox="0 0 26 26"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <circle
                                  cx="12.5867"
                                  cy="13.1921"
                                  r="12.5867"
                                  fill="#FF9736"
                                />
                                <g clip-path="url(#clip0_1492_5412)">
                                  <path
                                    d="M12.9768 14.273C14.8776 14.273 16.4185 12.7321 16.4185 10.8313C16.4185 8.93053 14.8776 7.38965 12.9768 7.38965C11.076 7.38965 9.53516 8.93053 9.53516 10.8313C9.53516 12.7321 11.076 14.273 12.9768 14.273Z"
                                    stroke="white"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                  />
                                  <path
                                    d="M11.1144 13.7276L10.5195 18.2067L12.9779 16.7317L15.4362 18.2067L14.8413 13.7227"
                                    stroke="white"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                  />
                                </g>
                                <defs>
                                  <clipPath id="clip0_1492_5412">
                                    <rect
                                      width="11.8"
                                      height="11.8"
                                      fill="white"
                                      transform="translate(7.07812 6.89844)"
                                    />
                                  </clipPath>
                                </defs>
                              </svg>
                              {data.level.split(",")[1]?.replace(/\D/g, "") >
                              0 ? (
                                <>
                                  {data.level.split(",")[1]?.replace(/\D/g, "")}{" "}
                                  Medium questions with{" "}
                                  {data.score.split(",")[1]?.replace(/\D/g, "")}{" "}
                                  marks
                                </>
                              ) : (
                                <>No question selection</>
                              )}{" "}
                            </div>
                            <div className="easy-container">
                              <svg
                                width="27"
                                height="26"
                                viewBox="0 0 27 26"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <circle
                                  cx="13.4265"
                                  cy="13.1921"
                                  r="12.5867"
                                  fill="#FF6812"
                                />
                                <g clip-path="url(#clip0_1492_5412)">
                                  <path
                                    d="M13.8167 14.273C15.7174 14.273 17.2583 12.7321 17.2583 10.8313C17.2583 8.93053 15.7174 7.38965 13.8167 7.38965C11.9159 7.38965 10.375 8.93053 10.375 10.8313C10.375 12.7321 11.9159 14.273 13.8167 14.273Z"
                                    stroke="white"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                  />
                                  <path
                                    d="M11.9543 13.7276L11.3594 18.2067L13.8177 16.7317L16.276 18.2067L15.6811 13.7227"
                                    stroke="white"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                  />
                                </g>
                                <defs>
                                  <clipPath id="clip0_1492_5412">
                                    <rect
                                      width="11.8"
                                      height="11.8"
                                      fill="white"
                                      transform="translate(7.91797 6.89844)"
                                    />
                                  </clipPath>
                                </defs>
                              </svg>
                              {data.level.split(",")[2]?.replace(/\D/g, "") >
                              0 ? (
                                <>
                                  {data.level.split(",")[2]?.replace(/\D/g, "")}{" "}
                                  Hard questions with{" "}
                                  {data.score.split(",")[2]?.replace(/\D/g, "")}{" "}
                                  marks
                                </>
                              ) : (
                                <>No question selection</>
                              )}{" "}
                            </div>
                          </div>
                        ) : (
                          <></>
                        );
                      }
                    })}
                </div>
              ) : (
                <div>No question available</div>
              )}
            </div>

            {getTotalProgrammingQuestion() > 0 ? (
              <div style={{ marginTop: "30px" }} className="question-title">
                <div className="test-title">
                  <div className="test-title-left">
                    <span>Programming ({getTotalProgrammingQuestion()})</span>
                    <p>Total Score: {getTotalProgrammingQuestionScore()}</p>
                  </div>
                  {/* <div className="test-title-right">
                                <div className="remove-question">
                                    <svg width="15" height="16" viewBox="0 0 15 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M1.875 4.25H3.125H13.125" stroke="#F23E3E" stroke-linecap="round" stroke-linejoin="round" />
                                        <path d="M11.875 4.25V13C11.875 13.3315 11.7433 13.6495 11.5089 13.8839C11.2745 14.1183 10.9565 14.25 10.625 14.25H4.375C4.04348 14.25 3.72554 14.1183 3.49112 13.8839C3.2567 13.6495 3.125 13.3315 3.125 13V4.25M5 4.25V3C5 2.66848 5.1317 2.35054 5.36612 2.11612C5.60054 1.8817 5.91848 1.75 6.25 1.75H8.75C9.08152 1.75 9.39946 1.8817 9.63388 2.11612C9.8683 2.35054 10 2.66848 10 3V4.25" stroke="#F23E3E" stroke-linecap="round" stroke-linejoin="round" />
                                        <path d="M6.25 7.375V11.125" stroke="#F23E3E" stroke-linecap="round" stroke-linejoin="round" />
                                        <path d="M8.75 7.375V11.125" stroke="#F23E3E" stroke-linecap="round" stroke-linejoin="round" />
                                    </svg>
                                    <span>Remove Questions (5)</span>
                                </div>
                                <div className="all">
                                    <select name="" id="">
                                        <option value="all">All</option>
                                    </select>
                                </div>
                            </div> */}
                </div>
                <div className="card-container">
                  {createTestContext.question
                    .filter((question) =>
                      createTestContext.addedSkills.some(
                        (skills) =>
                          skills.skillId === question.skillId && !skills.random
                      )
                    )
                    .map((question, index) => {
                      if (
                        selectedSkill !== ""
                          ? question.skillId === selectedSkill
                          : true
                      ) {
                        return question.questions.type === "Programming" &&
                          !skillsExits.includes(question.skillId) ? (
                          <TestCard
                            questionNo={index}
                            select={selected4}
                            removeSelection={() => {
                              setSelected4(!selected4);
                            }}
                            data={question.questions}
                          />
                        ) : (
                          <></>
                        );
                      }
                    })}
                  {createTestContext.addedSkills
                    .filter((data) => data.random)
                    .map((data) => {
                      if (
                        selectedSkill !== ""
                          ? data.skillId === selectedSkill
                          : true
                      ) {
                        return data.questionType === "Programming" ? (
                          <div className="random-skill-container">
                            {" "}
                            <span>
                              {data.skill} score:{" "}
                              {parseInt(
                                data.level.split(",")[0]?.replace(/\D/g, "") *
                                  data.score.split(",")[0]?.replace(/\D/g, "")
                              ) +
                                parseInt(
                                  data.level.split(",")[1]?.replace(/\D/g, "") *
                                    data.score.split(",")[1]?.replace(/\D/g, "")
                                ) +
                                parseInt(
                                  data.level.split(",")[2]?.replace(/\D/g, "") *
                                    data.score.split(",")[2]?.replace(/\D/g, "")
                                )}
                            </span>
                            <div className="easy-container">
                              <svg
                                width="27"
                                height="26"
                                viewBox="0 0 27 26"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <circle
                                  cx="13.4265"
                                  cy="13.1921"
                                  r="12.5867"
                                  fill="#00C49A"
                                />
                                <g clip-path="url(#clip0_1492_5412)">
                                  <path
                                    d="M13.8167 14.273C15.7174 14.273 17.2583 12.7321 17.2583 10.8313C17.2583 8.93053 15.7174 7.38965 13.8167 7.38965C11.9159 7.38965 10.375 8.93053 10.375 10.8313C10.375 12.7321 11.9159 14.273 13.8167 14.273Z"
                                    stroke="white"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                  />
                                  <path
                                    d="M11.9543 13.7276L11.3594 18.2067L13.8177 16.7317L16.276 18.2067L15.6811 13.7227"
                                    stroke="white"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                  />
                                </g>
                                <defs>
                                  <clipPath id="clip0_1492_5412">
                                    <rect
                                      width="11.8"
                                      height="11.8"
                                      fill="white"
                                      transform="translate(7.91797 6.89844)"
                                    />
                                  </clipPath>
                                </defs>
                              </svg>
                              {data.level.split(",")[0]?.replace(/\D/g, "")}{" "}
                              Easy questions with{" "}
                              {data.score.split(",")[0]?.replace(/\D/g, "")}{" "}
                              marks
                            </div>
                            <div className="easy-container">
                              <svg
                                width="26"
                                height="26"
                                viewBox="0 0 26 26"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <circle
                                  cx="12.5867"
                                  cy="13.1921"
                                  r="12.5867"
                                  fill="#FF9736"
                                />
                                <g clip-path="url(#clip0_1492_5412)">
                                  <path
                                    d="M12.9768 14.273C14.8776 14.273 16.4185 12.7321 16.4185 10.8313C16.4185 8.93053 14.8776 7.38965 12.9768 7.38965C11.076 7.38965 9.53516 8.93053 9.53516 10.8313C9.53516 12.7321 11.076 14.273 12.9768 14.273Z"
                                    stroke="white"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                  />
                                  <path
                                    d="M11.1144 13.7276L10.5195 18.2067L12.9779 16.7317L15.4362 18.2067L14.8413 13.7227"
                                    stroke="white"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                  />
                                </g>
                                <defs>
                                  <clipPath id="clip0_1492_5412">
                                    <rect
                                      width="11.8"
                                      height="11.8"
                                      fill="white"
                                      transform="translate(7.07812 6.89844)"
                                    />
                                  </clipPath>
                                </defs>
                              </svg>
                              {data.level.split(",")[1]?.replace(/\D/g, "")}{" "}
                              Medium questions with{" "}
                              {data.score.split(",")[1]?.replace(/\D/g, "")}{" "}
                              marks
                            </div>
                            <div className="easy-container">
                              <svg
                                width="27"
                                height="26"
                                viewBox="0 0 27 26"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <circle
                                  cx="13.4265"
                                  cy="13.1921"
                                  r="12.5867"
                                  fill="#FF6812"
                                />
                                <g clip-path="url(#clip0_1492_5412)">
                                  <path
                                    d="M13.8167 14.273C15.7174 14.273 17.2583 12.7321 17.2583 10.8313C17.2583 8.93053 15.7174 7.38965 13.8167 7.38965C11.9159 7.38965 10.375 8.93053 10.375 10.8313C10.375 12.7321 11.9159 14.273 13.8167 14.273Z"
                                    stroke="white"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                  />
                                  <path
                                    d="M11.9543 13.7276L11.3594 18.2067L13.8177 16.7317L16.276 18.2067L15.6811 13.7227"
                                    stroke="white"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                  />
                                </g>
                                <defs>
                                  <clipPath id="clip0_1492_5412">
                                    <rect
                                      width="11.8"
                                      height="11.8"
                                      fill="white"
                                      transform="translate(7.91797 6.89844)"
                                    />
                                  </clipPath>
                                </defs>
                              </svg>
                              {data.level.split(",")[2]?.replace(/\D/g, "")}{" "}
                              Hard questions with{" "}
                              {data.score.split(",")[2]?.replace(/\D/g, "")}{" "}
                              marks
                            </div>
                          </div>
                        ) : (
                          <></>
                        );
                      }
                    })}
                </div>
              </div>
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TestTest;
