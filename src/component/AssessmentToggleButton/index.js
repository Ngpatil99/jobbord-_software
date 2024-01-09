import { useState } from 'react'
import ReactTooltip from 'react-tooltip';
import { toast } from 'react-toastify'
import './index.css'

const AssessmentToggleButton = (props) => {
    const [checked, setchecked] = useState(props?.status)
    const onChangeToggle = (e) => {
        if (props?.name !== "draft") {
            setchecked(e.target.checked);
            props.toggleSettings(props.testDataIndex)
        } else {
            toast("Please publish your test!")
        }


    }

    return (
        <>
            <label data-tip={props?.name === "draft" ? "Please publish your test" : ``} class="switch">
                <input checked={checked} onChange={(e) => { onChangeToggle(e); props.btnFucn(e) }} type="checkbox" />
                <span class="slider round"></span>
            </label>
        </>

    )
}

export default AssessmentToggleButton