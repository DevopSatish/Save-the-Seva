import axios from "axios";

const getOperatorEndpoint = `${process.env.REACT_APP_API_HOST}/api/operator/`;

export async function getOperator(firebaseUid) {
    const apiResponse = await axios.get(
        `${getOperatorEndpoint}?firebase_uid=${firebaseUid}`
    );
    if (apiResponse.status === 200 && apiResponse.data && apiResponse.data.length > 0) return apiResponse.data[0];
    else return null;
};
