# วิธี Deploy Banpick Rov ด้วย Docker

## รูปภาพตัวละคร

- รูปแนวนอน: `1280x720 px` อัตราส่วน `16:9`
- รูปสี่เหลี่ยมจัตุรัส: `512x512 px` อัตราส่วน `1:1`

## Environment

ไฟล์ `.env` ถูกเตรียมไว้แล้ว:

```env
DB_HOST=mysql-main
DB_PORT=3306
DB_NAME=db_banpick_rov
DB_USER=web_admin
DB_PASSWORD=0902462746
```

## เตรียม MySQL กลาง

ระบบนี้คาดว่า MySQL container กลางชื่อ `mysql-main` อยู่ใน network `network_proxy`

```bash
docker network create network_proxy
```

ถ้า MySQL กลางยังไม่มี database/table ให้รัน SQL ในไฟล์:

```text
docker/mysql-init/001_schema.sql
```

Master เริ่มต้น:

- ชื่อผู้ใช้: `anonsrirat`
- รหัสผ่าน: `0902462746Za@`

ในฐานข้อมูลจะเก็บเป็น bcrypt hash ไม่ใช่ plain text

## Build บนเครื่องเราแล้ว Push ขึ้น Docker Hub

แก้ชื่อ image ใน `docker-compose.yml` ให้ตรง Docker Hub ของคุณ ถ้าต้องการเปลี่ยนจาก:

```text
anonsrirat/banpick-rov:latest
```

คำสั่ง build และ push:

```bash
docker build -t anonsrirat/banpick-rov:latest .
docker push anonsrirat/banpick-rov:latest
```

Dockerfile ใช้ multi-stage build และ Next.js standalone output เพื่อลดขนาด image ที่นำไปรันบน server

## ดึงไปรันบน Server

คัดลอกไฟล์ต่อไปนี้ไปไว้บน server:

- `docker-compose.yml`
- `.env`

จากนั้นรัน:

```bash
docker compose pull
docker compose up -d
```

เปิดใช้งาน:

- หน้าเว็บหลัก: `http://SERVER_IP:3000`
- หน้า overlay: `http://SERVER_IP:3000/overlay`
- หน้าโฆษณาเต็มจอสำหรับ OBS: `http://SERVER_IP:3000/ads-screen`

ไฟล์วิดีโอโฆษณาที่อัปโหลดจะเก็บใน Docker volume ชื่อ `ads_uploads` ที่ mount ไปยัง `/app/public/uploads`
