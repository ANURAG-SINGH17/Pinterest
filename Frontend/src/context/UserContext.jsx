import React from 'react'
import { useState } from 'react'
import { createContext } from 'react'

export const userDataContext = createContext()

const UserContext = ({children}) => {

    const [userData, setUserData] = useState({})

  return (
    <userDataContext.Provider value={{userData , setUserData}}>
      {children}
    </userDataContext.Provider>
  )
}

export default UserContext
