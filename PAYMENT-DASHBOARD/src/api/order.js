import axios from "axios";
import { getServiceList } from "./service";

const getOrderEndpoint = `${process.env.REACT_APP_API_HOST}/api/order/`;

export async function getOrderList(operatorId = null) {
    let endpoint = getOrderEndpoint;
    if (operatorId) endpoint = `${getOrderEndpoint}?operator_id=${operatorId}`;
    const apiResponse = await axios.get(endpoint);
    if (apiResponse.status === 200 && apiResponse.data && apiResponse.data.length > 0) return apiResponse.data;
    else return null;
};

export async function createOfflineOrder(amount, operatorId, serviceIdList, customerPhone) {
    const aggregateResponseList = [];
    serviceIdList.forEach(async (serviceId) => {
        const apiResponse = await axios.post(
            getOrderEndpoint,
            {
                "customer_phone": customerPhone,
                "mode_of_payment": "OFFLINE",
                "amount_collected": amount,
                "operator": operatorId,
                "service": serviceId,
                "status": "SUCCESS"
            }
        );
        if (apiResponse.status === 200)
            aggregateResponseList.push(apiResponse.data);
    });
    return aggregateResponseList;
}

export async function getOrderDetailsForFeedbackAPI(orderUuid) {
    const serviceList = await getServiceList();
    const serviceMap = {};
    serviceList.forEach(serviceObject => {
        serviceMap[serviceObject.id] = serviceObject
    });
    let orderData = await axios.get(`${getOrderEndpoint}?uuid=${orderUuid}`);
    orderData = orderData.data;
    orderData = orderData.map((orderObject) => {
        const serviceId = orderObject.service;
        const serviceName = serviceMap[serviceId]["name"];
        const serviceCost = serviceMap[serviceId]["cost"];
        orderObject["service_name"] = serviceName;
        orderObject["service_cost"] = serviceCost;
        return orderObject;
    });
    return orderData;
};
