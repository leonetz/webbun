"use client"

import { useState, useEffect } from "react";
import axios from "axios";
import config from "@/app/config";
import Swal from "sweetalert2";
import Modal from "@/app/components/modal";

export default function Page() {
    const [showModal, setShowModal] = useState(false);
    const [users, setUsers] = useState([]);
    
    const [id, setId] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [level, setLevel] = useState("admin");
    const [levles, setLevels] = useState(["admin", "user", "engineer"]);
    
    const [departments, setDepartments] = useState([]);
    const [sections, setSections] = useState([]);
    const [sectionId, setSectionId] = useState('');
    const [departmentId, setDepartmentId] = useState('');
    
    const fetchDepartments = async () => {
        const response = await axios.get(`${config.apiUrl}/api/department/list`);
        setDepartments(response.data);
        
        if (response.data.length > 0) {
            setDepartmentId(response.data[0].id);
            fetchSections(response.data[0].id);
        }
    }
    
    const fetchSections = async (departmentId: string) => {
        const response = await axios.get(`${config.apiUrl}/api/section/listByDepartment/${departmentId}`);
        setSections(response.data);
    
        if (response.data.length > 0) {
            setSectionId(response.data[0].id);
        } else {
            setSectionId(""); // ถ้าไม่มี section ให้ reset ค่า
        }
    }
    

    const handleChangeDepartment = (departmentId: string) => {
        setDepartmentId(departmentId);
        fetchSections(departmentId);
    }

    const fetchUsers = async () => {
        const response = await axios.get(`${config.apiUrl}/api/user/list`);
        setUsers(response.data);
    }

    useEffect(() => {
        fetchUsers();
        fetchDepartments(); // เมื่อเพจโหลดจะดึงข้อมูล Department
    }, []);

 


    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleShowModal = () => {
        handleCloseModal(); 
        setUsername("");
        setPassword("");
        setLevel("admin");
        setName("");
        setId("");
        setShowModal(true);
    };


    const handleSave = async () => {
        try {
            if (!username) {
                Swal.fire({
                    icon: 'error',
                    title: 'ไม่สามารถบันทึกได้',
                    text: 'โปรดระบุ Username',
                });
                return;
            }

            const payload = {
                id : id,
                username: username,
                password: password,
                level: level,
                name: name,
                sectionId: parseInt(sectionId)
            }

            if (id == '') {
                await axios.post(`${config.apiUrl}/api/user/create`, payload);
            } else {
                await axios.put(`${config.apiUrl}/api/user/updateUser/${id}`, payload);
            }

            fetchUsers();
  
            

        } catch (error: any) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message
            });
        }
    }

    const handleEdit = async (user: any) => {
        setId(user.id);
        setUsername(user.username);
        setPassword(user.password);
        setName(user.name);
        setLevel(user.level);
        setShowModal(true);

        const selectDepartmentId = user?.section?.department?.id ?? (departments[0] as any).id;
        setDepartmentId(selectDepartmentId);

        await fetchSections(selectDepartmentId);

        const sectionId = user?.section?.id;
        setSectionId(sectionId);
        
    }

    const handleDelete = async (id: string) => {
        try {
            const result = await Swal.fire({
                icon: "question",
                text: "คุณต้องการลบข้อมูลหรือไม่?",
                showCancelButton: true,
                confirmButtonText: "ยืนยัน",
                cancelButtonText: "ยกเลิก",
            });
    
            if (result.isConfirmed) {  
                await axios.delete(`${config.apiUrl}/api/user/remove/${id}`);
                fetchUsers();
                Swal.fire({
                    icon: "success",
                    title: "ลบข้อมูลสำเร็จ!",
                });
            }
        } catch (error: any) {
            Swal.fire({
                icon: "error",
                title: "เกิดข้อผิดพลาด",
                text: error.message 
            });
        }
    }
    


    return (
        <div className="content">
            <div className="contentInfo">
                <div className="headerPage">
                    จัดการข้อมูลผู้ใช้
                    <span className="ml-2 text-red-600">({users.length})</span>
                </div>
                <button
                    onClick={handleShowModal}
                    className="active:scale-95 transition-all duration-150 mt-4 bg-blue-600 p-3 text-sm rounded-xl text-white"
                >
                    <i className="fa-solid fa-plus mr-2"></i>เพิ่มข้อมูลผู้ใช้
                </button>

                <table className="table table-striped mt-5">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Username</th>
                            <th>Password</th>
                            <th>แผนก</th>
                            <th>ฝ่าย</th>
                            <th>ดำเนินการ</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user: any) => (
                            <tr key={user.id}>
                                <td>{user.name}</td>
                                <td>{user.username}</td>
                                <td>{user.password}</td>
                                <td>{user?.section?.department?.name}</td>
                                <td>{user?.section?.name}</td>
                                <td className="w-44">
                                    <div className="flex items-center justify-center gap-2 p-2 w-full h-full">
                                        <button onClick={() => handleEdit(user)} className="rounded-md w-14 text-[12px] px-2 py-1 bg-yellow-400 active:scale-95 transition-all duration-150">
                                            แก้ไข
                                        </button>
                                        <button onClick={() => handleDelete(user.id)} className="rounded-md w-14 text-[12px] px-2 py-1 bg-red-500 text-white active:scale-95 transition-all duration-150">
                                            ลบ
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Modal title="เพิ่มข้อมูลผู้ใช้" isOpen={showModal} onClose={handleCloseModal}>
                <div>Username :</div>
                <input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    type="text"
                    className="modalInput"
                />

                <div>Password :</div>
                <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type="text"
                    className="modalInput"
                />

                <div>ชื่อพนักงาน :</div>
                <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    type="text"
                    className="modalInput"
                />

                <div>สิทธิ์การใช้งาน :</div>
                <select
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                    className="modalInput"
                >
                    {levles.map((level: any) => (
                        <option key={level} value={level}>
                            {level}
                        </option>
                    ))}
                </select>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <div>Department</div>
                        <select className="modalInput"
                            value={departmentId}
                            onChange={(e) => handleChangeDepartment(e.target.value)}>
                            {departments.map((department: any) => (
                                <option key={department.id} value={department.id}>
                                    {department.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <div>Section</div>
                        <select className="modalInput"
                            value={sectionId}
                            onChange={(e) => setSectionId(e.target.value)}>
                            {sections.map((section: any) => (
                                <option key={section.id} value={section.id}>
                                    {section.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="flex items-center justify-center mt-2">
                    <button onClick={handleSave}  className="bg-green-500 text-white border shadow-md w-24 p-2 rounded-md transition-all duration-200 hover:bg-green-600 active:scale-95">
                        บันทึก
                    </button>
                </div>
            </Modal>
        </div>
    );
}
