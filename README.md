# LifeDrop — Blood Donation Platform  

LifeDrop is a full-stack web application that bridges the gap between blood donors and recipients. It allows users to request blood, search for donors, donate, contribute funds, and interact with community content — all under a well-structured role-based system.

## 🛠️ Tech Stack  

- **Frontend:** React, Tailwind CSS, DaisyUI, React Hook Form, Motion, React Query, Axios, SweetAlert2, Recharts, Jodit-React, Stripe Integration  
- **Backend:** Node.js, Express.js, MongoDB, JWT Authentication, Stripe Payment API  
- **Authentication:** Firebase Authentication  
- **Deployment:** Vercel (Frontend), Render (Backend), MongoDB Atlas  

---

## 🚀 Live Demo  

# Live Link
[LifeDrop](https://life-drop-bd.netlify.app)

# Client Side Repository
[Client](https://github.com/Programming-Hero-Web-Course4/b11a12-client-side-Mysterio-O)

# Server Side Repository
[Server](https://github.com/Programming-Hero-Web-Course4/b11a12-server-side-Mysterio-O)

---

## 🌐 Admin Email + Password
 
 | Email               | Password   |
 |---------------------|------------|
 | **admin@gmail.com** | Admin123   |



 ---



## 🧑‍💻 User Roles & Permissions  

| Role      | Permissions |
|-----------|-------------|
| **Donor** | Browse & view donation requests, donate, search donors, donate funds, view blogs, comment, and send messages. |
| **Volunteer** | Manage all donation requests, create & manage blogs, view messages, mark requests as done. |
| **Admin** | Full access: manage users, donation requests, blogs, messages, publish/delete blogs, block/unblock users, assign roles. |

---

## 📝 Features Overview  

### 🩸 Blood Donation Features  
- Public access to **pending donation requests** (card format) on the home page  
- **Request Details Page** (login required): View full details & donate  
- **Donate Modal:** Captures donor info (auto-filled name/email, optional phone)  
- Donation status changes: `Pending` ➔ `In Progress` ➔ `Done` or `Canceled`  

### 🔍 Search Donor  
- Filter donors by **Blood Group**, **Division**, **District**, **Upazila**  

### 💳 Funding System  
- Donate funds via **Stripe Card Payment**  
- View all user contributions on the **Funding Page**  

### 📰 Blog System  
- View blogs posted by **Admin/Volunteers**  
- Like & comment on blogs  

### 📬 Contact Us  
- Contact form to send messages directly to **Volunteers/Admins**  

---

## 🎛️ Dashboard Overview  

The dashboard is role-based with server-side verification and contains:  
- **Sidebar Navigation**  
- **Main Content Panel**  
- **Account Management** (Switch Account / Logout)
- **Delete Account** (From Setting)

---

### 👤 User Dashboard  
- **Overview:** Recent 3 donation requests (view, update, delete)  
- **My Requests:** Manage all created donation requests with status filters  
- **Profile:** Update profile info (except email)  

---

### 🧑‍🤝‍🧑 Volunteer Dashboard  
- **All Donation Requests:** View & mark as done  
- **Content Management:**  
  - View, create, update blogs (blog content)  
  - Add blog with image upload & rich text editor  
- **Messages:**  
  - View unread messages, mark as read, delete  

---

### 🛡️ Admin Dashboard  
- Access to **all User** & **Volunteer** features  
- **All Users Management:**  
  - Filter users (Active/Blocked)  
  - Block/Unblock users  
  - Assign roles (Make Volunteer/Admin)  
- **All Messages:** Same as Volunteer view  
- **Content Management:** Full control over publishing & deleting blogs  

---

## 📊 Overview Section (Admin/Volunteer Dashboard)  
- Welcome message with dummy search bar  
- **3 Dynamic Data Cards:**  
  - Total Donation Requests  
  - Total Funding Amount  
  - Total Users Count  
- **3 Analytics Charts:**  
  - Bar Chart: Donation Requests by Status  
  - Line Chart: Static Data  
  - Pie Chart: Active vs Blocked Users  

---

## 📦 Package Dependencies  

### Key Frontend Dependencies  
- **React**  
- **React Router**  
- **Tailwind CSS & DaisyUI**  
- **React Hook Form**  
- **TanStack React Query**  
- **Motion**  
- **Jodit React (Rich Text Editor)**  
- **Axios**  
- **Firebase**  
- **Stripe Payment Integration**  

### Backend Dependencies  
- **Express.js**  
- **MongoDB**  
- **Stripe Node SDK**  
- **dotenv**  
- **CORS**  
- **Firebase Admin**  

---

## 🛠️ Scripts  

| Command | Description |
|---------|-------------|
| `npm run dev` | Run Vite development server |
| `npm run build` | Build project for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Lint the project |

---

## 🔒 Authentication & Authorization  

- **Firebase Authentication** with JWT secured APIs  
- Role-based access control on both client & server side  
- Private Routes with dynamic navigation  

---

## 💳 Stripe Payment Integration  

- Integrated with **Stripe React SDK** for secure payments  
- Funding records saved with donor details and amount  

---

## 📝 Future Improvements  

- Conversation-based messaging  
- Advanced analytics dashboard  
- Multi-language support  
- User activity logs  

---

## 🧑‍🎓 Developed By  

**Mysterio** — Full Stack Developer  

---

## 📄 License  

> This project is licensed under the [MIT License](LICENSE)  

---

## 📞 Contact  

> For any inquiries, contact at:  
`skrabbi.019@gmail.com`  

---

## 🔗 Contributing  

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.   

**added to public repository**