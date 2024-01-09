import { useState, useContext, useEffect } from "react";
import { toast } from "react-toastify";
import "./index.css";
import CreateTestContext from "../../../store/CreateTestContext";
import { backend_url, getCookie } from "../../../constant";
import axios from "axios";

const AddMultipleSkill = ({
  skills,
  closeMutipleSkillModal,
  question,
  clearSelectedMutipleQuestion,
}) => {
  const [selectedSkillSet, setselectedSkillSet] = useState([]);
  const [isSkillAdded, setisSkillAdded] = useState(false);
  const createTestContext = useContext(CreateTestContext);
  const token = getCookie("Xh7ERL0G");

  useEffect(() => {
    if (isSkillAdded) {
      addToLibrary();
    }
  }, [isSkillAdded]);

  const checkSearchedSkillAddedOrNot = (skill, type) => {
    console.log(skill, type);
    // let isSkillExits = ''
    // createTestContext.addedSkills.forEach((skillData) => {
    //     console.log(skill, skillData.skill)
    //     if (skill === skillData.skill && skillData.questionType === type) {
    //         isSkillExits = true
    //     } else {
    //         isSkillExits = false
    //     }
    // })
    // return isSkillExits
    return createTestContext.addedSkills.some(
      (skillData) =>
        skillData.skill === skill && skillData.questionType === type
    );
  };

  const createSkillObject = async (skillName, type, skillId) => {
    const objForQuestionOverView = {
      skillName: skillName,
      totalNoOfQuestion: 0,
      totalScore: 0,
      type: type,
      filterType: "all",
      isChooseFromLibraryAdded: true,
      easyQuestion: {
        isPreviewQuestion: true,
        isSelectAll: false,
        question: [],
      },
      mediumQuestion: {
        isPreviewQuestion: false,
        isSelectAll: false,
        question: [],
      },
      hardQuestion: {
        isPreviewQuestion: false,
        isSelectAll: false,
        question: [],
      },
    };

    createTestContext.setquestionOverview(objForQuestionOverView);

    const objForSkillAdded = {
      skillId: skillId,
      skill: skillName,
      questionType: type,
      level: "Easy (0), Medium (0), Hard (0)",
      questions: 0,
      score: 0,
      random: false,
      isChooseFromLibraryAdded: true,
    };
    createTestContext.setAddedSkills(objForSkillAdded);
  };

  const handleSkillChange = (e, question, id) => {
    const isQuestionExits = selectedSkillSet.filter(
      (skillObject) =>
        skillObject.question === question && skillObject.id === id
    );
    if (isQuestionExits.length) {
      const updatedSkillSet = selectedSkillSet.map((skillData) => {
        if (skillData.question === question && skillData.id === id) {
          return { ...skillData, skill: e.target.value };
        }
        return skillData;
      });

      setselectedSkillSet(updatedSkillSet);
    } else {
      setselectedSkillSet((prev) => [
        ...prev,
        { skill: e.target.value, question: question, id: id },
      ]);
    }
  };

  const addToLibrary = () => {
    question.forEach(async (mutipleQuestion) => {
      createTestContext.setQuestions({
        skillId: createTestContext.addedSkills
          .filter((data) =>
            selectedSkillSet.some(
              (skillData) =>
                skillData.skill === data.skill &&
                skillData.question === mutipleQuestion.question
            )
          )
          .map((data) => data.skillId)[0],
        questions: mutipleQuestion,
      });
      // const res = await axios.put(
      //   `${backend_url}question/updateQuestion/${mutipleQuestion._id}`,
      //   {
      //     ...mutipleQuestion,
      //     noOfTimesUsed:
      //       mutipleQuestion.noOfTimesUsed > 0
      //         ? mutipleQuestion.noOfTimesUsed - 1
      //         : 0,
      //   },
      //   { headers: { token: token } }
      // );

      let searchSkill = mutipleQuestion?.skillsId?.map((data) => {
        return data?.skills?.skills;
      });
      // addMissingSkills(searchSkill, createTestContext.addedSkills);
      createTestContext.addedSkills.forEach((skillData) => {
        if (
          createTestContext.addedSkills
            .filter((data) =>
              selectedSkillSet.some(
                (skillData) =>
                  skillData.skill === data.skill &&
                  skillData.question === mutipleQuestion.question
              )
            )
            .map((data) => data.skillId)[0] === skillData.skillId &&
          skillData.questionType === mutipleQuestion.type
        ) {
          const level = skillData?.level.split(",");
          let easyQuestion = parseInt(level[0]?.replace(/\D/g, ""));
          let mediumQuestion = parseInt(level[1]?.replace(/\D/g, ""));
          let hardQuestion = parseInt(level[2]?.replace(/\D/g, ""));
          if (mutipleQuestion.difficultyLevelId?.level === "easy") {
            easyQuestion = easyQuestion + parseInt(1);
          }
          if (mutipleQuestion.difficultyLevelId?.level === "medium") {
            mediumQuestion = mediumQuestion + parseInt(1);
          }
          if (mutipleQuestion.difficultyLevelId?.level === "hard") {
            hardQuestion = hardQuestion + parseInt(1);
          }

          skillData.level = `Easy(${easyQuestion}), Medium(${mediumQuestion}), Hard(${hardQuestion})`;
          skillData.questions = parseInt(skillData.questions) + parseInt(1);
        }
      });
      createTestContext.addDeletedSkillData(createTestContext.addedSkills);

      createTestContext.questionOverview.forEach((data) => {
        if (
          createTestContext.addedSkills
            .filter((data1) =>
              selectedSkillSet.some(
                (skillData) =>
                  skillData.skill === data1.skill &&
                  skillData.question === mutipleQuestion.question
              )
            )
            .map((data1) => data1.skill)[0] === data.skillName &&
          data.totalNoOfQuestion > 0
        ) {
          if (question.difficultyLevelId?.level === "easy") {
            data.totalNoOfQuestion = data.totalNoOfQuestion + 1;
            data.totalScore = data.totalScore + question.score;
            data.easyQuestion.question.push(question);
          }

          if (question.difficultyLevelId?.level === "medium") {
            data.totalNoOfQuestion = data.totalNoOfQuestion + 1;
            data.totalScore = data.totalScore + question.score;
            data.mediumQuestion.question.push(question);
          }

          if (question.difficultyLevelId?.level === "hard") {
            data.totalNoOfQuestion = data.totalNoOfQuestion + 1;
            data.totalScore = data.totalScore + question.score;
            data.hardQuestion.question.push(question);
          }
        }
      });
      createTestContext.setFilterQuestionOverview(
        createTestContext.questionOverview
      );
    });

    clearSelectedMutipleQuestion();
    closeMutipleSkillModal();
    toast.success(`${question.length} Questions are added into test`);
  };

  const AddSkillToSkillset = async () => {
    console.log(selectedSkillSet);
    //remove duplicate skill from selectedSkillSet
    const uniqueSkillSet = selectedSkillSet.filter(
      (v, i, a) => a.findIndex((t) => t.skill === v.skill) === i
    );

    for (let i = 0; i < uniqueSkillSet.length; i++) {
      const skillItem = uniqueSkillSet[i];
      if (!checkSearchedSkillAddedOrNot(skillItem.skill, "MCQ")) {
        await createSkillObject(
          skillItem.skill,
          "MCQ",
          skills
            .filter((data) => data?.skills?.skills === skillItem.skill)
            .map((data) => data.skills._id)[0]
        );
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
      if (i === uniqueSkillSet.length - 1) {
        setisSkillAdded(true);
      }
    }
  };
  return (
    <div className="add-multiple-skillset-from-choose-from-library-main-container">
      <div className="add-skillset-from-choose-from-library">
        <div className="header-of-add-skillset">
          <span>
            Highlight the skill you wish to associate the question with.
          </span>
          <svg
            style={{ cursor: "pointer" }}
            onClick={() => closeMutipleSkillModal()}
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
        <div className="border-of-choose-skill"></div>

        <div className="question-and-skill-container">
          {question.map((questionData, index) => {
            return (
              <div key={index}>
                <label className="question-header">
                  Q{index + 1}. {questionData.question}
                </label>

                <div className="suggestedSkills">
                  <span>Suggested Skills</span>
                </div>
                <div className="add-skill-list-container">
                  {questionData.skillsId.map((skillItem) => {
                    const selectedSkill = selectedSkillSet.find(
                      (item) =>
                        item.id === questionData._id &&
                        item.skill === skillItem?.skills?.skills
                    );
                    return (
                      <span
                        key={`${questionData._id}-${skillItem?.skills?.skills}`}
                      >
                        <input
                          className="hidden-radio"
                          type="radio"
                          name={questionData._id}
                          value={skillItem?.skills?.skills}
                          id={`${questionData._id}-${skillItem?.skills?.skills}`}
                          onChange={(e) =>
                            handleSkillChange(
                              e,
                              questionData.question,
                              questionData._id
                            )
                          }
                        />
                        <label
                          htmlFor={`${questionData._id}-${skillItem?.skills?.skills}`}
                          className={
                            selectedSkill
                              ? "selected-skill"
                              : "unselected-skill"
                          }
                        >
                          {skillItem?.skills?.skills}{" "}
                        </label>
                      </span>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
        <div className="note">
          Note: You can select only one skill for each question.
        </div>
        {/* {   
                        skills.map((data) => {
                            return <span><input onChange={handleSkillChange} type="radio" name="skill" value={data?.skills?.skills} id={data?.skills?.skills} />
                                <label for={data?.skills?.skills} >{data?.skills?.skills} </label>
                            </span>
                        })
                    } */}
        <div className="bottom-button-container">
          <button
            onClick={() => closeMutipleSkillModal()}
            className="cancel-skill-button-choose-from-library"
          >
            {" "}
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="9" cy="9" r="9" fill="white" />
              <path
                d="M12.5 5.5L5.5 12.5"
                stroke="#827C7C"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M5.5 5.5L12.5 12.5"
                stroke="#827C7C"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            Cancel
          </button>
          {selectedSkillSet.length === question.length ? (
            <button
              onClick={AddSkillToSkillset}
              className="add-skill-button-choose-from-library"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="9" cy="9" r="9" fill="white" />
                <path
                  d="M9.01826 4.0505L8.97489 13.9499"
                  stroke="#00C49A"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M4.04688 8.97852L13.9463 9.02188"
                  stroke="#00C49A"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              {`Add ${question.length} questions to the test`}
            </button>
          ) : (
            <button
              style={{ backgroundColor: "#ddd" }}
              className="add-skill-button-choose-from-library"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="9" cy="9" r="9" fill="white" />
                <path
                  d="M9.01826 4.0505L8.97489 13.9499"
                  stroke="#ddd"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M4.04688 8.97852L13.9463 9.02188"
                  stroke="#ddd"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              {`Add ${question.length} questions to the test`}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddMultipleSkill;
