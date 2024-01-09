import './index.css'
import gif from '../../assets/gifs/notfound.gif'
import {useNavigate} from 'react-router-dom'
const NotFound = () => {
    const navigate = useNavigate()
    return (
        <div className='not-found-container' >
            <div className='sub-container' >
                <img src={gif} alt="loading..." />
                <p>Looks like you are lost somewhere. Page you are<br /> looking for does not exhist</p>
                <button onClick={()=>navigate('/')} >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="10" cy="10" r="10" fill="white" />
                        <path d="M6 8.20833L10.125 5L14.25 8.20833V13.25C14.25 13.4931 14.1534 13.7263 13.9815 13.8982C13.8096 14.0701 13.5764 14.1667 13.3333 14.1667H6.91667C6.67355 14.1667 6.44039 14.0701 6.26849 13.8982C6.09658 13.7263 6 13.4931 6 13.25V8.20833Z" stroke="#00C49A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M8.75 14.1663V9.58301H11.5V14.1663" stroke="#00C49A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                    <label>Home</label>
                </button>
            </div>

        </div>
    )
}

export default NotFound