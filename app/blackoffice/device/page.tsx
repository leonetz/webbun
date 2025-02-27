"use client"

import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import config from "@/app/config";
import Link from "next/link";
import dayjs from "dayjs";
import Modal from "@/app/components/modal";



export default function Page() {
    const [devices, setDevices] = useState([]);
    const [showModal, setShowModal] = useState(true);
    const [name, setName] = useState("");
    const [barcode, setBarcode] = useState("");
    const [remark, setRemark] = useState("");
    const [serial, setSerial] = useState("");
    const [expireDate, setExpireDate] = useState("");
    const [id, setId] =useState("");


    const fetchDevice = async () => {
        const response = await axios.get(`${config.apiUrl}/api/device/list`);
        setDevices(response.data);
    }

    const handleCloseModal = () => {
        setShowModal(false);
    }

    const handleEdit = (device : any) => {
        setShowModal(true);
        setId(device.id);
        setName(device.name);
        setBarcode(device.barcode);
        setRemark(device.remark);
        setSerial(device.serial);
        setExpireDate(device.expireDate);

        const payload = {
            id: id,
            name: name,
            barcode: barcode,
            remark: remark,
            serial: serial,
            expireDate: expireDate,
        }
    }


    useEffect(() => {
        fetchDevice();
    },[]);
    
    return(
        <div className="content">
            <div className="contentInfo">
                <div className="flex headerPage">
                    <div className="headerPage">จำนวนรายการทะเบียนอุปกรณ์</div>
                    <span className="ml-2">{devices.length}</span>
                    <span className="ml-2">รายการ</span>
                </div>

                <div className="mt-4  flex gap-5 text-center">
                    <Link className="bg-red-600 text-white p-2.5 rounded-md w-28" href="/blackoffice/device">จัดการข้อมูล</Link>
                    <Link className="bg-gray-200 p-2.5 rounded-md w-28" href="/blackoffice/device/add">เพิ่มข้อมูล</Link> 
                </div>

                <table className="table table-striped mt-6">
                    <thead>
                        <tr>
                            <th>ชื่ออุปกรณ์</th>
                            <th>Barcode</th>
                            <th>Remark</th>
                            <th>วันที่หมดอายุ</th>
                            <th>ดำเนินการ</th>
                        </tr>
                    </thead>

                    <tbody>
                        {devices.map((device: any) => (
                            <tr key={device.id}>
                                <td>{device.name}</td>
                                <td>{device.barcode}</td>
                                <td>{device.remark}</td>
                                <td>{device.expireDate}</td>
                                <td className="w-44">
                                    <div className="flex items-center justify-center gap-2 p-2 w-full h-full">
                                        <button onClick= {() => handleEdit(device)} className="rounded-md w-14 text-[12px] px-2 py-1 bg-yellow-400 active:scale-95 transition-all duration-150">
                                            แก้ไข
                                        </button>
                                        <button  className="rounded-md w-14 text-[12px] px-2 py-1 bg-red-500 text-white active:scale-95 transition-all duration-150">
                                            ลบ
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <Modal title="แก้ไขข้อมูล" isOpen={showModal} onClose={handleCloseModal}>
                <div>
                    <div className="flex items-center">
                        <div className="w-1/3">ชื่ออุปกรณ์ :</div>
                        <input className="modalInput" type="text" 
                        value={name} onChange={(e) => setName(e.target.value)}/>
                    </div>

                    <div className="flex items-center">
                        <div className="w-1/3">Barcode :</div>
                        <input className="modalInput" type="text" 
                        value={barcode} onChange={(e) => setBarcode(e.target.value)}/>
                    </div>

                    <div className="flex items-center">
                        <div className="w-1/3">Remark :</div>
                        <input className="modalInput" type="text" 
                        value={remark} onChange={(e) => setRemark(e.target.value)}/>
                    </div>

                    <div className="flex items-center">
                        <div className="w-1/3">Serial :</div>
                        <input className="modalInput" type="text" 
                        value={serial} onChange={(e) => setSerial(e.target.value)}/>
                    </div>

                    <div className="flex items-center">
                        <div className="w-1/3">วันที่หมดอายุ :</div>
                        <input className="modalInput" type="date" 
                        value={expireDate} onChange={(e) => setExpireDate(e.target.value)}/>
                    </div>


                    <div className="flex justify-center mt-4">
                        <button className="btnsave">บันทึก</button>
                    </div>
                </div>
            </Modal>          

        </div>
    );
}