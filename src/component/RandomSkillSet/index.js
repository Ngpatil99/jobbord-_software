import React, { useState } from "react";
import './index.css'

const RandomSkillSet = (props) => {

    const [easyScore, seteasyScore] = useState('')
    const [mediumScore, setmediumScore] = useState('')
    const [hardScore, sethardScore] = useState('')
    const [questionType, setquestionType] = useState(props.type)
    const [addSkillLoading, setaddSkillLoading] = useState(false)

    const [easyScoreError, seteasyScoreError] = useState(false)
    const [mediumScoreError, setmediumScoreError] = useState(false)
    const [hardScoreError, sethardScoreError] = useState(false)

    const onClickAdd = () => {
        if (easyScore > 0 && mediumScore > 0 && hardScore > 0) {

            props.addData({ skillName: props.skill, questionType: questionType, score: `Easy(${easyScore}),Medium(${mediumScore}),Hard(${hardScore})` })

        }
    }

    const onChangeEasyScore = (e) => {
        seteasyScore(e.target.value.slice(0, 3))
        if (e.target.value === '' || e.target.value === '0' || (parseInt(e.target.value) < 0) || /^0+$|^0*-0+$/.test(e.target.value)) {
            seteasyScoreError(true)
        } else {
            seteasyScoreError(false)
        }
    }

    const onChangeMediumScore = (e) => {
        setmediumScore(e.target.value.slice(0, 3))
        if (e.target.value === '' || e.target.value === '0' || (parseInt(e.target.value) < 0) || /^0+$|^0*-0+$/.test(e.target.value)) {
            setmediumScoreError(true)
        } else {
            setmediumScoreError(false)
        }
    }

    const onChangeHardScore = (e) => {
        sethardScore(e.target.value.slice(0, 3))
        if (e.target.value === '' || e.target.value === '0' || (parseInt(e.target.value) < 0) || /^0+$|^0*-0+$/.test(e.target.value)) {
            sethardScoreError(true)
        } else {
            sethardScoreError(false)
        }
    }
    return (
        <div className="random-skillset-container">
            <div className="skillset-type-box">
                <div className="header">
                    <div className="title">
                        <span>Random Skillset</span>
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" onClick={() => props.closeButton({ skill: props.skill, type: questionType })} style={{ cursor: "pointer" }}>
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M12.0032 13.6551L7.00642 8.65882L2.01082 13.6551C1.55102 14.1148 0.805358 14.1151 0.345266 13.6554C-0.114825 13.1957 -0.115113 12.4499 0.344547 11.99L5.34122 6.99369L0.344476 1.99628C-0.102534 1.534 -0.0962087 0.798602 0.358851 0.34437C0.813839 -0.110149 1.54922 -0.115324 2.01082 0.332296L7.00642 5.32856L12.0032 0.332296C12.4666 -0.103824 13.1925 -0.0928997 13.6426 0.35702C14.0927 0.806652 14.1041 1.53256 13.6684 1.99628L8.67162 6.99369L13.6684 11.99C14.1157 12.4519 14.1098 13.1873 13.6551 13.6419C13.2004 14.0967 12.4651 14.1024 12.0031 13.6551H12.0032Z" fill="#99B2C6" />
                        </svg>
                    </div>
                    <div className="header-border"></div>
                </div>

                <div className="details">
                    <div className="experience">
                        <span>Choose Skill</span>
                        <div className="skill-list-item-container" >

                            <button  >
                                <span>{props.skill}</span>
                                {/* <svg onClick={() => removeSkill(data)} width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <circle cx="10" cy="10.5" r="10" fill="#F0F7FB" />
                                            <path d="M13 7.5L7 13.5" stroke="#BDCCD3" stroke-linecap="round" />
                                            <path d="M13 13.5L7.00019 7.50019" stroke="#BDCCD3" stroke-linecap="round" />
                                        </svg> */}
                                <svg className='right-icon' width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="10" cy="10.5" r="10" fill="#00C49A" />
                                    <path d="M13.5 7.75L8.6875 12.5625L6.5 10.375" stroke="white" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                                <svg className='cancel-icon' width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="10" cy="10.5" r="10" fill="#00C49A" />
                                    <path d="M13 7.5L7 13.5" stroke="white" stroke-linecap="round" />
                                    <path d="M13 13.5L7.00019 7.50019" stroke="white" stroke-linecap="round" />
                                </svg>

                            </button>

                        </div>



                    </div>
                    <div className="job-role">
                        <span>Question Type</span>
                        <div className="select-box">
                            <select disabled={true} value={questionType} onChange={(e) => setquestionType(e.target.value)} name="" id="">
                                <option value={0}>Select</option>
                                <option value="MCQ">MCQ</option>
                                <option value="Programming">Programming</option>
                            </select>

                        </div>

                    </div>

                </div>

                <div className="skill-table">
                    <table className="skillset" cellSpacing="0px">
                        <tr>
                            <th>Difficulty</th>
                            <th>Score</th>
                        </tr>
                        <tr>
                            <td>
                                <svg width="14" height="20" viewBox="0 0 14 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M10.5737 3.14153C9.60324 2.14278 8.41202 1.38565 7.09577 0.931013C7.02734 0.911575 6.95474 0.912363 6.88675 0.933284C6.81876 0.954205 6.75828 0.994362 6.71261 1.04891C6.66767 1.10391 6.63959 1.17073 6.63175 1.24133C6.6239 1.31192 6.63663 1.38327 6.6684 1.4468C7.44822 2.88907 7.6661 4.5691 7.27998 6.16258C7.27361 6.18729 7.25939 6.20928 7.23946 6.22522C7.21953 6.24116 7.19496 6.25021 7.16945 6.251C7.10314 6.251 7.0884 6.251 7.0884 6.19942C6.52577 4.83612 5.57846 3.66608 4.36209 2.83206C4.30008 2.79116 4.22714 2.76997 4.15287 2.77126C4.07859 2.77255 4.00644 2.79627 3.94588 2.8393C3.88532 2.88232 3.83918 2.94266 3.81352 3.01237C3.78786 3.08209 3.78388 3.15793 3.80209 3.22995C4.23683 4.93205 3.3821 5.95626 2.32841 7.2531C1.27473 8.54994 0 10.0678 0 12.5141C0.0258836 14.0773 0.575961 15.5865 1.56202 16.7997C2.54808 18.0129 3.91299 18.8598 5.43788 19.2046C5.12703 18.9852 4.87274 18.6951 4.69595 18.3582C4.51916 18.0213 4.42494 17.6472 4.42104 17.2668C4.42104 13.332 6.99998 12.352 6.99998 12.352C7.51577 14.931 9.57892 15.5204 9.57892 17.2668C9.57523 17.6428 9.4833 18.0127 9.31052 18.3468C9.13775 18.6808 8.88896 18.9696 8.58419 19.1899C9.6652 18.9554 10.6753 18.4681 11.5315 17.7678C12.3068 17.1251 12.9302 16.3187 13.357 15.4066C13.7838 14.4944 14.0034 13.4991 14 12.492C14 7.56257 12.1358 4.6889 10.5737 3.14153Z" fill="#00C49A" />
                                </svg>
                                Easy</td>

                            <td>
                                <input maxLength={3} value={easyScore} onChange={onChangeEasyScore} onWheel={(e) => e.target.blur()} onKeyDown={(evt) => (evt.key === 'e' || (evt.keyCode === 190 || evt.keyCode === 110)) && evt.preventDefault()} min={0} max={100} type="number" />
                                {easyScoreError && easyScore === "" ?
                                    <p style={{ color: 'red', fontSize: 12, fontWeight: 'normal' }} >Please enter easy score</p> : <></>
                                }

                                {easyScore === "0" || /^0+$|^0*-0+$/.test(easyScore) || easyScore < 0 ?
                                    <p style={{ color: 'red', fontSize: 12, fontWeight: 'normal' }} >Easy score should be greater than zero.</p> : <></>
                                }
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <svg width="14" height="20" viewBox="0 0 14 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M10.5737 3.14153C9.60324 2.14278 8.41202 1.38565 7.09577 0.931013C7.02734 0.911575 6.95474 0.912363 6.88675 0.933284C6.81876 0.954205 6.75828 0.994362 6.71261 1.04891C6.66767 1.10391 6.63959 1.17073 6.63175 1.24133C6.6239 1.31192 6.63663 1.38327 6.6684 1.4468C7.44822 2.88907 7.6661 4.5691 7.27998 6.16258C7.27361 6.18729 7.25939 6.20928 7.23946 6.22522C7.21953 6.24116 7.19496 6.25021 7.16945 6.251C7.10314 6.251 7.0884 6.251 7.0884 6.19942C6.52577 4.83612 5.57846 3.66608 4.36209 2.83206C4.30008 2.79116 4.22714 2.76997 4.15287 2.77126C4.07859 2.77255 4.00644 2.79627 3.94588 2.8393C3.88532 2.88232 3.83918 2.94266 3.81352 3.01237C3.78786 3.08209 3.78388 3.15793 3.80209 3.22995C4.23683 4.93205 3.3821 5.95626 2.32841 7.2531C1.27473 8.54994 0 10.0678 0 12.5141C0.0258836 14.0773 0.575961 15.5865 1.56202 16.7997C2.54808 18.0129 3.91299 18.8598 5.43788 19.2046C5.12703 18.9852 4.87274 18.6951 4.69595 18.3582C4.51916 18.0213 4.42494 17.6472 4.42104 17.2668C4.42104 13.332 6.99998 12.352 6.99998 12.352C7.51577 14.931 9.57892 15.5204 9.57892 17.2668C9.57523 17.6428 9.4833 18.0127 9.31052 18.3468C9.13775 18.6808 8.88896 18.9696 8.58419 19.1899C9.6652 18.9554 10.6753 18.4681 11.5315 17.7678C12.3068 17.1251 12.9302 16.3187 13.357 15.4066C13.7838 14.4944 14.0034 13.4991 14 12.492C14 7.56257 12.1358 4.6889 10.5737 3.14153Z" fill="#FF9736" />
                                </svg>

                                Medium</td>

                            <td>
                                <input maxLength={3} value={mediumScore} onChange={onChangeMediumScore} onWheel={(e) => e.target.blur()} onKeyDown={(evt) => (evt.key === 'e' || (evt.keyCode === 190 || evt.keyCode === 110)) && evt.preventDefault()} min={0} max={100} type="number" />
                                {mediumScoreError && mediumScore === "" ?
                                    <p style={{ color: 'red', fontSize: 12, fontWeight: 'normal' }} >Please enter medium score</p> : <></>
                                }
                                {mediumScore === "0" || /^0+$|^0*-0+$/.test(mediumScore) || mediumScore < 0 ?
                                    <p style={{ color: 'red', fontSize: 12, fontWeight: 'normal' }} >Medium score should be greater than zero.</p> : <></>
                                }
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <svg width="14" height="20" viewBox="0 0 14 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M10.5737 3.14153C9.60324 2.14278 8.41202 1.38565 7.09577 0.931013C7.02734 0.911575 6.95474 0.912363 6.88675 0.933284C6.81876 0.954205 6.75828 0.994362 6.71261 1.04891C6.66767 1.10391 6.63959 1.17073 6.63175 1.24133C6.6239 1.31192 6.63663 1.38327 6.6684 1.4468C7.44822 2.88907 7.6661 4.5691 7.27998 6.16258C7.27361 6.18729 7.25939 6.20928 7.23946 6.22522C7.21953 6.24116 7.19496 6.25021 7.16945 6.251C7.10314 6.251 7.0884 6.251 7.0884 6.19942C6.52577 4.83612 5.57846 3.66608 4.36209 2.83206C4.30008 2.79116 4.22714 2.76997 4.15287 2.77126C4.07859 2.77255 4.00644 2.79627 3.94588 2.8393C3.88532 2.88232 3.83918 2.94266 3.81352 3.01237C3.78786 3.08209 3.78388 3.15793 3.80209 3.22995C4.23683 4.93205 3.3821 5.95626 2.32841 7.2531C1.27473 8.54994 0 10.0678 0 12.5141C0.0258836 14.0773 0.575961 15.5865 1.56202 16.7997C2.54808 18.0129 3.91299 18.8598 5.43788 19.2046C5.12703 18.9852 4.87274 18.6951 4.69595 18.3582C4.51916 18.0213 4.42494 17.6472 4.42104 17.2668C4.42104 13.332 6.99998 12.352 6.99998 12.352C7.51577 14.931 9.57892 15.5204 9.57892 17.2668C9.57523 17.6428 9.4833 18.0127 9.31052 18.3468C9.13775 18.6808 8.88896 18.9696 8.58419 19.1899C9.6652 18.9554 10.6753 18.4681 11.5315 17.7678C12.3068 17.1251 12.9302 16.3187 13.357 15.4066C13.7838 14.4944 14.0034 13.4991 14 12.492C14 7.56257 12.1358 4.6889 10.5737 3.14153Z" fill="#FF5D00" />
                                </svg>

                                Hard</td>

                            <td>
                                <input maxLength={3} value={hardScore} onChange={onChangeHardScore} onWheel={(e) => e.target.blur()} onKeyDown={(evt) => (evt.key === 'e' || (evt.keyCode === 190 || evt.keyCode === 110)) && evt.preventDefault()} min={0} max={100} type="number" />
                                {hardScoreError && hardScore === "" ?
                                    <p style={{ color: 'red', fontSize: 12, fontWeight: 'normal' }} >Please enter hard score</p> : <></>
                                }
                                {hardScore === "0" || /^0+$|^0*-0+$/.test(hardScore) || hardScore < 0 ?
                                    <p style={{ color: 'red', fontSize: 12, fontWeight: 'normal' }} >Hard score should be greater than zero.</p> : <></>
                                }
                            </td>
                        </tr>
                    </table>
                </div>

                <div className="button" style={{ marginTop: "5px" }}>
                    <div className="cancel-btn" onClick={() => props.closeButton({ skill: props.skill, type: questionType })}>
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: "10px" }}>
                            <circle cx="9" cy="9" r="9" fill="white" />
                            <path d="M12.5 5.5L5.5 12.5" stroke="#FF6812" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M5.5 5.5L12.5 12.5" stroke="#FF6812" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>

                        <button>Cancel</button>
                    </div>
                    {(easyScore > 0 && mediumScore > 0 && hardScore > 0) ?
                        <div onClick={() => onClickAdd()} className="next-btn" >
                            {addSkillLoading ?
                                <div className='loader' ></div> : <>
                                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: "10px" }}>
                                        <circle cx="9" cy="9" r="9" fill="white" />
                                        <path d="M9.01826 4.0505L8.97489 13.9499" stroke="#00C49A" stroke-linecap="round" stroke-linejoin="round" />
                                        <path d="M4.04688 8.97852L13.9463 9.02188" stroke="#00C49A" stroke-linecap="round" stroke-linejoin="round" />
                                    </svg>

                                    <button>Add</button>
                                </>
                            }
                        </div> :
                        <div style={{background:'#C8C8C8'}} className="next-btn" >
                            {addSkillLoading ?
                                <div className='loader' ></div> : <>
                                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: "10px" }}>
                                        <circle cx="9" cy="9" r="9" fill="white" />
                                        <path d="M9.01826 4.0505L8.97489 13.9499" stroke="#00C49A" stroke-linecap="round" stroke-linejoin="round" />
                                        <path d="M4.04688 8.97852L13.9463 9.02188" stroke="#00C49A" stroke-linecap="round" stroke-linejoin="round" />
                                    </svg>

                                    <button style={{background:'#C8C8C8'}} >Add</button>
                                </>
                            }
                        </div>
                    }


                </div>
            </div>
        </div>
    )
}

export default RandomSkillSet