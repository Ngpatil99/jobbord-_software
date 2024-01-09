import React, { useContext, useEffect, useState, useRef, useCallback } from "react"
import axios from 'axios'
import { toast } from 'react-toastify'
import jwtDecode from "jwt-decode";
import { Editor, EditorState, ContentState, RichUtils, getDefaultKeyBinding } from 'draft-js';
import { v4 as uuidv4 } from 'uuid'
import { useNavigate } from 'react-router-dom'
import { backend_url, getCookie } from '../../constant'
import BulkImportedLeftPanel from "../../component/BulkImportedLeftPanel"
import NavigationBar from "../../component/NavigationBar/NavigationBar"
import MCQBulkContext from '../../store/MCQBulkContext'
import DeletePopupModel from "../../component/DeletePopupModel/DeletePopupModel";
import './index.css';
import './draft.css'
import './example.css'
import './rich-editor.css'
import AddedLibraryModel from "../../component/AddedLibraryModel";
import SunEditor from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css';
import katex from 'katex'
import 'katex/dist/katex.min.css'

const CancelToken = axios.CancelToken
let cancel;

const BulkImported = () => {
    const navigate = useNavigate()
    const BulkContext = useContext(MCQBulkContext)
    const [deleteQuestionModel, setdeleteQuestionModel] = useState(false)
    const [selectQuestionForDelete, setselectQuestionForDelete] = useState("")
    const [question, setquestion] = useState({})
    const [sectionHeader, setsectionHeader] = useState("")
    const [difficultyLevel, setdifficultyLevel] = useState("")
    const [answerObj, setanswerObj] = useState([])
    const [correctObj, setcorrectObj] = useState([])
    const [score, setscore] = useState("")
    const [correctAnswerType, setcorrectAnswerType] = useState("")
    const [skills, setskills] = useState([])
    const [topics, settopics] = useState([])
    const [editorState, setEditorState] = useState(EditorState.createEmpty());
    const [displayaddedlibrary, setdisplayaddedlibrary] = useState(false)
    const [loading, setloading] = useState(false)
    const [refresh, setrefresh] = useState({})
    const [skillSearchText, setskillSearchText] = useState("")
    const [searchSkillData, setsearchSkillData] = useState([])
    const [topicSearchText, settopicSearchText] = useState("")
    const [searchTopicData, setsearchTopicData] = useState([])
    const [moveToLibraryIndex, setmoveToLibraryIndex] = useState("")
    const editor = useRef(null);
    const [checked, setchecked] = useState(false)
    const [isTestScore, setisTestScore] = useState(false)
    const [editorContent, setEditorContent] = useState('')
    const [questionEditorFocused, setQuestionEditorFocused] = useState(false)
    const [richText, setRichText] = useState(false)
    const [focusedEditor, setFocusedEditor] = useState({
        isFocused: false,
        no: null
    })

    const onChangeToggle = (e) => {
        e.target.checked ? setcorrectAnswerType("Yes") : setcorrectAnswerType("No")
        correctObj.length = 0;
        setchecked(e.target.checked);
    }
    const focus = () => {
        if (editor.current) editor.current.focus();
    };

    const handleKeyCommand = useCallback(
        (command, editorState) => {
            const newState = RichUtils.handleKeyCommand(editorState, command);
            if (newState) {
                setEditorState(newState);
                return 'handled';
            }
            return 'not-handled';
        },
        [editorState, setEditorState],
    );

    const mapKeyToEditorCommand = useCallback(
        e => {
            switch (e.keyCode) {

                case 9: // TAB
                    const newEditorState = RichUtils.onTab(
                        e,
                        editorState,
                        4 /* maxDepth */,
                    );
                    if (newEditorState !== editorState) {
                        setEditorState(newEditorState);
                    }
                    return null;
            }
            return getDefaultKeyBinding(e);
        },
        [editorState, setEditorState],
    );

    // If the user changes block type before entering any text, we can
    // either style the placeholder or hide it. Let's just hide it now.
    let className = 'RichEditor-editor';
    var contentState = editorState.getCurrentContent();
    if (!contentState.hasText()) {
        if (
            contentState
                .getBlockMap()
                .first()
                .getType() !== 'unstyled'
        ) {
            className += ' RichEditor-hidePlaceholder';
        }
    }

    const addNewOption = () => {
        const optionId = uuidv4()
        if (answerObj.length < 6) {
            setanswerObj(prev => [...prev, answerObj.includes(`option ${answerObj.length + 1}`) ? { optionId: optionId, option: "", html: "", images: [] } : { option: "", optionId: optionId, html: "", images: [] }])
        } else {
            toast.error('only 6 solution are allowed')
        }
    }

    useEffect(() => {
        BulkContext.mcqBulkData.forEach((element) => {
            if (element.moveToLibraryStatus === "false") {
                if (element._id === BulkContext.previewQuestion) {
                    setEditorContent(element.html === undefined ? element.question : element.html)
                    setquestion(element)
                    setsectionHeader(element.Section_header)
                    setdifficultyLevel(element.difficultyLevelId.level)
                    setanswerObj(element.answersObjectArray)
                    setcorrectAnswerType(element.correctAnswerType)
                    setchecked(element.correctAnswerType === "Yes" ? true : false)
                    setcorrectObj(element.correctAnswerObjectArray)
                    setscore(element.score)
                    setskills(element.skillsId)
                    const filterTopics = element.topicId.filter(topicsData => topicsData?.topic !== null)
                    settopics(filterTopics)
                    // element.topicId.forEach(topicsData => {
                    //     settopics(prev => [...prev, topicsData])
                    // })
                    // element.skillsId.forEach((data) => {
                    //     data.topicId.forEach((topic) => {
                    //         settopics(prev => [...prev, topic])
                    //     })
                    // })
                }
            }
            // else {
            //     if (element._id === BulkContext.previewQuestion) {
            //         toast("You have already added that question to library!")
            //     }
            // }
        })
    }, [BulkContext.previewQuestion])


    const deleteQuestionAsPerQuestionID = async (questionID) => {
        try {
            // BulkContext.readDataFromS3(filterDeleteData)
            BulkContext.mcqBulkData.forEach((element) => {
                if (element._id === BulkContext.previewQuestion) {
                    setquestion(element)
                }
            })
            BulkContext.mcqBulkData.forEach((element) => {
                if (element._id === questionID) {
                    element.isQuestionDeleted = "true"
                }
            })
            const filterDeleteData = BulkContext?.mcqBulkData.filter(data => data.isQuestionDeleted !== "true" && data.moveToLibraryStatus !== "true")
            filterDeleteData.length ? BulkContext.selectpreviewQuestion(filterDeleteData[0]?._id) : setquestion({})


            const token = getCookie("Xh7ERL0G")
            await axios.post(`${backend_url}mcqbulkupload/deleteQuestion/${questionID}`, { token: token })
            toast('Question Deleted from Library')
        } catch (error) {
            toast(error)
        }
    }

    const uploadImageToS3 = async (files) => {
        try {
            const token = getCookie("Xh7ERL0G")

            const uploadURL = await axios.get(`${backend_url}S3Url`, { headers: { "token": token } })
            await axios.request({
                method: "PUT",
                headers: {
                    "Content-Type": files[0].type
                },
                url: uploadURL.data.uploadURL,
                data: files[0],
            })
            const imageURL = uploadURL.data.uploadURL.split('?')[0]
            return imageURL
        } catch (error) {
            console.log(error)
        }
    }

    const extractPlainText = (html) => {
        const tempElement = document.createElement('div');
        tempElement.innerHTML = html;
        return tempElement.textContent || tempElement.innerText || '';
    };

    const addQuestionToLibrary = async () => {
        setloading(true)
        try {
            let isSolutionAnswerEmpty = false;
            answerObj.forEach(data => {
                if (data?.option === "") {
                    isSolutionAnswerEmpty = true
                }
            })
            if (isSolutionAnswerEmpty) {
                toast("Please enter solution anwser")
                setloading(false)
            } else if (question === "") {
                toast("please enter problem field!")
                setloading(false)
            } else if (sectionHeader === "") {
                toast("please question title  field!")
                setloading(false)
            } else if (score === "" || score === "0" || score < 0 || /^0+$|^0*-0+$/.test(score)) {
                toast("please enter score field!")
                setloading(false)
            } else if (skills.length === 0) {
                toast("please add atleast one skill!")
                setloading(false)
            } else if (correctObj.length === 0) {
                toast("please select atleast one solution!")
                setloading(false)
            } else {
                const token = getCookie("Xh7ERL0G")
                const decode = jwtDecode(token)
                let tempArray = [];
                skills.forEach(element => {
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
                const topicsData1 = topics?.map(element => { return element._id })

                let difficultyLevelID;

                if (difficultyLevel === "easy") {
                    difficultyLevelID = "641bd41c8782fdd946db740b"
                }
                if (difficultyLevel === "medium") {
                    difficultyLevelID = "641bf53ce012709b89e6c2cc"
                }
                if (difficultyLevel === "hard") {
                    difficultyLevelID = "641bf5c1e012709b89e6c2d2"
                }
                await axios.post(`${backend_url}question/createSingleQuestionForMCQBulk`, {
                    id: question._id,
                    question: extractPlainText(editorContent),
                    answersObjectArray: answerObj,
                    correctAnswerObjectArray: correctObj,
                    Section_header: sectionHeader,
                    approved: `Approved By ${decode.fullName}`,
                    token: token,
                    type: question.type,
                    createdBy: question.createdBy,
                    clientId: question.clientId,
                    correctAnswerType: correctAnswerType,
                    difficultyLevelId: difficultyLevelID,
                    topicId: topicsData1,
                    skillsId: tempArray,
                    score: score,
                    status: 'complete',
                    html: editorContent
                })
                BulkContext.mcqBulkData.map((element, index) => {

                    if (BulkContext.previewQuestion?.includes(element?._id)) {
                        element.moveToLibraryStatus = "true"
                        setmoveToLibraryIndex(question.questionIndex)
                        BulkContext.selectpreviewQuestion(BulkContext.mcqBulkData[index + 1]._id)
                    }
                })
                setloading(false)
                setdisplayaddedlibrary(true)
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

    // const questionIndex = () => {
    //     const filterDeleteData = BulkContext?.mcqBulkData.map((data, index) => { if (data._id === question._id) { return index + 1 } else { return null } })
    //     const index = filterDeleteData?.filter(element => element != null)
    //     return index[0]

    // }

    const changeCorrectAnswer = async (e, editedIndex) => {
        if (correctAnswerType === "Yes") {
            const itemIndex = correctObj.findIndex(o => { return (o) === (editedIndex) });
            if (itemIndex > -1) {
                correctObj.splice(itemIndex, 1)
            } else {
                correctObj.push(`${editedIndex}`)
            }
        } else {
            const itemIndex = correctObj.findIndex(o => { return (o) === (editedIndex) });
            if (itemIndex > -1) {
                correctObj.splice(itemIndex, 1)
            } else {
                correctObj[0] = (editedIndex)

            }
        }


        setrefresh({})

    }

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
        let skillArray = skills.map(function (item) { return item?.skills.skills });

        if (!skillArray?.includes(skillName.skills)) {
            const obj = {
                skills: {},
                topicId: []
            }
            obj.skills = skillName
            skillName.topics.map((topicId) => {
                settopics(prev => [...prev, topicId?.topicId])
                obj.topicId.push(topicId?.topicId)
            })
            setskills(prev => [...prev, obj])
            searchSkillData.length = 0;
        } else {
            toast("You have added already that skill", {
                className: 'toast-message'
            })
        }


    }

    const addSearchedTopics = (topicName) => {
        let topicsArray = topics.map(function (item) { return item.topic });

        if (!topicsArray?.includes(topicName.topic)) {
            settopics(prev => [...prev, topicName])
            searchTopicData.length = 0;
        } else {
            toast("You have added already that skill", {
                className: 'toast-message'
            })
        }


    }

    const removeSkill = (skillId) => {
        const filterSkillData = skills.filter(element => element.skills._id !== skillId)
        //topics.length = 0;
        // filterSkillData.forEach((data) => {
        //     data.topicId.forEach((topic) => {
        //         settopics(prev => [...prev, topic])
        //     })
        // })
        setskills(filterSkillData)
        toast("skill is removed...")
    }
    const removeTopic = (topicId) => {
        // skills.forEach((data, index1) => {
        //     data.topicId.forEach((topic, index2) => {
        //         if (topic._id === topicId) {
        //             skills[index1].topicId.splice(index2, 1)
        //             if (data.topicId.length === 0) {
        //                 skills.splice(index1, 1)
        //             }
        //         }
        //     })
        // })
        const filterTopicData = topics.filter(element => element._id !== topicId)
        settopics(filterTopicData)
        toast("topic is removed...")
    }

    const onClickMoveToLibrary = () => {
        if (question.moveToLibraryStatus === "false") {
            addQuestionToLibrary()
        } else {
            toast("Already move to library")
        }
    }

    const onChangeTestScore = (e) => {
        setscore(e.target.value.slice(0, 3))
        if (e.target.value === '' || e.target.value === '0' || parseInt(e.target.value) < 0 || /^0+$|^0*-0+$/.test(e.target.value)) {
            setisTestScore(true)
        } else {
            setisTestScore(false)
        }
    }

    const manageEditedQuestionState = () => {
        BulkContext.mcqBulkData.forEach((element) => {
            if (element.moveToLibraryStatus === "false") {

                if (element._id === BulkContext.previewQuestion) {

                    element.question = extractPlainText(editorContent)
                    element.Section_header = sectionHeader
                    element.difficultyLevelId.level = difficultyLevel
                    element.answersObjectArray = answerObj
                    element.correctAnswerType = correctAnswerType
                    element.correctAnswerType = checked ? "Yes" : "No"
                    element.correctAnswerObjectArray = correctObj
                    element.score = score
                    element.skillsId = skills
                    element.topicId = topics
                    element.html = editorContent

                }

            }

            // else {
            //     if (element._id === BulkContext.previewQuestion) {
            //         toast("You have already added that question to library!")
            //     }
            // }
        })
        setrefresh({})
    }

    const handleChange = (content) => {
        setEditorContent(content)
    }

    function onImageUploadBefore(files, info, uploadHandler) {
        const handleImageUpload = async () => {
            try {

                const imageURL = await uploadImageToS3(files);


                const response = {
                    "result": [
                        {
                            "url": imageURL,
                            "name": files[0].name,
                            "size": files[0].size
                        }
                    ]
                };

                uploadHandler(response);
            } catch (error) {
                console.error('Error uploading image:', error);
            }
        };


        handleImageUpload();
    }

    function onVideoUploadBefore(files, info, uploadHandler) {
        const handleVideoUpload = async () => {
            try {
                const videoURL = await uploadImageToS3(files);

                const response = {
                    "result": [
                        {
                            "url": videoURL,
                            "name": files[0].name,
                            "size": files[0].size
                        }
                    ]
                };

                uploadHandler(response);
            } catch (error) {
                console.error('Error uploading image:', error);
            }
        };


        handleVideoUpload();
    }

    const handleEditorFocus = () => {
        setQuestionEditorFocused(true)
    };

    const handleEditorBlur = () => {
        setQuestionEditorFocused(false)
    };

    const handleAnswerOnChange = (index, content) => {
        if (index === 0) {
            modifyAnswerObject(index, extractPlainText(content), content, [])
        } else if (index === 1) {
            modifyAnswerObject(index, extractPlainText(content), content, [])
        } else if (index === 2) {
            modifyAnswerObject(index, extractPlainText(content), content, [])
        } else if (index === 3) {
            modifyAnswerObject(index, extractPlainText(content), content, [])
        } else if (index === 4) {
            modifyAnswerObject(index, extractPlainText(content), content, [])
        } else if (index === 5) {
            modifyAnswerObject(index, extractPlainText(content), content, [])
        }
    }

    const modifyAnswerObject = (index, option, html, images) => {
        setanswerObj(prevState => {
            const updatedArray = [...prevState];

            updatedArray[index] = {
                ...updatedArray[index],
                option: option,
                html: html,
                images: images
            };
            return updatedArray;
        });
    };

    function onAnsImageUploadBefore(index, files, info, uploadHandler) {

        const handleImageUpload = async () => {
            try {
                const imageURL = await uploadImageToS3(files);

                const response = {
                    result: [
                        {
                            url: imageURL,
                            name: files[0].name,
                            size: files[0].size
                        }
                    ]
                };

                uploadHandler(response);
            } catch (error) {
                console.error('Error uploading image:', error);
            }
        };

        handleImageUpload();
    }

    function onAnsVideoUploadBefore(index, files, info, uploadHandler) {

        const handleVideoUpload = async () => {
            try {
                const videoURL = await uploadImageToS3(files);

                const response = {
                    result: [
                        {
                            url: videoURL,
                            name: files[0].name,
                            size: files[0].size
                        }
                    ]
                };

                uploadHandler(response);
            } catch (error) {
                console.error('Error uploading image:', error);
            }
        };

        handleVideoUpload();
    }

    const handleAnsEditorFocus = (index) => {
        setFocusedEditor({
            isFocused: true,
            no: index
        })
    };

    const handleAnsEditorBlur = () => {
        setFocusedEditor({
            isFocused: false,
            no: null
        })
    };

    const removeAnwserObject = (optionId) => {
        if (answerObj.length === 2) {
            return toast.error("At least two options are mandatory.");
        }
        const newAnwserObject = answerObj.filter((data) => data.optionId !== optionId);
        const newCorrectAnsObject = correctObj.filter((data) => data !== optionId);
        setanswerObj(newAnwserObject);
        setcorrectObj(newCorrectAnsObject);
    }

    const handleRichText = () => {
        setRichText(!richText)
    }


    return (
        <>
            <NavigationBar preview={true} onClickPreviewAll={() => manageEditedQuestionState()} />
            <div className="bulk-imported-main-container" >
                {displayaddedlibrary &&
                    <AddedLibraryModel onclickModelOutside={() => setdisplayaddedlibrary(!displayaddedlibrary)} selectIndex={moveToLibraryIndex + 1} setdisplayaddedlibrary={() => { setdisplayaddedlibrary(!displayaddedlibrary); }} />

                }
                {deleteQuestionModel && <DeletePopupModel sectionHeader={sectionHeader} questionNo={question.questionIndex} cancelButton={() => setdeleteQuestionModel(false)} yesButton={() => { deleteQuestionAsPerQuestionID(selectQuestionForDelete); setdeleteQuestionModel(false) }} />
                }
                <BulkImportedLeftPanel onClickBackNextSelect={() => manageEditedQuestionState()} />
                {question !== null && Object.keys(question).length ?
                    <div className="preview-question-card-container" >
                        <div className="preview-card" >
                            <div className="header" >
                                <div className="logo-header-container" >
                                    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="24" cy="24" r="24" fill="#00C49A" fill-opacity="0.1" />
                                        <g clip-path="url(#clip0_2071_2762)">
                                            <path d="M33.444 16.833H15.5551C15.2162 16.833 14.8912 16.9676 14.6516 17.2073C14.412 17.4469 14.2773 17.7719 14.2773 18.1108V30.8886C14.2773 31.2275 14.412 31.5525 14.6516 31.7921C14.8912 32.0317 15.2162 32.1663 15.5551 32.1663H33.444C33.7829 32.1663 34.1079 32.0317 34.3475 31.7921C34.5872 31.5525 34.7218 31.2275 34.7218 30.8886V18.1108C34.7218 17.7719 34.5872 17.4469 34.3475 17.2073C34.1079 16.9676 33.7829 16.833 33.444 16.833ZM33.444 30.8886H15.5551V18.1108H33.444V30.8886Z" fill="#00C49A" />
                                            <path d="M18.7483 21.9448H30.2483C30.4177 21.9448 30.5802 21.8775 30.7 21.7576C30.8198 21.6378 30.8872 21.4753 30.8872 21.3059C30.8872 21.1364 30.8198 20.9739 30.7 20.8541C30.5802 20.7343 30.4177 20.667 30.2483 20.667H18.7483C18.5788 20.667 18.4163 20.7343 18.2965 20.8541C18.1767 20.9739 18.1094 21.1364 18.1094 21.3059C18.1094 21.4753 18.1767 21.6378 18.2965 21.7576C18.4163 21.8775 18.5788 21.9448 18.7483 21.9448Z" fill="#00C49A" />
                                            <path d="M18.7483 24.5004H30.2483C30.4177 24.5004 30.5802 24.4331 30.7 24.3133C30.8198 24.1935 30.8872 24.031 30.8872 23.8615C30.8872 23.6921 30.8198 23.5296 30.7 23.4098C30.5802 23.29 30.4177 23.2227 30.2483 23.2227H18.7483C18.5788 23.2227 18.4163 23.29 18.2965 23.4098C18.1767 23.5296 18.1094 23.6921 18.1094 23.8615C18.1094 24.031 18.1767 24.1935 18.2965 24.3133C18.4163 24.4331 18.5788 24.5004 18.7483 24.5004Z" fill="#00C49A" />
                                            <path d="M18.7483 27.0551H25.1372C25.3066 27.0551 25.4691 26.9878 25.5889 26.868C25.7087 26.7482 25.776 26.5857 25.776 26.4162C25.776 26.2468 25.7087 26.0843 25.5889 25.9645C25.4691 25.8447 25.3066 25.7773 25.1372 25.7773H18.7483C18.5788 25.7773 18.4163 25.8447 18.2965 25.9645C18.1767 26.0843 18.1094 26.2468 18.1094 26.4162C18.1094 26.5857 18.1767 26.7482 18.2965 26.868C18.4163 26.9878 18.5788 27.0551 18.7483 27.0551Z" fill="#00C49A" />
                                        </g>
                                        <defs>
                                            <clipPath id="clip0_2071_2762">
                                                <rect width="23" height="23" fill="white" transform="translate(13 13)" />
                                            </clipPath>
                                        </defs>
                                    </svg>

                                    <div>
                                        <label>Preview Question {question.questionIndex + 1}</label>
                                        <span>Check all question field or edit them</span>
                                    </div>
                                </div>

                                <div className="delete-and-library-button-container" >
                                    <button onClick={() => { setdeleteQuestionModel(!deleteQuestionModel); setselectQuestionForDelete(question?._id) }} >

                                        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <ellipse cx="11.0331" cy="10.86" rx="10.8612" ry="10.86" fill="white" />
                                            <path d="M5.75 7.5H6.91667H16.25" stroke="#FF6812" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                            <path d="M15.0846 7.50033V15.667C15.0846 15.9764 14.9617 16.2732 14.7429 16.492C14.5241 16.7107 14.2274 16.8337 13.918 16.8337H8.08464C7.77522 16.8337 7.47847 16.7107 7.25968 16.492C7.04089 16.2732 6.91797 15.9764 6.91797 15.667V7.50033M8.66797 7.50033V6.33366C8.66797 6.02424 8.79089 5.72749 9.00968 5.5087C9.22847 5.28991 9.52522 5.16699 9.83464 5.16699H12.168C12.4774 5.16699 12.7741 5.28991 12.9929 5.5087C13.2117 5.72749 13.3346 6.02424 13.3346 6.33366V7.50033" stroke="#FF6812" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                            <path d="M9.83203 10.417V13.917" stroke="#FF6812" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                            <path d="M12.168 10.417V13.917" stroke="#FF6812" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                        </svg>

                                        <span>Delete Q.{question.questionIndex + 1} From Library</span>
                                    </button>

                                    <button style={question.moveToLibraryStatus === "false" ? { background: '#00C49A' } : { backgroundColor: '#dddddd' }} onClick={onClickMoveToLibrary}  >
                                        {loading ? <div className="loader" ></div> :
                                            <>
                                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <circle cx="10" cy="10" r="10" fill="white" />
                                                    <g clip-path="url(#clip0_2071_2756)">
                                                        <path d="M15.8346 9.46309V9.99976C15.8339 11.2577 15.4266 12.4817 14.6734 13.4892C13.9202 14.4967 12.8616 15.2337 11.6553 15.5904C10.449 15.947 9.1597 15.9042 7.97974 15.4683C6.79978 15.0323 5.79235 14.2267 5.1077 13.1714C4.42304 12.1161 4.09785 10.8678 4.18061 9.61261C4.26338 8.35742 4.74967 7.16262 5.56697 6.20638C6.38426 5.25015 7.48876 4.58373 8.71575 4.30651C9.94273 4.02929 11.2265 4.15612 12.3755 4.66809" stroke={question.moveToLibraryStatus === "false" ? "#00C49A" : "#dddddd"} stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                                        <path d="M15.8333 5.33301L10 11.1722L8.25 9.42217" stroke={question.moveToLibraryStatus === "false" ? "#00C49A" : "#dddddd"} stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                                    </g>
                                                    <defs>
                                                        <clipPath id="clip0_2071_2756">
                                                            <rect width="14" height="14" fill="white" transform="translate(3 3)" />
                                                        </clipPath>
                                                    </defs>
                                                </svg>
                                                <span>Move Q.{question.questionIndex + 1} To Library</span>
                                            </>

                                        }

                                    </button>
                                </div>
                            </div>
                            <div className="border" >
                            </div>

                            <div className="form" >
                                <div className="question-input-container" >
                                    <label>Question Title <span style={{
                                        color: "red"
                                    }}>*</span> </label>
                                    <input value={sectionHeader} onChange={(e) => setsectionHeader(e.target.value)} placeholder="Enter question title here..." />
                                </div>

                                <div className="score-diffculty-container" >
                                    <div className="score-input-container" >
                                        <label>Score <span style={{
                                            color: "red"
                                        }}>*</span> </label>
                                        <input type="number" onWheel={(e) => e.target.blur()} onKeyDown={(evt) => (evt.key === 'e' || (evt.keyCode === 190 || evt.keyCode === 110)) && evt.preventDefault()} min={0} max={100} value={score} onChange={onChangeTestScore} placeholder="Enter Maximum Score here..." />
                                        {score === "0" || score < 0 || /^0+$|^0*-0+$/.test(score) ?
                                            <p style={{ color: 'red', fontSize: 12, fontWeight: 'normal' }} >Score should be greater than zero.</p> : <></>
                                        }
                                        {isTestScore && score === "" ?
                                            <p style={{ color: 'red', fontSize: 12, fontWeight: 'normal' }} >Please enter score</p> : <></>
                                        }

                                    </div>

                                    <div className="diffculty-input-container" >
                                        <label>Difficulty <span style={{
                                            color: "red"
                                        }}>*</span> </label>
                                        <div className="diffculty-option-container" >
                                            <button onClick={() => setdifficultyLevel("easy")} style={difficultyLevel === "easy" ? {} : { borderColor: '#DDDDDD' }} >
                                                <svg width="14" height="20" viewBox="0 0 14 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M10.5737 3.14153C9.60324 2.14278 8.41202 1.38565 7.09577 0.931013C7.02734 0.911575 6.95474 0.912363 6.88675 0.933284C6.81876 0.954205 6.75828 0.994362 6.71261 1.04891C6.66767 1.10391 6.63959 1.17073 6.63175 1.24133C6.6239 1.31192 6.63663 1.38327 6.6684 1.4468C7.44822 2.88907 7.6661 4.5691 7.27998 6.16258C7.27361 6.18729 7.25939 6.20928 7.23946 6.22522C7.21953 6.24116 7.19496 6.25021 7.16945 6.251C7.10314 6.251 7.0884 6.251 7.0884 6.19942C6.52577 4.83612 5.57846 3.66608 4.36209 2.83206C4.30008 2.79116 4.22714 2.76997 4.15287 2.77126C4.07859 2.77255 4.00644 2.79627 3.94588 2.8393C3.88532 2.88232 3.83918 2.94266 3.81352 3.01237C3.78786 3.08209 3.78388 3.15793 3.80209 3.22995C4.23683 4.93205 3.3821 5.95626 2.32841 7.2531C1.27473 8.54994 0 10.0678 0 12.5141C0.0258836 14.0773 0.575961 15.5865 1.56202 16.7997C2.54808 18.0129 3.91299 18.8598 5.43788 19.2046C5.12703 18.9852 4.87274 18.6951 4.69595 18.3582C4.51916 18.0213 4.42494 17.6472 4.42104 17.2668C4.42104 13.332 6.99998 12.352 6.99998 12.352C7.51577 14.931 9.57892 15.5204 9.57892 17.2668C9.57523 17.6428 9.4833 18.0127 9.31052 18.3468C9.13775 18.6808 8.88896 18.9696 8.58419 19.1899C9.6652 18.9554 10.6753 18.4681 11.5315 17.7678C12.3068 17.1251 12.9302 16.3187 13.357 15.4066C13.7838 14.4944 14.0034 13.4991 14 12.492C14 7.56257 12.1358 4.6889 10.5737 3.14153Z" fill={difficultyLevel === "easy" ? "#00C49A" : "#DDDDDD"} />
                                                </svg>
                                                <span>Easy</span>
                                            </button>

                                            <button onClick={() => setdifficultyLevel("medium")} style={difficultyLevel === "medium" ? { borderColor: '#FF9736' } : { borderColor: '#DDDDDD' }} >
                                                <svg width="14" height="20" viewBox="0 0 14 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M10.5737 3.14153C9.60324 2.14278 8.41202 1.38565 7.09577 0.931013C7.02734 0.911575 6.95474 0.912363 6.88675 0.933284C6.81876 0.954205 6.75828 0.994362 6.71261 1.04891C6.66767 1.10391 6.63959 1.17073 6.63175 1.24133C6.6239 1.31192 6.63663 1.38327 6.6684 1.4468C7.44822 2.88907 7.6661 4.5691 7.27998 6.16258C7.27361 6.18729 7.25939 6.20928 7.23946 6.22522C7.21953 6.24116 7.19496 6.25021 7.16945 6.251C7.10314 6.251 7.0884 6.251 7.0884 6.19942C6.52577 4.83612 5.57846 3.66608 4.36209 2.83206C4.30008 2.79116 4.22714 2.76997 4.15287 2.77126C4.07859 2.77255 4.00644 2.79627 3.94588 2.8393C3.88532 2.88232 3.83918 2.94266 3.81352 3.01237C3.78786 3.08209 3.78388 3.15793 3.80209 3.22995C4.23683 4.93205 3.3821 5.95626 2.32841 7.2531C1.27473 8.54994 0 10.0678 0 12.5141C0.0258836 14.0773 0.575961 15.5865 1.56202 16.7997C2.54808 18.0129 3.91299 18.8598 5.43788 19.2046C5.12703 18.9852 4.87274 18.6951 4.69595 18.3582C4.51916 18.0213 4.42494 17.6472 4.42104 17.2668C4.42104 13.332 6.99998 12.352 6.99998 12.352C7.51577 14.931 9.57892 15.5204 9.57892 17.2668C9.57523 17.6428 9.4833 18.0127 9.31052 18.3468C9.13775 18.6808 8.88896 18.9696 8.58419 19.1899C9.6652 18.9554 10.6753 18.4681 11.5315 17.7678C12.3068 17.1251 12.9302 16.3187 13.357 15.4066C13.7838 14.4944 14.0034 13.4991 14 12.492C14 7.56257 12.1358 4.6889 10.5737 3.14153Z" fill={difficultyLevel === "medium" ? "#FF9736" : "#DDDDDD"} />
                                                </svg>
                                                <span>Medium</span>
                                            </button>

                                            <button onClick={() => setdifficultyLevel("hard")} style={difficultyLevel === "hard" ? { borderColor: '#FF5D00' } : { borderColor: '#DDDDDD' }} >
                                                <svg width="14" height="20" viewBox="0 0 14 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M10.5737 3.14153C9.60324 2.14278 8.41202 1.38565 7.09577 0.931013C7.02734 0.911575 6.95474 0.912363 6.88675 0.933284C6.81876 0.954205 6.75828 0.994362 6.71261 1.04891C6.66767 1.10391 6.63959 1.17073 6.63175 1.24133C6.6239 1.31192 6.63663 1.38327 6.6684 1.4468C7.44822 2.88907 7.6661 4.5691 7.27998 6.16258C7.27361 6.18729 7.25939 6.20928 7.23946 6.22522C7.21953 6.24116 7.19496 6.25021 7.16945 6.251C7.10314 6.251 7.0884 6.251 7.0884 6.19942C6.52577 4.83612 5.57846 3.66608 4.36209 2.83206C4.30008 2.79116 4.22714 2.76997 4.15287 2.77126C4.07859 2.77255 4.00644 2.79627 3.94588 2.8393C3.88532 2.88232 3.83918 2.94266 3.81352 3.01237C3.78786 3.08209 3.78388 3.15793 3.80209 3.22995C4.23683 4.93205 3.3821 5.95626 2.32841 7.2531C1.27473 8.54994 0 10.0678 0 12.5141C0.0258836 14.0773 0.575961 15.5865 1.56202 16.7997C2.54808 18.0129 3.91299 18.8598 5.43788 19.2046C5.12703 18.9852 4.87274 18.6951 4.69595 18.3582C4.51916 18.0213 4.42494 17.6472 4.42104 17.2668C4.42104 13.332 6.99998 12.352 6.99998 12.352C7.51577 14.931 9.57892 15.5204 9.57892 17.2668C9.57523 17.6428 9.4833 18.0127 9.31052 18.3468C9.13775 18.6808 8.88896 18.9696 8.58419 19.1899C9.6652 18.9554 10.6753 18.4681 11.5315 17.7678C12.3068 17.1251 12.9302 16.3187 13.357 15.4066C13.7838 14.4944 14.0034 13.4991 14 12.492C14 7.56257 12.1358 4.6889 10.5737 3.14153Z" fill={difficultyLevel === "hard" ? "#FF5D00" : "#DDDDDD"} />
                                                </svg>
                                                <span>Hard</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="skill-topics-container" >
                                    <div className="skill-input-header-container" >
                                        <label>Skills <span style={{
                                            color: "red"
                                        }}>*</span> </label>
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
                                            <svg onClick={() => searchSkill()} width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
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
                                            {skills?.map((data) => {
                                                //if(data?.topicId?.length){
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
                                                //}
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
                                            <svg onClick={searchTopic} width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
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
                                            {topics?.map((data) => {
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

                                            }



                                        </div>
                                        {(topicSearchText !== "" && searchTopicData.length) ?
                                            <div className="search-result-container" >
                                                <svg style={{ cursor: 'pointer', position: 'absolute', right: 20 }} onClick={() => { setsearchTopicData([]) }} width="10" height="10" viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M12.0032 13.9813L7.00642 8.985L2.01082 13.9813C1.55102 14.441 0.805358 14.4412 0.345266 13.9815C-0.114825 13.5219 -0.115113 12.7761 0.344547 12.3161L5.34122 7.31986L0.344476 2.32245C-0.102534 1.86017 -0.0962087 1.12477 0.358851 0.670542C0.813839 0.216023 1.54922 0.210848 2.01082 0.658468L7.00642 5.65473L12.0032 0.658468C12.4666 0.222348 13.1925 0.233272 13.6426 0.683192C14.0927 1.13282 14.1041 1.85873 13.6684 2.32245L8.67162 7.31986L13.6684 12.3161C14.1157 12.7781 14.1098 13.5135 13.6551 13.968C13.2004 14.4228 12.4651 14.4286 12.0031 13.9813H12.0032Z" fill="#99B2C6" />
                                                </svg>

                                                {searchTopicData?.map((data) => {
                                                    return <div style={{ marginTop: 5 }} className="skill-item" >
                                                        <span> {data?.topic}</span>
                                                        <svg onClick={() => addSearchedTopics(data)} style={{ cursor: 'pointer' }} width="10" height="9" viewBox="0 0 10 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path fill-rule="evenodd" clip-rule="evenodd" d="M4.10343 8.24338L4.0947 8.14768V5.27982H0.907895C0.431503 5.28184 0.0352021 4.95232 0.00221205 4.52676C-0.0308162 4.10116 0.310793 3.72574 0.782914 3.66877L0.890999 3.66095H4.09405V0.807097C4.09657 0.382424 4.46434 0.0313535 4.93741 0.00198094C5.41049 -0.0273916 5.82883 0.274873 5.8968 0.69514L5.90492 0.791967V3.65815H9.09172C9.56834 3.65624 9.96476 3.98596 9.99779 4.41176C10.0308 4.83756 9.68905 5.21319 9.2167 5.2703L9.10797 5.27702H5.90492V8.13088C5.90461 8.55658 5.53654 8.90963 5.06224 8.9391C4.58791 8.96861 4.16888 8.6645 4.10286 8.24284L4.10343 8.24338Z" fill="#FF6812" />
                                                        </svg>

                                                    </div>
                                                })

                                                }
                                            </div> : <></>
                                        }
                                    </div>

                                </div>


                                <div className="problem-solution-container" >
                                    <div className="problem-inputbox-container" >
                                        <label>Problem <span style={{
                                            color: "red"
                                        }}>*</span> </label>
                                        <div style={questionEditorFocused ? { border: "1px solid #000000" } : { border: "1px solid #DDDDDD" }}>
                                            <SunEditor
                                                setContents={editorContent}
                                                onChange={handleChange}
                                                onImageUploadBefore={onImageUploadBefore}
                                                onVideoUploadBefore={onVideoUploadBefore}
                                                height='auto'
                                                setOptions={{
                                                    buttonList: [[
                                                        'undo', 'redo',
                                                        'formatBlock',
                                                        'paragraphStyle', 'blockquote',
                                                        'bold', 'underline', 'italic', 'strike', 'subscript', 'superscript', 'math',
                                                        'fontColor', 'hiliteColor', 'textStyle',
                                                        'removeFormat',
                                                        'outdent', 'indent',
                                                        'align', 'horizontalRule', 'list', 'lineHeight',
                                                        'table', 'image',
                                                        'fullScreen', 'showBlocks',
                                                        'preview'
                                                    ]],
                                                    iframe: false,
                                                    tagsBlacklist: "script|iframe|object|embed|applet|form|input|textarea|button|select|option|optgroup|label|fieldset|a|meta|base|frame|frameset|link",
                                                    pasteTagsBlacklist: "script|iframe|object|embed|applet|form|input|textarea|button|select|option|optgroup|label|fieldset|a|meta|base|frame|frameset|link",
                                                    pasteTagsWhitelist: "p",
                                                    videoFileInput: true,
                                                    katex: katex,
                                                }}
                                                onFocus={handleEditorFocus}
                                                onBlur={handleEditorBlur}
                                            />
                                        </div>
                                    </div>

                                    <div className="solution-input-box-container" >
                                        <div className="header" >
                                            <label>Solution</label>
                                            <span>
                                                <div style={{
                                                    display: "flex",
                                                    justifyContent: "center",
                                                    alignItems: "center"
                                                }}>
                                                    {richText ?
                                                        <svg onClick={() => {
                                                            handleRichText()
                                                        }} width="18" height="18" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <rect y="0.466797" width="20" height="20" rx="2" fill="#00C49A" />
                                                            <path d="M14 8.4668L8.5 13.9668L6 11.4668" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                                        </svg>
                                                        :
                                                        <svg onClick={() => {
                                                            handleRichText()
                                                        }} width="18" height="18" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <rect y="0.466797" width="20" height="20" rx="2" fill="#dddddd" />
                                                        </svg>
                                                    }
                                                </div>
                                                <span>Rich Text</span>

                                                <label class="switch">
                                                    <input checked={checked} onChange={onChangeToggle} type="checkbox" />
                                                    <span class="slider round"></span>
                                                </label>
                                                {correctAnswerType === "Yes" ?
                                                    <svg width="15" height="16" viewBox="0 0 15 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <g clip-path="url(#clip0_2071_2909)">
                                                            <path d="M13.75 7.42467V7.99967C13.7492 9.34744 13.3128 10.6588 12.5058 11.7383C11.6989 12.8178 10.5646 13.6075 9.2721 13.9896C7.97964 14.3717 6.59829 14.3259 5.33404 13.8588C4.0698 13.3917 2.99041 12.5285 2.25685 11.3978C1.52329 10.2672 1.17487 8.92971 1.26355 7.58487C1.35223 6.24002 1.87325 4.95988 2.74892 3.93534C3.6246 2.91081 4.80799 2.19679 6.12262 1.89976C7.43725 1.60274 8.81267 1.73863 10.0438 2.28717" stroke="#00C49A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                                            <path d="M13.75 3L7.5 9.25625L5.625 7.38125" stroke="#00C49A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                                        </g>
                                                        <defs>
                                                            <clipPath id="clip0_2071_2909">
                                                                <rect width="15" height="15" fill="white" transform="translate(0 0.5)" />
                                                            </clipPath>
                                                        </defs>
                                                    </svg> : <svg width="15" height="16" viewBox="0 0 15 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <g clip-path="url(#clip0_2071_2909)">
                                                            <path d="M13.75 7.42467V7.99967C13.7492 9.34744 13.3128 10.6588 12.5058 11.7383C11.6989 12.8178 10.5646 13.6075 9.2721 13.9896C7.97964 14.3717 6.59829 14.3259 5.33404 13.8588C4.0698 13.3917 2.99041 12.5285 2.25685 11.3978C1.52329 10.2672 1.17487 8.92971 1.26355 7.58487C1.35223 6.24002 1.87325 4.95988 2.74892 3.93534C3.6246 2.91081 4.80799 2.19679 6.12262 1.89976C7.43725 1.60274 8.81267 1.73863 10.0438 2.28717" stroke="#d3d3d3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                                            <path d="M13.75 3L7.5 9.25625L5.625 7.38125" stroke="#d3d3d3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                                        </g>
                                                        <defs>
                                                            <clipPath id="clip0_2071_2909">
                                                                <rect width="15" height="15" fill="white" transform="translate(0 0.5)" />
                                                            </clipPath>
                                                        </defs>
                                                    </svg>
                                                }
                                                {correctAnswerType === "Yes" ?
                                                    <label>Multiple answers allowed</label> :
                                                    <label>Single answers allowed</label>
                                                }

                                            </span>
                                        </div>
                                        <div className="solution-list-item-parent-container" >
                                            {answerObj?.filter(answer => answer.option !== undefined).map((answerSingleObj, index) => {
                                                return (
                                                    <div style={correctObj?.includes(correctAnswerType === "Yes" ? `${answerSingleObj.optionId}` : answerSingleObj.optionId) ? { borderColor: '#00C49A' } : {}} className="solution-list-item" >
                                                        {/* <div className="bulk-mcq-anwser-item"   ><span>{index + 1}. </span><span contenteditable="true" onInput={(e) => { e.stopPropagation(); answerObj[index].option = e.currentTarget.textContent }}>{answerSingleObj.option === true || answerSingleObj.option === false ? answerSingleObj.option + '' : answerSingleObj.option}</span></div> */}
                                                        {correctObj?.includes(correctAnswerType === "Yes" ? `${answerSingleObj.optionId}` : answerSingleObj.optionId) ?
                                                            <svg onClick={(e) => { e.stopPropagation(); changeCorrectAnswer(e, answerSingleObj.optionId) }} width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <rect y="0.466797" width="20" height="20" rx="2" fill="#00C49A" />
                                                                <path d="M14 8.4668L8.5 13.9668L6 11.4668" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                                            </svg>
                                                            :
                                                            <svg onClick={(e) => { e.stopPropagation(); changeCorrectAnswer(e, answerSingleObj.optionId) }} width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <rect y="0.466797" width="20" height="20" rx="2" fill="#dddddd" />
                                                            </svg>
                                                        }
                                                        <div className="editor">
                                                            <SunEditor
                                                                height='auto'
                                                                width='auto'
                                                                hideToolbar={richText}
                                                                setContents={answerObj[index].html === undefined ? answerSingleObj.option + '' : answerObj[index].html}
                                                                onChange={(content) => {
                                                                    handleAnswerOnChange(index, content)
                                                                }}
                                                                onImageUploadBefore={(files, info, uploadHandler) => {
                                                                    onAnsImageUploadBefore(index, files, info, uploadHandler)
                                                                }}
                                                                onVideoUploadBefore={(files, info, uploadHandler) => {
                                                                    onAnsVideoUploadBefore(index, files, info, uploadHandler)
                                                                }}
                                                                setOptions={{
                                                                    buttonList: [[
                                                                        'undo', 'redo',
                                                                        'formatBlock',
                                                                        'paragraphStyle', 'blockquote',
                                                                        'bold', 'underline', 'italic', 'strike', 'subscript', 'superscript', 'math',
                                                                        'fontColor', 'hiliteColor', 'textStyle',
                                                                        'removeFormat',
                                                                        'outdent', 'indent',
                                                                        'align', 'horizontalRule', 'list', 'lineHeight',
                                                                        'table', 'image',
                                                                        'fullScreen', 'showBlocks',
                                                                        'preview'
                                                                    ]],
                                                                    iframe: false,
                                                                    tagsBlacklist: "script|iframe|object|embed|applet|form|input|textarea|button|select|option|optgroup|label|fieldset|a|meta|base|frame|frameset|link",
                                                                    pasteTagsBlacklist: "script|iframe|object|embed|applet|form|input|textarea|button|select|option|optgroup|label|fieldset|a|meta|base|frame|frameset|link",
                                                                    pasteTagsWhitelist: "p",
                                                                    resizingBar: false,
                                                                    videoFileInput: true,
                                                                    katex: katex
                                                                }}
                                                                onFocus={() => {
                                                                    handleAnsEditorFocus(index)
                                                                }}
                                                                onBlur={() => {
                                                                    handleAnsEditorBlur(index)
                                                                }}
                                                            />
                                                        </div>

                                                        <div id='solution-cross'>
                                                            <svg width="15" height="16" viewBox="0 0 15 16" fill="none" xmlns="http://www.w3.org/2000/svg" onClick={() => removeAnwserObject(answerSingleObj.optionId)}>
                                                                <circle cx="7.5" cy="8" r="7.5" fill="#DDDDDD" />
                                                                <path d="M9.75 5.75L5.25 10.25" stroke="#999999" stroke-linecap="round" />
                                                                <path d="M9.75 10.25L5.25014 5.75014" stroke="#999999" stroke-linecap="round" />
                                                            </svg>
                                                        </div>

                                                    </div>
                                                )
                                            })

                                            }
                                        </div>

                                        <span onClick={() => addNewOption()} className='add-more-option-btn'>
                                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style={{
                                                marginRight: "10px"
                                            }}>
                                                <path d="M8 3.33301V12.6663" stroke="gray" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                <path d="M3.33398 8H12.6673" stroke="gray" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                            <span>Add another option</span>
                                        </span>



                                    </div>
                                </div>

                            </div>

                        </div>
                    </div> : <div className="preview-question-card-container" >All question have been deleted from excel</div>
                }

            </div>
        </>
    )
}

const styleMap = {
    CODE: {
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
        fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
        fontSize: 16,
        padding: 2,
    },
};

function getBlockStyle(block) {
    switch (block.getType()) {
        case 'blockquote':
            return 'RichEditor-blockquote';
        default:
            return null;
    }
}

function StyleButton({ onToggle, active, label, style }) {
    let className = 'RichEditor-styleButton';
    if (active) {
        className += ' RichEditor-activeButton';
    }

    return (
        <span
            className={className}
            onMouseDown={e => {
                e.preventDefault();
                onToggle(style);
            }}>
            {label}
        </span>
    );
}

const BLOCK_TYPES = [
    { label: 'H1', style: 'header-one' },
    { label: 'H2', style: 'header-two' },
    { label: 'H3', style: 'header-three' },
    { label: 'H4', style: 'header-four' },
    { label: 'H5', style: 'header-five' },
    { label: 'H6', style: 'header-six' },
    { label: 'Blockquote', style: 'blockquote' },
    { label: 'UL', style: 'unordered-list-item' },
    { label: 'OL', style: 'ordered-list-item' },
    { label: 'Code Block', style: 'code-block' },
];

function BlockStyleControls({ editorState, onToggle }) {
    const selection = editorState.getSelection();
    const blockType = editorState
        .getCurrentContent()
        .getBlockForKey(selection.getStartKey())
        .getType();

    return (
        <div className="RichEditor-controls">
            {BLOCK_TYPES.map(type => (
                <StyleButton
                    key={type.label}
                    active={type.style === blockType}
                    label={type.label}
                    onToggle={onToggle}
                    style={type.style}
                />
            ))}
        </div>
    );
}

const INLINE_STYLES = [
    { label: 'Bold', style: 'BOLD' },
    { label: 'Italic', style: 'ITALIC' },
    { label: 'Underline', style: 'UNDERLINE' },
    { label: 'Monospace', style: 'CODE' },
];

function InlineStyleControls({ editorState, onToggle }) {
    const currentStyle = editorState.getCurrentInlineStyle();
    return (
        <div className="RichEditor-controls">
            {INLINE_STYLES.map(type => (
                <StyleButton
                    key={type.label}
                    active={currentStyle.has(type.style)}
                    label={type.label}
                    onToggle={onToggle}
                    style={type.style}
                />
            ))}
        </div>
    );
}


export default BulkImported