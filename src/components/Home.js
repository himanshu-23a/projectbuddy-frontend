import React from 'react'
import { Link } from 'react-router-dom'
import './Home.css'
import home_img from '../image/home.png'


const Home = () => {
  return (
    <>
      <div className="container card home-container p-5">
        <div className="row">
          <div className="col-lg-6 d-flex flex-column justify-content-center pt-4 pt-lg-0 order-2 order-lg-1" data-aos="fade-up" data-aos-delay="200">
            <h2>Discover Projects, Find Mates, Build Dreams</h2>
            <h4 className="my-4" style={{color:'lightblue'}}> Explore Exciting Projects, Connect with Like-Minded Project Mates, and Bring Ideas to Life Together"</h4>
            <div className="d-flex justify-content-center justify-content-lg-start">
              <Link className="btn-get-started" to="/Projects">Explore Projects</Link>
            </div>
          </div>
          <div className="col-lg-6 order-1 order-lg-2" data-aos="zoom-in" data-aos-delay="200">
            <img src={home_img} className="img-fluid animated" alt="Home" />
          </div>
        </div>
      </div>
    </>

  )
}

export default Home