import React, { useState, useEffect } from 'react'
import './index.css'
import axios from 'axios';
import { backend_url, getCookie } from '../../constant';
import { v4 as uuidv4 } from 'uuid'
import jwtDecode from "jwt-decode";
import SunEditor from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css';
import katex from 'katex'
import 'katex/dist/katex.min.css'



const QuestionPreviewModel = (props) => {

    const [loading, setLoading] = useState(false)
    const [answerObj, setanswerObj] = useState([{
        optionId: uuidv4(),
        option: "",
        html: "",
        images: []
    }, {
        optionId: uuidv4(),
        option: "",
        html: "",
        images: []
    }])
    const [correctObj, setcorrectObj] = useState([])
    const [score, setscore] = useState("")
    const [correctAnswerType, setcorrectAnswerType] = useState("")
    const [checked, setchecked] = useState(props?.data?.correctAnswerType === "Yes" ? true : false)
    const [difficulty, setDifficulty] = useState("")
    const [skills, setskills] = useState([])
    const [topics, settopics] = useState([])
    const [sourceSelected, setsourceSelected] = useState("")
    const [skillSearchText, setskillSearchText] = useState("")
    const [searchSkillData, setsearchSkillData] = useState([])
    const [topicSearchText, settopicSearchText] = useState("")
    const [searchTopicData, setsearchTopicData] = useState([])
    const [problem, setProblem] = useState({
        question: "",
        html: "",
        images: [],
    })
    const [questionTitle, setQuestionTitle] = useState("")


    useEffect(() => {
        getQuestionById()
    }, [])

    const getQuestionById = async () => {
        try {
            const token = getCookie("Xh7ERL0G")
            const decode = jwtDecode(token)
            let response;
            console.log(props?.pageName)
            if (props?.pageName === "mcqbulkupload") {
                response = await axios.get(`${backend_url}mcqbulkupload/getQuestionDetails/${props?.data._id}`, { headers: { "token": token } })

            } else {
                response = await axios.get(`${backend_url}question/findQuestion/${props?.data._id}`, { headers: { "token": token } })

            }
            setanswerObj(response.data.data.answersObjectArray)
            setsourceSelected(props.data?.clientId?._id === "632c16db596546cfa858136f" ? "EliteQA Library" : props.data?.clientId?._id === decode?.client?._id && props.data?.status !== "draft" ? "My Library" : props.data?.status === "draft" ? "Draft" : null)
            setQuestionTitle(response.data.data.Section_header)
            setDifficulty(response.data.data.difficultyLevelId._id)
            setanswerObj(response.data.data.answersObjectArray)
            setcorrectAnswerType(response.data.data.correctAnswerType)
            setcorrectObj(response.data.data.correctAnswerObjectArray)
            setscore(response.data.data.score)
            setskills(response.data.data.skillsId)
            // response.data.data.skillsId.forEach((data) => {
            //     data.topicId?.forEach((topic) => {

            //         settopics(prev => [...prev, topic])
            //     })
            // })

            response.data.data.topicId.forEach((topic) => {
                settopics((prev => [...prev, topic]))
            })

            setProblem({
                question: response.data.data.question,
                html: response.data.data.html,
                images: response.data.data.images
            })
        } catch (error) {
            console.log(error)
        }
    }







    const EditQuestion = () => {
        props.onClickEdit();
    };





    return (
        <div className='add-question-preview-model-container' >
            <svg className='cancel-icon' width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" onClick={() => {
                props?.onClickCancel()
            }}>
                <circle cx="20" cy="20" r="20" fill="white" />
                <rect width="17.7778" height="17.7778" transform="translate(6.6875 20.7412) rotate(-45)" fill="white" />
                <path d="M15.5918 17.0752L22.9248 24.4082" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M15.5918 24.4072L22.9248 17.0743" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <div className='add-question-model-container' >
                <div className='header-and-button-container' >
                    <div className='header-container' >
                        {/*Edit question icon */}
                        <svg width="35" height="35" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="17.5" cy="17.5" r="17.5" fill="#00C49A" fill-opacity="0.1" />
                            <g clip-path="url(#clip0_4024_3667)">
                                <path d="M24.3898 12.2744H11.3458C11.0987 12.2744 10.8617 12.3726 10.687 12.5473C10.5122 12.722 10.4141 12.959 10.4141 13.2061V22.5233C10.4141 22.7704 10.5122 23.0073 10.687 23.1821C10.8617 23.3568 11.0987 23.455 11.3458 23.455H24.3898C24.6369 23.455 24.8738 23.3568 25.0486 23.1821C25.2233 23.0073 25.3215 22.7704 25.3215 22.5233V13.2061C25.3215 12.959 25.2233 12.722 25.0486 12.5473C24.8738 12.3726 24.6369 12.2744 24.3898 12.2744ZM24.3898 22.5233H11.3458V13.2061H24.3898V22.5233Z" fill="#00C49A" />
                                <path d="M13.6729 16.001H22.0583C22.1819 16.001 22.3004 15.952 22.3877 15.8646C22.4751 15.7772 22.5242 15.6587 22.5242 15.5352C22.5242 15.4116 22.4751 15.2931 22.3877 15.2058C22.3004 15.1184 22.1819 15.0693 22.0583 15.0693H13.6729C13.5493 15.0693 13.4308 15.1184 13.3435 15.2058C13.2561 15.2931 13.207 15.4116 13.207 15.5352C13.207 15.6587 13.2561 15.7772 13.3435 15.8646C13.4308 15.952 13.5493 16.001 13.6729 16.001Z" fill="#00C49A" />
                                <path d="M13.6729 17.8653H22.0583C22.1819 17.8653 22.3004 17.8162 22.3877 17.7289C22.4751 17.6415 22.5242 17.523 22.5242 17.3995C22.5242 17.2759 22.4751 17.1574 22.3877 17.07C22.3004 16.9827 22.1819 16.9336 22.0583 16.9336H13.6729C13.5493 16.9336 13.4308 16.9827 13.3435 17.07C13.2561 17.1574 13.207 17.2759 13.207 17.3995C13.207 17.523 13.2561 17.6415 13.3435 17.7289C13.4308 17.8162 13.5493 17.8653 13.6729 17.8653Z" fill="#00C49A" />
                                <path d="M13.6729 19.7286H18.3315C18.455 19.7286 18.5735 19.6795 18.6609 19.5921C18.7482 19.5048 18.7973 19.3863 18.7973 19.2627C18.7973 19.1392 18.7482 19.0207 18.6609 18.9333C18.5735 18.846 18.455 18.7969 18.3315 18.7969H13.6729C13.5493 18.7969 13.4308 18.846 13.3435 18.9333C13.2561 19.0207 13.207 19.1392 13.207 19.2627C13.207 19.3863 13.2561 19.5048 13.3435 19.5921C13.4308 19.6795 13.5493 19.7286 13.6729 19.7286Z" fill="#00C49A" />
                            </g>
                            <defs>
                                <clipPath id="clip0_4024_3667">
                                    <rect width="16.7708" height="16.7708" fill="white" transform="translate(9.48047 9.47949)" />
                                </clipPath>
                            </defs>
                        </svg>
                        <label>Preview Question</label>
                    </div>
                    {props.userClientID === "632c16db596546cfa858136f" || props.sourceSelected !== "EliteQA Library" ? props.hideEditButton === "true" ? <></> : <div className='button-container' >
                        {props?.pageName === "mcqbulkupload" ? <></> : <button style={{ background: '#999999' }} onClick={EditQuestion}>
                            {loading ? <div className="loader" ></div> :
                                <>

                                    <svg width="15" height="14" viewBox="0 0 15 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <ellipse cx="7.5" cy="7" rx="7.5" ry="7" fill="white" />
                                        <path d="M9.53894 4.25068C9.61841 4.1712 9.71276 4.10816 9.8166 4.06515C9.92044 4.02214 10.0317 4 10.1441 4C10.2565 4 10.3678 4.02214 10.4717 4.06515C10.5755 4.10816 10.6698 4.1712 10.7493 4.25068C10.8288 4.33015 10.8918 4.4245 10.9349 4.52834C10.9779 4.63218 11 4.74348 11 4.85587C11 4.96826 10.9779 5.07956 10.9349 5.1834C10.8918 5.28724 10.8288 5.38159 10.7493 5.46106L6.66428 9.54611L5 10L5.45389 8.33572L9.53894 4.25068Z" stroke="black" stroke-linecap="round" stroke-linejoin="round" />
                                    </svg>

                                    <label>Edit</label>
                                </>
                            }
                        </button>
                        }
                    </div> : null}

                </div>


                <div className="question-container">
                    <div className="left-container">
                        <div className='add-question-title-container'>
                            <label>Question Title <span style={{
                                color: "red"
                            }}>*</span></label>
                            <input placeholder='Your question title' onChange={(e) => {
                                setQuestionTitle(e.target.value)
                            }} value={questionTitle} disabled />

                        </div>

                        <div className='add-problem-solution-input-container' >
                            <div className='add-problem-input-container' >
                                <label>Problem <span style={{
                                    color: "red"
                                }}>*</span></label>
                                <div>
                                    <SunEditor
                                        setContents={props?.pageName === "mcqbulkupload" ? problem.question : problem.html !== undefined ? problem.html : problem.question}
                                        hideToolbar={true}
                                        readOnly={true}
                                        height='auto' s
                                        setOptions={{
                                            buttonList: [[
                                                "math"
                                            ]],
                                            iframe: false,
                                            tagsBlacklist: "script|iframe|object|embed|applet|form|input|textarea|button|select|option|optgroup|label|fieldset|a|meta|base|frame|frameset|link",
                                            pasteTagsBlacklist: "script|iframe|object|embed|applet|form|input|textarea|button|select|option|optgroup|label|fieldset|a|meta|base|frame|frameset|link",
                                            pasteTagsWhitelist: "p",
                                            resizingBar: false,
                                            katex: katex
                                        }}
                                    />
                                </div>


                            </div>

                            <div className='add-solution-answer-input-container' >
                                <div className='header' >
                                    <label style={{
                                        display: "flex",
                                        justifyContent: "center"
                                    }}>Solution <span style={{
                                        color: "red",
                                        marginLeft: "5px",
                                        fontSize: "15px"
                                    }}>*</span></label>
                                    <span style={{
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center"
                                    }}>
                                        <div style={{
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center"
                                        }}>
                                            {checked ?
                                                <svg width="18" height="18" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <rect y="0.466797" width="20" height="20" rx="2" fill="#00C49A" />
                                                    <path d="M14 8.4668L8.5 13.9668L6 11.4668" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                                </svg>
                                                :
                                                <svg width="18" height="18" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <rect y="0.466797" width="20" height="20" rx="2" fill="#dddddd" />
                                                </svg>
                                            }
                                        </div>
                                        <span>Allow Multiple Answers</span>
                                    </span>
                                </div>
                                <div className='answers-container' >
                                    {answerObj?.filter(answer => answer.option !== undefined).map((data, index) => {
                                        return <div className="answer-box">
                                            <div className="check-box">
                                                {correctObj.includes(correctAnswerType === "Yes" ? `${data.optionId}` : data.optionId) ?
                                                    <svg width="18" height="18" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <rect y="0.466797" width="20" height="20" rx="2" fill="#00C49A" />
                                                        <path d="M14 8.4668L8.5 13.9668L6 11.4668" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                                    </svg>
                                                    :
                                                    <svg width="18" height="18" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <rect y="0.466797" width="20" height="20" rx="2" fill="#dddddd" />
                                                    </svg>
                                                }
                                            </div>
                                            <div className="editor">
                                                <SunEditor
                                                    setContents={props?.pageName === "mcqbulkupload" ? data.option + '' : (data.html !== undefined ?data.html :data.option + '' )}
                                                    hideToolbar={true}
                                                    readOnly={true}
                                                    height='auto'
                                                    setOptions={{
                                                        resizingBar: false
                                                    }}
                                                />
                                            </div>
                                            <div>
                                                <svg width="15" height="16" viewBox="0 0 15 16" fill="none" xmlns="http://www.w3.org/2000/svg" >
                                                    <circle cx="7.5" cy="8" r="7.5" fill="#DDDDDD" />
                                                    <path d="M9.75 5.75L5.25 10.25" stroke="#999999" stroke-linecap="round" />
                                                    <path d="M9.75 10.25L5.25014 5.75014" stroke="#999999" stroke-linecap="round" />
                                                </svg>
                                            </div>
                                        </div>
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="right-container">
                        <div className='add-question-score-container'>
                            <label>Score <span style={{
                                color: "red"
                            }}>*</span></label>
                            <input placeholder='Score' onChange={(e) => {
                                setscore(e.target.value)
                            }} value={score} type='number' disabled />


                        </div>
                        <div className="difficulty-level-container">
                            <label>Difficulty <span style={{
                                color: "red"
                            }}>*</span></label>
                            <button className={difficulty === "641bd41c8782fdd946db740b" ? "active-level-btn" : null} style={difficulty === "641bd41c8782fdd946db740b" ? { border: "1px solid #00C49A" } : null}>
                                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="9" cy="9" r="9" fill={difficulty === "641bd41c8782fdd946db740b" ? "#00C49A" : "#999999"} />
                                    <path d="M13 7L7.5 12.5L5 10" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>

                                Easy
                            </button>
                            <button className={difficulty === "641bf53ce012709b89e6c2cc" ? "active-level-btn" : null} style={difficulty === "641bf53ce012709b89e6c2cc" ? { border: "1px solid #FF9736" } : null}>
                                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="9" cy="9" r="9" fill={difficulty === "641bf53ce012709b89e6c2cc" ? "#FF9736" : "#999999"} />
                                    <path d="M13 7L7.5 12.5L5 10" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>

                                Medium
                            </button>
                            <button className={difficulty === "641bf5c1e012709b89e6c2d2" ? "active-level-btn" : null} style={difficulty === "641bf5c1e012709b89e6c2d2" ? { border: "1px solid #FF5D00" } : null}>
                                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="9" cy="9" r="9" fill={difficulty === "641bf5c1e012709b89e6c2d2" ? "#FF5D00" : "#999999"} />
                                    <path d="M13 7L7.5 12.5L5 10" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>

                                Hard
                            </button>
                        </div>
                        <div className='add-skill-topics-container' >
                            <div style={{ position: 'relative' }} className='add-skill-container' >
                                <label>Skills</label>
                                <div className='add-search-skill-container' >
                                    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <g clip-path="url(#clip0_4024_4072)">
                                            <path d="M6.875 11.875C9.63642 11.875 11.875 9.63642 11.875 6.875C11.875 4.11358 9.63642 1.875 6.875 1.875C4.11358 1.875 1.875 4.11358 1.875 6.875C1.875 9.63642 4.11358 11.875 6.875 11.875Z" stroke="#363534" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                            <path d="M13.125 13.125L10.4062 10.4062" stroke="#363534" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                        </g>
                                        <defs>
                                            <clipPath id="clip0_4024_4072">
                                                <rect width="15" height="15" fill="white" />
                                            </clipPath>
                                        </defs>
                                    </svg>
                                    <input value={skillSearchText} placeholder="Search skill here..." disabled />

                                </div>
                                <div className='add-skill-list-item-container' >
                                    {skills?.map((data) => {
                                        let skillArray = skills?.map(function (item) { return item?.skills });

                                        return (
                                            <div className='add-skill-list-item' >
                                                <p>{data?.skills.skills}</p>
                                                {/**cancel icon */}

                                                <svg width="15" height="15" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" id='tick-skill'>
                                                    <circle cx="9" cy="9" r="9" fill="#00C49A" />
                                                    <path d="M13 7L7.5 12.5L5 10" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                                </svg>

                                            </div>
                                        )

                                    })
                                    }
                                </div>
                                {(skillSearchText !== "" && searchSkillData?.length) ?
                                    <div className="search-result-container" >
                                        <svg style={{ cursor: 'pointer', position: 'absolute', right: 10 }} width="10" height="10" viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path fill-rule="evenodd" clip-rule="evenodd" d="M12.0032 13.9813L7.00642 8.985L2.01082 13.9813C1.55102 14.441 0.805358 14.4412 0.345266 13.9815C-0.114825 13.5219 -0.115113 12.7761 0.344547 12.3161L5.34122 7.31986L0.344476 2.32245C-0.102534 1.86017 -0.0962087 1.12477 0.358851 0.670542C0.813839 0.216023 1.54922 0.210848 2.01082 0.658468L7.00642 5.65473L12.0032 0.658468C12.4666 0.222348 13.1925 0.233272 13.6426 0.683192C14.0927 1.13282 14.1041 1.85873 13.6684 2.32245L8.67162 7.31986L13.6684 12.3161C14.1157 12.7781 14.1098 13.5135 13.6551 13.968C13.2004 14.4228 12.4651 14.4286 12.0031 13.9813H12.0032Z" fill="#99B2C6" />
                                        </svg>
                                        {searchSkillData?.map((data) => {
                                            return <div style={{ marginTop: 5 }} className="skill-item" >
                                                <span> {data?.skills}</span>
                                                <svg style={{ cursor: 'pointer' }} width="10" height="9" viewBox="0 0 10 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M4.10343 8.24338L4.0947 8.14768V5.27982H0.907895C0.431503 5.28184 0.0352021 4.95232 0.00221205 4.52676C-0.0308162 4.10116 0.310793 3.72574 0.782914 3.66877L0.890999 3.66095H4.09405V0.807097C4.09657 0.382424 4.46434 0.0313535 4.93741 0.00198094C5.41049 -0.0273916 5.82883 0.274873 5.8968 0.69514L5.90492 0.791967V3.65815H9.09172C9.56834 3.65624 9.96476 3.98596 9.99779 4.41176C10.0308 4.83756 9.68905 5.21319 9.2167 5.2703L9.10797 5.27702H5.90492V8.13088C5.90461 8.55658 5.53654 8.90963 5.06224 8.9391C4.58791 8.96861 4.16888 8.6645 4.10286 8.24284L4.10343 8.24338Z" fill="#FF6812" />
                                                </svg>

                                            </div>
                                        })

                                        }
                                    </div> : <></>
                                }
                            </div>

                            <div style={{ position: 'relative' }} className='add-topics-container' >
                                <label>Topic</label>
                                <div className='add-search-topics-container' >
                                    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <g clip-path="url(#clip0_4024_4072)">
                                            <path d="M6.875 11.875C9.63642 11.875 11.875 9.63642 11.875 6.875C11.875 4.11358 9.63642 1.875 6.875 1.875C4.11358 1.875 1.875 4.11358 1.875 6.875C1.875 9.63642 4.11358 11.875 6.875 11.875Z" stroke="#363534" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                            <path d="M13.125 13.125L10.4062 10.4062" stroke="#363534" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                        </g>
                                        <defs>
                                            <clipPath id="clip0_4024_4072">
                                                <rect width="15" height="15" fill="white" />
                                            </clipPath>
                                        </defs>
                                    </svg>
                                    <input value={topicSearchText} placeholder="Search topic here..." disabled />

                                </div>
                                <div className='add-topics-list-item-container' >
                                    {topics?.map((data) => {
                                        let topicsArray = topics?.map(function (item) { return item?.topic });
                                        return (
                                            <div className='add-topics-list-item'>
                                                <p>{data?.topic}</p>
                                                {/**cancel icon */}
                                                <svg width="15" height="15" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" id='tick-topic'>
                                                    <circle cx="9" cy="9" r="9" fill="#00C49A" />
                                                    <path d="M13 7L7.5 12.5L5 10" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                                </svg>
                                                {/* <svg onClick={() => removeTopic(data._id)} width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" id='cross-topic'>
                                                    <circle cx="7.5" cy="7.5" r="7.5" fill="red" />
                                                    <path d="M9.75 5.25L5.25 9.75" stroke="white" stroke-linecap="round" />
                                                    <path d="M9.75 9.75L5.25014 5.25014" stroke="white" stroke-linecap="round" />
                                                </svg> */}
                                            </div>
                                        )
                                    })
                                    }
                                </div>
                                {(topicSearchText !== "" && searchTopicData?.length) ?
                                    <div className="search-result-container" style={{
                                        marginTop: "40px"
                                    }}>
                                        <svg style={{ cursor: 'pointer', position: 'absolute', right: 10 }} onClick={() => { setsearchTopicData([]) }} width="10" height="10" viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path fill-rule="evenodd" clip-rule="evenodd" d="M12.0032 13.9813L7.00642 8.985L2.01082 13.9813C1.55102 14.441 0.805358 14.4412 0.345266 13.9815C-0.114825 13.5219 -0.115113 12.7761 0.344547 12.3161L5.34122 7.31986L0.344476 2.32245C-0.102534 1.86017 -0.0962087 1.12477 0.358851 0.670542C0.813839 0.216023 1.54922 0.210848 2.01082 0.658468L7.00642 5.65473L12.0032 0.658468C12.4666 0.222348 13.1925 0.233272 13.6426 0.683192C14.0927 1.13282 14.1041 1.85873 13.6684 2.32245L8.67162 7.31986L13.6684 12.3161C14.1157 12.7781 14.1098 13.5135 13.6551 13.968C13.2004 14.4228 12.4651 14.4286 12.0031 13.9813H12.0032Z" fill="#99B2C6" />
                                        </svg>

                                        {searchTopicData?.map((data) => {
                                            return <div style={{ marginTop: 5 }} className="skill-item" >
                                                <span> {data?.topic}</span>
                                                <svg style={{ cursor: 'pointer' }} width="10" height="9" viewBox="0 0 10 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M4.10343 8.24338L4.0947 8.14768V5.27982H0.907895C0.431503 5.28184 0.0352021 4.95232 0.00221205 4.52676C-0.0308162 4.10116 0.310793 3.72574 0.782914 3.66877L0.890999 3.66095H4.09405V0.807097C4.09657 0.382424 4.46434 0.0313535 4.93741 0.00198094C5.41049 -0.0273916 5.82883 0.274873 5.8968 0.69514L5.90492 0.791967V3.65815H9.09172C9.56834 3.65624 9.96476 3.98596 9.99779 4.41176C10.0308 4.83756 9.68905 5.21319 9.2167 5.2703L9.10797 5.27702H5.90492V8.13088C5.90461 8.55658 5.53654 8.90963 5.06224 8.9391C4.58791 8.96861 4.16888 8.6645 4.10286 8.24284L4.10343 8.24338Z" fill="#FF6812" />
                                                </svg>

                                            </div>
                                        })

                                        }
                                    </div> : <></>
                                }
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}


export default QuestionPreviewModel;