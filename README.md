# Asynchronous Document Processing API

This is a backend service built with **Node.js**, **Express**, and **BullMQ**. It allows users to submit document URLs for background processing without blocking the main API response.

## 🚀 Key Features
* **Background Processing:** The API accepts a job and returns an ID immediately, while a separate worker handles the "heavy lifting."
* **Cloud Redis Integration:** Connected to **Upstash (Serverless Redis)** so the system works instantly without needing to install Redis or Docker locally.
* **Automatic Retries:** If a background task fails, BullMQ is configured to automatically retry the job.
* **Simple & Reliable:** Focuses on a clean codebase with minimal dependencies.

---

## 🛠️ Setup & Run

1. **Clone the Project**
   ```bash
   git clone <your-repo-url>
   cd Bp-Optima-Async-Api-System