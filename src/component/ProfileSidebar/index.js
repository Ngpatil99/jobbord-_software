import React from 'react'
import {useNavigate} from 'react-router-dom'
import { toast } from 'react-toastify'
import './index.css'

function ProfileSidebar(props) {
    const navigate = useNavigate()
    return (
        <div className="sidebar">
            <div className="header">
                <span>Your Profile</span>
                <div className="bottom-line"></div>
            </div>

            <div  className="menu-list">
                <div onClick={()=>navigate('/userprofile')} className="item" style={props.active==="profile"?{ marginTop: "29px",backgroundColor:"rgba(255, 255, 255, 0.16)" }:{marginTop: "29px"}}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M13.3327 13.333V11.9997C13.3327 11.2924 13.0517 10.6142 12.5516 10.1141C12.0515 9.61396 11.3733 9.33301 10.666 9.33301H5.33268C4.62544 9.33301 3.94716 9.61396 3.44706 10.1141C2.94697 10.6142 2.66602 11.2924 2.66602 11.9997V13.333" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M8.00065 6.66634C9.47341 6.66634 10.6673 5.47243 10.6673 3.99967C10.6673 2.52692 9.47341 1.33301 8.00065 1.33301C6.52789 1.33301 5.33398 2.52692 5.33398 3.99967C5.33398 5.47243 6.52789 6.66634 8.00065 6.66634Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>

                    <span>YourDetails</span>
                </div>

                <div onClick={()=>navigate('/changepassword')} className="item" style={props.active==="password"?{ backgroundColor: "rgba(255, 255, 255, 0.16)" }:{}}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12.6667 7.33301H3.33333C2.59695 7.33301 2 7.92996 2 8.66634V13.333C2 14.0694 2.59695 14.6663 3.33333 14.6663H12.6667C13.403 14.6663 14 14.0694 14 13.333V8.66634C14 7.92996 13.403 7.33301 12.6667 7.33301Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M4.66602 7.33301V4.66634C4.66602 3.78229 5.01721 2.93444 5.64233 2.30932C6.26745 1.6842 7.11529 1.33301 7.99935 1.33301C8.8834 1.33301 9.73125 1.6842 10.3564 2.30932C10.9815 2.93444 11.3327 3.78229 11.3327 4.66634V7.33301" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>


                    <span>Password</span>
                </div>

                <div  onClick={()=>props.onClickLogoutOption()} className="item">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10 2H12.6667C13.0203 2 13.3594 2.14048 13.6095 2.39052C13.8595 2.64057 14 2.97971 14 3.33333V12.6667C14 13.0203 13.8595 13.3594 13.6095 13.6095C13.3594 13.8595 13.0203 14 12.6667 14H10" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M6.66602 11.3337L9.99935 8.00033L6.66602 4.66699" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M10 8H2" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>


                    <span>Log Out</span>
                </div>
            </div>

            <div className="support-box">

                <span>Reach Out To Us!</span>
                <p>Any doubt? Problem? feel free to drop a support request</p>
                <div className="button">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7.73438 14.1807C11.294 14.1807 14.1797 11.2948 14.1797 7.7349C14.1797 4.17496 11.294 1.28906 7.73438 1.28906C4.17473 1.28906 1.28906 4.17496 1.28906 7.7349C1.28906 11.2948 4.17473 14.1807 7.73438 14.1807Z" stroke="white" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M5.85938 5.80084C6.01091 5.37005 6.31 5.00678 6.70368 4.77539C7.09736 4.54401 7.56023 4.45942 8.01029 4.53663C8.46035 4.61383 8.86857 4.84784 9.16265 5.19721C9.45672 5.54657 9.61767 5.98875 9.61699 6.44542C9.61699 7.73459 7.6834 8.37917 7.6834 8.37917" stroke="white" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M7.73438 10.958H7.74211" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>

                    <span>Support</span>
                </div>

            </div>
        </div>
    )
}

export default ProfileSidebar