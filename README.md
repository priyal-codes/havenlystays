# 🏡 HavenlyStays — Full-Stack Vacation Rental Platform

[![Live Demo](https://img.shields.io/badge/Live_Demo-Render-brightgreen?style=for-the-badge&logo=render)](https://havenlystays-tssx.onrender.com)
[![Node.js](https://img.shields.io/badge/Node.js-v20+-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-v5.2-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB Atlas](https://img.shields.io/badge/MongoDB_Atlas-Cloud_DB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/cloud/atlas)
[![Cloudinary](https://img.shields.io/badge/Cloudinary-Media_Storage-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white)](https://cloudinary.com/)

**HavenlyStays** is a full-stack web application designed for booking and listing vacation homes, luxury stays, and unique properties worldwide (inspired by Airbnb). Users can discover featured properties, list their own spaces with image uploads, submit reviews, and manage property details with authorization controls.

🔗 **Live Application URL**: [https://havenlystays-tssx.onrender.com](https://havenlystays-tssx.onrender.com)

---

## ✨ Features

- **🏠 Explore & Search Stays**: Browse diverse property listings with details on location, country, pricing, and high-quality imagery.
- **➕ Property Listing Management (CRUD)**: Create, view, update, and delete property listings with image uploading.
- **⭐ Ratings & Reviews**: Registered users can leave ratings and detailed reviews on property listings.
- **🔐 Authentication & Security**: Complete user registration, login/logout flow powered by Passport.js, salted password hashing, and session management.
- **🛡️ Authorization & Middleware**: Strict owner-based permissions preventing unauthorized modification or deletion of listings and reviews.
- **🖼️ Cloud Image Storage**: Integrated with **Cloudinary** and **Multer** for seamless image upload and cloud management.
- **💾 Session Persistence**: Mongo Session Store (`connect-mongo`) ensuring persistent user sessions across server reboots.
- **🔔 Real-time Flash Messages**: Instant user feedback alerts for registration, login, updates, and errors.
- **🧹 Cascading Deletes**: Mongoose post hooks automatically clean up associated reviews when a listing is deleted.

---

## 🛠️ Tech Stack

### **Frontend**
- **Template Engine**: [EJS](https://ejs.co/) & [EJS-Mate](https://github.com/mde/ejs) (Layouts & Partials)
- **Styling**: HTML5, CSS3, Bootstrap 5, Custom Responsive Layouts

### **Backend**
- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express.js](https://expressjs.com/) (v5.2)
- **Authentication**: [Passport.js](http://www.passportjs.org/) (`passport-local`, `passport-local-mongoose`)
- **Session & Flash**: `express-session`, `connect-mongo`, `connect-flash`
- **Validation**: [Joi](https://joi.dev/) schema validation middleware

### **Database & Cloud Infrastructure**
- **Database**: [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (Cloud Cluster)
- **ODM**: [Mongoose](https://mongoosejs.com/) (v7.8)
- **Media Hosting**: [Cloudinary API](https://cloudinary.com/) with `multer-storage-cloudinary`
- **Deployment**: [Render](https://render.com/) Web Service

---

## 📁 Project Structure

```
HavenlyStays/
├── cloudConfig.js         # Cloudinary storage configuration
├── controllers/           # MVC controllers (listings, reviews, users)
│   ├── listings.js
│   ├── reviews.js
│   └── users.js
├── init/                  # Database seeding script & mock data
│   ├── data.js
│   └── index.js
├── middleware.js          # Authentication, validation & authorization middleware
├── models/                # Mongoose Schemas (Listing, Review, User)
│   ├── listing.js
│   ├── review.js
│   └── user.js
├── public/                # Static assets (CSS, JS, images)
├── routes/                # Express router modules
│   ├── listing.js
│   ├── review.js
│   └── user.js
├── schema.js              # Joi validation schemas
├── utils/                 # Async wrap & custom error handlers
│   ├── ExpressError.js
│   └── wrapAsync.js
├── views/                 # EJS view templates & layouts
│   ├── includes/          # Header, footer, flash partials
│   ├── layouts/           # Boilerplate layout template
│   ├── listings/          # Listing views (index, show, new, edit)
│   └── users/             # Login & signup views
├── app.js                 # Application entry point & server setup
├── package.json           # Node dependencies & npm scripts
└── README.md              # Project documentation
```

---

## 🚀 Getting Started Locally

Follow these steps to set up and run HavenlyStays on your local machine:

### **Prerequisites**
- [Node.js](https://nodejs.org/) (v18 or higher)
- [Git](https://git-scm.com/)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account (or local MongoDB server)
- [Cloudinary](https://cloudinary.com/) account for image uploads

### **Installation**

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/priyal-codes/havenlystays.git
   cd havenlystays
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the root directory:
   ```env
   ATLASDB_URL=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/havenly_stays?retryWrites=true&w=majority
   SECRET=your_super_secret_session_key
   CLOUD_NAME=your_cloudinary_cloud_name
   CLOUD_API_KEY=your_cloudinary_api_key
   CLOUD_API_SECRET=your_cloudinary_api_secret
   ```

4. **Seed Initial Sample Data (Optional)**:
   ```bash
   node init/index.js
   ```

5. **Start the Application**:
   ```bash
   npm start
   ```
   Open your browser and navigate to `http://localhost:8080`.

---

## 🔑 Environment Variables Reference

| Variable | Description |
|---|---|
| `ATLASDB_URL` | MongoDB Atlas cluster connection string |
| `SECRET` | Session secret key for session encryption |
| `CLOUD_NAME` | Cloudinary Account Cloud Name |
| `CLOUD_API_KEY` | Cloudinary API Key |
| `CLOUD_API_SECRET` | Cloudinary API Secret |
| `PORT` | Dynamic port for deployment (defaults to `8080` locally) |

---

## 🌐 Deployment

The application is deployed on **Render**:
- **Live URL**: [https://havenlystays-tssx.onrender.com](https://havenlystays-tssx.onrender.com)
- **Build Command**: `npm install`
- **Start Command**: `npm start`

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the repository issues or open a pull request.

---

## 👤 Author

- **GitHub**: [@priyal-codes](https://github.com/priyal-codes)

*Designed & Developed with ❤️ for HavenlyStays*
