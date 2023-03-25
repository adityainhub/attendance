import React,{useState} from 'react'
import Navbar from './Navbar'
import bg from "../images/bg.jpg"
import "../App.css"
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify'
import axios from 'axios';

const AdminLogin = () => {
    const [isLoggedin, setIsLoggedin] = useState(false);
    const navigate = useNavigate()
    const [detail, setDetail] = useState({
        email: "",
        password: "",
    })
 
    let name, value
    const handleInput = (e) => {
        name = e.target.name
        value = e.target.value
        setDetail({ ...detail, [name]: value })
    }

    // const Post = async (e) =>{
    //     e.preventDefault()
    //     const { email, password } = detail

    //     axios.post("/login",detail).then((response)=>{
    //         console.log(response);
    //         const data = response.data
    //         const token = data.
    //         localStorage.clear();
    //         localStorage.setItem('user-token', data);

    //     }).catch((error)=>{
    //             console.log(error);
    //     })

    // }
  
  
    const PostData = async (e) => {

        e.preventDefault()
        const { email, password } = detail

        const res = await fetch("/login", {

            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },

            body: JSON.stringify({
                email, password
            })
        })
        localStorage.setItem('token-info', JSON.stringify(detail));
       
    
        const data = await res.json()


        if (res.status === 401 || !data) {
            toast.error("Invalid Credentials", {
                position: "top-center",
                theme: "colored",
                toastId: "id1"

            })
            navigate('/')
        } else {
            // dispatch({ type: "USER", payload: true })
            // alert("Sucesssfuly")
            toast.success("You are logged in", {
                position: "top-center",
                theme: "colored"
            })
            navigate('/admindash')
        }
    }

  return (
    <>

     <main className='main'>
                <div class="container">

                    <section class="section register min-vh-100 d-flex flex-column align-items-center justify-content-center py-4">
                        <div class="container">
                            <div class="row justify-content-center">
                                <div class="col-lg-4 col-md-6 d-flex flex-column align-items-center justify-content-center">



                                    <div class="card mb-3 p-5">

                                        <div class="card-body">

                                            <div class="pt-4 pb-2">
                                                <h5 class="card-title text-center pb-0 fs-4">Login to Admin Account</h5>
                                                <p class="text-center small">Enter your email & password to login</p>
                                            </div>
                                
                                            <form class="row g-3 needs-validation" novalidate>

                                                <div class="col-12">
                                                    <label for="yourusername" class="form-label">Email</label>
                                                    <div class="input-group has-validation">
                                                        <span class="input-group-text" id="inputGroupPrepend">@</span>
                                                        <input type="text"
                                                            name="email"
                                                            class="form-control"
                                                            id="yourUsername"
                                                            value={detail.username}
                                                            onChange={handleInput}
                                                           
                                                            required />
                                                        <div class="invalid-feedback">Please enter your username.</div>
                                                    </div>
                                                </div>

                                                <div class="col-12">
                                                    <label for="yourPassword" class="form-label">Password</label>
                                                    <input type="password"
                                                        name="password"
                                                        class="form-control"
                                                        value={detail.password}
                                                        onChange={handleInput}
                                                        id="yourPassword"
                                                        required />
                                                    <div class="invalid-feedback">Please enter your password!</div>
                                                </div>

                                                <div class="col-12">
                                                    <div class="form-check">
                                                        <input class="form-check-input"
                                                            type="checkbox" name="remember" value="true" id="rememberMe" />
                                                        <label class="form-check-label" for="rememberMe">Remember me</label>
                                                    </div>
                                                </div>
                                                <div class="col-12">
                                                    <button onClick={PostData}  class="btn btn-primary w-100" type="submit">Login</button>
                                                </div>

                                            </form>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </section>

                </div>
            </main>
    </>
  )
}

export default AdminLogin