import React, { useState, useEffect } from 'react'
import './index.css'

function QuestionCard(props) {
    const [selected, setSelected] = useState(false)
    const [selectAllCheck, setselectAllCheck] = useState(false)
    const [multipleDelete, setmultipleDelete] = useState(false)
    const [temp, setTemp] = useState(false)

    useEffect(() => {
        if (props.arr?.includes(props.ptkey)) {
            setSelected(true)
        } else {
            setSelected(false)
        }
    }, [temp])


    return (
        <div className="edit-question-card">
            <div className="row1" style={selected ? { border: "1px solid #00C49A" } : {}}>
                <div className="head">
                    {props.arr?.includes(props.ptkey) ? <svg className='selected-check-box' onClick={() => { props.removeCheck() }} width="20" height="20" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="15" height="15" rx="2" fill="#FF6812" />
                        <path d="M12 4.5L6.5 10L4 7.5" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                        : <svg className='check-box' onClick={() => { props.selectCheck() }} width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="0.5" y="1.30664" width="19" height="19" rx="1.5" stroke="#827C7C" />
                        </svg>
                    }
                    <div className="left" onClick={() => {
                    }} >

                        {props.difficulty == "easy" ? <div className="difficulty">
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
                        </div> : props.difficulty == "medium" ? <div className="difficulty" style={{ backgroundColor: "#FEE9E1" }}>
                            <svg width="32" height="33" viewBox="0 0 32 33" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="16" cy="16.6055" r="16" fill="#FF9736" />
                                <g clip-path="url(#clip0_3187_2807)">
                                    <path d="M16.5 17.9805C18.9162 17.9805 20.875 16.0217 20.875 13.6055C20.875 11.1892 18.9162 9.23047 16.5 9.23047C14.0838 9.23047 12.125 11.1892 12.125 13.6055C12.125 16.0217 14.0838 17.9805 16.5 17.9805Z" stroke="white" stroke-linecap="round" stroke-linejoin="round" />
                                    <path d="M14.1312 17.2865L13.375 22.9803L16.5 21.1053L19.625 22.9803L18.8687 17.2803" stroke="white" stroke-linecap="round" stroke-linejoin="round" />
                                </g>
                                <defs>
                                    <clipPath id="clip0_3187_2807">
                                        <rect width="15" height="15" fill="white" transform="translate(9 8.60547)" />
                                    </clipPath>
                                </defs>
                            </svg>
                            <span>Medium</span>
                        </div> : <div className="difficulty" style={{ backgroundColor: "#FEE9E1" }}>
                            <svg width="32" height="33" viewBox="0 0 32 33" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="16" cy="16.3955" r="16" fill="#FF6812" />
                                <g clip-path="url(#clip0_3187_2684)">
                                    <path d="M16.5 17.7705C18.9162 17.7705 20.875 15.8118 20.875 13.3955C20.875 10.9793 18.9162 9.02051 16.5 9.02051C14.0838 9.02051 12.125 10.9793 12.125 13.3955C12.125 15.8118 14.0838 17.7705 16.5 17.7705Z" stroke="white" stroke-linecap="round" stroke-linejoin="round" />
                                    <path d="M14.1312 17.0766L13.375 22.7703L16.5 20.8953L19.625 22.7703L18.8687 17.0703" stroke="white" stroke-linecap="round" stroke-linejoin="round" />
                                </g>
                                <defs>
                                    <clipPath id="clip0_3187_2684">
                                        <rect width="15" height="15" fill="white" transform="translate(9 8.39551)" />
                                    </clipPath>
                                </defs>
                            </svg>
                            <span>Hard</span>
                        </div>}
                        <span>{props.title}</span>
                    </div>
                    <div className="right-side" onClick={() => {

                    }} >
                        <svg width="22" height="21" viewBox="0 0 22 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M20.3504 8.44518C20.3132 8.28877 20.1564 8.19216 19.9994 8.22937C19.8429 8.26677 19.7463 8.42378 19.7837 8.58018C19.9369 9.22262 20.0148 9.90105 20.0148 10.5969C20.0148 15.5671 15.8805 19.6107 10.7987 19.6107C5.71684 19.6107 1.58263 15.5671 1.58263 10.5969C1.58263 5.62624 5.71684 1.58243 10.7987 1.58243C12.8226 1.58243 14.7559 2.22286 16.3894 3.43453C16.5182 3.53033 16.701 3.50333 16.7968 3.37412C16.8926 3.24492 16.8656 3.06251 16.7364 2.9667C15.0019 1.67983 12.9486 1 10.7987 1C5.39562 1 1 5.30502 1 10.5969C1 15.8883 5.39562 20.1934 10.7987 20.1934C16.2018 20.1934 20.5974 15.8883 20.5974 10.5969C20.5974 9.85585 20.5142 9.13201 20.3504 8.44518Z" fill="#00C49A" stroke="#00C49A" stroke-width="1.5" />
                            <path d="M10.5941 14.9337C10.5169 14.9337 10.4429 14.9031 10.3881 14.8485L4.9252 9.38642C4.81139 9.27262 4.81139 9.08821 4.9252 8.9744C5.0388 8.8606 5.22321 8.8606 5.33702 8.9744L10.5819 14.2185L20.49 3.12071C20.5972 3.0007 20.7812 2.9903 20.9012 3.09751C21.0212 3.20471 21.0316 3.38872 20.9246 3.50873L10.8113 14.8365C10.7579 14.8963 10.6823 14.9315 10.6023 14.9337C10.5995 14.9337 10.5969 14.9337 10.5941 14.9337Z" fill="#00C49A" stroke="#00C49A" stroke-width="1.5" />
                        </svg>
                    </div>
                </div>
                <div className="description" onClick={() => {

                }} >
                    <span>Given a URL, you have to write the main URL and the Given a URL, you have to write the main URL and the Given a URL, you have........</span>
                </div>
                <div className="bottom" onClick={() => {

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

                            }}>Try Question</span>
                        </div>
                        <div className="remove-question" onClick={() => { }}>
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
        </div>
    )
}

export default QuestionCard