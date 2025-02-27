"use client"

import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import config from "@/app/config";
import Link from "next/link";
import dayjs from "dayjs";
import Modal from "@/app/components/modal";


export default function Page() {

 
    const [name, setName] = useState("");
    const [barcode, setBarcode] = useState("");
    const [remark, setRemark] = useState("");
    const [serial, setSerial] = useState("");
    const [expireDate, setExpireDate] = useState("");


    const handleSave = async () => {
        const formattedExpireDate = new Date(expireDate).toISOString();
     
        try {
            const payload = {
                name: name,
                barcode: barcode,
                remark: remark,
                serial: serial,
                expireDate: formattedExpireDate,    
            }

            const result = await Swal.fire({
                icon: "question",
                text: "คุณต้องการเพิ่มข้อมูลหรือไม่",
                confirmButtonText: "ยืนยัน",
                cancelButtonText: "ยกเลิก",
                showCancelButton: true,

            });

            if (result.isConfirmed) {
                await axios.post(`${config.apiUrl}/api/device/create`, payload);
                Swal.fire({
                    icon: "success",
                    title: "บันทึกข้อมูลสำเร็จ!"
                });

                setBarcode("");
                setName("");
                setRemark("");
                setSerial("")
                setExpireDate("");

            }

        } catch (error: any) {
            Swal.fire({
                icon: "error",
                title: "เกิดข้อผิดพลาด",
                text: error.message
            });
        }
    }
    
    return(
        <div className="content">
            <div className="contentInfo">
                <div className="flex headerPage">
                    <div className="headerPage">เพิ่มข้อมูลทะเบียนอุปกรณ์</div>
                </div>

                <div className="mt-4  flex gap-5 text-center">
                    <Link className="linkNonActive" href="/blackoffice/device">จัดการข้อมูล</Link>
                    <Link className="linkActive" href="/blackoffice/device/add">เพิ่มข้อมูล</Link>
                </div>

                <div className="mt-5 ml-5 max-w-md">
                    <div className="flex items-center">
                        <div className="w-40">ชื่ออุปกรณ์ :</div>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                         className="p-2 border-2 border-gray-300 rounded-lg w-full text-sm my-2"/>
                    </div>

                    <div className="flex items-center">
                        <div className="w-40">Barcode :</div>
                        <input type="text" value={barcode} onChange={(e) => setBarcode(e.target.value)} 
                        className="p-2 border-2 border-gray-300 rounded-lg w-full text-sm my-2"/>
                    </div>

                    <div className="flex items-center">
                        <div className="w-40">หมายเหตุ :</div>
                        <input type="text" value={remark} onChange={(e) => setRemark(e.target.value)}
                        className="p-2 border-2 border-gray-300 rounded-lg w-full text-sm my-2"/>
                    </div>

                    <div className="flex items-center">
                        <div className="w-40">Serial :</div>
                        <input type="text" value={serial} onChange={(e) => setSerial(e.target.value)} 
                        className="p-2 border-2 border-gray-300 rounded-lg w-full text-sm my-2"/>
                    </div>

                    <div className="flex items-center">
                        <div className="w-40">วันที่หมดอายุ :</div>
                        <input type="date" value={expireDate} onChange={(e) => setExpireDate(e.target.value)} 
                        className="p-2 border-2 border-gray-300 rounded-lg w-full text-sm my-2"/>
                    </div>

                    <div className="flex mt-4 justify-center ">
                        <button onClick={handleSave} className="btnsave">บันทึก</button>

                    </div>
                </div>
                

            
            </div>
        </div>
    );
}