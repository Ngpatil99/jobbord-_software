import React, { useContext, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import MCQBulkContext from '../../store/MCQBulkContext'
import './index.css'
import ReactTooltip from 'react-tooltip'
let currenSelectIndex = 0;
const BulkImportedLeftPanel = ({onClickBackNextSelect}) => {
    const BulkContext = useContext(MCQBulkContext)
    const [refreshScreen, setrefreshScreen] = useState(false)

    useEffect(() => {
        if (BulkContext.previewQuestion !== "") {
            const selectedQuestion = BulkContext.mcqBulkData.filter((data) => {
                if (data._id === BulkContext.previewQuestion) {
                    return data
                }
            })
            currenSelectIndex = selectedQuestion[0].questionIndex
        }
    }, [])

    const onClickBack = () => {
        onClickBackNextSelect()
        BulkContext.mcqBulkData.forEach((data, index) => {
            if (currenSelectIndex === 0) return
            if (currenSelectIndex - 1 === index) {
                if (BulkContext.mcqBulkData[currenSelectIndex - 1].moveToLibraryStatus === "true" || BulkContext.mcqBulkData[currenSelectIndex - 1].isQuestionDeleted === "true") {
                    
                    currenSelectIndex -= 1
                    onClickBack()
                } else {
                    BulkContext.selectpreviewQuestion(BulkContext.mcqBulkData[currenSelectIndex - 1]._id) 
                    currenSelectIndex -= 1
                    setrefreshScreen(true)
                }
            }
        })
    }

    const onClickNext = () => {
        onClickBackNextSelect()
        if (currenSelectIndex === BulkContext.mcqBulkData.length) return
        if (BulkContext.mcqBulkData[currenSelectIndex + 1].moveToLibraryStatus === "true" || BulkContext.mcqBulkData[currenSelectIndex + 1].isQuestionDeleted === "true" ) {
            
            currenSelectIndex += 1
            onClickNext()
        } else {
            BulkContext.selectpreviewQuestion(BulkContext.mcqBulkData[currenSelectIndex + 1]._id)
            currenSelectIndex += 1
            setrefreshScreen(true)
            return
        }


    }

    const onClickQuestionIndex = (data, index) => {
        onClickBackNextSelect()
        if (data.moveToLibraryStatus === "false" && data.isQuestionDeleted === "false") {
            onClickBackNextSelect()
            currenSelectIndex = index
            BulkContext.selectpreviewQuestion(data?._id)
            setrefreshScreen(true)
        } else {
            toast(`${data.moveToLibraryStatus === "true"?'added':'deleted'} question cant preview`)
        }
    }
    return (
        <div className='bulk-imported-left-panel' >
            <div className='select-all-container' >

                <span>Bulk MCQ<br /> Imported</span>
                <div className='next-and-prev-button-container' >
                    <span onClick={onClickBack} className='prev-button-container' >
                        <svg width="7" height="11" viewBox="0 0 7 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M6.05332 9.57833L1.74609 5.2711L6.05332 0.963867" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                    </span>
                    <span onClick={onClickNext} className='prev-button-container' >
                        <svg width="7" height="11" viewBox="0 0 7 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1.55605 1.18046L5.86328 5.48769L1.55605 9.79492" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>

                    </span>

                </div>
            </div>

            <div className='question-number-container' >
                {BulkContext?.mcqBulkData.map((data, index) => {
                    return (
                        <div data-tip={data.moveToLibraryStatus === "true" ? "This Question Is Moved To Library" : data.isQuestionDeleted === "true" ?"This Question Is Deleted":""} style={BulkContext?.previewQuestion?.includes(data?._id) ? (data.moveToLibraryStatus === "true" ? { background: '#999999', color: 'white' } : (data.isQuestionDeleted === "true" ? { background: 'red', color: 'white' } : { background: '#00C49A', color: 'white' })) : (data.moveToLibraryStatus === "true" ? { background: '#999999', color: 'white' } : data.isQuestionDeleted === "true" ? { background: 'red', color: 'white' } : {})} onClick={() => onClickQuestionIndex(data, index)} className='question-box' >
                            Q.{data.questionIndex + 1}
                        </div>
                    )
                })
                }
            </div>
            <ReactTooltip/>
        </div>
    )
}

export default BulkImportedLeftPanel