import {
    Step,
    StepLabel, Stepper, Typography
} from "@mui/material";
import React, { useState } from "react";
import { getActiveUser } from "../../../config/user";
import QRSubPage from "../qr";
import Step1Page from "./step1_page";
import Step2Page from "./step2_page";

const activeUser = getActiveUser();

function AadhaarFetchPage() {
    const [activeStep, setActiveStep] = useState(0);
    const [stage2Props, setStage2Props] = useState({});
    const [stage3Props, setStage3Props] = useState({});

    const StepperComponent = () => {
        const steps = [
            "Verify information",
            "Select services",
            "Proceed to payment"
        ];
        return (
            <Stepper
                activeStep={activeStep}
                sx={{ marginBottom: 4 }}
            >
                {
                    steps.map((label, index) => {
                        return (
                            <Step key={label} completed={index <= activeStep}>
                                <StepLabel>{label}</StepLabel>
                            </Step>
                        );
                    })
                }
            </Stepper>
        );
    };

    const onActiveStepChange = (activeStepNumber, props) => {
        setActiveStep(activeStepNumber);
        if (activeStepNumber === 1)
            setStage2Props(props);
        else if (activeStepNumber === 2)
            setStage3Props(props);
    };

    return (
        <div>
            <StepperComponent />
            <Typography variant="h4" gutterBottom>
                Aadhaar details
            </Typography>

            {activeStep === 0 && <Step1Page onActiveStepChange={onActiveStepChange} />}
            {activeStep === 1 && <Step2Page onActiveStepChange={onActiveStepChange} activeProps={stage2Props} />}
            {activeStep === 2 && <QRSubPage activeUser={activeUser} onActiveStepChange={onActiveStepChange} props={stage3Props} />}
        </div>
    );
};

export default AadhaarFetchPage;
