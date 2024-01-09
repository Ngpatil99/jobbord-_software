import React from 'react'
import './TestLoading.css'
import loader2 from '../../assets/images/Rolling-1s-200px.gif'
import logo from '../../assets/images/eliteQA.png'

function TestLoading() {
    return (
        <div className="loading-container">
            <img src={logo} alt="logo" />
            <div className='loading'>
                <img style={{ width: "48px", height: "48px" }} src={loader2} alt="" />
            </div>

        </div>
    )
}

export default TestLoading