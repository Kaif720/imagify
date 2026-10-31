# ✨ Imagify – AI Text-to-Image Generator

Turn your imagination into reality with **Imagify**, an AI-powered image generation web application that transforms text prompts into visually stunning images.

Imagify provides an intuitive platform where users can create AI-generated images, manage generation credits, and purchase additional credits through an integrated payment system.

## 🚀 Features

- **AI Image Generation:** Generate images from text descriptions using the Clipdrop API.
- **User Authentication:** Secure registration and login functionality using JWT authentication.
- **Credit-Based System:** Generate images using available account credits.
- **Payment Integration:** Purchase additional credits through Razorpay.
- **Credit Management:** Track your available credits.
- **Responsive Interface:** Clean and user-friendly interface built with React and Tailwind CSS.
- **Interactive Notifications:** Get real-time feedback using React Toastify.

## 🛠️ Tech Stack

**Frontend**
- React.js
- Vite
- Tailwind CSS
- React Router DOM
- Axios
- React Toastify

**Backend**
- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Token (JWT)
- bcryptjs

**APIs & Services**
- Clipdrop API – AI image generation
- Razorpay – Payment processing

## 📸 How It Works

1. **Create an Account:** Register or log in to your Imagify account.
2. **Enter a Prompt:** Describe the image you want to generate.
3. **Generate Image:** Imagify sends your prompt to the Clipdrop API.
4. **Get Your Creation:** View the generated image.
5. **Manage Credits:** Use available credits or purchase additional credits through Razorpay.

## 📁 Project Structure

```text
imagify/
│
├── client/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   ├── config/
│   │   └── mongodb.js
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   └── package.json
│
└── README.md
```

## ⚙️ Getting Started

Follow these instructions to run Imagify locally.

### Prerequisites

Make sure you have installed:

- [Node.js](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/)
- [Git](https://git-scm.com/)

You will also need API credentials from:
- [Clipdrop](https://clipdrop.co/apis)
- [Razorpay](https://razorpay.com/)

### 1. Clone the Repository

```bash
git clone https://github.com/Kaif720/imagify.git

cd imagify
```

### 2. Backend Setup

Navigate to the server directory:

```bash
cd server
```

Install dependencies:

```bash
npm install
```

Create a `.env` file inside the `server` directory:

```env
PORT=4000

MONGODB_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

CLIPDROP_API=your_clipdrop_api_key

RAZORPAY_KEY_ID=your_razorpay_key_id

RAZORPAY_KEY_SECRET=your_razorpay_key_secret

CURRENCY=INR
```

Start the backend:

```bash
npm start
```

The backend will run at:

`http://localhost:4000`

### 3. Frontend Setup

Open another terminal and navigate to the client directory:

```bash
cd client
```

Install dependencies:

```bash
npm install
```

Create a `.env` file inside the `client` directory:

```env
VITE_BACKEND_URL=http://localhost:4000
```

Start the frontend:

```bash
npm run dev
```

Open the application in your browser:

`http://localhost:5173`

## 🔗 API Endpoints

### User Routes

Base URL: `/api/user`

| Method | Endpoint | Description |
|---|---|---|
| POST | `/register` | Register a new user |
| POST | `/login` | Authenticate user |
| GET | `/credits` | Retrieve user credit balance |
| POST | `/pay-razor` | Create Razorpay payment order |
| POST | `/verify-razor` | Verify payment and update credits |

### Image Routes

Base URL: `/api/image`

| Method | Endpoint | Description |
|---|---|---|
| POST | `/generate-image` | Generate an image from a text prompt |

**Note:** Protected endpoints require the authentication token in the request headers.

## 🔐 Environment Variables

| Variable | Purpose |
|---|---|
| `PORT` | Backend server port |
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret used for JWT authentication |
| `CLIPDROP_API` | Clipdrop API key |
| `RAZORPAY_KEY_ID` | Razorpay public key ID |
| `RAZORPAY_KEY_SECRET` | Razorpay secret key |
| `CURRENCY` | Payment currency |
| `VITE_BACKEND_URL` | Backend URL used by frontend |

**Important:** Never upload your `.env` files or expose private API credentials on GitHub.

## 🔮 Future Improvements

Potential enhancements for Imagify include:

- Image generation history and gallery.
- Download and share generated images.
- Multiple AI image generation models.
- Advanced image customization options.
- Improved user dashboard.
- Dark mode support.

## 👨‍💻 Author

Kaif Khan



⭐ If you find this project interesting, consider giving it a star!

**Imagify – Imagine It. Generate It.**
