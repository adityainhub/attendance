import React, { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
import axios from "axios"
import Stack from '@mui/material/Stack';
import Navbar from './Navbar';
import { Transition } from 'react-transition-group';
import Button from '@mui/joy/Button';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import Typography from '@mui/joy/Typography';
import { ToastContainer, toast } from 'react-toastify';
import {
    Card,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    TablePagination
} from '@mui/material';


import ModalClose from '@mui/joy/ModalClose';
import Sheet from '@mui/joy/Sheet';

const AdminDash = () => {

    const [copen, setcOpen] = React.useState(false);
    const navigate = useNavigate()
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
    const [addmember, setaddmember] = useState({
        projectName: ""
    })

    let name, value
    const handleInput = (e) => {
        name = e.target.name
        value = e.target.value
        setaddmember({ ...addmember, [name]: value })
    }

        //roles fetch
        const getallroles = async () => {
            try {
                const res = await axios.get(`http://localhost:9000/getallroles`)
                setRole(res.data)
    
            } catch (error) {
                console.log(error);
            }
        }


    // fetching data using axios------
    const callAboutPageone = async () => {
        try {
            const res = await axios.get(`http://localhost:9000/alldata`)
            setuserData(res.data)

        } catch (error) {
            console.log(error);
        }
    }







    const callAboutPage = async () => {
        try {

            const res = await fetch(`/alldata?_start=0&_end=4`, {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                },
                credentials: "include"
            })

            const data = await res.json()
            setuserData(data)
            setPassengersCount(data.totalPassengers);




            if (!res.status === 200) {
                const error = new Error(res.error)
                throw error
            }

        } catch (error) {
            console.log(error);

        }
    }

    // function handleButtonClick(id) {
    //     fetch(`/api/get-data/${id}`)
    //         .then(response => response.json())
    //         .then(dat => {
    //             setData(dat);
    //             console.log(data);
    //         });
    // }


    const addmembersubmitt = async (e) => {
        e.preventDefault()

        const { projectName } = addmember


        const res = await fetch(`/addproject`, {

            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },

            body: JSON.stringify({ projectName })
        })

        const data = await res.json()



        if (res.status === 422 || !data) {
            toast.error("Please fill The Data Correctly", {
                position: "top-center",
                theme: "colored",

            })
        } else {
            toast.info("Project added successfully", {
                position: "top-right",
                theme: "colored"
            })
            setTimeout(() => callAboutPage(), 500)
        }
    }

    const handlePageChange = (event, newPage) => {
        setController({
            ...controller,
            page: newPage
        });
    };

    const handleChangeRowsPerPage = (event) => {
        setController({
            ...controller,
            rowsPerPage: parseInt(event.target.value, 10),
            page: 0
        });
    };

    useEffect(() => {
        callAboutPageone()
    }, [controller])



    return (
        <>
            <Navbar />


            <section id="hero" class="clearfix ">
                <div class="container ">
                    <div class="row" data-aos="fade-up">
                        <div class="col-lg-6  intro-info order-lg-first order-last" data-aos="zoom-in" data-aos-delay="100">
                            <h2>Currently Ongoing<br />Projects in <span>NexusNova</span></h2>
                            <div className=''>
                                <div className='row'>
                                    <div className='col-sm-3  col-md-3 col-lg-4'>
                                        {/* <Button startDecorator={<Add />}>Add to cart</Button> */}
                                        <a onClick={() => setOpen(true)} style={{ textDecoration: "None" }} href="#about" class="btn-get-started scrollto">Add Project</a>
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
                                                <NavLink to = {`/roles/${item.project_id}/${item.projectName}`}  onClick={() => setcOpen(true)} className="text-decoration-none"><div class="fw-bold">{item.projectName}</div></NavLink>
                                            </div>
                                        </li>


                                    ))}

                            </ol>
                        </div>
                    </div>

                </div>
            </section>



            {/* to={`/contractor/${item.project_id}`} */}




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
                                            name='projectName'
                                            value={addmember.projectName}
                                            onChange={handleInput}
                                        />
                                        <div id="emailHelp" class="form-text"> Enter Your New Project Name here</div>
                                    </div>
                                    <button onClick={(e) => addmembersubmitt(e)} type="submit" class="btn btn-dark tetxt-white">Submit</button>
                                </form>
                            </Typography>
                        </ModalDialog>
                    </Modal>
                )}
            </Transition>




            <Modal
                aria-labelledby="modal-title"
                aria-describedby="modal-desc"
                open={copen}
                onClose={() => setcOpen(false)}
                sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
            >
                <Sheet
                    variant="outlined"
                    sx={{
                        maxWidth: 500,
                        borderRadius: 'md',
                        p: 3,
                        boxShadow: 'lg',
                    }}
                >
                    <ModalClose
                        variant="outlined"
                        sx={{
                            top: 'calc(-1/4 * var(--IconButton-size))',
                            right: 'calc(-1/4 * var(--IconButton-size))',
                            boxShadow: '0 2px 12px 0 rgba(0 0 0 / 0.2)',
                            borderRadius: '50%',
                            bgcolor: 'background.body',
                        }}
                    />
                    <Typography
                        component="h2"
                        id="modal-title"
                        level="h4"
                        textColor="inherit"
                        fontWeight="lg"
                        mb={1}
                    >
                        The Roles Tagged to a project
                    </Typography>
                    <Typography id="modal-desc" textColor="text.tertiary">
                        <div class="col-lg-12    intro-img order-lg-last order-first" data-aos="zoom-out" data-aos-delay="200">

                            <ol class="list-group list-group-numbered mt-5 shadow-lg">
                                {
                                    userData.map((item, i) => (
                                        <li class="list-group-item d-flex justify-content-between align-items-start">
                                            <div class="ms-2 me-auto">
                                                <NavLink  className="text-decoration-none"><div class="fw-bold">{item.projectName}</div></NavLink>
                                            </div>
                                        </li>


                                    ))}

                            </ol>
                        </div>
                    </Typography>
                </Sheet>
            </Modal>

        </>
    )
}

export default AdminDash
