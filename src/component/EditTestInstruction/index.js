import React from 'react'
import { useState } from 'react';
import './index.css'
import { toast } from "react-toastify";
import axios from 'axios'
import { backend_url,getCookie } from '../../constant';

function EditTestInstruction(props) {
    const [testInstructions, setTestInstructions] = useState(props.testData.instruction);
    const [instructionData, setInstructionData] = useState("")
    const [selectedInstruction, setSelectedInstruction] = useState(0);
    const [testData, setTestData] = useState(props.testData)
    const [loading, setLoading] = useState(false)

    const removeInstruction = (val) => {
        setTestInstructions(testInstructions.filter((data, index) => {
            return index != val
        }))
    }

    const checkIsTestInstruction = () => {
        let cnt = 0
        testInstructions.forEach(data => {
            if (data.instruction.trim() !== "") {
                cnt = cnt + 1
            }
        })
        return cnt === 0 ? true : false
    }

    const updateTest = async () => {
        try {
            
            if(checkIsTestInstruction){
            setLoading(true)
            const token = getCookie("Xh7ERL0G")
            let body = {
                ...testData,
                instruction: testInstructions
            }

            const response = await axios.put(`${backend_url}test/update/${props.testData._id}`, body, { headers: { "token": token } })
                setLoading(false)
                props.closeEditInstruction()
                return toast.success("Test Instructions are saved successfully");
            }
        } catch (error) {
            console.log(error)
            setLoading(false)
            toast.error("Failed to save test instruction.")
        }
    }



    return (
        <div className="test-edit-instruction">
            <div className="test-edit-instruction-box">
                <div className="header">
                    <div className="title">
                        <span>Edit Test Instructions</span>
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" onClick={props.closeEditInstruction} style={{ cursor: "pointer" }}>
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M12.0032 13.6551L7.00642 8.65882L2.01082 13.6551C1.55102 14.1148 0.805358 14.1151 0.345266 13.6554C-0.114825 13.1957 -0.115113 12.4499 0.344547 11.99L5.34122 6.99369L0.344476 1.99628C-0.102534 1.534 -0.0962087 0.798602 0.358851 0.34437C0.813839 -0.110149 1.54922 -0.115324 2.01082 0.332296L7.00642 5.32856L12.0032 0.332296C12.4666 -0.103824 13.1925 -0.0928997 13.6426 0.35702C14.0927 0.806652 14.1041 1.53256 13.6684 1.99628L8.67162 6.99369L13.6684 11.99C14.1157 12.4519 14.1098 13.1873 13.6551 13.6419C13.2004 14.0967 12.4651 14.1024 12.0031 13.6551H12.0032Z" fill="#99B2C6" />
                        </svg>
                    </div>
                    <div className="header-border"></div>
                </div>

                <div className="right-container">
                    <div className="test-instructions">
                        <div className='input-container'>
                            <div className="input-box">
                                <input value={instructionData} onChange={(e) => { setInstructionData(e.target.value); }} type="text" placeholder='Test instruction here' />
                            </div>
                            <button onClick={() => { if(instructionData.length && instructionData.trim() !==""){ setTestInstructions([...testInstructions, { instruction: instructionData }]); setInstructionData("")}else{toast.error('please add test instruction!')} }}>
                                <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="10" cy="10.6357" r="10" fill="white" />
                                    <path d="M10 6.55273V14.7194" stroke="#384455" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                    <path d="M5.91797 10.6357H14.0846" stroke="#384455" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    <div className='test-instruction-container1' >
                        {testInstructions.map((data,index)=>{
                            return(
                                <div style={selectedInstruction === index?{border: '1px solid #00C49A'}:{}} className='indivual-instruction-container' onClick={() => {
                                    setSelectedInstruction(index);
                                }} >
                                        <ul>
                                            <li>{data.instruction}</li>
                                        </ul>
                                        <div className='icon-container' >
                                        {selectedInstruction === index ? <svg onClick={() => { removeInstruction(index);  }} width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12.5 4.63574L4.5 12.6357" stroke="#00C49A" stroke-linecap="round" stroke-linejoin="round" />
                                    <path d="M4.5 4.63574L12.5 12.6357" stroke="#00C49A" stroke-linecap="round" stroke-linejoin="round" />
                                </svg> : null}
                                </div>

                                </div>
                            )
                        })

                        }
                    </div>

                    {/* <div className="test-instruction-container">
                        {testInstructions.map((data, index) => {
                            return <div className={selectedInstruction === index ? "active-instruction" : "instruction"} onClick={() => {
                                setSelectedInstruction(index);
                            }}>
                                <ul>
                                    <li>{data.instruction}</li>
                                </ul>

                                {selectedInstruction === index ? <svg onClick={() => { removeInstruction(index);  }} width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12.5 4.63574L4.5 12.6357" stroke="#00C49A" stroke-linecap="round" stroke-linejoin="round" />
                                    <path d="M4.5 4.63574L12.5 12.6357" stroke="#00C49A" stroke-linecap="round" stroke-linejoin="round" />
                                </svg> : null}
                            </div>;
                        })}
                    </div> */}
                </div>
                <div className="edit-test-instruction-btn">
                    <button className="cancel" onClick={props.closeEditInstruction}>
                        <svg width="18" height="19" viewBox="0 0 18 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="9" cy="9.5166" r="9" fill="white" />
                            <path d="M12.5 6.0166L5.5 13.0166" stroke="#827C7C" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M5.5 6.0166L12.5 13.0166" stroke="#827C7C" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                        Cancel
                    </button>
                    <button className="save" onClick={() => { updateTest() }}>
                        <svg width="18" height="19" viewBox="0 0 18 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="9" cy="9.5166" r="9" fill="white" />
                            <path d="M11.9557 7.4248L7.3724 12.0081L5.28906 9.9248" stroke="#00C49A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                        {loading ? "Saving" : "Save"}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default EditTestInstruction