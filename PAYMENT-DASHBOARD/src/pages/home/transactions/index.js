import { Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { getOrderList } from "../../../api/order";
import { getServiceList } from "../../../api/service";
import { getActiveUser } from "../../../config/user";


const columns = [
    { field: 'id', headerName: 'ID', type: 'number', sortable: true, width: 128 },
    { field: 'uuid', headerName: 'Order ID', width: 300 },
    { field: 'status', headerName: 'Status' },
    { field: 'pg_txn_id', headerName: 'PG transaction ID', width: 300 },
    { field: 'customer_phone', headerName: 'Customer Phone', width: 256 },
    { field: 'operator', headerName: 'Operator' },
    { field: 'service', headerName: 'Services', width: 512 },
    { field: 'amount_collected', headerName: 'Total Amount collected', width: 256 }
];

const activeUser = getActiveUser();

function TransactionsSubPage() {
    const [rows, setRows] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function getOrders() {
            let localOrderList = [];
            const serviceList = await getServiceList();
            const serviceMapInterim = {};
            serviceList.forEach(service => serviceMapInterim[service.id] = service);
            if (activeUser.role === "ADMIN")
                localOrderList = await getOrderList();
            else localOrderList = await getOrderList(activeUser.id);
            localOrderList = localOrderList.map((order) => {
                order["service"] = serviceMapInterim[order["service"]]["name"];
                return order;
            })
            setRows(localOrderList);
            setIsLoading(false);
        };
        getOrders();
    });

    return (
        <div>
            <Typography variant="h4" gutterBottom>Transactions</Typography>

            <div style={{ height: window.innerHeight / 1.3, width: '100%', marginTop: 32 }}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    pageSize={25}
                    rowsPerPageOptions={[5]}
                    checkboxSelection
                    loading={isLoading}
                />
            </div>
        </div>
    );
};

export default TransactionsSubPage;
