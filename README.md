# 💻 Command Gateway - Frontend

The React-based user interface for the Command Gateway. It provides a secure terminal environment for users and a comprehensive control panel for administrators.

## 🚀 Features
- **Role-Based UI:** Dashboard automatically adjusts for 'Admin' vs 'Member' roles.
- **Secure Session:** API Keys are stored in `sessionStorage` (automatically cleared when the tab is closed).
- **Real-Time Feedback:** Instant updates on credit usage and command execution status (Executed/Rejected).
- **Admin Panel:**
  - **User Management:** Create new users and securely copy their generated API keys.
  - **Rule Configuration:** Add new Regex patterns to filter commands.
  - **Global Audit:** View the system-wide activity log.

## 🛠️ Tech Stack
- **Framework:** React (Vite)
- **Styling:** CSS (Dark Mode Theme)
- **Networking:** Axios

## ⚙️ Setup & Run

### 1. Installation
Navigate to the project folder and install dependencies:
```bash
npm install
```

### 2. Start Application
Run the development server:
```bash
npm run dev
```
The application will open at `http://localhost:5173`.

## 🎮 Walkthrough

### Test Accounts
Use these dummy credentials to test the application:

**Admin User:**
- API Key: `admin-key-123`
- Username: `admin`
- Credits: 500

**Member User:**
- API Key: `athi-key-456`
- Username: `athi`
- Credits: 100

### Steps
1. **Login:** Use the default Admin key (`admin-key-123`).
2. **Execute Commands:** Type `ls -la` in the terminal to see a successful execution (Credits -1).
3. **Test Blocking:** Type `rm -rf /` to see the Rule Engine in action (Status: REJECTED).
4. **Admin Controls:** Scroll down to the Admin section to add new Rules or view the Global Logs.
5. **Test Member Access:** Logout and login with the member key (`athi-key-456`) to see the limited member view.

## 📡 API Integration
The frontend connects to the backend API at `http://localhost:3000/api`. Make sure the backend server is running before starting the frontend.

### Authentication
All API requests require an `x-api-key` header with a valid API key stored in `sessionStorage`.

### Key Endpoints Used
- `GET /api/me` - Get current user information
- `POST /api/commands` - Execute a command
- `GET /api/my-history` - Get user's command history
- `GET /api/rules` - Get all system rules (Admin only)
- `POST /api/rules` - Add a new rule (Admin only)
- `POST /api/users` - Create a new user (Admin only)

## 🔧 Build for Production
```bash
npm run build
```
The optimized production build will be available in the `dist/` folder.

## 📝 Development Notes
- Uses Vite for fast HMR (Hot Module Replacement)
- ESLint configured for code quality
- Session-based authentication (no persistent storage)