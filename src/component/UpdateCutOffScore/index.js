import React, { useState } from "react";
import './index.css'
const UpdateCutOffScore = ({ cutOffScore, onCuffOffScoreChange, testScore, noOfQuestion }) => {
    const [cutOff, setcutOff] = useState(cutOffScore)
    const [isTestCutOff, setisTestCutOff] = useState(false)
    
    const onChangeCutOff = (e) => {
        setcutOff(e.target.value.slice(0, 3))
        if (e.target.value === '' || e.target.value === '0' || parseInt(e.target.value) < 0 || ((noOfQuestion >0 ? e.target.value > testScore : false) || /^0+$|^0*-0+$/.test(e.target.value))) {
            setisTestCutOff(false)
        } else {
            setisTestCutOff(true)
        }
    }

    return (

        <div className="update-cut-off-score-container" >
            <input onWheel={(e) => e.target.blur()} onKeyDown={(evt) => (evt.key === 'e' || (evt.keyCode === 190 || evt.keyCode === 110)) && evt.preventDefault()} value={cutOff} onChange={onChangeCutOff} min={0} max={100} placeholder="cut off score" />
            {isTestCutOff && cutOff === "" ?
                <p style={{ color: 'red', fontSize: 12, fontWeight: 'normal' }} >Please enter cut off score</p> : <></>
            }
            {cutOff === "0" || (noOfQuestion >0 ? parseInt(cutOff) < 0 : false) || /^0+$|^0*-0+$/.test(cutOff) ?
                <p style={{ color: 'red', fontSize: 12, fontWeight: 'normal' }} >cut off score should be greater than zero.</p> : <></>
            }
            {(cutOff > testScore) ?
                <p style={{ color: 'red', fontSize: 12, fontWeight: 'normal' }} >cut off score should be less than test score.</p> : <></>
            }
            <button onClick={() =>{if(cutOff !== '' && cutOff !== '0' && parseInt(cutOff) > 0 && ((noOfQuestion >0 ? cutOff <= testScore : false) && !(/^0+$|^0*-0+$/.test(cutOff)))){ onCuffOffScoreChange(cutOff)} }} >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="10" cy="10" r="10" fill="white" />
                    <g clip-path="url(#clip0_7211_3458)">
                        <path d="M9.63021 11.8669C11.8854 11.8669 13.7135 10.0387 13.7135 7.78353C13.7135 5.52837 11.8854 3.7002 9.63021 3.7002C7.37505 3.7002 5.54688 5.52837 5.54688 7.78353C5.54688 10.0387 7.37505 11.8669 9.63021 11.8669Z" stroke="#384455" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M7.45971 11.72L6.83594 16.4164L9.7526 14.6664L12.6693 16.4164L12.0462 11.72L12.0048 11.4082" stroke="#384455" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
                        <line x1="7.64844" y1="7.27539" x2="11.8484" y2="7.27539" stroke="#384455" stroke-width="1.25" />
                    </g>
                    <defs>
                        <clipPath id="clip0_7211_3458">
                            <rect width="14" height="14" fill="white" transform="translate(2.75 3)" />
                        </clipPath>
                    </defs>
                </svg>

                <span>Update Cutoff</span>
            </button>
        </div>

    )
}

export default UpdateCutOffScore