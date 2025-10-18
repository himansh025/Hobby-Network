# HobbyMatch - Social Network Visualization Platform

![HobbyMatch](https://img.shields.io/badge/HobbyMatch-Social%20Network-blue)
![React](https://img.shields.io/badge/React-18.2.0-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript)
![Redux](https://img.shields.io/badge/Redux-Toolkit-764ABC?logo=redux)

A modern, interactive social network visualization platform where users can create profiles, connect based on shared hobbies, and explore relationships through an interactive graph interface.

---

## 🌟 Live Demo & API Documentation

- **Live Application:** [Live](https://hobby-network.vercel.app/)
- **API Documentation:** [Postman Collection](https://www.postman.com/tramx6/himanshu-public-workspace/collection/c8c42ny/hobbymatch?action=share&creator=36698168)
- **GitHub Repository:** [Your Repository Link](https://github.com/himansh025/hobby-network)

---

## 📸 Screenshots

<p align="center">
  <img src="/frontend/assets/images/image1.png" alt="Dashboard" width="100%"/>
  <br/>
  <em>Dashboard Overview</em>
</p>

<p align="center">
  <img src="/frontend/assets/images/image.png" alt="graph Management" width="100%"/> 
  <br/>
  <em>Interactive Network Graph</em>
</p>

<p align="center">
  <img src="/frontend/assets/images/image2.png" alt="User Management" width="100%"/>
   <img src="/frontend/assets/images/image3.png" alt="User Management" width="100%"/>
      <img src="/frontend/assets/images/image4.png" alt="User Management" width="100%"/>
  <br/>
  <em>User Management Interface</em>
</p>

---

## 🚀 Features

### 🔗 Social Networking

- **User Profiles:** Create and manage user profiles with customizable hobbies
- **Friend Connections:** Visual relationship building through interactive graph
- **Hobby-based Matching:** Connect users based on shared interests
- **Popularity Scoring:** Dynamic user popularity based on network metrics

### 🎨 Interactive Visualization

- **Dynamic Graph:** Real-time network visualization using React Flow
- **Custom Nodes:** Beautiful, size-variable nodes based on user popularity
- **Drag & Drop:** Intuitive interface for creating connections
- **Mobile Responsive:** Seamless experience across all devices

### ⚡ Advanced Features

- **Real-time Updates:** Instant graph updates on user interactions
- **Search & Filter:** Find hobbies quickly
- **Connection Management:** Easy friend connection/disconnection
- **Beautiful UI:** Modern design with smooth animations

---

## 🛠 Tech Stack

### Frontend
- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe development
- **Redux Toolkit** - State management
- **React Flow** - Graph visualization
- **React DnD** - Drag and drop functionality
- **Tailwind CSS** - Utility-first styling

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database

---

## 📁 Project Structure

```
hobbymatch/
├── src/
│   ├── components/
│   │   ├── Graph/
│   │   │   ├── GraphVisualization.tsx
│   │   │   └── CustomNode.tsx
│   │   ├── UserManagement/
│   │   │   ├── UserManagement.tsx
│   │   │   ├── UpdateUser.tsx
│   │   │   ├── UserList.tsx
│   │   │   ├── UserListItem.tsx
│   │   │   └── CreateUser.tsx
│   │   ├── Sidebar/
│   │   │   ├── HobbyList.tsx
│   │   │   ├── HobbySearch.tsx
│   │   │   └── HobbyItem.tsx
│   │   └── UI/
│   │       ├── LoadingSpinner.tsx
│   │       └── ErrorBoundary.tsx
│   ├── store/
│   │   ├── slices/
│   │   │   ├── usersSlice.ts
│   │   │   ├── graphSlice.ts
│   │   │   └── uiSlice.ts
│   │   └── store.ts
│   ├── types/
│   │   └── user.ts
│   ├── config/
│   │   └── axiosConfig.ts
│   ├── App.tsx
│   └── main.tsx
├── public/
└── package.json
```

---

## 🎯 Core Components

### Graph Visualization
```typescript
// Interactive network graph with custom nodes
- Dynamic node sizing based on popularity
- Real-time connection management
- Smooth animations and transitions
- Mobile-responsive design
```

### User Management
```typescript
// Comprehensive user CRUD operations
- Create, read, update, delete users
- Hobby management with tag system
- Friend connection visualization
- Popularity score tracking
```

### Hobby System
```typescript
// Interest-based social networking
- Hobby categorization and counting
- Search and filter functionality
- Drag and drop interactions
- Connection suggestions based on shared interests
```

---

## 🔌 API Endpoints

### Users

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/users` | Get all users |
| POST | `/users` | Create new user |
| PUT | `/users/:id` | Update user |
| DELETE | `/users/:id` | Delete user |
| POST | `/users/:id/link` | Create friendship |
| DELETE | `/users/:id/unlink` | Remove friendship |

### Graph

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/graph` | Get graph data |

**Full API Documentation:** [View Postman Collection]()

---

## 🚀 Installation & Setup

### Prerequisites

- Node.js 16+
- MongoDB
- npm or yarn

### Installation Steps

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/hobby-network.git
cd hobby-network
```

2. **Install dependencies**

```bash
npm install
```

3. **Environment Setup**

```bash
# Create .env file
cp .env.example .env
```

Configure your environment variables:

```env
VITE_API_BASE_URL=http://localhost:3000/api
MONGODB_URI=mongodb://localhost:27017/hobby-network
```

4. **Start development servers**

```bash
# Frontend 
npm run dev

# Backend 
npm run dev
```

5. **Open application**

Navigate to `http://localhost:5173` in your browser.

---

## 🎮 Usage Guide

### Creating Users

1. Navigate to User Management section
2. Click "Create User"
3. Fill in username, age, and hobbies
4. Save to see user appear in the graph

### Making Connections

1. Double-click a user node to set as connection source
2. Click another user to create friendship
3. View real-time graph updates

### Managing Hobbies

1. Use sidebar to browse all hobbies
2. Search for specific interests
3. Click hobbies to filter users
4. Drag and Drop feature 
5. Drag Any Hobbies to the user graph make make the friendship

### Mobile Usage

- Swipe from left to open sidebar
- Use bottom navigation tabs
- Pinch to zoom on graph

---

## 📝 Environment Variables

Create a `.env` file in the root directory:

```env
# Frontend
VITE_API_BASE_URL=http://localhost:3000/api

# Backend
MONGODB_URI=mongodb://localhost:27017/hobbymatch
JWT_SECRET=your_jwt_secret_here
PORT=3000

# Optional
NODE_ENV=development
```
---

## 👥 Authors

- **Himanshu** - *Initial work* - [GitHub Profile](https://github.com/himansh025)
---

## 📧 Contact

For questions or support, please reach out:

- **Email:** himanshudeolia0825@gmail.com

---
