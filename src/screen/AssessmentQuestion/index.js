import React, { useState, useEffect, useContext } from "react";
import "./index.css";
import AssessmentPreviewSideBar from "../../component/AssessmentOverviewSidebar";
import NavigationBar from "../../component/NavigationBar/NavigationBar";
import { useNavigate, useLocation, useParams, Link } from "react-router-dom";
import QuestionCard from "./QuestionCard";
import axios from "axios";
import { backend_url, getCookie } from "../../constant";
import TestSummaryContext from "../../store/TestSummaryContext";
import LibraryCardSkeleton from "../../component/LibraryCardSkeleton";
import QuestionPreviewModel from "../../component/QuestionPreviewModel/index";
import EditQuestionModel from "../../component/EditQuestionModel";
import AddMultipleSkill from "../ChooseFromLibrary/AddMultipleSkill";

function AssessmentQuestion() {
  let navigate = useNavigate();
  const context = useContext(TestSummaryContext);
  const [questions, setQuestions] = useState(null);
  const [mcq, setMcq] = useState([]);
  const [programming, setProgramming] = useState([]);
  const [mcqScore, setMcqScore] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loader, setLoader] = useState([1, 2, 3, 4, 5]);
  const [questionPreview, setquestionPreview] = useState(false);
  const [editQuestion, seteditQuestion] = useState(false);
  const [selectedQuestionData, setselectedQuestionData] = useState("");
  const [selectedQuestionIndex, setselectedQuestionIndex] = useState("");
  const [userClientID, setuserClientID] = useState("");
  const [selectedQuestion, setselectedQuestion] = useState("");
  const [deleteQuestionModel, setdeleteQuestionModel] = useState(false);
  const [selectQuestionForDelete, setselectQuestionForDelete] = useState("");
  const [test, setTest] = useState(context.test);
  const [randomSkill, setrandomSkill] = useState([]);

  useEffect(() => {
    getQuestions();
  }, []);

  const { id } = useParams();
  const getQuestions = async () => {
    try {
      setLoading(true);
      let mcqMarks = 0;
      let totalMarks = 0;
      const token = getCookie("Xh7ERL0G");
      context.handleTestId(id);
      const response = await axios.get(
        `${backend_url}exam/test/${id}/Combinequestions`
      );

      //const response = await axios.get(`${backend_url}testsummary/find/summary/${id}`, { headers: { "token": token } })

      setQuestions(response.data.data);
      const { testSummaryData, random } = response.data;
      const randomSkillset = testSummaryData.skills.filter(
        (data) => data.isRandom === true
      );
      console.log(randomSkillset);
      setrandomSkill(randomSkillset);
      const staticEasyQuestion = testSummaryData.skills.flatMap(
        ({ easy_question }) =>
          easy_question.filter((data) => data.type === "MCQ")
      );

      const staticMediumQuestion = testSummaryData.skills.flatMap(
        ({ medium_question }) =>
          medium_question.filter((data) => data.type === "MCQ")
      );

      const staticHardQuestion = testSummaryData.skills.flatMap(
        ({ hard_question }) =>
          hard_question.filter((data) => data.type === "MCQ")
      );

      const randomEasyQuestion = random.flatMap(({ question }) =>
        question.filter((data) => data.type === "MCQ")
      );

      const allMcqQuestions = staticEasyQuestion.concat(
        staticMediumQuestion,
        staticHardQuestion
      );
      // const mcqQuestions = response.data.testSummaryData.skills.filter((data) => data.question_type === "MCQ")
      // const programmingQuestions = response.data.data.skills.filter((data) => data.question_type === "Programming")
      // if (mcqQuestions.length !== 0) {
      //     mcqQuestions[0]?.easy_question.map((data) => {
      //         mcqMarks += data.score
      //         totalMarks += data.score
      //     })
      //     mcqQuestions[0]?.medium_question.map((data) => {
      //         mcqMarks += data.score
      //         totalMarks += data.score
      //     })
      //     mcqQuestions[0]?.hard_question.map((data) => {
      //         mcqMarks += data.score
      //         totalMarks += data.score
      //     })
      // }
      setMcqScore(mcqMarks);
      setTotalScore(totalMarks);
      //setProgramming(programmingQuestions)
      setMcq(allMcqQuestions);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const updateTestQuestions = async (updatedQuestion) => {
    console.log(updatedQuestion);
    // testsummary/update/{id}
    // /find/summary/:id
    try {
      setLoading(true);
      const token = getCookie("Xh7ERL0G");
      const response = await axios.get(`${backend_url}getTestSummary/${id}`);
      let data = response.data.data;
      for (let i = 0; i < data.skills.length; i++) {
        if (
          data.skills[i].skill_id._id === updatedQuestion.skillsId[0].skills._id
        ) {
          for (let j = 0; j < data.skills[i].easy_question.length; j++) {
            if (data.skills[i].easy_question[j]._id === updatedQuestion._id) {
              data.skills[i].easy_question[j] = updatedQuestion;
            }
          }
          for (let j = 0; j < data.skills[i].medium_question.length; j++) {
            if (data.skills[i].medium_question[j]._id === updatedQuestion._id) {
              data.skills[i].medium_question[j] = updatedQuestion;
            }
          }
          for (let j = 0; j < data.skills[i].hard_question.length; j++) {
            if (data.skills[i].hard_question[j]._id === updatedQuestion._id) {
              data.skills[i].hard_question[j] = updatedQuestion;
            }
          }
        }
      }
      console.log(data);
      if (response.status === 200) {
        const response1 = await axios.put(
          `${backend_url}testsummary/update/${data._id}`,
          data,
          {
            headers: { token: token },
          }
        );
        console.log(response1);
        setLoading(false);
      }
      getQuestions();
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const getTotalScore = () => {
    const totalScore = mcq.reduce((totalScore, questions) => {
      totalScore = totalScore + questions.score;
      return totalScore;
    }, 0);
    return totalScore;
  };

  const getEasyMCQQuestion = () => {
    let totaleasymcqquestion = mcq.reduce((easymcqquestion, question) => {
      if (
        question?.difficultyLevelId?.level === "easy" &&
        question?.type === "MCQ"
      ) {
        easymcqquestion += 1;
      }
      return easymcqquestion;
    }, 0);

    randomSkill.forEach((data) => {
      if (data.isRandom) {
        totaleasymcqquestion =
          totaleasymcqquestion + parseInt(data.easy_question);
      }
    });

    return totaleasymcqquestion;
  };

  const getMediumMCQQuestion = () => {
    let totaleasymcqquestion = mcq.reduce((easymcqquestion, question) => {
      if (
        question?.difficultyLevelId?.level === "medium" &&
        question?.type === "MCQ"
      ) {
        easymcqquestion += 1;
      }
      return easymcqquestion;
    }, 0);

    randomSkill.forEach((data) => {
      if (data.isRandom) {
        totaleasymcqquestion =
          totaleasymcqquestion + parseInt(data.medium_question);
      }
    });

    return totaleasymcqquestion;
  };

  const getHardMCQQuestion = () => {
    let totaleasymcqquestion = mcq.reduce((easymcqquestion, question) => {
      if (
        question?.difficultyLevelId?.level === "hard" &&
        question?.type === "MCQ"
      ) {
        easymcqquestion += 1;
      }
      return easymcqquestion;
    }, 0);

    randomSkill.forEach((data) => {
      if (data.isRandom) {
        totaleasymcqquestion =
          totaleasymcqquestion + parseInt(data.hard_question);
      }
    });

    return totaleasymcqquestion;
  };

  const getRandomSkillTotalQuestionsCount = () => {
    const totalCount = randomSkill.reduce(
      (totalRandomQuestion, randomQuestion) => {
        if (randomQuestion.isRandom) {
          totalRandomQuestion +=
            parseInt(randomQuestion.easy_question) +
            parseInt(randomQuestion.medium_question) +
            parseInt(randomQuestion.hard_question);
        }
        return totalRandomQuestion;
      },
      0
    );
    return totalCount;
  };

  const getRandomSkillTotalScoreCount = () => {
    const totalCount = randomSkill.reduce(
      (totalRandomQuestion, randomQuestion) => {
        if (randomQuestion.isRandom) {
          totalRandomQuestion +=
            parseInt(
              randomQuestion.easy_question *
                randomQuestion.score
                  .join(", ")
                  .split(",")[0]
                  ?.replace(/\D/g, "")
            ) +
            parseInt(
              randomQuestion.medium_question *
                randomQuestion.score
                  .join(", ")
                  .split(",")[1]
                  ?.replace(/\D/g, "")
            ) +
            parseInt(
              randomQuestion.hard_question *
                randomQuestion.score
                  .join(", ")
                  .split(",")[2]
                  ?.replace(/\D/g, "")
            );
        }
        return totalRandomQuestion;
      },
      0
    );
    return totalCount;
  };

  return (
    <div className="assessment-question">
      <NavigationBar assessment={false} />
      {questionPreview && (
        <QuestionPreviewModel
          onClickEdit={() => {
            setquestionPreview(false);
            seteditQuestion(true);
          }}
          selectedQuestionIndex={selectedQuestionIndex}
          data={selectedQuestionData}
          onClickCancel={() => setquestionPreview(false)}
        />
      )}
      {
        editQuestion && (
          <EditQuestionModel
            onClickCancel={() => seteditQuestion(false)}
            data={selectedQuestionData}
            onClickSave={(updatedQuestion) => {
              updateTestQuestions(updatedQuestion);
              seteditQuestion(false);
              getQuestions();
            }}
            // onClickDelete={() => {
            //   seteditQuestion(false);
            //   setdeleteQuestionModel(true);
            // }}
          />
        ) // <EditQuestionModel onClickCancel={() => seteditQuestion(false)} data={selectedQuestionData} />
      }
      <div className="assessment-question-container">
        <div className="assessment-question-container-left">
          <AssessmentPreviewSideBar
            testType={test?.status}
            testDetails={test}
            testName={test?.name}
            active={"questions"}
          />
        </div>
        <div className="assessment-question-container-right">
          <div className="assessment-question-content">
            {/* <div className="assessment-header">
                            <div className="header-left">
                                <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="24" cy="24" r="24" fill="#00C49A" fill-opacity="0.1" />
                                    <path d="M24 35C29.5228 35 34 30.5228 34 25C34 19.4772 29.5228 15 24 15C18.4772 15 14 19.4772 14 25C14 30.5228 18.4772 35 24 35Z" stroke="#00C49A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                    <path d="M21.0938 21.9996C21.3289 21.3313 21.7929 20.7677 22.4037 20.4087C23.0145 20.0498 23.7326 19.9185 24.4309 20.0383C25.1292 20.1581 25.7626 20.5211 26.2188 21.0631C26.6751 21.6051 26.9248 22.2911 26.9237 22.9996C26.9237 24.9996 23.9237 25.9996 23.9237 25.9996" stroke="#00C49A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                    <path d="M24 30H24.0109" stroke="#00C49A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                                <div className="title">
                                    {loading ? <div className="skeleton" /> : <span>{questions?.name}</span>}
                                    {loading ? <div className="skeleton" style={{
                                        width: "100px"
                                    }} /> : <p>Questions ({questions?.skills.length === 0 ? 0 : questions?.skills[0].easy_question.length + questions?.skills[0].hard_question.length + questions?.skills[0].medium_question.length || 0})</p>}

                                </div>
                            </div>
                            <div className="header-right">
                                <div className="preview-btn" onClick={() => { navigate('/assessmenteditquestion') }} >
                                    <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="10.5169" cy="10.7578" r="10" transform="rotate(-0.456831 10.5169 10.7578)" fill="white" />
                                        <g clip-path="url(#clip0_2983_2075)">
                                            <path d="M12.5391 6.27584C12.6485 6.16641 12.7784 6.0796 12.9214 6.02037C13.0644 5.96115 13.2176 5.93066 13.3724 5.93066C13.5272 5.93066 13.6804 5.96115 13.8234 6.02037C13.9664 6.0796 14.0963 6.16641 14.2057 6.27584C14.3152 6.38528 14.402 6.5152 14.4612 6.65818C14.5204 6.80116 14.5509 6.95441 14.5509 7.10918C14.5509 7.26394 14.5204 7.41719 14.4612 7.56017C14.402 7.70316 14.3152 7.83307 14.2057 7.94251L8.58073 13.5675L6.28906 14.1925L6.91406 11.9008L12.5391 6.27584Z" stroke="#00C49A" stroke-linecap="round" stroke-linejoin="round" />
                                        </g>
                                        <defs>
                                            <clipPath id="clip0_2983_2075">
                                                <rect width="10" height="10" fill="white" transform="translate(5.45312 5.02539)" />
                                            </clipPath>
                                        </defs>
                                    </svg>
                                    <span>Edit Questions</span>
                                </div>
                            </div>
                        </div> */}

            <div className="assessment-admin">
              <div className="admin-table">
                <table className="admin" cellSpacing={0}>
                  <tr>
                    <th>Question Type</th>
                    <th>Difficulty Level</th>
                    <th>
                      Questions (
                      {mcq?.length +
                        parseInt(getRandomSkillTotalQuestionsCount())}
                      )
                    </th>
                    <th>
                      Score (
                      {parseInt(getTotalScore()) +
                        parseInt(getRandomSkillTotalScoreCount())}
                      )
                    </th>
                  </tr>
                  <tr>
                    {loading ? (
                      <td>
                        {" "}
                        <div className="skeleton" />
                      </td>
                    ) : (
                      <td>Multiple Choice Questions</td>
                    )}

                    {loading ? (
                      <td>
                        {" "}
                        <div className="skeleton" />
                      </td>
                    ) : (
                      <td>
                        Easy ({getEasyMCQQuestion()}), Medium (
                        {getMediumMCQQuestion()}), Hard ({getHardMCQQuestion()})
                      </td>
                    )}
                    {loading ? (
                      <td>
                        {" "}
                        <div className="skeleton" />
                      </td>
                    ) : (
                      <td>
                        {parseInt(getEasyMCQQuestion()) +
                          parseInt(getMediumMCQQuestion()) +
                          parseInt(getHardMCQQuestion())}
                      </td>
                    )}
                    {loading ? (
                      <td>
                        {" "}
                        <div className="skeleton" />
                      </td>
                    ) : (
                      <td>
                        {parseInt(getTotalScore()) +
                          parseInt(getRandomSkillTotalScoreCount())}
                      </td>
                    )}
                  </tr>
                  {/* <tr>
                                        <td>Programming</td>
                                        <td>Easy (3), Medium (2), Hard (5)</td>
                                        <td>10</td>
                                        <td>20</td>
                                    </tr> */}
                </table>
              </div>
            </div>

            <div className="question-cards">
              <div className="question-card-title">
                <span>
                  MCQ (
                  {mcq.length + parseInt(getRandomSkillTotalQuestionsCount())}){" "}
                  <p>
                    Total Score:{" "}
                    {parseInt(getTotalScore()) +
                      parseInt(getRandomSkillTotalScoreCount())}
                  </p>{" "}
                </span>
                <button>
                  <svg
                    width="20"
                    height="21"
                    viewBox="0 0 20 21"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle cx="10" cy="10.3955" r="10" fill="white" />
                    <path
                      d="M7.31092 6.39965C6.92633 6.39064 6.54154 6.40162 6.15811 6.43267C5.85899 6.42648 5.57028 6.54244 5.35866 6.75399C5.14703 6.96545 5.03081 7.25411 5.03684 7.55319C5.00576 7.93661 4.99474 8.32144 5.00379 8.70599V11.3958C5.00379 12.2604 4.94999 12.0034 5.2478 12.4438C5.406 12.6587 5.63916 12.8063 5.90106 12.8573C6.11623 12.8999 6.33497 12.9218 6.55431 12.9229C6.55892 13.0612 6.56353 13.198 6.57698 13.3159C6.57075 13.615 6.68678 13.9038 6.89826 14.1154C7.10974 14.3271 7.39839 14.4432 7.6975 14.4372C7.90192 14.4603 8.14823 14.4656 8.4203 14.468C8.43473 14.4692 8.44923 14.4697 8.46371 14.4693L12.6906 14.4692C13.0752 14.4782 13.46 14.4672 13.8434 14.4362C14.1425 14.4422 14.4312 14.326 14.6427 14.1144C14.8541 13.9028 14.9702 13.614 14.9639 13.3149C14.9949 12.9315 15.006 12.5468 14.997 12.1621V11.3936C14.9971 11.3783 14.9964 11.363 14.9947 11.3479C14.9924 11.0766 14.987 10.8307 14.9639 10.6267C14.9701 10.3276 14.854 10.0389 14.6425 9.82726C14.4311 9.61571 14.1425 9.49947 13.8434 9.50538C13.7247 9.49197 13.5871 9.48775 13.448 9.48305C13.4556 9.45106 13.4591 9.41832 13.4584 9.38549C13.4658 9.07843 13.4426 8.77138 13.3892 8.46892C13.342 8.20455 13.1977 7.96748 12.9846 7.80415C12.5446 7.49681 12.7963 7.55104 11.9225 7.55104H10.9026C10.5235 7.57252 10.1438 7.52167 9.78367 7.40112C9.63149 7.3362 9.49899 7.23254 9.39941 7.10035C9.22044 6.88833 8.99525 6.72021 8.74115 6.60886C8.29198 6.44843 7.8158 6.37732 7.33935 6.39946V6.39946H7.31245L7.31092 6.39965ZM7.31045 7.16811C7.69424 7.14654 8.07865 7.19738 8.44365 7.31794C8.59707 7.38239 8.73071 7.48633 8.83099 7.61917C9.00846 7.83063 9.23189 7.99875 9.48424 8.11067C9.93847 8.27381 10.4206 8.34511 10.9026 8.32044H11.9216C12.7947 8.32044 12.4627 8.37889 12.5422 8.43574C12.5806 8.46379 12.6045 8.48415 12.6367 8.63406C12.6762 8.88577 12.6936 9.14047 12.6886 9.39527C12.6886 9.42192 12.6913 9.44837 12.6967 9.47445H12.4385C12.0593 9.49603 11.6796 9.44518 11.3195 9.32472C11.1672 9.25962 11.0347 9.15567 10.9352 9.02339C10.7563 8.81137 10.5311 8.64316 10.277 8.5318C9.82735 8.37166 9.35083 8.30055 8.87403 8.3225H8.84713C8.46254 8.31359 8.07776 8.32475 7.69434 8.3559C7.39523 8.34971 7.1065 8.46566 6.89487 8.67722C6.68324 8.88867 6.56702 9.17734 6.57305 9.47642C6.54197 9.85984 6.53094 10.2446 6.54 10.6292V12.1544C6.38245 12.1516 6.22534 12.1368 6.07005 12.1101C5.92749 12.0775 5.91135 12.0572 5.8833 12.0156C5.8272 11.9326 5.77148 12.262 5.77148 11.3977V8.70789C5.77148 8.22869 5.77379 7.87519 5.79992 7.64235C5.82605 7.4095 5.87101 7.33032 5.90137 7.29992C5.93173 7.26953 6.01011 7.22572 6.24298 7.19964C6.47586 7.17356 6.83166 7.16811 7.31045 7.16811V7.16811ZM8.84907 9.0895C9.23284 9.06802 9.61725 9.11877 9.98226 9.23932C10.1356 9.30358 10.2693 9.40744 10.3696 9.54009C10.547 9.75164 10.7705 9.91976 11.0229 10.0317C11.477 10.1952 11.9591 10.2666 12.4412 10.242L12.6917 10.2419C13.1709 10.2419 13.5248 10.2443 13.7573 10.2703C13.9898 10.2964 14.0693 10.3415 14.0997 10.3718C14.13 10.4021 14.1742 10.4805 14.2003 10.7133C14.2265 10.9462 14.2288 11.3001 14.2288 11.7789V12.1631C14.2288 12.642 14.2265 12.9966 14.2003 13.2291C14.1742 13.4615 14.13 13.5403 14.0997 13.5703C14.0693 13.6002 13.9901 13.6471 13.7573 13.6717C13.5244 13.6963 13.1709 13.6997 12.6917 13.6997H8.84907C8.36989 13.6997 8.01598 13.6974 7.7835 13.6717C7.55101 13.646 7.47147 13.6006 7.44112 13.5703C7.41077 13.54 7.36657 13.4612 7.34045 13.2291C7.31432 12.997 7.31201 12.6421 7.31201 12.1636V10.6266C7.31201 10.1477 7.31432 9.79348 7.34045 9.56139C7.36657 9.32929 7.41154 9.24936 7.4419 9.21859C7.47226 9.18782 7.55103 9.14438 7.78351 9.1183C8.01599 9.09222 8.37027 9.0895 8.84907 9.0895V9.0895Z"
                      fill="#FF6812"
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                    />
                  </svg>
                  <Link
                    style={{ textDecoration: "none" }}
                    to={`/choosefromlibrary?testId=${id}`}
                  >
                    <span>Choose From Library</span>
                  </Link>
                </button>
              </div>

              {loading ? (
                loader.map((data, index) => {
                  return <LibraryCardSkeleton from="overview" key={index} />;
                })
              ) : (
                <div className="detailed-question-cards">
                  {mcq.map((question, index) => {
                    return (
                      <QuestionCard
                        question={question}
                        key={index}
                        number={index + 1}
                        level={question.difficultyLevelId?.level}
                        skills={question?.skillsId}
                        onClickQuestion={() => {
                          setselectedQuestion(question._id);
                          setselectedQuestionData(question);
                          setselectedQuestionIndex(index + 1);
                          setquestionPreview(true);
                        }}
                        sourceSelected={
                          question.clientId === "632c16db596546cfa858136f"
                            ? "EliteQA Library"
                            : "My Library"
                        }
                        data={question}
                      />
                    );
                  })}
                  {/* {mcq[0]?.medium_question.map((question, index) => {
                                    return <QuestionCard question={question} key={index} number={mcq[0].easy_question.length + index + 1} level="Medium" skills={mcq[0]?.skill_id} onClickQuestion={() => { setselectedQuestion(question._id); setselectedQuestionData(question); setselectedQuestionIndex(index + 1); setquestionPreview(true) }} sourceSelected={question.clientId === "632c16db596546cfa858136f" ? "EliteQA Library" : "My Library"} data={question} />
                                })}
                                {mcq[0]?.hard_question.map((question, index) => {
                                    return <QuestionCard question={question} key={index} number={mcq[0].medium_question.length + mcq[0].easy_question.length + index + 1} level="Hard" skills={mcq[0]?.skill_id} onClickQuestion={() => { setselectedQuestion(question._id); setselectedQuestionData(question); setselectedQuestionIndex(index + 1); setquestionPreview(true) }} sourceSelected={question.clientId === "632c16db596546cfa858136f" ? "EliteQA Library" : "My Library"} data={question} />
                                })} */}
                  {randomSkill.map((data) => {
                    return (
                      <div className="random-skill-test-overview-container">
                        {" "}
                        <span>
                          {data.skill_id.skills} score:{" "}
                          {parseInt(
                            data.easy_question *
                              data.score
                                .join(", ")
                                .split(",")[0]
                                ?.replace(/\D/g, "")
                          ) +
                            parseInt(
                              data.medium_question *
                                data.score
                                  .join(", ")
                                  .split(",")[1]
                                  ?.replace(/\D/g, "")
                            ) +
                            parseInt(
                              data.hard_question *
                                data.score
                                  .join(", ")
                                  .split(",")[2]
                                  ?.replace(/\D/g, "")
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
                          {data.easy_question > 0 ? (
                            <>
                              {data.easy_question} Easy questions with{" "}
                              {data.score
                                .join(", ")
                                .split(",")[0]
                                ?.replace(/\D/g, "")}{" "}
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
                          {data.medium_question > 0 ? (
                            <>
                              {data.medium_question} Medium questions with{" "}
                              {data.score
                                .join(", ")
                                .split(",")[1]
                                ?.replace(/\D/g, "")}{" "}
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
                          {data.hard_question > 0 ? (
                            <>
                              {data.hard_question} Hard questions with{" "}
                              {data.score
                                .join(", ")
                                .split(",")[2]
                                ?.replace(/\D/g, "")}{" "}
                              marks
                            </>
                          ) : (
                            <>No question selection</>
                          )}{" "}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* programming question cards */}

            {/* {programming.length === 0 ? null : <div className="question-cards">
                            <div className="question-card-title">
                                <span>Programming (3)</span>
                                <p>Total Score: 30</p>
                            </div>

                            <div className="detailed-question-card">
                                <QuestionCard />
                                <QuestionCard difficulty={"medium"} question={""} />
                            </div>
                        </div>} */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AssessmentQuestion;
