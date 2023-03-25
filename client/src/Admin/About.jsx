import React from 'react'
import about from "../Admin/about.png"
import "../App.css"
import Navbar from './Navbar'

const About = () => {
    return (
        <>
            <Navbar />
            <section id="about" class="about mt-5">
                <div class="container">

                    <div class="row">
                        <div class="col-lg-6">
                            <img src={about} class="img-fluid" alt="" />
                        </div>
                        <div class="col-lg-6 pt-4 pt-lg-0 content">
                            <h3>Empowering and inspiring organisations with innovative transformation strategies.</h3>
                            <p class="fst-italic">

                                Empowering and inspiring organisations with innovative transformation strategies.
                                Inspiring through change to better impact the world.
                            </p>
                            <ul>
                                <li><i class="bi bi-check-circle"></i> We can fully provide support, knowledge and impart our experience of large-scale transformation projects</li>
                                <li><i class="bi bi-check-circle"></i> Post transformation requires a deep understanding of go-lives, stabilization and extended support</li>
                                <li><i class="bi bi-check-circle"></i>Our core processes involve unparalleled training strategies, implementation and support</li>
                            </ul>
                           
                        </div>
                    </div>

                </div>
            </section>
        </>
    )
}

export default About