import React, { useState } from 'react'
import './index.css'
import img from '../../../assets/images/loginright.jpeg'

function Card() {
    const [showImage, setShowImage] = useState(false)


    return (
        <div onClick={()=>setShowImage(!showImage)} className='notification-card-container' >
            <div className='header' >
                <label>27 june 2022</label>
                <svg style={{cursor:'pointer'}} width="31" height="30" viewBox="0 0 31 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="15.5" cy="15" r="15" fill="#FF6812" />
                    <path d="M12.1934 12.8057L17.6931 18.3054" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M12.1934 18.3057L17.6931 12.8059" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>

            </div>

            <label>Introducing New Feature</label>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit ut aliquam, purus sit amen</p>
            {showImage?
            <img src={img} alt="" />:<></>

            }
        </div>
    )
}

export default Card