import { Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { getReconDiffAPI } from "../../../api/recon";


const jsDateInstance = new Date();
const year = jsDateInstance.getFullYear();
const month = jsDateInstance.getMonth() + 1;
const date = jsDateInstance.getDate();
let formattedDate = `${year}-${month}-${date}`;

const columns = [
    { field: 'date', headerName: 'Date', width: 128 },
    { field: 'expected_amount', headerName: 'Expected Amount', width: 200 },
    { field: 'actual_amount', headerName: 'Actual amount collected', width: 200 },
    { field: 'diff', headerName: 'Difference', width: 200 },
    { field: 'operator', headerName: 'Operator', width: 256 }
];

function ReconSubPage() {
    const [rows, setRows] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function getReconDiffData() {
            let aggregateData = [];
            let apiResponseData = await getReconDiffAPI(formattedDate);
            aggregateData = aggregateData.concat(apiResponseData);
            for (let i = 1; i <= 7; i++) {
                const newDate = date - i;
                formattedDate = `${year}-${month}-${newDate}`;
                apiResponseData = await getReconDiffAPI(formattedDate);
                aggregateData = aggregateData.concat(apiResponseData);
            }
            aggregateData = aggregateData.filter((item) => item !== null);
            if (aggregateData.length > 0) {
                setRows(aggregateData);
                setIsLoading(false);
            }
        }
        getReconDiffData();
    });

    return (
        <div>
            <Typography variant="h4" gutterBottom>
                2 Way Recon
            </Typography>

            <div style={{ height: window.innerHeight / 1.3, width: '100%', marginTop: 32 }}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    pageSize={25}
                    rowsPerPageOptions={[5]}
                    checkboxSelection
                    loading={isLoading}
                    getRowId={row => `${row.date}-${row.operator}-${row.diff}-${row.expected_amount}-${row.actual_amount}`}
                />
            </div>
        </div>
    );
};

export default ReconSubPage;
