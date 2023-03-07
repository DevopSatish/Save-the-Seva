import axios from "axios";

const createShiftCashCollectionEntryEndpoint = `${process.env.REACT_APP_API_HOST}/api/shift_cash_collection/`;

export async function createShiftCashCollectionEntryAPI(date, cash, operatorId) {
    const apiResponse = await axios.post(
        createShiftCashCollectionEntryEndpoint,
        {
            "date": date,
            "cash": cash,
            "operator": operatorId
        }
    )
    return apiResponse;
};
