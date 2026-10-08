# Deploy `new-suvvidha` on AWS EC2 (Free Tier)

## 1) Rotate leaked MongoDB credentials

Because a full MongoDB URI was exposed, rotate credentials first:

1. Open MongoDB Atlas -> Database Access.
2. Change/reset the user password used by this app.
3. If needed, create a new dedicated application user.
4. Update `MONGO_URI` on the server with the new password.

Also review Atlas Network Access to allow only required IPs.

---

## 2) Launch EC2 instance

- AMI: Ubuntu LTS
- Instance type: `t2.micro` or `t3.micro` (free tier eligible)
- Security Group inbound:
  - `22` (SSH)
  - `80` (HTTP)
  - `443` (HTTPS)

Do not expose the Node app port publicly when using Nginx.

---

## 3) Install runtime dependencies

```bash
sudo apt update && sudo apt upgrade -y
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt install -y nodejs nginx
sudo npm install -g pm2
```

Verify:

```bash
node -v
npm -v
pm2 -v
nginx -v
```

---

## 4) Deploy application

```bash
cd /var/www
sudo mkdir -p new-suvvidha
sudo chown -R $USER:$USER /var/www/new-suvvidha
cd /var/www/new-suvvidha

git clone https://github.com/tychesbd/new-suvvidha.git .
```

Install dependencies and build frontend:

```bash
cd /var/www/new-suvvidha/server
npm install
npm run build-client
```

Create server env file:

```bash
cp /var/www/new-suvvidha/server/.env.example /var/www/new-suvvidha/server/.env
nano /var/www/new-suvvidha/server/.env
```

Set values in `.env`:

- `NODE_ENV=production`
- `PORT=5000`
- `MONGO_URI=<new-rotated-mongodb-uri>`
- `JWT_SECRET=<strong-random-secret>`
- `EMAIL_USER=<smtp-user>`
- `EMAIL_PASS=<smtp-password-or-app-password>`

Run app with PM2:

```bash
cd /var/www/new-suvvidha/server
pm2 start index.js --name new-suvvidha-server
pm2 save
pm2 startup
```

Run the printed `pm2 startup` command with sudo once, then `pm2 save` again.

---

## 5) Configure Nginx reverse proxy

Create site config:

```bash
sudo nano /etc/nginx/sites-available/new-suvvidha
```

Use:

```nginx
server {
    listen 80;
    server_name <your-domain-or-ec2-public-dns>;

    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable and restart:

```bash
sudo ln -s /etc/nginx/sites-available/new-suvvidha /etc/nginx/sites-enabled/new-suvvidha
sudo nginx -t
sudo systemctl restart nginx
```

---

## 6) Add HTTPS with Let's Encrypt

Point your domain DNS A record to EC2 public IP, then:

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d <your-domain>
```

Test renewal:

```bash
sudo certbot renew --dry-run
```

---

## 7) Verify deployment

1. API health:
   - `https://<domain>/api` should return `{"message":"API is running..."}`
2. Frontend routes:
   - home page loads
   - deep-link refresh works (for example `/login`)
3. Upload flow works (`/uploads` served)
4. MongoDB connectivity verified from app logs:
   - `pm2 logs new-suvvidha-server`

---

## 8) Maintenance checklist

- Keep system packages updated regularly (`apt update && apt upgrade`).
- Keep Node dependencies updated when needed.
- Monitor with `pm2 logs` and `pm2 status`.
- If app crashes, inspect logs and restart: `pm2 restart new-suvvidha-server`.
- Keep secrets only in `/server/.env`; never commit real credentials.
