import React, { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
import axios from "axios"
import Stack from '@mui/material/Stack';
import Navbar from './Navbar';
import moment from 'moment';
import { Transition } from 'react-transition-group';
import Button from '@mui/joy/Button';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import Typography from '@mui/joy/Typography';
import { ToastContainer, toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import { CSVLink } from "react-csv";
import Chip from '@mui/joy/Chip';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import HowToRegIcon from '@mui/icons-material/HowToReg';


const Roles = () => {
    const { id } = useParams();
    const maxLength = 26;
    const { projectName } = useParams();
    const { project_id, role_id } = useParams();
    const [report1, setreport1] = useState([]);
    const [copen, setcOpen] = React.useState(false);
    const navigate = useNavigate();
    const [allmemberstatus1, setallmemberstatus1] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [passengersCount, setPassengersCount] = useState(0);
    const [controller, setController] = useState({
        page: 0,
        rowsPerPage: 5
    });

    const [open, setOpen] = React.useState(false);
    const [userData, setuserData] = useState([])
    const [role, setRole] = useState([])
    const [data, setData] = useState({});
    const [addrole, setaddrole] = useState({
        role_name: ""
    })

    let name, value
    const handleInput = (e) => {
        name = e.target.name
        value = e.target.value
        setaddrole({ ...addrole, [name]: value })
    }



    //  download report --------------------------------------------------------------------------

    const todownloadreportone = async () => {
        try {
            const res = await fetch(`/downloadreport1/${id}`, {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                },
                credentials: "include"
            });

            const result = await res.json();

            setreport1(result);
            console.log(result, "------------");

            if (!result || Object.keys(result).length === 0) {
                window.alert("No data is present.");
            }
        } catch (error) {
            console.log(error);
        }
    };
    const date = new Date();

    const today = new Date();
    const yyyy = today.getFullYear();
    let mm = today.getMonth() + 1; // Months start at 0!
    let dd = today.getDate();

    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;

    const formattedToday = dd + '-' + mm + '-' + yyyy;

    const getallmemberstatus1 = async () => {

        try {

            const res = await fetch(`/getstatusmember1/${formattedToday}/${project_id}`, {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                },
                credentials: "include"
            })

            const result = await res.json()
            setallmemberstatus1(result)

        } catch (error) {
            console.log(error);
        }
    }


    const [dateState, setDateState] = useState(new Date())
    const addmembersubmitt = async (e) => {
        e.preventDefault()

        const { role_name } = addrole

        const res = await fetch(`/addrole/${id}`, {

            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },

            body: JSON.stringify({ role_name })
        })

        const data = await res.json()



        if (res.status === 422 || !data) {
            toast.error("Please fill The Data Correctly", {
                position: "top-center",
                theme: "colored",

            })
        } else {
            toast.info("Role tagged successfully", {
                position: "top-right",
                theme: "colored"
            })
            setTimeout(() => callAboutPageone(), 500)
    
        }
    }









    const callAboutPageone = async () => {
        try {
            const res = await axios.get(`http://localhost:9000/getallroles/${id}`)
            setuserData(res.data)

        } catch (error) {
            console.log(error);
        }
    }


    useEffect(() => {
        callAboutPageone()
    }, [controller])

    useEffect(() => {
        todownloadreportone()
    }, [])

    return (
        <>
            <Navbar />
            <nav class="navbar navbar-expand-lg bg-body-tertiary">
                <div class="container-fluid">

                    <div class="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul style={{ marginRight: "4.5%" }} class="navbar-nav ms-auto mb-2 mb-lg-0">
                            <li class="nav-item">

                            <CSVLink className="download-report btn btn-primary mx-3  admin1" filename="attendance" data={report1} ><FileDownloadIcon /></CSVLink>

                            </li>


                        </ul>

                    </div>
                </div>
            </nav>
            <section id="hero" class="clearfix ">
                <div class="container ">
                    <div class="row" data-aos="fade-up">
                        <div class="col-lg-6  intro-info order-lg-first order-last" data-aos="zoom-in" data-aos-delay="100">
                            <h2>The currently tagged Roles in  <span>{projectName.slice(0, maxLength)}</span></h2>
                            <div className=''>
                                <div className='row'>
                                    <div className='col-sm-6   col-md-6 col-lg-7'>
                                        {/* <Button startDecorator={<Add />}>Add to cart</Button> */}
                                        <a onClick={() => setOpen(true)} style={{ textDecoration: "None" }} href="#about" class="btn-get-started scrollto">Add Roles</a>   
                                    </div>
                                    <div className='col-sm-8  col-md-8 col-lg-4'>
                                        {/* <Input
                                            
                                            endDecorator={<Button><SearchIcon/></Button>}
                                            sx={{
                                                "--Input-radius": "18px",
                                                "--Input-gap": "-50px"
                                            }}
                                        /> */}
                                    </div>
                                </div>

                            </div>
                        </div>

                        <div class="col-lg-6    intro-img order-lg-last order-first" data-aos="zoom-out" data-aos-delay="200">

                            <ol class="list-group list-group-numbered mt-5 shadow-lg">
                                {
                                    userData.map((item, i) => (
                                        <li class="list-group-item d-flex justify-content-between align-items-start">
                                            <div class="ms-2 me-auto">
                                                <NavLink to={`/contractor/${id}/${item.role_id}`} className="text-decoration-none"><div class="fw-bold">{item.role_name}</div></NavLink>
                                            </div>
                                        </li>


                                    ))}

                            </ol>
                        </div>
                    </div>

                </div>
            </section>


            <Transition in={open} timeout={400}>
                {(state) => (
                    <Modal
                        keepMounted
                        open={!['exited', 'exiting'].includes(state)}
                        onClose={() => setOpen(false)}
                        slotProps={{
                            backdrop: {
                                sx: {
                                    opacity: 0,
                                    backdropFilter: 'none',
                                    transition: `opacity 400ms, backdrop-filter 400ms`,
                                    ...{
                                        entering: { opacity: 1, backdropFilter: 'blur(8px)' },
                                        entered: { opacity: 1, backdropFilter: 'blur(8px)' },
                                    }[state],
                                },
                            },
                        }}
                        sx={{
                            visibility: state === 'exited' ? 'hidden' : 'visible',
                        }}
                    >
                        <ModalDialog
                            aria-labelledby="fade-modal-dialog-title"
                            aria-describedby="fade-modal-dialog-description"
                            sx={{
                                opacity: 0,
                                transition: `opacity 300ms`,
                                ...{
                                    entering: { opacity: 1 },
                                    entered: { opacity: 1 },
                                }[state],
                            }}
                        >
                            <Typography id="fade-modal-dialog-title" component="h2">

                            </Typography>
                            <Typography
                                id="fade-modal-dialog-description"
                                textColor="text.tertiary"
                            >
                                <form method='post'>
                                    <div class="mb-3">
                                        <input type="text"
                                            class="form-control mt-5"
                                            id="exampleInputEmail1"
                                            aria-describedby="emailHelp"
                                            name='role_name'
                                            value={addrole.role_name}
                                            onChange={handleInput}
                                        />
                                        <div id="emailHelp" class="form-text"> Enter Roles to your current project</div>
                                    </div>
                                    <button onClick={(e) => addmembersubmitt(e)} type="submit" class="btn btn-dark tetxt-white">Submit</button>
                                </form>
                            </Typography>
                        </ModalDialog>
                    </Modal>
                )}
            </Transition>
        </>
    )
}

export default Roles