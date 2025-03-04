"use client"

import { useState, useEffect } from "react";
import config from "@/app/config";
import axios from "axios";
import Swal from "sweetalert2";
import Modal from "@/app/components/modal";
import dayjs from "dayjs";
import Link from "next/link";

export default function Page () {
    const [devices, setDevices] = useState([]);
    
    const [customerName, setCustomerName] = useState("");
    const [customerPhone, setCustomerPhone] = useState("");
    const [deviceId, setDeviceId] = useState("");
    const [deviceName, setDeviceName] = useState("");
    const [deviceBarcode, setDeviceBarcode] = useState("");
    const [deviceSerial, setDeviceSerial] = useState("");
    const [problem, setProblem] = useState("");
    const [expairDate, setExpairDate] = useState("");

    const fetchDevices = async () => {
        const response =  await axios.get(`${config.apiUrl}/api/device/list`);
        setDevices(response.data);
    }
    
    useEffect(() => {
        fetchDevices();
    }, []);
    
    const handleDeviceChange = (deviceId : string) => {
        const device = (devices as any).find((device: any) => device.id === parseInt(deviceId));

        if(device) {
            setDeviceId(device.id);
            setDeviceName(device.name);
            setDeviceBarcode(device.barcode);
            setDeviceSerial(device.serial);
            setExpairDate(dayjs(device.expairDate).format("YYYY-MM-DD"))
        } else {
            setDeviceId("");
            setDeviceName("");
            setDeviceBarcode("");
            setDeviceSerial("");
            setExpairDate("");
        }
    }

    const handleSave = async () => {
        try {
            const payload = {
                customerName: customerName,
                customerPhone: customerPhone,
                deviceName: deviceName,
                deviceId: deviceId,
                deviceBarcode: deviceBarcode,
                deviceSerial: deviceSerial,
                problem : problem,
            }

            const result = await Swal.fire({
                icon : "question",
                text : "คุณต้องการเพิ่มข้อมูลหรือไม่",
                confirmButtonText: "ยืนยัน",
                cancelButtonText: "ยกเลิก",
                showCancelButton: true,
            })

            if (result.isConfirmed) {
                await axios.post(`${config.apiUrl}/api/repairRecord/create`, payload);
                Swal.fire({
                    icon : "success",
                    text: "บันทึกข้อมูลสำเร็จ"
                })

                setCustomerName("");
                setCustomerPhone("");
                setDeviceId("");
                setDeviceName("");
                setDeviceBarcode("");
                setDeviceSerial("");
                setProblem("");
                setExpairDate("");
            }

        } catch (error : any) {
            Swal.fire({
                icon: "error",
                title: "เกิดข้อผิดพลาด",
                text : error.message
            });
        }
    }

    return (
        <div className="content">

            <div className="contentInfo">

                <div className="headerPage">เพิ่มข้อมูลบันทึกการซ่อม</div>
                <div className="my-4  flex gap-5 text-center">
                    <Link href="/blackoffice/repair-record" className="linkNonActive">จัดการข้อมูล</Link>
                    <Link href="/blackoffice/repair-record/add" className="linkActive">งานในระบบ</Link>
                    <Link href="/blackoffice/repair-record/addOut" className="linkNonActive">งานนอกระบบ</Link>
                </div>

                <div className="mt-5 ml-5 max-w-lg">
                    <div className="flex items-center">
                        <div className="w-52">ชื่อลูกค้า :</div>
                        <input className="modalInput" value={customerName} onChange={(e) => setCustomerName(e.target.value)} type="text"/>
                    </div>

                    <div className="flex items-center">
                        <div className="w-52">เบอร์โทรศัพท์ :</div>
                        <input className="modalInput" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} type="text"/>
                    </div>


                    <div className="flex items-center">
                        <div className="w-52">ชื่ออุปกรณ์ในระบบ :</div>
                        <select className="modalInput" value={deviceId} onChange={(e) => handleDeviceChange(e.target.value)}>
                            <option>--- เลือกอุปกรณ์ ---</option>
                            {devices.map((device : any) =>(
                                <option key={device.id} value={device.id}>{device.name}</option>
                            ))}

                        </select>
                    </div>


                    <div className="flex items-center">
                        <div className="w-52">Barcode :</div>
                        <input className="modalInput" value={deviceBarcode} onChange={(e) => setDeviceBarcode(e.target.value)} type="text"/>
                    </div>

                    <div className="flex items-center">
                        <div className="w-52">Serial :</div>
                        <input className="modalInput" value={deviceSerial} onChange={(e) => setDeviceSerial(e.target.value)} type="text"/>
                    </div>

                    <div className="flex items-center">
                        <div className="w-52">วันที่หมดอายุ :</div>
                        <input className="modalInput" value={expairDate} onChange={(e) => setExpairDate(e.target.value)} type="date"/>
                    </div>

                    <div className="flex items-center">
                        <div className="w-52">อาการเสีย :</div>
                        <textarea className="modalInput" value={problem} onChange={(e) => setProblem(e.target.value)}></textarea>
                    </div>

                    <div className="flex justify-center mt-4">
                        <button className="btnsave" onClick={handleSave}>บันทึก</button>
                    </div>


                </div>

            </div>

        </div>

    );
}