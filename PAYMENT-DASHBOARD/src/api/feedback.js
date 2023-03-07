import axios from "axios";

const getFeedbackEndpoint = `${process.env.REACT_APP_API_HOST}/api/feedback/`;

export async function createFeedbackEntry(userAmount, userStarRating, orderUuid) {
    const apiResponse = await axios.post(
        getFeedbackEndpoint,
        { "user_paid_amount": userAmount, "stars": userStarRating, "order_uuid": orderUuid }
    );
    return apiResponse;
};

export async function getFeedbackList(userAmount, userStarRating, orderUuid) {
    const apiResponse = await axios.get(
        getFeedbackEndpoint
    );
    return apiResponse.data;
};
