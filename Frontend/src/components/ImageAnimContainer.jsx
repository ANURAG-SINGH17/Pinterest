import React from 'react'

const ImageAnimContainer = ({img , img2 , img3 }) => {

  return (
    <div className='h-full w-[17vw]'>
      <img  className='animated-img  h-[55vh] rounded-2xl  object-cover' src={img} alt="img" />
      <img className='animated-img2 opacity-0 h-[55vh] rounded-2xl  object-cover mt-7' src={img2} alt="img" />
      <img className='animated-img3 opacity-0 h-[55vh] rounded-2xl  object-cover mt-7' src={img3} alt="img" />
    </div>
  )
}

export default ImageAnimContainer
