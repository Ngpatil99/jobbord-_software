import React, { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
import jwtDecode from "jwt-decode";
import { backend_url,getCookie } from '../../constant';
import { toast } from 'react-toastify'
import './index.css'
import NavigationBar from '../../component/NavigationBar/NavigationBar';
import QuestionSidebar from '../../component/QuestionSidebar';
import CreateQuestionContext from '../../store/CreateQuestionContext'
const CancelToken = axios.CancelToken
let cancel;

const NewQuestion = () => {
    const createQuestionContext = useContext(CreateQuestionContext)
    const navigate = useNavigate()
    const [skillSearchText, setskillSearchText] = useState("")
    const [searchSkillData, setsearchSkillData] = useState([])
    const [topicSearchText, settopicSearchText] = useState("")
    const [searchTopicData, setsearchTopicData] = useState([])
    const [loadingDraft, setloadingDraft] = useState(false)
    const [updateRefresh,setupdateRefresh]=useState({})

    const onType = async (e) => {
        const search = e.target.value
        setskillSearchText(e.target.value)

        try {
            const token = getCookie("Xh7ERL0G")
            const res = await axios.get(`${backend_url}skill/search?page=1&limit=5&searchText=${search}`, {
                headers: { "token": token }, cancelToken: new CancelToken(function executor(c) {
                    // An executor function is executed when the cancelToken is created
                    cancel = c;
                })
            })
            setsearchSkillData(res.data.data)
            cancel('Canceling request')
        } catch (error) {
            console.log(error)
        }
    }

    const searchSkill = async () => {
        try {
            const token = getCookie("Xh7ERL0G")
            const res = await axios.get(`${backend_url}skill/search?page=1&limit=5&searchText=${skillSearchText}`, {
                headers: { "token": token }, cancelToken: new CancelToken(function executor(c) {
                    // An executor function is executed when the cancelToken is created
                    cancel = c;
                })
            })
            setsearchSkillData(res.data.data)
            cancel('Canceling request')
        } catch (error) {
            toast(`${error}`, {
                className: 'toast-message'
            })
        }
    }

    const searchTopic = async () => {
        try {
            const token = getCookie("Xh7ERL0G")
            const res = await axios.get(`${backend_url}topic/search?page=1&limit=5&searchText=${topicSearchText}`, { headers: { "token": token } })
            setsearchTopicData(res.data.data)

        } catch (error) {
            toast(`${error}`, {
                className: 'toast-message'
            })
        }
    }

    const addSearchedSkill = (skillName) => {

        let skillArray = createQuestionContext.skills.map(function (item) { return item?.skills.skills });
        if (!skillArray.includes(skillName.skills)) {
            const obj = {
                skills: {},
                topicId: []
            }
            obj.skills = skillName
            skillName.topics.map((topicId) => {
                createQuestionContext.setQuestiontopics(prev => [...prev, topicId?.topicId])
                obj.topicId.push(topicId?.topicId)
            })
            createQuestionContext.setQuestionSkills(prev => [...prev, obj])
            searchSkillData.length = 0;
        } else {
            toast("You have added already that skill", {
                className: 'toast-message'
            })
        }
    }

    const addSearchedTopics = (topicName) => {
        let topicsArray = createQuestionContext.topics.map(function (item) { return item.topic });

        if (!topicsArray.includes(topicName.topic)) {
            createQuestionContext.setQuestiontopics(prev => [...prev, topicName])
            searchTopicData.length = 0;
        } else {
            toast("You have added already that skill", {
                className: 'toast-message'
            })
        }
    }

    const removeSkill = (skillId) => {
        const filterSkillData = createQuestionContext.skills.filter(element => element.skills._id !== skillId)
        createQuestionContext.setQuestionSkills(filterSkillData)
        createQuestionContext.topics.length = 0;
        filterSkillData.forEach((data) => {
            data.topicId.forEach((topic) => {
                createQuestionContext.setQuestiontopics(prev => [...prev, topic])
            })
        })
        toast("skill is removed...")
    }

    const removeTopic = (topicId, skillName) => {
        createQuestionContext.skills.forEach((data, index1) => {
            
            data.topicId.forEach((topic, index2) => {
                
                if (topic?._id === topicId && data?.skills?.skills === skillName.skills) {
                    createQuestionContext.skills[index1].topicId.splice(index2, 1)
                }
                if (data.topicId.length === 0) {
                    createQuestionContext.skills.splice(index1, 1)
                }
            })
        })
        const filterTopicData = createQuestionContext.topics.filter(element => element?._id !== topicId)
        createQuestionContext.setQuestiontopics(filterTopicData)
        
        toast("topic is removed...")
    }

    const removeAllTopic = (skillName) => {
        createQuestionContext.skills.forEach((data, index1) => {
            if (data.skills === skillName) {

                data.topicId.length=0;
                if (data.topicId.length === 0) {
                    createQuestionContext.skills.splice(index1, 1)
                }
            }
        })
        const filterTopicData = createQuestionContext.topics.filter(element => element?._id)
        createQuestionContext.setQuestiontopics(filterTopicData)
        toast(`All topic is removed from ${skillName.skills}...`)

    }

    const saveAsDraftQuestion = async () => {
        let topicsData=[];
                createQuestionContext.skills.map((data)=>{
                    if(data?.skills?.skills!==null){
                        
                        data?.skills?.topicId?.forEach(topic=>{
                            topicsData.push(topic) 
                        })
                    }
                })
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
                // let topicsData=[];
                // createQuestionContext.skills.map((data)=>{
                //     if(data.skills.skills!==null){
                //         data.skills.topicId.forEach(topic=>{
                //             topicsData.push(topic) 
                //         })
                //     }
                // })
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
                let correctAnswerObjectArray = createQuestionContext.correctAnswerObjectArray.map(function (element) {
                    if (typeof (element) === 'number') {
                        return element;
                    }
                })
                let questionOption = correctAnswerObjectArray.toString()
                correctAnswerObjectArray = questionOption.split(',')
                correctAnswerObjectArray = correctAnswerObjectArray.filter(element => {
                    if (element !== '') {
                        return element
                    }
                })
                const answersObjectArray = createQuestionContext.answersObjectArray.map((data) => {
                    if (data !== false && data !== undefined) {
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
                    score: createQuestionContext.score,
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
                navigate("/library", { state: { library: 'Draft' } });

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
        <div className="new-question-1-container">
            <NavigationBar saveAsDraft={true} loadingDraft={loadingDraft} onClickSaveAsDraft={() => saveAsDraftQuestion()} />
            {/* <NavigationBar/> */}

            <div className="question-1-container">

                {/* sidebar */}
                <QuestionSidebar page="New Question" />


                <div className="right-side-container">
                    <div className="right-content">
                        <div className="col">
                            <div className="header">
                                <div className="title">
                                    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="24" cy="24" r="24" fill="#00C49A" fillOpacity="0.1" />
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
                                        <span>Basic Details</span>
                                        <p>Basic details include all important small details</p>
                                    </div>
                                </div>
                                {/* createQuestionContext.questionTile.length && createQuestionContext.score && createQuestionContext.selectedDifficultyLevel != "" && createQuestionContext.skills.length && createQuestionContext.topics.length ? navigate('/createquestion') : toast.error('fill all details') */}
                                <div style={createQuestionContext.questionTile.length && createQuestionContext.score && createQuestionContext.selectedDifficultyLevel && createQuestionContext.skills.length && createQuestionContext.topics.length ? {} : { backgroundColor: "#D9D9D9" }} onClick={() => { createQuestionContext.questionTile.length ? createQuestionContext.score ? createQuestionContext.selectedDifficultyLevel ? createQuestionContext.skills.length ? createQuestionContext.topics.length ? navigate('/createquestion') : toast.error('Select Some Topics') : toast.error('Select Some Skills') : toast.error('Select Difficulty Level') : toast.error('Score Is Empty') : toast.error('Question Title Is Empty') }} className="next-button">

                                    <span>Next</span>
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="10" cy="10" r="10" fill="white" />
                                        <path d="M8 15.2661L14 10.613L8 5.95996" stroke={createQuestionContext.questionTile.length && createQuestionContext.score && createQuestionContext.selectedDifficultyLevel && createQuestionContext.skills.length && createQuestionContext.topics.length ? "#00C49A" : "#D9D9D9"} stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                    </svg>
                                </div>
                            </div>
                            <div className="header-bar"></div>
                        </div>

                        <div className="row">
                            <div className="input">
                                <div className="title">
                                    <span>Question Title</span>
                                    <input onChange={(e) => createQuestionContext.setQuestionTitle(e.target.value)} value={createQuestionContext.questionTile} type="text" placeholder='Question Title here' />
                                </div>
                            </div>
                        </div>

                        <div className="row2">
                            <div className="input">
                                <div className="title">
                                    <span>Score</span>
                                    <input value={createQuestionContext.score} type="number" onWheel={(e) => e.target.blur()} onKeyDown={ (evt) => evt.key === 'e' && evt.preventDefault() } min={0} max={100} onChange={(e) => { createQuestionContext.setQuestionscore(e.target.value) }} placeholder='Enter Maximum Score' />
                                </div>
                            </div>
                            <div className="list">
                                <span>Difficulty</span>
                                <div className="button-difficulty">
                                    <button onClick={() => createQuestionContext.setQuestionDifficultyLevel("easy")} className={createQuestionContext.selectedDifficultyLevel === "easy" ? 'active-button' : 'button'}><svg width="14" height="20" viewBox="0 0 14 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M10.5737 3.14153C9.60324 2.14278 8.41202 1.38565 7.09577 0.931013C7.02734 0.911575 6.95474 0.912363 6.88675 0.933284C6.81876 0.954205 6.75828 0.994362 6.71261 1.04891C6.66767 1.10391 6.63959 1.17073 6.63175 1.24133C6.6239 1.31192 6.63663 1.38327 6.6684 1.4468C7.44822 2.88907 7.6661 4.5691 7.27998 6.16258C7.27361 6.18729 7.25939 6.20928 7.23946 6.22522C7.21953 6.24116 7.19496 6.25021 7.16945 6.251C7.10314 6.251 7.0884 6.251 7.0884 6.19942C6.52577 4.83612 5.57846 3.66608 4.36209 2.83206C4.30008 2.79116 4.22714 2.76997 4.15287 2.77126C4.07859 2.77255 4.00644 2.79627 3.94588 2.8393C3.88532 2.88232 3.83918 2.94266 3.81352 3.01237C3.78786 3.08209 3.78388 3.15793 3.80209 3.22995C4.23683 4.93205 3.3821 5.95626 2.32841 7.2531C1.27473 8.54994 0 10.0678 0 12.5141C0.0258836 14.0773 0.575961 15.5865 1.56202 16.7997C2.54808 18.0129 3.91299 18.8598 5.43788 19.2046C5.12703 18.9852 4.87274 18.6951 4.69595 18.3582C4.51916 18.0213 4.42494 17.6472 4.42104 17.2668C4.42104 13.332 6.99998 12.352 6.99998 12.352C7.51577 14.931 9.57892 15.5204 9.57892 17.2668C9.57523 17.6428 9.4833 18.0127 9.31052 18.3468C9.13775 18.6808 8.88896 18.9696 8.58419 19.1899C9.6652 18.9554 10.6753 18.4681 11.5315 17.7678C12.3068 17.1251 12.9302 16.3187 13.357 15.4066C13.7838 14.4944 14.0034 13.4991 14 12.492C14 7.56257 12.1358 4.6889 10.5737 3.14153Z" fill="#00C49A" />
                                    </svg>
                                        Easy</button>
                                    <button onClick={() => createQuestionContext.setQuestionDifficultyLevel("medium")} className={createQuestionContext.selectedDifficultyLevel === "medium" ? 'active-button' : 'button'}> <svg width="14" height="20" viewBox="0 0 14 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M10.5737 3.14153C9.60324 2.14278 8.41202 1.38565 7.09577 0.931013C7.02734 0.911575 6.95474 0.912363 6.88675 0.933284C6.81876 0.954205 6.75828 0.994362 6.71261 1.04891C6.66767 1.10391 6.63959 1.17073 6.63175 1.24133C6.6239 1.31192 6.63663 1.38327 6.6684 1.4468C7.44822 2.88907 7.6661 4.5691 7.27998 6.16258C7.27361 6.18729 7.25939 6.20928 7.23946 6.22522C7.21953 6.24116 7.19496 6.25021 7.16945 6.251C7.10314 6.251 7.0884 6.251 7.0884 6.19942C6.52577 4.83612 5.57846 3.66608 4.36209 2.83206C4.30008 2.79116 4.22714 2.76997 4.15287 2.77126C4.07859 2.77255 4.00644 2.79627 3.94588 2.8393C3.88532 2.88232 3.83918 2.94266 3.81352 3.01237C3.78786 3.08209 3.78388 3.15793 3.80209 3.22995C4.23683 4.93205 3.3821 5.95626 2.32841 7.2531C1.27473 8.54994 0 10.0678 0 12.5141C0.0258836 14.0773 0.575961 15.5865 1.56202 16.7997C2.54808 18.0129 3.91299 18.8598 5.43788 19.2046C5.12703 18.9852 4.87274 18.6951 4.69595 18.3582C4.51916 18.0213 4.42494 17.6472 4.42104 17.2668C4.42104 13.332 6.99998 12.352 6.99998 12.352C7.51577 14.931 9.57892 15.5204 9.57892 17.2668C9.57523 17.6428 9.4833 18.0127 9.31052 18.3468C9.13775 18.6808 8.88896 18.9696 8.58419 19.1899C9.6652 18.9554 10.6753 18.4681 11.5315 17.7678C12.3068 17.1251 12.9302 16.3187 13.357 15.4066C13.7838 14.4944 14.0034 13.4991 14 12.492C14 7.56257 12.1358 4.6889 10.5737 3.14153Z" fill="#FF9736" />
                                    </svg>
                                        Medium</button>
                                    <button onClick={() => createQuestionContext.setQuestionDifficultyLevel("hard")} className={createQuestionContext.selectedDifficultyLevel === "hard" ? 'active-button' : 'button'}>
                                        <svg width="14" height="20" viewBox="0 0 14 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M10.5737 3.14153C9.60324 2.14278 8.41202 1.38565 7.09577 0.931013C7.02734 0.911575 6.95474 0.912363 6.88675 0.933284C6.81876 0.954205 6.75828 0.994362 6.71261 1.04891C6.66767 1.10391 6.63959 1.17073 6.63175 1.24133C6.6239 1.31192 6.63663 1.38327 6.6684 1.4468C7.44822 2.88907 7.6661 4.5691 7.27998 6.16258C7.27361 6.18729 7.25939 6.20928 7.23946 6.22522C7.21953 6.24116 7.19496 6.25021 7.16945 6.251C7.10314 6.251 7.0884 6.251 7.0884 6.19942C6.52577 4.83612 5.57846 3.66608 4.36209 2.83206C4.30008 2.79116 4.22714 2.76997 4.15287 2.77126C4.07859 2.77255 4.00644 2.79627 3.94588 2.8393C3.88532 2.88232 3.83918 2.94266 3.81352 3.01237C3.78786 3.08209 3.78388 3.15793 3.80209 3.22995C4.23683 4.93205 3.3821 5.95626 2.32841 7.2531C1.27473 8.54994 0 10.0678 0 12.5141C0.0258836 14.0773 0.575961 15.5865 1.56202 16.7997C2.54808 18.0129 3.91299 18.8598 5.43788 19.2046C5.12703 18.9852 4.87274 18.6951 4.69595 18.3582C4.51916 18.0213 4.42494 17.6472 4.42104 17.2668C4.42104 13.332 6.99998 12.352 6.99998 12.352C7.51577 14.931 9.57892 15.5204 9.57892 17.2668C9.57523 17.6428 9.4833 18.0127 9.31052 18.3468C9.13775 18.6808 8.88896 18.9696 8.58419 19.1899C9.6652 18.9554 10.6753 18.4681 11.5315 17.7678C12.3068 17.1251 12.9302 16.3187 13.357 15.4066C13.7838 14.4944 14.0034 13.4991 14 12.492C14 7.56257 12.1358 4.6889 10.5737 3.14153Z" fill="#FF5D00" />
                                        </svg>

                                        Hard</button>
                                </div>
                            </div>
                        </div>
                        <div className="skill-topics-container" >
                            <div className="skill-input-header-container" >
                                <label>Skills</label>
                                <div className="inputbox-skill" >
                                    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M12.8688 8.38125L8.3875 12.8625C8.27141 12.9787 8.13355 13.0709 7.9818 13.1338C7.83005 13.1967 7.66739 13.2291 7.50313 13.2291C7.33886 13.2291 7.1762 13.1967 7.02445 13.1338C6.8727 13.0709 6.73484 12.9787 6.61875 12.8625L1.25 7.5V1.25H7.5L12.8688 6.61875C13.1016 6.85295 13.2322 7.16977 13.2322 7.5C13.2322 7.83023 13.1016 8.14705 12.8688 8.38125V8.38125Z" stroke="#FF6812" stroke-linecap="round" stroke-linejoin="round" />
                                        <path d="M4.375 4.375H4.38125" stroke="#FF6812" stroke-linecap="round" stroke-linejoin="round" />
                                    </svg>
                                    <input onKeyDown={(e) => { if (e.key === "Enter") { searchSkill() } }} value={skillSearchText} onChange={onType} placeholder="Search skill here..." />
                                    {skillSearchText !== "" ?
                                        <svg style={{ cursor: 'pointer', position: 'absolute', right: 40 }} onClick={() => { setskillSearchText(""); searchSkillData.length = 0 }} width="10" height="10" viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path fill-rule="evenodd" clip-rule="evenodd" d="M12.0032 13.9813L7.00642 8.985L2.01082 13.9813C1.55102 14.441 0.805358 14.4412 0.345266 13.9815C-0.114825 13.5219 -0.115113 12.7761 0.344547 12.3161L5.34122 7.31986L0.344476 2.32245C-0.102534 1.86017 -0.0962087 1.12477 0.358851 0.670542C0.813839 0.216023 1.54922 0.210848 2.01082 0.658468L7.00642 5.65473L12.0032 0.658468C12.4666 0.222348 13.1925 0.233272 13.6426 0.683192C14.0927 1.13282 14.1041 1.85873 13.6684 2.32245L8.67162 7.31986L13.6684 12.3161C14.1157 12.7781 14.1098 13.5135 13.6551 13.968C13.2004 14.4228 12.4651 14.4286 12.0031 13.9813H12.0032Z" fill="#99B2C6" />
                                        </svg> :
                                        <></>

                                    }
                                    <svg style={{ cursor: 'pointer' }} onClick={() => searchSkill()} width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <g clip-path="url(#clip0_2071_2845)">
                                            <path d="M6.875 11.875C9.63642 11.875 11.875 9.63642 11.875 6.875C11.875 4.11358 9.63642 1.875 6.875 1.875C4.11358 1.875 1.875 4.11358 1.875 6.875C1.875 9.63642 4.11358 11.875 6.875 11.875Z" stroke="#363534" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                            <path d="M13.125 13.125L10.4062 10.4062" stroke="#363534" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                        </g>
                                        <defs>
                                            <clipPath id="clip0_2071_2845">
                                                <rect width="15" height="15" fill="white" />
                                            </clipPath>
                                        </defs>
                                    </svg>

                                </div>
                                <div className="skill-list-item-container" >
                                    {createQuestionContext.skills?.map((data) => {
                                        //if (data?.topicId?.length) {
                                        return (
                                            <button>
                                                <span  >{data?.skills.skills}</span>
                                                <svg onClick={() => removeSkill(data.skills._id)} width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <circle cx="10" cy="10.5" r="10" fill="#F0F7FB" />
                                                    <path d="M13 7.5L7 13.5" stroke="#BDCCD3" stroke-linecap="round" />
                                                    <path d="M13 13.5L7.00019 7.50019" stroke="#BDCCD3" stroke-linecap="round" />
                                                </svg>

                                            </button>
                                        )
                                        // }
                                    })

                                    }


                                </div>
                                {(skillSearchText !== "" && searchSkillData.length) ?
                                    <div onClick={() => searchSkillData.length = 0} className="search-result-container" >
                                        <svg style={{ cursor: 'pointer', position: 'absolute', right: 20 }} onClick={() => { setsearchSkillData([]) }} width="10" height="10" viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path fill-rule="evenodd" clip-rule="evenodd" d="M12.0032 13.9813L7.00642 8.985L2.01082 13.9813C1.55102 14.441 0.805358 14.4412 0.345266 13.9815C-0.114825 13.5219 -0.115113 12.7761 0.344547 12.3161L5.34122 7.31986L0.344476 2.32245C-0.102534 1.86017 -0.0962087 1.12477 0.358851 0.670542C0.813839 0.216023 1.54922 0.210848 2.01082 0.658468L7.00642 5.65473L12.0032 0.658468C12.4666 0.222348 13.1925 0.233272 13.6426 0.683192C14.0927 1.13282 14.1041 1.85873 13.6684 2.32245L8.67162 7.31986L13.6684 12.3161C14.1157 12.7781 14.1098 13.5135 13.6551 13.968C13.2004 14.4228 12.4651 14.4286 12.0031 13.9813H12.0032Z" fill="#99B2C6" />
                                        </svg>
                                        {searchSkillData?.map((data) => {
                                            return <div style={{ marginTop: 5 }} className="skill-item" >
                                                <span> {data?.skills}</span>
                                                <svg onClick={() => addSearchedSkill(data)} style={{ cursor: 'pointer' }} width="10" height="9" viewBox="0 0 10 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M4.10343 8.24338L4.0947 8.14768V5.27982H0.907895C0.431503 5.28184 0.0352021 4.95232 0.00221205 4.52676C-0.0308162 4.10116 0.310793 3.72574 0.782914 3.66877L0.890999 3.66095H4.09405V0.807097C4.09657 0.382424 4.46434 0.0313535 4.93741 0.00198094C5.41049 -0.0273916 5.82883 0.274873 5.8968 0.69514L5.90492 0.791967V3.65815H9.09172C9.56834 3.65624 9.96476 3.98596 9.99779 4.41176C10.0308 4.83756 9.68905 5.21319 9.2167 5.2703L9.10797 5.27702H5.90492V8.13088C5.90461 8.55658 5.53654 8.90963 5.06224 8.9391C4.58791 8.96861 4.16888 8.6645 4.10286 8.24284L4.10343 8.24338Z" fill="#FF6812" />
                                                </svg>

                                            </div>
                                        })

                                        }
                                    </div> : <></>
                                }
                            </div>

                            <div className="skill-input-header-container" >
                                <label>Topics</label>
                                <div className="inputbox-skill" >
                                    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M12.8688 8.38125L8.3875 12.8625C8.27141 12.9787 8.13355 13.0709 7.9818 13.1338C7.83005 13.1967 7.66739 13.2291 7.50313 13.2291C7.33886 13.2291 7.1762 13.1967 7.02445 13.1338C6.8727 13.0709 6.73484 12.9787 6.61875 12.8625L1.25 7.5V1.25H7.5L12.8688 6.61875C13.1016 6.85295 13.2322 7.16977 13.2322 7.5C13.2322 7.83023 13.1016 8.14705 12.8688 8.38125V8.38125Z" stroke="#FF6812" stroke-linecap="round" stroke-linejoin="round" />
                                        <path d="M4.375 4.375H4.38125" stroke="#FF6812" stroke-linecap="round" stroke-linejoin="round" />
                                    </svg>
                                    <input onKeyDown={(e) => { if (e.key === "Enter") { searchTopic() } }} value={topicSearchText} onChange={(e) => settopicSearchText(e.target.value)} placeholder="Search topic here..." />
                                    {topicSearchText !== "" ?
                                        <svg style={{ cursor: 'pointer', position: 'absolute', right: 40 }} onClick={() => { settopicSearchText(""); searchTopicData.length = 0 }} width="10" height="10" viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path fill-rule="evenodd" clip-rule="evenodd" d="M12.0032 13.9813L7.00642 8.985L2.01082 13.9813C1.55102 14.441 0.805358 14.4412 0.345266 13.9815C-0.114825 13.5219 -0.115113 12.7761 0.344547 12.3161L5.34122 7.31986L0.344476 2.32245C-0.102534 1.86017 -0.0962087 1.12477 0.358851 0.670542C0.813839 0.216023 1.54922 0.210848 2.01082 0.658468L7.00642 5.65473L12.0032 0.658468C12.4666 0.222348 13.1925 0.233272 13.6426 0.683192C14.0927 1.13282 14.1041 1.85873 13.6684 2.32245L8.67162 7.31986L13.6684 12.3161C14.1157 12.7781 14.1098 13.5135 13.6551 13.968C13.2004 14.4228 12.4651 14.4286 12.0031 13.9813H12.0032Z" fill="#99B2C6" />
                                        </svg> :
                                        <></>

                                    }
                                    <svg style={{ cursor: 'pointer' }} onClick={searchTopic} width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <g clip-path="url(#clip0_2071_2845)">
                                            <path d="M6.875 11.875C9.63642 11.875 11.875 9.63642 11.875 6.875C11.875 4.11358 9.63642 1.875 6.875 1.875C4.11358 1.875 1.875 4.11358 1.875 6.875C1.875 9.63642 4.11358 11.875 6.875 11.875Z" stroke="#363534" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                            <path d="M13.125 13.125L10.4062 10.4062" stroke="#363534" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                        </g>
                                        <defs>
                                            <clipPath id="clip0_2071_2845">
                                                <rect width="15" height="15" fill="white" />
                                            </clipPath>
                                        </defs>
                                    </svg>

                                </div>
                                <div className='topics-section' >
                                    {createQuestionContext.skills.map((data) => {
                                        return <div>
                                            <span>{data.skills.skills} <button onClick={()=>removeAllTopic(data.skills)} >(remove all)</button></span>
                                            <div className="skill-topics-list-item-container" >
                                                {
                                                    data.topicId.map((topics) => {
                                                        return (
                                                            topics?._id?
                                                            <button>
                                                                <span>{topics?.topic}</span>
                                                                <svg onClick={() => removeTopic(topics._id, data.skills)} width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                    <circle cx="10" cy="10.5" r="10" fill="#F0F7FB" />
                                                                    <path d="M13 7.5L7 13.5" stroke="#BDCCD3" stroke-linecap="round" />
                                                                    <path d="M13 13.5L7.00019 7.50019" stroke="#BDCCD3" stroke-linecap="round" />
                                                                </svg>

                                                            </button>:<></>
                                                            
                                                        )
                                                    })
                                                }
                                            </div>
                                        </div>
                                    })

                                    }
                                    {/* {createQuestionContext.topics?.map((data) => {
                                        return (
                                            <button>
                                                <span>{data?.topic}</span>
                                                <svg onClick={() => removeTopic(data._id)} width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <circle cx="10" cy="10.5" r="10" fill="#F0F7FB" />
                                                    <path d="M13 7.5L7 13.5" stroke="#BDCCD3" stroke-linecap="round" />
                                                    <path d="M13 13.5L7.00019 7.50019" stroke="#BDCCD3" stroke-linecap="round" />
                                                </svg>

                                            </button>
                                        )
                                    })

                                    } */}



                                </div>
                                {(topicSearchText !== "" && searchTopicData.length) ?
                                    <div className="search-result-container" >
                                        <svg style={{ cursor: 'pointer', position: 'absolute', right: 20 }} onClick={() => { setsearchTopicData([]) }} width="10" height="10" viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path fill-rule="evenodd" clip-rule="evenodd" d="M12.0032 13.9813L7.00642 8.985L2.01082 13.9813C1.55102 14.441 0.805358 14.4412 0.345266 13.9815C-0.114825 13.5219 -0.115113 12.7761 0.344547 12.3161L5.34122 7.31986L0.344476 2.32245C-0.102534 1.86017 -0.0962087 1.12477 0.358851 0.670542C0.813839 0.216023 1.54922 0.210848 2.01082 0.658468L7.00642 5.65473L12.0032 0.658468C12.4666 0.222348 13.1925 0.233272 13.6426 0.683192C14.0927 1.13282 14.1041 1.85873 13.6684 2.32245L8.67162 7.31986L13.6684 12.3161C14.1157 12.7781 14.1098 13.5135 13.6551 13.968C13.2004 14.4228 12.4651 14.4286 12.0031 13.9813H12.0032Z" fill="#99B2C6" />
                                        </svg>

                                        {searchTopicData?.map((data) => {
                                            return <div style={{ marginTop: 5 }} className="skill-item" >
                                                <span> {data?.topic}</span>
                                                <svg  style={{ cursor: 'pointer' }} width="10" height="9" viewBox="0 0 10 9" fill="none" xmlns="http://www.w3.org/2000/svg">
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
    )
}

export default NewQuestion