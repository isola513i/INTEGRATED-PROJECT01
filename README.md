# ITB-MShop (INTEGRATED-PROJECT01)

โปรเจกต์เว็บแอปพลิเคชัน E-Commerce สำหรับซื้อขายโทรศัพท์มือถือ พัฒนาขึ้นโดยใช้เทคโนโลยี Full-Stack ประกอบด้วย Frontend ที่สร้างด้วย Vue.js และ Backend ที่สร้างด้วย Spring Boot โดยใช้ MySQL เป็นฐานข้อมูล

## สมาชิกในทีม

| รหัส        | ชื่อ - สกุล           | สัดส่วนการทำงาน |
| :---------- | :-------------------- | :------------- |
| 66130500023 | ชาคริต ภูแล่นนา      | 33%            |
| 66130500031 | ณัฐภัทร์ หลำนุ้ย      | 33%            |
| 66130500043 | ธิดารัตน์ ตั้งอนุศาสตร์ | 33%            |

## Features หลัก

* **User Management:**
    * สมัครสมาชิกสำหรับผู้ซื้อ (Buyer) และผู้ขาย (Seller)
    * ยืนยันตัวตนผ่านอีเมล
    * เข้าสู่ระบบด้วย Email และ Password
    * จัดการข้อมูลส่วนตัว (Profile Management)
    * ระบบ Authentication และ Authorization ด้วย JWT 
* **Product Catalog:**
    * แสดงรายการสินค้าในรูปแบบ Gallery
    * แสดงรายละเอียดสินค้า
    * ค้นหาสินค้า
    * กรองสินค้าตามยี่ห้อ (Brand), ราคา (Price), ขนาดความจุ (Storage Size)
    * เรียงลำดับสินค้า (Sort by Brand)
    * ระบบแบ่งหน้า (Pagination)
* **Product Management (สำหรับ Seller):**
    * แสดงรายการสินค้าของตนเอง
    * เพิ่ม/แก้ไข/ลบ สินค้า
    * อัปโหลดรูปภาพสินค้า (สูงสุด 4 รูป)
* **Brand Management:**
    * แสดงรายการยี่ห้อสินค้า
    * เพิ่ม/แก้ไข/ลบ ยี่ห้อสินค้า
* **Shopping Cart:**
    * เพิ่มสินค้าลงตะกร้า
    * ดูรายการสินค้าในตะกร้า
    * ปรับจำนวนสินค้า/ลบสินค้าออกจากตะกร้า
    * เลือกสินค้าในตะกร้าเพื่อสั่งซื้อ
* **Ordering:**
    * สั่งซื้อสินค้า (Place Order)
    * ดูประวัติการสั่งซื้อ (สำหรับ Buyer)
    * ดูรายละเอียดคำสั่งซื้อ

## Tech Stack

* **Frontend:**
    * Vue.js 3 
    * Vue Router
    * Pinia (State Management)
    * Tailwind CSS
    * Axios (HTTP Client - on `httpClient.js`)
    * Vite (Build Tool) 
* **Backend:**
    * Java 22
    * Spring Boot
    * Spring Data JPA
    * Spring Security
    * MySQL Connector/J (Database Driver)
    * Maven (Build Tool)
    * JWT (for Authentication)
    * Lombok
    * ModelMapper
