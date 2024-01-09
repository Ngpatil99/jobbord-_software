import React, { useState, useContext } from 'react'
import { toast } from 'react-toastify'
import MCQBulkContext from '../../store/MCQBulkContext'
import './index.css'

const LeftSidePanelOfMCQBulk = (props) => {
    const BulkContext = useContext(MCQBulkContext)
    const [selectAll, setselectAll] = useState(true)

    const selectAllQuestion = () => {
        setselectAll(() => !selectAll)
        BulkContext.mcqBulkData.forEach(data => {
            if (selectAll) {
                BulkContext.selectAllQuestion(data)
                BulkContext.selectpreviewQuestion(data._id)
            } else {
                BulkContext.deleteSelectQuestion([])
            }
        })
    }

    const onClickQuestionNo = (data) => {
        BulkContext.selectQuestion(data);
        if (BulkContext.previewQuestion.includes(data?._id)) {
            BulkContext.selectpreviewQuestion(BulkContext.mcqBulkData[0]._id)
        }
        if (BulkContext.selectedQuestion.includes(data._id) !== true) {

            BulkContext.selectpreviewQuestion(data?._id)
        }
    }

    const trackNoOfQuestionNotDeletedOrMoved = () => {
        let cnt = 0;
        BulkContext.mcqBulkData.forEach(data => {
            if (BulkContext.selectedQuestion.includes(data._id) && data.isQuestionDeleted !=="true" && data.moveToLibraryStatus !=="true") {
                cnt += 1
            }
        })
        return cnt
    }
    return (
        <div className='left-panel-of-mcq-bulk-container' >
            <div className='select-all-container' >
                {selectAll ?
                    <div onClick={() => selectAllQuestion()} style={{ background: "transparent", borderWidth: 1.5, borderStyle: 'solid', borderColor: 'white' }} className="checkbox-container" >

                    </div> :
                    <div onClick={() => selectAllQuestion()} className="checkbox-container" >
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect width="20" height="20" rx="2" fill="white" />
                            <path d="M14 8L8.5 13.5L6 11" stroke="#999999" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>

                    </div>

                }
                <span>Select All</span>
            </div>
            {BulkContext.selectedQuestion.length?
            <div onClick={()=>props.onClickDelete()} className='delete-button-container' >Delete ({trackNoOfQuestionNotDeletedOrMoved()})</div>:<></>
            }
            <div style={{ cursor: 'pointer' }} className='question-number-container' >
                {BulkContext?.mcqBulkData.map((data) => {
                    return (
                        <div data-tip={data.moveToLibraryStatus === "true" ? "This Question Is Moved To Library" : data.isQuestionDeleted === "true" ?"This Question Is Deleted":""} style={BulkContext.selectedQuestion.includes(data?._id) ? (data.moveToLibraryStatus === "true" ? { background: '#999999', color: 'white' } : (data.isQuestionDeleted === "true" ? { background: 'red', color: 'white' } : { background: '#00C49A', color: 'white' })) : (data.moveToLibraryStatus === "true" ? { background: '#999999', color: 'white' } : data.isQuestionDeleted === "true" ? { background: 'red', color: 'white' } : {})} onClick={() => onClickQuestionNo(data)} className='question-box' >
                            Q.{data.questionIndex + 1}
                        </div>
                    )
                })
                }
            </div>
        </div>
    )
}

export default LeftSidePanelOfMCQBulk