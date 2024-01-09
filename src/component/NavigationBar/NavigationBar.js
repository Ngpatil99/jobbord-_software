import React, { useState, useEffect, memo } from 'react';
import './NavigationBar.css';
import { Link, useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import jwtDecode from "jwt-decode";
import axios from "axios";
import { backend_url, getCookie } from "../../constant";
import defaultProfile from '../../assets/icon/profileDefaultIcon.svg';

const NavigationBar = ({ active, preview, onClickPreviewAll, backToLibrary, onClickPreview, saveAsDraft, assessment2, settingPreview, onClickSaveAsDraft, loadingDraft, onClickNavItem, assessment, profileDp }) => {
    const [profileImage, setprofileImage] = useState("");
    const [clientProfile, setclientProfile] = useState("")
    const [departmentName, setdepartmentName] = useState('')

    useEffect(() => {

        const profileURL = getCookie('profile');
        setprofileImage(profileURL);
        const ClientProfile = getCookie('ClientProfile')
        setclientProfile(ClientProfile)
        getProfileImage()
    }, [profileDp, clientProfile]);

    const getProfileImage = async () => {
        try {
            const token = getCookie("Xh7ERL0G")
            const decode = jwtDecode(token)
            setdepartmentName(decode.role.department)
            const userProfileResponse = await axios.get(`${backend_url}eqa/find/${decode?.user_id}`, { headers: { "token": token } })
            setprofileImage(userProfileResponse.data.data.profileUrl ? userProfileResponse.data.data.profileUrl : "");
        } catch (error) {
            toast(`${error}`, {
                className: 'toast-message'
            })
        }
    }

    const navigate = useNavigate();




    return (
        <nav className='navigation-bar'>
            <div className='row'>
                {/*Logo */}
                {clientProfile === "" ?
                    <svg width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="38" height="38" rx="2" fill="#2A2C2B" />
                        <path fillRule="evenodd" clipRule="evenodd" d="M11.8139 27.0018C11.5423 26.5418 11.469 25.9913 11.6107 25.4763C11.7524 24.9613 12.097 24.5259 12.5657 24.2696L25.9068 16.7697C26.8866 16.2165 28.1285 16.5405 28.7131 17.5018C28.9847 17.9619 29.0581 18.5124 28.9164 19.0275C28.7747 19.5427 28.43 19.9782 27.9614 20.2347L14.6183 27.7333C14.3052 27.9094 13.9521 28.0019 13.5929 28.0018C12.8651 28.0055 12.1891 27.6255 11.8139 27.0018ZM10.2736 19.5015C10.0022 19.0415 9.92898 18.4911 10.0707 17.9762C10.2124 17.4612 10.5568 17.0257 11.0254 16.7693L24.3672 9.26998C25.3465 8.71647 26.5884 9.04025 27.1728 10.0015C27.4444 10.4615 27.5178 11.0121 27.3761 11.5272C27.2344 12.0423 26.8897 12.4779 26.4211 12.7343L13.0799 20.2336C12.767 20.4094 12.4141 20.5017 12.0552 20.5015C11.3264 20.5055 10.6494 20.1253 10.2736 19.5008V19.5015Z" fill="white" />
                    </svg> : <div style={{ width: 50, height: 50 }} > <img style={{ width: '100%', height: 'auto', objectFit: 'cover' }} src={clientProfile} /></div>
                }


                <button onClick={() => { assessment2 === false ? onClickNavItem('/') : navigate('/') }} style={active === "dashboard" ? { marginLeft: 30, background: '#FEE9E1' } : { marginLeft: 30 }}>
                    {/* Dashboard Icon */}
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" clipRule="evenodd" d="M7.19968 11.9997C6.8683 11.9997 6.59968 11.7311 6.59968 11.3997V7.19968C6.59968 6.8683 6.8683 6.59968 7.19968 6.59968H11.3997C11.7311 6.59968 11.9997 6.8683 11.9997 7.19968V11.3997C11.9997 11.7311 11.7311 11.9997 11.3997 11.9997H7.19968ZM7.80041 10.8H10.8004V7.79995H7.80041V10.8ZM0.6 11.9997C0.268616 11.9997 0 11.7311 0 11.3997V7.19968C0 6.8683 0.268616 6.59968 0.6 6.59968H4.8C5.13138 6.59968 5.4 6.8683 5.4 7.19968V11.3997C5.4 11.7311 5.13138 11.9997 4.8 11.9997H0.6ZM1.19959 10.8H4.19959V7.79995H1.19959V10.8ZM7.19968 5.4C6.8683 5.4 6.59968 5.13138 6.59968 4.8V0.6C6.59968 0.268616 6.8683 0 7.19968 0H11.3997C11.7311 0 11.9997 0.268616 11.9997 0.6V4.8C11.9997 5.13138 11.7311 5.4 11.3997 5.4H7.19968ZM7.80041 4.20005H10.8004V1.20005H7.80041V4.20005ZM0.6 5.4C0.268616 5.4 0 5.13138 0 4.8V0.6C0 0.268616 0.268616 0 0.6 0H4.8C5.13138 0 5.4 0.268616 5.4 0.6V4.8C5.4 5.13138 5.13138 5.4 4.8 5.4H0.6ZM1.19959 4.20005H4.19959V1.20005H1.19959V4.20005Z" fill="#060606" />
                    </svg>
                    <span>Dashboard</span>
                </button>



                <button onClick={() => { assessment2 === false ? onClickNavItem('/assessment') : navigate('/assessment') }} style={active === "assesment" ? { marginLeft: 20, background: '#FEE9E1' } : { marginLeft: 20 }} >
                    {/*Assement icon */}
                    <svg width="10" height="13" viewBox="0 0 10 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9.33408 1.87319L8.12681 0.665916C7.91623 0.454178 7.66575 0.286302 7.38986 0.171999C7.11398 0.0576974 6.81817 -0.000760738 6.51954 7.47416e-06H2.27273C1.67018 0.000729227 1.09253 0.240408 0.666463 0.666471C0.240401 1.09253 0.000721753 1.67019 0 2.27273V10.4545C0.000721753 11.0571 0.240401 11.6347 0.666463 12.0608C1.09253 12.4869 1.67018 12.7265 2.27273 12.7273H7.72727C8.32981 12.7265 8.90747 12.4869 9.33353 12.0608C9.75959 11.6347 9.99927 11.0571 9.99999 10.4545V3.48046C10.0008 3.18183 9.9423 2.88602 9.828 2.61014C9.7137 2.33425 9.54582 2.08377 9.33408 1.87319ZM8.69136 2.51591C8.7556 2.58052 8.81331 2.65132 8.86363 2.72728H7.72727C7.60671 2.72728 7.4911 2.67939 7.40585 2.59414C7.32061 2.5089 7.27272 2.39329 7.27272 2.27273V1.13637C7.3487 1.18683 7.4195 1.24469 7.48409 1.3091L8.69136 2.51591ZM7.72727 11.8182H2.27273C1.91107 11.8182 1.56422 11.6745 1.30849 11.4188C1.05276 11.163 0.90909 10.8162 0.90909 10.4545V2.27273C0.90909 1.91107 1.05276 1.56423 1.30849 1.3085C1.56422 1.05277 1.91107 0.909098 2.27273 0.909098H6.36363V2.27273C6.36363 2.63439 6.5073 2.98124 6.76303 3.23697C7.01876 3.4927 7.36561 3.63637 7.72727 3.63637H9.0909V10.4545C9.0909 10.8162 8.94723 11.163 8.6915 11.4188C8.43577 11.6745 8.08893 11.8182 7.72727 11.8182Z" fill="black" />
                        <path d="M2.72798 4.09073H4.54616C4.66672 4.09073 4.78233 4.04284 4.86757 3.9576C4.95282 3.87235 5.00071 3.75674 5.00071 3.63619C5.00071 3.51563 4.95282 3.40002 4.86757 3.31477C4.78233 3.22953 4.66672 3.18164 4.54616 3.18164H2.72798C2.60743 3.18164 2.49181 3.22953 2.40657 3.31477C2.32133 3.40002 2.27344 3.51563 2.27344 3.63619C2.27344 3.75674 2.32133 3.87235 2.40657 3.9576C2.49181 4.04284 2.60743 4.09073 2.72798 4.09073Z" fill="black" />
                        <path d="M7.27343 5H2.72798C2.60743 5 2.49181 5.04789 2.40657 5.13313C2.32133 5.21838 2.27344 5.33399 2.27344 5.45455C2.27344 5.5751 2.32133 5.69071 2.40657 5.77596C2.49181 5.8612 2.60743 5.90909 2.72798 5.90909H7.27343C7.39399 5.90909 7.5096 5.8612 7.59485 5.77596C7.68009 5.69071 7.72798 5.5751 7.72798 5.45455C7.72798 5.33399 7.68009 5.21838 7.59485 5.13313C7.5096 5.04789 7.39399 5 7.27343 5Z" fill="black" />
                        <path d="M7.27343 6.81836H2.72798C2.60743 6.81836 2.49181 6.86625 2.40657 6.95149C2.32133 7.03674 2.27344 7.15235 2.27344 7.2729C2.27344 7.39346 2.32133 7.50907 2.40657 7.59432C2.49181 7.67956 2.60743 7.72745 2.72798 7.72745H7.27343C7.39399 7.72745 7.5096 7.67956 7.59485 7.59432C7.68009 7.50907 7.72798 7.39346 7.72798 7.2729C7.72798 7.15235 7.68009 7.03674 7.59485 6.95149C7.5096 6.86625 7.39399 6.81836 7.27343 6.81836Z" fill="black" />
                        <path d="M6.36434 8.63672H2.72798C2.60743 8.63672 2.49181 8.68461 2.40657 8.76985C2.32133 8.8551 2.27344 8.97071 2.27344 9.09126C2.27344 9.21182 2.32133 9.32743 2.40657 9.41268C2.49181 9.49792 2.60743 9.54581 2.72798 9.54581H6.36434C6.4849 9.54581 6.60051 9.49792 6.68576 9.41268C6.771 9.32743 6.81889 9.21182 6.81889 9.09126C6.81889 8.97071 6.771 8.8551 6.68576 8.76985C6.60051 8.68461 6.4849 8.63672 6.36434 8.63672Z" fill="black" />
                    </svg>
                    <span>Assessments</span>
                </button>




                <button onClick={() => { assessment2 === false ? onClickNavItem('/library') : navigate('/library') }} style={active === "library" ? { marginLeft: 20, background: '#FEE9E1' } : { marginLeft: 20 }}>
                    {/* Library Icon */}
                    <svg width="16" height="14" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" clipRule="evenodd" d="M3.69747 0.795193C3.08213 0.780783 2.46647 0.798345 1.85298 0.848029C1.37439 0.838123 0.912445 1.02365 0.573849 1.36213C0.235254 1.70047 0.0492941 2.16234 0.0589383 2.64087C0.00921649 3.25434 -0.00842067 3.87006 0.00606432 4.48534V8.7891C0.00606432 10.1725 -0.08002 9.76117 0.396483 10.4658C0.649595 10.8096 1.02266 11.0458 1.44169 11.1274C1.78597 11.1956 2.13596 11.2307 2.4869 11.2323C2.49427 11.4537 2.50165 11.6726 2.52317 11.8613C2.51321 12.3398 2.69885 12.8018 3.03722 13.1405C3.37559 13.4791 3.83742 13.6649 4.316 13.6553C4.64308 13.6922 5.03718 13.7008 5.47248 13.7045C5.49557 13.7065 5.51876 13.7072 5.54194 13.7066L12.305 13.7065C12.9203 13.7209 13.536 13.7033 14.1495 13.6537C14.6281 13.6633 15.0899 13.4773 15.4283 13.1388C15.7666 12.8002 15.9523 12.3382 15.9423 11.8596C15.9919 11.2461 16.0096 10.6306 15.9952 10.0152V8.7855C15.9954 8.76103 15.9942 8.73657 15.9915 8.7124C15.9878 8.2783 15.9792 7.88488 15.9423 7.55841C15.9521 7.07988 15.7664 6.61801 15.4281 6.27937C15.0897 5.94089 14.628 5.75491 14.1495 5.76437C13.9595 5.7429 13.7394 5.73615 13.5168 5.72864C13.529 5.67746 13.5346 5.62507 13.5334 5.57254C13.5452 5.08125 13.5082 4.58996 13.4228 4.10603C13.3472 3.68303 13.1163 3.30372 12.7753 3.04239C12.0714 2.55065 12.4741 2.63741 11.076 2.63741H9.44423C8.83763 2.67179 8.23001 2.59043 7.65387 2.39755C7.41039 2.29368 7.19839 2.12781 7.03905 1.91632C6.75271 1.57708 6.3924 1.3081 5.98585 1.12992C5.26717 0.873247 4.50528 0.759468 3.74297 0.794893H3.69992L3.69747 0.795193ZM3.69809 2.02491C4.31214 1.99039 4.92721 2.07174 5.5112 2.26462C5.75668 2.36775 5.9705 2.53406 6.13094 2.74661C6.4149 3.08494 6.77239 3.35393 7.17615 3.533C7.90292 3.79403 8.67426 3.90811 9.44547 3.86863H11.076C12.4729 3.86863 11.9416 3.96215 12.0689 4.05311C12.1304 4.09799 12.1685 4.13056 12.2202 4.37043C12.2833 4.77315 12.3111 5.18069 12.3032 5.58837C12.3031 5.631 12.3074 5.67333 12.3161 5.71505H11.9029C11.2963 5.74958 10.6887 5.66822 10.1126 5.47549C9.86895 5.37132 9.65695 5.205 9.49773 4.99336C9.21137 4.65412 8.85106 4.38499 8.44453 4.20681C7.72512 3.95059 6.96269 3.83681 6.1998 3.87193H6.15676C5.54143 3.85767 4.92578 3.87554 4.31231 3.92537C3.83372 3.91546 3.37176 4.10099 3.03315 4.43947C2.69455 4.77781 2.50859 5.23968 2.51823 5.71821C2.46851 6.33168 2.45086 6.94725 2.46536 7.56268V10.0029C2.21328 9.99856 1.96189 9.97484 1.71344 9.93206C1.48533 9.87998 1.45952 9.8474 1.41464 9.78091C1.32487 9.64807 1.23573 10.1751 1.23573 8.79233V4.48856C1.23573 3.72183 1.23943 3.15624 1.28123 2.78368C1.32304 2.41113 1.39497 2.28444 1.44355 2.2358C1.49213 2.18717 1.61754 2.11707 1.99013 2.07534C2.36273 2.03362 2.93201 2.02491 3.69809 2.02491ZM6.15671 5.09883C6.77075 5.06445 7.3858 5.14566 7.96982 5.33854C8.21523 5.44136 8.42904 5.60753 8.58957 5.81978C8.87346 6.15826 9.23097 6.42724 9.63478 6.60632C10.3614 6.86795 11.1328 6.98218 11.9041 6.94285L12.305 6.9427C13.0716 6.9427 13.6379 6.94645 14.0099 6.98818C14.3818 7.02991 14.5091 7.10196 14.5577 7.15044C14.6062 7.19893 14.6769 7.32441 14.7187 7.69697C14.7606 8.06953 14.7642 8.63587 14.7642 9.40184V10.0167C14.7642 10.7828 14.7606 11.3502 14.7187 11.7221C14.6769 12.0941 14.6062 12.2202 14.5577 12.2681C14.5091 12.316 14.3824 12.391 14.0099 12.4303C13.6373 12.4697 13.0716 12.4752 12.305 12.4752H6.15671C5.39002 12.4752 4.82378 12.4715 4.4518 12.4303C4.07983 12.3892 3.95256 12.3166 3.904 12.2681C3.85544 12.2196 3.78472 12.0935 3.74292 11.7221C3.70112 11.3508 3.69742 10.7829 3.69742 10.0174V7.55812C3.69742 6.792 3.70112 6.2252 3.74292 5.85385C3.78472 5.48249 3.85666 5.3546 3.90524 5.30537C3.95382 5.25614 4.07985 5.18664 4.45182 5.14491C4.8238 5.10318 5.39064 5.09883 6.15671 5.09883Z" fill="black" />
                    </svg>
                    <span>Library</span>
                </button>




                <button onClick={() => { assessment2 === false ? onClickNavItem('/candidate') : navigate('/candidate') }} style={active === "candidate" ? { marginLeft: 20, background: '#FEE9E1' } : { marginLeft: 20 }} >
                    {/*Candidates icon */}
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" clipRule="evenodd" d="M7.99967 7.99967C8.73605 7.99967 9.33301 7.40272 9.33301 6.66634C9.33301 5.92996 8.73605 5.33301 7.99967 5.33301C7.2633 5.33301 6.66634 5.92996 6.66634 6.66634C6.66634 7.40272 7.2633 7.99967 7.99967 7.99967ZM7.99967 9.33301C9.47243 9.33301 10.6663 8.1391 10.6663 6.66634C10.6663 5.19358 9.47243 3.99967 7.99967 3.99967C6.52692 3.99967 5.33301 5.19358 5.33301 6.66634C5.33301 8.1391 6.52692 9.33301 7.99967 9.33301Z" fill="black" />
                        <path fillRule="evenodd" clipRule="evenodd" d="M12.3722 13.0322C13.7778 11.81 14.6663 10.0086 14.6663 7.99967C14.6663 4.31778 11.6816 1.33301 7.99967 1.33301C4.31778 1.33301 1.33301 4.31778 1.33301 7.99967C1.33301 10.0086 2.22157 11.81 3.62712 13.0322C4.79763 14.0501 6.32669 14.6663 7.99967 14.6663C9.61051 14.6663 11.0879 14.095 12.2403 13.144C12.2848 13.1073 12.3287 13.07 12.3722 13.0322ZM8.17161 13.3303C8.11452 13.3321 8.0572 13.333 7.99967 13.333C7.99392 13.333 7.98817 13.333 7.98242 13.333C7.9288 13.3328 7.87536 13.3319 7.82212 13.3301C6.92726 13.3008 6.08816 13.0511 5.35737 12.6335C5.96755 11.8418 6.92514 11.333 7.99967 11.333C9.0742 11.333 10.0318 11.8418 10.642 12.6335C9.90965 13.052 9.06857 13.3019 8.17161 13.3303ZM11.7079 11.8328C10.8551 10.7184 9.51134 9.99967 7.99967 9.99967C6.488 9.99967 5.14421 10.7184 4.2914 11.8328C3.28932 10.8632 2.66634 9.5042 2.66634 7.99967C2.66634 5.05416 5.05416 2.66634 7.99967 2.66634C10.9452 2.66634 13.333 5.05416 13.333 7.99967C13.333 9.5042 12.71 10.8632 11.7079 11.8328Z" fill="black" />
                    </svg>
                    <span>Candidates</span>
                </button>



                <button onClick={() => { assessment2 === false ? onClickNavItem('/interview') : navigate('/interview') }} style={active === "interview" ? { marginLeft: 20, background: '#FEE9E1' } : { marginLeft: 20 }} >
                    {/*Interview icon */}
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M11 13C12.1046 13 13 12.1046 13 11C13 9.89543 12.1046 9 11 9C9.89543 9 9 9.89543 9 11C9 12.1046 9.89543 13 11 13Z" stroke="black" strokeMiterlimit="10" />
                        <path d="M13.1002 11.7002L14.1502 12.7502C14.5502 13.1502 14.5502 13.8002 14.1502 14.1502C13.7502 14.5502 13.1002 14.5502 12.7502 14.1502L11.7002 13.1002" stroke="black" strokeMiterlimit="10" />
                        <path d="M14 8V2.5H2V11C2 11 2 13.5 2 14C3.35 12.85 4.9 12 6.6 11.5" stroke="black" strokeMiterlimit="10" strokeLinejoin="round" />
                        <path d="M5.5 6H8.5" stroke="black" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M5.5 8H7" stroke="black" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>

                    <span>Interviews</span>
                </button>

            </div>

            <div className='row left-side'>
                {preview ?
                    <div style={{ cursor: 'pointer' }} onClick={() => { onClickPreviewAll(); navigate('/mcqbulkpreview') }} className='custom-button' >
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M11.0846 7H2.91797" stroke="black" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M7.0013 11.0837L2.91797 7.00033L7.0013 2.91699" stroke="black" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span  >Preview All</span>
                    </div>

                    : <></>
                }
                {backToLibrary ?
                    <div style={{ cursor: 'pointer' }} onClick={() => navigate('/library')} className='custom-button' >
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M11.0846 7H2.91797" stroke="black" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M7.0013 11.0837L2.91797 7.00033L7.0013 2.91699" stroke="black" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span  >Back to library</span>
                    </div>

                    : <></>
                }
                {assessment ?
                    <div style={{ cursor: 'pointer' }} onClick={() => navigate('/assessment')} className='assessment-button' >
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M11.0846 7H2.91797" stroke="black" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M7.0013 11.0837L2.91797 7.00033L7.0013 2.91699" stroke="black" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span>Back to assessments</span>
                    </div>
                    : <></>
                }
                {settingPreview ?
                    <div style={{ cursor: 'pointer' }} onClick={(e) => { onClickPreview(e) }} className='test-setting-preview' >
                        <svg width="15" height="16" viewBox="0 0 15 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M11.25 8.625V12.375C11.25 12.7065 11.1183 13.0245 10.8839 13.2589C10.6495 13.4933 10.3315 13.625 10 13.625H3.125C2.79348 13.625 2.47554 13.4933 2.24112 13.2589C2.0067 13.0245 1.875 12.7065 1.875 12.375V5.5C1.875 5.16848 2.0067 4.85054 2.24112 4.61612C2.47554 4.3817 2.79348 4.25 3.125 4.25H6.875" stroke="black" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M9.375 2.375H13.125V6.125" stroke="black" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M6.25 9.25L13.125 2.375" stroke="black" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                        <span>Preview</span>
                    </div>

                    : <></>
                }
                {saveAsDraft ?
                    <div style={{ cursor: 'pointer' }} onClick={() => { assessment2 ? navigate('/assessment') : onClickSaveAsDraft() }} className='save-as-draft-button' >
                        {loadingDraft ? <div className='loader' ></div> :
                            <>
                                <svg width="15" height="16" viewBox="0 0 15 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M11.875 13.625H3.125C2.79348 13.625 2.47554 13.4933 2.24112 13.2589C2.0067 13.0245 1.875 12.7065 1.875 12.375V3.625C1.875 3.29348 2.0067 2.97554 2.24112 2.74112C2.47554 2.5067 2.79348 2.375 3.125 2.375H10L13.125 5.5V12.375C13.125 12.7065 12.9933 13.0245 12.7589 13.2589C12.5245 13.4933 12.2065 13.625 11.875 13.625Z" stroke="black" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M10.625 13.625V8.625H4.375V13.625" stroke="black" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M4.375 2.375V5.5H9.375" stroke="black" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>

                                <span  >Save As Draft</span>
                            </>

                        }

                    </div>

                    : <></>
                }

                <div className='department-container' >
                    {departmentName}
                </div>

                <div onClick={() => { assessment2 === false ? onClickNavItem('/notification') : navigate('/notification') }} className='notification'>
                    {/* Notification Icon */}
                    <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" clipRule="evenodd" d="M15.4604 12.4093V7.91895C15.4062 4.94158 12.9772 2.5562 9.99924 2.5562C7.02132 2.5562 4.5923 4.94158 4.53804 7.91895L4.53815 12.4093C4.53903 13.0405 4.37097 13.6607 4.0514 14.2053L15.9481 14.2054C15.6283 13.6609 15.4599 13.0409 15.4604 12.4093ZM19.1019 16.0015H0.898068C0.577188 16.0015 0.280756 15.8304 0.120371 15.5525C-0.0401236 15.2746 -0.0401236 14.9323 0.120371 14.6544C0.280756 14.3765 0.577188 14.2054 0.898068 14.2054C1.89655 14.2118 2.71141 13.4078 2.71832 12.4092L2.71843 7.91889C2.7818 3.9426 6.02326 0.752441 9.99999 0.752441C13.9767 0.752441 17.2182 3.9426 17.2814 7.91889V12.4092C17.2845 12.8889 17.478 13.3475 17.8195 13.6844C18.1609 14.0213 18.6222 14.2088 19.1018 14.2054C19.4227 14.2054 19.7192 14.3765 19.8796 14.6544C20.0401 14.9322 20.0401 15.2746 19.8797 15.5525C19.7193 15.8303 19.4228 16.0015 19.1019 16.0015ZM12.3614 19.1454C11.8657 19.9778 10.9684 20.4879 9.99949 20.4879C9.03061 20.4879 8.13331 19.9778 7.63757 19.1454C7.4762 18.8661 7.47719 18.5217 7.63998 18.2431C7.80278 17.9646 8.1025 17.7948 8.42513 17.7983H11.5746C11.897 17.7952 12.1964 17.965 12.3591 18.2434C12.5217 18.522 12.5226 18.8662 12.3613 19.1454H12.3614Z" fill="#333333" />
                    </svg>

                    <div className='notification-alert' />
                </div>



                {profileImage !== "" ?
                    <img style={{ cursor: 'pointer' }} onClick={() => { assessment2 === false ? onClickNavItem('/userprofile') : navigate('/userprofile') }} src={profileImage} alt="" /> :
                    <img style={{ cursor: 'pointer' }} onClick={() => { assessment2 === false ? onClickNavItem('/userprofile') : navigate('/userprofile') }} src={defaultProfile} alt="" />
                }



                {/* Dorp Down Icon */}
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M0 6.92308V3.46154C0 2.50566 0.337954 1.68977 1.01386 1.01386C1.68977 0.337954 2.50566 0 3.46154 0H11.5385C12.4943 0 13.3102 0.337954 13.9861 1.01386C14.662 1.68977 15 2.50566 15 3.46154V11.5385C15 12.4943 14.662 13.3102 13.9861 13.9861C13.3102 14.662 12.4943 15 11.5385 15H3.46154C2.50566 15 1.68977 14.662 1.01386 13.9861C0.337954 13.3102 0 12.4943 0 11.5385V6.92308Z" fill="#F1F5F7" />
                    <path fillRule="evenodd" clipRule="evenodd" d="M8.26566 9.20199C8.15833 9.36052 7.97938 9.45545 7.78797 9.45545C7.59655 9.45545 7.4176 9.36052 7.31027 9.20199L5.00258 6.09181C4.883 5.91504 4.87089 5.68672 4.97089 5.49819C5.07097 5.30973 5.26682 5.19184 5.48021 5.19177H10.0957C10.3091 5.19184 10.505 5.30973 10.605 5.49819C10.7051 5.68672 10.6929 5.91504 10.5734 6.09181L8.26566 9.20199Z" fill="#809FB8" />
                </svg>

            </div>
        </nav>
    );
};

export default memo(NavigationBar);