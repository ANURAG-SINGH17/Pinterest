import React from 'react'
import { useState } from 'react'
import {toast} from 'react-toastify'
import { registerUser } from '../utils/authUtils'

const SignUpPop = ({setPannel,setSignUpPannel}) => {

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSending, setIsSending] = useState(false);

  const signupHandler = async (e) => {
    e.preventDefault();
    setIsSending(true);
    const { success, data, error } = await registerUser(username, email, password);
    if (success) {
      localStorage.setItem('token', data.token);
      toast.success('User registered successfully');
      setUsername('');
      setEmail('');
      setPassword('');
      setSignUpPannel(true);
    } else {
      console.log(error);
      toast.error('Error registering user');
      setUsername('');
      setEmail('');
      setPassword('');
    }
    setIsSending(false);

  }

  return (
    <div className='signUpPop absolute h-screen w-full bg-[#00000073] z-50 hidden'>
      <div className='flex flex-col w-full h-full items-center justify-center'>
      <div className='h-[79vh] w-[27vw] text-[#333333] bg-white rounded-4xl relative '>
          <i onClick={()=>{setSignUpPannel(true)}}  className="absolute cursor-pointer top-2.5 right-3.5 text-3xl ri-close-line"></i>
          <h1 className='text-center text-2xl font-semibold mt-4'>Welcome to Pinterest</h1>
          <p className='text-center'>Find new idea to try</p>
          <form onSubmit={(e) => {
            signupHandler(e);
          }} className='flex flex-col justify-center items-center gap-3 mt-10'>
            <div>
            <label>Username</label> <br/>
            <input onChange={(e) => {setUsername(e.target.value)}} value={username} required className='bg-transparent border-2 border-[#cdcdcd] px-2 py-2 w-[16vw] rounded-xl' type="text"placeholder='Username' />
            </div>
            <div>
            <label>Email</label> <br/>
            <input onChange={(e) => {setEmail(e.target.value)}} value={email} required className='bg-transparent border-2 border-[#cdcdcd] px-2 py-2 w-[16vw] rounded-xl' type="email" placeholder='Email'/>
            </div>
            <div>
            <label>Password</label> <br/>
            <input onChange={(e) => {setPassword(e.target.value)}} value={password} required className='bg-transparent border-2 border-[#cdcdcd] px-2 py-2 w-[16vw] rounded-xl' type="password" placeholder='Create password'/>
            </div>
            <button type='submit' className='bg-red-600 text-white font-semibold py-2.5 px-20 rounded-[20px] text-[16px] leading-tight'>
             {isSending ? (
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8H4z"
                      ></path>
                    </svg>
                  ) : (
                    "Continue"
                  )}
              </button>
          </form>
          <p className='text-center px-10 text-[#3d3d3d] text-xs mt-3.5'>By continuing, you agree to Pinterest's Terms of Service and acknowledge you've read our Privacy Policy. Notice at collection.</p>
          <p className='text-center text-black text-sm mt-3.5'>Already a member? <span onClick={()=>{setPannel(false); setSignUpPannel(true)}} className='hover:underline cursor-pointer'>Login</span></p>
    </div>
      </div>
    </div>
  )
}

export default SignUpPop
