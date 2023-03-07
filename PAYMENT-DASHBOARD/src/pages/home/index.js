import { Box, Container, Snackbar } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { StringParam, useQueryParam } from 'use-query-params';

import { useState } from "react";
import { createShiftCashCollectionEntryAPI } from "../../api/shift_cash_collection";
import { logoutUser } from "../../config/firebase";
import { getActiveUser } from "../../config/user";
import AadhaarFetchPage from "./aadhaar_fetch";
import ComplaintsSubPage from "./complaints";
import { EndShiftPopupComponent } from "./dialog";
import { CustomAppBar, CustomAppDrawer } from "./drawer";
import MetricsSubPage from "./metrics";
import ReconSubPage from "./recon";
import TransactionsSubPage from "./transactions";

function HomePage() {
    // Auth
    const navigate = useNavigate();
    const activeUser = getActiveUser();
    if (!activeUser) navigate("/", { replace: true });

    // Drawer page selection
    const [page, setPage] = useQueryParam('page', StringParam);
    const [isEndShiftPopupOpen, setIsEndShiftPopupOpen] = useState(false);
    const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);

    const onLogoutButtonClick = async () => {
        await logoutUser();
        navigate("/", { replace: true });
    };

    const onEndShiftButtonClick = () => setIsEndShiftPopupOpen(true);
    const onEndShiftPopupClose = () => setIsEndShiftPopupOpen(false);

    const onEndShiftSubmitEnd = async () => {
        setIsEndShiftPopupOpen(false);
        setIsSnackbarOpen(false);
        await onLogoutButtonClick();
    };

    const onEndShiftPopupSubmit = async (jsDateInstance, cash) => {
        cash = parseInt(cash);
        const dateString = jsDateInstance.getFullYear() + '-' + (jsDateInstance.getMonth() + 1) + '-' + jsDateInstance.getDate();
        if (cash && dateString) {
            const shiftCashCollectionAPIResponse = await createShiftCashCollectionEntryAPI(
                dateString,
                cash,
                activeUser.id
            );
            if (shiftCashCollectionAPIResponse.status === 200) {
                setIsSnackbarOpen(true);
            }
        }
    }

    // Main content
    const getContentPane = (activePage) => {
        let contentComponent = <MetricsSubPage />;
        switch (activePage) {
            case "qr":
                contentComponent = <AadhaarFetchPage />;
                break;
            case "transactions":
                contentComponent = <TransactionsSubPage />;
                break;
            case "recon":
                contentComponent = <ReconSubPage />;
                break;
            case "complaints":
                contentComponent = <ComplaintsSubPage />;
                break;
            default:
                contentComponent = <MetricsSubPage />;
                break;
        }

        return (
            <Container sx={{
                paddingTop: 10,
                flexGrow: 1
            }}>
                {contentComponent}
            </Container>
        );
    };

    return (
        <Box sx={{ display: "flex" }}>
            <CustomAppBar
                username={activeUser?.name}
                role={activeUser?.role}
                onLogoutButtonClick={onLogoutButtonClick}
                onEndShiftButtonClick={onEndShiftButtonClick}
            />
            <EndShiftPopupComponent
                open={isEndShiftPopupOpen}
                onClose={onEndShiftPopupClose}
                onSubmit={onEndShiftPopupSubmit}
            />
            <Snackbar
                open={isSnackbarOpen}
                autoHideDuration={3000}
                onClose={onEndShiftSubmitEnd}
                message="Successfully submitted, ending shift and logging out"
            />
            <CustomAppDrawer
                activePage={page}
                onPageSelected={(newPage) => setPage(newPage)}
            />
            {getContentPane(page)}
        </Box>
    );
}

export default HomePage;
