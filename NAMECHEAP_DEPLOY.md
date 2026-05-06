# Namecheap Deployment Quick Start

## Quick Deploy Steps

### 1. Prepare Locally

```bash
npm run build
```

### 2. Upload to Namecheap

**Via FTP/SFTP:**

- Download your domain's SFTP credentials from Namecheap
- Connect to `sftp.yourserver.com` or similar
- Upload entire project folder (excluding `node_modules/.git`)
- Overwrite/update files as needed

**Via cPanel File Manager:**

- Login to cPanel
- Upload as ZIP, then extract

**Via SSH (Best):**

```bash
ssh cpaneluser@yourserver.com
cd public_html/your-domain-folder
# Upload files here
```

### 3. Setup on Server

```bash
cd /home/cpaneluser/public_html/your-domain-folder
npm install --production
npm run build
```

### 4. Start Node.js App

**Option A: Use Namecheap's Node.js Selector (Recommended)**

1. Go to cPanel
2. Find "Node.js Selector" (under Software)
3. Click "Create Node.js App"
4. Select your domain
5. Choose port (3000 or ask Namecheap)
6. Set "Application startup file" to: `dist/app.js`
7. Click Create
8. Done! App auto-starts

**Option B: Use PM2**

```bash
npm install -g pm2
pm2 start ecosystem.config.js --env production
pm2 startup
pm2 save
```

### 5. Access Your App

Your app will be available at: `https://yourdomain.com`

The `.htaccess` file automatically proxies requests to the Node.js port.

## Your App Structure for Namecheap

```
/home/cpaneluser/public_html/yourdomain.com/
├── .htaccess          (proxy rules)
├── ecosystem.config.js
├── package.json
├── .env               (create this)
├── dist/              (compiled JS - created after npm run build)
│   ├── app.js
│   └── app/
└── app/               (source TypeScript)
    ├── app.ts
    └── ...
```

## Environment Setup

Create `.env` file in your project root:

```env
PORT=3000
NODE_ENV=production

# Database
DB_HOST=localhost
DB_USER=your_db_user
DB_PASS=your_db_pass
DB_NAME=your_db_name
DB_PORT=3306

# Other configs
JWT_SECRET=your_secret_key
API_URL=https://yourdomain.com
```

## Database on Namecheap

Check if MySQL/MongoDB is available:

**For MySQL:**

- Included with hosting
- Create database in cPanel → MySQL Databases
- Get connection details for `.env`

**For MongoDB:**

- May need to request from Namecheap
- Or use MongoDB Atlas (cloud)
- Use connection string in `.env`

## Update Your App Later

```bash
cd /home/cpaneluser/public_html/yourdomain.com
# Pull new code or upload new files
npm install
npm run build

# If using Node.js Selector: it auto-restarts
# If using PM2:
pm2 restart all
```

## Contact Namecheap Support

If you have issues:

- **Node.js not found**: Ask support to enable Node.js
- **Port 3000 blocked**: Ask about available ports
- **Database issues**: Confirm MySQL/MongoDB is available
- **SSH access**: Request SSH enable in control panel

Keep your Namecheap support ticket handy! 🎯
