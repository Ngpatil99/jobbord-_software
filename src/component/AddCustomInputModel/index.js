import React from 'react';
import './index.css';

const CustomInput = (props) => {

    return (
        <div className="test-type-container">
            <div className="test-type-box">
                <div className="header">
                    <div className="title">
                        <span>Custom Input Field</span>
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" onClick={() => {
                            props.close();
                        }} style={{ cursor: "pointer" }}>
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M12.0032 13.6551L7.00642 8.65882L2.01082 13.6551C1.55102 14.1148 0.805358 14.1151 0.345266 13.6554C-0.114825 13.1957 -0.115113 12.4499 0.344547 11.99L5.34122 6.99369L0.344476 1.99628C-0.102534 1.534 -0.0962087 0.798602 0.358851 0.34437C0.813839 -0.110149 1.54922 -0.115324 2.01082 0.332296L7.00642 5.32856L12.0032 0.332296C12.4666 -0.103824 13.1925 -0.0928997 13.6426 0.35702C14.0927 0.806652 14.1041 1.53256 13.6684 1.99628L8.67162 6.99369L13.6684 11.99C14.1157 12.4519 14.1098 13.1873 13.6551 13.6419C13.2004 14.0967 12.4651 14.1024 12.0031 13.6551H12.0032Z" fill="#99B2C6" />
                        </svg>
                    </div>
                    <div className="header-border"></div>
                </div>

                <div className="details">
                    <div className="label">
                        <span>Label</span>
                        <input type="text" placeholder='Education' />
                    </div>
                    <div className="input-type">
                        <span>Input Type</span>
                        <div className="select-box">
                            <select name="" id="">
                                <option value="Textarea">Textarea</option>
                            </select>
                            <svg className='vector-svg' width="14" height="8" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1 1L7 7L13 1" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="placeholder">
                    <div className="placeholder-title">
                        <span>Placeholder</span>
                    </div>
                    <div className="search">
                        <input type="text" placeholder='Your Educational Qualification' />
                    </div>

                </div>
                <div className="button" style={{ marginTop: "5px" }}>
                    <div className="cancel-btn">
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="9" cy="9" r="9" fill="white" />
                            <path d="M12.5 5.5L5.5 12.5" stroke="#827C7C" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M5.5 5.5L12.5 12.5" stroke="#827C7C" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>

                        <button>Cancel</button>
                    </div>

                    <div className="next-btn">
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="9" cy="9" r="9" fill="white" />
                            <path d="M9.01826 4.0505L8.97489 13.9499" stroke="#00C49A" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M4.04688 8.97852L13.9463 9.02188" stroke="#00C49A" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>

                        <button>Add</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomInput;