import React from 'react';
import './index.css';
import { Link, useNavigate } from "react-router-dom";

function CreateTest2Sidebar(props) {
    return (
        <div className="CreateTest-2Sidebar">
            <div className="info-panel">
                <div className="heading">
                    <span>Step {props.pageNo}</span>
                    <p>{props.active}</p>
                </div>
                <div className="info">
                    
                        <div className="title">
                            <svg width="33" height="33" viewBox="0 0 33 33" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M18.25 12.0127V22H16.6025V13.9678L14.1621 14.7949V13.4346L18.0518 12.0127H18.25Z" fill={props.active==="test details"?"white":"rgba(255, 255, 255, 0.4)"} fill-opacity={props.active==="test details"?"1":"0.4"} />
                                <circle cx="16.5" cy="16.5" r="16" stroke={props.active==="test details"?"white":"rgba(255, 255, 255, 0.4)"} stroke-opacity={props.active==="test details"?"1":"0.4"} />
                            </svg>
                            <span style={props.active==="test details"?{color:"white"}:{color: "rgba(255, 255, 255, 0.4)",opacity:"0.4"}} >Test Details</span>
                        </div>
                    
                    <svg className='ver-line' width="2" height="65" viewBox="0 0 2 65" fill="none" stroke-opacity="0.4" xmlns="http://www.w3.org/2000/svg">
                        <line x1="1" y1="64.0039" x2="1" y2="0.995972" stroke="white" stroke-dasharray="5 5" />
                    </svg>
                    
                        <div className="title">
                            <svg width="33" height="33" viewBox="0 0 33 33" fill="none" xmlns="http://www.w3.org/2000/svg" >
                                <path d="M19.4238 20.6875V22H12.752V20.8721L15.9922 17.3379C16.3477 16.9368 16.6279 16.5905 16.833 16.2988C17.0381 16.0072 17.1816 15.7451 17.2637 15.5127C17.3503 15.2757 17.3936 15.0456 17.3936 14.8223C17.3936 14.5078 17.3343 14.2321 17.2158 13.9951C17.1019 13.7536 16.9333 13.5645 16.71 13.4277C16.4867 13.2865 16.2155 13.2158 15.8965 13.2158C15.5273 13.2158 15.2174 13.2956 14.9668 13.4551C14.7161 13.6146 14.527 13.8356 14.3994 14.1182C14.2718 14.3962 14.208 14.7152 14.208 15.0752H12.5605C12.5605 14.4964 12.6927 13.9678 12.957 13.4893C13.2214 13.0062 13.6042 12.6234 14.1055 12.3408C14.6068 12.0537 15.2106 11.9102 15.917 11.9102C16.5824 11.9102 17.1475 12.0218 17.6123 12.2451C18.0771 12.4684 18.4303 12.7852 18.6719 13.1953C18.918 13.6055 19.041 14.0908 19.041 14.6514C19.041 14.9613 18.9909 15.2689 18.8906 15.5742C18.7904 15.8796 18.6468 16.1849 18.46 16.4902C18.2777 16.791 18.0612 17.0941 17.8105 17.3994C17.5599 17.7002 17.2842 18.0055 16.9834 18.3154L14.8301 20.6875H19.4238Z" fill={props.active==="question overview"?"white":"rgba(255, 255, 255, 0.4)"} fill-opacity={props.active==="question overview"?"1":"0.4"} />
                                <circle cx="16.5" cy="16.5" r="16" stroke={props.active==="question overview"? "white":"rgba(255, 255, 255, 0.4)"} stroke-opacity={props.active==="question overview"?"1":"0.4"} />
                            </svg>
                            <span style={props.active==="question overview"?{color:"white"}:{color: "rgba(255, 255, 255, 0.4)",opacity:"0.4"}}>Questions</span>
                        </div>
                    
                    <svg className='ver-line' width="2" height="65" viewBox="0 0 2 65" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <line x1="1" y1="64.0039" x2="1" y2="0.995972" stroke="white" stroke-opacity="0.4" stroke-dasharray="5 5" />
                    </svg>
                    
                        <div className="title">
                            <svg width="33" height="33" viewBox="0 0 33 33" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M15.6865 16.2783H16.6709C17.0537 16.2783 17.3704 16.2122 17.6211 16.0801C17.8763 15.9479 18.0654 15.7656 18.1885 15.5332C18.3115 15.3008 18.373 15.0342 18.373 14.7334C18.373 14.4189 18.3161 14.1501 18.2021 13.9268C18.0928 13.6989 17.9242 13.5234 17.6963 13.4004C17.473 13.2773 17.1882 13.2158 16.8418 13.2158C16.5501 13.2158 16.2858 13.2751 16.0488 13.3936C15.8164 13.5075 15.6318 13.6715 15.4951 13.8857C15.3584 14.0954 15.29 14.346 15.29 14.6377H13.6357C13.6357 14.109 13.7747 13.6396 14.0527 13.2295C14.3307 12.8193 14.709 12.498 15.1875 12.2656C15.6706 12.0286 16.2129 11.9102 16.8145 11.9102C17.457 11.9102 18.0176 12.0173 18.4961 12.2314C18.9792 12.4411 19.3551 12.7555 19.624 13.1748C19.8929 13.5941 20.0273 14.1136 20.0273 14.7334C20.0273 15.016 19.9613 15.3031 19.8291 15.5947C19.6969 15.8864 19.501 16.153 19.2412 16.3945C18.9814 16.6315 18.6579 16.8252 18.2705 16.9756C17.8831 17.1214 17.4342 17.1943 16.9238 17.1943H15.6865V16.2783ZM15.6865 17.5635V16.6611H16.9238C17.5072 16.6611 18.0039 16.7295 18.4141 16.8662C18.8288 17.0029 19.166 17.1921 19.4258 17.4336C19.6855 17.6706 19.8747 17.9417 19.9932 18.2471C20.1162 18.5524 20.1777 18.876 20.1777 19.2178C20.1777 19.6826 20.0934 20.0973 19.9248 20.4619C19.7607 20.8219 19.526 21.1273 19.2207 21.3779C18.9154 21.6286 18.5576 21.8177 18.1475 21.9453C17.7419 22.0729 17.2998 22.1367 16.8213 22.1367C16.3929 22.1367 15.9827 22.0775 15.5908 21.959C15.1989 21.8405 14.848 21.665 14.5381 21.4326C14.2282 21.1956 13.9821 20.9017 13.7998 20.5508C13.6221 20.1953 13.5332 19.7852 13.5332 19.3203H15.1807C15.1807 19.6165 15.249 19.8786 15.3857 20.1064C15.527 20.3298 15.723 20.5052 15.9736 20.6328C16.2288 20.7604 16.5205 20.8242 16.8486 20.8242C17.195 20.8242 17.4935 20.7627 17.7441 20.6396C17.9948 20.5166 18.1862 20.3343 18.3184 20.0928C18.4551 19.8512 18.5234 19.5596 18.5234 19.2178C18.5234 18.8304 18.4482 18.516 18.2979 18.2744C18.1475 18.0329 17.9333 17.8551 17.6553 17.7412C17.3773 17.6227 17.0492 17.5635 16.6709 17.5635H15.6865Z" fill={props.active==="test setting"?"white":"rgba(255, 255, 255, 0.4)"} fill-opacity={props.active==="test setting"?"1":"0.4"} />
                                <circle cx="16.5" cy="16.5" r="16" stroke={props.active==="test setting"?"white":"rgba(255, 255, 255, 0.4)"} stroke-opacity={props.active==="test setting"?"1":"0.4"} />
                            </svg>
                            <span style={props.active==="test setting"?{color:"white"}:{color: "rgba(255, 255, 255, 0.4)",opacity:"0.4"}}>Settings</span>
                        </div>
                    
                    <svg className='ver-line' width="2" height="65" viewBox="0 0 2 65" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <line x1="1" y1="64.0039" x2="1" y2="0.995972" stroke="white" stroke-opacity="0.4" stroke-dasharray="5 5" />
                    </svg>
                    
                        <div className="title">
                            <svg width="33" height="33" viewBox="0 0 33 33" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M20.6084 18.4521V19.7646H13.4307L13.376 18.7734L17.6689 12.0469H18.9883L17.5596 14.4941L15.0918 18.4521H20.6084ZM19.3643 12.0469V22H17.7168V12.0469H19.3643Z" fill={props.active==="the test"?"white":"rgba(255, 255, 255, 0.4)"} fillOpacity={props.active==="the test"?"1":"0.4"} />
                                <circle cx="16.5" cy="16.5" r="16" stroke={props.active==="the test"?"white":"rgba(255, 255, 255, 0.4)"} strokeOpacity={props.active==="the test"?"1":"0.4"} />
                            </svg>
                            <span style={props.active==="the test"?{color:"white"}:{color: "rgba(255, 255, 255, 0.4)",opacity:"0.4"}}>The Test</span>
                        </div>
                    
                </div>
            </div>
        </div>
    );
}

export default CreateTest2Sidebar;