import React from 'react'
import { useState } from 'react';


const Endpoints = () => {

    const [endpoint, setEndpoint] = useState(localStorage.getItem('endpoint') || []);

  return (
    <div>Endpoints</div>
  )
}

export default Endpoints