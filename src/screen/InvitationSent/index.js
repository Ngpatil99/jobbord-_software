import React, { useEffect } from 'react'
import './index.css'
import NavigationBar from "../../component/NavigationBar/NavigationBar";
import mail from '../../assets/gifs/mail.gif'
import { useNavigate, useParams } from 'react-router-dom';


function InvitationSent() {
    useEffect(() => {
        // setInterval(() => {
        //     navigate(`/assessmentoverview/${id}`)
        // }, 8700);
    }, [])


    return (
        <div className="invitation-sent-container">
            <NavigationBar />
            <div className="invite-sent-bulk-container">
                <div className="invite-sent-content">
                    <img className='mail' src={mail} alt="" />
                    <div className="title">
                        <span>Emails Sent!</span>
                        <p>Test invitations are successfully sent  to listed candidates</p>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default InvitationSent