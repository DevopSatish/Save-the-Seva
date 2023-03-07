import axios from "axios";

const triggerCallEndpoint = `${process.env.REACT_APP_API_HOST}/api/trigger_call`;

export async function triggerPhoneCallAPI(amountPayable, customerName, customerPhone) {
    const formattedTextToSpeak = `Hey ${customerName}, this is team what the food taking part in S I H 2022, as per the Aadhaar services availed by you, please pay ${amountPayable} rupees to the operator`;
    const apiResponse = await axios.post(
        triggerCallEndpoint,
        { "customer_phone": customerPhone, "text_to_speak": formattedTextToSpeak }
    );
    return apiResponse;
};
