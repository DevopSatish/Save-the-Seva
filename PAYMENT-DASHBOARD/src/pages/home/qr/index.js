import {
    Button, Card,
    CardContent,
    CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, Snackbar, Typography
} from "@mui/material";
import React, { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import { useNavigate } from "react-router-dom";
import { triggerPhoneCallAPI } from "../../../api/call";
import { createOfflineOrder } from "../../../api/order";
import { getPaymentLink } from "../../../api/payment_link";
import { getServiceList } from "../../../api/service";

function QRSubPage({ activeUser, onActiveStepChange, props }) {
    const navigate = useNavigate();
    const customerPhone = props["customer_phone"];
    const customerName = props["customer_name"];
    const services = props["service_id_list"];

    const [serviceMap, setServiceMap] = useState({});
    const [paymentLink, setPaymentLink] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isCashPaymentDialogOpen, setIsCashPaymentDialogOpen] = useState(false);
    const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);

    let serviceList = [];

    const isInputPresentInUrl = customerPhone && services;
    const isServiceMapPopulated = Object.keys(serviceMap).length > 0;

    if (isInputPresentInUrl) {
        serviceList = services.toString().split(',');
        serviceList = serviceList.map(serviceId => parseInt(serviceId));
    }

    useEffect(() => {
        async function populateServiceMap() {
            const serviceObjectList = await getServiceList();
            const serviceMapInterim = {};
            serviceObjectList.forEach((serviceObj) => {
                serviceMapInterim[serviceObj.id] = serviceObj;
            })

            await generateQRCodeJSON(customerPhone, serviceList, activeUser);
            setServiceMap(serviceMapInterim);
        }
        if (!isServiceMapPopulated) populateServiceMap();
    });

    async function generateQRCodeJSON(customerPhone, serviceList, operator) {
        if (customerPhone && serviceList && operator) {
            const paymentLinkApiResponseJson = await getPaymentLink(
                customerPhone, operator.id, serviceList.toString()
            );
            setPaymentLink(paymentLinkApiResponseJson["payment_link"]);
            setIsLoading(false);
        }
        else {
            setIsLoading(false);
        }
    }

    const getServiceBreakdown = () => {
        let totalCost = 0;
        serviceList.forEach((serviceId) => {
            const cost = serviceMap[serviceId].cost;
            totalCost += cost;
        });

        return (
            <div>
                <Typography variant="h5" gutterBottom>Total amount payable: <b style={{ fontSize: 32, color: "orange" }}><u>{totalCost}₹</u></b></Typography>
                <Typography variant="subtitle2">Services availed</Typography>
                {
                    serviceList.map((serviceId, index) => {
                        const title = serviceMap[serviceId].name;
                        const cost = serviceMap[serviceId].cost;

                        return (
                            <Typography variant="body1" key={serviceId}>{index + 1}. {title} <b><i>({cost}₹)</i></b></Typography>
                        );
                    })
                }
            </div>
        );
    };

    const onSnackbarClose = async () => {
        setIsSnackbarOpen(false);
        setIsCashPaymentDialogOpen(false);
        navigate("/home?page=qr", { replace: true });
    }

    const QRCodeComponent = (qrCodeSize = 300) => {
        return (
            <center style={{ flex: 1 }}>
                {
                    isInputPresentInUrl &&
                    paymentLink &&
                    <QRCode
                        title="Aadhaar Payment Recon"
                        value={paymentLink}
                        size={qrCodeSize}
                    />
                }
            </center>
        );
    }

    const CashPaymentPopupComponent = () => {
        let totalCost = 0;
        serviceList.forEach((serviceId) => {
            const cost = serviceMap[serviceId].cost;
            totalCost += cost;
        });

        return (
            <Dialog open={isCashPaymentDialogOpen} onClose={() => setIsCashPaymentDialogOpen(false)}>
                <DialogTitle>Cash Payments</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Please collect <b>{totalCost}₹</b> from the customer in cash and click on the submit button
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsCashPaymentDialogOpen(false)}>Cancel</Button>
                    <Button onClick={onPayWithCashButtonClick}>Submit</Button>
                </DialogActions>
            </Dialog>
        );
    }

    const onPayWithCashButtonClick = async () => {
        let totalCost = 0;
        serviceList.forEach((serviceId) => {
            const cost = serviceMap[serviceId].cost;
            totalCost += cost;
        });

        await createOfflineOrder(
            totalCost,
            activeUser.id,
            serviceList,
            customerPhone
        );

        setIsSnackbarOpen(true);
    };

    const onCashPaymentButtonClickInitial = async () => {
        let totalCost = 0;
        serviceList.forEach((serviceId) => {
            const cost = serviceMap[serviceId].cost;
            totalCost += cost;
        });

        setIsCashPaymentDialogOpen(true);
        const apiResponse = await triggerPhoneCallAPI(
            totalCost,
            customerName,
            customerPhone
        );
        console.log(apiResponse.data);
    }

    return (
        <div>
            <Typography variant="h2" gutterBottom sx={{ marginTop: 8 }}>Scan to pay</Typography>
            <Typography variant="subtitle1" gutterBottom>Or check the SMS received on your registered mobile number for the payment link</Typography>

            {
                isLoading ?
                    <center><CircularProgress sx={{ marginTop: 16 }} /><Typography>Generating payment link</Typography></center> :
                    <div>
                        <Grid container sx={{ marginTop: 8 }}>
                            <Grid item md={6}>
                                {
                                    isInputPresentInUrl && isServiceMapPopulated &&
                                    <Card elevation={8}>
                                        <CardContent>
                                            {getServiceBreakdown()}
                                        </CardContent>
                                    </Card>
                                }
                                {
                                    isInputPresentInUrl && isServiceMapPopulated &&
                                    <Button
                                        color="secondary"
                                        sx={{ textTransform: "none", fontSize: 20, marginTop: 16 }}
                                        onClick={onCashPaymentButtonClickInitial}
                                    >
                                        Pay with cash
                                    </Button>
                                }
                            </Grid>

                            <Grid item md={6}>
                                {QRCodeComponent()}
                            </Grid>
                        </Grid>
                        {
                            isInputPresentInUrl && isServiceMapPopulated &&
                            CashPaymentPopupComponent()
                        }

                        <Snackbar
                            open={isSnackbarOpen}
                            autoHideDuration={3000}
                            onClose={onSnackbarClose}
                            message="Successfully submitted, marking transaction as offline"
                        />
                    </div>
            }

        </div>
    );
};

export default QRSubPage;
