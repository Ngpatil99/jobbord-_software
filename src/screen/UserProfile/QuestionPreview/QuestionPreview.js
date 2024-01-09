import React, { useContext } from 'react';
import { useState } from 'react';
import jwtDecode from "jwt-decode";
import ReactTooltip from 'react-tooltip';
import axios from 'axios';
import { backend_url, getCookie } from '../../constant';
import NavigationBar from '../../component/NavigationBar/NavigationBar';
import QuestionPreviewSidebar from '../../component/QuestionPreviewSidebar/QuestionPreviewSidebar';
import './QuestionPreview.css';
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import CreateQuestionContext from '../../store/CreateQuestionContext'
function QuestionPreview() {
    const [loading, setloading] = useState(false)
    const [loadingDraft,setloadingDraft] = useState(false)
    const createQuestionContext = useContext(CreateQuestionContext)
    const navigate = useNavigate();
    const createQuestion = async () => {
        setloading(true)
        try {

            if (createQuestionContext.questionTile === "") {
                toast("please enter question title field!")
                setloading(false)
            } else if (createQuestionContext.score === "") {
                toast("please enter score field!")
                setloading(false)
            } else if (createQuestionContext.skills.length === 0) {
                toast("please add atleast one skill!")
                setloading(false)
            } else if (createQuestionContext.topics.length === 0) {
                toast("please add atleast one topic!")
                setloading(false)
            } else {
                const token = getCookie("Xh7ERL0G")
                const decode = jwtDecode(token)
                let tempArray = [];
                createQuestionContext.skills.forEach(element => {
                    const obj = {
                        skills: '',
                        topicId: []
                    }
                    obj.skills = element.skills._id
                    element.topicId.map((topicId) => {
                        obj.topicId.push(topicId._id)
                    })
                    tempArray.push(obj)
                })

                // const skillsData1 = skills?.map(element => { return element._id })
                const topicsData1 = createQuestionContext.topics?.map(element => { return element._id })

                let difficultyLevelID;
                if (createQuestionContext.selectedDifficultyLevel === "easy") {
                    difficultyLevelID = "641bd41c8782fdd946db740b"
                }
                if (createQuestionContext.selectedDifficultyLevel === "medium") {
                    difficultyLevelID = "641bf53ce012709b89e6c2cc"
                }
                if (createQuestionContext.selectedDifficultyLevel === "hard") {
                    difficultyLevelID = "641bf5c1e012709b89e6c2d2"
                }
                let correctAnswerObjectArray = createQuestionContext.correctAnswerObjectArray.map(function( element ) {
                    if(typeof(element)==='object'){
                    return element;
                    }
                 })
                let questionOption = correctAnswerObjectArray.toString()
                correctAnswerObjectArray = questionOption.split(',')
                correctAnswerObjectArray =correctAnswerObjectArray.filter(element=>{
                    if(element!==''){
                        return element
                    }
                })
                const answersObjectArray = createQuestionContext.answersObjectArray.filter(function( element ) {
                    if(element!==undefined){
                        return element;
                        }
                 })
                // console.log(createQuestionContext.correctAnswerObjectArray)
                await axios.post(`${backend_url}question/createSingleQuestionForMCQBulk`, {
                    Section_header: createQuestionContext.questionTile,
                    approved: `Approved By ${decode.fullName}`,
                    token: token,
                    type: "MCQ",
                    difficultyLevelId: difficultyLevelID,
                    topicId: topicsData1,
                    skillsId: tempArray,
                    score: createQuestionContext.score,
                    status: 'complete',
                    createdBy: decode.user_id,
                    clientId: decode.client._id,
                    answersObjectArray: answersObjectArray,
                    correctAnswerObjectArray: createQuestionContext.correctAnswerObjectArray.filter((data)=>{return data!==false}),
                    correctAnswerType: createQuestionContext.correctAnswerType,
                    question: createQuestionContext.question
                })

                setloading(false)
                createQuestionContext.clearQuestion()
                toast.success("Question created successfully.");
                navigate("/library",{state:{library:'My Library'}});
            }
        } catch (error) {
            setloading(false)
            if (error.response.data.error.code === 11000) {
                toast("Question is already exits in library!")
            } else {
                toast(error.message)
            }
        }
    }

    const saveAsDraftQuestion = async () => {
        setloadingDraft(true)
        try {
            
            if (createQuestionContext.questionTile === "") {
                toast("please enter question title field!")
                setloadingDraft(false)
            } else if (createQuestionContext.score === "") {
                toast("please enter score field!")
                setloadingDraft(false)
            } else if (createQuestionContext.skills.length === 0) {
                toast("please add atleast one skill!")
                setloadingDraft(false)
            } else if (createQuestionContext.topics.length === 0) {
                toast("please add atleast one topic!")
                setloadingDraft(false)
            } else {
                const token = getCookie("Xh7ERL0G")
                const decode = jwtDecode(token)
                let tempArray = [];
                createQuestionContext?.skills?.forEach(element => {
                    const obj = {
                        skills: '',
                        topicId: []
                    }
                    obj.skills = element.skills._id
                    element.topicId.map((topicId) => {
                        obj.topicId.push(topicId._id)
                    })
                    tempArray.push(obj)
                })
                
                // const skillsData1 = skills?.map(element => { return element._id })
                const topicsData1 = createQuestionContext?.topics?.map(element => { return element._id })

                let difficultyLevelID;
                if (createQuestionContext.selectedDifficultyLevel === "easy") {
                    difficultyLevelID = "641bd41c8782fdd946db740b"
                }
                if (createQuestionContext.selectedDifficultyLevel === "medium") {
                    difficultyLevelID = "641bf53ce012709b89e6c2cc"
                }
                if (createQuestionContext.selectedDifficultyLevel === "hard") {
                    difficultyLevelID = "641bf5c1e012709b89e6c2d2"
                }
                let correctAnswerObjectArray = createQuestionContext.correctAnswerObjectArray.map(function( element ) {
                    if(typeof(element)==='number'){
                    return element;
                    }
                 })
                let questionOption = correctAnswerObjectArray.toString()
                correctAnswerObjectArray = questionOption.split(',')
                correctAnswerObjectArray =correctAnswerObjectArray.filter(element=>{
                    if(element!==''){
                        return element
                    }
                })
                const answersObjectArray = createQuestionContext.answersObjectArray.map((data) => {
                    if (data !== false && data!==undefined) {
                        return data
                    }
                })
                await axios.post(`${backend_url}question/createSingleQuestionForMCQBulk`, {
                    Section_header: createQuestionContext.questionTile,
                    approved: `Approved By ${decode.fullName}`,
                    token: token,
                    type: "MCQ",
                    difficultyLevelId: difficultyLevelID,
                    topicId: topicsData1,
                    skillsId: tempArray,
                    score:createQuestionContext.score,
                    status: 'draft',
                    createdBy: decode.user_id,
                    clientId: decode.client._id,
                    answersObjectArray: answersObjectArray,
                    correctAnswerObjectArray: correctAnswerObjectArray.map(function (x) { 
                        return parseInt(x, 10); 
                      }),
                    correctAnswerType: createQuestionContext.correctAnswerType,
                    question: createQuestionContext.question
                })
                
                setloadingDraft(false)
                createQuestionContext.clearQuestion()
                toast.success("Question created successfully.");
                navigate("/library",{state:{library:'Draft'}});
            }
        } catch (error) {
            setloadingDraft(false)
            if (error.response.data.error.code === 11000) {
                toast("Question is already exits in library!")
            } else {
                toast(error.message)
            }
        }
    }

    return (

        <div className="question-preview">
            <NavigationBar saveAsDraft={true} loadingDraft={loadingDraft} onClickSaveAsDraft={()=>saveAsDraftQuestion()} />
            <div className="question-preview-container">

                <QuestionPreviewSidebar />

                <div className="right">
                    <div className="right-content">
                        <div className="col">
                            <div className="header">
                                <div className="title">
                                    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="24" cy="24" r="24" fill="#00C49A" fill-opacity="0.1" />
                                        <g clip-path="url(#clip0_1897_1286)">
                                            <path d="M33.444 16.833H15.5551C15.2162 16.833 14.8912 16.9676 14.6516 17.2073C14.412 17.4469 14.2773 17.7719 14.2773 18.1108V30.8886C14.2773 31.2275 14.412 31.5525 14.6516 31.7921C14.8912 32.0317 15.2162 32.1663 15.5551 32.1663H33.444C33.7829 32.1663 34.1079 32.0317 34.3475 31.7921C34.5872 31.5525 34.7218 31.2275 34.7218 30.8886V18.1108C34.7218 17.7719 34.5872 17.4469 34.3475 17.2073C34.1079 16.9676 33.7829 16.833 33.444 16.833ZM33.444 30.8886H15.5551V18.1108H33.444V30.8886Z" fill="#00C49A" />
                                            <path d="M18.7502 21.9448H30.2502C30.4197 21.9448 30.5822 21.8775 30.702 21.7576C30.8218 21.6378 30.8891 21.4753 30.8891 21.3059C30.8891 21.1364 30.8218 20.9739 30.702 20.8541C30.5822 20.7343 30.4197 20.667 30.2502 20.667H18.7502C18.5808 20.667 18.4183 20.7343 18.2985 20.8541C18.1786 20.9739 18.1113 21.1364 18.1113 21.3059C18.1113 21.4753 18.1786 21.6378 18.2985 21.7576C18.4183 21.8775 18.5808 21.9448 18.7502 21.9448Z" fill="#00C49A" />
                                            <path d="M18.7502 24.5004H30.2502C30.4197 24.5004 30.5822 24.4331 30.702 24.3133C30.8218 24.1935 30.8891 24.031 30.8891 23.8615C30.8891 23.6921 30.8218 23.5296 30.702 23.4098C30.5822 23.29 30.4197 23.2227 30.2502 23.2227H18.7502C18.5808 23.2227 18.4183 23.29 18.2985 23.4098C18.1786 23.5296 18.1113 23.6921 18.1113 23.8615C18.1113 24.031 18.1786 24.1935 18.2985 24.3133C18.4183 24.4331 18.5808 24.5004 18.7502 24.5004Z" fill="#00C49A" />
                                            <path d="M18.7502 27.0551H25.1391C25.3085 27.0551 25.4711 26.9878 25.5909 26.868C25.7107 26.7482 25.778 26.5857 25.778 26.4162C25.778 26.2468 25.7107 26.0843 25.5909 25.9645C25.4711 25.8447 25.3085 25.7773 25.1391 25.7773H18.7502C18.5808 25.7773 18.4183 25.8447 18.2985 25.9645C18.1786 26.0843 18.1113 26.2468 18.1113 26.4162C18.1113 26.5857 18.1786 26.7482 18.2985 26.868C18.4183 26.9878 18.5808 27.0551 18.7502 27.0551Z" fill="#00C49A" />
                                        </g>
                                        <defs>
                                            <clipPath id="clip0_1897_1286">
                                                <rect width="23" height="23" fill="white" transform="translate(13 13)" />
                                            </clipPath>
                                        </defs>
                                    </svg>
                                    <div className="group">
                                        <span>Question Preview</span>
                                        <p>Check all question field or edit them</p>
                                    </div>
                                </div>

                                <div className="button-container">
                                    <div className="next-button" style={{ backgroundColor: "#FF6812" }} onClick={() => { navigate("/createquestion"); }}>

                                        <svg width="24" height="20" viewBox="0 0 24 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <circle cx="12" cy="10" r="10" fill="white" />
                                            <path d="M15 4.95853L9 9.61159L15 14.2646" stroke="#FF6812" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                        </svg>
                                        <span>Back</span>

                                    </div>
                                    <div className="next-button" onClick={() => {
                                        createQuestion()
                                    }}>
                                        {loading ? <div className="loader" ></div> :
                                            <>
                                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <circle cx="10" cy="10" r="10" fill="white" />
                                                    <g clip-path="url(#clip0_1492_5412)">
                                                        <path d="M15.8327 9.46309V9.99976C15.832 11.2577 15.4246 12.4817 14.6715 13.4892C13.9183 14.4967 12.8596 15.2337 11.6533 15.5904C10.447 15.947 9.15775 15.9042 7.97779 15.4683C6.79783 15.0323 5.7904 14.2267 5.10574 13.1714C4.42109 12.1161 4.09589 10.8678 4.17866 9.61261C4.26143 8.35742 4.74772 7.16262 5.56501 6.20638C6.3823 5.25015 7.48681 4.58373 8.71379 4.30651C9.94078 4.02929 11.2245 4.15612 12.3735 4.66809" stroke="#00C49A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                                        <path d="M15.8333 5.33301L10 11.1722L8.25 9.42217" stroke="#00C49A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                                    </g>
                                                    <defs>
                                                        <clipPath id="clip0_1492_5412">
                                                            <rect width="14" height="14" fill="white" transform="translate(3 3)" />
                                                        </clipPath>
                                                    </defs>
                                                </svg>
                                                <span>Submit</span>
                                            </>

                                        }
                                    </div>

                                </div>
                            </div>

                            <div className="header-bar"></div>
                        </div>

                        <div className="row1">
                            <div className="head">
                                <div className="left">
                                    <div style={createQuestionContext?.selectedDifficultyLevel === "easy" ? { background: '#D6FFF6' } : createQuestionContext?.selectedDifficultyLevel === "medium" ? { background: '#FEE9E1' } : { background: '#FFE4CB' }} className="difficulty">
                                        {createQuestionContext?.selectedDifficultyLevel === "medium" &&
                                            <svg width="32" height="33" viewBox="0 0 32 33" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <circle cx="16" cy="16.0078" r="16" fill="#FF9736" />
                                                <g clip-path="url(#clip0_2114_3970)">
                                                    <path d="M16.5 18.3828C18.9162 18.3828 20.875 16.4241 20.875 14.0078C20.875 11.5916 18.9162 9.63281 16.5 9.63281C14.0838 9.63281 12.125 11.5916 12.125 14.0078C12.125 16.4241 14.0838 18.3828 16.5 18.3828Z" stroke="white" stroke-linecap="round" stroke-linejoin="round" />
                                                    <path d="M14.1312 17.6889L13.375 23.3826L16.5 21.5076L19.625 23.3826L18.8687 17.6826" stroke="white" stroke-linecap="round" stroke-linejoin="round" />
                                                </g>
                                                <defs>
                                                    <clipPath id="clip0_2114_3970">
                                                        <rect width="15" height="15" fill="white" transform="translate(9 9.00781)" />
                                                    </clipPath>
                                                </defs>
                                            </svg>

                                        }
                                        {createQuestionContext?.selectedDifficultyLevel === "easy" &&
                                            <svg width="32" height="33" viewBox="0 0 40 41" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <circle cx="20" cy="20.5996" r="20" fill="#00C49A" />
                                                <g clip-path="url(#clip0_2049_3545)">
                                                    <path d="M20.375 23.3184C23.3953 23.3184 25.8438 20.8699 25.8438 17.8496C25.8438 14.8293 23.3953 12.3809 20.375 12.3809C17.3547 12.3809 14.9062 14.8293 14.9062 17.8496C14.9062 20.8699 17.3547 23.3184 20.375 23.3184Z" stroke="white" stroke-linecap="round" stroke-linejoin="round" />
                                                    <path d="M17.4141 22.4512L16.4688 29.5684L20.375 27.2246L24.2812 29.5684L23.3359 22.4434" stroke="white" stroke-linecap="round" stroke-linejoin="round" />
                                                </g>
                                                <defs>
                                                    <clipPath id="clip0_2049_3545">
                                                        <rect width="18.75" height="18.75" fill="white" transform="translate(11 11.5996)" />
                                                    </clipPath>
                                                </defs>
                                            </svg>
                                        }
                                        {createQuestionContext?.selectedDifficultyLevel === "hard" &&
                                            <svg width="32" height="33" viewBox="0 0 32 33" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <circle cx="16" cy="16.0078" r="16" fill="#FF6812" />
                                                <g clip-path="url(#clip0_2114_4142)">
                                                    <path d="M16.5 18.3828C18.9162 18.3828 20.875 16.4241 20.875 14.0078C20.875 11.5916 18.9162 9.63281 16.5 9.63281C14.0838 9.63281 12.125 11.5916 12.125 14.0078C12.125 16.4241 14.0838 18.3828 16.5 18.3828Z" stroke="white" stroke-linecap="round" stroke-linejoin="round" />
                                                    <path d="M14.1312 17.6889L13.375 23.3826L16.5 21.5076L19.625 23.3826L18.8687 17.6826" stroke="white" stroke-linecap="round" stroke-linejoin="round" />
                                                </g>
                                                <defs>
                                                    <clipPath id="clip0_2114_4142">
                                                        <rect width="15" height="15" fill="white" transform="translate(9 9.00781)" />
                                                    </clipPath>
                                                </defs>
                                            </svg>

                                        }
                                        <span>{createQuestionContext?.selectedDifficultyLevel}</span>
                                    </div>
                                    <span>{createQuestionContext.questionTile!==""?createQuestionContext.questionTile:"-"}</span>
                                </div>
                                <div className="right-side">
                                    <div className="type">
                                        <span>MCQ</span>
                                    </div>
                                </div>
                            </div>
                            <div className="bottom">
                                <div className="left-side">
                                    <div data-tip="Health" className="health">
                                        <svg width="15" height="16" viewBox="0 0 15 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M12.5378 3.42083C11.3304 2.16702 9.33361 2.16702 8.12623 3.42083L7.52255 4.07095C7.47611 4.11739 7.3368 4.11739 7.29036 4.07095L6.68667 3.42083C5.4793 2.16702 3.52892 2.16702 2.32155 3.42083C1.11417 4.67464 1.11417 6.71789 2.32155 7.9717L3.06455 8.7147L7.3368 13.1263C7.38323 13.1727 7.52255 13.1727 7.56898 13.1263L11.8412 8.7147L12.5842 7.9717C13.7916 6.71789 13.7916 4.67464 12.5378 3.42083Z" stroke="#F23E3E" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                                            <path d="M4.17969 7.13531H5.57281L6.50156 6.20656L7.43031 8.06406L8.35906 5.74219L9.28781 7.13531H10.6809" stroke="#F23E3E" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                                        </svg>
                                        <span>Health 10/10</span>
                                    </div>
                                    <div className="side-bar"></div>
                                </div>
                                <div className="right-side">

                                    <div data-tip="Score" className="score">
                                        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M2.15937 1.09961H12.5594C12.9042 1.09961 13.2348 1.25179 13.4786 1.52268C13.7224 1.79356 13.8594 2.16096 13.8594 2.54405V6.87739C13.8594 8.79284 13.1746 10.6298 11.9556 11.9843C10.7366 13.3387 9.08328 14.0996 7.35937 14.0996C6.50578 14.0996 5.66055 13.9128 4.87193 13.5499C4.08332 13.1869 3.36676 12.6549 2.76318 11.9843C1.54419 10.6298 0.859375 8.79284 0.859375 6.87739V2.54405C0.859375 2.16096 0.996339 1.79356 1.24014 1.52268C1.48393 1.25179 1.81459 1.09961 2.15937 1.09961V1.09961Z" stroke="#827C7C" stroke-linecap="round" stroke-linejoin="round" />
                                            <path d="M4.76953 6.15625L7.36953 9.04514L9.96953 6.15625" stroke="#827C7C" stroke-linecap="round" stroke-linejoin="round" />
                                        </svg>
                                        <span>Score: {createQuestionContext.score!==""?createQuestionContext.score:"-"}</span>
                                    </div>
                                    <div data-tip={createQuestionContext?.skills?.map((data)=>{return data?.skills?.skills})} className="tags">
                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <g clip-path="url(#clip0_2049_3556)">
                                                <path d="M13.7281 8.48086L9.24688 12.9621C9.13078 13.0783 8.99292 13.1705 8.84118 13.2334C8.68943 13.2963 8.52677 13.3287 8.3625 13.3287C8.19823 13.3287 8.03557 13.2963 7.88382 13.2334C7.73208 13.1705 7.59422 13.0783 7.47813 12.9621L2.10938 7.59961V1.34961H8.35938L13.7281 6.71836C13.9609 6.95256 14.0916 7.26938 14.0916 7.59961C14.0916 7.92984 13.9609 8.24666 13.7281 8.48086V8.48086Z" stroke="#827C7C" stroke-linecap="round" stroke-linejoin="round" />
                                                <path d="M5.23438 4.47461H5.24063" stroke="#827C7C" stroke-linecap="round" stroke-linejoin="round" />
                                            </g>
                                            <defs>
                                                <clipPath id="clip0_2049_3556">
                                                    <rect width="15" height="15" fill="white" transform="translate(0.859375 0.0996094)" />
                                                </clipPath>
                                            </defs>
                                        </svg>
                                        {createQuestionContext?.skills.length?
                                        <>
                                        {createQuestionContext?.skills?.map((data, index) => {
                                            if (index < 2) {
                                                return (
                                                    <span>{data?.skills?.skills}</span>
                                                )
                                            } else if (index === 2) {
                                                return (
                                                    <span>+{createQuestionContext?.skills?.length - 2}</span>
                                                )
                                            }
                                        })
                                        }
                                        </>
                                        :<>-</>

                                        }
                                        
                                    </div>
                                    <div data-tip={createQuestionContext?.topics?.map((data)=>{return data?.topic})} className="topics">
                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M2.73438 7.59961H13.9844" stroke="#827C7C" stroke-linecap="round" stroke-linejoin="round" />
                                            <path d="M2.73438 3.84961H13.9844" stroke="#827C7C" stroke-linecap="round" stroke-linejoin="round" />
                                            <path d="M2.73438 11.3496H13.9844" stroke="#827C7C" stroke-linecap="round" stroke-linejoin="round" />
                                        </svg>
                                        {createQuestionContext?.topics.length?
                                        <>
                                        {createQuestionContext?.topics?.map((data, index) => {
                                            if (index < 2) {
                                                return (
                                                    <span>{data?.topic}</span>
                                                )
                                            } else if (index === 2) {
                                                return (
                                                    <span>+{createQuestionContext?.topics?.length - 2}</span>
                                                )
                                            }
                                        })
                                        }
                                        </>
                                        :
                                        <>-</>

                                        }
                                        
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="row2">
                            <div className="left-content-box">
                                <span>Problem</span>
                                <div className="container">
                                    <textarea readOnly={true} value={createQuestionContext.question!==""?createQuestionContext.question:"-"} name="" id="" cols="30" rows="10" placeholder='Case 1: Something here
Case 2: Something here &#10;
&#10;
<script type="module" src="new_tab_page.js"></script>
    <link rel="stylesheet" href="chrome://resources/css/text_defaults_md.css">
    <link rel="stylesheet" href="shared_vars.css">'></textarea>
                                </div>
                            </div>
                            <div className="right-content-box">
                                <div className="heading">
                                    <span>Solution</span>
                                    <div className="multiple-ans">
                                        {createQuestionContext.correctAnswerType ==="Yes"?
                                        <svg width="15" height="16" viewBox="0 0 15 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <g clip-path="url(#clip0_2049_3428)">
                                                <path d="M13.75 6.95787V7.53287C13.7492 8.88064 13.3128 10.192 12.5058 11.2715C11.6989 12.351 10.5646 13.1407 9.2721 13.5228C7.97964 13.905 6.59829 13.8591 5.33404 13.392C4.0698 12.9249 2.99041 12.0617 2.25685 10.931C1.52329 9.8004 1.17487 8.46291 1.26355 7.11807C1.35223 5.77323 1.87325 4.49308 2.74892 3.46854C3.6246 2.44401 4.80799 1.72999 6.12262 1.43297C7.43725 1.13594 8.81267 1.27183 10.0438 1.82037" stroke="#00C49A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                                <path d="M13.75 2.5332L7.5 8.78945L5.625 6.91445" stroke="#00C49A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                            </g>
                                            <defs>
                                                <clipPath id="clip0_2049_3428">
                                                    <rect width="15" height="15" fill="white" transform="translate(0 0.0332031)" />
                                                </clipPath>
                                            </defs>
                                        </svg>:<svg width="15" height="16" viewBox="0 0 15 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <g clip-path="url(#clip0_2049_3428)">
                                                <path d="M13.75 6.95787V7.53287C13.7492 8.88064 13.3128 10.192 12.5058 11.2715C11.6989 12.351 10.5646 13.1407 9.2721 13.5228C7.97964 13.905 6.59829 13.8591 5.33404 13.392C4.0698 12.9249 2.99041 12.0617 2.25685 10.931C1.52329 9.8004 1.17487 8.46291 1.26355 7.11807C1.35223 5.77323 1.87325 4.49308 2.74892 3.46854C3.6246 2.44401 4.80799 1.72999 6.12262 1.43297C7.43725 1.13594 8.81267 1.27183 10.0438 1.82037" stroke="#d3d3d3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                                <path d="M13.75 2.5332L7.5 8.78945L5.625 6.91445" stroke="#d3d3d3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                            </g>
                                            <defs>
                                                <clipPath id="clip0_2049_3428">
                                                    <rect width="15" height="15" fill="white" transform="translate(0 0.0332031)" />
                                                </clipPath>
                                            </defs>
                                        </svg>
                                        }
                                        {createQuestionContext.correctAnswerType ==="Yes"?
                                        <span>Multiple answers are allowed</span>:
                                        <span>Single answer allowed</span>
                                        }
                                    </div>
                                </div>
                                <div className='question-solution-container' >
                                    {createQuestionContext.answersObjectArray.map((data, index) => {
                                        if (data.option !== undefined) {
                                            return (
                                                <div style={createQuestionContext.correctAnswerObjectArray.includes(data.optionId) ? { borderColor: '#00C49A' } : {}} className='answer-item' >
                                                    <span>{index + 1}. {data.option}</span>
                                                    {createQuestionContext.correctAnswerObjectArray.includes(data.optionId) && <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <rect width="20" height="20" rx="2" fill="#00C49A" />
                                                        <path d="M14 8L8.5 13.5L6 11" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                                    </svg>
                                                    }
                                                </div>
                                            )
                                        }
                                    })
                                    }


                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ReactTooltip/>
        </div >
    );
}

export default QuestionPreview;