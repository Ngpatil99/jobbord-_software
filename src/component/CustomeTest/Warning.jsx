import { Grid } from '@mui/material';
import info_white from "../../assets/icon/info-white.svg";
const Warning = (props) => {
    return (
        <Grid item xs={10} md={9}>
            <div className="info-container-bg">
                <div className="info">
                    <img
                        style={{ cursor: "pointer", backgroundColor: '#FF6812', padding: '6px', marginRight: '2px' }}
                        src={info_white}
                        alt=""
                    />
                    <span>{props.msg}</span>
                </div>
            </div>
        </Grid>
    )
}
export default Warning;