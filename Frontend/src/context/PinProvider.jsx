import React, { createContext, useState } from 'react'

export const pinDataContext = createContext()

const PinProvider = ({children}) => {

    const [pinData , setPinData] = useState([])

  return (
    <pinDataContext.Provider value ={{pinData , setPinData}}>
        {children}
    </pinDataContext.Provider>
  )
}

export default PinProvider
