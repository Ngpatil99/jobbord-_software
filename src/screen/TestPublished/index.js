import React, { useContext, useEffect } from 'react';
import './index.css';
import NavigationBar from '../../component/NavigationBar/NavigationBar';
import success from '../../assets/gifs/success.gif'
import { useState } from 'react';
import { toast } from "react-toastify";
import { useNavigate,useLocation } from 'react-router-dom';
import {getCookie,backend_url} from '../../constant'
import axios from 'axios';
import jwtDecode from 'jwt-decode';
import CreateTestContext from '../../store/CreateTestContext'


const TestPublished = () => {
    let navigate = useNavigate()
    const {state} = useLocation()
    const createTestContext = useContext(CreateTestContext)
    const [personName, setPersonName] = useState("")
    const [email, setEmail] = useState("")
    const [validity, setValidity] = useState("1")

    
    const sendInvite = () => {
        if (personName.length > 0 && email.length > 0 && validity.length > 0) {
            inviteCandidate()
        }
        else if (personName.length == 0) toast.error('Person Name is required')
        else if (email.length == 0) toast.error('Valid email is required')
        else {
            toast.error('Select Validity of invite')
        }
    }

    const inviteCandidate = async () => {
        try {
            console.log(state)
            const token = getCookie("Xh7ERL0G")
            const decode = jwtDecode(token)
            const currentDate = new Date(createTestContext.startDate) > new Date() ? new Date(createTestContext.startDate) : new Date();
            const validityEndDate = new Date(currentDate);
            
            validityEndDate.setDate(currentDate.getDate() + parseInt(validity))
            const res = await axios.post(`${backend_url}invites/create`, {
                "testId": state.id,
                "candidateName": personName,
                "candidateEmail": email,
                "validity": validity,
                "validityStartDate": currentDate,
                "validityEndDate": validityEndDate > new Date(createTestContext.endDate) ? new Date(createTestContext.endDate) :validityEndDate ,
                "status": [{ "currentStatus": "Invited", "statusDate": validityEndDate }],
                "invitedBy": decode.user_id
            }, { headers: { "token": token } })
            if (Object.keys(res.data.data).length > 0) {
                navigate(`/invitesent/${state.id}`)
            } else {
                toast.error('candidate has already invited!')
            }
        } catch (error) {
            console.log(error)
            toast.error(error)
        }
    }

    const handleNameChange = (e) => {
        const newName = e.target.value;

        // Check if the new name contains numeric characters
        if (!/\d/.test(newName)) {
            setPersonName(newName);
        }
    };

    const onClickPreview=(e)=>{
        e.stopPropagation()
        let url = `https://www.assessment.theeliteqa.com/preview?testId=${state.id}`
        window.open(url, '_blank')
    }
    return (
        <div className="test-published-container">
            <NavigationBar settingPreview={true} onClickPreview={(e)=>onClickPreview(e)} />
            <div className="test-published">
                <div className="content-container">
                    <div className="left-content">
                        <img src={success} alt="" />
                        <h1 style={{ marginTop: "50px" }}>Test Published!</h1>
                        <h2>Copy Or  Edit test invite link below</h2>
                        <div className="link-container">
                            <input type="text" value={createTestContext.testLink} disabled />
                            <button onClick={() => { navigator.clipboard.writeText(createTestContext.testLink); toast.success(`Test Link Copied To ClipBoard`); }}>
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <g clip-path="url(#clip0_2634_2210)">
                                        <path d="M16.6667 7.5H9.16667C8.24619 7.5 7.5 8.24619 7.5 9.16667V16.6667C7.5 17.5871 8.24619 18.3333 9.16667 18.3333H16.6667C17.5871 18.3333 18.3333 17.5871 18.3333 16.6667V9.16667C18.3333 8.24619 17.5871 7.5 16.6667 7.5Z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                        <path d="M4.16797 12.5003H3.33464C2.89261 12.5003 2.46868 12.3247 2.15612 12.0122C1.84356 11.6996 1.66797 11.2757 1.66797 10.8337V3.33366C1.66797 2.89163 1.84356 2.46771 2.15612 2.15515C2.46868 1.84259 2.89261 1.66699 3.33464 1.66699H10.8346C11.2767 1.66699 11.7006 1.84259 12.0131 2.15515C12.3257 2.46771 12.5013 2.89163 12.5013 3.33366V4.16699" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                    </g>
                                    <defs>
                                        <clipPath id="clip0_2634_2210">
                                            <rect width="20" height="20" fill="white" />
                                        </clipPath>
                                    </defs>
                                </svg>
                            </button>
                        </div>
                    </div>
                    <div className="right-content">
                        <div className="right-content-container">
                            <div className="header">
                                <h1>Invite Candidates</h1>
                            </div>

                            <div className="details">
                                <div className="name">
                                    <span>Name</span>
                                    <div className="input-box">
                                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M15 15V13.5C15 12.7044 14.6839 11.9413 14.1213 11.3787C13.5587 10.8161 12.7957 10.5 12 10.5H6C5.20435 10.5 4.44129 10.8161 3.87868 11.3787C3.31607 11.9413 3 12.7044 3 13.5V15" stroke="#333333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                            <path d="M9 7.5C10.6569 7.5 12 6.15685 12 4.5C12 2.84315 10.6569 1.5 9 1.5C7.34315 1.5 6 2.84315 6 4.5C6 6.15685 7.34315 7.5 9 7.5Z" stroke="#333333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                        </svg>
                                        <input value={personName} onChange={handleNameChange} type="text" placeholder='Person Name Here' />
                                    </div>
                                </div>
                            </div>

                            <div className="email-validity">
                                <div className="email">
                                    <span>Email</span>
                                    <div className="input-box">
                                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M3 3H15C15.825 3 16.5 3.675 16.5 4.5V13.5C16.5 14.325 15.825 15 15 15H3C2.175 15 1.5 14.325 1.5 13.5V4.5C1.5 3.675 2.175 3 3 3Z" stroke="#333333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                            <path d="M16.5 4.5L9 9.75L1.5 4.5" stroke="#333333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                        </svg>
                                        <input onChange={(e) => { setEmail(e.target.value) }} type="text" placeholder='Something@something.com' />
                                    </div>
                                </div>
                                <div className="validity">
                                    <span>Validity</span>
                                    <div className="select-box">
                                        <select onChange={(e) => { setValidity(e.target.value) }} name="" id="">
                                            <option value="1">1 Day</option>
                                            <option value="2">2 Days</option>
                                            <option value="3">3 Days</option>
                                            <option value="4">4 Days</option>
                                            <option value="5">5 Days</option>
                                            <option value="6">6 Days</option>
                                            <option value="7">7 Days</option>
                                        </select>
                                        <svg className='vector-svg' width="14" height="8" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M1 1L7 7L13 1" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            <div className="button-container">
                                <button className='send-invite' onClick={() => { sendInvite() }}>
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="10" cy="10" r="10" fill="white" />
                                        <path d="M14.5 5L9 10.5" stroke="#FF6812" stroke-linecap="round" stroke-linejoin="round" />
                                        <path d="M14.5 5L11 15L9 10.5L4.5 8.5L14.5 5Z" stroke="#FF6812" stroke-linecap="round" stroke-linejoin="round" />
                                    </svg>
                                    Send Invite
                                </button>
                                <span>OR</span>
                                <button className='bulk-invite-btn' onClick={() => { navigate('/bulkinvite') }}>
                                    <svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="10.5" cy="10" r="10" fill="#00C49A" />
                                        <path d="M14.5 6L9 11.5" stroke="white" stroke-linecap="round" stroke-linejoin="round" />
                                        <path d="M14.5 6L11 16L9 11.5L4.5 9.5L14.5 6Z" stroke="white" stroke-linecap="round" stroke-linejoin="round" />
                                    </svg>
                                    Bulk Invite
                                </button>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TestPublished;