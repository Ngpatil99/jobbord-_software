import React from 'react'
import { useState, useEffect } from 'react'
import './TestDuration.css'
import { toast } from "react-toastify";

function TestDuration(props) {
    const array = ["MongoDB", "Express", "React", "Node"]
    const [changeTime, SetChangeTime] = useState(props.score ? props.testTime : props.duration)
    const [isTestTime, setisTestTime] = useState(false)

    const onClickAdd = () => {
        if (changeTime === '' || changeTime === '0' || parseInt(changeTime) < 0 || /^0+$|^0*-0+$/.test(changeTime)) {
            setisTestTime(true)
        } else {
            props.changeTestTime(changeTime)
            toast.success(`Time Changed Successfully`);
            props.closeButton()
        }
    }

    useEffect(() => {
        const debounce = setTimeout(() => {
        }, 500);
        return () => clearTimeout(debounce);
    }, [changeTime]);

    const onChangeTestDuration = (e) => {


        SetChangeTime(e.target.value.slice(0, 3))
        if (e.target.value === '' || e.target.value === '0' || parseInt(e.target.value) < 0 || /^0+$|^0*-0+$/.test(e.target.value)) {
            setisTestTime(true)
        } else {
            setisTestTime(false)
        }

    }

    return (
        <div className="test-duration-container">
            <div className="test-duration-type-box">
                <div className="header">
                    <div className="title">
                        {props.score ? <span>Test Score</span> : <span>Test Duration </span>}
                        <svg onClick={props.closeButton} style={{ cursor: "pointer" }} width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M12.0032 13.6551L7.00642 8.65882L2.01082 13.6551C1.55102 14.1148 0.805358 14.1151 0.345266 13.6554C-0.114825 13.1957 -0.115113 12.4499 0.344547 11.99L5.34122 6.99369L0.344476 1.99628C-0.102534 1.534 -0.0962087 0.798602 0.358851 0.34437C0.813839 -0.110149 1.54922 -0.115324 2.01082 0.332296L7.00642 5.32856L12.0032 0.332296C12.4666 -0.103824 13.1925 -0.0928997 13.6426 0.35702C14.0927 0.806652 14.1041 1.53256 13.6684 1.99628L8.67162 6.99369L13.6684 11.99C14.1157 12.4519 14.1098 13.1873 13.6551 13.6419C13.2004 14.0967 12.4651 14.1024 12.0031 13.6551H12.0032Z" fill="#99B2C6" />
                        </svg>
                    </div>
                    <div className="header-border"></div>
                </div>

                <div className="details">
                    <div className="duration">
                        <div className="duration-title">
                            {props.score ? <span>Edit Test Score</span> : <span>Edit Duration </span>}
                            <p style={props.score ? { visibility: "hidden" } : {}}> (in mins)</p>
                        </div>
                        <div className="select-box">
                            <input type="number" onWheel={(e) => e.target.blur()} onKeyDown={(evt) => (evt.key === 'e' || (evt.keyCode === 190 || evt.keyCode === 110)) && evt.preventDefault()} min={0} max={100} placeholder='100' onChange={onChangeTestDuration} value={changeTime} name="" id="" />
                        </div>
                        {isTestTime && changeTime === "" ?
                            <p style={{ color: 'red', fontSize: 12, fontWeight: 'normal' }} >Please enter test time</p> : <></>
                        }
                        {changeTime === "0" || parseInt(changeTime) < 0 || /^0+$|^0*-0+$/.test(changeTime) ?
                            <p style={{ color: 'red', fontSize: 12, fontWeight: 'normal' }} >Test duration should be greater than zero.</p> : <></>
                        }
                    </div>
                </div>

                <div className="button" style={{ marginTop: "5px" }}>
                    <div className="cancel-btn" onClick={props.closeButton}>
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="9" cy="9" r="9" fill="white" />
                            <path d="M12.5 5.5L5.5 12.5" stroke="#FF6812" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M5.5 5.5L12.5 12.5" stroke="#FF6812" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>

                        <button>Cancel</button>
                    </div>

                    <div className="next-btn" onClick={() => { onClickAdd() }}>
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="9" cy="9" r="9" fill="white" />
                            <path d="M9.01826 4.0505L8.97489 13.9499" stroke="#00C49A" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M4.04688 8.97852L13.9463 9.02188" stroke="#00C49A" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>

                        <button>Save</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TestDuration