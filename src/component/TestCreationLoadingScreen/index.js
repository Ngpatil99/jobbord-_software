import React from "react";
import Styles from "./index.module.css";

const TestCreationLoadingScreen = (props) => {
    return (
        <div className={Styles.testCreationLoadingScreen} >
            <div className={Styles.header} >
                <div className={Styles.avatar_main_container} >
                    <div className={Styles.avatar} >

                    </div>
                    <div className={Styles.subHeader} >
                        <p></p>
                        <span></span>
                    </div>
                </div>

                <div className={Styles.middleContent} >
                    <p></p>
                    <span></span>
                </div>

                <div className={Styles.avatar} >

                </div>
            </div>

            <div className={Styles.lowerContent} >
                <p>The best teamwork come from people who are working independently toward one goal in unison</p>
                <span>– James  Penney</span>
                <div className="loader" ></div>
            </div>
        </div>
    )
}

export default TestCreationLoadingScreen