"use client"

import { useEffect, useState } from "react"
import dayjs from "dayjs"
import axios from "axios"
import config from "@/app/config"
import { list } from "postcss"

export default function Page () {

    const [startDate, setStartDate] = useState(dayjs().format("YYYY-MM-DD"));
    const [endDate, setEndDate] = useState(dayjs().format("YYYY-MM-DD"));
    const [listIncome, setListIncome] = useState<any[]>([]); // รายงานรายได้

    useEffect(() => {
        fetchIncome();
    }, []);

    const fetchIncome = async () => {
        const response = await axios.get(`${config.apiUrl}/api/income/report/${startDate}/${endDate}`);
        setListIncome(response.data);
        
    }
    
    return (
        <div className="content">
            <div className="contentInfo">
                <div className="headerPage">รายงานรายได้</div>
                <div className="flex gap-9 mt-4">
                    <div>
                        <div>จากวันที่</div>
                        <input type="date" className="modalInput" value={startDate} onChange={(e) => setStartDate(e.target.value)}/>
                    </div>

                    <div>
                        <div>ถึงวันที่</div>
                        <input type="date" className="modalInput" value={endDate} onChange={(e) => setEndDate(e.target.value)}/>
                    </div>

                    <div className="flex items-center mt-5">
                        <button className="btnsave" onClick={fetchIncome}>ค้นหา</button>
                    </div>
                </div>

                <table className="table table-striped mt-6">
                    <thead>
                        <tr>
                            <th>ลูกค้า</th>
                            <th>เบอร์โทรศัพท์</th>
                            <th>อุปกรณ์</th>
                            <th>วันที่แจ้งซ่อม</th>
                            <th>วันที่ชำระเงิน</th>
                            <th>จำนวนเงิน</th>
                        </tr>
                    </thead>
                    <tbody>
                        {listIncome.length > 0 && listIncome.map((item, index) => (
                            <tr key={index}>
                                <td>{item.customerName}</td>
                                <td>{item.customerPhone}</td>
                                <td>{item.deviceName}</td>
                                <td>{dayjs(item.createdAt).format("DD/MM/YYYY")}</td>
                                <td>{dayjs(item.payDate).format("DD/MM/YYYY")}</td>
                                <td>{item.amount.toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

            </div>
        </div>
    )
}