import axios from "axios";
import jwtDecode from "jwt-decode";
import React, { useContext, useState } from "react";
import { toast } from "react-toastify";
import rightTick from "../../assets/icon/right-tick.svg";
import searchIcon from "../../assets/icon/search-icon.svg";
import { backend_url, getCookie } from "../../constant";
import CreateTestContext from "../../store/CreateTestContext";
import "./index.css";
const CancelToken = axios.CancelToken;
let cancel;

function ChooseSkillSet(props) {
    const createTestContext = useContext(CreateTestContext);
    const [skillSearchText, setskillSearchText] = useState("");

    const [searchSkillData, setsearchSkillData] = useState([]);
    const [info, setInfo] = useState({
        skillId: "",
        skill: "",
        questionType: "MCQ",
        level: "",
        questions: "",
        score: "",
        random: false,
    });
    const [showSkillSetData, setshowSkillSetData] = useState([]);
    const [type, setType] = useState("");
    const [easyMarks, setEasyMarks] = useState(0);
    const [mediumMarks, setMediumMarks] = useState(0);
    const [hardMarks, setHardMarks] = useState(0);
    const [isAddorUpdateClick, setisAddorUpdateClick] = useState(false);
    const [easyScore, seteasyScore] = useState("");
    const [mediumScore, setmediumScore] = useState("");
    const [easyScoreError, seteasyScoreError] = useState(false);
    const [mediumScoreError, setmediumScoreError] = useState(false);
    const [totaleasymcqquestion, settotaleasymcqquestion] = useState(0);
    const [totalmediumquestion, settotalmediumquestion] = useState(0);
    const [totalhardquestion, settotalhardquestion] = useState(0);

    const [easyMarksError, seteasyMarksError] = useState(false);
    const [mediumMarksError, setmediumMarksError] = useState(false);
    const [hardMarksError, sethardMarksError] = useState(false);

    const addSearchedSkill = async (skillName, id) => {
        if (
            !showSkillSetData.includes(skillName) &&
            showSkillSetData.length < 1 &&
            !createTestContext.addedSkills.some((data) =>
                data.skill === skillName ? true : false
            )
        ) {
            setshowSkillSetData([...showSkillSetData, skillName]);
            setInfo({ skill: skillName, skillId: id });
            setType("MCQ");
            onChangeQuestionType(id);
        } else {
            if (
                showSkillSetData.includes(skillName) ||
                createTestContext.addedSkills.some((data) =>
                    data.skill === skillName ? true : false
                )
            ) {
                toast("You have added already that skill", {
                    className: "toast-message",
                });
            } else {
                toast.error("Only one skill can select");
            }
        }
    };


    const searchSkill = async () => {
        try {
            if (props.addSkill) {
                const token = getCookie("Xh7ERL0G");
                const res = await axios.get(
                    `${backend_url}skill/search?page=1&limit=5&searchText=${skillSearchText}`,
                    { headers: { token: token } }
                );
                setsearchSkillData(res.data.data);
            } else {
                toast("you cannot search skill while editing skill.");
            }
        } catch (error) {
            toast(`${error}`, {
                className: "toast-message",
            });
        }
    };



    const onType = async (e) => {
        if (props.addSkill) {
            const search = e.target.value;
            setskillSearchText(e.target.value);

            try {
                const token = getCookie("Xh7ERL0G");
                const res = await axios.get(
                    `${backend_url}skill/search?page=1&limit=5&searchText=${search}`,
                    {
                        headers: { token: token },
                        cancelToken: new CancelToken(function executor(c) {
                            // An executor function is executed when the cancelToken is created
                            cancel = c;
                        }),
                    }
                );
                setsearchSkillData(res.data.data);
                cancel("Canceling request");
            } catch (error) {
                console.log(error);
            }
        } else {
            toast("you cannot search skill while editing skill.");
        }
    };

    const onChangeQuestionType = async (searchSkillId) => {
        const token = getCookie("Xh7ERL0G");
        const decode = jwtDecode(token);
        const res = await axios.post(
            `${backend_url}question/getAddQuestionLevelAsPerSkillWise`,
            {
                eliteQALibraryId: createTestContext.testCreationTypeDetails.includes(
                    "EliteQA Library"
                )
                    ? "632c16db596546cfa858136f"
                    : "",
                createdBy: createTestContext.testCreationTypeDetails.includes(
                    "My Library"
                )
                    ? [`${decode.user_id}`]
                    : undefined,
                skills: [searchSkillId],
                createdByInOr:
                    createTestContext.testCreationTypeDetails.length > 1 &&
                        createTestContext.testCreationTypeDetails.includes("My Library")
                        ? true
                        : false,
                // healthScore: 20,
                question: createTestContext.question.map((data) => data.questions._id),
            },
            { headers: { token: token } }
        );
        settotaleasymcqquestion(res.data.easyMCQQuestion);
        settotalmediumquestion(res.data.mediumMCQQuestion);
        settotalhardquestion(res.data.hardMCQQuestion);


    };



    const onChangeEasyQuestionCount = (e) => {
        setEasyMarks(e.target.value.slice(0, 3));
        if (
            e.target.value === "" ||
            parseInt(e.target.value) < 0 ||
            /^0+$|^0*-0+$/.test(e.target.value) ||
            e.target.value > totaleasymcqquestion
        ) {
            seteasyMarksError(true);
        } else {
            seteasyMarksError(true);
        }
    };

    const onChangeMediumQuestionCount = (e) => {
        setMediumMarks(e.target.value.slice(0, 3));
        if (
            e.target.value === "" ||
            parseInt(e.target.value) < 0 ||
            /^0+$|^0*-0+$/.test(e.target.value) ||
            e.target.value > totalmediumquestion
        ) {
            setmediumMarksError(true);
        } else {
            setmediumMarksError(false);
        }
    };

    const onChangeHardQuestionCount = (e) => {
        setHardMarks(e.target.value.slice(0, 3));
        if (
            e.target.value === "" ||
            parseInt(e.target.value) < 0 ||
            /^0+$|^0*-0+$/.test(e.target.value) ||
            e.target.value > totalhardquestion
        ) {
            sethardMarksError(true);
        } else {
            sethardMarksError(false);
        }
    };
    const onChangeEasyScore = (e) => {
        seteasyScore(e.target.value.slice(0, 3));
        if (
            e.target.value === "" ||
            e.target.value === "0" ||
            parseInt(e.target.value) < 0 ||
            /^0+$|^0*-0+$/.test(e.target.value)
        ) {
            seteasyScoreError(true);
        } else {
            seteasyScoreError(false);
        }
    };

    const onChangeMediumScore = (e) => {
        setmediumScore(e.target.value.slice(0, 3));
        if (
            e.target.value === "" ||
            e.target.value === "0" ||
            parseInt(e.target.value) < 0 ||
            /^0+$|^0*-0+$/.test(e.target.value)
        ) {
            setmediumScoreError(true);
        } else {
            setmediumScoreError(false);
        }
    };

    return (
       
        <div className="experience">
                      
        <span>Choose Skill</span>
        <div className="select-box">
            <img 
                style={{ cursor: "pointer" }}
                src={searchIcon}
                alt=""
            />
            <input
                onChange={onType}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        searchSkill();
                    }
                }}
                value={skillSearchText}
                type="text"
                name=""
                id=""
            />
        </div>
    <div className="skill-list-item-container">
    {showSkillSetData?.map((data) => {
        return (
            <button>
                <span>{data}</span>
                <img
                    style={{ cursor: "pointer" }}
                    src={rightTick}
                    alt=""
                />
                {/* <img onClick={props.closeSkillSetModel}
                    style={{ cursor: "pointer" }}
                    src={crossTick}
                    alt=""
                /> */}
            </button>
        );
    })}
