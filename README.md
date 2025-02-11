# **ChEMBL Compound Information Dashboard**

## **📌 Overview**

The **ChEMBL Compound Information Dashboard** is a **full-stack web application** that allows users to **search, analyze, and visualize** chemical compound data from the **ChEMBL PostgreSQL database**.

✅ **Users can:**

- **Search compounds** by **ChEMBL ID, name, or synonyms**.
- **Filter compounds** based on molecular properties like molecular weight, LogP, HBA, HBD, etc.
- **Sort and paginate results** in an interactive table.
- **View compound details**, including **2D molecular structures**.
- **Analyze data using charts** (bar, pie, scatter plots).
- **Real-time updates** via WebSockets (optional).

---

## **🛠 Tech Stack**

### **Frontend:**

- **React.js** – UI Framework
- **Chart.js / D3.js** – Data Visualization
- **Material UI** – UI Components

### **Backend:**

- **Node.js with Express.js** – API Server
- **PostgreSQL** – Database
- **RESTful API / GraphQL** (REST API used for this implementation)
- **Socket.io** – Real-time updates (optional)

### **Database:**

- **ChEMBL PostgreSQL Database**
- Download Dataset: [ChEMBL 35 PostgreSQL Dump]
- Schema Reference: [ChEMBL Schema]

---

## **📂 Project Structure**

```
chembl-dashboard/
│── backend/                     # Express.js Backend
│   ├── server.js                 # Main API Server
│   ├── db.js                      # PostgreSQL Database Connection
│   ├── routes/                    # API Routes
│   ├── models/                    # Database Models
│   ├── package.json               # Backend Dependencies
│
│── frontend/                    # React.js Frontend
│   ├── src/
│   │   ├── components/            # UI Components
│   │   ├── pages/                 # Pages (Search, Detail, Charts)
│   │   ├── api.js                 # API Calls to Backend
│   │   ├── App.js                 # Main App Component
│   │   ├── index.js               # React Entry Point
│   ├── package.json               # Frontend Dependencies
│
│── README.md                     # Documentation
│── .env                           # Environment Variables
```

---

## **🚀 Setup Instructions**

### 📌 Step 1: Ensure ChEMBL Database is Available  
This project requires access to the **ChEMBL 35 PostgreSQL database**. Ensure the dataset is already **imported into PostgreSQL** before running the application.

If setting up for the first time, refer to the [official ChEMBL PostgreSQL dataset] and ensure the required tables (`molecule_dictionary`, `compound_structures`, `compound_properties`) are available.


2️⃣ **Extract & Restore Database**

```sh
tar -xvzf chembl_35_postgresql.tar.gz
pg_restore -U postgres -d chembl_db --no-owner chembl_35_postgresql.dmp
```

3️⃣ **Verify Data Import**

```sh
psql -U postgres -d chembl_db -c "SELECT COUNT(*) FROM molecule_dictionary;"
```

✅ Should return **2,496,335 records**.

---

### **📌 Step 2: Set Up Backend**

1️⃣ **Navigate to backend folder & Install Dependencies**

```sh
cd backend
npm install
```

2️⃣ **Configure `.env` file**

```sh
PORT=5000
DATABASE_URL=postgres://postgres:password@localhost:5432/chembl_db
```

3️⃣ **Run Backend Server**

```sh
npm start
```

✅ Server should start on **`http://localhost:5000`**.

---

### **📌 Step 3: Set Up Frontend**

1️⃣ **Navigate to frontend folder & Install Dependencies**

```sh
cd frontend
npm install
```

2️⃣ **Start Frontend**

```sh
npm run dev
```

✅ Frontend should be running on **`http://localhost:5173`**.

---

## **🎯 Features & Functionality**

### **🔹 Task 1: Compound Search & Filtering**

✅ **Search** compounds by **ChEMBL ID, name, or synonyms**.  
✅ **Advanced Filters**:

- Molecular weight range
- LogP (Lipophilicity)
- Hydrogen bond donors (HBD) & acceptors (HBA)
- PSA, Rotatable bonds, TPSA, Clinical Phase  
  ✅ **Multi-Select Filter UI** (Choose multiple molecule types).  
  ✅ **Sortable & Paginated Table**.

### **🔹 Task 2: Compound Detail Page + 2D Structure**

✅ Show **core details** (ChEMBL ID, Molecular Type, etc.).  
✅ **Display molecular structure** (SMILES format).  
✅ **Use OpenChemLib** for **2D Molecular Viewer**.

### **🔹 Task 3: Compound Data Visualization**

✅ **Bar Chart** – Molecular Weight Distribution  
✅ **Pie Chart** – Molecule Type Distribution  
✅ **Scatter Plot** – MW vs LogP  
✅ **Box Plot** – HBD & HBA Variability  
✅ **Dynamic Filters for Charts**

### **⚡ Bonus: Real-Time Chart Updates (WebSockets)**

✅ **Live chart updates using Socket.io**.  
✅ **Automatically updates compound statistics without refresh**.

---

## **📌 Screenshots**

### 🔹 **Dashboard Overview**

![Dashboard](frontend/public/dashboard.png)

### 🔹 **Compound Search**

![Search](frontend/public/Search.png)

### 🔹 **Compound Detail Page (2D Viewer)**

![Detail](frontend/public/details.png)

### 🔹 **Data Visualization Charts**

![Charts](frontend/public/chart.png)

---

## **🚀 Future Enhancements**

🔹 **Add Drug Target Analysis** – Show compound-protein interactions.  
🔹 **Improve UI with Dark Mode** – Enhance accessibility.  
🔹 **Implement GraphQL API** – More flexible queries.  
🔹 **Deploy on Cloud** – Host backend & frontend online.

---

## **🎯 Conclusion**

This **ChEMBL Compound Dashboard** is a **powerful tool** for **chemists & researchers** to **analyze molecular properties interactively**.

✅ **Features:**

- **Advanced Search & Filtering**
- **Sortable & Paginated Table**
- **2D Molecular Viewer**
- **Interactive Data Charts**
- **Real-Time Updates with WebSockets**


### **📌 Contributors**

👨‍💻 **Bhargavi Chella** – _Full Stack Developer_  
📩 Email: chellabhargavi2002@gmail.com  
📌 LinkedIn: [https://www.linkedin.com/in/bhargavichella/]
📌 Posrtfolio: [https://bhargavi35-portfolio.vercel.app/]

