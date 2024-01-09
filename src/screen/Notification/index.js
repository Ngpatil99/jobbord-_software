import React from 'react'
import NotificationCard from './NotificationCard/index'
import './index.css'
import NavigationBar from '../../component/NavigationBar/NavigationBar'

const Notification=()=> {
    return (
        <>
        <NavigationBar/>
        <div className="notification-container">
            <div className="notif-top">
                <div className="notification-heading">
                    <span>Notifications (3)</span>
                </div>
            </div>

            <div className="all-cards">
                <div className="notif-card">
                    <NotificationCard />
                </div>
                <div className="notif-card">
                    <NotificationCard />
                </div>
                <div className="notif-card">
                    <NotificationCard />
                </div>
            </div>
        </div>
        </>
    )
}

export default Notification
