# NexusMeet - Your Global Language Exchange Hub

NexusMeet is a full-stack web application designed to connect language learners from around the world. It provides a platform for users to find native speakers of their target language, become friends, and engage in real-time conversations to improve their fluency.

**Live Demo:** [Link to your deployed application (e.g., Vercel, Netlify, Render)]



## The Problem It Solves

Finding a suitable language exchange partner can be challenging. Learners often struggle to find someone who is a native speaker of their target language and is also interested in learning their native language. NexusMeet bridges this gap by providing a smart recommendation system and a seamless communication platform.

## Key Features

-   **🔐 Secure User Authentication**: Full auth flow including registration with email verification, login, and secure session management using JWT.
-   **👤 Customizable User Profiles**: Users can set their profile picture, bio, native language, and the language they want to learn.
-   **☁️ Cloud Image Uploads**: Profile pictures are uploaded securely to Cloudinary, ensuring a scalable and robust media solution.
-   **🤝 Smart Partner Recommendations**: An intelligent algorithm suggests potential language partners based on matching native and desired languages.
-   **📬 Friend Request System**: A complete friendship model allowing users to send, accept, and reject friend requests.
-   **🔔 Real-time Notifications**: A notification system with a visual indicator in the navbar alerts users to new, pending friend requests.
-   **💬 Real-time Chat**: Once users become friends, they can engage in one-on-one, real-time chat sessions, powered by the Stream Chat API.
-   **✨ Modern & Responsive UI**: A clean, user-friendly interface built with Tailwind CSS and DaisyUI, fully responsive for all screen sizes.



## Tech Stack

This project is built with a modern MERN-stack architecture, integrating powerful third-party services for a feature-rich experience.

| Category      | Technology                                                                          |
| ------------- | ----------------------------------------------------------------------------------- |
| **Frontend** | React, React Query, Axios, Tailwind CSS, DaisyUI                                    |
| **Backend** | Node.js, Express.js                                                                 |
| **Database** | MongoDB Atlas                                                                       |
| **Auth** | JWT (JSON Web Tokens), bcrypt                                                       |
| **File Upload** | Multer, Cloudinary API                                                              |
| **Real-time Chat** | Stream Chat API                                                                     |

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

-   Node.js (v18.x or later)
-   npm / yarn
-   A MongoDB Atlas account and a cluster
-   A Cloudinary account
-   A Stream Chat account

### Installation

1.  **Clone the repository:**
    ```sh
    git clone [https://github.com/your-username/NexusMeet.git](https://github.com/your-username/NexusMeet.git)
    cd NexusMeet
    ```

2.  **Install Backend Dependencies:**
    ```sh
    cd backend
    npm install
    ```

3.  **Install Frontend Dependencies:**
    ```sh
    cd ../frontend
    npm install
    ```

4.  **Set Up Environment Variables:**
    -   In the `backend` directory, create a `.env` file and add the following, replacing the placeholders with your actual keys:
        ```env
        PORT=5000
        MONGODB_URI="your_mongodb_connection_string"
        ACCESS_SECRET_KEY="your_jwt_secret_key"
        BASE_URL="http://localhost:5173" # Your frontend URL

        # Cloudinary
        CLOUDINARY_CLOUD_NAME="your_cloud_name"
        CLOUDINARY_API_KEY="your_api_key"
        CLOUDINARY_API_SECRET="your_api_secret"

        # Stream
        VITE_STREAM_API_KEY="your_stream_api_key"
        STREAM_API_SECRET="your_stream_api_secret"
        ```
    -   In the `frontend` directory, create a `.env` file and add your Stream API key:
        ```env
        VITE_STREAM_API_KEY="your_stream_api_key"
        VITE_API_BASE_URL="http://localhost:5000/api/v1" # Your backend API URL
        ```

5.  **Run the Development Servers:**
    -   **Backend:**
        ```sh
        # from the /backend directory
        npm run dev
        ```
    -   **Frontend:**
        ```sh
        # from the /frontend directory
        npm run dev
        ```

Open [http://localhost:5173](http://localhost:5173) to view the application in your browser.