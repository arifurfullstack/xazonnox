# 🚀 Azonnox Live Deployment Guide (Dokploy + MongoDB Atlas)

This guide walks you through deploying your three apps (API, Admin Panel, and Storefront Theme) live onto your VPS using **Dokploy**, while keeping your database on **MongoDB Atlas**.

---

## 💾 Part 1: Database & Backups Q&A

### 1. Where is my database?
Your database is hosted in the cloud on **MongoDB Atlas** (using the connection string you set up: `mongodb+srv://arifurfullstack_db_user:...`). 
* When you deploy the API to your live VPS, it will connect to this cloud database over the internet.
* **This is ideal**: If your VPS crashes or restarts, your database remains safe and unaffected on MongoDB Atlas.

### 2. Is the free database enough?
* **Yes!** The MongoDB Atlas **Free Tier (M0)** gives you **512MB of storage**.
* For a starting shop with hundreds of products, categories, and customers, 512MB is **more than enough**.
* Once your traffic grows, you can upgrade to a paid shared or dedicated cluster on MongoDB Atlas with one click—no code changes required.

### 3. How do I get database backups?
* **Manual Backups**: You can connect to MongoDB Atlas using **MongoDB Compass** on your local computer, select any collection (like `products` or `users`), and click **"Export Collection"** to save it as JSON or CSV.
* **Command Line**: You can use the free utility `mongodump` from your command line:
  ```bash
  mongodump --uri="YOUR_MONGODB_URI" --out="./backup-folder"
  ```
* **Automated Backups**: If you upgrade to Atlas's paid tier, MongoDB automatically takes daily/hourly backups. Alternatively, Dokploy has a built-in database section where you can spin up a local MongoDB instance with automated backups to AWS S3, Google Cloud, or local storage.

---

## 🛠️ Part 2: Step-by-Step Dokploy Deployment

### Step 1: Push Your Code to GitHub
Ensure all your modifications (in `apix`, `adminx`, and `themex`) are pushed to a repository on GitHub (private is recommended).

### Step 2: Set Up DNS Records
Point your domain and subdomains to your VPS IP address. In your domain registrar (Cloudflare, Namecheap, GoDaddy, etc.), add the following **A records**:
* `yourdomain.com` ➔ `VPS_IP_ADDRESS`
* `www.yourdomain.com` ➔ `VPS_IP_ADDRESS` (optional)
* `api.yourdomain.com` ➔ `VPS_IP_ADDRESS`
* `admin.yourdomain.com` ➔ `VPS_IP_ADDRESS`

---

### Step 3: Deploy the NestJS API (`apix`)
1. Log in to your **Dokploy Dashboard** (usually at `http://your-vps-ip:3000`).
2. Create a new **Project** (e.g., `Azonnox`).
3. Click **Add Application**:
   * **Name**: `azonnox-api`
   * **Repository**: Select your GitHub repository.
   * **Branch**: `main` or `master`
   * **Root Directory**: `/apix`
   * **Build Type**: `Nixpacks` (Dokploy will auto-detect NestJS and compile it).
4. Go to the **Environment** tab and add your environment variables:
   * `PORT=3000`
   * `MONGODB_URI=mongodb+srv://arifurfullstack_db_user:NoiRbJnmdOf2CoCG@clusterx.ewqe3mi.mongodb.net/azonnox_db?retryWrites=true&w=majority`
   * `JWT_PRIVATE_KEY_USER=your_secure_random_key_1`
   * `JWT_PRIVATE_KEY_ADMIN=your_secure_random_key_2`
   * `JWT_PRIVATE_KEY_VENDOR=your_secure_random_key_3`
   * `JWT_PRIVATE_KEY_AFFILIATE=your_secure_random_key_4`
   * `JWT_PRIVATE_KEY_VENDOR_SECRET=your_secure_random_key_5`
   * `PRODUCTION_BUILD=true`
   * `THEME_TARGET_PATH=/app/themex` (if using dynamic theme builds)
5. Go to the **Domains** tab:
   * Add your API domain: `api.yourdomain.com`
   * Enable **HTTPS / SSL** (Dokploy handles automatic Let's Encrypt SSL certificates!).
6. Click **Deploy**.

---

### Step 4: Deploy the Admin Panel (`adminx`)
The Admin panel is a static Angular web application.
1. In your project, click **Add Application**:
   * **Name**: `azonnox-admin`
   * **Root Directory**: `/adminx`
   * **Build Type**: `Nixpacks` (or configure a standard SPA static server).
2. Ensure that your Admin environment configuration points to `https://api.yourdomain.com/api` instead of `http://localhost:3000/api`.
3. In **Domains**:
   * Add `admin.yourdomain.com`
   * Enable **HTTPS / SSL**.
4. Click **Deploy**.

---

### Step 5: Deploy the Storefront Theme (`themex`)
The Storefront Theme is an Angular SSR (Server-Side Rendered) application.
1. Click **Add Application**:
   * **Name**: `azonnox-theme`
   * **Root Directory**: `/themex`
   * **Build Type**: `Nixpacks`.
2. Ensure the storefront's dynamic API endpoint points to `https://api.yourdomain.com/api`.
3. Update `shop-settings.json` inside the container/repository to use your live shop ID.
4. In **Domains**:
   * Add `yourdomain.com` (and optionally `www.yourdomain.com`).
   * Enable **HTTPS / SSL**.
5. Click **Deploy**.

---

## 🎉 Done!
Dokploy will monitor your GitHub repository. Whenever you push code to GitHub, Dokploy will automatically rebuild and redeploy your live website!
