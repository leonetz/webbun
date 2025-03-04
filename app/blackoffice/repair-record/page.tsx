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
    const [showModalReceive, setModalReceive] = useState(false);
    const [receiveCustomerName, setReceiveCustomerName] = useState("");
    const [receiveAmount, setReceiveAmount] = useState(0);
    const [receiveId, setReceiveId] = useState("");

    //แก้ไข
    const [showModalEdit, setShowModalEdit] = useState(false);
    const [customerName, setCustomerName] = useState("");
    const [customerPhone, setCustomerPhone] = useState("");
    const [deviceName, setDeviceName] = useState("");
    const [deviceBarcode, setDeviceBarcode] = useState("");
    const [deviceSerial, setDeviceSerial] = useState("");
    const [problem, setProblem] = useState("");
    const [deviceId, setDeviceId] = useState("");
    const [expireDate, setExpireDate] = useState("");
    const [id, setId] = useState(0);

    const fetchDevices = async () => {
        const response = await axios.get(`${config.apiUrl}/api/device/list`);
        setDevices(response.data); 
    }

    const fetchRepairRecords = async () => {
        const response = await axios.get(`${config.apiUrl}/api/repairRecords/list`);
        setRepairRecords(response.data);
    }

    const handleCloseReceive = () => {
        setReceiveAmount(0);
        setModalReceive(false);
    }

    const handleShowReceive = () => {
        setModalReceive(true);
    }


    const handleCloseEdit = () => {
        setDeviceId("");
        setDeviceName("");
        setDeviceBarcode("");
        setDeviceSerial("");
        setExpireDate("");
        setShowModalEdit(false);
    }


    const handleShowEdit = (repairRecord : any) => {
        setId(repairRecord.id)
        setCustomerName(repairRecord.customerName);
        setCustomerPhone(repairRecord.customerPhone);
        if (repairRecord.deviceId) {
            setDeviceId(repairRecord.deviceId);
        }
        setDeviceName(repairRecord.deviceName);
        setDeviceBarcode(repairRecord.deviceBarcode);
        setDeviceSerial(repairRecord.deviceSerial);
        setExpireDate(dayjs(repairRecord.expireDate).format("YYYY-MM-DD"));
        setProblem(repairRecord.problem);
        setShowModalEdit(true);
    }

    const handleSaveEidt = async () => {  
        try {
            const payload = {
                id: id,
                customerName : customerName,
                customerPhone : customerPhone,
                deviceId: deviceId == '' ? undefined : deviceId,
                deviceName : deviceName,
                deviceBarcode : deviceBarcode,
                deviceSerial : deviceSerial,
                expireDate : expireDate == "" ? undefined : new Date(expireDate),
                problem : problem,
            }
            const result = await Swal.fire({
                icon : "question",
                text: "คุณต้องการอัพเดตข้อมูลหรือไม่",
                confirmButtonText: "ยินยัน",
                cancelButtonText: "ยกเลิก",
                showCancelButton: true
            });

            if(result.isConfirmed) {
                await axios.put(`${config.apiUrl}/api/repairRecord/update/${id}`, payload);
                Swal.fire({
                    icon: "success",
                    text: "บันทึกข้อมูลสำเร็จ"

                })
                setId(0);
                setDeviceId("");
                setDeviceName("");
                setDeviceBarcode("");
                setDeviceSerial("");
                setExpireDate("");
                fetchRepairRecords();
                setShowModalEdit(false);
            }
        } catch (error : any) {
            Swal.fire({
                icon : "error",
                title : "เกิดข้อผิดพลาด",
                text : error.message,
            });
            
        }
    }

    const handleDeviceChange = (deviceId : string) => {
        const device = (devices as any).find((device: any) => device.id === parseInt(deviceId));

        if(device) {
            setDeviceId(device.id);
            setDeviceName(device.name);
            setDeviceBarcode(device.barcode);
            setDeviceSerial(device.serial);
            setExpireDate(dayjs(device.expairDate).format("YYYY-MM-DD"))
        } else {
            setDeviceId("");
            setDeviceName("");
            setDeviceBarcode("");
            setDeviceSerial("");
            setExpireDate("");
        }
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


    const handleSaveReceive = async () => {
        try {
            const payload = {
                id : receiveId,
                amount : receiveAmount,
            }

            const result = await Swal.fire({
                icon : "question",
                text : "คุณต้องการรับเครื่องหรือไม่",
                confirmButtonText : "ยืนยีน",
                cancelButtonText : "ยกเลิก",
                showCancelButton : true,
            })
    
            if (result.isConfirmed) {
                await axios.put(`${config.apiUrl}/api/repairRecord/receive`, payload);
                Swal.fire({
                    icon: "success",
                    text: "บันทึกข้อมูลสำเร็จ"
                });

                setReceiveAmount(0);
                fetchRepairRecords();
                handleCloseReceive();
    
            }
            
        } catch (error : any) {
            Swal.fire({
                icon : "error",
                title : "เกิดข้อผิดพลาด",
                text : error.message,
            });
        }
    }

    const handleDelete = async (id : string) => {
        try {
            const result = await Swal.fire({
                icon : "question",
                text : "คุณต้องการลบข้อมูลหรื่อไม่",
                confirmButtonText: "ยืนยัน",
                cancelButtonText: "ยกเลิก",
                showCancelButton: true, 
            });

            console.log(id);

            if (result.isConfirmed) {
                await axios.put(`${config.apiUrl}/api/repairRecord/remove/${id}`);
                Swal.fire({
                    icon: "success",
                    text: "บันทึกข้อมูลสำเร็จ"
                });

                fetchRepairRecords();
            } 
        } catch (error : any) {
            Swal.fire({
                icon : "error",
                title: "เกิดข้อผิดพลาด",
                text : error.message,
            });
        }
    }

    const handleReceive = async(repairRecord : any) => {
        setReceiveCustomerName(repairRecord.customerName);
        setReceiveId(repairRecord.id);
        handleShowReceive();
    }


    return (
        <div className="content">

            <div className="contentInfo">
 
                <div className="headerPage">รายการบันทึกการซ่อมจำนวน {repairRecords.length} รายการ</div>

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
                                    <div className="flex justify-center p-1.5 gap-2">
                                        <button onClick={() => handleReceive(repairRecord)} className="rounded-md  text-[12px] px-2 py-1 bg-green-500  text-white active:scale-95 transition-all duration-150">รับเครื่อง</button>
                                        <button onClick={() => handleShowEdit(repairRecord)} className="rounded-md  text-[12px] px-2 py-1 bg-yellow-400 active:scale-95 transition-all duration-150">แก้ไข</button>
                                        <button onClick={() => handleDelete(repairRecord.id)} className="rounded-md  text-[12px] px-2 py-1 bg-red-500 text-white active:scale-95 transition-all duration-150">ลบ</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

            </div>
            
            <Modal title="รับเครื่อง" isOpen={showModalReceive} onClose={handleCloseReceive} size="lg">
             
                <div>ชื่อลูกค้า</div>
                <input className="modalInput" value={receiveCustomerName} readOnly/>
            
                <div>ค่าบริการ</div>
                <input className="modalInput" value={receiveAmount} onChange={(e) => setReceiveAmount(Number(e.target.value))}/>
             
                <div className="flex justify-center mt-4">
                    <button  className="btnsave" onClick={handleSaveReceive}>บันทึก</button>
                </div>

            </Modal>

            <Modal title="แก้ไข" isOpen={showModalEdit} onClose={handleCloseEdit} size="2xl">

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
                    <div className="w-52">ชื่ออุปกรณ์นอกระบบ :</div>
                    <input className="modalInput" value={deviceName} onChange={(e) => setDeviceName(e.target.value)}/>

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
                    <input className="modalInput" value={expireDate} onChange={(e) => setExpireDate(e.target.value)} type="date"/>
                </div>

                <div className="flex items-center">
                    <div className="w-52">อาการเสีย :</div>
                    <textarea className="modalInput" value={problem} onChange={(e) => setProblem(e.target.value)}></textarea>
                </div>

                <div className="flex justify-center mt-4">
                    <button className="btnsave" onClick={handleSaveEidt}>บันทึก</button>
                </div>
                
            </Modal>

        </div>
    );
}