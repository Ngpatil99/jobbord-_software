import { createContext, useState } from "react"
const MCQBulkContext = createContext({
    mcqBulkData: [],
    selectedQuestion: [],
    previewQuestion: [],
    readDataFromS3: () => { },
    selectQuestion: () => { },
    selectpreviewQuestion: () => { },
})

export const BulkMCQProvider = ({ children }) => {
    const [mcqBulkData, setmcqBulkData] = useState(null)
    const [selectedQuestion, setselectedQuestion] = useState([])
    const [previewQuestion, setpreviewQuestion] = useState([])
    const selectQuestion = (data) => {
        if (selectedQuestion.includes(data._id)) {
            const filterQuestion = selectedQuestion.filter(element => element !== data._id)
            setselectedQuestion(() => filterQuestion)
        } else {
            setselectedQuestion(prev => [...prev, data._id])
        }
    }
    const selectAllQuestion = (data) => {
        setselectedQuestion(prev => [...prev, data._id])
    }
    const readDataFromS3 = (data) => {
        setmcqBulkData(() => data)
    }

    const deleteSelectQuestion = (data) => {
        setselectedQuestion(() => data)
    }

    const selectpreviewQuestion = (data) => {
        setpreviewQuestion(data)
    }
    const context = {
        mcqBulkData: mcqBulkData,
        readDataFromS3: readDataFromS3,
        selectedQuestion: selectedQuestion,
        selectQuestion: selectQuestion,
        selectAllQuestion:selectAllQuestion,
        deleteSelectQuestion: deleteSelectQuestion,
        previewQuestion: previewQuestion,
        selectpreviewQuestion: selectpreviewQuestion
    }

    return (
        <MCQBulkContext.Provider value={context}>{children}</MCQBulkContext.Provider>
    )
}

export default MCQBulkContext