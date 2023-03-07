import { Typography, TextField, Rating, Button, Dialog, DialogTitle } from "@mui/material";
import { Container } from "@mui/system";
import { useEffect, useState } from "react";
import { StringParam, useQueryParam } from 'use-query-params';
import { getOrderDetailsForFeedbackAPI } from "../../api/order";
import { createFeedbackEntry } from "../../api/feedback";


export default function FeedbackPage() {
    const [orderUuid] = useQueryParam('order_uuid', StringParam);
    const [orderList, setOrderList] = useState([]);
    const [userAmount, setUserAmount] = useState();
    const [userRating, setUserRating] = useState(0);
    const [isSuccessPopupOpen, setIsSuccessPopupOpen] = useState(false);

    useEffect(() => {
        async function getOrderDetailsForFeedbackPage() {
            const orderData = await getOrderDetailsForFeedbackAPI(orderUuid);
            setOrderList(orderData);
        }
        if (orderUuid) getOrderDetailsForFeedbackPage();
    }, [orderUuid]);

    const onSubmitButtonClick = async () => {
        const feedbackApiResponse = await createFeedbackEntry(userAmount, userRating, orderUuid);
        if (feedbackApiResponse.status === 201) setIsSuccessPopupOpen(true);
    }

    return (
        <Container sx={{ fontFamily: "Lexend Deca", paddingTop: 8 }}>
            <Typography variant="h3">Feedback Form</Typography>
            <Typography sx={{ color: "grey", marginBottom: 16 }} variant="subtitle1">Your feedback helps us serve you better</Typography>

            {
                orderUuid ?
                    <div>
                        <Typography variant="h6">Services used</Typography>

                        {
                            orderList.map((orderData, idx) => {
                                return (
                                    <div key={orderData.id}>
                                        <Typography variant="subtitle3">{`${idx + 1}. ${orderData.service_name} = ${orderData.service_cost} ₹`}</Typography>
                                        <br />
                                    </div>
                                );
                            })
                        }

                        <div style={{ marginTop: 40 }} />
                        <Typography variant="subtitle3">Enter the amount you paid</Typography>
                        <TextField
                            variant="outlined"
                            type="number"
                            value={userAmount}
                            fullWidth
                            onChange={event => setUserAmount(event.target.value)}
                        />

                        <div style={{ marginTop: 40 }} />
                        <Typography variant="subtitle3">Rate your experience</Typography>
                        <br />
                        <Rating name="read-only" value={userRating} onChange={(event, newVal) => setUserRating(newVal)} />

                        <Button variant="contained" fullWidth sx={{ marginTop: 8 }} onClick={onSubmitButtonClick}>Submit</Button>

                        <Dialog open={isSuccessPopupOpen} onClose={() => setIsSuccessPopupOpen(false)}>
                            <DialogTitle>Thank you for your input ✅</DialogTitle>
                        </Dialog>
                    </div>
                    : <Typography variant="h5" sx={{ marginTop: 32 }}>Please specify the order ID to provide feedback for</Typography>

            }

        </Container>
    );
}
