"use client"

import Link from "next/link";

export function Sidebar() {

    let menuItems = [
        { title : "Dashboard", href: "/blackoffice/dashboard", icon: "fa-solid fa-chart-simple" },
        { title : "จัดการข้อมูลผู้ใช้", href: "/blackoffice/user", icon: "fa-solid fa-users"},
        { title: 'บันทึกการซ่อม', href: '/blackoffice/repair-record', icon: 'fa-solid fa-screwdriver' },
        { title: 'สถานะการซ่อม', href: '/blackoffice/repair-status', icon: 'fa-solid fa-gear' },
        { title: 'รายงานรายได้', href: '/blackoffice/income-report', icon: 'fa-solid fa-money-bill' },
        { title: 'ทะเบียนอุปกรณ์', href: '/blackoffice/device', icon: 'fa-solid fa-box' },
        { title: 'ข้อมูลร้าน', href: '/blackoffice/company', icon: 'fa-solid fa-shop' },
    ];

    return(
        <div className="min-h-screen w-56 bg-red-600">
            <div>
                <div>
                    <ul className="mt-5 space-y-2">

                        {menuItems.map((item) => (
                            <li key={item.title} className="flex items-center mx-3 p-2 nav-bar-link group">
                                <Link href={item.href} className="flex items-center text-white  group-hover:text-red-600">
                                <i className={item.icon + ' mr-2 w-6'}></i>
                                <span>{item.title}</span>   
                                </Link>
                            </li>
                        ))}

                    </ul>
                </div>
            </div>

        </div>
    );
}