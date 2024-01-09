import { createContext,useState } from "react";

const CreateQuestionContext = createContext({
    questionTile:'',
    score:'',
    selectedDifficultyLevel:'easy',
    skills:[],
    topics:[],
    question:'',
    answersObjectArray:[],
    correctAnswerObjectArray:[],
    correctAnswerType:'',
    setQuestionTitle: () => { },
    setQuestionscore: () => { },
    setQuestionDifficultyLevel: () => { },
    setQuestionSkills: () => { },
    setQuestiontopics: () => { },
    setQuestionName: () => { },
    setQuestionanswersObjectArray: () =>{ },
    setcorrectAnswerObjectArray: () => { },
    setQuestionCorrectAnswerType: () => { },
    clearQuestion: () =>{}
})

export const CreateQuestionProvider=({ children })=>{
    const [questionTitle,setquestionTitle]=useState('')
    const [score,setscore]=useState('')
    const [selectedDifficultyLevel,setselectedDifficultyLevel]=useState('easy')
    const [skills,setskills]=useState([])
    const [topics,settopics]=useState([])
    const [question,setquestion]=useState('')
    const [answersObjectArray,setanswersObjectArray]=useState([])
    const [correctAnswerObjectArray,setcorrectAnswerObjectArray]=useState([])
    const [correctAnswerType,setcorrectAnswerType]=useState('')
    const setQuestionTitle=(title)=>{
        setquestionTitle(title)
    }

    const setQuestionScore=(score)=>{
        setscore(score.slice(0, 3))
    }

    const setQuestionDifficultyLevel=(level)=>{
        setselectedDifficultyLevel(level)
    }

    const setQuestionSkills=(skills)=>{
        setskills(skills)
    }

    const setQuestionTopics=(topics)=>{
        settopics(topics)
    }
    const setQuestionName=(name)=>{
        setquestion(name)
    }
    const setQuestionAnswersArray=(answerOption)=>{
        setanswersObjectArray(answerOption)
    }

    const setQuestionCorrectAnwers=(correctAnwser)=>{
        setcorrectAnswerObjectArray(correctAnwser)
    }

    const setQuestionCorrectAnwserType=(type)=>{
        setcorrectAnswerType(type)
    }  
    
    const clearQuestionState=()=>{
        setquestionTitle('')
        setscore('')
        setselectedDifficultyLevel('easy')
        setskills([])
        settopics([])
        setquestion('')
        setanswersObjectArray([])
        setcorrectAnswerObjectArray([])
        setcorrectAnswerType('')
    }
    const context={
        questionTile:questionTitle,
        score:score,
        selectedDifficultyLevel:selectedDifficultyLevel,
        skills:skills,
        topics:topics,
        question:question,
        answersObjectArray:answersObjectArray,
        correctAnswerObjectArray:correctAnswerObjectArray,
        correctAnswerType:correctAnswerType,
        setQuestionTitle:setQuestionTitle,
        setQuestionscore:setQuestionScore,
        setQuestionDifficultyLevel:setQuestionDifficultyLevel,
        setQuestionSkills:setQuestionSkills,
        setQuestiontopics:setQuestionTopics,
        setQuestionName:setQuestionName,
        setQuestionanswersObjectArray:setQuestionAnswersArray,
        setcorrectAnswerObjectArray:setQuestionCorrectAnwers,
        setQuestionCorrectAnswerType:setQuestionCorrectAnwserType,
        clearQuestion:clearQuestionState
    }

    return(
        <CreateQuestionContext.Provider value={context} >{children}</CreateQuestionContext.Provider>
    )
}

export default CreateQuestionContext