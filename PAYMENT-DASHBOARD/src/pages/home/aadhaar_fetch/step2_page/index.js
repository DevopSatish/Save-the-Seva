import {
    FormControl, FormGroup, InputLabel, MenuItem,
    OutlinedInput, Select, Typography, Fab, TextField
} from "@mui/material";
import { NavigateNext } from '@mui/icons-material';

import { useEffect, useState } from "react";
import { getServiceList } from "../../../../api/service";
import { updateAadhaarEndpointAPI } from "../../../../api/aadhaar";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

function Step2Page({ onActiveStepChange, activeProps }) {
    const [serviceList, setServiceList] = useState([]);
    const [selectedServiceList, setSelectedServiceList] = useState([]);
    const [newAddress, setNewAddress] = useState(activeProps["address"]);

    const getServices = async () => {
        const apiResponseData = await getServiceList();
        setServiceList(apiResponseData);
    };

    useEffect(() => {
        if (serviceList.length === 0) getServices();
    }, [serviceList]);

    function getTotalCost() {
        let tempTotal = 0;
        selectedServiceList.forEach(element => {
            const serviceInstance = serviceList.find(serviceObj => serviceObj["id"] === element);
            tempTotal += serviceInstance["cost"];
        });
        return tempTotal;
    }

    async function onSubmit() {
        if (newAddress) {
            const aadhaarId = activeProps["id"];
            await updateAadhaarEndpointAPI(aadhaarId, newAddress)
        }
        onActiveStepChange(2, {
            "customer_phone": activeProps["phone_number"],
            "service_id_list": selectedServiceList,
            "customer_name": activeProps["customer_name"],
            "aadhaar_number": activeProps["aadhaar_number"]
        });
    }


    return (
        <div>
            <Typography variant="h6">Select the services</Typography>

            <FormGroup sx={{ marginTop: 4 }}>
                <FormControl>
                    <InputLabel id="demo-multiple-name-label">Name</InputLabel>
                    <Select
                        labelId="demo-multiple-name-label"
                        id="demo-multiple-name"
                        multiple
                        value={selectedServiceList}
                        onChange={event => setSelectedServiceList(event.target.value)}
                        input={<OutlinedInput label="Name" />}
                        MenuProps={MenuProps}
                        fullWidth
                    >
                        {serviceList.map((serviceObject) => (
                            <MenuItem
                                key={serviceObject["id"]}
                                value={serviceObject["id"]}
                            >
                                {serviceObject["name"]} =&nbsp;<b>{serviceObject["cost"]}₹</b>
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </FormGroup>

            <Typography variant="h6" sx={{ marginTop: 4 }}>Total cost: <b>{getTotalCost()}₹</b></Typography>

            {
                selectedServiceList.find(element => element === 4) &&
                <TextField
                    label="Enter your new address"
                    sx={{ marginTop: 2 }}
                    value={newAddress}
                    onChange={event => setNewAddress(event.target.value)}
                    fullWidth
                />
            }

            {
                selectedServiceList.length > 0 &&
                <Fab
                    variant="extended"
                    color="primary"
                    sx={{ position: "fixed", bottom: 0, right: 0, marginBottom: 4, marginRight: 4 }}
                    onClick={onSubmit}
                >
                    Next
                    <NavigateNext />
                </Fab>
            }
        </div>
    );
}

export default Step2Page;
