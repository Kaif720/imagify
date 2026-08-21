import React from 'react'
import Header from '../components/Header'
import Steps from '../components/Steps'
import Description from '../components/Description'
import Testimoninals from '../components/Testimoninals'
import GenerateBtn from '../components/GenerateBtn'

const Home = () => {
  return (
    <div>
      <Header/>
      <Steps/>
      <Description/>
      <Testimoninals/>
      <GenerateBtn/>
    </div>

    
  )
}

export default Home