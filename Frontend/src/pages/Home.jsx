import React, { useContext, useState } from 'react'
import Header from '../components/Header'
import ImageAnimContainer from '../components/ImageAnimContainer'
import gsap from "gsap";
import { useEffect } from 'react';
import img1 from '../assets/page2image1.png'
import img2 from '../assets/page2image2.png'
import img3 from '../assets/page2image3.png'
import img4 from '../assets/page2image4.png'
import imgpage1 from '../assets/page3img1.png'
import imgpage2 from '../assets/page3img2.png'
import imgpage3 from '../assets/page3img3.png'
import imgpage4 from '../assets/page3img4.png'
import imgpage5 from '../assets/page3img5.png'
import LoginPopUp from '../components/LoginPopUp'
import SignUpPop from '../components/SignUpPop'
import axios from 'axios'
import {toast} from 'react-toastify'
import { pinDataContext } from '../context/PinProvider';
import { NotificationsContext } from '../context/NotificationsProvider';

const Home = () => {

  const [pannel , setPannel] = useState(true);
  const [signUpPannel , setSignUpPannel] = useState(true);

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const {setPinData} = useContext(pinDataContext);
    const {setNotifications} = useContext(NotificationsContext)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/`);
        console.log("Response from backend:", response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [])

   useEffect(() => {
            const fatchProfileData = async () => {
                 try{
                      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/user/getAllPins`);
                      if(response.status == 200){
                        setPinData( response.data);
                        console.log('pin fatch successfully') 
                      }
                 }catch(err){
                      console.error("Error fetching data:", err);
                 }
            }
  
            fatchProfileData();
  
    },[])

  const signupHandler = async (e) => {
      e.preventDefault();
      const registerData = {
        username,
        email,
        password
      }
  
      try {
        const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/user/register`, registerData);
        if(response.status === 200){
           setNotifications((prev) => [
        ...prev,
        {
          id: Date.now(),
          message: `📝 Welcome ${username}, you registered successfully!`,
          time: new Date().toLocaleTimeString(),
        },
      ]);

          const data = response.data;
          localStorage.setItem('token' , data.token)
          toast.success('User registered successfully');
          setUsername('');
          setEmail('');
          setPassword('');
          setSignUpPannel(true);
        }
      } catch (error) {
        console.log(error);
        setUsername('');
        setEmail('');
        setPassword('');
        toast.error('Error registering user');
      }
  
  }

  useEffect(()=> {

    if(pannel){
      gsap.to('.loginPopUp',{
        display:'none',
      });
    }
    else{
      gsap.to('.loginPopUp',{
        display:'block',
      })
    }


  },[pannel])

  useEffect(()=> {

    if(signUpPannel){
      gsap.to('.signUpPop',{
        display:'none',
      });
    }
    else{
      gsap.to('.signUpPop',{
        display:'block',
      })
    }


  },[signUpPannel])
  
  
  useEffect(() => {
    const tl = gsap.timeline({ repeat: -1 });
    tl.to(".textanim",{
      delay:6,
      duration: 1.5,
      y: "-100%",
      ease: "power2.out",
    })
    .to(".textanim2",{
      delay:-1,
      duration: 1.5,
      y: "-83%",
      ease: "power2.out",
    })
    .to(".textanim2",{
      delay:8,
      duration: 1.5,
      y: "-190%",
      ease: "power2.out",
    })
    .to('.textanim3',{
      delay:-1,
      duration: 1.5,
      y: "-190%",
    })
    .to('.textanim3',{
      delay:10,
      duration: 1.5,
      y: "-300%",
    })

  },[])

  useEffect(() => {
    const tl = gsap.timeline({ repeat: -1 }); // Repeat infinitely

    tl.to(".animated-img", {
      duration: 1,
      delay: 5,
      y: "-40%",
      opacity: 0,
      stagger: 0.3
    })
    .to(".animated-img2", {
      duration: 0.8,
      delay: -1, 
      y: "-100%",
      opacity: 1,
      stagger: 0.4
    })
    .to(".animated-img2", {
      duration: 1.5,
      delay: 6, 
      y: "-200%",
      opacity: 0,
      stagger: 0.3
    })
    .to(".animated-img3", {
      duration: 1.5,
      delay: -1,
      y: "-210%",
      opacity: 1,
      stagger: 0.3
    })
    .to(".animated-img3", {
      duration: 1.5,
      delay: 6,
      y: "-300%",
      opacity: 0,
      stagger:0.3,
    })
    .set(".animated-img", { opacity: 1, y: "0%" })  // Reset first image
    .set(".animated-img2", { opacity: 0, y: "0%" }) // Reset second image
    .set(".animated-img3", { opacity: 0, y: "0%" }) // Reset third 
  
  }, []);

  const imgObj = {
    img1: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT1zAlM-Slrkyte8MsqJJ0krUYfjIlOHISGI9UV8vX1alXJKYg8dXdcPR8vG7R1sMbKK5I&usqp=CAU',
    img2:'https://madaboutkitchen.in/wp-content/uploads/2014/05/Masala-Chai-.jpg',
    img3:'https://www.tasteofhome.com/wp-content/uploads/2021/02/Samosas_EXPS_THJJ21_259895_B02_11_3b-61.jpg',
    img4:'https://vegecravings.com/wp-content/uploads/2024/07/Dosa-Recipe-Step-By-Step-Instructions-scaled.jpg',
    img5:'https://www.indianhealthyrecipes.com/wp-content/uploads/2024/05/veg-cheese-sandwich.webp',
    img6:'https://suebeehomemaker.com/wp-content/uploads/2021/10/sliced-french-bread.jpg',
  }

  const imgObj2 = {
    img1:'https://m.media-amazon.com/images/I/71evTPkBL5L.jpg',
    img2:'https://rukminim2.flixcart.com/image/850/1000/xif0q/wall-decoration/w/p/x/metal-wall-decor-wall-arts-for-home-living-room-hotel-decoration-original-imagqhzbtq8qhy4s.jpeg?q=90&crop=false',
    img3:'https://7span-product.b-cdn.net/bc182669-d528-4e08-bde8-8142d7f2cdab.png',
    img4:'https://cdn.exoticindia.com/images/products/original/sculptures-2018/zep178.jpg',
    img5:'https://www.jiomart.com/images/product/original/rvir9qeuqn/special-you-aesthetic-room-decor-backdrop-fairy-lights-for-bedroom-artificial-vines-green-leaves-86-inch-for-wall-decor-balcony-home-decor-items-pack-of-7-product-images-orvir9qeuqn-p602553425-4-202308032151.jpg?im=Resize=(420,420)',
    img6:'https://i0.wp.com/i.pinimg.com/564x/17/cd/c7/17cdc74c881d10ba22362ea9852e00dd.jpg?resize=303%2C455&ssl=1'
  }

  const imgObj3 = {
    img1:'https://www.stylebysavina.com/wp-content/uploads/2022/05/minimalist-outfit-ideas.jpg',
    img2:'https://mikadopersonalstyling.com/wp-content/uploads/2020/06/womens-fashion-tips.jpg',
    img3:'https://intheblouse.elementor.cloud/wp-content/uploads/2023/04/7aadfdb3-6d95-45d1-89c2-efbff186d495-1.png',
    img4:'https://media.samyakk.com/pub/media/catalog/product/d/a/dark-olive-green-umbrella-style-net-designer-lehenga-with-pentagon-neck-blouse-gg1038.jpg',
    img5:'https://fashionsuggest.in/wp-content/uploads/ranveer-simgh-sharwani.jpg',
    img6:'https://www.oprah.com/g/image-resizer?width=670&link=https://static.oprah.com/2022/09/202209-orig-fall-22-fashion-trends-baggy-pants-1200x1200.jpg'
  }

  return (
    <>
    <Header setSignUpPannel={setSignUpPannel} setPannel={setPannel}/>
    <LoginPopUp setSignUpPannel={setSignUpPannel} setPannel={setPannel}/>
    <SignUpPop setSignUpPannel={setSignUpPannel} setPannel={setPannel} />
    <div  className='page1 h-screen w-full relative overflow-hidden'>
        <div className='page1content w-full absolute top-[18vh] flex flex-col justify-center items-center'>
            <h1 className='text-[4.5vw] font-semibold'>Get your next</h1>
            <div className='w-full overflow-hidden text-center h-[16vh]'>
              <h1 className='textanim text-[4.5vw] text-[#c28b00] font-semibold'>chai time snacks idea</h1>
              <h1 className='textanim2 text-[4.5vw] text-[#0076d3] font-semibold'>home decor idea</h1>
              <h1 className='textanim3 text-[4.5vw] text-[#518c7b] font-semibold'>outfit idea</h1>
            </div>
        </div>
        <div className='image-container absolute top-[25%] w-full h-[69vh] flex justify-between  overflow-hidden'>
          <div className='w-[42vw] h-full  flex gap-3'>
          <div className="image-box  -ml-[11vw] mt-[3vw]">
            <ImageAnimContainer img={imgObj.img1} img2={imgObj2.img1} img3={imgObj3.img1}/>
          </div>
          <div className="image-box h-full w-[17vw] mt-[13vw]">
            <ImageAnimContainer img={imgObj.img2} img2={imgObj2.img2} img3={imgObj3.img2}/>
          </div>
          <div className="image-box h-full w-[17vw] mt-[19vw]">
            <ImageAnimContainer img={imgObj.img3} img2={imgObj2.img3} img3={imgObj3.img3}/>
          </div>
          </div>
          <div className='w-[42vw] h-full flex gap-3'>
          <div className="image-box h-full  w-[17vw] mt-[19vw]">
            <ImageAnimContainer img={imgObj.img4} img2={imgObj2.img4} img3={imgObj3.img4}/>
          </div>
          <div className="image-box h-full  w-[17vw] mt-[13vw]">
            <ImageAnimContainer img={imgObj.img5} img2={imgObj2.img5} img3={imgObj3.img5}/>
          </div>
          <div className="image-box h-full  w-[17vw] -mr-[11vw] mt-[3vw]">
           <ImageAnimContainer img={imgObj.img6} img2={imgObj2.img6} img3={imgObj3.img6}/>
          </div>
          </div>
        </div>
        <div className='homePageEnd  absolute bottom-0 w-full bg-[#fffd92] z-10 text-center py-2.5'>
          <h1 className='font-semibold'>Here's how it works <i className="ri-arrow-down-s-line"></i></h1>
        </div>
    </div>
    <div className='page2 h-screen w-full bg-[#fffd92] flex '>
      <div className='w-[50vw] h-full  flex justify-center items-center relative '>
          <img className='w-[14vw] absolute top-[30vh] left-[4vw]  ' src={img1} alt="" />
          <img className='w-[19vw] absolute z-10' src={img2} alt="" />
          <img className='w-[12vw] top-[6vh] right-[10vw]  absolute' src={img3} alt="" />
          <img className='w-[10vw] bottom-[10vh] right-[10vw] absolute' src={img4} alt="" />
          <button className='bg-white text-[#6e0f3c] px-6 py-4 z-20 rounded-4xl text-2xl font-semibold '>easy chicken dinner</button>
      </div>
      <div className='w-[50vw] h-full text-[#c31952] flex flex-col justify-center items-center gap-2'> 
        <h1 className='text-[4vw] leading-tight font-semibold'>Search for an idea</h1>
        <p className='text-2xl px-[10vw] text-center'>What do you want to try next? Think of something you’re into—like “easy chicken dinner”—and see what you find.</p>
        <button className='bg-red-600 text-white font-semibold py-2.5 px-4 rounded-[20px] text-[16px] leading-tight'>Explore</button>
      </div>
    </div>
    <div className='page3 h-screen w-full bg-[#dafff6] flex'>
      <div className='w-[50vw] h-full text-[#006b6c] flex flex-col justify-center items-center gap-2'> 
        <h1 className='text-[4vw] leading-tight font-semibold'>Save idea like you</h1>
        <p className='text-2xl px-[10vw] text-center'>Collect your favorites so you can get back to them later.</p>
        <button className='bg-red-600 text-white font-semibold py-2.5 px-4 rounded-[20px] text-[16px] leading-tight'>Explore</button>
      </div>
      <div className='w-[50vw] h-full relative p-8'>
          <div className='absolute'>
            <img className='w-[27vw] ' src={imgpage1} alt="img" />
          </div>
          <div className='absolute top-[44vh] right-16'>
            <img className='w-[12vw] ' src={imgpage2} alt="img" />
          </div>
          <div className='absolute left-52 bottom-4'>
            <img className='w-[14vw] ' src={imgpage3} alt="img" />
          </div>
          <div className='absolute right-10 bottom-3'>
            <img className='w-[12vw] ' src={imgpage4} alt="img" />
          </div>
          <div className='absolute right-3 '>
            <img className='w-[15vw] ' src={imgpage5} alt="img" />
          </div>
      </div>
    </div>
    <div className='page4 h-screen w-full bg-[#ffe2eb] flex'>
      <div className='page4Left w-[50vw] h-full relative'>
        <img className='w-full h-full object-cover absolute ' src="https://s.pinimg.com/webapp/shop-de8ddf10.png" alt="img" />
        <img className='w-[16vw] object-cover absolute z-10 left-28 top-32 rounded-2xl' src="https://s.pinimg.com/webapp/creator-pin-img-3bed5463.png" alt="img" />
        <img className='absolute bottom-28 left-10 z-10' src="https://s.pinimg.com/webapp/creator-avatar-262dfeba.png" alt="img" />
      </div>
      <div className='w-[50vw] h-full text-[#c31952] flex flex-col justify-center items-center gap-2'> 
        <h1 className='text-[4vw] text-center font-semibold px-[8vw] leading-tight'>See it, make it, try it, do it</h1>
        <p className='text-2xl px-[10vw] text-center'>The best part of Pinterest is discovering new things and ideas from people around the world.</p>
        <button className='bg-red-600 text-white font-semibold py-2.5 px-4 rounded-[20px] text-[16px] leading-tight'>Explore</button>
      </div>
    </div>
    <div className='page5 h-screen w-full flex relative'>
      <div className='absolute bg-black w-full h-full opacity-50'></div>
      <div className='w-[50vw] h-full flex items-center justify-center font-semibold z-10'>
        <h1 className='text-white text-[5vw]  leading-tight'>Sign up to get <br /> your ideas</h1>
      </div>
      <div className='w-[50vw] h-full z-10 flex justify-center pt-[15vh]'>
      <div className='h-[79vh] w-[27vw] text-[#333333] bg-white rounded-4xl'>
          <h1 className='text-center text-2xl font-semibold mt-4'>Welcome to Pinterest</h1>
          <p className='text-center'>Find new idea to try</p>
          <form onSubmit={(e)=> {
            signupHandler(e);
          }} className='flex flex-col justify-center items-center gap-3 mt-10'>
            <div>
            <label>Username</label> <br/>
            <input onChange={(e)=>{setUsername(e.target.value)}} value={username} required className='bg-transparent border-2 border-[#cdcdcd] px-2 py-2 w-[16vw] rounded-xl' type="text"placeholder='Username' />
            </div>
            <div>
            <label>Email</label> <br/>
            <input onChange={(e)=>{setEmail(e.target.value)}} value={email} required className='bg-transparent border-2 border-[#cdcdcd] px-2 py-2 w-[16vw] rounded-xl' type="email" placeholder='Email'/>
            </div>
            <div>
            <label>Password</label> <br/>
            <input onChange={(e)=>{setPassword(e.target.value)}} value={password} required className='bg-transparent border-2 border-[#cdcdcd] px-2 py-2 w-[16vw] rounded-xl' type="password" placeholder='Create password'/>
            </div>
            <button type='submit' className='cursor-pointer bg-red-600 text-white font-semibold py-2.5 px-20 rounded-[20px] text-[16px] leading-tight'>Continue</button>
          </form>
          <p className='text-center px-10 text-[#3d3d3d] text-xs mt-3.5'>By continuing, you agree to Pinterest's Terms of Service and acknowledge you've read our Privacy Policy. Notice at collection.</p>
          <p className='text-center text-black text-sm mt-3.5'>Already a member? Login in</p>
      </div>
      </div>
    </div>
    </>
  )
}

export default Home
