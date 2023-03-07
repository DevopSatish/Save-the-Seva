import axios from "axios";

const getReconDiff = `${process.env.REACT_APP_API_HOST}/api/recon_diff`;

export async function getReconDiffAPI(dateString) {
    const apiResponse = await axios.post(getReconDiff, { "date": dateString });
    if (apiResponse.status === 200 && apiResponse.data && apiResponse.data.length > 0) return apiResponse.data;
    else return null;
};
