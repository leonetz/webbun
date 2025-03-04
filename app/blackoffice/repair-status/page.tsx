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
    const [id, setId] = useState(0);
    const [status, setStatus] = useState("");
    const [solving, setSolving] = useState("");
    const [statusList, setStatusList] = useState([
        {value : "active", label : "รอซ่อม"},
        {value : "pending", label : "รอลูกค้ายืนยัน"},
        {value : "repairing", label : "กำลังซ่อม"},
        {value : "done", label : "ซ่อมเสร็จ"},
        {value : "cancel", label : "ยกเลิก"},
        {value : "complete", label : "ลูกค้ามารับอุปกรณ์"},
    ])
    const [statusForFilter, setStatusForFilter] = useState("");
    const [tempRepairRecords, setTempRepairRecords] = useState([]);
    const [engineers, setEngineers] = useState([]);
    const [engineerId, setEngineerId] = useState(0);

    const [showModalEdit,setShowModalEdit] = useState(false);

    const fetchRepairRecords = async () => {
        try {
            const response = await axios.get(`${config.apiUrl}/api/repairRecords/list`);
            setRepairRecords(response.data);
            setTempRepairRecords(response.data);
        } catch (error : any) {
            Swal.fire({
                icon : "error",
                title : "เกิดข้อผิดพลาด",
                text : error.message,
            }); 
        }
    }

    const fetchEngineers = async () => {
        try {
            const response = await axios.get(`${config.apiUrl}/api/user/listEngineer`);
            setEngineers(response.data);
            setEngineerId(response.data[0].id);
        } catch (error : any) {
            Swal.fire({
                icon : "error",
                title : "เกิดข้อผิดพลาด",
                text : error.message,
            });
        }
    }

    useEffect(() => {
        fetchRepairRecords();
        fetchEngineers();
    }, []);

    const getStatusName = (status : string) => {
        const statusObj = statusList.find((item : any) => item.value === status);
        return statusObj?.label ?? "รอซ่อม";
    }

    const handleFilter = (statusForFilter : string) => {
        if (statusForFilter) {
            const filteredRecords = tempRepairRecords.filter((repairRecord : any) => repairRecord.status === statusForFilter);
            setRepairRecords(filteredRecords);
            setStatusForFilter(statusForFilter);
        } else {
            setRepairRecords(tempRepairRecords);
            setStatusForFilter("");
        }
    }

    const handleEdit = (id : number) => {
        const repairRecord =  repairRecords.find((repairRecord : any) => repairRecord.id === id) as any;

        if (repairRecord) {
            setEngineerId(repairRecord?.engineerId ?? 0);
            setId(id);
            setStatus(repairRecord?.status ?? "");
            setSolving(repairRecord?.solving ?? "");
            setShowModalEdit(true);
            console.log(id);
            
        }

    }

    const handleCloseEdit = () => {
        setShowModalEdit(false);
    }

    const handleSaveEdit = async () => {
        try {
            const payload = {
                status : status,
                solving : solving,
                engineerId : engineerId,
            }
            
            const result = await Swal.fire({
                icon : "question",
                text : "คุณต้องการเปลี่ยนสถานะหรือไม่",
                confirmButtonText : "ยินยัน",
                cancelButtonText : "ยกเลิก",
                showCancelButton : true,
            })

            if (result.isConfirmed) {
                await axios.put(`${config.apiUrl}/api/repairRecord/updateStatus/${id}`, payload);
                Swal.fire({
                    icon : "success",
                    text : "บันทึกข้อมูลสำเร็จ"
                });
                fetchRepairRecords();
                setShowModalEdit(false)
            }

        } catch (error : any) {
            Swal.fire({
                icon : "error",
                title : "เกืดข้อผิดพลาด",
                text : error.message,
            });
        }

    }


    return (
        <div className="content">

            <div className="contentInfo">
 
                <div className="headerPage">สถานะการซ่อม {repairRecords.length} รายการ</div>


                <div className="w-40">
                    <select className="modalInput" value={statusForFilter} onChange={(e) => handleFilter(e.target.value)}>
                        <option value="">---- ทั้งหมด ----</option>
                        {statusList.map((item : any) => (
                            <option value={item.value} key={item.value}>
                                {item.label}
                            </option>
                        ))}
                    </select>
                </div>

                <table className="table table-striped mt-6">
                    <thead>
                        <tr>
                            <th>ช่างซ่อม</th>
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
                                <td>{repairRecord.engineer?.name ?? "-"}</td>
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
                                        <button onClick={() => handleEdit(repairRecord.id)} className="rounded-md  text-[12px] px-2 py-1 bg-green-500  text-white active:scale-95 transition-all duration-150">ปรับสถานะ</button>
                                        
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

            </div>

            <Modal title="เปลี่ยนสถานะ" isOpen={showModalEdit} onClose={handleCloseEdit}>
                <div>เลือกสถานะ</div>
                <select className="modalInput" value={status} onChange={(e) => setStatus(e.target.value)}>
                    {statusList.map((itme : any) => (
                        <option value={itme.value} key={itme.value}>
                            {itme.label}
                        </option>
                    ))}

                </select>
                <div>เลือกช่างซ่อม</div>
                <select className="modalInput" value={engineerId} onChange={(e) => setEngineerId(Number(e.target.value))}>
                    {engineers.map((engineer : any) => (
                        <option value={engineer.id} key={engineer.id}>
                            {engineer.name}
                        </option>
                    ))}
                
                </select>
                <div>การแก้ไข</div>
                <textarea className="modalInput" value={solving} onChange={(e) => setSolving(e.target.value)}></textarea>

                <div className="flex justify-center mt-4">
                    <button className="btnsave" onClick={handleSaveEdit} >บันทีก</button>
                </div>
            </Modal>
            

        </div>
    );
}