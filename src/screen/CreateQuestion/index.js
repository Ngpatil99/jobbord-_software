import React, { useRef, useState, useContext, useEffect } from 'react';
import './index.css';
import NavigationBar from '../../component/NavigationBar/NavigationBar';
import QuestionSidebar from '../../component/QuestionSidebar';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import jwtDecode from "jwt-decode";
import { backend_url, getCookie } from '../../constant';
import { EditorState, ContentState } from 'draft-js';
import './index.css';
import '../BulkImported/draft.css'
import '../BulkImported/example.css'
import '../BulkImported/rich-editor.css'
import DraftJsEditor from '../../component/DraftJsEditor.js';
import CreateQuestionContext from '../../store/CreateQuestionContext'
import { toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid'
const CreateQuestion = () => {
    const [loading, setloading] = useState(false)

    const createQuestionContext = useContext(CreateQuestionContext)

    const [editorStateForProblem, seteditorStateForProblem] = useState(EditorState.createEmpty());
    const [editorStateForSolution, seteditorStateForSolution] = useState(EditorState.createWithContent(
        ContentState.createFromText('Answer 1 goes here this is your answer.')
    ));
    const [editorStateForSolution1, seteditorStateForSolution1] = useState(EditorState.createWithContent(
        ContentState.createFromText('Option 2')
    ));
    const [editorStateForSolution2, seteditorStateForSolution2] = useState(EditorState.createWithContent(
        ContentState.createFromText('Option 3')
    ));
    const [editorStateForSolution3, seteditorStateForSolution3] = useState(EditorState.createWithContent(
        ContentState.createFromText('Option 4')
    ));
    const [editorStateForSolution4, seteditorStateForSolution4] = useState(EditorState.createWithContent(
        ContentState.createFromText('Option 5')
    ));

    const [editorStateForSolution5, seteditorStateForSolution5] = useState(EditorState.createWithContent(
        ContentState.createFromText('Option 6')
    ));

    const [editOption1, seteditOption1] = useState(true)
    const [option1Selected, setoption1Selected] = useState(true)
    const [editOption2, seteditOption2] = useState(false)
    const [option2Selected, setoption2Selected] = useState(false)
    const [editOption3, seteditOption3] = useState(false)
    const [option3Selected, setoption3Selected] = useState(false)
    const [editOption4, seteditOption4] = useState(false)
    const [option4Selected, setoption4Selected] = useState(false)
    const [editOption5, seteditOption5] = useState(false)
    const [option5Selected, setoption5Selected] = useState(false)
    const [editOption6, seteditOption6] = useState(false)
    const [option6Selected, setoption6Selected] = useState(false)

    const [allowMutipleAnswer, setallowMutipleAnswer] = useState(false)

    const [showFifthSolutionOption, setshowFifthSolutionOption] = useState(false)
    const [showSixthSolutionOption, setshowSixthSolutionOption] = useState(false)
    const [showSecondSolutionOption, setshowSecondSolutionOption] = useState(false)
    const [showThirdSolutionOption, setshowThirdSolutionOption] = useState(false)
    const [showFourthSolutionOption, setshowFourthSolutionOption] = useState(false)

    const editorForProblemStatement = useRef(null)
    const editorForSolutionOption = useRef(null)
    const navigate = useNavigate();

    useEffect(() => {
        createQuestionContext?.correctAnswerObjectArray?.forEach((data,index)=>{
            if(data!==false && index===0){
                setoption1Selected(true)
            }else{
                setoption1Selected(false)
            
            }
            if(data!==false && index===1){
                setoption2Selected(true)
            }else{
                setoption2Selected(false)   
            }
            if(data!==false && index===2){
                setoption3Selected(true)
            }else{
                setoption3Selected(true) 
            }
            if(data!==false && index===3){
                setoption4Selected(true)
            }else{
                setoption4Selected(false) 
            }
            if(data!==false && index===4){
                setoption5Selected(true)
            }else{
                setoption5Selected(false) 
            }
            if(data!==false && index===5){
                setoption6Selected(true)
            }else{
                setoption6Selected(false) 
            }
        })
        if (createQuestionContext.question !== "") {
            seteditorStateForProblem(EditorState.createWithContent(
                ContentState.createFromText(createQuestionContext.question)
            ))
        }
        if (createQuestionContext.answersObjectArray[0]?.option !== undefined) {
            seteditorStateForSolution(EditorState.createWithContent(
                ContentState.createFromText(`${createQuestionContext?.answersObjectArray[0]?.option}`)
            ))
        }
        if (createQuestionContext.answersObjectArray[1]?.option !== undefined) {
            seteditorStateForSolution1(EditorState.createWithContent(
                ContentState.createFromText(`${createQuestionContext?.answersObjectArray[1]?.option}`)
            ))
        }
        if (createQuestionContext.answersObjectArray[2]?.option !== undefined) {
            seteditorStateForSolution2(EditorState.createWithContent(
                ContentState.createFromText(`${createQuestionContext?.answersObjectArray[2]?.option}`)
            ))
            setshowThirdSolutionOption(true)
        }
        if (createQuestionContext.answersObjectArray[3]?.option !== undefined) {
            seteditorStateForSolution3(EditorState.createWithContent(
                ContentState.createFromText(`${createQuestionContext?.answersObjectArray[3]?.option}`)
            ))
            setshowFourthSolutionOption(true)
        }
        if (createQuestionContext.answersObjectArray[4]?.option !== undefined) {
            seteditorStateForSolution4(EditorState.createWithContent(
                ContentState.createFromText(`${createQuestionContext?.answersObjectArray[4]?.option}`)
            ))
            setshowFifthSolutionOption(true)
        }
        if (createQuestionContext.answersObjectArray[5]?.option !== undefined) {
            seteditorStateForSolution5(EditorState.createWithContent(
                ContentState.createFromText(`${createQuestionContext?.answersObjectArray[5]?.option}`)
            ))
            setshowSixthSolutionOption(true)
        }
        if (createQuestionContext.correctAnswerType !== "") {
            setallowMutipleAnswer(createQuestionContext.correctAnswerType === "Yes" ? true : false)
        }

    }, [])

    const onClickSolutionOption1 = (e) => {
        e.stopPropagation()
        seteditOption1(!editOption1)
        seteditOption2(false)
        seteditOption3(false)
        seteditOption4(false)
        seteditOption5(false)
        seteditOption6(false)
    }

    const onClickSelectSolutionOption1 = (e) => {
        e.stopPropagation()
        if (allowMutipleAnswer) {
            setoption1Selected(!option1Selected)
        } else {
            setoption1Selected(!option1Selected)
            setoption2Selected(false)
            setoption3Selected(false)
            setoption4Selected(false)
            setoption5Selected(false)
            setoption6Selected(false)
        }
    }

    const onClickSolutionOption2 = (e) => {
        e.stopPropagation()
        seteditOption1(false)
        seteditOption2(!editOption2)
        seteditOption3(false)
        seteditOption4(false)
        seteditOption5(false)
        seteditOption6(false)
    }

    const onClickSelectSolutionOption2 = (e) => {
        e.stopPropagation()
        if (allowMutipleAnswer) {
            setoption2Selected(!option2Selected)
        } else {
            setoption1Selected(false)
            setoption2Selected(!option2Selected)
            setoption3Selected(false)
            setoption4Selected(false)
            setoption5Selected(false)
            setoption6Selected(false)
        }
    }

    const onClickSolutionOption3 = (e) => {
        e.stopPropagation()
        seteditOption1(false)
        seteditOption2(false)
        seteditOption3(!editOption3)
        seteditOption4(false)
        seteditOption5(false)
        seteditOption6(false)
    }

    const onClickSelectSolutionOption3 = (e) => {
        e.stopPropagation()
        if (allowMutipleAnswer) {
            setoption3Selected(!option3Selected)
        } else {
            setoption1Selected(false)
            setoption2Selected(false)
            setoption3Selected(!option3Selected)
            setoption4Selected(false)
            setoption5Selected(false)
            setoption6Selected(false)
        }
    }

    const onClickSolutionOption4 = (e) => {
        e.stopPropagation()
        seteditOption1(false)
        seteditOption2(false)
        seteditOption3(false)
        seteditOption4(!editOption4)
        seteditOption5(false)
        seteditOption6(false)
    }

    const onClickSelectSolutionOption4 = (e) => {
        e.stopPropagation()
        if (allowMutipleAnswer) {
            setoption4Selected(!option4Selected)
        } else {
            setoption1Selected(false)
            setoption2Selected(false)
            setoption3Selected(false)
            setoption4Selected(!option4Selected)
            setoption5Selected(false)
            setoption6Selected(false)
        }
    }

    const onClickSolutionOption5 = (e) => {
        e.stopPropagation()
        seteditOption1(false)
        seteditOption2(false)
        seteditOption3(false)
        seteditOption4(false)
        seteditOption5(!editOption5)
        seteditOption6(false)
    }

    const onClickSelectSolutionOption5 = (e) => {
        e.stopPropagation()
        if (allowMutipleAnswer) {
            setoption5Selected(!option5Selected)
        } else {
            setoption1Selected(false)
            setoption2Selected(false)
            setoption3Selected(false)
            setoption4Selected(false)
            setoption5Selected(!option5Selected)
            setoption6Selected(false)
        }
    }
    const onClickSolutionOption6 = (e) => {
        e.stopPropagation()
        seteditOption1(false)
        seteditOption2(false)
        seteditOption3(false)
        seteditOption4(false)
        seteditOption5(false)
        seteditOption6(!editOption6)
    }

    const onClickSelectSolutionOption6 = (e) => {
        e.stopPropagation()
        if (allowMutipleAnswer) {
            setoption6Selected(!option6Selected)
        } else {
            setoption1Selected(false)
            setoption2Selected(false)
            setoption3Selected(false)
            setoption4Selected(false)
            setoption5Selected(false)
            setoption6Selected(!option6Selected)
        }
    }

    const onClickNext = async () => {
        const optionId1 = uuidv4()
        const optionId2 = uuidv4()
        const optionId3 = uuidv4()
        const optionId4 = uuidv4()
        const optionId5 = uuidv4()
        const optionId6 = uuidv4()

        createQuestionContext.setQuestionName(editorStateForProblem.getCurrentContent().getPlainText('\u0001'));
        createQuestionContext.setQuestionanswersObjectArray([{ optionId: optionId1, option: editorStateForSolution.getCurrentContent().getPlainText('\u0001') }, { optionId: optionId2, option: editorStateForSolution1.getCurrentContent().getPlainText('\u0001') }, { optionId: optionId3, option: editorStateForSolution2.getCurrentContent().getPlainText('\u0001') }, { optionId: optionId4, option: editorStateForSolution3.getCurrentContent().getPlainText('\u0001') }, showFifthSolutionOption && { optionId: optionId5, option: editorStateForSolution4.getCurrentContent().getPlainText('\u0001') }, showSixthSolutionOption && { optionId: optionId5, option: editorStateForSolution5.getCurrentContent().getPlainText('\u0001') }]);
        createQuestionContext.setQuestionCorrectAnswerType(allowMutipleAnswer ? "Yes" : "No")
        createQuestionContext.setcorrectAnswerObjectArray([option1Selected && optionId1, option2Selected && optionId2, option3Selected && optionId3, option4Selected && optionId4, option5Selected && optionId5, option6Selected && optionId6])

        navigate("/questionpreview");

        // console.log(editorStateForSolution.getCurrentContent().getPlainText('\u0001'), "hello2")
    }

    const saveAsDraftQuestion = async () => {
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
                const token = getCookie('Xh7ERL0G')
                const decode = jwtDecode(token)
                let tempArray = [];
                createQuestionContext?.skills?.forEach(element => {
                    const obj = {
                        skills: '',
                        topicId: []
                    }
                    obj.skills = element.skills._id
                    element.topicId.forEach((topicId) => {
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

                setloading(false)
                createQuestionContext.clearQuestion()
                toast.success("Question created successfully.");
                navigate("/library", { state: { library: 'Draft' } });

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

    const onClickBack=()=>{
        const optionId1 = uuidv4()
        const optionId2 = uuidv4()
        const optionId3 = uuidv4()
        const optionId4 = uuidv4()
        const optionId5 = uuidv4()
        const optionId6 = uuidv4()

        createQuestionContext.setQuestionName(editorStateForProblem.getCurrentContent().getPlainText('\u0001'));
        createQuestionContext.setQuestionanswersObjectArray([{ optionId: optionId1, option: editorStateForSolution.getCurrentContent().getPlainText('\u0001') }, { optionId: optionId2, option: editorStateForSolution1.getCurrentContent().getPlainText('\u0001') }, { optionId: optionId3, option: editorStateForSolution2.getCurrentContent().getPlainText('\u0001') }, { optionId: optionId4, option: editorStateForSolution3.getCurrentContent().getPlainText('\u0001') }, showFifthSolutionOption && { optionId: optionId5, option: editorStateForSolution4.getCurrentContent().getPlainText('\u0001') }, showSixthSolutionOption && { optionId: optionId5, option: editorStateForSolution5.getCurrentContent().getPlainText('\u0001') }]);
        createQuestionContext.setQuestionCorrectAnswerType(allowMutipleAnswer ? "Yes" : "No")
        createQuestionContext.setcorrectAnswerObjectArray([option1Selected && optionId1, option2Selected && optionId2, option3Selected && optionId3, option4Selected && optionId4, option5Selected && optionId5, option6Selected && optionId6])
        navigate("/newquestion");
    }

    return (
        <div className="new-question-2-container">
            <NavigationBar saveAsDraft={true} loadingDraft={loading} onClickSaveAsDraft={() => saveAsDraftQuestion()} />
            <div className="question-2-container">
                <QuestionSidebar page="Create Question" step={2} />
                <div className="right-side-container">
                    <div className="right-content">
                        <div className="col">
                            <div className="header">
                                <div className="title">
                                    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="24" cy="24" r="24" fill="#00C49A" fillOpacity="0.1" />
                                        <g clipPath="url(#clip0_1897_1286)">
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
                                        <span>Create Question</span>
                                        <p>Write problem statement and solutions</p>
                                    </div>
                                </div>

                                <div className="button-container">
                                    <div className="next-button" style={{ backgroundColor: "#827C7C" }} onClick={onClickBack}>

                                        <svg width="24" height="20" viewBox="0 0 24 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <circle cx="12" cy="10" r="10" fill="white" />
                                            <path d="M15 4.95853L9 9.61159L15 14.2646" stroke="#827C7C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        <span>Back</span>

                                    </div>
                                    <div className="next-button" style={editorStateForProblem.getCurrentContent().getPlainText('\u0001') == "" || editorStateForSolution.getCurrentContent().getPlainText('\u0001') == 'Answer 1 goes here this is your answer.' || editorStateForSolution.getCurrentContent().getPlainText('\u0001') == '' || editorStateForSolution1.getCurrentContent().getPlainText('\u0001') == 'Option 2' || editorStateForSolution1.getCurrentContent().getPlainText('\u0001') == "" || (showThirdSolutionOption && editorStateForSolution2.getCurrentContent().getPlainText('\u0001') == 'Option 3' || editorStateForSolution2.getCurrentContent().getPlainText('\u0001') == "") || (showFourthSolutionOption && editorStateForSolution3.getCurrentContent().getPlainText('\u0001') == 'Option 4' || editorStateForSolution3.getCurrentContent().getPlainText('\u0001') == "") || (showFifthSolutionOption && editorStateForSolution4.getCurrentContent().getPlainText('\u0001') == 'Option 5' || editorStateForSolution4.getCurrentContent().getPlainText('\u0001') == "") || (showSixthSolutionOption && editorStateForSolution5.getCurrentContent().getPlainText('\u0001') == 'Option 6' || editorStateForSolution5.getCurrentContent().getPlainText('\u0001') == "") ? { backgroundColor: "#D9D9D9" } : {}} onClick={() => { editorStateForProblem.getCurrentContent().getPlainText('\u0001') == "" ? toast.error('Problem statement is empty') : (editorStateForSolution.getCurrentContent().getPlainText('\u0001') == 'Answer 1 goes here this is your answer.' || editorStateForSolution.getCurrentContent().getPlainText('\u0001') == '') ? toast.error('Option 1 is empty') : (editorStateForSolution1.getCurrentContent().getPlainText('\u0001') == 'Option 2' || editorStateForSolution1.getCurrentContent().getPlainText('\u0001') == "") ? toast.error('Option 2 is empty') : (showThirdSolutionOption && editorStateForSolution2.getCurrentContent().getPlainText('\u0001') == 'Option 3' || editorStateForSolution2.getCurrentContent().getPlainText('\u0001') == "") ? toast.error('Option 3 is empty') : (showFourthSolutionOption && editorStateForSolution3.getCurrentContent().getPlainText('\u0001') == 'Option 4' || editorStateForSolution3.getCurrentContent().getPlainText('\u0001') == "") ? toast.error('Option 4 is empty') : (showFifthSolutionOption && editorStateForSolution4.getCurrentContent().getPlainText('\u0001') == 'Option 5' || editorStateForSolution4.getCurrentContent().getPlainText('\u0001') == "") ? toast.error('Option 5 is empty') : (showSixthSolutionOption && editorStateForSolution5.getCurrentContent().getPlainText('\u0001') == 'Option 6' || editorStateForSolution5.getCurrentContent().getPlainText('\u0001') == "") ? toast.error('Option 6 is empty') : onClickNext() }} >

                                        <span>Next</span>
                                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <circle cx="10" cy="10" r="10" fill="white" />
                                            <path d="M8 15.2661L14 10.613L8 5.95996" stroke={editorStateForProblem.getCurrentContent().getPlainText('\u0001') == "" || editorStateForSolution.getCurrentContent().getPlainText('\u0001') == 'Answer 1 goes here this is your answer.' || editorStateForSolution.getCurrentContent().getPlainText('\u0001') == '' || editorStateForSolution1.getCurrentContent().getPlainText('\u0001') == 'Option 2' || editorStateForSolution1.getCurrentContent().getPlainText('\u0001') == "" || (showThirdSolutionOption && editorStateForSolution2.getCurrentContent().getPlainText('\u0001') == 'Option 3' || editorStateForSolution2.getCurrentContent().getPlainText('\u0001') == "") || (showFourthSolutionOption && editorStateForSolution3.getCurrentContent().getPlainText('\u0001') == 'Option 4' || editorStateForSolution3.getCurrentContent().getPlainText('\u0001') == "") || (showFifthSolutionOption && editorStateForSolution4.getCurrentContent().getPlainText('\u0001') == 'Option 5' || editorStateForSolution4.getCurrentContent().getPlainText('\u0001') == "") || (showSixthSolutionOption && editorStateForSolution5.getCurrentContent().getPlainText('\u0001') == 'Option 6' || editorStateForSolution5.getCurrentContent().getPlainText('\u0001') == "") ? "#D9D9D9" : "#00C49A"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>

                                </div>
                            </div>

                            <div className="header-bar"></div>
                        </div>

                        <div className="row">
                            <div className="input-for-problem">
                                <label>Problem Statement</label>
                                <div>
                                    <DraftJsEditor refrencevariable={editorForProblemStatement} editorState={editorStateForProblem} setEditorState={seteditorStateForProblem} />
                                </div>
                            </div>
                        </div>

                        <div className="row2">
                            <div className="input">
                                <div className="head">
                                    <span>Solution</span>
                                    <div className="check">
                                        {allowMutipleAnswer ?
                                            <svg style={{ cursor: 'pointer' }} onClick={() => { setallowMutipleAnswer(false); setoption1Selected(true); setoption2Selected(false); setoption3Selected(false); setoption4Selected(false); setoption5Selected(false) }} width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <rect x="0.015625" width="20" height="20" rx="2" fill="#00C49A" />
                                                <path d="M14.0156 8L8.51562 13.5L6.01562 11" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                            :
                                            <svg style={{ cursor: 'pointer' }} onClick={() => { setallowMutipleAnswer(true) }} width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path fillRule="evenodd" clipRule="evenodd" d="M1 9.57528V5.02983C1 3.77464 1.44378 2.70326 2.33133 1.81571C3.21889 0.928153 4.29026 0.484375 5.54545 0.484375H16.1515C17.4067 0.484375 18.4781 0.928153 19.3656 1.81571C20.2532 2.70326 20.697 3.77464 20.697 5.02983V15.6359C20.697 16.8911 20.2532 17.9625 19.3656 18.85C18.4781 19.7376 17.4067 20.1813 16.1515 20.1813H5.54545C4.29026 20.1813 3.21889 19.7376 2.33133 18.85C1.44378 17.9625 1 16.8911 1 15.6359V9.57528Z" fill="#384455" fillOpacity="0.01" />
                                                <path fillRule="evenodd" clipRule="evenodd" d="M1.75781 8.81795V5.03007C1.75781 3.98407 2.12763 3.09126 2.86726 2.35163C3.60689 1.612 4.4997 1.24219 5.54569 1.24219H16.1518C17.1977 1.24219 18.0906 1.612 18.8302 2.35163C19.5698 3.09126 19.9396 3.98407 19.9396 5.03007V15.6361C19.9396 16.6821 19.5698 17.5749 18.8302 18.3146C18.0906 19.0542 17.1977 19.424 16.1518 19.424H5.54569C4.4997 19.424 3.60689 19.0542 2.86726 18.3146C2.12763 17.5749 1.75781 16.6821 1.75781 15.6361V8.81795Z" stroke="#D9E1E7" strokeWidth="2" strokeLinejoin="round" />
                                            </svg>
                                        }


                                        <span>Allow Multiple Answers</span>
                                    </div>
                                </div>
                                <div className="option-box">
                                    <div className='parent-option-box-container' style={option1Selected ? { border: '1px solid #00C49A' } : { border: '1px solid #DDDDDD' }} >
                                        <div onClick={onClickSolutionOption1} className={option1Selected ? "input-box-active" : "input-box"}>
                                            <div className="left">
                                                {option1Selected ?
                                                    <svg onClick={onClickSelectSolutionOption1} width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <ellipse cx="8.35484" cy="7.57422" rx="7.82164" ry="7.5" fill="#00C49A" />
                                                        <ellipse cx="8.35791" cy="7.57437" rx="2.85791" ry="2.74038" fill="white" />
                                                    </svg>
                                                    :
                                                    <svg onClick={onClickSelectSolutionOption1} width="17" height="15" viewBox="0 0 17 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path fillRule="evenodd" clipRule="evenodd" d="M8.73378 1.15332C6.05176 1.15332 3.63386 2.69958 2.60751 5.07093C1.58117 7.44229 2.14847 10.1717 4.04489 11.9867C5.71627 13.6079 8.16718 14.2476 10.4672 13.6631C12.7671 13.0786 14.5635 11.3593 15.1743 9.15841C15.7851 6.9572 15.1166 4.61176 13.4227 3.01226C12.1819 1.81813 10.4934 1.14881 8.73378 1.15332ZM8.73535 0C13.0636 0 16.5723 3.35787 16.5723 7.5C16.5723 11.6421 13.0636 15 8.73539 15C4.40719 15 0.898474 11.6421 0.898438 7.5C0.898438 3.35787 4.40719 0 8.73539 0H8.73535Z" fill="#A8AAAC" />
                                                    </svg>
                                                }
                                                <span>{editorStateForSolution.getCurrentContent().getPlainText('\u0001').length > 130 ? `${editorStateForSolution.getCurrentContent().getPlainText('\u0001').slice(0, 135)}...` : editorStateForSolution.getCurrentContent().getPlainText('\u0001')}</span>
                                            </div>
                                            {editOption1 ?
                                                <svg onClick={onClickSolutionOption1} style={{ cursor: 'pointer' }} width="26" height="24" viewBox="0 0 26 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M19.6719 15.1367L13.4146 9.32165L7.15726 15.1367" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                                </svg> :
                                                <svg onClick={onClickSolutionOption1} style={{ cursor: 'pointer' }} width="26" height="24" viewBox="0 0 26 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M7.15625 9L13.4136 15L19.6709 9" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            }


                                        </div>
                                        {editOption1 &&
                                            <DraftJsEditor refrencevariable={editorForSolutionOption} editorState={editorStateForSolution} setEditorState={seteditorStateForSolution} />
                                        }

                                    </div>

                                    <div className='parent-option-box-container' style={option2Selected ? { border: '1px solid #00C49A' } : { border: '1px solid #DDDDDD' }} >
                                        <div onClick={onClickSolutionOption2} className={option2Selected ? "input-box-active" : "input-box"}>
                                            <div className="left">
                                                {option2Selected ?
                                                    <svg onClick={onClickSelectSolutionOption2} width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <ellipse cx="8.35484" cy="7.57422" rx="7.82164" ry="7.5" fill="#00C49A" />
                                                        <ellipse cx="8.35791" cy="7.57437" rx="2.85791" ry="2.74038" fill="white" />
                                                    </svg>
                                                    :
                                                    <svg onClick={onClickSelectSolutionOption2} width="17" height="15" viewBox="0 0 17 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path fillRule="evenodd" clipRule="evenodd" d="M8.73378 1.15332C6.05176 1.15332 3.63386 2.69958 2.60751 5.07093C1.58117 7.44229 2.14847 10.1717 4.04489 11.9867C5.71627 13.6079 8.16718 14.2476 10.4672 13.6631C12.7671 13.0786 14.5635 11.3593 15.1743 9.15841C15.7851 6.9572 15.1166 4.61176 13.4227 3.01226C12.1819 1.81813 10.4934 1.14881 8.73378 1.15332ZM8.73535 0C13.0636 0 16.5723 3.35787 16.5723 7.5C16.5723 11.6421 13.0636 15 8.73539 15C4.40719 15 0.898474 11.6421 0.898438 7.5C0.898438 3.35787 4.40719 0 8.73539 0H8.73535Z" fill="#A8AAAC" />
                                                    </svg>
                                                }
                                                <span>{editorStateForSolution1.getCurrentContent().getPlainText('\u0001').length > 130 ? `${editorStateForSolution1.getCurrentContent().getPlainText('\u0001').slice(0, 135)}...` : editorStateForSolution1.getCurrentContent().getPlainText('\u0001')}</span>
                                            </div>

                                            {editOption2 ?
                                                <svg onClick={onClickSolutionOption2} style={{ cursor: 'pointer' }} width="26" height="24" viewBox="0 0 26 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M19.6719 15.1367L13.4146 9.32165L7.15726 15.1367" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                                </svg> :
                                                <svg onClick={onClickSolutionOption2} style={{ cursor: 'pointer' }} width="26" height="24" viewBox="0 0 26 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M7.15625 9L13.4136 15L19.6709 9" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            }


                                        </div>
                                        {editOption2 &&
                                            <DraftJsEditor refrencevariable={editorForSolutionOption} editorState={editorStateForSolution1} setEditorState={seteditorStateForSolution1} />
                                        }
                                    </div>
                                    {showThirdSolutionOption &&
                                        <div className='parent-option-box-container' style={option3Selected ? { border: '1px solid #00C49A' } : { border: '1px solid #DDDDDD' }} >
                                            <div onClick={onClickSolutionOption3} className={option3Selected ? "input-box-active" : "input-box"}>
                                                <div className="left">
                                                    {option3Selected ?
                                                        <svg onClick={onClickSelectSolutionOption3} width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <ellipse cx="8.35484" cy="7.57422" rx="7.82164" ry="7.5" fill="#00C49A" />
                                                            <ellipse cx="8.35791" cy="7.57437" rx="2.85791" ry="2.74038" fill="white" />
                                                        </svg>
                                                        :
                                                        <svg onClick={onClickSelectSolutionOption3} width="17" height="15" viewBox="0 0 17 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path fillRule="evenodd" clipRule="evenodd" d="M8.73378 1.15332C6.05176 1.15332 3.63386 2.69958 2.60751 5.07093C1.58117 7.44229 2.14847 10.1717 4.04489 11.9867C5.71627 13.6079 8.16718 14.2476 10.4672 13.6631C12.7671 13.0786 14.5635 11.3593 15.1743 9.15841C15.7851 6.9572 15.1166 4.61176 13.4227 3.01226C12.1819 1.81813 10.4934 1.14881 8.73378 1.15332ZM8.73535 0C13.0636 0 16.5723 3.35787 16.5723 7.5C16.5723 11.6421 13.0636 15 8.73539 15C4.40719 15 0.898474 11.6421 0.898438 7.5C0.898438 3.35787 4.40719 0 8.73539 0H8.73535Z" fill="#A8AAAC" />
                                                        </svg>
                                                    }
                                                    <span>{editorStateForSolution2.getCurrentContent().getPlainText('\u0001').length > 130 ? `${editorStateForSolution2.getCurrentContent().getPlainText('\u0001').slice(0, 135)}...` : editorStateForSolution2.getCurrentContent().getPlainText('\u0001')}</span>
                                                </div>
                                                {showThirdSolutionOption && <label onClick={() => setshowThirdSolutionOption(false)} style={{ cursor: 'pointer' }} >Remove</label>
                                                }
                                                {editOption3 ?
                                                    <svg onClick={onClickSolutionOption3} style={{ cursor: 'pointer' }} width="26" height="24" viewBox="0 0 26 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M19.6719 15.1367L13.4146 9.32165L7.15726 15.1367" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                                    </svg> :
                                                    <svg onClick={onClickSolutionOption3} style={{ cursor: 'pointer' }} width="26" height="24" viewBox="0 0 26 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M7.15625 9L13.4136 15L19.6709 9" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                }


                                            </div>
                                            {editOption3 &&
                                                <DraftJsEditor refrencevariable={editorForSolutionOption} editorState={editorStateForSolution2} setEditorState={seteditorStateForSolution2} />
                                            }
                                        </div>}
                                    {showFourthSolutionOption &&
                                        <div onClick={onClickSolutionOption4} className='parent-option-box-container' style={option4Selected ? { border: '1px solid #00C49A' } : { border: '1px solid #DDDDDD' }} >
                                            <div className={option4Selected ? "input-box-active" : "input-box"}>
                                                <div className="left">
                                                    {option4Selected ?
                                                        <svg onClick={onClickSelectSolutionOption4} width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <ellipse cx="8.35484" cy="7.57422" rx="7.82164" ry="7.5" fill="#00C49A" />
                                                            <ellipse cx="8.35791" cy="7.57437" rx="2.85791" ry="2.74038" fill="white" />
                                                        </svg>
                                                        :
                                                        <svg onClick={onClickSelectSolutionOption4} width="17" height="15" viewBox="0 0 17 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path fillRule="evenodd" clipRule="evenodd" d="M8.73378 1.15332C6.05176 1.15332 3.63386 2.69958 2.60751 5.07093C1.58117 7.44229 2.14847 10.1717 4.04489 11.9867C5.71627 13.6079 8.16718 14.2476 10.4672 13.6631C12.7671 13.0786 14.5635 11.3593 15.1743 9.15841C15.7851 6.9572 15.1166 4.61176 13.4227 3.01226C12.1819 1.81813 10.4934 1.14881 8.73378 1.15332ZM8.73535 0C13.0636 0 16.5723 3.35787 16.5723 7.5C16.5723 11.6421 13.0636 15 8.73539 15C4.40719 15 0.898474 11.6421 0.898438 7.5C0.898438 3.35787 4.40719 0 8.73539 0H8.73535Z" fill="#A8AAAC" />
                                                        </svg>
                                                    }
                                                    <span>{editorStateForSolution3.getCurrentContent().getPlainText('\u0001').length > 130 ? `${editorStateForSolution3.getCurrentContent().getPlainText('\u0001').slice(0, 135)}...` : editorStateForSolution3.getCurrentContent().getPlainText('\u0001')}</span>
                                                </div>
                                                {showFourthSolutionOption && <label onClick={() => setshowFourthSolutionOption(false)} style={{ cursor: 'pointer' }} >Remove</label>
                                                }
                                                {editOption4 ?
                                                    <svg onClick={onClickSolutionOption4} style={{ cursor: 'pointer' }} width="26" height="24" viewBox="0 0 26 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M19.6719 15.1367L13.4146 9.32165L7.15726 15.1367" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                                    </svg> :
                                                    <svg onClick={onClickSolutionOption4} style={{ cursor: 'pointer' }} width="26" height="24" viewBox="0 0 26 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M7.15625 9L13.4136 15L19.6709 9" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                }


                                            </div>
                                            {editOption4 &&
                                                <DraftJsEditor refrencevariable={editorForSolutionOption} editorState={editorStateForSolution3} setEditorState={seteditorStateForSolution3} />
                                            }
                                        </div>
                                    }
                                    {showFifthSolutionOption &&
                                        <div onClick={onClickSolutionOption5} className='parent-option-box-container' style={option5Selected ? { border: '1px solid #00C49A' } : { border: '1px solid #DDDDDD' }} >
                                            <div className={option5Selected ? "input-box-active" : "input-box"}>
                                                <div className="left">
                                                    {option5Selected ?
                                                        <svg onClick={onClickSelectSolutionOption5} width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <ellipse cx="8.35484" cy="7.57422" rx="7.82164" ry="7.5" fill="#00C49A" />
                                                            <ellipse cx="8.35791" cy="7.57437" rx="2.85791" ry="2.74038" fill="white" />
                                                        </svg>
                                                        :
                                                        <svg onClick={onClickSelectSolutionOption5} width="17" height="15" viewBox="0 0 17 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path fillRule="evenodd" clipRule="evenodd" d="M8.73378 1.15332C6.05176 1.15332 3.63386 2.69958 2.60751 5.07093C1.58117 7.44229 2.14847 10.1717 4.04489 11.9867C5.71627 13.6079 8.16718 14.2476 10.4672 13.6631C12.7671 13.0786 14.5635 11.3593 15.1743 9.15841C15.7851 6.9572 15.1166 4.61176 13.4227 3.01226C12.1819 1.81813 10.4934 1.14881 8.73378 1.15332ZM8.73535 0C13.0636 0 16.5723 3.35787 16.5723 7.5C16.5723 11.6421 13.0636 15 8.73539 15C4.40719 15 0.898474 11.6421 0.898438 7.5C0.898438 3.35787 4.40719 0 8.73539 0H8.73535Z" fill="#A8AAAC" />
                                                        </svg>
                                                    }
                                                    <span>{editorStateForSolution4.getCurrentContent().getPlainText('\u0001').length > 130 ? `${editorStateForSolution4.getCurrentContent().getPlainText('\u0001').slice(0, 135)}...` : editorStateForSolution4.getCurrentContent().getPlainText('\u0001')}</span>
                                                </div>
                                                {showFifthSolutionOption && <label onClick={() => setshowFifthSolutionOption(false)} style={{ cursor: 'pointer' }} >Remove</label>
                                                }
                                                {editOption5 ?
                                                    <svg onClick={onClickSolutionOption5} style={{ cursor: 'pointer' }} width="26" height="24" viewBox="0 0 26 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M19.6719 15.1367L13.4146 9.32165L7.15726 15.1367" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                                    </svg> :
                                                    <svg onClick={onClickSolutionOption5} style={{ cursor: 'pointer' }} width="26" height="24" viewBox="0 0 26 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M7.15625 9L13.4136 15L19.6709 9" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                }


                                            </div>
                                            {editOption5 &&
                                                <DraftJsEditor refrencevariable={editorForSolutionOption} editorState={editorStateForSolution4} setEditorState={seteditorStateForSolution4} />
                                            }
                                        </div>
                                    }
                                    {showSixthSolutionOption &&
                                        <div onClick={onClickSolutionOption6} className='parent-option-box-container' style={option6Selected ? { border: '1px solid #00C49A' } : { border: '1px solid #DDDDDD' }} >
                                            <div className={option6Selected ? "input-box-active" : "input-box"}>
                                                <div className="left">
                                                    {option6Selected ?
                                                        <svg onClick={onClickSelectSolutionOption6} width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <ellipse cx="8.35484" cy="7.57422" rx="7.82164" ry="7.5" fill="#00C49A" />
                                                            <ellipse cx="8.35791" cy="7.57437" rx="2.85791" ry="2.74038" fill="white" />
                                                        </svg>
                                                        :
                                                        <svg onClick={onClickSelectSolutionOption6} width="17" height="15" viewBox="0 0 17 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path fillRule="evenodd" clipRule="evenodd" d="M8.73378 1.15332C6.05176 1.15332 3.63386 2.69958 2.60751 5.07093C1.58117 7.44229 2.14847 10.1717 4.04489 11.9867C5.71627 13.6079 8.16718 14.2476 10.4672 13.6631C12.7671 13.0786 14.5635 11.3593 15.1743 9.15841C15.7851 6.9572 15.1166 4.61176 13.4227 3.01226C12.1819 1.81813 10.4934 1.14881 8.73378 1.15332ZM8.73535 0C13.0636 0 16.5723 3.35787 16.5723 7.5C16.5723 11.6421 13.0636 15 8.73539 15C4.40719 15 0.898474 11.6421 0.898438 7.5C0.898438 3.35787 4.40719 0 8.73539 0H8.73535Z" fill="#A8AAAC" />
                                                        </svg>
                                                    }
                                                    <span>{editorStateForSolution5.getCurrentContent().getPlainText('\u0001').length > 130 ? `${editorStateForSolution5.getCurrentContent().getPlainText('\u0001').slice(0, 135)}...` : editorStateForSolution5.getCurrentContent().getPlainText('\u0001')}</span>
                                                </div>
                                                {showSixthSolutionOption && <label onClick={() => setshowSixthSolutionOption(false)} style={{ cursor: 'pointer' }} >Remove</label>
                                                }
                                                {editOption6 ?
                                                    <svg onClick={onClickSolutionOption6} style={{ cursor: 'pointer' }} width="26" height="24" viewBox="0 0 26 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M19.6719 15.1367L13.4146 9.32165L7.15726 15.1367" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                                    </svg> :
                                                    <svg onClick={onClickSolutionOption6} style={{ cursor: 'pointer' }} width="26" height="24" viewBox="0 0 26 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M7.15625 9L13.4136 15L19.6709 9" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                }


                                            </div>
                                            {editOption6 &&
                                                <DraftJsEditor refrencevariable={editorForSolutionOption} editorState={editorStateForSolution5} setEditorState={seteditorStateForSolution5} />
                                            }
                                        </div>
                                    }



                                    <div onClick={() => { showThirdSolutionOption ? showFourthSolutionOption ? showFifthSolutionOption ? showSixthSolutionOption ? toast("Only 6 options are allowed!") : setshowSixthSolutionOption(true) : setshowFifthSolutionOption(true) : setshowFourthSolutionOption(true) : setshowThirdSolutionOption(true) }} className="next-button">

                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M8 3.33301V12.6663" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M3.33398 8H12.6673" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        <span>New field</span>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div >
    );
};



export default CreateQuestion;