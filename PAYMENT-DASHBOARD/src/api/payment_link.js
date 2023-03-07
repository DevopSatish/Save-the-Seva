import axios from "axios";

const getPaymentLinkEndpoint = `${process.env.REACT_APP_API_HOST}/api/get_payment_link`;

export async function getPaymentLink(customerPhone, operatorId, serviceIdList) {
    const apiResponse = await axios.get(
        getPaymentLinkEndpoint,
        {
            //web url parameters
            params: {
                "customer_phone": customerPhone,
                "operator_id": operatorId,
                "service_id_list": serviceIdList
            }
        }
    );
    if (apiResponse.status === 200 && apiResponse.data) return apiResponse.data; //200 represents successful payment
    else return null;
};