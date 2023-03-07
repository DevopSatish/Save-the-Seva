import { Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { CChart } from "@coreui/react-chartjs";
import { getOrderList } from "../../../api/order";


function MetricsSubPage() {
    const [uniqueDateList, setUniqueDateList] = useState([]);
    const [orderList, setOrderList] = useState([]);
    const [onlineOrderCount, setOnlineOrderCount] = useState(0);
    const [offlineOrderCount, setOfflineOrderCount] = useState(0);

    useEffect(() => {
        const getOnlineVsOfflinePaymentMetrics = async () => {
            let orderList = await getOrderList();
            const uniqueDateSet = new Set();
            const uuidSeeSet = new Set();
            let tempOnlineOrderCount = 0;
            let tempOfflineOrderCount = 0;
            orderList.forEach((orderObject, index) => {
                const orderUuid = orderObject["uuid"];
                const status = orderObject["status"];
                if (!uuidSeeSet.has(orderUuid) && status === "SUCCESS") {
                    const updatedAt = orderObject["updated_at"];
                    const modeOfPayment = orderObject["mode_of_payment"];
                    const jsDateInstance = new Date(updatedAt);
                    const dateString = jsDateInstance.getFullYear() + '-' + (jsDateInstance.getMonth() + 1) + '-' + jsDateInstance.getDate();
                    uniqueDateSet.add(dateString);
                    uuidSeeSet.add(orderUuid);
                    orderList[index]["updated_at"] = dateString;

                    if (modeOfPayment === "ONLINE") {
                        tempOnlineOrderCount++;
                    }
                    if (modeOfPayment === "OFFLINE") {
                        tempOfflineOrderCount++;
                    }
                }
            });

            setOnlineOrderCount(tempOnlineOrderCount);
            setOfflineOrderCount(tempOfflineOrderCount);

            setOrderList(orderList);
            setUniqueDateList(Array.from(uniqueDateSet));

        };
        if (orderList.length === 0) getOnlineVsOfflinePaymentMetrics();
    });

    const getOnlineVsOfflineGraph = () => {
        return (
            <div>
                <CChart
                    type="bar"
                    data={{
                        labels: ["Online", "Offline"],
                        datasets: [
                            {
                                label: 'Online vs Offline payments',
                                backgroundColor: '#f87979',
                                data: [onlineOrderCount, offlineOrderCount],
                            },
                        ],
                    }}
                    labels="months"
                />
            </div >
        );
    };

    return (
        <div>
            <Typography variant="h4" gutterBottom>KPIs</Typography>

            {uniqueDateList && orderList && getOnlineVsOfflineGraph()}
        </div>
    );
};

export default MetricsSubPage;


/*
ONLINE {2022-8-24: 1166, 2022-8-25: 56}
OFFLINE {2022-8-25: 34}

[{x: Date, y: 0}]
*/