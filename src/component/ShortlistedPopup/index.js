import React from 'react'
import './index.css'

const Shortlisted = (props) => {
    
    return (
        <div className="shortlist-container">
            <div className="shortlist-type-box">
                <div className="header">
                    <div onClick={() => props.cancelButton()} className="title">
                        <svg style={{ cursor: "pointer" }} width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M12.0032 13.6551L7.00642 8.65882L2.01082 13.6551C1.55102 14.1148 0.805358 14.1151 0.345266 13.6554C-0.114825 13.1957 -0.115113 12.4499 0.344547 11.99L5.34122 6.99369L0.344476 1.99628C-0.102534 1.534 -0.0962087 0.798602 0.358851 0.34437C0.813839 -0.110149 1.54922 -0.115324 2.01082 0.332296L7.00642 5.32856L12.0032 0.332296C12.4666 -0.103824 13.1925 -0.0928997 13.6426 0.35702C14.0927 0.806652 14.1041 1.53256 13.6684 1.99628L8.67162 6.99369L13.6684 11.99C14.1157 12.4519 14.1098 13.1873 13.6551 13.6419C13.2004 14.0967 12.4651 14.1024 12.0031 13.6551H12.0032Z" fill="#99B2C6" />
                        </svg>
                    </div>
                </div>

                <div className="content">
                    <div className="icon">
                        <svg width="51" height="50" viewBox="0 0 51 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="25.5" cy="25" r="25" fill="#00C49A" />
                            <g clip-path="url(#clip0_3428_2614)">
                                <path d="M30.3359 32.3887V30.722C30.3359 29.838 29.9847 28.9901 29.3596 28.365C28.7345 27.7399 27.8867 27.3887 27.0026 27.3887H21.1693C20.2852 27.3887 19.4374 27.7399 18.8122 28.365C18.1871 28.9901 17.8359 29.838 17.8359 30.722V32.3887" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M24.0833 24.0553C25.9243 24.0553 27.4167 22.563 27.4167 20.722C27.4167 18.8811 25.9243 17.3887 24.0833 17.3887C22.2424 17.3887 20.75 18.8811 20.75 20.722C20.75 22.563 22.2424 24.0553 24.0833 24.0553Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M33.6641 21.5557V26.5557" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M36.1641 24.0557H31.1641" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                            </g>
                            <defs>
                                <clipPath id="clip0_3428_2614">
                                    <rect width="20" height="20" fill="white" transform="translate(17 14.8887)" />
                                </clipPath>
                            </defs>
                        </svg>

                    </div>
                    <div className="content-heading">
                        {props.movedType !== "move to review" ? <span>{props.no === 0 ? "Candidate Shortlisted" : `${props.no} Candidates Shortlisted!`}</span> : null}
                        {props.movedType === "move to review" ? <span>{props.no === 0 ? "Candidate moved to reviewed." : `${props.no} Candidates Moved To Reviewed!`}</span> : null}
                        {props.movedType !== "move to review" ? <p>{props.single ? "Candidate is shortlisted" : `${props.no} Candidates are shortlisted`} successfully. Check in “shortlisted” section.</p> : null}
                        {props.movedType === "move to review" ? <p>{props.single ? "Candidate is moved to reviewed." : `${props.no} Candidates are moved to reviewed`} successfully. Check in “reviewed” section.</p> : null}

                    </div>
                </div>

            </div>
        </div>
    )
}

export default Shortlisted