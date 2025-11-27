# Futabus (Frontend)

## 🚀 Getting Started


1. **Install Node.js**

Make sure you have [Node.js](https://nodejs.org/) installed (v18 or higher recommended). Node includes `npm` (Node Package Manager).

```bash
# macOS / Linux (recommended) — use nvm to install/manage Node versions
curl -fsSL https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.6/install.sh | bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm install 18
nvm use 18

# Verify installation
node -v
npm -v
```

On Windows, use the official installer from https://nodejs.org/ or install nvm-windows: https://github.com/coreybutler/nvm-windows.

2. **Install dependencies:**
    This command reads the `package.json` file and downloads all the required libraries into a local `node_modules` folder.
    ```bash
    npm install
    ```

---

## 🏃 Available Scripts

In the project directory (cd frontend), you can run:

### `npm run dev`

This runs the app in development mode.
Open your browser and navigate to `http://localhost:5174` (or the port shown in your terminal) to view the app.

The page will automatically reload if you make any changes to the code.

### `npm run build`

This builds the app for production to the `dist` folder. It correctly bundles React in production mode and optimizes the build for the best performance.


🚀 Backend Setup (Python 3.8+)

📦 Install Dependencies

Make sure you have Python 3.8 or higher, then install all required packages:
```bash
pip install -r requirements.txt
```
▶️ Run the Backend Server

Navigate into the backend directory and start the server:
```bash
cd backend
python app.py
```