# Deployment Guide for Namecheap Shared Hosting

## Prerequisites

- Node.js installed on Namecheap (v18+) - Check in cPanel under "Software"
- cPanel access (provided by Namecheap)
- SSH access enabled in cPanel
- PM2 or Node.js process manager
- Public_html or addon domain folder access

## Step 1: Upload Your Project

1. **Compress your project:**

   ```bash
   # Don't include node_modules or dist
   zip -r kidztube-studio.zip . \
     -x "node_modules/*" "dist/*" ".git/*" "*.log"
   ```

2. **Via cPanel File Manager:**
   - Go to File Manager → Select public_html or your domain folder
   - Upload `kidztube-studio.zip`
   - Extract it

3. **Or via SSH (recommended):**
   ```bash
   scp kidztube-studio.zip username@hostdomain.com:~/
   ssh username@hostdomain.com
   cd ~
   unzip kidztube-studio.zip
   ```

## Step 2: Install Dependencies

```bash
cd /home/username/kidztube-studio
npm install --production
```

## Step 3: Build the Project

```bash
npm run build
```

## Step 4: Set Up Environment Variables

Create `.env` in your project root with your configuration:

```bash
cp .env.example .env
nano .env  # Edit with your values
```

## Step 5: Install PM2 (Global)

```bash
npm install -g pm2
```

## Step 6: Start the Application with PM2

```bash
pm2 start ecosystem.config.js --env production
pm2 startup
pm2 save
```

This ensures your app restarts automatically on server reboot.

## Step 7: Configure cPanel Domain/Addon Domain (Namecheap Specific)

1. Go to **cPanel → Addon Domains**
2. Add your domain or select existing
3. The public_html folder should already be created
4. Upload `.htaccess` file to the root of your domain folder
5. Verify proxy is enabled for your domain

### Namecheap Specific Notes:

- **Default Port**: Usually 3000 or 3001 (check with Namecheap support)
- **Node.js Location**: Check cPanel → Advanced → Node.js Selector
- **To enable Node.js on a domain**:
   1. Go to cPanel → Node.js Selector
   2. Click "Create Node.js App"
   3. Choose your domain and port
   4. Set app root to your project folder
   5. Application startup file: `dist/app.js`

## Step 8: Verify

```bash
# Check app status
pm2 status

# View logs
pm2 logs kidztube-studio

# Test connection
curl http://localhost:3000
```

## Port Configuration

Your app runs on port 3000 internally. The `.htaccess` file proxies all requests from port 80 (HTTP) to 3000.

If 3000 is in use, modify `ecosystem.config.js`:

```javascript
env: {
  NODE_ENV: 'production',
  PORT: 3001  // Change to different port
}
```

## Troubleshooting

**App won't start:**

```bash
pm2 logs kidztube-studio
```

**Permission denied:**

```bash
sudo chown -R $USER:$USER ~/kidztube-studio
```

**Module not found:**

```bash
npm install
```

**Database connection issues:**

- Check `.env` credentials
- Verify MongoDB/MySQL service is running
- Check database host/port in `.env`

### Namecheap-Specific Troubleshooting

**Node.js app not responding:**

1. Check if Node.js is actually enabled in cPanel
2. Verify the port is accessible (ask Namecheap support)
3. Check firewall rules in cPanel

**502 Bad Gateway error:**

- App crashed or not running
- Wrong port configuration
- `.htaccess` proxy not working

**Try using Namecheap's Node.js Manager instead of PM2:**

1. cPanel → Node.js Selector
2. Create/edit your Node.js app
3. Set startup file to `dist/app.js`
4. Namecheap will manage the process automatically

**SSH Connection Issues:**

1. Enable SSH in cPanel (Home → SSH Shell Access)
2. Use Namecheap's given SSH details
3. Check IP whitelisting if required

## Deployment Updates

For future deployments:

```bash
cd ~/kidztube-studio
git pull origin main  # or download new files
npm install
npm run build
pm2 restart kidztube-studio
```

Or restart all PM2 apps:

```bash
pm2 restart all
```

## Backup

Before deployment:

```bash
tar -czf backup.tar.gz dist node_modules
```

Store safely for rollback if needed.
