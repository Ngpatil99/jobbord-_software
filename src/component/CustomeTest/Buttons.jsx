import { Grid } from '@mui/material';
import cancelIcon from "../../assets/icon/cancel-icon.svg";
import deleteIcon from "../../assets/icon/delete.svg";
import saveIocn from "../../assets/icon/save-icon.svg";
const Buttons = (props) => {
    const {eventHandle}=props;
    return (
        <Grid container spacing={2} mt={2}>
            {/* Left Button */}
            <Grid item xs={4}>
                <div className="button" style={{ marginTop: "5px", display: 'flex', justifyContent: 'flex-start' }}>
                    <div className="delete-btn">
                        <img
                            onClick={props.handleDelete}
                            style={{ cursor: "pointer" }}
                            src={deleteIcon}
                            alt=""
                        />
                        <button>Delete</button>
                    </div>
                </div>
            </Grid>

            {/* Right Buttons */}
            <Grid item xs={8} p={1}>
                <div className="button" style={{ marginTop: "5px", display: 'flex', justifyContent: 'flex-end' }}>
                    <div className="button" style={{ marginTop: "5px" }}>
                        <div className="cancel-btn" onClick={eventHandle.closeSkillSetModel}>
                            <img
                                onClick={eventHandle.closeSkillSetModel}
                                style={{ cursor: "pointer" }}
                                src={cancelIcon}
                                alt=""
                            />
                            <button>Cancel</button>
                        </div>
                    </div>
                    <div className="next-btn" style={{ marginRight: '10px', marginTop: '5px' }}  onClick={eventHandle.saveData}>
                        <img
                            onClick={eventHandle.saveData}
                            style={{ cursor: "pointer" }}
                            src={saveIocn}
                            alt=""
                        />
                        <button>Save</button>
                    </div>
                </div>
            </Grid>
        </Grid>
    )
}
export default Buttons;