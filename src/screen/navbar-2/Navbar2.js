import React from 'react'
import './Navbar2.css'
function Navbar2() {
    return (
        <div className="navbar-container">
            <div className="left-heading">
                <div className="logo">
                    <svg width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="38" height="38" rx="2" fill="#2A2C2B" />
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M11.8139 27.0018C11.5423 26.5418 11.469 25.9913 11.6107 25.4763C11.7524 24.9613 12.097 24.5259 12.5657 24.2696L25.9068 16.7697C26.8866 16.2165 28.1285 16.5405 28.7131 17.5018C28.9847 17.9619 29.0581 18.5124 28.9164 19.0275C28.7747 19.5427 28.43 19.9782 27.9614 20.2347L14.6183 27.7333C14.3052 27.9094 13.9521 28.0019 13.5929 28.0018C12.8651 28.0055 12.1891 27.6255 11.8139 27.0018V27.0018ZM10.2736 19.5015C10.0022 19.0415 9.92898 18.4911 10.0707 17.9762C10.2124 17.4612 10.5568 17.0257 11.0254 16.7693L24.3672 9.26998C25.3465 8.71647 26.5884 9.04025 27.1728 10.0015C27.4444 10.4615 27.5178 11.0121 27.3761 11.5272C27.2344 12.0423 26.8897 12.4779 26.4211 12.7343L13.0799 20.2336C12.767 20.4094 12.4141 20.5017 12.0552 20.5015C11.3264 20.5055 10.6494 20.1253 10.2736 19.5008V19.5015Z" fill="white" />
                    </svg>
                </div>
            </div>
            <div className="right-heading">
                <div className="time-button">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g clip-path="url(#clip0_3278_3022)">
                            <path d="M8.00016 14.6667C11.6821 14.6667 14.6668 11.6819 14.6668 8.00001C14.6668 4.31811 11.6821 1.33334 8.00016 1.33334C4.31826 1.33334 1.3335 4.31811 1.3335 8.00001C1.3335 11.6819 4.31826 14.6667 8.00016 14.6667Z" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M8 4V8L10.6667 9.33333" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                        </g>
                        <defs>
                            <clipPath id="clip0_3278_3022">
                                <rect width="16" height="16" fill="white" />
                            </clipPath>
                        </defs>
                    </svg>
                    <span>01:55:00</span>
                </div>
                <div className="end-task">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12.24 4.42667C13.0789 5.26586 13.6501 6.33496 13.8815 7.49879C14.1129 8.66263 13.9939 9.86893 13.5397 10.9652C13.0856 12.0614 12.3165 12.9984 11.3299 13.6576C10.3432 14.3168 9.18325 14.6686 7.99665 14.6686C6.81004 14.6686 5.65008 14.3168 4.66343 13.6576C3.67678 12.9984 2.90774 12.0614 2.45356 10.9652C1.99937 9.86893 1.88044 8.66263 2.11179 7.49879C2.34314 6.33496 2.91439 5.26586 3.75331 4.42667" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M8 1.33334V8.00001" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                    <span>End Test</span>
                </div>
            </div>
        </div>
    )
}

export default Navbar2