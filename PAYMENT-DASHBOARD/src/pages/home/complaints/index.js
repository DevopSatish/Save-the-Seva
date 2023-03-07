import { Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useState, useEffect } from "react";
import { getFeedbackList } from "../../../api/feedback";

const columns = [
    { field: 'order_uuid', headerName: 'Order ID', sortable: true, width: 256 },
    { field: 'user_paid_amount', headerName: 'User Paid Amount', type: "number", width: 256 },
    {
        field: 'stars',
        headerName: 'Rating',
        type: "number"
    }
];

function ComplaintsSubPage() {
    const [rows, setRows] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function getComplaints() {
            const complaintsList = await getFeedbackList();
            setRows(complaintsList);
            setIsLoading(false);
        };
        getComplaints();
    });

    return (
        <div>
            <Typography variant="h4" gutterBottom>Complaints / Feedback</Typography>

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

export default ComplaintsSubPage;
