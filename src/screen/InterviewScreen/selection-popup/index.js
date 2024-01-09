import React, { useState } from 'react'
import "./index.css"
import { backend_url,getCookie } from '../../../constant';
import axios from 'axios'
import { toast } from 'react-toastify'
import jwtDecode from "jwt-decode"

const SelectionStatusPopup = ({ closePopup, selectedInterviews, setSelectionPopup, getCompletedInterviews, getScheduledInterviews, getStatistics, setSelectedInterviews }) => {
    const [loading, setLoading] = useState(false)
    const [interviews, setInterviews] = useState([])
    const [skipLoading, setSkipLoading] = useState(false)
    const [selectionStatus, setSelectionStatus] = useState("")


    const handleStatus = (id, status) => {
        const updatedData = selectedInterviews.map((data) => {
            if (id === data._id) {
                data.selectionStatus = status === "" ? data.selectionStatus : status
                data.interviewStatus = "interviewed"
                if (data.round === "R1" && status === "Not Selected") {
                    data.finalStatus = "R1 Failed"
                } else if (data.round === "R1" && status === "selected") {
                    data.finalStatus = "R1 Passed"
                } else if (data.round === "R2" && status === "selected") {
                    data.finalStatus = "R2 Passed"
                } else if (data.round === "R2" && status === "Not Selected") {
                    data.finalStatus = "R2 Failed"
                }
            }
            return data
        })

        setInterviews(updatedData)
    }

    const updateInterviewStatusInBulk = async (skip) => {
        try {
            if (skip) {
                setSkipLoading(true)
            } else {
                const selectedArray = selectedInterviews.filter((data) => data.selectionStatus === "")
                if (selectedArray.length !== 0) {
                    return toast.error("Please select selection status.")
                } else {
                    setLoading(true)
                }
            }
            const token = getCookie("Xh7ERL0G")
            const decoded = jwtDecode(token)
            const updatedData = selectedInterviews.map((data) => {
                data.selectionStatus = ""
                return data
            })
            const response = await axios.put(`${backend_url}interview/update/interview/status/${decoded.user_id}`, {
                interviews: skip ? updatedData : selectedInterviews
            }, { headers: { "token": token } })
            if (response.status === 200) {
                getCompletedInterviews()
                getScheduledInterviews()
                getStatistics()
                setSelectedInterviews([])
                toast.success("Status updated successfully.")
                closePopup()
                setLoading(false)
                if (skip) {
                    closePopup()
                    setSkipLoading(false)
                }
            }
        } catch (error) {
            console.log(error)
            toast.error("Opps, Please try again!")
            setSkipLoading(false)
        }
    }


    return (
        <div className="selection-status-container-model">
            <div className="test-type-box">
                <div className="header">
                    <div className="title">
                        <span>
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" style={{
                                marginRight: "7px",
                                cursor: "pointer"
                            }} onClick={() => {
                                closePopup()
                            }}>
                                <circle cx="10" cy="10" r="10" fill="black" />
                                <path d="M13.895 6.11035L6.11719 13.8881" stroke="white" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M6.11719 6.11035L13.895 13.8881" stroke="white" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                            Interview Selection Status</span>
                        {skipLoading ? <span>Skipping...</span> : <span style={{
                            cursor: "pointer"
                        }} onClick={() => {
                            updateInterviewStatusInBulk(true)
                        }} className='skip'>Skip selection status for now</span>}
                    </div>
                    <div className="header-border"></div>
                </div>

                <div className="details">
                    {selectedInterviews.map((data, index) => {
                        return <div className="details">
                            <div className="name" key={index}>
                                <span>Name</span>
                                <div className="name-box">
                                    <span>{data.candidateId.candidateName}</span>
                                </div>
                            </div>
                            <div className="reason" key={index}>
                                <span>Selection Status <label>*</label></span>
                                <div className="select-box">
                                    <select onChange={(e) => {
                                        handleStatus(data._id, e.target.value === "" ? "" : e.target.value)
                                        setSelectionStatus(e.target.value)
                                    }} defaultValue={data.notDoneStatus}>
                                        <option value="">Select Selection Status</option>
                                        <option value="selected">Yes</option>
                                        <option value="Not Selected">No</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                    })}
                </div>

                <div className="button" style={{ marginTop: "5px" }}>
                    <div className="next-btn" onClick={() => {
                        updateInterviewStatusInBulk()
                    }}>
                        <svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg" style={{
                            marginRight: "12px"
                        }}>
                            <circle cx="10.5" cy="10" r="10" fill="white" />
                            <path d="M14.0938 7.44922L8.59375 12.9492L6.09375 10.4492" stroke="#FF6812" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                        <button>{loading ? "Submiting" : "Submit"}</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SelectionStatusPopup;