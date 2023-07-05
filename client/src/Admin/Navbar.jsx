import React from 'react'
import { NavLink } from 'react-router-dom'
import Button from '@mui/joy/Button';
import RadioGroup from '@mui/joy/RadioGroup';
import Radio from '@mui/joy/Radio';
import Typography from '@mui/joy/Typography';
import logo from "../images/img.png"

const Navbar = () => {
    const [variant, setVariant] = React.useState('solid');
    return (
        <>
            <nav class="navbar navbar-expand-lg bg-body-tertiary admin1">
                <div class="container-fluid">
                    
                        <NavLink className="navbar-brand">
                            <img src={logo} alt="Bootstrap" width="150" height="59" />
                        </NavLink>
                        
                    
                    {/* <NavLink to="/admindash" className="">Nexus Nova</NavLink> */}

                    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span class="navbar-toggler-icon"></span>
                    </button>
                    <div class="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul style={{ marginRight: "5%" }} class="navbar-nav ms-auto mb-2 mb-lg-0 ms-5">
                            <li class="nav-item">
                                <NavLink to="/admindash" className="nav-link active">Home</NavLink>

                            </li>
                            <li class="nav-item">
                                <NavLink to="/about" className="nav-link active">About</NavLink>

                            </li>
                            <li class="nav-item">
                                <NavLink to="/" >
                                    <Button size="md" variant={variant} color="danger">
                                        Logout
                                    </Button>
                                </NavLink>
                            </li>

                        </ul>

                    </div>
                </div>
            </nav>
        </>
    )
}

export default Navbar
