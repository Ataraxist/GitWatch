# GitWatch

**GitWatch** is a web application that tracks trending GitHub repositories and provides analytics on programming languages, stars, forks, and more. It fetches and visualizes GitHub trending data, helping developers stay updated with the most popular projects.

## 🚀 Features

- **Trending Repositories** – Displays a ranked list of trending GitHub repositories.
- **Interactive Data Visualizations** – Uses charts to analyze repository trends.
- **Dark Mode** – Includes a toggle for a dark mode experience.
- **Lazy Loading** – Efficiently loads repositories as the user scrolls.
- **Automatic Data Updates** – Fetches the latest trending repositories using a scheduled cron job.
- **Shooting Star Animation** – Easter egg effect in dark mode.

## 🏗️ Tech Stack

- **Frontend:** React (with lazy loading and hooks)
- **Backend:** Node.js with Express
- **Database:** MongoDB (using Mongoose for schema enforcement)
- **Data Fetching:** Axios + GitHub API
- **Visualization:** Chart.js (bar and scatter plots)
- **Styling:** CSS with global variables for maintainability
- **Authentication & Rate Limiting:** GitHub API with Bottleneck for request throttling

## 📸 Screenshots

![Trending Repos Screenshot](https://via.placeholder.com/800x400?text=Trending+Repos)
![Analytics Screenshot](https://via.placeholder.com/800x400?text=Language+Trends+Chart)

## 🛠️ Installation & Setup

1. **Clone the repository**
   ```sh
   git clone https://github.com/yourusername/GitWatch.git
   cd GitWatch

2. **Install Dependencies**
   ```sh
   npm install

3. **Set up Env Variables**
Create a .env file in the server/ directory and add:
    ```sh
    GITHUB_TOKEN=[Your Token]

4. **Run the Application**
   ```sh
   # From the server directory
   npm run dev
   # From the client directory
   npm run server

5. **Access the App**
   ```sh
   # Frontend URL
    http://localhost:5173
   # Backend API URL
    http://localhost:9001/api/github/trending

## 📊 How It Works

### 1. Fetching Data  
- A cron job fetches the top trending GitHub repositories daily.
- Data is stored in MongoDB and queried on-demand.

### 2. Displaying Repositories  
- The frontend displays repositories with details such as stars, forks, and primary language.
- Lazy loading is used to fetch more repositories on scroll.

### 3. Visualizing Data  
- A bar chart shows the top 10 most common languages.
- A scatter plot maps repo creation dates vs. star counts.

### 4. Theming & Effects  
- Users can toggle between light and dark mode.
- A shooting star effect appears when dark mode is enabled.

## 📜 License

This project is open-source and available under the **MIT License**.
