import React from 'react'
import './index.css'

function TestCard(props) {
    const healthaCalculate = () => {
        if (props.data.noOfTimesUsed > 0 && props.data.noOfTimesUsed <= 10) {
            return 1
        } else if (props.data.noOfTimesUsed > 10 && props.data.noOfTimesUsed <= 20) {

            return 2
        } else if (props.data.noOfTimesUsed > 20 && props.data.noOfTimesUsed <= 30) {

            return 3
        } else if (props.data.noOfTimesUsed > 30 && props.data.noOfTimesUsed <= 40) {

            return 4
        } else if (props.data.noOfTimesUsed > 40 && props.data.noOfTimesUsed <= 50) {

            return 5
        } else if (props.data.noOfTimesUsed > 50 && props.data.noOfTimesUsed <= 60) {

            return 6
        } else if (props.data.noOfTimesUsed > 60 && props.data.noOfTimesUsed <= 70) {

            return 7
        } else if (props.data.noOfTimesUsed > 70 && props.data.noOfTimesUsed <= 80) {

            return 8
        } else if (props.data.noOfTimesUsed > 80 && props.data.noOfTimesUsed <= 90) {

            return 9
        } else if (props.data.noOfTimesUsed > 90) {

            return 10
        }


    }

    const onClickTryQuestion=(e,id)=>{
        e.stopPropagation()
       let url= `https://www.assessment.theeliteqa.com/test4?id=${id}&page=${'library'}`
        window.open(url,'_blank')
        
    }

    return (
        <div className="test-card-container">
            <div className="top-container">
                <div className="top-container-left">
                    <span>Q{props.questionNo+1}.{props?.data?.question}</span>
                </div>
                <div className="top-container-right">
                    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20.3504 8.65514C20.3132 8.49873 20.1564 8.40212 19.9994 8.43933C19.8429 8.47673 19.7463 8.63374 19.7837 8.79014C19.9369 9.43258 20.0148 10.111 20.0148 10.8068C20.0148 15.7771 15.8805 19.8207 10.7987 19.8207C5.71684 19.8207 1.58263 15.7771 1.58263 10.8068C1.58263 5.8362 5.71684 1.79239 10.7987 1.79239C12.8226 1.79239 14.7559 2.43282 16.3894 3.64449C16.5182 3.74029 16.701 3.71329 16.7968 3.58408C16.8926 3.45488 16.8656 3.27247 16.7364 3.17666C15.0019 1.8898 12.9486 1.20996 10.7987 1.20996C5.39562 1.20996 1 5.51498 1 10.8068C1 16.0983 5.39562 20.4033 10.7987 20.4033C16.2018 20.4033 20.5974 16.0983 20.5974 10.8068C20.5974 10.0658 20.5142 9.34197 20.3504 8.65514Z" fill="#00C49A" stroke="#00C49A" stroke-width="1.5" />
                        <path d="M10.5941 15.1437C10.5169 15.1437 10.4429 15.1131 10.3881 15.0585L4.9252 9.59638C4.81139 9.48258 4.81139 9.29817 4.9252 9.18436C5.0388 9.07056 5.22321 9.07056 5.33702 9.18436L10.5819 14.4284L20.49 3.33067C20.5972 3.21066 20.7812 3.20026 20.9012 3.30747C21.0212 3.41467 21.0316 3.59868 20.9246 3.71869L10.8113 15.0465C10.7579 15.1063 10.6823 15.1415 10.6023 15.1437C10.5995 15.1437 10.5969 15.1437 10.5941 15.1437Z" fill="#00C49A" stroke="#00C49A" stroke-width="1.5" />
                    </svg>
                </div>
            </div>
            <div className="sep-line"></div>
            <div className="bottom-container">
                <div className="bottom-container-left">

                    <button style={props.data.difficultyLevelId?.level === "easy" ? {} : props.data.difficultyLevelId?.level === "medium" ? { background: '#FEE9E1' } : { background: '#FFE4CB' }} className='status-button'>
                        <div style={props.data.difficultyLevelId?.level === "easy" ? {} : props.data.difficultyLevelId?.level === "medium" ? { background: '#FF9736' } : { background: '#FF6812' }} className='circle'>
                            {/* Document Icon */}
                            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M7.5 9.375C9.91625 9.375 11.875 7.41625 11.875 5C11.875 2.58375 9.91625 0.625 7.5 0.625C5.08375 0.625 3.125 2.58375 3.125 5C3.125 7.41625 5.08375 9.375 7.5 9.375Z" stroke="white" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M5.13125 8.68105L4.375 14.3748L7.5 12.4998L10.625 14.3748L9.86875 8.6748" stroke="white" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>

                        </div>
                        <span>{props.data.difficultyLevelId?.level}</span>

                    </button>

                    <div className="statemanagement">
                        <span>{props?.data?.Section_header}</span>
                    </div>
                    <div className="health">
                        <svg width="15" height="16" viewBox="0 0 15 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12.5398 4.0136C11.3324 2.75979 9.33556 2.75979 8.12819 4.0136L7.5245 4.66373C7.47806 4.71016 7.33875 4.71016 7.29231 4.66373L6.68862 4.0136C5.48125 2.75979 3.53088 2.75979 2.3235 4.0136C1.11612 5.26741 1.11612 7.31066 2.3235 8.56448L3.0665 9.30748L7.33875 13.719C7.38519 13.7655 7.5245 13.7655 7.57094 13.719L11.8432 9.30748L12.5862 8.56448C13.7936 7.31066 13.7936 5.26741 12.5398 4.0136Z" stroke="#F23E3E" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M4.17969 7.72809H5.57281L6.50156 6.79934L7.43031 8.65684L8.35906 6.33496L9.28781 7.72809H10.6809" stroke="#F23E3E" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>

                        <span>Health {healthaCalculate()}</span>
                    </div>
                    <div className="score">
                        <svg width="15" height="16" viewBox="0 0 15 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12.6748 4.50993L9.69579 1.53096C9.64846 1.4851 9.58523 1.45931 9.51933 1.45898H3.45691C3.10178 1.4596 2.76137 1.60094 2.51026 1.85206C2.25915 2.10317 2.1178 2.44358 2.11719 2.79871V13.5861C2.1178 13.9413 2.25915 14.2817 2.51026 14.5328C2.76137 14.7839 3.10178 14.9252 3.45691 14.9259H11.4024C11.7575 14.9252 12.0979 14.7839 12.349 14.5328C12.6001 14.2817 12.7415 13.9413 12.7421 13.5861V4.67478C12.7423 4.64422 12.7364 4.61393 12.7249 4.58564C12.7133 4.55735 12.6963 4.53162 12.6748 4.50993ZM9.75151 2.25307L11.941 4.44259H9.75151V2.25307ZM11.4024 14.4615H3.45691C3.34196 14.4615 3.22813 14.4388 3.12193 14.3949C3.01573 14.3509 2.91923 14.2864 2.83795 14.2051C2.75666 14.1238 2.69218 14.0273 2.64819 13.9211C2.6042 13.8149 2.58156 13.7011 2.58156 13.5861V2.79871C2.58156 2.56655 2.67379 2.3439 2.83795 2.17974C3.00211 2.01558 3.22475 1.92336 3.45691 1.92336H9.28714V4.67478C9.28714 4.73636 9.3116 4.79542 9.35514 4.83896C9.39869 4.88251 9.45775 4.90697 9.51933 4.90697H12.2777V13.5861C12.2777 13.7011 12.2551 13.8149 12.2111 13.9211C12.1671 14.0273 12.1026 14.1238 12.0213 14.2051C11.94 14.2864 11.8435 14.3509 11.7373 14.3949C11.6311 14.4388 11.5173 14.4615 11.4024 14.4615Z" fill="#827C7C" />
                            <path d="M5.10758 6.50457C5.62014 6.50457 6.11174 6.30112 6.47439 5.9389C6.83704 5.57669 7.04109 5.08533 7.0417 4.57277C6.94418 2.01871 3.27098 2.01871 3.17578 4.57277C3.1764 5.08493 3.38012 5.57593 3.74227 5.93808C4.10442 6.30023 4.59542 6.50396 5.10758 6.50457ZM5.10758 3.10303C5.49719 3.10364 5.87067 3.25869 6.14617 3.53418C6.42167 3.80968 6.57671 4.18316 6.57733 4.57277C6.50767 6.51618 3.70749 6.51618 3.64016 4.57277C3.64016 4.18337 3.79468 3.80989 4.06981 3.53433C4.34494 3.25876 4.71818 3.10364 5.10758 3.10303Z" fill="#827C7C" />
                            <path d="M4.26676 5.65933C4.29527 5.67016 4.32563 5.67526 4.35612 5.67435C4.3866 5.67345 4.4166 5.66654 4.44442 5.65404C4.47223 5.64153 4.49731 5.62367 4.51822 5.60147C4.53913 5.57927 4.55546 5.55317 4.56628 5.52466L4.81937 4.8606H5.41145L5.66453 5.52466C5.68639 5.58224 5.73023 5.62877 5.7864 5.65403C5.84257 5.67928 5.90648 5.68119 5.96405 5.65933C6.02163 5.63747 6.06817 5.59363 6.09342 5.53746C6.11868 5.48129 6.12058 5.41738 6.09872 5.3598L5.34179 3.34906C5.32508 3.30501 5.29536 3.26708 5.25659 3.24032C5.21781 3.21355 5.17181 3.19922 5.1247 3.19922C5.07758 3.19922 5.03158 3.21355 4.9928 3.24032C4.95403 3.26708 4.92431 3.30501 4.9076 3.34906L4.14138 5.3598C4.11899 5.41621 4.11957 5.47915 4.14301 5.53513C4.16644 5.59111 4.21086 5.63569 4.26676 5.65933ZM5.23266 4.39623H5.00048L5.1096 4.08277L5.23266 4.39623Z" fill="#827C7C" />
                            <path d="M11.5182 8H4.23219C4.17061 8 4.11155 8.02446 4.06801 8.06801C4.02446 8.11155 4 8.17061 4 8.23219C4 8.29377 4.02446 8.35282 4.06801 8.39637C4.11155 8.43991 4.17061 8.46437 4.23219 8.46437H11.5182C11.5798 8.46437 11.6389 8.43991 11.6824 8.39637C11.726 8.35282 11.7504 8.29377 11.7504 8.23219C11.7504 8.17061 11.726 8.11155 11.6824 8.06801C11.6389 8.02446 11.5798 8 11.5182 8Z" fill="#827C7C" />
                            <path d="M11.0729 9.33008H3.78687C3.72529 9.33008 3.66624 9.35454 3.62269 9.39808C3.57915 9.44163 3.55469 9.50069 3.55469 9.56227C3.55469 9.62385 3.57915 9.6829 3.62269 9.72645C3.66624 9.76999 3.72529 9.79445 3.78687 9.79445H11.0729C11.1345 9.79445 11.1936 9.76999 11.2371 9.72645C11.2806 9.6829 11.3051 9.62385 11.3051 9.56227C11.3051 9.50069 11.2806 9.44163 11.2371 9.39808C11.1936 9.35454 11.1345 9.33008 11.0729 9.33008Z" fill="#827C7C" />
                            <path d="M11.0729 11.041H3.78687C3.72529 11.041 3.66624 11.0655 3.62269 11.109C3.57915 11.1526 3.55469 11.2116 3.55469 11.2732C3.55469 11.3348 3.57915 11.3938 3.62269 11.4374C3.66624 11.4809 3.72529 11.5054 3.78687 11.5054H11.0729C11.1345 11.5054 11.1936 11.4809 11.2371 11.4374C11.2806 11.3938 11.3051 11.3348 11.3051 11.2732C11.3051 11.2116 11.2806 11.1526 11.2371 11.109C11.1936 11.0655 11.1345 11.041 11.0729 11.041Z" fill="#827C7C" />
                            <path d="M11.0729 12.75H3.78687C3.72529 12.75 3.66624 12.7745 3.62269 12.818C3.57915 12.8615 3.55469 12.9206 3.55469 12.9822C3.55469 13.0438 3.57915 13.1028 3.62269 13.1464C3.66624 13.1899 3.72529 13.2144 3.78687 13.2144H11.0729C11.1345 13.2144 11.1936 13.1899 11.2371 13.1464C11.2806 13.1028 11.3051 13.0438 11.3051 12.9822C11.3051 12.9206 11.2806 12.8615 11.2371 12.818C11.1936 12.7745 11.1345 12.75 11.0729 12.75Z" fill="#827C7C" />
                        </svg>
                        <span>Score: {props?.data?.score}</span>
                    </div>
                    <div className="tags">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M13.7281 9.07363L9.24688 13.5549C9.13078 13.6711 8.99292 13.7633 8.84118 13.8262C8.68943 13.8891 8.52677 13.9215 8.3625 13.9215C8.19823 13.9215 8.03557 13.8891 7.88382 13.8262C7.73208 13.7633 7.59422 13.6711 7.47813 13.5549L2.10938 8.19238V1.94238H8.35938L13.7281 7.31113C13.9609 7.54534 14.0916 7.86215 14.0916 8.19238C14.0916 8.52261 13.9609 8.83943 13.7281 9.07363V9.07363Z" stroke="#827C7C" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M5.23438 5.06738H5.24063" stroke="#827C7C" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                        {props.data.skillsId.map((data, index) => {
                            if (index < 2) {
                                return (
                                    <span>{data?.skills?.skills}{index !== props?.data?.skillsId?.length - 1 ? "," : ""}</span>
                                )
                            } else if (index === 2) {
                                return (
                                    <span>+{props?.data?.skillsId?.length - 2}</span>
                                )
                            }
                        })

                        }
                    </div>
                </div>
                <div className="bottom-container-right">
                    <div onClick={(e)=>onClickTryQuestion(e,props.data._id)} className="try-question">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12.0062 8.74139V12.4564C12.0062 12.7848 11.8758 13.0998 11.6435 13.332C11.4113 13.5643 11.0963 13.6947 10.7679 13.6947H3.95708C3.62866 13.6947 3.31368 13.5643 3.08145 13.332C2.84922 13.0998 2.71875 12.7848 2.71875 12.4564V5.64556C2.71875 5.31713 2.84922 5.00216 3.08145 4.76993C3.31368 4.53769 3.62866 4.40723 3.95708 4.40723H7.67208" stroke="#827C7C" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M10.1484 2.5498H13.8634V6.2648" stroke="#827C7C" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M7.05078 9.36064L13.8616 2.5498" stroke="#827C7C" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                        <span>Try Question</span>
                    </div>
                    {/* <div className="remove-question">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M2.73438 4.44238H3.98438H13.9844" stroke="#827C7C" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M12.7344 4.44238V13.1924C12.7344 13.5239 12.6027 13.8418 12.3683 14.0763C12.1338 14.3107 11.8159 14.4424 11.4844 14.4424H5.23438C4.90285 14.4424 4.58491 14.3107 4.35049 14.0763C4.11607 13.8418 3.98438 13.5239 3.98438 13.1924V4.44238M5.85938 4.44238V3.19238C5.85938 2.86086 5.99107 2.54292 6.22549 2.3085C6.45991 2.07408 6.77785 1.94238 7.10938 1.94238H9.60938C9.9409 1.94238 10.2588 2.07408 10.4933 2.3085C10.7277 2.54292 10.8594 2.86086 10.8594 3.19238V4.44238" stroke="#827C7C" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M7.10938 7.56738V11.3174" stroke="#827C7C" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M9.60938 7.56738V11.3174" stroke="#827C7C" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                        <span>Remove Question</span>
                    </div> */}
                </div>
            </div>
        </div>
    )
}

export default TestCard