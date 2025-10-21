# ITB-MShop (INTEGRATED-PROJECT01)

โปรเจกต์เว็บแอปพลิเคชัน E-Commerce สำหรับซื้อขายโทรศัพท์มือถือ พัฒนาขึ้นโดยใช้เทคโนโลยี Full-Stack ประกอบด้วย Frontend ที่สร้างด้วย Vue.js และ Backend ที่สร้างด้วย Spring Boot โดยใช้ MySQL เป็นฐานข้อมูล

## Live Demo 🌐

คุณสามารถลองใช้งานเว็บได้ที่นี่:
[คลิกเพื่อไปยังเว็บไซต์](https://intproj24.sit.kmutt.ac.th/ssi4/)

## สมาชิกในทีม

| รหัส        | ชื่อ - สกุล           | สัดส่วนการทำงาน |
| :---------- | :-------------------- | :------------- |
| 66130500023 | ชาคริต ภูแล่นนา      | 33%            |
| 66130500031 | ณัฐภัทร์ หลำนุ้ย      | 33%            |
| 66130500043 | ธิดารัตน์ ตั้งอนุศาสตร์ | 33%            |

## Screenshots 📸

**ตัวอย่าง:**
* **หน้าแสดงรายการสินค้า (Gallery View):**
<img width="1900" height="946" alt="image" src="https://github.com/user-attachments/assets/76050305-dd65-4294-adcc-edf31f962378" />

* **หน้ารายละเอียดสินค้า:**
<img width="1897" height="940" alt="image" src="https://github.com/user-attachments/assets/3ce7902f-5805-43bc-a7cf-524f8c714100" />

* **หน้าตะกร้าสินค้า:**
<img width="1897" height="937" alt="image" src="https://github.com/user-attachments/assets/db790478-54b2-44d4-95cc-101b23ededc7" />

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
    * Java 17 *(อิงจาก pom.xml)*
    * Spring Boot
    * Spring Data JPA
    * Spring Security
    * MySQL Connector/J (Database Driver)
    * Maven (Build Tool)
    * JWT (for Authentication)
    * Lombok
    * ModelMapper
* **Database:**
    * MySQL
* **Testing:**
    * Cypress (Frontend E2E Testing)

## การติดตั้งและใช้งาน (Setup & Installation)

### Prerequisites

* Node.js (แนะนำเวอร์ชัน LTS)
* npm หรือ yarn
* Java JDK 17 หรือสูงกว่า
* Maven
* MySQL Server

### Backend Setup

1.  **Clone Repository:**
    ```bash
    git clone <your-repository-url>
    cd INTEGRATED-PROJECT01/backend
    ```
2.  **Configure Database & Email:**
    * แก้ไขไฟล์ `src/main/resources/application.properties`
    * ตั้งค่า `spring.datasource.url`, `spring.datasource.username`, `spring.datasource.password` ให้ตรงกับ MySQL ของคุณ
    * ตั้งค่า `spring.mail.host`, `spring.mail.port`, `spring.mail.username`, `spring.mail.password` สำหรับการส่งอีเมลยืนยัน
    * สร้าง Database ชื่อ `itbms` (หรือตามที่ตั้งค่าใน `spring.datasource.url`)
3.  **Run Backend:**
    ```bash
    mvn spring-boot:run
    ```
    Backend จะทำงานที่ `http://localhost:8080` (ตามค่าเริ่มต้น)

### Frontend Setup

1.  **Navigate to Frontend Directory:**
    ```bash
    cd ../frontend
    ```
2.  **Install Dependencies:**
    ```bash
    npm install
    ```
3.  **Run Frontend:**
    ```bash
    npm run dev
    ```
    Frontend จะทำงานที่ `http://localhost:5173/ssi4/` (ตามค่าเริ่มต้น)

## โครงสร้างโปรเจกต์ (Project Structure)
