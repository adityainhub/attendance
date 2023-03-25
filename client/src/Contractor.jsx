import React, { useEffect, useState, useRef } from 'react'
import { NavLink, useParams } from 'react-router-dom'
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css';
import moment from 'moment'
import Modal from 'react-bootstrap/Modal';
import { CSVLink } from "react-csv";




const Contracter = () => {
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
    const [countshifts, setcountshifts] = useState([])
    const [markstatusemp ,setmarkstatusemp] = useState({
        memberone:""
    })

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
            console.log(data);



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
        console.log(timein, timeout, attstatus, attvalue);


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
        const confirmation = window.confirm("Are you sure you want to make absent?");
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
            console.log(dataone);


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
        console.log(id);
        const { member } = addmember

        const res = await fetch(`/addmembers/${id}`, {

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
    //==========================================================================================


    // mak the absent and present through input------------------------------
    let nameone, valueone
    const handleInputone = (e) => {
        nameone = e.target.nameone
        valueone = e.target.valueone
        setmarkstatusemp({ ...markstatusemp, [nameone]: valueone })
    }


    //add member using form==========================================================
    const markstatus = async (e,PM_id) => {
        e.preventDefault()
        
        const { memberone } = addmember

        const res = await fetch(`/addmembers/${id}`, {

            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },

            body: JSON.stringify({ memberone })
        })

        const data = await res.json()
        setmarkstatusemp(data)
        console.log(data,"---------------");



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


    const samplerun = (e) => {

        console.log(e.target.getAttribute('data-value1'));
    }


    //insert present absent and time_in and time_out------------------------------------------------



    //Fetch all the members using using useEffetct----------------------------------------------
    const tofetchallmember = async () => {


        try {

            const res = await fetch(`/getmembers/${id}`, {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                },
                credentials: "include"
            })

            const data = await res.json()
            setMember(data)
            console.log(data);






        } catch (error) {
            console.log(error);
        }
    }


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
            console.log(result);

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
            console.log(result);


        } catch (error) {
            console.log(error);
        }
    }




    //useeffect function------------------------------




    const todownloadreport = async () => {
        try {

            const res = await fetch(`/downloadreport`, {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                },
                credentials: "include"
            })

            const result = await res.json()
            setreport(result)




        } catch (error) {
            console.log(error);
        }
    }


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
            console.log(result);




        } catch (error) {
            console.log(error);
        }
    }


    const getallmemberstatus = async () => {
        console.log(formattedToday);
        try {

            const res = await fetch(`/getstatusmember/${formattedToday}/${id}`, {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                },
                credentials: "include"
            })
            console.log(formattedToday, id);
            const result = await res.json()
            setallmemberstatus(result)
            console.log(result);




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



    return (
        <>

            <Navbar />
            {/* ---------------------------------------------admin navbar------------------------------------- */}
            <nav data-bs-theme="dark" class="navbar navbar-expand-lg bg-dark  bg-body-tertiary">
                <div class="container-fluid">
                    <a class="navbar-brand" href="#">Contracter List of <lablel class="text-warning">[</lablel> {smember[0]?.projectName} <lablel class="text-warning">]</lablel></a>
                    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span class="navbar-toggler-icon"></span>
                    </button>
                    <div class="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul style={{ marginLeft: "69%" }} class="navbar-nav  mb-2 mb-lg-0">
                            <li class="nav-item">
                                <NavLink data-bs-toggle="modal" data-bs-target="#exampleModalone" onClick={() => { getallmemberstatus() }} type='button'
                                    className="btn btn-outline-light me-3 mt-1">Today Status</NavLink>
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
            </nav>



            { /* get status modal============================================= */}
            <div class="modal fade" id="exampleModalone" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h1 class="modal-title fs-5" id="exampleModalLabel"> All Contractor Status for  </h1>
                            <button style={{ marginLeft: "15%" }} class="btn btn-dark text-white" type="button">{moment(dateState).format('DD-MM-YYYY')}</button>

                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        {/* -------------------- */}
                        {
                            allmemberstatus.length > 0 ? (
                                <div class="modal-body">
                                    <table class="table">
                                        <thead>
                                            <tr>
                                                <th scope="col"></th>
                                                <th scope="col">Member Name</th>
                                                <th scope="col">Status</th>
                                                <th scope="col"> Time In</th>

                                            </tr>
                                        </thead>
                                        <tbody>

                                            {
                                                allmemberstatus && allmemberstatus.map((item, i) => (
                                                    <tr>
                                                        <th scope="row">{i + 1}</th>
                                                        <td style={{ color: "#f57842" }} className='fw-bold'>{item.member}</td>
                                                        <td><span style={{ backgroundColor: item.attstatus === "Present" ? 'green' : 'red' }} class="btn btn-secondary text-white btn-sm">{item.attstatus}</span></td>
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


                        {/* ---------------------- */}
                        <div class="modal-footer">

                        </div>
                    </div>
                </div>
            </div>



            <div className='container  mt-5'>
                <div className='row'>

                    <div className='col-sm-4 col-md-4 col-lg-4'>
                        <div class="row align-items-md-stretch ">
                            <button className='btn btn-dark text-white mb-3'>Attendance report <label className='text-warning'>[</label> {contarctor[0]?.member} <label className='text-warning'>   ]</label></button>

                            <div class="h-100 p-5 text-bg-light rounded-3 ">


                                <ol class="list-group list-group-numbered  ">

                                    {
                                        smember.map((item, i) => (

                                            <li class="list-group-item d-flex justify-content-between align-items-start">
                                                <div class="ms-2 me-auto">

                                                    <NavLink ref={buttonRef} onClick={() => { absentdays(item.PM_id); handleClick(); getmemberid(item.PM_id) }} className="text-decoration-none"><div class="fw-bold">{item.member} </div>      </NavLink>

                                                    {/* <span style={{ backgroundColor: item.attstatus === "present" ? 'green' : '#f02626' }} class="badge rounded-pill ">{item.attstatus} </span> <i onClick={() => modalClick(item.atte_id)} data-bs-toggle="modal" data-bs-target="#exampleModal" class="bi bi-pencil-square "></i>  */}
                                                </div>
                                                <i onClick={() => { totalshifts(item.PM_id); modalClick(item.PM_id) }} data-bs-toggle="modal" data-bs-target="#exampleModal" class="bi bi-pencil-square "></i>
                                            </li>
                                        ))
                                    }
                                </ol>

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
                                            <div id="emailHelp" class="form-text">Add the member name in {smember[0]?.projectName}.</div>
                                        </div>
                                        <button onClick={(e) => addmembersubmitt(e)} type="submit" class="btn btn-dark tetxt-white">Submit</button>
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
                                                        <th className='fw-bold bg-white' >{i + 1}</th>
                                                        <th scope="row" className='fw-bold bg-white'><span class="badge badge-primary text-dark">{item.attdate}</span></th>
                                                        <td className='fw-bold bg-white'><span style={{ backgroundColor: item.attstatus === "Present" ? 'green' : 'red' }} class="btn btn-secondary text-white btn-sm">{item.attstatus}  </span> </td>
                                                        <td className='fw-bold bg-white'><button onClick={(e) => makeabsentradio(item.PM_id, item.attdate)} className='btn btn-secondary'><i class="bi bi-pencil-square"></i> </button></td>
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



                                    <div style={{ marginLeft: "45%" }} className='col-sm-8 col-md-8 col-lg-8'>

                                        <div class="card border-success mb-3 shadow" style={{ maxWidth: "28rem" }}>
                                            <div class="card-header bg-transparent bg-dark border-success">
                                                <div class="d-grid gap-2">
                                                    <button class="btn btn-dark" type="button">Calendar <i class="bi bi-calendar-month-fill"></i></button>

                                                </div>
                                            </div>
                                            <div class="card-body text-success">
                                                <div class="d-grid gap-2">


                                                </div>
                                                <Calendar
                                                    className='calendar'
                                                    value={dateState}
                                                    onChange={changeDate}
                                                />
                                            </div>

                                        </div>


                                    </div>

                                }

                                <Modal style={{ padding: "0px" }} show={show} onHide={handleClose}>
                                    <div class="jumbotron p-5">
                                        <div class="d-grid gap-2">

                                            <button class="btn btn-dark text-white" type="button">{moment(dateState).format('DD-MM-YYYY')}</button>
                                        </div>
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
                                                                        <button type="button" class="btn btn-secondary position-relative ms-3">
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
                                                                        <form>


                                                                            <div class="mb-3">
                                                                                <label for="exampleFormControlInput1" class="form-label">Email address</label>
                                                                                <input type="text"
                                                                                    class="form-control"
                                                                                    id="exampleFormControlInput1"
                                                                                    placeholder="name@example.com"
                                                                                    name='memberone'
                                                                                    value={markstatusemp.timein}
                                                                                    onChange={handleInputone}
                                                                                />
                                                                            </div>
                                                                            <div class="mb-3">
                                                                                <label for="exampleFormControlInput1" class="form-label">Email address</label>
                                                                                <input type="text"
                                                                                    class="form-control"
                                                                                    id="exampleFormControlInput1"
                                                                                    placeholder="name@example.com"
                                                                                    name='memberone'
                                                                                    value={markstatusemp.timeout}
                                                                                    onChange={handleInputone}
                                                                                />
                                                                            </div>

                                                                            <select value={selectedOption} onChange={handleSelectChange} name='status' class="form-select mt-2" aria-label="Default select example">
                                                                                <option selected>Select Present or absent</option>
                                                                                <option value="1,Present">Present</option>
                                                                                <option value="0,Absent">Absent</option>

                                                                            </select>

                                                                            <button onClick={(e) => { markstatus(e, store[0]?.PM_id, moment(dateState).format('DD-MM-YYYY')) }} className='btn btn-primary mt-3
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
                                        <p class="lead">
                                            <a class="btn btn-primary btn-lg mt-3" href="#" role="button">Learn more</a>
                                        </p>
                                    </div>

                                </Modal>

                            </div>
                        </div>




                    </div>



                </div>
            </div>


            {/* modal-------------------------- */}
            <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h1 class="modal-title fs-5" id="exampleModalLabel">All Details of contractor</h1>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <ul class="list-group">
                                <li class="list-group-item">
                                    <div class="form-check form-switch">



                                    </div>
                                </li>
                                <li class="list-group-item"><label style={{ fontWeight: "bold" }}>Total Hour of shifts : <label style={{ color: "red" }}>{countshifts[0]?.multiplied_count} Hrs</label></label></li>
                                <li class="list-group-item"><label style={{ fontWeight: "bold" }}>Total Missing Shifts : <label style={{ color: "red" }}></label></label></li>
                                <li class="list-group-item"><label style={{ fontWeight: "bold" }}>Number of Absent Days : <label style={{ color: "red" }}>{countabsent[0]?.absent} Days</label></label></li>

                            </ul>


                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-primary" data-bs-dismiss="modal">Close</button>

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




        </>
    )
}

export default Contracter