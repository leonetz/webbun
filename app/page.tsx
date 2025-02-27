
"use client"
import Image from 'next/image'
import React, { useState } from 'react';
import Swal from 'sweetalert2';
import config from './config';
import axios from 'axios';
import { useRouter } from 'next/navigation';


export default function Home() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () =>{
    try {
      if (username === "" || password === "") {
        Swal.fire({
          icon: "error",
          title: "เกิดข้อผิดพลาด",
          text: "โปรดระบุ Username และ Password",
          confirmButtonText: "ปิด",
        });
        return;
      }

      setIsLoading(true); // แสดง Popup โหลด
      
      const payload = {
        username,
        password
      }

      setIsLoading(true);

      const response = await axios.post(`${config.apiUrl}/api/user/signIn`, payload)

      if (response.data.token !== undefined) {
        localStorage.setItem(config.tokenkey, response.data.token);
        localStorage.setItem("bun_service_name", response.data.user.name); 
        localStorage.setItem("bun_service_level", response.data.user.level);
        localStorage.setItem("bun_service_username", response.data.user.username);
        localStorage.setItem("bun_service_createdAt", response.data.user.createdAt);


        
        if (response.data.user.level === "admin" || response.data.user.level === "user" || response.data.user.level === "engineer") {
          router.push('/blackoffice/user');
          setIsLoading(false);
        }
        
      } else {
        setIsLoading(false);
        Swal.fire({
          icon: "error",
          title: "เกิดข้อผิดพลาด",
          text: "รหัสผ่านไม่ถูกต้อง",
          confirmButtonText: "ปิด",
        });
      }

    } catch (error : any) {
      setIsLoading(false);
      Swal.fire({
        icon: "error",
        title: "error",
        text: error.message
      });
    }

  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        handleLogin();
      }
  };  

  return (
    <div className="flex items-center justify-center w-screen h-screen bg-gray-100">
      <div className="flex max-w-4xl w-full h-4/5 rounded-3xl bg-white shadow-[8px_8px_15px_0px_rgba(0,0,0,0.25)]">
        <div className="w-1/2 h-full bg-red-500 rounded-l-3xl "></div>
        <div className="w-1/2 h-full bg-white rounded-r-3xl"></div>
      </div>

      <div className="fixed  flex flex-col  max-w-sm bg-white shadow-[-8px_8px_15px_0px_rgba(0,0,0,0.25),8px_8px_15px_0px_rgba(0,0,0,0.25)] rounded-lg  w-full h-[500px] ">
        <div className='flex flex-col p-3 justify-center  h-full'>

    
          <div className='flex w-full items-center justify-center -mb-8 '>
            <Image
              src="/LOGO TKK-01_0.png"
              alt="TKK Logo"
              width={220} // ปรับขนาดตามต้องการ
              height={40} // ปรับขนาดตามต้องการ
              priority={true}
            />
          </div>

          <div className=" p-6 gap-3 flex flex-col">
            <div className="flex flex-col gap-1">
              <div className="pl-1"><i className="fa-solid fa-user mr-2"></i>Username</div>
              <input onKeyDown={handleKeyDown} value={username} onChange={(e) => setUsername(e.target.value)} type="text" placeholder="Username" className="input input-bordered w-full max-w-xs" />
            </div>

            <div className="flex flex-col gap-1">
              <div className="pl-1"><i className="fa-solid fa-lock mr-2"></i>Password</div>
              <div className='relative'>
                <input onKeyDown={handleKeyDown} value={password} onChange={(e) => setPassword(e.target.value)} type="Password" placeholder="Password" className="input input-bordered w-full max-w-xs" />
              </div>

            </div>
              <button onClick={handleLogin} className="btn mt-4 btn-error text-white">เข้าสู่ระบบ</button>
          </div> 
        </div>
      </div>

      
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <span className="loading loading-bars tex w-[42px] h-[42px]"></span>
        </div>
      )}


    </div>

  );
}
