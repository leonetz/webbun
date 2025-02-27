
"use client"

import { useState, useEffect, useRef } from "react"
import Swal from "sweetalert2"
import { useRouter } from 'next/navigation';
import config from "../config"
import Image from "next/image"


export function TopNav() {

    const router = useRouter();
    const [name, setName] = useState("");
    const [level, setLevel] = useState("");
    const [username , setUsername] = useState("");
    const [createdAt, setCreatedAt] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null); 

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

  
    useEffect(() => {

        const storedUsername = localStorage.getItem("bun_service_username");

        if (!storedUsername) {
            router.push("/"); // ถ้าไม่มี username ให้ไปที่หน้า Login
        }   

        setName(localStorage.getItem("bun_service_name") || "");
        setLevel(localStorage.getItem("bun_service_level") || "");
        setUsername(localStorage.getItem("bun_service_username") || "");

        const dateCreate = localStorage.getItem("bun_service_createdAt");
        if (dateCreate) {
            const date = new Date(dateCreate);
            const formattedDate = date.toISOString().split('T')[0]; // แสดงแค่วันที่
            setCreatedAt(formattedDate);
        }
        

        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false); 
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };

    }, []);

    const handleLogout = async () => {
        const result = await Swal.fire({
            title: "ออกจากระบบ",
            text: "คุณต้องการออกจากระบบหรือไม่",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "ยืนยัน",
            cancelButtonText: "ยกเลิก",
        });
    
        if (result.isConfirmed) {
            localStorage.clear();
            router.push("/");
        }
    };
    

    return(
        <nav className="border-b-2 shadow-md">
            <div className="px-6">
                <div className="h-20 flex justify-between items-center ">
                    <div className='ml-4 mt-2 gap-6 flex items-center'>
                        <Image
                            src="/LOGO TKK-01_0.png"
                            alt="TKK Logo"
                            width={100} // ปรับขนาดตามต้องการ
                            height={50} // ปรับขนาดตามต้องการ
                            priority={true}
                        />
                        <div className=" text-2xl mb-2">ระบบจัดการอุปกรณ์</div>
                    </div>
                    

                    <div className="flex gap-2 items-center bg-red-600 px-2 py-1.5 rounded-lg">
                        <i className="text-[22px] fa-solid fa-circle-user text-white"></i>
                        <span className="text-sm text-white">{name}</span>

                        <div className="relative">
                            <button onClick={toggleDropdown}> <i className={`text-white text-center ${isOpen ? 'fa-solid fa-caret-up' : 'fa-solid fa-caret-down'}`}></i></button>

                            {isOpen && (
                                <div ref={dropdownRef} className="absolute top-10 right-0 mt-2 min-w-60 w-auto bg-white border-2 border-gray-200 rounded-lg shadow-md z-50">
                                <div className="p-4 text-sm">

                                    <div className="flex items-center gap-2 ">
                                        <div className="text-gray-700 font-bold text-[15px] mb-2">ข้อมูลผู้ใช้</div>
                                        <button className=" text-gray-500 mb-2 "><i className="fas fa-cog"></i>
                                        </button>
                                    </div>
                                    
                            
                                    <div className="text-gray-700 flex gap-1">
                                        <div className="font-bold  text-gray-700 w-[72px]">name</div>
                                        <div className="mr-1">:</div>
                                        <div>{name}</div>
                                    </div>

                                    <div className="text-gray-700 flex gap-1">
                                        <div className="font-bold  text-gray-700 w-[72px]">Level</div>
                                        <div className="mr-1">:</div>
                                        <div>{level}</div>
                                    </div>

                                    <div className="text-gray-700 flex gap-1">
                                        <div className="font-bold  text-gray-700 w-[72px]">Username</div>
                                        <div className="mr-1">:</div>
                                        <div>{username}</div>
                                    </div>

                                    <div className="text-gray-700 flex gap-1">
                                        <div className="font-bold  text-gray-700 w-[72px]">Created At</div>
                                        <div className="mr-1">:</div>
                                        <div>{createdAt}</div>
                                    </div>

                                    <div className="mt-2 text-center text-red-500 hover:text-red-700 hover:underline cursor-pointer"
                                        onClick={handleLogout}>
                                        ออกจากระบบ
                                    </div>
                                </div>
                                </div>
                            )}

                        </div>
                    </div>
                    
                </div>
            </div>

        </nav>
    );
}