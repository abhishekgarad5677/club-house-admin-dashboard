import React, { useContext, useEffect, useState } from "react";
import {
    Modal,
    Box,
    Typography,
    Button,
} from "@mui/material";
import { UserContext } from "../../utils/UserContext";


export const DeleteUser = (props) => {

    const { open, handleClose, userData, setUserTabelData } = props;

    const { allUsersData, updatedUserList } = useContext(UserContext);

    const handleSubmit = () => {
        const updatedArray = allUsersData.filter(item => item.id !== userData.id);
        updatedUserList(updatedArray)
        handleClose()
    };

    const style = {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "90%",
        maxWidth: 500,
        bgcolor: "background.paper",
        borderRadius: "8px",
        boxShadow: 24,
        p: 4,
    };

    return (
        <div>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography mb={4} id="modal-modal-title" variant="h6" fontWeight="600" component="h2">
                        Are you sure you want to delete the user?
                    </Typography>
                    <Box
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        flexWrap="wrap"
                        gap={4}
                        mb={2}
                    >
                        <Button variant="contained" color="error" onClick={handleSubmit}>
                            Yes
                        </Button>
                        <Button variant="contained" onClick={handleClose}>
                            No
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </div>
    );
}