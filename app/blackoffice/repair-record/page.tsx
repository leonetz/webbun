"use client"

import { useState, useEffect } from "react";
import config from "@/app/config";
import axios from "axios";
import Swal from "sweetalert2";
import Modal from "@/app/components/modal";
import dayjs from "dayjs";

export default function Page () {
    const [devices, setDevices] = useState([]);
    const [repairRecords, SetRepairRecords] = useState([]);

    const [showModal, setShowModal] = useState(false);
    const [customerName, setCustomerName] = useState("");
    const [customerPhone, setCustomerPhone] = useState("");
    const [deviceName, setDeviceName] = useState("");
    const [deviceBarcode, setDeviceBarcode] = useState("");
    const [deviceSerial, setDeviceSerial] = useState("");
    const [problem, setProblem] = useState("");
    const [deviceId, setDeviceId] = useState("");
    const [expairDate, setExpairDate] = useState("");

    useEffect(() => {
        fetchDevices();
    }, []);

    const fetchDevices = async () => {
        const  response = await axios.get(`${config.apiUrl}/api/device/list`);
        setDevices(response.data);
    }

    const handleCloseModal = () => {
        setShowModal(false);
    }

    const handleShowModal = () => {
        setShowModal(true);
    }

    const handleDeviceChange = (deviceId: string) => {
        const device = (devices as any).find((device: any) => device.id === parseInt(deviceId));
        
        if(device) {
            setDeviceId(device.id);
            setDeviceName(device.name);
            setDeviceBarcode(device.barcode);
            setDeviceSerial(device.serial);
            setExpairDate(dayjs(device.expireDate).format("YYYY-MM-DD"));
        } else {
            setDeviceId("");
            setDeviceName("");
            setDeviceBarcode("");
            setDeviceSerial("");
            setExpairDate("");
        }
    }

    const handleSave = async () => {
        const payload = {
            customerName: customerName,
            customerPhone: customerPhone,
            deviceId: deviceId,
            deviceName: deviceName,
            deviceBarcode: deviceBarcode,
            deviceSerial: deviceSerial,
            problem: problem,   

        }

        try {
            await axios.post(`${config.apiUrl}/api/repairRecord/create`, payload);
            Swal.fire({
                icon: "success",
                title: "บันทึกข้อมูล",
                text: "บันทึกข้อมูลเรียบร้อย",
                timer: 1000
            });
            handleCloseModal();
        } catch (error : any) {
            Swal.fire({
                icon: "error",
                title: "error",
                text: error.message,
            });
        }
    }
    

    return (
        <div className="content">
            <div className="contentInfo">
                <div className="headerPage">บันทึกการซ่อม</div>
                <button onClick={handleShowModal} className="linkActive mt-2">เพิ่มการซ่อม</button>

            </div>

            <Modal title="เพิ่มข้อมูลการซ่อม" isOpen={showModal} onClose={handleCloseModal}>
                <div className="flex w-full gap-4">
                     <div className="w-1/2">
                        <div>ชื่อลูกค้า</div>
                        <input type="text" className="modalInput" value={customerName}
                            onChange={(e) => setCustomerName(e.target.value)}/>
                     </div>
                     <div className="w-1/2">
                        <div>เบอร์โทรศัพท์</div>
                        <input type="text" className="modalInput" value={customerPhone}
                            onChange={(e) => setCustomerPhone(e.target.value)}/>
                     </div>
                </div>

                <div>
                    <div>ชื่ออุปกรณ์ในระบบ</div>
                    <select className="modalInput" value={deviceId} onChange={(e) => handleDeviceChange(e.target.value)}>
                        <option value="">--- เลือกอุปกรณ์ ---</option>
                        {devices.map((device :any) =>(
                            <option key={device.id} value={device.id}>
                                {device.name}
                            </option>
                        ))}

                    </select>

                </div>

                <div>
                    <div>ชื่ออุปกรณ์นอกระบบ</div>     
                </div>

                <div className="flex w-full gap-4">
                     <div className="w-1/2">
                        <div>barcode</div>
                        <input type="text" className="modalInput" value={deviceBarcode}
                            onChange={(e) => setDeviceBarcode(e.target.value)}/>
                     </div>
                     <div className="w-1/2">
                        <div>serial</div>
                        <input type="text" className="modalInput" value={deviceSerial}
                            onChange={(e) => setDeviceSerial(e.target.value)}/>
                     </div>
                </div>

                <div>
                    <div>วันหมดประกัน</div>
                    <input type="date" className="modalInput" value={expairDate}
                        onChange={(e) => setExpairDate(e.target.value)}/>
                </div> 

                <div>
                    <div>อาการเสีย</div>
                    <textarea className="modalInput" value={problem}
                        onChange={(e) => setProblem(e.target.value)}></textarea>
                </div>

                <div className="flex justify-center">
                    <button onClick={handleSave} className="btnsave">บันทึก</button>
                </div>
            </Modal>

        </div>
    );
}