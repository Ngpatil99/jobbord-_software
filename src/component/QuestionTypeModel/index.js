import Button from '@mui/material/Button';
import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import QueCodeModal from '../QuestionTypeCodeModal';
import Layout from "../QuestionTypeCodeModal/Layout";
import './index.css';
const QuestionTypeModel = (props) => {
    const [modalOpen, setModalOpen] = useState(false);

    const handleOpen = () => {
      setModalOpen(true);
    };
  
    const handleClose = () => {
      setModalOpen(false);
    };
    const navigate = useNavigate()
    return (
        <div className="question-type-parent-container" >
            <div>
                <QueCodeModal isOpen={modalOpen} handleClose={handleClose}>
                        <Layout/>
                    {/* <Button variant="contained" onClick={handleClose}>
                        Close Modal
                    </Button> */}
                </QueCodeModal>
            </div>
            <div className="question-type-model-container" >
                <svg onClick={props.closeQuestionTypeModel} className="close-button" width="14" height="15" viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M12.0032 13.9813L7.00642 8.985L2.01082 13.9813C1.55102 14.441 0.805358 14.4412 0.345266 13.9815C-0.114825 13.5219 -0.115113 12.7761 0.344547 12.3161L5.34122 7.31986L0.344476 2.32245C-0.102534 1.86017 -0.0962087 1.12477 0.358851 0.670542C0.813839 0.216023 1.54922 0.210848 2.01082 0.658468L7.00642 5.65473L12.0032 0.658468C12.4666 0.222348 13.1925 0.233272 13.6426 0.683192C14.0927 1.13282 14.1041 1.85873 13.6684 2.32245L8.67162 7.31986L13.6684 12.3161C14.1157 12.7781 14.1098 13.5135 13.6551 13.968C13.2004 14.4228 12.4651 14.4286 12.0031 13.9813H12.0032Z" fill="#99B2C6" />
                </svg>

                <label>Choose Question Type</label>
                <div className="border" >1</div>
                <div className="code-mcq-container" >
                    <div onClick={handleOpen} className="code-container" >
                        <div className="code-svg-container" >
                            <svg width="55" height="55" viewBox="0 0 55 55" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M36.666 41.25L50.416 27.5L36.666 13.75" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M18.334 13.75L4.58398 27.5L18.334 41.25" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>

                        </div>
                        <label>CODE</label>
                    </div>

                    <div onClick={() => {
                        props.questionPopUp()
                    }} className="mcq-container" >
                        <div className="mcq-svg-container" >
                            <svg width="45" height="45" viewBox="0 0 45 45" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M15 11.25H39.375" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M15 22.5H39.375" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M15 33.75H39.375" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M5.625 11.25H5.64464" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M5.625 22.5H5.64464" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M5.625 33.75H5.64464" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>

                        </div>
                        <label>MCQ</label>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default QuestionTypeModel