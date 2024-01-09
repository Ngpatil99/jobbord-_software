import React, { useState, useCallback, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDropzone } from 'react-dropzone'
import jwtDecode from "jwt-decode";
import { toast } from 'react-toastify'
import NavigationBar from "../../component/NavigationBar/NavigationBar";
import { backend_url, getCookie } from '../../constant'
import MCQBulkContext from '../../store/MCQBulkContext'

import './index.css'
const MCQBulkUpload = () => {
    const auth = useContext(MCQBulkContext)

    const [file, setFile] = useState("");
    const [text, setText] = useState("");
    const [bulkMCQUrl, setbulkMCQUrl] = useState("")
    const [imagename, setimagename] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)
    const [downloadErrorURL, setdownloadErrorURL] = useState("")


    const navigate = useNavigate()

    const onDrop = useCallback(async (acceptedFiles) => {
        // Do something with the files

        const fileUploaded = acceptedFiles[0];
        if (fileUploaded.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
            setFile(fileUploaded.name)
            setText(fileUploaded.name)
            const token = getCookie("Xh7ERL0G")
            const uploadURL = await axios.get(`${backend_url}S3Url`, { headers: { "token": token } })
            await axios.request({
                method: "PUT",
                headers: {
                    "Content-Type": fileUploaded.type
                },
                url: uploadURL.data.uploadURL,
                data: fileUploaded,
            })
            setimagename(uploadURL.data.imageName)
            const bulkMCQURL = uploadURL.data.uploadURL.split('?')[0]
            setbulkMCQUrl(bulkMCQURL)
        } else {
            toast("Please upload only excel sheet!")
        }

    }, [])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

    const downloadFile = () => {
        window.location.href = "https://elite-qa-webcam-snapshot.s3.ap-south-1.amazonaws.com/sample-template.xlsx"
    }


    const readDataFromExcel = async () => {
        try {

            setLoading(true)
            if (imagename !== "") {

                const token = getCookie("Xh7ERL0G")
                const decoded = jwtDecode(token)
                const resOfExcelData = await axios.post(`${backend_url}getS3UrlData`, {
                    createdBy: decoded.user_id,
                    clientId: decoded.client._id,
                    imageName: imagename,
                    type: 'MCQ'
                })
                setLoading(false)
                if (resOfExcelData.data.data[0].url) {
                    setError(true)
                    setdownloadErrorURL(resOfExcelData.data.data[0].url)
                    toast.error("Please download a error report and check")
                } else {
                    resOfExcelData.data.data.forEach((element, index) => {
                        element.sourceSelected = "My library"
                        element.questionIndex = index
                        element.moveToLibraryStatus = "false"
                        element.isQuestionDeleted = "false"
                    });
                    auth.readDataFromS3(resOfExcelData.data.data)
                    navigate('/mcqbulkpreview')

                }




            } else {
                setLoading(false)
            }

        } catch (error) {
            setLoading(false)
            toast(error, {
                className: 'toast-message'
            })
        }
    }
    return (
        <>
            <NavigationBar />
            <div className="mcq-bulk-upload-container" >
                <div className="mcq-bulk-upload-content">


                    <div className="guideline-container" >

                        <div className="button-container">
                            <div onClick={() => navigate('/library')} className="back">
                                <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M19 12.0908H5" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                    <path d="M12 19.0908L5 12.0908L12 5.09082" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                                <span>Back</span>
                            </div>
                        </div>
                        <div {...(file === "" ? { ...getRootProps() } : {})} style={{ cursor: 'pointer' }} className="upload-container" >
                            <input {...getInputProps()} />
                            {file === "" && !isDragActive ?
                                <>
                                    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="18" cy="18" r="18" fill="#FF6812" />
                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M14.4092 23.3964C12.8025 23.4512 11.4535 22.1973 11.3906 20.591L11.3906 17.6706C11.453 16.064 12.8021 14.8095 14.4092 14.864L15.0092 14.8637C15.2236 14.8637 15.4217 14.978 15.5288 15.1637C15.636 15.3494 15.636 15.578 15.5288 15.7637C15.4217 15.9494 15.2236 16.0637 15.0092 16.0637H14.4092C13.488 16.0321 12.7146 16.751 12.6788 17.6721V20.5927C12.7154 21.5132 13.4884 22.2316 14.4092 22.2005H21.5804C22.5015 22.2316 23.2745 21.5126 23.3102 20.5918V17.6651C23.2744 16.7481 22.5047 16.0324 21.5877 16.0631H20.9804C20.7661 16.0631 20.568 15.9489 20.4608 15.7631C20.3536 15.5774 20.3536 15.3489 20.4608 15.1631C20.568 14.9774 20.7661 14.8631 20.9804 14.8631H21.5877C23.1906 14.8095 24.536 16.0608 24.5984 17.6633L24.5985 20.5901C24.5362 22.1964 23.1872 23.4506 21.5804 23.3955L14.4092 23.3964ZM17.3495 19.2048V12.8447L16.5725 13.5707C16.3113 13.798 15.9224 13.798 15.6611 13.5707C15.5411 13.4629 15.4726 13.3091 15.4726 13.1476C15.4726 12.9862 15.5411 12.8324 15.6611 12.7246L17.5397 10.9709C17.8052 10.7532 18.1875 10.7532 18.4529 10.9709L20.3315 12.7246C20.4514 12.8327 20.5198 12.9862 20.5198 13.1476C20.5198 13.3091 20.4514 13.4626 20.3315 13.5707C20.0725 13.8045 19.6785 13.8045 19.4195 13.5707L18.6395 12.8447V19.2048H17.3495Z" fill="white" />
                                    </svg>

                                    <span>Upload File or drag and drop here</span>
                                </> :
                                <>
                                    <label  >
                                        <svg width="23" height="23" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <g clip-path="url(#clip0_2807_2461)">
                                                <path d="M13.2365 0.584824C13.1228 0.492465 12.9731 0.457156 12.8302 0.489006L0.371885 3.36401C0.152621 3.41441 -0.00208998 3.61054 2.13471e-05 3.83551V20.1272C0.000111191 20.3636 0.172656 20.5647 0.40634 20.6006L12.8647 22.5173C13.1262 22.5575 13.3709 22.3781 13.4111 22.1166C13.4148 22.0925 13.4167 22.0682 13.4167 22.0439V0.960506C13.4171 0.814375 13.3508 0.676061 13.2365 0.584824Z" fill="#4CAF50" />
                                                <path d="M22.5196 20.6068H12.9362C12.6716 20.6068 12.457 20.3922 12.457 20.1276C12.457 19.8629 12.6716 19.6484 12.9362 19.6484H22.0404V3.35676H12.9362C12.6716 3.35676 12.457 3.14221 12.457 2.87757C12.457 2.61294 12.6716 2.39844 12.9362 2.39844H22.5195C22.7842 2.39844 22.9987 2.61298 22.9987 2.87762V20.1276C22.9987 20.3923 22.7842 20.6068 22.5196 20.6068Z" fill="#4CAF50" />
                                                <path d="M9.10335 15.8146C8.93812 15.8146 8.78458 15.7294 8.69703 15.5894L3.90535 7.92268C3.75805 7.70284 3.8169 7.40518 4.03674 7.25789C4.25659 7.11059 4.55424 7.16943 4.70154 7.38928C4.70734 7.39791 4.71282 7.40671 4.71803 7.4157L9.50971 15.0824C9.64942 15.3071 9.58051 15.6026 9.35576 15.7423C9.27998 15.7894 9.19256 15.8144 9.10335 15.8146Z" fill="#FAFAFA" />
                                                <path d="M4.31023 15.8146C4.04559 15.814 3.83149 15.5991 3.83203 15.3344C3.83221 15.245 3.85746 15.1573 3.90485 15.0814L8.69653 7.41475C8.82923 7.18579 9.12244 7.10776 9.35136 7.24046C9.58032 7.37316 9.65835 7.66636 9.52565 7.89528C9.52044 7.90427 9.51496 7.91307 9.50917 7.9217L4.71753 15.5884C4.63002 15.7291 4.47599 15.8147 4.31023 15.8146Z" fill="#FAFAFA" />
                                                <path d="M16.7682 20.6058C16.5036 20.6058 16.2891 20.3913 16.2891 20.1266V2.87664C16.2891 2.61201 16.5036 2.39746 16.7682 2.39746C17.0329 2.39746 17.2474 2.61201 17.2474 2.87664V20.1266C17.2474 20.3913 17.0329 20.6058 16.7682 20.6058Z" fill="#4CAF50" />
                                                <path d="M22.5196 17.7308H12.9362C12.6716 17.7308 12.457 17.5163 12.457 17.2516C12.457 16.987 12.6716 16.7725 12.9362 16.7725H22.5195C22.7842 16.7725 22.9987 16.987 22.9987 17.2516C22.9987 17.5163 22.7842 17.7308 22.5196 17.7308Z" fill="#4CAF50" />
                                                <path d="M22.5196 14.8558H12.9362C12.6716 14.8558 12.457 14.6413 12.457 14.3766C12.457 14.112 12.6716 13.8975 12.9362 13.8975H22.5195C22.7842 13.8975 22.9987 14.112 22.9987 14.3766C22.9987 14.6413 22.7842 14.8558 22.5196 14.8558Z" fill="#4CAF50" />
                                                <path d="M22.5196 11.9808H12.9362C12.6716 11.9808 12.457 11.7663 12.457 11.5016C12.457 11.237 12.6716 11.0225 12.9362 11.0225H22.5195C22.7842 11.0225 22.9987 11.237 22.9987 11.5016C22.9987 11.7663 22.7842 11.9808 22.5196 11.9808Z" fill="#4CAF50" />
                                                <path d="M22.5196 9.10582H12.9362C12.6716 9.10582 12.457 8.89128 12.457 8.62664C12.457 8.36201 12.6716 8.14746 12.9362 8.14746H22.5195C22.7842 8.14746 22.9987 8.36201 22.9987 8.62664C22.9987 8.89128 22.7842 9.10582 22.5196 9.10582Z" fill="#4CAF50" />
                                                <path d="M22.5196 6.23082H12.9362C12.6716 6.23082 12.457 6.01628 12.457 5.75164C12.457 5.48701 12.6716 5.27246 12.9362 5.27246H22.5195C22.7842 5.27246 22.9987 5.48701 22.9987 5.75164C22.9987 6.01632 22.7842 6.23082 22.5196 6.23082Z" fill="#4CAF50" />
                                            </g>
                                            <defs>
                                                <clipPath id="clip0_2807_2461">
                                                    <rect width="23" height="23" fill="white" />
                                                </clipPath>
                                            </defs>
                                        </svg>
                                        <span>{text}</span>
                                        <svg onClick={() => { setFile(""); setError(() => false); setimagename("") }} style={{ cursor: 'pointer' }} width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <circle cx="10" cy="10.5" r="10" fill="#dddddd" />
                                            <path d="M13 7.5L7 13.5" stroke="red" stroke-linecap="round" />
                                            <path d="M13 13.5L7.00019 7.50019" stroke="red" stroke-linecap="round" />
                                        </svg>
                                    </label>
                                    {error ?
                                        <div onClick={() => window.location.href = `${downloadErrorURL}`} className="error-button" >
                                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <circle cx="10" cy="10" r="10" fill="white" />
                                                <path fill-rule="evenodd" clip-rule="evenodd" d="M12.986 5.00087C14.3241 4.95525 15.4476 5.99955 15.5 7.33738L15.5 9.76953C15.448 11.1076 14.3245 12.1524 12.986 12.107L12.4863 12.1073C12.3078 12.1073 12.1428 12.0121 12.0535 11.8574C11.9643 11.7027 11.9643 11.5124 12.0535 11.3577C12.1428 11.203 12.3078 11.1078 12.4863 11.1078H12.986C13.7532 11.1342 14.3974 10.5354 14.4271 9.76831V7.33591C14.3967 6.56928 13.7529 5.971 12.986 5.99686L7.01352 5.99686C6.24646 5.971 5.60265 6.56977 5.57288 7.33665L5.57288 9.77416C5.60271 10.5379 6.24375 11.134 7.00751 11.1083H7.51323C7.69174 11.1083 7.85671 11.2035 7.94598 11.3582C8.03525 11.5129 8.03525 11.7032 7.94598 11.8579C7.85671 12.0126 7.69174 12.1077 7.51323 12.1077H7.00751C5.67249 12.1524 4.55206 11.1103 4.50003 9.77563L4.5 7.33811C4.55182 6.00028 5.67536 4.95573 7.01352 5.00161L12.986 5.00087ZM10.5364 8.49188V13.7888L11.1835 13.1842C11.4011 12.9948 11.7249 12.9948 11.9425 13.1842C12.0425 13.274 12.0996 13.4021 12.0996 13.5365C12.0996 13.6709 12.0425 13.799 11.9425 13.8888L10.378 15.3494C10.1569 15.5307 9.83853 15.5307 9.61744 15.3494L8.05288 13.8888C7.95305 13.7988 7.89608 13.6709 7.89608 13.5365C7.89608 13.4021 7.95305 13.2742 8.05288 13.1842C8.2686 12.9895 8.59671 12.9895 8.81244 13.1842L9.46205 13.7888V8.49188H10.5364Z" fill="#00C49A" />
                                            </svg>
                                            <span>Download Error Report</span>
                                        </div>
                                        :
                                        <div onClick={readDataFromExcel} className="upload-button" >
                                            {loading ?
                                                <div className="loader"></div> :
                                                <>
                                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <circle cx="10" cy="10" r="10" fill="white" />
                                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M7.01401 14.4844C5.67588 14.53 4.55237 13.4857 4.50002 12.1479L4.5 9.71576C4.55197 8.37769 5.67551 7.3329 7.01401 7.37828L7.51371 7.37804C7.69223 7.37804 7.8572 7.4732 7.94647 7.62789C8.03574 7.78258 8.03574 7.9729 7.94647 8.12759C7.8572 8.28229 7.69223 8.37745 7.51371 8.37745H7.01401C6.24677 8.3511 5.60265 8.94986 5.57288 9.71698V12.1494C5.60332 12.916 6.24713 13.5143 7.01401 13.4884H12.9865C13.7535 13.5143 14.3974 12.9155 14.4271 12.1486V9.71113C14.3973 8.94742 13.7563 8.35134 12.9925 8.37696H12.4868C12.3083 8.37696 12.1433 8.2818 12.054 8.12711C11.9647 7.97241 11.9647 7.7821 12.054 7.6274C12.1433 7.47271 12.3083 7.37755 12.4868 7.37755H12.9925C14.3275 7.3329 15.4479 8.37501 15.5 9.70966L15.5 12.1472C15.4482 13.485 14.3246 14.5296 12.9865 14.4837L7.01401 14.4844ZM9.46361 10.9934V5.6965L8.8165 6.30112C8.59892 6.49046 8.27508 6.49046 8.05746 6.30112C7.95749 6.21133 7.90039 6.08324 7.90039 5.94879C7.90039 5.81435 7.95749 5.68625 8.05746 5.59646L9.62202 4.13591C9.84312 3.95462 10.1615 3.95462 10.3826 4.13591L11.9471 5.59646C12.0469 5.6865 12.1039 5.81435 12.1039 5.94879C12.1039 6.08324 12.0469 6.21109 11.9471 6.30112C11.7314 6.49583 11.4033 6.49583 11.1876 6.30112L10.538 5.6965V10.9934H9.46361Z" fill="#FF6812" />
                                                    </svg>
                                                    <span>Upload</span>
                                                </>
                                            }

                                        </div>
                                    }

                                </>
                            }

                        </div>

                        <div className="content">

                            <p><b>Guidelines for uploading Multiple Choice Questions (MCQs)</b><br />
                                <br />
                                <br />
                                1. Only .xls and .xlsx formats are supported for bulk upload.<br />
                                2. Only the first sheet of the Excel file will be considered for bulk upload<br />
                                3. Do not remove or change the header row.<br />
                                4. In the Options field, if a number in an option ends with 0 after the decimal point such as 1.0 and 20.0, then change the format of the field to 'text' in the Excel sheet.<br />
                                5. The Difficulty column values are restricted to Easy, Medium, and Hard.<br />
                                6. From the provided template, please select the skill codes that correspond to the required skills and add them to an array, separated by commas. (e.g - [4, 56, 37] )<br />
                            </p>
                            <button onClick={downloadFile} >
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="10" cy="10" r="10" fill="white" />
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M12.986 5.00087C14.3241 4.95525 15.4476 5.99955 15.5 7.33738L15.5 9.76953C15.448 11.1076 14.3245 12.1524 12.986 12.107L12.4863 12.1073C12.3078 12.1073 12.1428 12.0121 12.0535 11.8574C11.9643 11.7027 11.9643 11.5124 12.0535 11.3577C12.1428 11.203 12.3078 11.1078 12.4863 11.1078H12.986C13.7532 11.1342 14.3974 10.5354 14.4271 9.76831V7.33591C14.3967 6.56928 13.7529 5.971 12.986 5.99686L7.01352 5.99686C6.24646 5.971 5.60265 6.56977 5.57288 7.33665L5.57288 9.77416C5.60271 10.5379 6.24375 11.134 7.00751 11.1083H7.51323C7.69174 11.1083 7.85671 11.2035 7.94598 11.3582C8.03525 11.5129 8.03525 11.7032 7.94598 11.8579C7.85671 12.0126 7.69174 12.1077 7.51323 12.1077H7.00751C5.67249 12.1524 4.55206 11.1103 4.50003 9.77563L4.5 7.33811C4.55182 6.00028 5.67536 4.95573 7.01352 5.00161L12.986 5.00087ZM10.5364 8.49188V13.7888L11.1835 13.1842C11.4011 12.9948 11.7249 12.9948 11.9425 13.1842C12.0425 13.274 12.0996 13.4021 12.0996 13.5365C12.0996 13.6709 12.0425 13.799 11.9425 13.8888L10.378 15.3494C10.1569 15.5307 9.83853 15.5307 9.61744 15.3494L8.05288 13.8888C7.95305 13.7988 7.89608 13.6709 7.89608 13.5365C7.89608 13.4021 7.95305 13.2742 8.05288 13.1842C8.2686 12.9895 8.59671 12.9895 8.81244 13.1842L9.46205 13.7888V8.49188H10.5364Z" fill="#00C49A" />
                                </svg>
                                <span>Download Sample File</span>
                            </button>

                        </div>
                    </div>
                </div>


            </div>
        </>
    )
}

export default MCQBulkUpload