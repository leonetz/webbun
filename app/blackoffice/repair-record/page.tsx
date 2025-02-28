"use client"

import { useState, useEffect } from "react";
import config from "@/app/config";
import axios from "axios";
import Swal from "sweetalert2";
import Modal from "@/app/components/modal";
import dayjs from "dayjs";
import Link from "next/link";


export default function Page () {
    const [repairRecords, setRepairRecords] = useState([]);
    const [devices, setDevices] = useState([]);

    //รับเครื่อง
    const [showModalReceive, setModalReceive] = useState(true);
    const [receiveCustomerName, setReceiveCustomerName] = useState("");
    const [receiveAmount, setReceiveAmount] = useState(0);
    const [receiveId, setReceiveId] = useState("");

    const fetchDevices = async () => {
        const response = await axios.get(`${config.apiUrl}/api/device/list`);
        setDevices(response.data);
    }

    const fetchRepairRecords = async () => {
        const response = await axios.get(`${config.apiUrl}/api/repairRecords/list`);
        setRepairRecords(response.data);
    }

    const handleCloseModal = () => {
        setModalReceive(false);
    }

    const handleShowModal = () => {
        setModalReceive(true)
    }


    useEffect(() => {
        fetchDevices();
        fetchRepairRecords();
    }, []);

    const getStatusName = (status : string) => {
        switch (status) {
            case "active":
                return "รอซ่อม";
            case "pending":
                return "รอลูกค้ายืนยัน";
            case "repairing":
                return "กำลังซ่อม";
            case "done":
                return "ซ่อมเสร็จ";
            case "cancel":
                return "ยกเลิก";
            case "complete":
                return "ลูกค้ามารับอุปกรณ์"
            default :
                return "รอซ่อม";
        }
    }

    const handleReceive = async(repairRecord : any) => {

        setReceiveCustomerName(repairRecord.customerName);
        setReceiveId(repairRecord.id);
        handleShowModal();

    

    }

    return (
        <div className="content">

            <div className="contentInfo">
 
                <div className="headerPage">รายการบันทึกการซ่อมจำนวน 0 รายการ</div>

                <div className="mt-4  flex gap-5 text-center ">
                    <Link href="/blackoffice/repair-record" className="linkActive">จัดการข้อมูล</Link>
                    <Link href="/blackoffice/repair-record/add" className="linkNonActive">เพิ่มข้อมูล</Link>
                </div>

                <table className="table table-striped mt-6">
                    <thead>
                        <tr>
                            <th>ชื่อลูกค้า</th>
                            <th>เบอร์โทรศัพท์</th>
                            <th>อุปกรณ์</th>
                            <th>อาการ</th>
                            <th>วันที่รับซ่อม</th>
                            <th>วันที่ซ่อมเสร็จ</th>
                            <th>สถานะ</th>
                            <th>ค่าบริการ</th>
                            <th>สถานะ</th>
                        </tr>
                    </thead>
                    <tbody>
                        {repairRecords.map((repairRecord : any, index : number) =>(
                            <tr key={repairRecord.id}>
                                <td>{repairRecord.customerName}</td>
                                <td>{repairRecord.customerPhone}</td>
                                <td>{repairRecord.deviceName}</td>
                                <td>{repairRecord.problem}</td>
                                <td>{dayjs(repairRecord.createdAt).format("DD/MM/YYYY")}</td>
                                <td>{repairRecord.endJobDate ? dayjs(repairRecord.endJobDate).format("DD/MM/YYYY") : '-'}</td>
                                <td>{getStatusName(repairRecord.status)}</td>
                                <td>{repairRecord.amount?.toLocaleString("th-TH")}</td>
                                <td>
                                    <div className="flex justify-center p-1.5">
                                        <button onClick={() => handleReceive(repairRecord)} className="rounded-md  text-[12px] px-2 py-1 bg-green-500  text-white active:scale-95 transition-all duration-150">รับเครื่อง</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

            </div>
            
            <Modal title="รับเครื่อง" isOpen={showModalReceive} onClose={handleCloseModal} size="lg">
             
                <div>ชื่อลูกค้า</div>
                <input className="modalInput" value={receiveCustomerName} readOnly/>
            
                <div>ค่าบริการ</div>
                <input className="modalInput" value={receiveAmount} onChange={(e) => setReceiveAmount(Number(e.target.value))}/>
             
                <div className="flex justify-center mt-4">
                    <button className="btnsave">บันทึก</button>
                </div>

            </Modal>

        </div>

    );
}