</div>

{skillSearchText !== "" && searchSkillData.length ? (
    <div
        onClick={() => (searchSkillData.length = 0)}
        className="search-result-container"
    >
        <svg
            style={{ cursor: "pointer", position: "absolute", right: 20 }}
            onClick={() => {
                setsearchSkillData([]);
            }}
            width="10"
            height="10"
            viewBox="0 0 14 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M12.0032 13.9813L7.00642 8.985L2.01082 13.9813C1.55102 14.441 0.805358 14.4412 0.345266 13.9815C-0.114825 13.5219 -0.115113 12.7761 0.344547 12.3161L5.34122 7.31986L0.344476 2.32245C-0.102534 1.86017 -0.0962087 1.12477 0.358851 0.670542C0.813839 0.216023 1.54922 0.210848 2.01082 0.658468L7.00642 5.65473L12.0032 0.658468C12.4666 0.222348 13.1925 0.233272 13.6426 0.683192C14.0927 1.13282 14.1041 1.85873 13.6684 2.32245L8.67162 7.31986L13.6684 12.3161C14.1157 12.7781 14.1098 13.5135 13.6551 13.968C13.2004 14.4228 12.4651 14.4286 12.0031 13.9813H12.0032Z"
                fill="#99B2C6"
            />
        </svg>
        {searchSkillData?.map((data) => {
            return (
                <div style={{ marginTop: 5 }} className="skill-item">
                    <span> {data?.skills}</span>
                    <svg
                        onClick={() =>
                            addSearchedSkill(data?.skills, data?._id)
                        }
                        style={{ cursor: "pointer" }}
                        width="10"
                        height="9"
                        viewBox="0 0 10 9"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            fill-rule="evenodd"
                            clip-rule="evenodd"
                            d="M4.10343 8.24338L4.0947 8.14768V5.27982H0.907895C0.431503 5.28184 0.0352021 4.95232 0.00221205 4.52676C-0.0308162 4.10116 0.310793 3.72574 0.782914 3.66877L0.890999 3.66095H4.09405V0.807097C4.09657 0.382424 4.46434 0.0313535 4.93741 0.00198094C5.41049 -0.0273916 5.82883 0.274873 5.8968 0.69514L5.90492 0.791967V3.65815H9.09172C9.56834 3.65624 9.96476 3.98596 9.99779 4.41176C10.0308 4.83756 9.68905 5.21319 9.2167 5.2703L9.10797 5.27702H5.90492V8.13088C5.90461 8.55658 5.53654 8.90963 5.06224 8.9391C4.58791 8.96861 4.16888 8.6645 4.10286 8.24284L4.10343 8.24338Z"
                            fill="#FF6812"
                        />
                    </svg>
                </div>
            );
        })}
    </div>
) : (
    <></>
)}
</div>
             
    );
}

export default ChooseSkillSet;
