import React from 'react';
import Navbar from '../navbar/Navbar';
import CreateTest3Sidebar from '../../component/CreateTest3Sidebar';
import './index.css';
import { useNavigate } from 'react-router-dom';
import NavigationBar from '../../component/NavigationBar/NavigationBar';
import DeleteSkillSetModel from '../../component/DeleteSkillSetModel';
import QuestionPreviewModel from "../../component/QuestionPreviewModel";
import EditQuestionModel from "../../component/EditQuestionModel";
import { useState } from 'react';

function DetailedQuestion() {
    const navigate = useNavigate();
    const [deleteSkillSetModel, setDeleteSkillSetModel] = useState(false);
    const [questionPreview, setquestionPreview] = useState(false);
    const [editQuestion, seteditQuestion] = useState(false);
    const [selectedQuestionIndex, setselectedQuestionIndex] = useState("");
    const [selectedQuestion, setSelectedQuestion] = useState("");
    const [openPreview, setOpenPreview] = useState(false);
    const [selected, setSelected] = useState([])
    const [selectAllCheck, setselectAllCheck] = useState(false)
    const [multipleDelete, setmultipleDelete] = useState(false)

    const questionArray = [
        {
            "_id": "638082c1ee0abb2ec148cc9b",
            "type": "MCQ",
            "createdBy": {
                "_id": "6385ad660260eab025577471",
                "client": "6321ddbf893791b27bf506d1",
                "fullName": "the elitqa",
                "email": "theeliteqa@gmail.com",
                "departmentId": "633d9891306e8f33e92cd086",
                "userName": "theeliteqa",
                "password": "$2a$10$0kjpxAE/KPschZ/vqYzyq.Nfmx55A9xv.RvWypaS/fQu39XAbGyhS",
                "profileUrl": "https://elite-qa-webcam-snapshot.s3.ap-south-1.amazonaws.com/dc321460-7acc-11ed-93fe-ebf7729514db",
                "__v": 0
            },
            "clientId": {
                "_id": "6321ddbf893791b27bf506d1",
                "startDate": "2022-09-15T00:00:00.000Z",
                "companyName": "the eliteqa pvt. ltd.",
                "companyEmail": "theeliteqa@gmail.com",
                "contact": 8698984443,
                "website": "https://www.gmail.com",
                "logo": "No Logo",
                "gstn": "18AABCU9603R1ZM",
                "tanNo": "DMPKR9319R",
                "contactPerson": [
                    {
                        "name": "Rutika",
                        "role": "Accounts",
                        "gender": "gdfghdh",
                        "email": "fngbdgb",
                        "contactno": 123456789,
                        "_id": "6321ddbf893791b27bf506d2"
                    },
                    {
                        "name": "fdf",
                        "role": "fsfda",
                        "gender": "hjkhjkhg",
                        "email": "dsffdaf",
                        "contactno": 123456789,
                        "_id": "6321ddbf893791b27bf506d3"
                    },
                    {
                        "name": "efadfs",
                        "role": "asdff",
                        "gender": "fgf",
                        "email": "dfasdff",
                        "contactno": 123456789,
                        "_id": "6321ddbf893791b27bf506d4"
                    },
                    {
                        "name": "adfafs",
                        "role": "adsfdfa",
                        "gender": "afdsfd",
                        "email": "fasdfasd",
                        "contactno": 123456789,
                        "_id": "6321ddbf893791b27bf506d5"
                    },
                    {
                        "name": "f,mgn,fng",
                        "role": "fmn,hn",
                        "gender": ",mf,ngf,n",
                        "email": "bvncv",
                        "contactno": 123456789,
                        "_id": "6321ddbf893791b27bf506d6"
                    }
                ],
                "companyAddress": "PUne",
                "__v": 0
            },
            "creationDateTime": "2022-11-25T08:25:49.353Z",
            "noOfTimesUsed": 100,
            "question": "what is the use of the <noscript> tag in javascript?",
            "correctAnswerType": "Single",
            "answersObjectArray": [
                "The contents are displayed by non-JS-based browers"
            ],
            "correctAnswerObjectArray": [
                "The contents are displayed by non-JS-based browers",
                "Clears all the cookies and cache",
                "Both A and B",
                "None of the above"
            ],
            "score": 10,
            "difficultyLevelId": {
                "_id": "641bf53ce012709b89e6c2cc",
                "level": "medium",
                "experience": "2",
                "programmingTime": 200,
                "mcqTime": 200,
                "__v": 0
            },
            "topicId": [
                {
                    "_id": "6342cc50ec3a7ea3ba9e3ad5",
                    "topic": "variables",
                    "topicsID": 57,
                    "__v": 0
                }
            ],
            "skillsId": [
                {
                    "_id": "6351ad06bad5a956dc05c9bf",
                    "skills": "javascript",
                    "topics": [
                        {}
                    ],
                    "skillID": 74,
                    "__v": 0
                }
            ],
            "Section_header": "Javascript Easy",
            "approved": "not approved",
            "status": "complete",
            "__v": 0,
            "sourceSelected": "EliteQA Library"
        },
        {
            "_id": "638086afee0abb2ec148ccbe",
            "type": "MCQ",
            "createdBy": {
                "_id": "6385ad660260eab025577471",
                "client": "6321ddbf893791b27bf506d1",
                "fullName": "the elitqa",
                "email": "theeliteqa@gmail.com",
                "departmentId": "633d9891306e8f33e92cd086",
                "userName": "theeliteqa",
                "password": "$2a$10$0kjpxAE/KPschZ/vqYzyq.Nfmx55A9xv.RvWypaS/fQu39XAbGyhS",
                "profileUrl": "https://elite-qa-webcam-snapshot.s3.ap-south-1.amazonaws.com/dc321460-7acc-11ed-93fe-ebf7729514db",
                "__v": 0
            },
            "clientId": {
                "_id": "6321ddbf893791b27bf506d1",
                "startDate": "2022-09-15T00:00:00.000Z",
                "companyName": "the eliteqa pvt. ltd.",
                "companyEmail": "theeliteqa@gmail.com",
                "contact": 8698984443,
                "website": "https://www.gmail.com",
                "logo": "No Logo",
                "gstn": "18AABCU9603R1ZM",
                "tanNo": "DMPKR9319R",
                "contactPerson": [
                    {
                        "name": "Rutika",
                        "role": "Accounts",
                        "gender": "gdfghdh",
                        "email": "fngbdgb",
                        "contactno": 123456789,
                        "_id": "6321ddbf893791b27bf506d2"
                    },
                    {
                        "name": "fdf",
                        "role": "fsfda",
                        "gender": "hjkhjkhg",
                        "email": "dsffdaf",
                        "contactno": 123456789,
                        "_id": "6321ddbf893791b27bf506d3"
                    },
                    {
                        "name": "efadfs",
                        "role": "asdff",
                        "gender": "fgf",
                        "email": "dfasdff",
                        "contactno": 123456789,
                        "_id": "6321ddbf893791b27bf506d4"
                    },
                    {
                        "name": "adfafs",
                        "role": "adsfdfa",
                        "gender": "afdsfd",
                        "email": "fasdfasd",
                        "contactno": 123456789,
                        "_id": "6321ddbf893791b27bf506d5"
                    },
                    {
                        "name": "f,mgn,fng",
                        "role": "fmn,hn",
                        "gender": ",mf,ngf,n",
                        "email": "bvncv",
                        "contactno": 123456789,
                        "_id": "6321ddbf893791b27bf506d6"
                    }
                ],
                "companyAddress": "PUne",
                "__v": 0
            },
            "creationDateTime": "2022-11-25T08:25:49.353Z",
            "noOfTimesUsed": 100,
            "question": "which of the following are closures in javascript?",
            "correctAnswerType": "Single",
            "answersObjectArray": [
                "All of the above"
            ],
            "correctAnswerObjectArray": [
                "variables",
                "Functions",
                "Objects",
                "All of the above"
            ],
            "score": 10,
            "difficultyLevelId": {
                "_id": "641bf5c1e012709b89e6c2d2",
                "level": "easy",
                "experience": "5 to 7",
                "programmingTime": 3600,
                "mcqTime": 3600,
                "__v": 0
            },
            "topicId": [
                {
                    "_id": "633be29e896d0c955e6e74b3",
                    "topic": "collectionsjohnmuqy",
                    "topicsID": 43,
                    "__v": 0
                }
            ],
            "skillsId": [
                {
                    "_id": "6351ad06bad5a956dc05c9bf",
                    "skills": "javascript",
                    "topics": [
                        {}
                    ],
                    "skillID": 74,
                    "__v": 0
                }
            ],
            "Section_header": "Javascript Hard",
            "approved": "not approved",
            "status": "complete",
            "__v": 0,
            "sourceSelected": "EliteQA Library"
        },
        {
            "_id": "638086fcee0abb2ec148ccc1",
            "type": "MCQ",
            "createdBy": {
                "_id": "6385ad660260eab025577471",
                "client": "6321ddbf893791b27bf506d1",
                "fullName": "the elitqa",
                "email": "theeliteqa@gmail.com",
                "departmentId": "633d9891306e8f33e92cd086",
                "userName": "theeliteqa",
                "password": "$2a$10$0kjpxAE/KPschZ/vqYzyq.Nfmx55A9xv.RvWypaS/fQu39XAbGyhS",
                "profileUrl": "https://elite-qa-webcam-snapshot.s3.ap-south-1.amazonaws.com/dc321460-7acc-11ed-93fe-ebf7729514db",
                "__v": 0
            },
            "clientId": {
                "_id": "6321ddbf893791b27bf506d1",
                "startDate": "2022-09-15T00:00:00.000Z",
                "companyName": "the eliteqa pvt. ltd.",
                "companyEmail": "theeliteqa@gmail.com",
                "contact": 8698984443,
                "website": "https://www.gmail.com",
                "logo": "No Logo",
                "gstn": "18AABCU9603R1ZM",
                "tanNo": "DMPKR9319R",
                "contactPerson": [
                    {
                        "name": "Rutika",
                        "role": "Accounts",
                        "gender": "gdfghdh",
                        "email": "fngbdgb",
                        "contactno": 123456789,
                        "_id": "6321ddbf893791b27bf506d2"
                    },
                    {
                        "name": "fdf",
                        "role": "fsfda",
                        "gender": "hjkhjkhg",
                        "email": "dsffdaf",
                        "contactno": 123456789,
                        "_id": "6321ddbf893791b27bf506d3"
                    },
                    {
                        "name": "efadfs",
                        "role": "asdff",
                        "gender": "fgf",
                        "email": "dfasdff",
                        "contactno": 123456789,
                        "_id": "6321ddbf893791b27bf506d4"
                    },
                    {
                        "name": "adfafs",
                        "role": "adsfdfa",
                        "gender": "afdsfd",
                        "email": "fasdfasd",
                        "contactno": 123456789,
                        "_id": "6321ddbf893791b27bf506d5"
                    },
                    {
                        "name": "f,mgn,fng",
                        "role": "fmn,hn",
                        "gender": ",mf,ngf,n",
                        "email": "bvncv",
                        "contactno": 123456789,
                        "_id": "6321ddbf893791b27bf506d6"
                    }
                ],
                "companyAddress": "PUne",
                "__v": 0
            },
            "creationDateTime": "2022-11-25T08:25:49.353Z",
            "noOfTimesUsed": 100,
            "question": "which of the following is not a javascript framework?",
            "correctAnswerType": "Single",
            "answersObjectArray": [
                "Cassandra"
            ],
            "correctAnswerObjectArray": [
                "Node",
                "Vue",
                "React",
                "Cassandra"
            ],
            "score": 10,
            "difficultyLevelId": {
                "_id": "641bf5c1e012709b89e6c2d2",
                "level": "easy",
                "experience": "5 to 7",
                "programmingTime": 3600,
                "mcqTime": 3600,
                "__v": 0
            },
            "topicId": [
                {
                    "_id": "633be29e896d0c955e6e74b3",
                    "topic": "collectionsjohnmuqy",
                    "topicsID": 43,
                    "__v": 0
                }
            ],
            "skillsId": [
                {
                    "_id": "6351ad06bad5a956dc05c9bf",
                    "skills": "javascript",
                    "topics": [
                        {}
                    ],
                    "skillID": 74,
                    "__v": 0
                }
            ],
            "Section_header": "Javascript Hard",
            "approved": "not approved",
            "status": "complete",
            "__v": 0,
            "sourceSelected": "EliteQA Library"
        },
        {
            "_id": "6380881eee0abb2ec148ccc4",
            "type": "MCQ",
            "createdBy": {
                "_id": "6385ad660260eab025577471",
                "client": "6321ddbf893791b27bf506d1",
                "fullName": "the elitqa",
                "email": "theeliteqa@gmail.com",
                "departmentId": "633d9891306e8f33e92cd086",
                "userName": "theeliteqa",
                "password": "$2a$10$0kjpxAE/KPschZ/vqYzyq.Nfmx55A9xv.RvWypaS/fQu39XAbGyhS",
                "profileUrl": "https://elite-qa-webcam-snapshot.s3.ap-south-1.amazonaws.com/dc321460-7acc-11ed-93fe-ebf7729514db",
                "__v": 0
            },
            "clientId": {
                "_id": "6321ddbf893791b27bf506d1",
                "startDate": "2022-09-15T00:00:00.000Z",
                "companyName": "the eliteqa pvt. ltd.",
                "companyEmail": "theeliteqa@gmail.com",
                "contact": 8698984443,
                "website": "https://www.gmail.com",
                "logo": "No Logo",
                "gstn": "18AABCU9603R1ZM",
                "tanNo": "DMPKR9319R",
                "contactPerson": [
                    {
                        "name": "Rutika",
                        "role": "Accounts",
                        "gender": "gdfghdh",
                        "email": "fngbdgb",
                        "contactno": 123456789,
                        "_id": "6321ddbf893791b27bf506d2"
                    },
                    {
                        "name": "fdf",
                        "role": "fsfda",
                        "gender": "hjkhjkhg",
                        "email": "dsffdaf",
                        "contactno": 123456789,
                        "_id": "6321ddbf893791b27bf506d3"
                    },
                    {
                        "name": "efadfs",
                        "role": "asdff",
                        "gender": "fgf",
                        "email": "dfasdff",
                        "contactno": 123456789,
                        "_id": "6321ddbf893791b27bf506d4"
                    },
                    {
                        "name": "adfafs",
                        "role": "adsfdfa",
                        "gender": "afdsfd",
                        "email": "fasdfasd",
                        "contactno": 123456789,
                        "_id": "6321ddbf893791b27bf506d5"
                    },
                    {
                        "name": "f,mgn,fng",
                        "role": "fmn,hn",
                        "gender": ",mf,ngf,n",
                        "email": "bvncv",
                        "contactno": 123456789,
                        "_id": "6321ddbf893791b27bf506d6"
                    }
                ],
                "companyAddress": "PUne",
                "__v": 0
            },
            "creationDateTime": "2022-11-25T08:25:49.353Z",
            "noOfTimesUsed": 100,
            "question": "what keyword is used to declare an asynchronous function in javascript?",
            "correctAnswerType": "Single",
            "answersObjectArray": [
                "async"
            ],
            "correctAnswerObjectArray": [
                "async",
                "await",
                "setTimeout",
                "None of the above"
            ],
            "score": 10,
            "difficultyLevelId": {
                "_id": "641bf5c1e012709b89e6c2d2",
                "level": "hard",
                "experience": "5 to 7",
                "programmingTime": 3600,
                "mcqTime": 3600,
                "__v": 0
            },
            "topicId": [],
            "skillsId": [
                {
                    "_id": "6351ad06bad5a956dc05c9bf",
                    "skills": "javascript",
                    "topics": [
                        {}
                    ],
                    "skillID": 74,
                    "__v": 0
                }
            ],
            "Section_header": "Javascript Hard",
            "approved": "not approved",
            "status": "complete",
            "__v": 0,
            "sourceSelected": "EliteQA Library"
        },
        {
            "_id": "6380881eee0abb2ec148ccc4",
            "type": "Programming",
            "createdBy": {
                "_id": "6385ad660260eab025577471",
                "client": "6321ddbf893791b27bf506d1",
                "fullName": "the elitqa",
                "email": "theeliteqa@gmail.com",
                "departmentId": "633d9891306e8f33e92cd086",
                "userName": "theeliteqa",
                "password": "$2a$10$0kjpxAE/KPschZ/vqYzyq.Nfmx55A9xv.RvWypaS/fQu39XAbGyhS",
                "profileUrl": "https://elite-qa-webcam-snapshot.s3.ap-south-1.amazonaws.com/dc321460-7acc-11ed-93fe-ebf7729514db",
                "__v": 0
            },
            "clientId": {
                "_id": "6321ddbf893791b27bf506d1",
                "startDate": "2022-09-15T00:00:00.000Z",
                "companyName": "the eliteqa pvt. ltd.",
                "companyEmail": "theeliteqa@gmail.com",
                "contact": 8698984443,
                "website": "https://www.gmail.com",
                "logo": "No Logo",
                "gstn": "18AABCU9603R1ZM",
                "tanNo": "DMPKR9319R",
                "contactPerson": [
                    {
                        "name": "Rutika",
                        "role": "Accounts",
                        "gender": "gdfghdh",
                        "email": "fngbdgb",
                        "contactno": 123456789,
                        "_id": "6321ddbf893791b27bf506d2"
                    },
                    {
                        "name": "fdf",
                        "role": "fsfda",
                        "gender": "hjkhjkhg",
                        "email": "dsffdaf",
                        "contactno": 123456789,
                        "_id": "6321ddbf893791b27bf506d3"
                    },
                    {
                        "name": "efadfs",
                        "role": "asdff",
                        "gender": "fgf",
                        "email": "dfasdff",
                        "contactno": 123456789,
                        "_id": "6321ddbf893791b27bf506d4"
                    },
                    {
                        "name": "adfafs",
                        "role": "adsfdfa",
                        "gender": "afdsfd",
                        "email": "fasdfasd",
                        "contactno": 123456789,
                        "_id": "6321ddbf893791b27bf506d5"
                    },
                    {
                        "name": "f,mgn,fng",
                        "role": "fmn,hn",
                        "gender": ",mf,ngf,n",
                        "email": "bvncv",
                        "contactno": 123456789,
                        "_id": "6321ddbf893791b27bf506d6"
                    }
                ],
                "companyAddress": "PUne",
                "__v": 0
            },
            "creationDateTime": "2022-11-25T08:25:49.353Z",
            "noOfTimesUsed": 100,
            "question": "Which Of The Following Are Closures In Javascript?",
            "correctAnswerType": "Single",
            "answersObjectArray": [
                "async"
            ],
            "correctAnswerObjectArray": [
                "async",
                "await",
                "setTimeout",
                "None of the above"
            ],
            "score": 10,
            "difficultyLevelId": {
                "_id": "641bf5c1e012709b89e6c2d2",
                "level": "hard",
                "experience": "5 to 7",
                "programmingTime": 3600,
                "mcqTime": 3600,
                "__v": 0
            },
            "topicId": [],
            "skillsId": [
                {
                    "_id": "6351ad06bad5a956dc05c9bf",
                    "skills": "javascript",
                    "topics": [
                        {}
                    ],
                    "skillID": 74,
                    "__v": 0
                }
            ],
            "Section_header": "Javascript Hard",
            "approved": "not approved",
            "status": "complete",
            "__v": 0,
            "sourceSelected": "EliteQA Library"
        },
        {
            "_id": "6380881eee0abb2ec148ccc4",
            "type": "Programming",
            "createdBy": {
                "_id": "6385ad660260eab025577471",
                "client": "6321ddbf893791b27bf506d1",
                "fullName": "the elitqa",
                "email": "theeliteqa@gmail.com",
                "departmentId": "633d9891306e8f33e92cd086",
                "userName": "theeliteqa",
                "password": "$2a$10$0kjpxAE/KPschZ/vqYzyq.Nfmx55A9xv.RvWypaS/fQu39XAbGyhS",
                "profileUrl": "https://elite-qa-webcam-snapshot.s3.ap-south-1.amazonaws.com/dc321460-7acc-11ed-93fe-ebf7729514db",
                "__v": 0
            },
            "clientId": {
                "_id": "6321ddbf893791b27bf506d1",
                "startDate": "2022-09-15T00:00:00.000Z",
                "companyName": "the eliteqa pvt. ltd.",
                "companyEmail": "theeliteqa@gmail.com",
                "contact": 8698984443,
                "website": "https://www.gmail.com",
                "logo": "No Logo",
                "gstn": "18AABCU9603R1ZM",
                "tanNo": "DMPKR9319R",
                "contactPerson": [
                    {
                        "name": "Rutika",
                        "role": "Accounts",
                        "gender": "gdfghdh",
                        "email": "fngbdgb",
                        "contactno": 123456789,
                        "_id": "6321ddbf893791b27bf506d2"
                    },
                    {
                        "name": "fdf",
                        "role": "fsfda",
                        "gender": "hjkhjkhg",
                        "email": "dsffdaf",
                        "contactno": 123456789,
                        "_id": "6321ddbf893791b27bf506d3"
                    },
                    {
                        "name": "efadfs",
                        "role": "asdff",
                        "gender": "fgf",
                        "email": "dfasdff",
                        "contactno": 123456789,
                        "_id": "6321ddbf893791b27bf506d4"
                    },
                    {
                        "name": "adfafs",
                        "role": "adsfdfa",
                        "gender": "afdsfd",
                        "email": "fasdfasd",
                        "contactno": 123456789,
                        "_id": "6321ddbf893791b27bf506d5"
                    },
                    {
                        "name": "f,mgn,fng",
                        "role": "fmn,hn",
                        "gender": ",mf,ngf,n",
                        "email": "bvncv",
                        "contactno": 123456789,
                        "_id": "6321ddbf893791b27bf506d6"
                    }
                ],
                "companyAddress": "PUne",
                "__v": 0
            },
            "creationDateTime": "2022-11-25T08:25:49.353Z",
            "noOfTimesUsed": 100,
            "question": "what keyword is used to declare an asynchronous function in javascript?",
            "correctAnswerType": "Single",
            "answersObjectArray": [
                "async"
            ],
            "correctAnswerObjectArray": [
                "async",
                "await",
                "setTimeout",
                "None of the above"
            ],
            "score": 10,
            "difficultyLevelId": {
                "_id": "641bf5c1e012709b89e6c2d2",
                "level": "medium",
                "experience": "5 to 7",
                "programmingTime": 3600,
                "mcqTime": 3600,
                "__v": 0
            },
            "topicId": [],
            "skillsId": [
                {
                    "_id": "6351ad06bad5a956dc05c9bf",
                    "skills": "javascript",
                    "topics": [
                        {}
                    ],
                    "skillID": 74,
                    "__v": 0
                }
            ],
            "Section_header": "Javascript Hard",
            "approved": "not approved",
            "status": "complete",
            "__v": 0,
            "sourceSelected": "EliteQA Library"
        },
        {
            "_id": "6380881eee0abb2ec148ccc4",
            "type": "MCQ",
            "createdBy": {
                "_id": "6385ad660260eab025577471",
                "client": "6321ddbf893791b27bf506d1",
                "fullName": "the elitqa",
                "email": "theeliteqa@gmail.com",
                "departmentId": "633d9891306e8f33e92cd086",
                "userName": "theeliteqa",
                "password": "$2a$10$0kjpxAE/KPschZ/vqYzyq.Nfmx55A9xv.RvWypaS/fQu39XAbGyhS",
                "profileUrl": "https://elite-qa-webcam-snapshot.s3.ap-south-1.amazonaws.com/dc321460-7acc-11ed-93fe-ebf7729514db",
                "__v": 0
            },
            "clientId": {
                "_id": "6321ddbf893791b27bf506d1",
                "startDate": "2022-09-15T00:00:00.000Z",
                "companyName": "the eliteqa pvt. ltd.",
                "companyEmail": "theeliteqa@gmail.com",
                "contact": 8698984443,
                "website": "https://www.gmail.com",
                "logo": "No Logo",
                "gstn": "18AABCU9603R1ZM",
                "tanNo": "DMPKR9319R",
                "contactPerson": [
                    {
                        "name": "Rutika",
                        "role": "Accounts",
                        "gender": "gdfghdh",
                        "email": "fngbdgb",
                        "contactno": 123456789,
                        "_id": "6321ddbf893791b27bf506d2"
                    },
                    {
                        "name": "fdf",
                        "role": "fsfda",
                        "gender": "hjkhjkhg",
                        "email": "dsffdaf",
                        "contactno": 123456789,
                        "_id": "6321ddbf893791b27bf506d3"
                    },
                    {
                        "name": "efadfs",
                        "role": "asdff",
                        "gender": "fgf",
                        "email": "dfasdff",
                        "contactno": 123456789,
                        "_id": "6321ddbf893791b27bf506d4"
                    },
                    {
                        "name": "adfafs",
                        "role": "adsfdfa",
                        "gender": "afdsfd",
                        "email": "fasdfasd",
                        "contactno": 123456789,
                        "_id": "6321ddbf893791b27bf506d5"
                    },
                    {
                        "name": "f,mgn,fng",
                        "role": "fmn,hn",
                        "gender": ",mf,ngf,n",
                        "email": "bvncv",
                        "contactno": 123456789,
                        "_id": "6321ddbf893791b27bf506d6"
                    }
                ],
                "companyAddress": "PUne",
                "__v": 0
            },
            "creationDateTime": "2022-11-25T08:25:49.353Z",
            "noOfTimesUsed": 100,
            "question": "what keyword is used to declare an asynchronous function in javascript?",
            "correctAnswerType": "Single",
            "answersObjectArray": [
                "async"
            ],
            "correctAnswerObjectArray": [
                "async",
                "await",
                "setTimeout",
                "None of the above"
            ],
            "score": 10,
            "difficultyLevelId": {
                "_id": "641bf5c1e012709b89e6c2d2",
                "level": "easy",
                "experience": "5 to 7",
                "programmingTime": 3600,
                "mcqTime": 3600,
                "__v": 0
            },
            "topicId": [],
            "skillsId": [
                {
                    "_id": "6351ad06bad5a956dc05c9bf",
                    "skills": "javascript",
                    "topics": [
                        {}
                    ],
                    "skillID": 74,
                    "__v": 0
                }
            ],
            "Section_header": "Javascript Hard",
            "approved": "not approved",
            "status": "complete",
            "__v": 0,
            "sourceSelected": "EliteQA Library"
        },
        {
            "_id": "6380881eee0abb2ec148ccc4",
            "type": "Programming",
            "createdBy": {
                "_id": "6385ad660260eab025577471",
                "client": "6321ddbf893791b27bf506d1",
                "fullName": "the elitqa",
                "email": "theeliteqa@gmail.com",
                "departmentId": "633d9891306e8f33e92cd086",
                "userName": "theeliteqa",
                "password": "$2a$10$0kjpxAE/KPschZ/vqYzyq.Nfmx55A9xv.RvWypaS/fQu39XAbGyhS",
                "profileUrl": "https://elite-qa-webcam-snapshot.s3.ap-south-1.amazonaws.com/dc321460-7acc-11ed-93fe-ebf7729514db",
                "__v": 0
            },
            "clientId": {
                "_id": "6321ddbf893791b27bf506d1",
                "startDate": "2022-09-15T00:00:00.000Z",
                "companyName": "the eliteqa pvt. ltd.",
                "companyEmail": "theeliteqa@gmail.com",
                "contact": 8698984443,
                "website": "https://www.gmail.com",
                "logo": "No Logo",
                "gstn": "18AABCU9603R1ZM",
                "tanNo": "DMPKR9319R",
                "contactPerson": [
                    {
                        "name": "Rutika",
                        "role": "Accounts",
                        "gender": "gdfghdh",
                        "email": "fngbdgb",
                        "contactno": 123456789,
                        "_id": "6321ddbf893791b27bf506d2"
                    },
                    {
                        "name": "fdf",
                        "role": "fsfda",
                        "gender": "hjkhjkhg",
                        "email": "dsffdaf",
                        "contactno": 123456789,
                        "_id": "6321ddbf893791b27bf506d3"
                    },
                    {
                        "name": "efadfs",
                        "role": "asdff",
                        "gender": "fgf",
                        "email": "dfasdff",
                        "contactno": 123456789,
                        "_id": "6321ddbf893791b27bf506d4"
                    },
                    {
                        "name": "adfafs",
                        "role": "adsfdfa",
                        "gender": "afdsfd",
                        "email": "fasdfasd",
                        "contactno": 123456789,
                        "_id": "6321ddbf893791b27bf506d5"
                    },
                    {
                        "name": "f,mgn,fng",
                        "role": "fmn,hn",
                        "gender": ",mf,ngf,n",
                        "email": "bvncv",
                        "contactno": 123456789,
                        "_id": "6321ddbf893791b27bf506d6"
                    }
                ],
                "companyAddress": "PUne",
                "__v": 0
            },
            "creationDateTime": "2022-11-25T08:25:49.353Z",
            "noOfTimesUsed": 100,
            "question": "what keyword is used to declare an asynchronous function in javascript?",
            "correctAnswerType": "Single",
            "answersObjectArray": [
                "async"
            ],
            "correctAnswerObjectArray": [
                "async",
                "await",
                "setTimeout",
                "None of the above"
            ],
            "score": 10,
            "difficultyLevelId": {
                "_id": "641bf5c1e012709b89e6c2d2",
                "level": "easy",
                "experience": "5 to 7",
                "programmingTime": 3600,
                "mcqTime": 3600,
                "__v": 0
            },
            "topicId": [],
            "skillsId": [
                {
                    "_id": "6351ad06bad5a956dc05c9bf",
                    "skills": "javascript",
                    "topics": [
                        {}
                    ],
                    "skillID": 74,
                    "__v": 0
                }
            ],
            "Section_header": "Javascript Hard",
            "approved": "not approved",
            "status": "complete",
            "__v": 0,
            "sourceSelected": "EliteQA Library"
        }
    ];
    const ProgrammingArray = [
        {
            que: "",
            selected: false
        },
        {
            que: "",
            selected: true
        }
    ];

    const multipleCloseButton = () => {
        setmultipleDelete(false)
        setSelected([])
        setselectAllCheck(false)

    };

    const closeButton = () => {
        setDeleteSkillSetModel(false);
    };

    const onClickEditSave = () => {
        seteditQuestion(false);
    };

    let arr = [];
    const selectAll = (length) => {
        setselectAllCheck(true)

        
        if (selected.length === length) {
            return arr;
        }

        for (let i = 1; i <= length; i++) {
            arr.push(i)
        }
        return arr;
    }

    const removeCheck = (val) => {
        setSelected(selected => selected.filter((data) => { return data != val }))
    }

    const setCheck = (val) => {
        setSelected([...selected, val])
    }

    const onClickTryQuestion = (e) => {
        e.stopPropagation()
        let url = ` https://www.assessment.theeliteqa.com/test4?id=63ae8dc44759b3a1e0454993&page=library`
        window.open(url, '_blank')
    }

    return (

        <div className="overview">
            <NavigationBar saveAsDraft={true} assessment2={true} />
            {deleteSkillSetModel && <DeleteSkillSetModel closeButton={closeButton} problem={true} />}
            {multipleDelete && <DeleteSkillSetModel closeButton={multipleCloseButton} multiple={selected.length} problem={true} />}
            <div className="overview-container">
                {openPreview ? <QuestionPreviewModel onClickEdit={() => { setquestionPreview(false); seteditQuestion(true); }} selectedQuestionIndex={selectedQuestionIndex} data={selectedQuestion} onClickCancel={() => { setOpenPreview(false); setselectedQuestionIndex("") }} /> : null}
                {editQuestion && <EditQuestionModel selectedQuestionIndex={selectedQuestionIndex} data={selectedQuestion} onClickCancel={() => seteditQuestion(false)} onClickSave={(data) => onClickEditSave(data)} />}
                <CreateTest3Sidebar />

                <div className="right">
                    <div className="right-content">
                        <div className="col">
                            <div className="header">
                                <div className="title" onClick={() => {
                                    navigate("/questionsoverview");
                                }}>
                                    <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M19 12.3955H5" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                        <path d="M12 19.3955L5 12.3955L12 5.39551" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                    </svg>
                                    <div className="group">
                                        <span>Back To Overview</span>
                                    </div>
                                </div>

                                <div className="button-container">
                                    <div className="next-button" style={{ backgroundColor: "#FF6812" }} onClick={() => {
                                        navigate("/choosefromlibrary");
                                    }}>
                                        <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <circle cx="10" cy="10.3955" r="10" fill="white" />
                                            <path fill-rule="evenodd" clip-rule="evenodd" d="M7.31091 6.39964C6.92633 6.39064 6.54154 6.40161 6.15811 6.43267C5.85899 6.42648 5.57028 6.54243 5.35866 6.75398C5.14703 6.96544 5.03081 7.25411 5.03684 7.55319C5.00576 7.93661 4.99474 8.32144 5.00379 8.70598V11.3958C5.00379 12.2604 4.94999 12.0034 5.2478 12.4437C5.406 12.6587 5.63916 12.8062 5.90106 12.8573C6.11623 12.8999 6.33497 12.9218 6.55431 12.9229C6.55892 13.0612 6.56353 13.198 6.57698 13.3159C6.57075 13.615 6.68678 13.9038 6.89826 14.1154C7.10974 14.3271 7.39838 14.4432 7.6975 14.4372C7.90192 14.4603 8.14823 14.4656 8.4203 14.468C8.43473 14.4692 8.44923 14.4697 8.46371 14.4693L12.6906 14.4692C13.0752 14.4782 13.46 14.4672 13.8434 14.4362C14.1425 14.4422 14.4312 14.3259 14.6427 14.1144C14.8541 13.9028 14.9702 13.614 14.9639 13.3149C14.9949 12.9315 15.006 12.5468 14.997 12.1621V11.3936C14.9971 11.3783 14.9964 11.363 14.9947 11.3479C14.9923 11.0766 14.987 10.8307 14.9639 10.6266C14.9701 10.3276 14.854 10.0389 14.6425 9.82726C14.4311 9.6157 14.1425 9.49947 13.8434 9.50538C13.7247 9.49196 13.5871 9.48774 13.448 9.48305C13.4556 9.45106 13.4591 9.41832 13.4584 9.38548C13.4658 9.07843 13.4426 8.77137 13.3892 8.46891C13.342 8.20454 13.1977 7.96747 12.9846 7.80414C12.5446 7.49681 12.7963 7.55103 11.9225 7.55103H10.9026C10.5235 7.57251 10.1438 7.52167 9.78367 7.40112C9.63149 7.3362 9.49899 7.23253 9.3994 7.10035C9.22044 6.88832 8.99525 6.72021 8.74115 6.60885C8.29198 6.44843 7.8158 6.37732 7.33935 6.39946H7.31245L7.31091 6.39964ZM7.31045 7.16811C7.69424 7.14653 8.07865 7.19738 8.44365 7.31793C8.59707 7.38238 8.73071 7.48633 8.83099 7.61917C9.00846 7.83063 9.23189 7.99874 9.48424 8.11066C9.93847 8.27381 10.4206 8.34511 10.9026 8.32043H11.9216C12.7947 8.32043 12.4627 8.37888 12.5422 8.43573C12.5806 8.46378 12.6045 8.48414 12.6367 8.63406C12.6762 8.88576 12.6936 9.14047 12.6886 9.39527C12.6886 9.42191 12.6913 9.44837 12.6967 9.47445H12.4385C12.0593 9.49602 11.6796 9.44518 11.3195 9.32472C11.1672 9.25961 11.0347 9.15567 10.9352 9.02339C10.7563 8.81137 10.5311 8.64316 10.277 8.5318C9.82735 8.37166 9.35083 8.30055 8.87403 8.3225H8.84712C8.46254 8.31359 8.07776 8.32475 7.69434 8.3559C7.39523 8.3497 7.1065 8.46566 6.89487 8.67721C6.68324 8.88867 6.56702 9.17734 6.57305 9.47642C6.54197 9.85984 6.53094 10.2446 6.54 10.6292V12.1544C6.38245 12.1516 6.22533 12.1368 6.07005 12.1101C5.92748 12.0775 5.91135 12.0572 5.8833 12.0156C5.8272 11.9326 5.77148 12.262 5.77148 11.3977V8.70789C5.77148 8.22868 5.77379 7.87519 5.79992 7.64234C5.82605 7.40949 5.87101 7.33031 5.90137 7.29992C5.93173 7.26952 6.01011 7.22571 6.24298 7.19963C6.47585 7.17355 6.83166 7.16811 7.31045 7.16811ZM8.84907 9.08949C9.23284 9.06801 9.61724 9.11876 9.98225 9.23932C10.1356 9.30358 10.2693 9.40743 10.3696 9.54009C10.547 9.75164 10.7705 9.91975 11.0229 10.0317C11.477 10.1952 11.9591 10.2666 12.4412 10.242L12.6917 10.2419C13.1709 10.2419 13.5248 10.2443 13.7573 10.2703C13.9898 10.2964 14.0693 10.3415 14.0997 10.3718C14.13 10.4021 14.1742 10.4805 14.2003 10.7133C14.2265 10.9462 14.2288 11.3001 14.2288 11.7789V12.1631C14.2288 12.642 14.2265 12.9966 14.2003 13.2291C14.1742 13.4615 14.13 13.5403 14.0997 13.5703C14.0693 13.6002 13.9901 13.6471 13.7573 13.6717C13.5244 13.6963 13.1709 13.6997 12.6917 13.6997H8.84907C8.36989 13.6997 8.01598 13.6974 7.7835 13.6717C7.55101 13.646 7.47147 13.6006 7.44112 13.5703C7.41077 13.54 7.36657 13.4612 7.34045 13.2291C7.31432 12.997 7.31201 12.6421 7.31201 12.1636V10.6266C7.31201 10.1477 7.31432 9.79348 7.34045 9.56138C7.36657 9.32928 7.41153 9.24935 7.4419 9.21858C7.47226 9.18781 7.55102 9.14438 7.78351 9.1183C8.01599 9.09221 8.37027 9.08949 8.84907 9.08949Z" fill="#FF6812" />
                                        </svg>

                                        <span>Choose From Library</span>

                                    </div>
                                    <div className="next-button" onClick={() => {
                                        navigate("/newquestion");
                                    }}>
                                        <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <circle cx="10" cy="10.3955" r="10" fill="white" />
                                            <path d="M10 6.89551V13.8955" stroke="#00C49A" stroke-linecap="round" stroke-linejoin="round" />
                                            <path d="M6.5 10.3955H13.5" stroke="#00C49A" stroke-linecap="round" stroke-linejoin="round" />
                                        </svg>
                                        <span>Create New Question</span>
                                    </div>

                                </div>
                            </div>

                            <div className="header-bar"></div>

                            <div className="header-container">
                                <div className="header">
                                    <div className="left">
                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M13.7254 9.93967L8.94536 14.7197C8.82153 14.8436 8.67448 14.942 8.51262 15.0091C8.35075 15.0762 8.17725 15.1107 8.00203 15.1107C7.82681 15.1107 7.65331 15.0762 7.49144 15.0091C7.32958 14.942 7.18253 14.8436 7.0587 14.7197L1.33203 8.99967V2.33301H7.9987L13.7254 8.05967C13.9737 8.30949 14.1131 8.64743 14.1131 8.99967C14.1131 9.35192 13.9737 9.68986 13.7254 9.93967V9.93967Z" stroke="#333333" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                            <path d="M4.66797 5.66699H4.67422" stroke="#333333" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                        </svg>
                                        <div className="title-span">
                                            <span className='skillset'>
                                                Javascript Skillset (8)
                                            </span>
                                            <span className='score'>Total Score: 50</span>
                                        </div>
                                    </div>

                                    <div className="input-type">
                                        <div className="select-box">
                                            <select name="" id="">
                                                <option value="all">All</option>
                                                <option value="MCQ">MCQ</option>
                                                <option value="Programming">Programming</option>
                                            </select>
                                            <svg className='vector-svg' width="14" height="8" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M1 1L7 7L13 1" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>

                                <div className="headerTwo">
                                    <div className="left">
                                        <div className="info">
                                            {/* <input type="checkbox" /> */}
                                            {selectAllCheck && selected.length ?
                                                <svg onClick={() => { setSelected([]); setselectAllCheck(false) }} width="20" height="20" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <rect width="15" height="15" rx="2" fill="#FF6812" />
                                                    <path d="M12 4.5L6.5 10L4 7.5" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                                </svg>

                                                : <svg onClick={() => {
                                                    selectAll(questionArray.length); setSelected(arr);
                                                }} width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <rect x="0.5" y="0.5" width="19" height="19" rx="1.5" stroke="#827C7C" />
                                                </svg>
                                            }

                                            <div className="title-span">
                                                <span className='mcq'>
                                                    MCQ (2)
                                                </span>
                                                <span className='score'>Total Score: 50</span>
                                            </div>
                                        </div>


                                        {selected.length ? <div className="remove" style={{ cursor: "pointer" }} onClick={() => { setmultipleDelete(true) }}>
                                            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M1.875 3.75H3.125H13.125" stroke="#F23E3E" stroke-linecap="round" stroke-linejoin="round" />
                                                <path d="M11.875 3.75V12.5C11.875 12.8315 11.7433 13.1495 11.5089 13.3839C11.2745 13.6183 10.9565 13.75 10.625 13.75H4.375C4.04348 13.75 3.72554 13.6183 3.49112 13.3839C3.2567 13.1495 3.125 12.8315 3.125 12.5V3.75M5 3.75V2.5C5 2.16848 5.1317 1.85054 5.36612 1.61612C5.60054 1.3817 5.91848 1.25 6.25 1.25H8.75C9.08152 1.25 9.39946 1.3817 9.63388 1.61612C9.8683 1.85054 10 2.16848 10 2.5V3.75" stroke="#F23E3E" stroke-linecap="round" stroke-linejoin="round" />
                                                <path d="M6.25 6.875V10.625" stroke="#F23E3E" stroke-linecap="round" stroke-linejoin="round" />
                                                <path d="M8.75 6.875V10.625" stroke="#F23E3E" stroke-linecap="round" stroke-linejoin="round" />
                                            </svg>
                                            <span>Remove Questions ({selected.length})</span>
                                        </div> : <></>}

                                    </div>
                                </div>
                            </div>
                        </div>

                        {questionArray?.map((data, index) => {
                            return (
                                <div className="row1" style={selected.indexOf(index + 1) >= 0 ? { border: "1px solid #00C49A" } : {}}>
                                    <div className="head">
                                        {selected.indexOf(index + 1) >= 0 ? <svg className='selected-check-box' onClick={() => { removeCheck(index + 1) }} width="20" height="20" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <rect width="15" height="15" rx="2" fill="#FF6812" />
                                            <path d="M12 4.5L6.5 10L4 7.5" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                        </svg>
                                            : <svg className='check-box' onClick={() => { setCheck(index + 1) }} width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <rect x="0.5" y="1.30664" width="19" height="19" rx="1.5" stroke="#827C7C" />
                                            </svg>

                                        }
                                        <div className="left" onClick={() => {
                                            setSelectedQuestion(data);
                                            setOpenPreview(true);
                                            setSelectedQuestion(data);
                                            setselectedQuestionIndex(index + 1);
                                            setquestionPreview(true);
                                        }} >

                                            <div className="difficulty">
                                                <svg width="32" height="32" viewBox="0 0 40 41" fill="none" xmlns="http://www.w3.org/2000/svg">
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

                                                <span>Easy</span>
                                            </div>
                                            <span>Javascript Problem</span>
                                        </div>
                                        <div className="right-side" onClick={() => {
                                            setSelectedQuestion(data);
                                            setOpenPreview(true);
                                            setSelectedQuestion(data);
                                            setselectedQuestionIndex(index + 1);
                                            setquestionPreview(true);
                                        }} >
                                            <svg width="22" height="21" viewBox="0 0 22 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M20.3504 8.44518C20.3132 8.28877 20.1564 8.19216 19.9994 8.22937C19.8429 8.26677 19.7463 8.42378 19.7837 8.58018C19.9369 9.22262 20.0148 9.90105 20.0148 10.5969C20.0148 15.5671 15.8805 19.6107 10.7987 19.6107C5.71684 19.6107 1.58263 15.5671 1.58263 10.5969C1.58263 5.62624 5.71684 1.58243 10.7987 1.58243C12.8226 1.58243 14.7559 2.22286 16.3894 3.43453C16.5182 3.53033 16.701 3.50333 16.7968 3.37412C16.8926 3.24492 16.8656 3.06251 16.7364 2.9667C15.0019 1.67983 12.9486 1 10.7987 1C5.39562 1 1 5.30502 1 10.5969C1 15.8883 5.39562 20.1934 10.7987 20.1934C16.2018 20.1934 20.5974 15.8883 20.5974 10.5969C20.5974 9.85585 20.5142 9.13201 20.3504 8.44518Z" fill="#00C49A" stroke="#00C49A" stroke-width="1.5" />
                                                <path d="M10.5941 14.9337C10.5169 14.9337 10.4429 14.9031 10.3881 14.8485L4.9252 9.38642C4.81139 9.27262 4.81139 9.08821 4.9252 8.9744C5.0388 8.8606 5.22321 8.8606 5.33702 8.9744L10.5819 14.2185L20.49 3.12071C20.5972 3.0007 20.7812 2.9903 20.9012 3.09751C21.0212 3.20471 21.0316 3.38872 20.9246 3.50873L10.8113 14.8365C10.7579 14.8963 10.6823 14.9315 10.6023 14.9337C10.5995 14.9337 10.5969 14.9337 10.5941 14.9337Z" fill="#00C49A" stroke="#00C49A" stroke-width="1.5" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="description" onClick={() => {
                                        setSelectedQuestion(data);
                                        setOpenPreview(true);
                                        setSelectedQuestion(data);
                                        setselectedQuestionIndex(index + 1);
                                        setquestionPreview(true);
                                    }} >
                                        <span>Given a URL, you have to write the main URL and the Given a URL, you have to write the main URL and the Given a URL, you have........</span>
                                    </div>
                                    <div className="bottom" onClick={() => {
                                        setSelectedQuestion(data);
                                        setOpenPreview(true);
                                        setSelectedQuestion(data);
                                        setselectedQuestionIndex(index + 1);
                                        setquestionPreview(true);
                                    }} >
                                        <div className="left-side">
                                            <div className="left-footer">
                                                <div className="health">
                                                    <svg width="15" height="16" viewBox="0 0 15 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M12.5378 3.42083C11.3304 2.16702 9.33361 2.16702 8.12623 3.42083L7.52255 4.07095C7.47611 4.11739 7.3368 4.11739 7.29036 4.07095L6.68667 3.42083C5.4793 2.16702 3.52892 2.16702 2.32155 3.42083C1.11417 4.67464 1.11417 6.71789 2.32155 7.9717L3.06455 8.7147L7.3368 13.1263C7.38323 13.1727 7.52255 13.1727 7.56898 13.1263L11.8412 8.7147L12.5842 7.9717C13.7916 6.71789 13.7916 4.67464 12.5378 3.42083Z" stroke="#F23E3E" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                                                        <path d="M4.17969 7.13531H5.57281L6.50156 6.20656L7.43031 8.06406L8.35906 5.74219L9.28781 7.13531H10.6809" stroke="#F23E3E" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                                                    </svg>
                                                    <span>Health 10/10</span>
                                                </div>
                                                <div className="side-bar"></div>
                                            </div>
                                            <div className="right-footer">
                                                <div className="score">
                                                    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M2.15937 1.09961H12.5594C12.9042 1.09961 13.2348 1.25179 13.4786 1.52268C13.7224 1.79356 13.8594 2.16096 13.8594 2.54405V6.87739C13.8594 8.79284 13.1746 10.6298 11.9556 11.9843C10.7366 13.3387 9.08328 14.0996 7.35937 14.0996C6.50578 14.0996 5.66055 13.9128 4.87193 13.5499C4.08332 13.1869 3.36676 12.6549 2.76318 11.9843C1.54419 10.6298 0.859375 8.79284 0.859375 6.87739V2.54405C0.859375 2.16096 0.996339 1.79356 1.24014 1.52268C1.48393 1.25179 1.81459 1.09961 2.15937 1.09961V1.09961Z" stroke="#827C7C" stroke-linecap="round" stroke-linejoin="round" />
                                                        <path d="M4.76953 6.15625L7.36953 9.04514L9.96953 6.15625" stroke="#827C7C" stroke-linecap="round" stroke-linejoin="round" />
                                                    </svg>
                                                    <span>Score: 05</span>
                                                </div>
                                                <div className="tags">
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
                                                    <span>Python + 3 more</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="selected">
                                            <div className="try-question">
                                                <svg width="15" height="16" viewBox="0 0 15 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M11.1469 8.25116V11.9662C11.1469 12.2946 11.0164 12.6096 10.7842 12.8418C10.5519 13.074 10.237 13.2045 9.90854 13.2045H3.09771C2.76928 13.2045 2.45431 13.074 2.22207 12.8418C1.98984 12.6096 1.85938 12.2946 1.85938 11.9662V5.15533C1.85938 4.8269 1.98984 4.51192 2.22207 4.27969C2.45431 4.04746 2.76928 3.91699 3.09771 3.91699H6.81271" stroke="#827C7C" stroke-linecap="round" stroke-linejoin="round" />
                                                    <path d="M9.28906 2.05957H13.0041V5.77457" stroke="#827C7C" stroke-linecap="round" stroke-linejoin="round" />
                                                    <path d="M6.19141 8.8704L13.0022 2.05957" stroke="#827C7C" stroke-linecap="round" stroke-linejoin="round" />
                                                </svg>
                                                <span onClick={(e) => {
                                                    onClickTryQuestion(e)
                                                }}>Try Question</span>
                                            </div>
                                            <div className="remove-question" onClick={() => { setDeleteSkillSetModel(true) }}>
                                                <svg width="15" height="16" viewBox="0 0 15 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <g clip-path="url(#clip0_2830_1967)">
                                                        <path d="M1.875 3.95215H3.125H13.125" stroke="#827C7C" stroke-linecap="round" stroke-linejoin="round" />
                                                        <path d="M11.875 3.95215V12.7021C11.875 13.0337 11.7433 13.3516 11.5089 13.586C11.2745 13.8205 10.9565 13.9521 10.625 13.9521H4.375C4.04348 13.9521 3.72554 13.8205 3.49112 13.586C3.2567 13.3516 3.125 13.0337 3.125 12.7021V3.95215M5 3.95215V2.70215C5 2.37063 5.1317 2.05269 5.36612 1.81826C5.60054 1.58384 5.91848 1.45215 6.25 1.45215H8.75C9.08152 1.45215 9.39946 1.58384 9.63388 1.81826C9.8683 2.05269 10 2.37063 10 2.70215V3.95215" stroke="#827C7C" stroke-linecap="round" stroke-linejoin="round" />
                                                        <path d="M6.25 7.07715V10.8271" stroke="#827C7C" stroke-linecap="round" stroke-linejoin="round" />
                                                        <path d="M8.75 7.07715V10.8271" stroke="#827C7C" stroke-linecap="round" stroke-linejoin="round" />
                                                    </g>
                                                    <defs>
                                                        <clipPath id="clip0_2830_1967">
                                                            <rect width="15" height="15" fill="white" transform="translate(0 0.202148)" />
                                                        </clipPath>
                                                    </defs>
                                                </svg>
                                                <span>Remove Question</span>
                                            </div>
                                        </div>


                                        <div className="question-type">
                                            <div className="mcq">
                                                <span>MCQ</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                        <div className="col">
                            <div className="header-container">
                                <div className="headerTwo">
                                    <div className="left">
                                        <div className="info">
                                            {/* <input type="checkbox" /> */}
                                            {1 == 0 ?
                                                <svg onClick={() => { }} width="20" height="20" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <rect width="15" height="15" rx="2" fill="#FF6812" />
                                                    <path d="M12 4.5L6.5 10L4 7.5" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                                </svg>

                                                : <svg onClick={() => {

                                                }} width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <rect x="0.5" y="0.5" width="19" height="19" rx="1.5" stroke="#827C7C" />
                                                </svg>
                                            }

                                            <div className="title-span">
                                                <span className='mcq'>
                                                    Programming (2)
                                                </span>
                                                <span className='score'>Total Score: 50</span>
                                            </div>
                                        </div>


                                        {1 == 0 ? <div className="remove" style={{ cursor: "pointer" }} onClick={() => { }}>
                                            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M1.875 3.75H3.125H13.125" stroke="#F23E3E" stroke-linecap="round" stroke-linejoin="round" />
                                                <path d="M11.875 3.75V12.5C11.875 12.8315 11.7433 13.1495 11.5089 13.3839C11.2745 13.6183 10.9565 13.75 10.625 13.75H4.375C4.04348 13.75 3.72554 13.6183 3.49112 13.3839C3.2567 13.1495 3.125 12.8315 3.125 12.5V3.75M5 3.75V2.5C5 2.16848 5.1317 1.85054 5.36612 1.61612C5.60054 1.3817 5.91848 1.25 6.25 1.25H8.75C9.08152 1.25 9.39946 1.3817 9.63388 1.61612C9.8683 1.85054 10 2.16848 10 2.5V3.75" stroke="#F23E3E" stroke-linecap="round" stroke-linejoin="round" />
                                                <path d="M6.25 6.875V10.625" stroke="#F23E3E" stroke-linecap="round" stroke-linejoin="round" />
                                                <path d="M8.75 6.875V10.625" stroke="#F23E3E" stroke-linecap="round" stroke-linejoin="round" />
                                            </svg>
                                            <span>Remove Questions ({selected.length})</span>
                                        </div> : <></>}

                                    </div>
                                </div>
                            </div>
                        </div>
                        {ProgrammingArray?.map((data, index) => {
                            return (
                                <div className="row1" style={1 == 0 ? { border: "1px solid #00C49A" } : {}}>
                                    <div className="head">
                                        {1 == 0 ? <svg className='selected-check-box' onClick={() => { }} width="20" height="20" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <rect width="15" height="15" rx="2" fill="#FF6812" />
                                            <path d="M12 4.5L6.5 10L4 7.5" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                        </svg>
                                            : <svg className='check-box' onClick={() => { }} width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <rect x="0.5" y="1.30664" width="19" height="19" rx="1.5" stroke="#827C7C" />
                                            </svg>

                                        }
                                        <div className="left">

                                            <div className="difficulty">
                                                <svg width="32" height="32" viewBox="0 0 40 41" fill="none" xmlns="http://www.w3.org/2000/svg">
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

                                                <span>Easy</span>
                                            </div>
                                            <span>Javascript Problem</span>
                                        </div>
                                        <div className="right-side">
                                            <svg width="22" height="21" viewBox="0 0 22 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M20.3504 8.44518C20.3132 8.28877 20.1564 8.19216 19.9994 8.22937C19.8429 8.26677 19.7463 8.42378 19.7837 8.58018C19.9369 9.22262 20.0148 9.90105 20.0148 10.5969C20.0148 15.5671 15.8805 19.6107 10.7987 19.6107C5.71684 19.6107 1.58263 15.5671 1.58263 10.5969C1.58263 5.62624 5.71684 1.58243 10.7987 1.58243C12.8226 1.58243 14.7559 2.22286 16.3894 3.43453C16.5182 3.53033 16.701 3.50333 16.7968 3.37412C16.8926 3.24492 16.8656 3.06251 16.7364 2.9667C15.0019 1.67983 12.9486 1 10.7987 1C5.39562 1 1 5.30502 1 10.5969C1 15.8883 5.39562 20.1934 10.7987 20.1934C16.2018 20.1934 20.5974 15.8883 20.5974 10.5969C20.5974 9.85585 20.5142 9.13201 20.3504 8.44518Z" fill="#00C49A" stroke="#00C49A" stroke-width="1.5" />
                                                <path d="M10.5941 14.9337C10.5169 14.9337 10.4429 14.9031 10.3881 14.8485L4.9252 9.38642C4.81139 9.27262 4.81139 9.08821 4.9252 8.9744C5.0388 8.8606 5.22321 8.8606 5.33702 8.9744L10.5819 14.2185L20.49 3.12071C20.5972 3.0007 20.7812 2.9903 20.9012 3.09751C21.0212 3.20471 21.0316 3.38872 20.9246 3.50873L10.8113 14.8365C10.7579 14.8963 10.6823 14.9315 10.6023 14.9337C10.5995 14.9337 10.5969 14.9337 10.5941 14.9337Z" fill="#00C49A" stroke="#00C49A" stroke-width="1.5" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="description">
                                        <span>Given a URL, you have to write the main URL and the Given a URL, you have to write the main URL and the Given a URL, you have........</span>
                                    </div>
                                    <div className="bottom">
                                        <div className="left-side">
                                            <div className="left-footer">
                                                <div className="health">
                                                    <svg width="15" height="16" viewBox="0 0 15 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M12.5378 3.42083C11.3304 2.16702 9.33361 2.16702 8.12623 3.42083L7.52255 4.07095C7.47611 4.11739 7.3368 4.11739 7.29036 4.07095L6.68667 3.42083C5.4793 2.16702 3.52892 2.16702 2.32155 3.42083C1.11417 4.67464 1.11417 6.71789 2.32155 7.9717L3.06455 8.7147L7.3368 13.1263C7.38323 13.1727 7.52255 13.1727 7.56898 13.1263L11.8412 8.7147L12.5842 7.9717C13.7916 6.71789 13.7916 4.67464 12.5378 3.42083Z" stroke="#F23E3E" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                                                        <path d="M4.17969 7.13531H5.57281L6.50156 6.20656L7.43031 8.06406L8.35906 5.74219L9.28781 7.13531H10.6809" stroke="#F23E3E" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                                                    </svg>
                                                    <span>Health 10/10</span>
                                                </div>
                                                <div className="side-bar"></div>
                                            </div>
                                            <div className="right-footer">
                                                <div className="score">
                                                    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M2.15937 1.09961H12.5594C12.9042 1.09961 13.2348 1.25179 13.4786 1.52268C13.7224 1.79356 13.8594 2.16096 13.8594 2.54405V6.87739C13.8594 8.79284 13.1746 10.6298 11.9556 11.9843C10.7366 13.3387 9.08328 14.0996 7.35937 14.0996C6.50578 14.0996 5.66055 13.9128 4.87193 13.5499C4.08332 13.1869 3.36676 12.6549 2.76318 11.9843C1.54419 10.6298 0.859375 8.79284 0.859375 6.87739V2.54405C0.859375 2.16096 0.996339 1.79356 1.24014 1.52268C1.48393 1.25179 1.81459 1.09961 2.15937 1.09961V1.09961Z" stroke="#827C7C" stroke-linecap="round" stroke-linejoin="round" />
                                                        <path d="M4.76953 6.15625L7.36953 9.04514L9.96953 6.15625" stroke="#827C7C" stroke-linecap="round" stroke-linejoin="round" />
                                                    </svg>
                                                    <span>Score: 05</span>
                                                </div>
                                                <div className="tags">
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
                                                    <span>Python + 3 more</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="selected">
                                            <div className="try-question">
                                                <svg width="15" height="16" viewBox="0 0 15 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M11.1469 8.25116V11.9662C11.1469 12.2946 11.0164 12.6096 10.7842 12.8418C10.5519 13.074 10.237 13.2045 9.90854 13.2045H3.09771C2.76928 13.2045 2.45431 13.074 2.22207 12.8418C1.98984 12.6096 1.85938 12.2946 1.85938 11.9662V5.15533C1.85938 4.8269 1.98984 4.51192 2.22207 4.27969C2.45431 4.04746 2.76928 3.91699 3.09771 3.91699H6.81271" stroke="#827C7C" stroke-linecap="round" stroke-linejoin="round" />
                                                    <path d="M9.28906 2.05957H13.0041V5.77457" stroke="#827C7C" stroke-linecap="round" stroke-linejoin="round" />
                                                    <path d="M6.19141 8.8704L13.0022 2.05957" stroke="#827C7C" stroke-linecap="round" stroke-linejoin="round" />
                                                </svg>
                                                <span onClick={(e) => {
                                                    onClickTryQuestion(e)
                                                }}>Try Question</span>
                                            </div>
                                            <div className="remove-question" onClick={() => { setDeleteSkillSetModel(true) }}>
                                                <svg width="15" height="16" viewBox="0 0 15 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <g clip-path="url(#clip0_2830_1967)">
                                                        <path d="M1.875 3.95215H3.125H13.125" stroke="#827C7C" stroke-linecap="round" stroke-linejoin="round" />
                                                        <path d="M11.875 3.95215V12.7021C11.875 13.0337 11.7433 13.3516 11.5089 13.586C11.2745 13.8205 10.9565 13.9521 10.625 13.9521H4.375C4.04348 13.9521 3.72554 13.8205 3.49112 13.586C3.2567 13.3516 3.125 13.0337 3.125 12.7021V3.95215M5 3.95215V2.70215C5 2.37063 5.1317 2.05269 5.36612 1.81826C5.60054 1.58384 5.91848 1.45215 6.25 1.45215H8.75C9.08152 1.45215 9.39946 1.58384 9.63388 1.81826C9.8683 2.05269 10 2.37063 10 2.70215V3.95215" stroke="#827C7C" stroke-linecap="round" stroke-linejoin="round" />
                                                        <path d="M6.25 7.07715V10.8271" stroke="#827C7C" stroke-linecap="round" stroke-linejoin="round" />
                                                        <path d="M8.75 7.07715V10.8271" stroke="#827C7C" stroke-linecap="round" stroke-linejoin="round" />
                                                    </g>
                                                    <defs>
                                                        <clipPath id="clip0_2830_1967">
                                                            <rect width="15" height="15" fill="white" transform="translate(0 0.202148)" />
                                                        </clipPath>
                                                    </defs>
                                                </svg>
                                                <span>Remove Question</span>
                                            </div>
                                        </div>


                                        <div className="question-type">
                                            <div className="mcq">
                                                <span>Programming</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div >
    );
}

export default DetailedQuestion;