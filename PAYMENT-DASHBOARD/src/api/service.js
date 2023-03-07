import axios from "axios";

const getServiceListEndpoint = `${process.env.REACT_APP_API_HOST}/api/service/`;

export async function getServiceList() {
    const apiResponse = await axios.get(getServiceListEndpoint);
    if (apiResponse.status === 200 && apiResponse.data && apiResponse.data.length > 0) return apiResponse.data;
    else return null;
};
