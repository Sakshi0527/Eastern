import React from 'react'
import { RouteConstants } from '../../routes/RouteConstants'

const NavigateToHome = () => {
  return (
    <Navigate to={RouteConstants.USERS}/>
  )
}

export default NavigateToHome
