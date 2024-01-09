import React, { useState, useEffect } from 'react'
import './index.css'
import rightSideBackgroundImg from '../../assets/images/rightside.jpg'
const RightSidePanel = () => {
  const testimonal = ['Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec arcu ipsum, mollis non erat vitae, vulputate ultrices dui', 'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit...', 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.']

  const [selectedTestimonal, setselectedTestimonal] = useState(0)

  useEffect(() => {
    testimonalIterate()
    // eslint-disable-next-line
  }, [selectedTestimonal])

  const testimonalIterate = () => {
    setTimeout(() => {
      if (selectedTestimonal < 2) {
        setselectedTestimonal(selectedTestimonal + 1)
      }
    }, 3000)
  }

  return (
    <div className='right' >
      {/*backgorund image */}
      <img alt="" src={rightSideBackgroundImg} />
      {/*no of comapany container */}
      <div className='no-of-company' >
        {/* like icon */}
        <svg width="49" height="42" viewBox="0 0 49 42" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g clip-path="url(#clip0_2330_2074)">
            <rect opacity="0.4" width="44" height="42" rx="21" transform="matrix(-1 0 0 1 48.458 -0.0595703)" fill="#00C49A" />
            <path d="M19.8203 17.5885C21.02 16.0943 21.7688 14.3798 22.0692 12.4388C22.0978 12.2539 22.2471 12.1001 22.4521 12.0445C24.518 11.4842 25.6926 12.3746 25.6732 14.405C25.6694 14.7991 25.6487 15.1495 25.6045 15.6852C25.5058 16.882 25.5136 17.2086 25.6665 17.4284C25.8135 17.6396 26.2905 17.7117 27.4189 17.524C27.7749 17.4647 28.1321 17.3976 28.5277 17.3169C28.7023 17.2813 29.9601 17.0123 30.2816 16.9515C30.895 16.8354 31.335 16.7863 31.722 16.8071C32.7703 16.8634 33.3266 17.455 33.4228 18.5884C33.592 20.5844 33.069 24.5935 32.5471 26.0703C32.0139 27.5793 31.084 28.1489 28.8517 28.1833C27.4165 28.2054 25.2092 28.2054 22.2194 28.1832C21.4562 28.1677 20.7645 28.0382 20.1493 27.796C20.322 27.4826 20.4187 27.1315 20.4187 26.7608V19.0803C20.4187 18.5165 20.1949 17.9981 19.8203 17.5885Z" fill="black" />
            <path d="M16.5511 17.6396C15.6356 17.6396 14.8936 18.2844 14.8936 19.0796V26.7596C14.8936 27.5549 15.6356 28.1996 16.5511 28.1996H17.6561C18.5715 28.1996 19.3136 27.5549 19.3136 26.7596V19.0796C19.3136 18.2844 18.5715 17.6396 17.6561 17.6396H16.5511Z" fill="black" />
          </g>
          <defs>
            <clipPath id="clip0_2330_2074">
              <rect width="48.3439" height="42" fill="white" transform="matrix(-1 0 0 1 48.458 0)" />
            </clipPath>
          </defs>
        </svg>

        <span>
          <p>135</p>
          <label>Companies Using EliteQA</label>
        </span>

      </div>
      {/*name here container */}
      <div className='name-here-container' >
        <label>Name Here</label>
        <p>Hiring is now peice of cake!</p>
      </div>
      {/* testimonal container */}
      <div className='testimonal' >
        <p>{testimonal[selectedTestimonal]}</p>
        <div className='identicator' >
          <span onClick={() => setselectedTestimonal(0)} style={selectedTestimonal === 0 ? { background: 'rgba(255, 255, 255, 0.7)' } : {}} ></span>
          <span onClick={() => setselectedTestimonal(1)} style={selectedTestimonal === 1 ? { background: 'rgba(255, 255, 255, 0.7)' } : {}}></span>
          <span onClick={() => setselectedTestimonal(2)} style={selectedTestimonal === 2 ? { background: 'rgba(255, 255, 255, 0.7)' } : {}}></span>

        </div>




      </div>
    </div>
  )
}

export default RightSidePanel