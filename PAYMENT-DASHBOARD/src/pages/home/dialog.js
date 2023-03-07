import { Dialog, DialogTitle, DialogContent, DialogContentText, TextField, DialogActions, Button } from "@mui/material";
import { useState } from "react";

export const EndShiftPopupComponent = ({ open, onClose, onSubmit }) => {
    const [cash, setCash] = useState(0);

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>End Shift</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    To end your shift, carefully count the money and enter the total amount collected via cash during your shift and click on submit
                </DialogContentText>
                <TextField
                    autoFocus
                    margin="dense"
                    id="endShiftCashTextField"
                    label="Overall cash collected during shift"
                    type="number"
                    fullWidth
                    variant="standard"
                    value={cash}
                    onChange={event => setCash(event.target.value)}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={() => onSubmit(new Date(), cash)}>Submit</Button>
            </DialogActions>
        </Dialog>
    );
};