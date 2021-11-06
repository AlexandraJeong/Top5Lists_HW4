import React, { useContext, useEffect } from 'react'
import { GlobalStoreContext } from '../store'
import ListCard from './ListCard.js'
import { Fab, Typography } from '@mui/material'
import AddIcon from '@mui/icons-material/Add';
import List from '@mui/material/List';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
/*
    This React component lists all the top5 lists in the UI.
    
    @author McKilla Gorilla
*/
const HomeScreen = () => {
    const { store } = useContext(GlobalStoreContext);

    useEffect(() => {
        store.loadIdNamePairs();
    }, []);

    function handleCreateNewList() {
        store.createNewList();
    }
    function handleConfirm(event){
        event.stopPropagation();
        store.deleteMarkedList();
    }
    function handleCancel(event){
        event.stopPropagation();
        store.unmarkListForDeletion();
    }
    let listCard = "";
    if (store) {
        listCard =
            <List sx={{ width: '90%', left: '5%', bgcolor: 'background.paper' }}>
                {
                    store.idNamePairs.map((pair) => (
                        <ListCard
                            key={pair._id}
                            idNamePair={pair}
                            selected={false}
                        />
                    ))
                }
            </List>;
    }
    return (
        <div id="top5-list-selector">
            <div id="list-selector-heading">
                <Fab
                    color="primary"
                    aria-label="add"
                    id="add-list-button"
                    onClick={handleCreateNewList}
                >
                    <AddIcon />
                </Fab>
                <Typography variant="h2">Your Lists</Typography>
            </div>
            <div id="list-selector-list">
                {
                    listCard
                }
            </div>
            <Modal
                open={store.listMarkedForDeletion}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 300,
                    bgcolor: 'background.paper',
                }}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Delete the {store.listMarkedForDeletion != null ? store.listMarkedForDeletion.name : ""} Top 5 List?
                    </Typography>
                    <Button class ="modal-button" onClick={handleConfirm}>Confirm</Button>
                    <Button class ="modal-button" onClick={handleCancel}>Cancel</Button>
                </Box>
            </Modal>
        </div>)
}

export default HomeScreen;