import React,{useEffect,useState} from 'react';
import ReactTooltip from 'react-tooltip';
import './index.css';
const QuestionPreviewModel = (props) => {
    const { question, difficultyLevelId, type, noOfTimesUsed, score, skillsId, Section_header, sourceSelected, answersObjectArray, correctAnswerObjectArray, correctAnswerType } = props.data;
    const [topics,settopics]=useState([])
    const healthaCalculate = () => {
        if (noOfTimesUsed > 0 && noOfTimesUsed <= 10) {
            return 1;
        } else if (noOfTimesUsed > 10 && noOfTimesUsed <= 20) {

            return 2;
        } else if (noOfTimesUsed > 20 && noOfTimesUsed <= 30) {

            return 3;
        } else if (noOfTimesUsed > 30 && noOfTimesUsed <= 40) {

            return 4;
        } else if (noOfTimesUsed > 40 && noOfTimesUsed <= 50) {

            return 5;
        } else if (noOfTimesUsed > 50 && noOfTimesUsed <= 60) {

            return 6;
        } else if (noOfTimesUsed > 60 && noOfTimesUsed <= 70) {

            return 7;
        } else if (noOfTimesUsed > 70 && noOfTimesUsed <= 80) {

            return 8;
        } else if (noOfTimesUsed > 80 && noOfTimesUsed <= 90) {

            return 9;
        } else if (noOfTimesUsed > 90) {

            return 10;
        }


    };

    const EditQuestion = () => {
        props.onClickEdit();
    };

    useEffect(()=>{
        skillsId?.forEach((data)=>{
            data?.topicId?.forEach((topic)=>{
                settopics(prev=>[...prev,topic])
            })
        })
        // eslint-disable-next-line
    },[])
    return (
        <div className='question-preview-model-parent' >
            <svg onClick={() => props.onClickCancel()} className='cancel-icon' width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="20" cy="20" r="20" fill="white" />
                <rect width="17.7778" height="17.7778" transform="translate(6.6875 20.7412) rotate(-45)" fill="white" />
                <path d="M15.5918 17.0752L22.9248 24.4082" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M15.5918 24.4072L22.9248 17.0743" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>

            <div className='model-container' >
                <div className='header' >
                    <span>
                        <svg width="35" height="35" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="17.5" cy="17.5" r="17.5" fill="#00C49A" fill-opacity="0.1" />
                            <g clip-path="url(#clip0_2248_3588)">
                                <path d="M24.3859 12.2744H11.3419C11.0948 12.2744 10.8578 12.3726 10.683 12.5473C10.5083 12.722 10.4102 12.959 10.4102 13.2061V22.5233C10.4102 22.7704 10.5083 23.0073 10.683 23.1821C10.8578 23.3568 11.0948 23.455 11.3419 23.455H24.3859C24.633 23.455 24.8699 23.3568 25.0447 23.1821C25.2194 23.0073 25.3176 22.7704 25.3176 22.5233V13.2061C25.3176 12.959 25.2194 12.722 25.0447 12.5473C24.8699 12.3726 24.633 12.2744 24.3859 12.2744V12.2744ZM24.3859 22.5233H11.3419V13.2061H24.3859V22.5233Z" fill="#00C49A" />
                                <path d="M13.6709 16.001H22.0564C22.1799 16.001 22.2984 15.952 22.3858 15.8646C22.4731 15.7772 22.5222 15.6587 22.5222 15.5352C22.5222 15.4116 22.4731 15.2931 22.3858 15.2058C22.2984 15.1184 22.1799 15.0693 22.0564 15.0693H13.6709C13.5474 15.0693 13.4289 15.1184 13.3415 15.2058C13.2542 15.2931 13.2051 15.4116 13.2051 15.5352C13.2051 15.6587 13.2542 15.7772 13.3415 15.8646C13.4289 15.952 13.5474 16.001 13.6709 16.001V16.001Z" fill="#00C49A" />
                                <path d="M13.6709 17.8653H22.0564C22.1799 17.8653 22.2984 17.8162 22.3858 17.7289C22.4731 17.6415 22.5222 17.523 22.5222 17.3995C22.5222 17.2759 22.4731 17.1574 22.3858 17.07C22.2984 16.9827 22.1799 16.9336 22.0564 16.9336H13.6709C13.5474 16.9336 13.4289 16.9827 13.3415 17.07C13.2542 17.1574 13.2051 17.2759 13.2051 17.3995C13.2051 17.523 13.2542 17.6415 13.3415 17.7289C13.4289 17.8162 13.5474 17.8653 13.6709 17.8653V17.8653Z" fill="#00C49A" />
                                <path d="M13.6709 19.7286H18.3295C18.4531 19.7286 18.5715 19.6795 18.6589 19.5921C18.7463 19.5048 18.7954 19.3863 18.7954 19.2627C18.7954 19.1392 18.7463 19.0207 18.6589 18.9333C18.5715 18.846 18.4531 18.7969 18.3295 18.7969H13.6709C13.5474 18.7969 13.4289 18.846 13.3415 18.9333C13.2542 19.0207 13.2051 19.1392 13.2051 19.2627C13.2051 19.3863 13.2542 19.5048 13.3415 19.5921C13.4289 19.6795 13.5474 19.7286 13.6709 19.7286V19.7286Z" fill="#00C49A" />
                            </g>
                            <defs>
                                <clipPath id="clip0_2248_3588">
                                    <rect width="16.7708" height="16.7708" fill="white" transform="translate(9.47852 9.47949)" />
                                </clipPath>
                            </defs>
                        </svg>
                        <label>Question {props?.selectedQuestionIndex} Preview</label>
                    </span>

                    <button onClick={EditQuestion} >
                        <svg width="15" height="14" viewBox="0 0 15 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <ellipse cx="7.5" cy="7" rx="7.5" ry="7" fill="white" />
                            <path d="M9.53894 4.25068C9.61841 4.1712 9.71276 4.10816 9.8166 4.06515C9.92044 4.02214 10.0317 4 10.1441 4C10.2565 4 10.3678 4.02214 10.4717 4.06515C10.5755 4.10816 10.6698 4.1712 10.7493 4.25068C10.8288 4.33015 10.8918 4.4245 10.9349 4.52834C10.9779 4.63218 11 4.74348 11 4.85587C11 4.96826 10.9779 5.07956 10.9349 5.1834C10.8918 5.28724 10.8288 5.38159 10.7493 5.46106L6.66428 9.54611L5 10L5.45389 8.33572L9.53894 4.25068Z" stroke="black" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>

                        <label>Edit</label>
                    </button>
                </div>

                <div className='question-details-card' >
                    <div className='header' >
                        <div className='level-question-container' >
                            <span style={difficultyLevelId?.level === "easy" ? { background: '#D6FFF6' } : difficultyLevelId?.level === "medium" ? { background: '#FEE9E1' } : { background: '#FFE4CB' }} >
                                <svg width="41" height="41" viewBox="0 0 41 41" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="20.4727" cy="20.0664" r="20" fill={difficultyLevelId?.level === "easy" ? '#00C49A' : difficultyLevelId?.level === "medium" ? '#FF9736' : '#FF6812'} />
                                    <g clip-path="url(#clip0_2248_3616)">
                                        <path d="M20.8477 22.7852C23.868 22.7852 26.3164 20.3367 26.3164 17.3164C26.3164 14.2961 23.868 11.8477 20.8477 11.8477C17.8273 11.8477 15.3789 14.2961 15.3789 17.3164C15.3789 20.3367 17.8273 22.7852 20.8477 22.7852Z" stroke="white" stroke-linecap="round" stroke-linejoin="round" />
                                        <path d="M17.8867 21.918L16.9414 29.0352L20.8477 26.6914L24.7539 29.0352L23.8086 21.9102" stroke="white" stroke-linecap="round" stroke-linejoin="round" />
                                    </g>
                                    <defs>
                                        <clipPath id="clip0_2248_3616">
                                            <rect width="18.75" height="18.75" fill="white" transform="translate(11.4727 11.0664)" />
                                        </clipPath>
                                    </defs>
                                </svg>
                                <label>{difficultyLevelId?.level}</label>
                            </span>
                            <label>Q{props?.selectedQuestionIndex}. {Section_header}</label>
                        </div>

                        <div className='type-library-cotainer' >
                            <span data-tip={type} style={{ cursor: 'default' }} className='type-label' >{type}</span>
                            <div className='border' ></div>
                            <span style={{ cursor: 'default' }} className='library-label' >{sourceSelected}</span>
                        </div>


                    </div>
                    <div className='card-border' ></div>
                    <div className='model-bottom-container' >
                        <span data-tip="Health" >
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M13.5144 3.88763C12.307 2.63381 10.3102 2.63381 9.1028 3.88763L8.49911 4.53775C8.45267 4.58419 8.31336 4.58419 8.26692 4.53775L7.66323 3.88763C6.45586 2.63381 4.50548 2.63381 3.29811 3.88763C2.09073 5.14144 2.09073 7.18469 3.29811 8.4385L4.04111 9.1815L8.31336 13.5931C8.3598 13.6395 8.49911 13.6395 8.54555 13.5931L12.8178 9.1815L13.5608 8.4385C14.7682 7.18469 14.7682 5.14144 13.5144 3.88763Z" stroke="#F23E3E" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M5.15625 7.60211H6.54937L7.47812 6.67336L8.40687 8.53086L9.33562 6.20898L10.2644 7.60211H11.6575" stroke="#F23E3E" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                            <label style={{ color: '#F23E3E' }} >Health {healthaCalculate()}/10</label>
                        </span>
                        <div className='card-border1' ></div>
                        <span data-tip="Score" style={{ marginLeft: 5 }} >
                            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M2.13594 0.566406H12.5359C12.8807 0.566406 13.2114 0.718588 13.4552 0.989474C13.699 1.26036 13.8359 1.62776 13.8359 2.01085V6.34418C13.8359 8.25964 13.1511 10.0966 11.9321 11.4511C10.7131 12.8055 9.05984 13.5664 7.33594 13.5664C6.48235 13.5664 5.63711 13.3796 4.84849 13.0166C4.05988 12.6537 3.34332 12.1217 2.73974 11.4511C1.52076 10.0966 0.835938 8.25964 0.835938 6.34418V2.01085C0.835937 1.62776 0.972901 1.26036 1.2167 0.989474C1.4605 0.718588 1.79116 0.566406 2.13594 0.566406V0.566406Z" stroke="#827C7C" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M4.74609 5.62305L7.34609 8.51194L9.94609 5.62305" stroke="#827C7C" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                            <label>Score: {score}</label>
                        </span>

                        <span data-tip={skillsId.map((data)=>{return data?.skills.skills})} style={{ marginLeft: 30 }} >
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M13.7047 8.94766L9.22344 13.4289C9.10735 13.5451 8.96949 13.6373 8.81774 13.7002C8.66599 13.7631 8.50333 13.7955 8.33906 13.7955C8.17479 13.7955 8.01213 13.7631 7.86039 13.7002C7.70864 13.6373 7.57078 13.5451 7.45469 13.4289L2.08594 8.06641V1.81641H8.33594L13.7047 7.18516C13.9375 7.41936 14.0682 7.73617 14.0682 8.06641C14.0682 8.39664 13.9375 8.71345 13.7047 8.94766V8.94766Z" stroke="#827C7C" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M5.21094 4.94141H5.21719" stroke="#827C7C" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                            
                            {skillsId?.map((data, index) => {
                                
                                if (index < 2) {
                                    return (
                                        <label >{data?.skills?.skills}{index !== skillsId?.length - 1 ? "," : ""}</label>
                                    );
                                } else if(index === 2) {
                                    return (
                                        <label >+{skillsId?.length - 2}</label>
                                    );
                                }
                            })

                            }
                        </span>

                        <span data-tip={topics.map((data=>{return data?.topic}))} style={{ marginLeft: 30 }} >
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M2.71094 8.06641H13.9609" stroke="#827C7C" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M2.71094 4.31641H13.9609" stroke="#827C7C" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M2.71094 11.8164H13.9609" stroke="#827C7C" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                            {topics?.map((data,index) => {
                                if (index < 2) {
                                    return (
                                        <label>{data?.topic}{index !== topics?.length - 1 ? "," : ""}</label>

                                    );
                                } else if(index===2) {
                                    return (
                                        <label >+{topics?.length - 2}</label>
                                    );
                                }
                                })
                                
                            }
                        </span>
                    </div>


                </div>

                <div className='problem-solution-container' >
                    <div className='problem-container' >
                        <label>Problem</label>
                        <textarea style={{ cursor: 'default',resize: 'none' }} readOnly={true} value={question} placeholder='add some text' >

                        </textarea>
                    </div>

                    <div className='solution-container' >
                        <div className='header' >
                            <label>Solution</label>
                            <span>
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
                        {answersObjectArray?.map((data, index) => {
                            return (
                                <div style={correctAnswerObjectArray.includes(correctAnswerType === "Yes" ? `${data.optionId}` : data.optionId) ? { border: '1px solid #00C49A' } : {}} className='answer-input' >
                                    <span style={{ cursor: 'default' }} >{index + 1}. {data===true||data===false?data.option+'':data.option}</span>
                                    {correctAnswerObjectArray.includes(correctAnswerType === "Yes" ? `${data.optionId}` : data.optionId) ?
                                        <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <rect y="0.466797" width="20" height="20" rx="2" fill="#00C49A" />
                                            <path d="M14 8.4668L8.5 13.9668L6 11.4668" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                        </svg> : <></>
                                    }


                                </div>
                            );
                        })
                        }



                    </div>
                </div>
            </div>
            <ReactTooltip />
        </div>

    );
};

export default QuestionPreviewModel;