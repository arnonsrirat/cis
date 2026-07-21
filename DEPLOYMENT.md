# Deploy Banpick Rov ด้วย Docker

## Docker Image

ใช้ image นี้ให้ตรงกันทั้งเครื่อง build และ server:

```text
arnonsrirat/banpick-rov:latest
```

Build และ push จากเครื่องเรา:

```bash
docker login
docker buildx build -t arnonsrirat/banpick-rov:latest . --push
```

หรือ build แบบปกติแล้ว push:

```bash
npm run docker:build
docker push arnonsrirat/banpick-rov:latest
```

## ไฟล์ .env

วางไฟล์ `.env` ไว้ข้าง `docker-compose.yml` บน server:

```env
DB_HOST=mysql-main
DB_PORT=3306
DB_NAME=db_banpick_rov
DB_USER=web_admin
DB_PASSWORD=0902462746
NEXT_PUBLIC_APP_NAME=Banpick Rov
```

## docker-compose.yml บน server

Compose นี้ออกแบบให้รันหลัง nginx กลางใน Docker network เดียวกัน ไม่เปิด port 3000 ออก public โดยตรง:

```yaml
services:
  banpick-rov:
    image: arnonsrirat/banpick-rov:latest
    container_name: banpick-rov
    restart: unless-stopped
    env_file:
      - .env
    expose:
      - "3000"
    volumes:
      - ads_uploads:/app/public/uploads
    networks:
      - network_proxy

networks:
  network_proxy:
    external: true

volumes:
  ads_uploads:
```

## MySQL กลาง

ต้องมี container MySQL ชื่อ `mysql-main` อยู่ใน network `network_proxy`

```bash
docker network create network_proxy
```

ถ้าฐานข้อมูลยังไม่มีตาราง ให้รัน SQL:

```text
docker/mysql-init/001_schema.sql
```

Master เริ่มต้น:

- Username: `anonsrirat`
- Password: `0902462746Za@`

## รันบน server

```bash
docker compose pull
docker compose up -d
docker compose logs -f
```

## Nginx กลาง

ให้ reverse proxy ไปที่ container:

```text
http://banpick-rov:3000
```

โดเมนที่ใช้:

```text
https://rov.arnoncore.com
```

## ขนาดรูปตัวละคร

- รูปแนวนอน: `1280x720 px`
- รูปสี่เหลี่ยมจัตุรัส: `512x512 px`

## หน้าสำหรับ OBS

- Ban/Pick Overlay: `/overlay`
- โฆษณาเต็มจอ: `/ads-screen`
