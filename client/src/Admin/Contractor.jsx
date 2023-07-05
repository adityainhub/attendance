import React, { useEffect, useState, useRef } from 'react'
import { NavLink, useParams } from 'react-router-dom'
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css';
import moment from 'moment'; 
import { CSVLink } from "react-csv";
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import ModeEditOutlineSharpIcon from '@mui/icons-material/ModeEditOutlineSharp';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import DownloadIcon from '@mui/icons-material/Download';
import Chip from '@mui/joy/Chip';
import withAuth from "./withAuth";
import Tooltip from '@mui/joy/Tooltip';
import Button from '@mui/joy/Button';
import Footer from './Footer';
import Modal from '@mui/joy/Modal';
import Sheet from '@mui/joy/Sheet';
import ModalClose from '@mui/joy/ModalClose';
import CreditScoreIcon from '@mui/icons-material/CreditScore';
import ModalDialog from '@mui/joy/ModalDialog';
import Typography from '@mui/joy/Typography';
import { Transition } from 'react-transition-group';
import PanToolAltIcon from '@mui/icons-material/PanToolAlt';







const Contractor = () => {

    const [rahopen, setrahOpen] = React.useState(false);
    const maxLength = 25;
    const [topRightModal, setTopRightModal] = useState(false);
    const { project_id, role_id } = useParams();
    const toggleShow = () => setTopRightModal(!topRightModal);
    const buttonRef = useRef(null);
    const [showComponent, setShowComponent] = useState(true);
    const [statusmember, setstatusmember] = useState([])
    const [selectedOption, setSelectedOption] = useState('');
    const [selectedOptiontimein, setselectedOptiontimein] = useState('');
    const [selectedOptiontimeout, setselectedOptiontimeout] = useState('');
    const [store, setstore] = useState([])
    const [getabsentdays, setgetabsentdays] = useState()
    const [allmemberstatus, setallmemberstatus] = useState([])
    const [countabsent, setcountabsent] = useState([])
    const [rolename, setrolename] = useState([])
    const [countshifts, setcountshifts] = useState([])
    const [cisOpen, setcIsOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [user, setUser] = useState({
        Time_In: "",
        Time_out: ""

    })
    const [open, setOpen] = React.useState('');
    const [copen, setcOpen] = React.useState(false);
    let nameone, valueone
    const handleInputone = (e) => {
        nameone = e.target.name
        valueone = e.target.value
        setUser({ ...user, [nameone]: valueone })
    }


    const handleDateClick = (date) => {
        setSelectedDate(date);
        setcIsOpen(true);
    };

    const handleModalClose = () => {
        setcIsOpen(false);
    };

    const date = new Date();

    const today = new Date();
    const yyyy = today.getFullYear();
    let mm = today.getMonth() + 1; // Months start at 0!
    let dd = today.getDate();

    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;

    const formattedToday = dd + '-' + mm + '-' + yyyy;

    const [ide, text] = selectedOption.split(',');

    const handleClick = () => {
        setShowComponent(true);
    }
    //=============================================================
    const storememberid = async (e, PM_id) => {

        e.preventDefault()
        try {

            const res = await fetch(`/fetchfuncforpmid/${PM_id}`, {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                },
                credentials: "include"
            })

            const data = await res.json()
            setstore(data)




        } catch (error) {
            console.log(error);
        }

    }
    //===================================================================
    function handleSelectChange(event) {
        setSelectedOption(event.target.value);
    }

    const handleSelectChangetimein = (event) => {
        setselectedOptiontimein(event.target.value)
    }

    const handleSelectChangetimeout = (event) => {
        setselectedOptiontimeout(event.target.value)
    }

    const [Timeinout, setTimeinout] = useState([])
    const [dateState, setDateState] = useState(new Date())
    const [show, setShow] = useState(false)
    const attdates = moment(dateState).format('DD/MM/YYYY')
    const handleClose = () => setShow(false)
    const handleShow = () => setShow(true)

    const changeDate = (e) => {
        setDateState(e)
        handleShow()
    }

    
    const navigate = useNavigate()
    const { id } = useParams();
    const [report, setreport] = useState([]);
    const [statusvalue, setstatusvalue] = useState();
    const [smember, setMember] = useState([])
    const [contarctor, setcontarctor] = useState([])
    const [modaldata, setmodaldata] = useState([])
    const [isVisible, setIsVisible] = useState(false);
    const [isattVisible, setIsattVisible] = useState(false);
    const color = contarctor[0]?.attstatus === "present" ? 'green' : (contarctor[0]?.attstatus === "absent" ? 'red' : 'none');
    const styles = { backgroundColor: color };
    const [hello, sethello] = useState([]);
    const [addmember, setaddmember] = useState({
        member: ""
    })




    const hellorah = () => {
        console.log("dddd");
    }

    //---------------i--

    const tomakeclick = () => {
        buttonRef.current.click();
    };


    //==========================================================================================
    const markpresentabsent = async (e, PM_id, attdate) => {
        e.preventDefault()

        const timein = selectedOptiontimein
        const timeout = selectedOptiontimeout
        const attstatus = text
        const attvalue = ide

        console.log(PM_id, id, attdate, timein, timeout, attstatus, attvalue);

        const res = await fetch(`/addmembers/${PM_id}/${attdate}/${id}`, {


            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },

            body: JSON.stringify({ timein, timeout, attstatus, attvalue })

        })

        const data = await res.json()



        if (res.status === 422 || !data) {
            toast.error("Please fill The Data Correctly", {
                position: "top-center",
                theme: "colored",

            })
            console.log(timein, timeout, attstatus, attvalue);
        } else {
            toast.info("Employee marked successfully", {
                position: "top-right",
                theme: "colored"
            })
            setTimeout(() => tofetchallmember(), 500)
            window.location.reload();
        }
    }

    //==========================================================================================


    //to check the status of an employee========================================================
    const validatethedata = async (e, PM_id, attdate) => {


        try {

            const res = await fetch(`/tovalidatethemember/${PM_id}/${attdate}`, {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                },
                credentials: "include"
            })

            const data = await res.json()
            sethello(data)



        } catch (error) {
            console.log(error);
        }
    }






    //==========================================================================================
    const makeabsentradio = async (PM_id, attdate) => {
        const confirmation = window.confirm("Are you sure you want to make change?");
        if (!confirmation) return;

        const formattedDate = attdate.split("/").join("-");
        try {
            const res = await fetch(`/changestatus/${PM_id}/${formattedDate}`, {
                method: "PUT",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                },
                credentials: "include"
            });

            const result = await res.json();
            if (res.status === 404 || !result) {
                toast.error("Please fill----- The Data Correctly", {
                    position: "top-center",
                    theme: "colored"
                });
            } else {
                setTimeout(() => tomakeclick(), 500);
            }
        } catch (error) {
            console.log(error);
        }
    };
    //==========================================================================================




    //==========================================================================================
    const getmemberidatte = async (e, PM_id, project_id) => {
        e.preventDefault()

        const proj_id = project_id
        const attdate = attdates
        const attstatus = e.target.getAttribute('data-value1')
        const attvalue = e.target.getAttribute('data-value2')

        const res = await fetch(`/addatte/${PM_id}`, {

            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },

            body: JSON.stringify({ proj_id, attdate, attstatus, attvalue })
        })

        const mdata = await res.json()


        if (res.status === 422 || !mdata) {
            toast.error("Please fill The Data Correctly", {
                position: "top-center",
                theme: "colored",


            })
        } else {
            toast.info("Marked present", {
                position: "top-left",
                theme: "colored"
            })
            setTimeout(() => tofetchallmember(), 500)
        }

    }
    //==========================================================================================


    // Time in and time out===================================================================
    const getTimeOut = async (e, PM_id) => {
        // console.log(PM_id);
        try {

            const res = await fetch(`/getmemberdetail/${PM_id}`, {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                },
                credentials: "include"
            })

            const dataone = await res.json()
            setTimeinout(dataone)



        } catch (error) {
            console.log(error);
        }
    }
    //==========================================================================================


    //==========================================================================================
    const tomakeabsent = async (e, PM_id, project_id) => {
        e.preventDefault()

        const proj_id = project_id
        const attdate = attdates
        const attstatus = e.target.getAttribute('data-value1')
        const attvalue = e.target.getAttribute('data-value2')



        const res = await fetch(`/addatte/${PM_id}`, {

            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },

            body: JSON.stringify({ proj_id, attdate, attstatus, attvalue })
        })

        const mdata = await res.json()


        if (res.status === 422 || !mdata) {
            toast.error("Please fill The Data Correctly", {
                position: "top-center",
                theme: "colored",


            })
        } else {
            toast.warning("marked Absent", {
                position: "top-right",
                theme: "colored"
            })
            setTimeout(() => tofetchallmember(), 500)
        }

    }
    //==========================================================================================




    let name, value
    const handleInput = (e) => {
        name = e.target.name
        value = e.target.value
        setaddmember({ ...addmember, [name]: value })
    }


    //add member using form==========================================================
    const addmembersubmitt = async (e) => {
        e.preventDefault()
        
        const { member } = addmember

        const res = await fetch(`/addmembers/${project_id}/${role_id}`, {

            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },

            body: JSON.stringify({ member })
        })

        const data = await res.json()



        if (res.status === 422 || !data) {
            toast.error("Please fill The Data Correctly", {
                position: "top-center",
                theme: "colored",


            })
        } else {
            toast.info("Member added successfully", {
                position: "top-right",
                theme: "colored"
            })
            setTimeout(() => tofetchallmember(), 500)
        }
    }




    //add member using form==========================================================
    const markpresentabsentone = async (e, PM_id, attdate) => {
        e.preventDefault()
        const { Time_In, Time_out } = user
        const attstatus = text
        const attvalue = ide




        const res = await fetch(`/insertstatus/${PM_id}/${attdate}/${project_id}`, {

            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },

            body: JSON.stringify({ Time_In, Time_out, attstatus, attvalue })
        })

        const data = await res.json()
        setUser(data)




        if (res.status === 422 || !data) {
            toast.error("Please fill The Data Correctly", {
                position: "top-center",
                theme: "colored",


            })
        } else {
            toast.info("Member added successfully", {
                position: "top-right",
                theme: "colored"
            })
            // setTimeout(() => tofetchallmember(), 500)
            window.location.reload();
        }
    }
    //==========================================================================================





    const samplerun = (e) => {

        console.log(e.target.getAttribute('data-value1'));
    }


    //insert present absent and time_in and time_out------------------------------------------------



    //Fetch all the members using using useEffetct----------------------------------------------
    const tofetchallmember = async () => {
        try {
            const res = await fetch(`/getmembers/${project_id}/${role_id}`, {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                },
                credentials: "include"
            });

            const data = await res.json();
            console.log(data);
            setMember(data);

            if (!data || data.length === 0) {
                alert("no member is there")
            }
        } catch (error) {
            console.log(error);
        }
    };



    //function to get the member id --------------------------------------------------
    const getmemberid = async (PM_id) => {

        try {

            const res = await fetch(`/getattendance/${PM_id}`, {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                },
                credentials: "include"
            })

            const result = await res.json()
            setcontarctor(result)




        } catch (error) {
            console.log(error);
        }
    }



    //get atte_id from modal --------------------------------------------------------------

    const modalClick = async (PM_id) => {


        try {

            const res = await fetch(`/modalclick/${PM_id}`, {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                },
                credentials: "include"
            })

            const result = await res.json()
            setcountabsent(result)


        } catch (error) {
            console.log(error);
        }
    }


    const totalshifts = async (PM_id) => {


        try {

            const res = await fetch(`/gettotalshifts/${PM_id}`, {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                },
                credentials: "include"
            })

            const result = await res.json()
            setcountshifts(result)



        } catch (error) {
            console.log(error);
        }
    }




    //useeffect function------------------------------



    const todownloadreport = async () => {
        try {
            const res = await fetch(`/downloadreport/${project_id}/${role_id}`, {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                },
                credentials: "include"
            });

            const result = await res.json();
            
            setreport(result);
            console.log(result);

            if (!result || Object.keys(result).length === 0) {
                window.alert("No data is present.");
            }
        } catch (error) {
            console.log(error);
        }
    };


    //absentdays
    const absentdays = async (PM_id) => {
        try {

            const res = await fetch(`/getabsentdays/${PM_id}`, {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                },
                credentials: "include"
            })

            const result = await res.json()
            setgetabsentdays(result)





        } catch (error) {
            console.log(error);
        }
    }


    //markallpresent===============================================
    const markallpresent = async (e) => {
        e.preventDefault()

        const confirmation = window.confirm("Are you sure you want to mark all members present?")

        if (confirmation) {
            try {
                console.log("ggggg");
                const controller = new AbortController()
                const timeout = setTimeout(() => controller.abort(), 1000) // timeout after 10 seconds

                const res = await fetch(`/markallpresent/${role_id}/${project_id}/${formattedToday}`, {
                    signal: controller.signal,
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },

                    body: JSON.stringify({ role_id, project_id, formattedToday })
                })

                const data = await res.json()

                if (res.status === 422 || !data) {
                    toast.error("An error occurred while marking all members present. Please try again later.", {
                        position: "top-center",
                        theme: "colored",
                    })
                } else {
                    toast.success("All members are marked present", {
                        position: "top-center",
                        theme: "colored"
                    })
                    setTimeout(() => tofetchallmember(), 500)
                }
            } catch (err) {
                toast.error("All members are already Marked Present", {
                    position: "top-center",
                    theme: "colored",
                })
                console.error(err)
            }
        }
    }



    //===============================================================

    const getallmemberstatus = async () => {

        try {

            const res = await fetch(`/getstatusmember/${formattedToday}/${project_id}/${role_id}`, {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                },
                credentials: "include"
            })

            const result = await res.json()
            setallmemberstatus(result)

        } catch (error) {
            console.log(error);
        }
    }


    //getrolename
    const getrolename = async () => {

        try {

            const res = await fetch(`/getrolename/${role_id}`, {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                },
                credentials: "include"
            })

            const result1 = await res.json()
            console.log(result1);
            setrolename(result1)

        } catch (error) {
            console.log(error);
        }
    }





    useEffect(() => {
        todownloadreport()
    }, [])

    useEffect(() => {
        setShowComponent(false);
    }, []);

    useEffect(() => {
        tofetchallmember()
    }, [])

    useEffect(() => {
        getallmemberstatus()
    }, [])

    useEffect(() => {
        getrolename()
    }, [])



    return (
        <div style={{ backdropFilter: "blur(8px)" }} className='contractor-body'>

            <Navbar />
            {/* ---------------------------------------------admin navbar------------------------------------- */}
            <nav class="navbar admin-nav navbar-expand-lg bg-body-tertiary admin1 ">
                {/* /* data-bs-theme="primary" */}
                <div class="container-fluid">
                    <Chip style={{ marginRight: "5%" }}
                        className="bg-light text-primary "
                        color="neutral"
                        disabled={false}
                        size="md"
                        label="primary"
                        variant="outlined"
                        fontWeight="bold"
                    ><label className='admin1'>Contractor List of {smember[0]?.projectName.slice(0, maxLength)}   </label></Chip>
                    <Button
                        color="neutral"
                        onClick={markallpresent}
                        size="sm"

                        startDecorator={< CreditScoreIcon />}
                        style={{ backgroundColor: "white", color: "black", marginLeft: "-4.5%" }}
                    >Mark All </Button>

                    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span class="navbar-toggler-icon"></span>
                    </button>
                    <div class="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul style={{ marginRight: "5%" }} class="navbar-nav ms-auto mb-2 mb-lg-0">
                            <li class="nav-item">
                                <Tooltip title="Current Status of a day" variant="solid">
                                    <NavLink onClick={() => { getallmemberstatus(); setOpen('center') }} type='button'
                                        className="text-primary admin1 btn btn-outline-light me-3 mb-1">Today's Status</NavLink>
                                </Tooltip>

                            </li>
                            <li class="nav-item">
                                <Tooltip title="Open Calendar and take attendance" variant="solid">
                                    <NavLink type="button" onClick={() => { setIsattVisible(!isattVisible) }} className=" calendar-emp btn btn-outline-light text-primary admin1 "><CalendarMonthIcon /></NavLink>
                                </Tooltip>

                            </li>
                            <li class="nav-item">

                                <CSVLink className="download-report btn btn-light mx-3 text-primary admin1" filename={`${rolename[0]?.role_name}.csv`} data={report} ><DownloadIcon /></CSVLink>


                            </li>
                            <li class="nav-item">
                                <Tooltip title="Add contractor" variant="solid">
                                    <NavLink onClick={() => { setIsVisible(!isVisible) }} type='button'
                                        className=" add-emp btn btn-outline-light text-primary admin1"><GroupAddIcon /></NavLink>
                                </Tooltip>

                            </li>

                        </ul>

                    </div>
                </div>
            </nav>
            {/* <nav data-bs-theme="dark" class="navbar navbar-expand-lg bg-dark  bg-body-tertiary">
                <div class="container-fluid">
                    <a class="navbar-brand" href="#">Contracter List of <lablel class="text-warning">[</lablel> {smember[0]?.projectName} <lablel class="text-warning">]</lablel></a>
                    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span class="navbar-toggler-icon"></span>
                    </button>
                    <div class="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul style={{ marginLeft: "69%" }} class="navbar-nav  mb-2 mb-lg-0">
                            <li class="nav-item">
                                <NavLink data-bs-toggle="modal" data-bs-target="#exampleModalone" onClick={() => { getallmemberstatus() }} type='button'
                                    className="btn btn-outline-light me-3 mt-1">Today's Status</NavLink>
                            </li>

                            <li class="nav-item">
                                <NavLink type="button" onClick={() => { setIsattVisible(!isattVisible) }} className="btn btn-outline-light "><i style={{ fontSize: "20px" }} class="bi bi-calendar-date-fill"></i></NavLink>
                            </li>
                            <li class="nav-item">

                                <CSVLink className="btn btn-light mx-3" filename={"Attendance-Report.csv"} data={report} ><i style={{ textDecoration: "none", fontSize: "130%" }} class="bi bi-download"></i></CSVLink>
                            </li>

                            <li class="nav-item">
                                <NavLink onClick={() => { setIsVisible(!isVisible) }} type='button'
                                    className="btn btn-outline-light"><i style={{ fontSize: "130%" }} class="bi bi-person-plus-fill fa-8x"></i></NavLink>
                            </li>


                        </ul>

                    </div>
                </div>
            </nav> */}



            {/* get status modal============================================= */}
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
                                Get All Contractor Status for  <Chip className=" text-center"
                                    color="neutral"
                                    disabled={false}

                                    size="lg"
                                    variant="solid"

                                >{moment(dateState).format('DD-MM-YYYY')}</Chip>
                            </Typography>
                            <Typography
                                id="fade-modal-dialog-description"
                                textColor="text.tertiary"
                            >
                                {
                                    allmemberstatus.length > 0 ? (
                                        <div class="modal-body">
                                            <table class="table">
                                                <thead>
                                                    <tr>
                                                        <th scope="col"></th>
                                                        <th scope="col">Member Name</th>
                                                        <th scope="col">Status</th>
                                                        <th scope='col'>Time In</th>

                                                    </tr>
                                                </thead>
                                                <tbody>

                                                    {
                                                        allmemberstatus && allmemberstatus.map((item, i) => (
                                                            <tr>
                                                                <th scope="row">{i + 1}</th>
                                                                <td style={{ color: "#f57842" }} className='fw-bold'>{item.member}</td>
                                                                <td className='fw-bold bg-white'><Button size='sm' style={{ backgroundColor: item.attstatus === "Present" ? 'green' : 'red' }} onClick={function () { }} >{item.attstatus}</Button> </td>
                                                                <td style={{ color: "#f57842" }} className='fw-bold'>{item.Time_In}</td>
                                                            </tr>
                                                        ))
                                                    }

                                                </tbody>
                                            </table>
                                        </div>
                                    ) : (
                                        <h2 className='p-5'>Please Take attendance</h2>
                                    )
                                }
                            </Typography>
                        </ModalDialog>
                    </Modal>
                )}
            </Transition>

            <div className='container  mt-5'>
                <div className='row'>

                    <div className='col-sm-4 col-md-4 col-lg-4'>
                        <div class="row align-items-md-stretch ">
                            <button className='btn btn-dark text-light mb-3'>Attendance report <label className='text-warning'>[</label> {contarctor[0]?.member} <label className='text-warning'>   ]</label></button>

                            <div class="h-100 p-5 text-bg-light rounded-3 ">




                                {smember.length > 0 ? (
                                    <ol class="list-group list-group-numbered">
                                        {smember.map((item, i) => (
                                            <li class="list-group-item d-flex justify-content-between align-items-start">
                                                <div class="ms-2 me-auto">
                                                    <NavLink
                                                        ref={buttonRef}
                                                        onClick={() => {
                                                            absentdays(item.PM_id);
                                                            handleClick();
                                                            getmemberid(item.PM_id);
                                                        }}
                                                        className="text-decoration-none"
                                                    >
                                                        <div class="fw-bold">{item.member}</div>
                                                    </NavLink>
                                                </div>

                                               

                                                <i
                                                    onClick={() => {
                                                        totalshifts(item.PM_id);
                                                        modalClick(item.PM_id);
                                                        setrahOpen(true);
                                                    }}

                                                    class="bi bi-pencil-square"
                                                ></i>
                                            </li>
                                        ))}
                                    </ol>
                                ) : (
                                    <label className='text-bold text-danger'>No Member is Added</label>
                                )}


                                {isVisible &&
                                    <form method='post'>
                                        <div class="mb-3">
                                            <input type="text"
                                                class="form-control mt-5"
                                                id="exampleInputEmail1"
                                                aria-describedby="emailHelp"
                                                name='member'
                                                
                                                value={addmember.cpassword}
                                                onChange={handleInput}
                                            />
                                            <div id="emailHelp" class="form-text">Add the member name .</div>
                                        </div>
                                        <Button type='submit' className='bg-dark' color="neutral" onClick={(e) => addmembersubmitt(e)} >Submit</Button>

                                    </form>
                                }



                            </div>
                        </div>












                    </div>





                    <div className='col-sm-8 col-md-8 col-lg-8 '>
                        <div className='row'>
                            <div className='col-sm-4 col-md-4 col-lg-4 '>








                                <table style={{ width: "100%" }} class="table table-striped table-bordered">
                                    {showComponent && <thead className='table-dark'>
                                        <tr>
                                            <th scope="col"></th>
                                            <th scope="col">Date</th>
                                            <th scope="col">Status</th>
                                            <th scope="col">Edit</th>
                                            <th scope="col">TimeIn</th>
                                            <th scope="col">Timeout</th>
                                        </tr>
                                    </thead>}

                                    <tbody>

                                        {
                                            contarctor?.map((item, i) => {
                                                return (
                                                    <tr>
                                                        <th className='fw-bold bg-white'>{i + 1}</th>
                                                        <th scope="row" className='fw-bold bg-white' ><span class="badge badge-primary text-dark">{item.attdate}</span></th>
                                                        <td className='fw-bold bg-white'><Button size='sm' style={{ backgroundColor: item.attstatus === "Present" ? 'green' : 'red' }} onClick={function () { }} >{item.attstatus}</Button> </td>

                                                        <td className='fw-bold bg-white'><button onClick={(e) => makeabsentradio(item.PM_id, item.attdate)} className='btn-sm btn btn-secondary'><ModeEditOutlineSharpIcon style={{ fontSize: "20px" }} /> </button></td>
                                                        <td className='fw-bold bg-white'>{item.Time_In} </td>
                                                        <td className='fw-bold bg-white'>{item.Time_out}</td>


                                                    </tr>
                                                )

                                            })
                                        }


                                    </tbody>
                                </table>
















                            </div>
                            <div className='col-sm-8 col-md-8 col-lg-8  '>
                                {/* take attendance --------------------------------------------------------------- */}
                                {
                                    isattVisible &&



                                    <div style={{ marginLeft: "35%" }} className='col-sm-8 col-md-8 col-lg-8'>

                                        <div class="card border-success mb-3 shadow" style={{ maxWidth: "28rem" }}>
                                            <div class="card-header bg-transparent bg-dark border-success">
                                                <div class="d-grid gap-2">
                                                    <Chip className="bg-dark text-center"
                                                        color="danger"
                                                        disabled={false}

                                                        size="lg"
                                                        variant="solid"

                                                    ><CalendarMonthIcon /> Calendar</Chip>
                                                    {/* <button class="btn btn-dark" type="button">Calendar <i class="bi bi-calendar-month-fill"></i></button> */}

                                                </div>
                                            </div>
                                            <div class="card-body text-success">
                                                <div class="d-grid gap-2">


                                                </div>
                                                <Calendar
                                                    className='calendar'
                                                    value={dateState}
                                                    onChange={changeDate}
                                                    onClickDay={handleDateClick}
                                                />
                                            </div>

                                        </div>


                                    </div>

                                }


                                {/* CALENDARR OPEN MODALLL--- */}

                                <Modal open={cisOpen} onClose={handleModalClose}
                                    aria-labelledby="modal-title"
                                    aria-describedby="modal-desc"

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

                                        </Typography>
                                        <Typography id="modal-desc" textColor="text.tertiary">
                                            <div className='container'>
                                                <div className='row'>
                                                    <div className='col-sm-12 col-md-12 col-lg-12'>
                                                        <Chip style={{ marginRight: "5%" }}
                                                            className="bg-dark text-light ms-5 "
                                                            color="neutral"
                                                            disabled={false}
                                                            size="lg"
                                                            variant="solid"
                                                        >Take Attendance as of <label className='text-warning'>[</label> {moment(dateState).format('DD-MM-YYYY')} <label className='text-warning'>]</label> </Chip>
                                                        {/* <Button 
                        color="neutral"
                        onClick={markallpresent}
                        size="sm"
                       
                        startDecorator={< CreditScoreIcon />}
                        style={{backgroundColor:"white",color:"black",marginLeft:"7.5%"}}
                    >Mark All </Button> */}
                                                    </div>

                                                    <div className='col-sm-12 col-md-12 col-lg-12'>
                                                        {smember.length > 0 && (

                                                            <ol class="list-group list-group-numbered mt-4 ">

                                                                {
                                                                    smember.map((item, i) => (

                                                                        <li class="list-group-item d-flex justify-content-between align-items-start">
                                                                            <div class="ms-2 me-auto">

                                                                                <NavLink onClick={() => { getmemberid(item.PM_id) }} className="text-decoration-none"><div class="fw-bold">{item.member}</div></NavLink>


                                                                            </div>

                                                                            <button onClick={(e) => { storememberid(e, item.PM_id); validatethedata(e, item.PM_id, moment(dateState).format('DD-MM-YYYY')); getTimeOut(e, item.PM_id); }} data-bs-toggle="offcanvas" href="#offcanvasExample" className='btn btn-warning ms-3 '><i class="bi bi-clock-history "></i></button>

                                                                            {/* -------------------------------------------------- */}

                                                                            <div class="offcanvas offcanvas-start" tabindex="-1" id="offcanvasExample" aria-labelledby="offcanvasExampleLabel">
                                                                                <div class="offcanvas-header">



                                                                                    {hello.length > 0 ? (
                                                                                        // Render this if hello has elements
                                                                                        <button class="btn btn-success" type="button">Current Status for [ {Timeinout[0]?.member} ]</button>
                                                                                    ) : (
                                                                                        // Render this if hello is empty
                                                                                        <h5 class="offcanvas-title" id="offcanvasExampleLabel">Mark status for
                                                                                            <button type="submit" class="btn btn-secondary position-relative ms-3">
                                                                                                <i class="bi bi-card-checklist fs-5"></i> {store[0]?.member}
                                                                                                <span class="position-absolute top-0 start-100 translate-middle p-2 bg-danger border border-light rounded-circle">
                                                                                                    <span class="visually-hidden">New alerts</span>
                                                                                                </span>
                                                                                            </button>


                                                                                        </h5>


                                                                                    )}


                                                                                    <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                                                                                </div>
                                                                                <div class="offcanvas-body">
                                                                                    <div>


                                                                                        {hello.length > 0 ? (
                                                                                            // Render this if hello has elements
                                                                                            <ul class="list-group">

                                                                                                <li class="list-group-item text-danger fw-bold"> <i class="bi bi-clock-fill"></i> Time_In : <label className='text-dark fw-bold'>{hello[0]?.Time_In}</label> </li>
                                                                                                <li class="list-group-item text-danger fw-bold"><i class="bi bi-clock-history"></i> Time_Out : <label className='text-dark fw-bold'>{hello[0]?.Time_out}</label>  </li>
                                                                                                <li class="list-group-item text-danger fw-bold"> <i class="bi bi-check-square-fill"></i> Status : <label className='text-dark fw-bold'>{hello[0]?.attstatus}</label>  </li>

                                                                                            </ul>
                                                                                        ) : (
                                                                                            // Render this if hello is empty
                                                                                            <form method='POST'>


                                                                                                <div class="mb-3">
                                                                                                    <label for="exampleFormControlInput1" class="form-label">Time_In</label>
                                                                                                    <input type="text"
                                                                                                        class="form-control"
                                                                                                        id="exampleFormControlInput1"
                                                                                                        placeholder="Enter the Time_in"
                                                                                                        name='Time_In'
                                                                                                        value={user.Time_In}
                                                                                                        onChange={handleInputone}
                                                                                                    />
                                                                                                </div>

                                                                                                <div class="mb-3">
                                                                                                    <label for="exampleFormControlInput1" class="form-label">Time_out</label>
                                                                                                    <input type="text"
                                                                                                        class="form-control"
                                                                                                        id="exampleFormControlInput1"
                                                                                                        placeholder="Enter the time out"
                                                                                                        name='Time_out'
                                                                                                        value={user.Time_out}
                                                                                                        onChange={handleInputone}
                                                                                                    />
                                                                                                </div>

                                                                                                <select value={selectedOption} onChange={handleSelectChange} name='status' class="form-select mt-2" aria-label="Default select example">
                                                                                                    <option selected>Select Present or absent</option>
                                                                                                    <option value="1,Present">Present</option>
                                                                                                    <option value="0,Absent">Absent</option>

                                                                                                </select>

                                                                                                <button onClick={(e) => { markpresentabsentone(e, store[0]?.PM_id, moment(dateState).format('DD-MM-YYYY')) }} className='btn btn-primary mt-3
                  '>Submit</button>
                                                                                            </form>

                                                                                        )}













                                                                                    </div>

                                                                                </div>
                                                                            </div>

                                                                            {/* -------------------------------------------------- */}



                                                                        </li>
                                                                    ))
                                                                }
                                                            </ol>

                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                        </Typography>
                                    </Sheet>
                                </Modal>















                            </div>
                        </div>




                    </div>



                </div>
            </div>


            <Transition in={rahopen} timeout={400}>
                {(state) => (
                    <Modal
                        keepMounted
                        open={!['exited', 'exiting'].includes(state)}
                        onClose={() => setrahOpen(false)}
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
                            <Typography  id="fade-modal-dialog-title" component="h2">
                                <label className='ms-4'>All Details of contractor</label>
                            </Typography>
                            <Typography
                                id="fade-modal-dialog-description"
                                textColor="text.tertiary"
                            >
                                <ul class="list-group">
                                   
                                    <li class="list-group-item"><label style={{ fontWeight: "bold" }}>Total Hour of shifts : <label style={{ color: "red" }}>{countshifts[0]?.multiplied_count} Hrs</label></label></li>
                                    <li class="list-group-item"><label style={{ fontWeight: "bold" }}>Total Hour of Missing Shifts : <label style={{ color: "red" }}>{countabsent[0]?.absent * 9} Hours</label></label></li>
                                    <li class="list-group-item"><label style={{ fontWeight: "bold" }}>Number of Absent Days : <label style={{ color: "red" }}>{countabsent[0]?.absent} Days</label></label></li>

                                </ul>

                            </Typography>
                        </ModalDialog>
                    </Modal>
                )}
            </Transition>



            {/* modal-------------------------- */}
            <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h1 class="modal-title fs-5" id="exampleModalLabel"></h1>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <ul class="list-group">
                                <li class="list-group-item">
                                    <div class="form-check form-switch">
                                    </div>
                                </li>
                                <li class="list-group-item"><label style={{ fontWeight: "bold" }}>Total Hour of shifts : <label style={{ color: "red" }}>{countshifts[0]?.multiplied_count} Hrs</label></label></li>
                                <li class="list-group-item"><label style={{ fontWeight: "bold" }}>Total Hour of Missing Shifts : <label style={{ color: "red" }}>{countabsent[0]?.absent * 9} Hours</label></label></li>
                                <li class="list-group-item"><label style={{ fontWeight: "bold" }}>Number of Absent Days : <label style={{ color: "red" }}>{countabsent[0]?.absent} Days</label></label></li>

                            </ul>


                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" class="btn btn-primary">Save changes</button>
                        </div>
                    </div>
                </div>
            </div>


            {/*------------------------ second modalll--------------------------------------- */}
            <div class="modal fade" id="exampleModal1" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h1 class="modal-title fs-5" id="exampleModalLabel">All  contractor</h1>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <ul class="list-group">
                                <li class="list-group-item">
                                    <div class="form-check form-switch">
                                        <form>

                                            <input
                                                value="absent"
                                                class="form-check-input"
                                                type="checkbox"

                                                name="checkbox"
                                                id="checkbox"

                                            />









                                            <label class="form-check-label" for="flexSwitchCheckDefault">Make Absent</label>

                                        </form>

                                    </div>
                                </li>

                            </ul>






                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" class="btn btn-primary">Save changes</button>
                        </div>
                    </div>
                </div>
            </div>


            <Footer />

        </div>
    )
}

export default Contractor
