import React, { useState } from "react";
import "./dashboard.css";
import logo from "../../assets/logo.png";
import Button from '@mui/material/Button';
import { Drawer, Tooltip } from "@mui/material";
import DrawerComponent from "../../components/QueryContainer";
import ImageArea from "../../components/ImageArea";
import jsPDF from 'jspdf';
import ClearModal from "../../components/ClearModal";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const notify = (e) => {
    toast.error(e, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
    });
}
const timeout = 600000; // 10 minutes in milliseconds

// Queue for managing requests
const requestQueue = [];
let isRequesting = false;


async function processQueue() {
    isRequesting = true;
  
    while (requestQueue.length > 0) {
      const { data, setGeneratedImages } = requestQueue.shift();
  
      try {
        const result = await query(data);
  
        // Set the generated image in the state
        setGeneratedImages((prevImages) => [...prevImages, URL.createObjectURL(result)].slice(-10));
  
        // notifySuccess('Image generated!!')
      } catch (error) {
        // console.error("Error fetching image:", error);
        notify('Failed to generate the Image', error);
      }
    }
  
    isRequesting = false;
  }

async function addToQueue(data, setGeneratedImages) {
    requestQueue.push({ data, setGeneratedImages });
  
    // If not currently processing requests, start processing the queue
    if (!isRequesting) {
      await processQueue();
    }
  }

async function query(data) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
        const response = await fetch(
            "https://xdwvg9no7pefghrn.us-east-1.aws.endpoints.huggingface.cloud",
            {
                headers: {
                    "Accept": "image/png",
                    "Authorization": "Bearer VknySbLLTUjbxXAXCjyfaFIPwUTCeRXbFSOjwRiCxsxFyhbnGjSFalPKrpvvDAaPVzWEevPljilLVDBiTzfIbWFdxOkYJxnOPoHhkkVGzAknaOulWggusSFewzpqsNWM",
                    "Content-Type": "application/json"
                },
                method: "POST",
                body: JSON.stringify(data),
                signal: controller.signal, // Pass the signal to the fetch call
            }
        );
        const result = await response.blob();
        return result;
    } catch (error) {
        if (error.name === 'AbortError') {
            console.log('Request timed out');
            throw new Error('Request timed out');
        } else {
            console.error("Error fetching image:", error);
            throw error;
        }
    } finally {
        clearTimeout(timeoutId); // Clear the timeout
    }
}



function Dashboard({ loading, setLoading }) {

    const notify = (e) => {
        toast.error(e, {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
        });
    }

    const notifySuccess = (e) => {
        toast.success(e, {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
        });
    }

    const [isDrawerOpen, setDrawerOpen] = useState(false);
    const [generatedImages, setGeneratedImages] = useState([]);
    const [inputText, setInputText] = useState('');

    const toggleDrawer = () => {
        setDrawerOpen(!isDrawerOpen);
    };

    const handleInputChange = (event) => {
        setInputText(event.target.value);
    };

    const handleSubmit = async () => {
        setLoading(true);
        toggleDrawer();
        try {
          await addToQueue({ "inputs": inputText }, setGeneratedImages);
        } finally {
          setLoading(false);
          // Optionally, you can clear the input field after submitting
          setInputText('');
      
          // Close the drawer
          toggleDrawer();
        }
      };

    const handleDeleteImage = (index) => {
        setGeneratedImages((prev) => {
            prev.splice(index, 1);
            return [...prev];
        });
    };

    const isAddButtonDisabled = generatedImages.length >= 10;

    const isClearButtonDisabled = generatedImages.length === 0;

    const generatePdf = () => {
        const pdf = new jsPDF('p', 'mm', [326, 131]);
        let xOffset = 1;
        let yOffset = 1;

        for (let i = 0; i < generatedImages.length; i++) {
            if (i % 2 === 0 && i !== 0) {
                yOffset += 65; // Adjust as needed
                xOffset = 1;
            }
            else if (i !== 0) {
                xOffset = 66;
            }

            const img = new Image();
            img.src = generatedImages[i];
            //console.log(generatedImages[i]);

            pdf.addImage(img, 'PNG', xOffset, yOffset, 64, 64);
            //xOffset += 100; // Adjust as needed
        }

        pdf.save('your_comic.pdf');
    };

    const [openClearModal, setOpenClearModal] = useState(false);
    const handleOpenClearModal = () => setOpenClearModal(true);
    const handleCloseClearModal = () => setOpenClearModal(false);

    const clearPanel = () => {
        setGeneratedImages([]);
        handleCloseClearModal();
    }

    return (
        <div className="mainPage">
            <ToastContainer />
            <nav className="navbar">
                {/* <img src={logo} alt="Logo" className="logo" /> */}
                <span className="name">Comic Creator</span>
            </nav>
            <div className="mainContent">
                <div className="options">
                    <Tooltip title={isAddButtonDisabled ? 'Maximum 10 images allowed' : ''}>
                        <span>
                            <Button variant="contained" onClick={toggleDrawer} disabled={isAddButtonDisabled} style={{ fontSize: '1vmax' }}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width="24" height="24" strokeWidth={1.5} stroke="currentColor" className="w-2 h-2" style={{ marginRight: '10px' }}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                </svg>
                                Add Comic
                            </Button>
                        </span>
                    </Tooltip>
                    <Button variant="outlined" color='error' onClick={handleOpenClearModal} disabled={isClearButtonDisabled} style={{ fontSize: '1vmax' }}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width="24" height="24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6" style={{ marginRight: '10px' }}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>
                        Clear Panel
                    </Button>
                    <Tooltip title={!isAddButtonDisabled ? 'Add atleast 10 images' : ''}>
                        <span>
                            <Button variant="contained" onClick={generatePdf} disabled={!isAddButtonDisabled} style={{ fontSize: '1vmax' }}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width="24" height="24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6" style={{ marginRight: '10px' }}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
                                </svg>
                                Share Panel
                            </Button>
                        </span>
                    </Tooltip>
                    <ClearModal open={openClearModal} handleClose={handleCloseClearModal} clearPanel={clearPanel} />
                </div>
            </div>
            <Drawer anchor="right" open={isDrawerOpen} onClose={toggleDrawer}>
                <DrawerComponent
                    handleInputChange={handleInputChange}
                    handleSubmit={handleSubmit}
                    inputText={inputText}
                    loading={loading}
                />
            </Drawer>
            <div className="imageArea">
                <ImageArea generatedImages={generatedImages} onDeleteImage={handleDeleteImage} />
            </div>
        </div>
    )
}

export default Dashboard;