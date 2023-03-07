import { NavigateNext } from '@mui/icons-material';
import { Button, Fab, TextField } from "@mui/material";
import React, { useState } from "react";
import { getAadhaarEndpointAPI } from "../../../../api/aadhaar";

function Step1Page({ onActiveStepChange }) {
    const [phoneNumber, setPhoneNumber] = useState('9663265931');
    const [aadhaarId, setAadhaarId] = useState(null);
    const [customerName, setCustomerName] = useState(null);
    const [aadhaarNumber, setAadhaarNumber] = useState(null);
    const [address, setAddress] = useState(null);


    const onPhoneNumberSubmitButtonClick = async () => {
        const aadhaarObject = await getAadhaarEndpointAPI(phoneNumber);
        setAadhaarId(aadhaarObject["id"]);
        setCustomerName(aadhaarObject["name"]);
        setAadhaarNumber(aadhaarObject["aadhaar_number"]);
        setAddress(aadhaarObject["address"])
    };

    return (
        <div>
            <span style={{ flex: 1, justifyContent: 'center', alignItems: 'center', flexGrow: 1 }}>
                <TextField
                    label="Enter your phone number"
                    type="number"
                    sx={{ width: window.innerWidth / 2 }}
                    value={phoneNumber}
                    onChange={event => {
                        if (event.target.value.length <= 10)
                            setPhoneNumber(event.target.value)
                    }
                    }
                />
                <Button
                    sx={{ marginTop: 1, marginLeft: 2 }}
                    variant="contained"
                    onClick={onPhoneNumberSubmitButtonClick}
                >
                    Fetch details
                </Button>
            </span>

            {
                customerName &&
                <TextField
                    label="Name"
                    sx={{ width: window.innerWidth / 2, marginTop: 4 }}
                    value={customerName}
                    InputProps={{
                        readOnly: true,
                    }}
                />
            }

            {
                aadhaarNumber &&
                <TextField
                    label="Aadhaar Number"
                    sx={{ width: window.innerWidth / 2, marginTop: 2 }}
                    value={aadhaarNumber}
                    InputProps={{
                        readOnly: true,
                    }}
                />
            }

            {
                address &&
                <TextField
                    label="Address"
                    sx={{ width: window.innerWidth / 2, marginTop: 2 }}
                    value={address}
                    InputProps={{
                        readOnly: true,
                    }}
                />
            }

            {
                customerName &&
                aadhaarNumber &&
                aadhaarId &&
                <Fab
                    variant="extended"
                    color="primary"
                    sx={{ position: "fixed", bottom: 0, right: 0, marginBottom: 4, marginRight: 4 }}
                    onClick={() => onActiveStepChange(1, {
                        "phone_number": phoneNumber,
                        "address": address,
                        "id": aadhaarId,
                        "customer_name": customerName,
                        "aadhaar_number": aadhaarNumber
                    })}
                >
                    Next
                    <NavigateNext />
                </Fab>
            }
        </div>
    );
};

export default Step1Page;