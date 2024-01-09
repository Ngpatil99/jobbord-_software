import React, { useState } from 'react'
import "./index.css"
import { backend_url,getCookie } from '../../../constant';
import axios from 'axios'
import { toast } from 'react-toastify'
import jwtDecode from "jwt-decode"

const NotDonePopup = ({ closePopup, selectedInterviews, setClosePopup, getCompletedInterviews, getScheduledInterviews, getStatistics, setSelectedInterviews }) => {
    const [loading, setLoading] = useState(false)
    const [interviews, setInterviews] = useState([])
    const [reasons, setReasons] = useState("")


    const handleStatus = (id, status) => {
        const updatedData = selectedInterviews.map((data) => {
            if (id === data._id) {
                data.notDoneStatus = status === "" ? data.notDoneStatus : status
            }
            return data
        })
        setInterviews(updatedData)
    }

    const updateStatus = async () => {
        try {
            if (reasons === "") {
                return toast.error("Please select reason.")
            }
            setLoading(true)
            const token = getCookie("Xh7ERL0G")
            const decoded = jwtDecode(token)
            const response = await axios.put(`${backend_url}interview/update/not/done/status/${decoded.user_id}`, {
                interviews: interviews.length === 0 ? selectedInterviews : interviews
            }, { headers: { "token": token } })
            setLoading(false)
            getCompletedInterviews()
            getScheduledInterviews()
            getStatistics()
            toast.success("Status updated successfully.")
            setSelectedInterviews([])
            setClosePopup(false)
        } catch (error) {
            console.log(error)
            toast.error("Opps, Please try again!")
        }
    }

    return (
        <div className="not-done-container-model">
            <div className="test-type-box">
                <div className="header">
                    <div className="title">
                        <span>
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" style={{
                                marginRight: "7px"
                            }}>
                                <circle cx="10" cy="10" r="10" fill="black" />
                                <path d="M13.895 6.11035L6.11719 13.8881" stroke="white" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M6.11719 6.11035L13.895 13.8881" stroke="white" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                            Interview Status - Not Done</span>
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ cursor: "pointer" }} onClick={() => {
                            closePopup()
                        }}>
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M12.0032 13.6551L7.00642 8.65882L2.01082 13.6551C1.55102 14.1148 0.805358 14.1151 0.345266 13.6554C-0.114825 13.1957 -0.115113 12.4499 0.344547 11.99L5.34122 6.99369L0.344476 1.99628C-0.102534 1.534 -0.0962087 0.798602 0.358851 0.34437C0.813839 -0.110149 1.54922 -0.115324 2.01082 0.332296L7.00642 5.32856L12.0032 0.332296C12.4666 -0.103824 13.1925 -0.0928997 13.6426 0.35702C14.0927 0.806652 14.1041 1.53256 13.6684 1.99628L8.67162 6.99369L13.6684 11.99C14.1157 12.4519 14.1098 13.1873 13.6551 13.6419C13.2004 14.0967 12.4651 14.1024 12.0031 13.6551H12.0032Z" fill="#99B2C6" />
                        </svg>
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
                                <span>Reason <label>*</label></span>
                                <div className="select-box">
                                    <select onChange={(e) => {
                                        handleStatus(data._id, e.target.value === "" ? "Not connected" : e.target.value)
                                        setReasons(e.target.value)
                                    }} defaultValue={data.notDoneStatus}>
                                        <option value="">Select Reason</option>
                                        <option value="Not connected">Not connected</option>
                                        <option value="Didn't Answer The Call">Didn't Answer The Call</option>
                                        <option value="Personal Reason">Personal Reason</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                    })}
                </div>

                <div className="button" style={{ marginTop: "5px" }}>
                    <div className="next-btn" onClick={() => {
                        updateStatus()
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

export default NotDonePopup;