import React from 'react'
import ReactTooltip from 'react-tooltip';
import './index.css'
const DashboardCard = (props) => {

    return (
        <>
        <div data-tip={props?.header} className='card' >
            <div>
                <span>{props?.header}<br />{props?.value === "loading" ? <div class="loader" ></div> : <b>{props?.value}</b>}</span>
            </div>
            <div style={{ background: props.background }} >
                <img src={props?.logo} alt="" />
            </div>
        </div>
        
        </>
    )
}

export default DashboardCard