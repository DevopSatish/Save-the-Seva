import axios from "axios";

const getAadhaarEndpoint = `${process.env.REACT_APP_API_HOST}/api/aadhaar/`;

export async function getAadhaarEndpointAPI(phoneNumber) {
    const apiResponse = await axios.get(
        `${getAadhaarEndpoint}?phone_number=${phoneNumber}`,
    );
    if (apiResponse.status === 200 && apiResponse.data && apiResponse.data.length > 0) return apiResponse.data[0];
    else return null;
};

export async function updateAadhaarEndpointAPI(aadhaarId, newAddress) {
    const apiResponse = await axios.patch(
        `${getAadhaarEndpoint}${aadhaarId}/`,
        { "requested_changes": { "address": newAddress } }
    );
    return apiResponse;
};
