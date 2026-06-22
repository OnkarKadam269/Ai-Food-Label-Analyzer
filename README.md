<div align="center">
  
# 🥗 AI Food Label Analyzer (NutriVision AI)

**An intelligent full-stack application that uses Computer Vision and Large Language Models to extract and analyze food ingredients, providing automated health scores and nutritional insights.**

</div>

## 📌 Overview
Ever looked at a food label and wondered what those complex chemical names actually mean? **AI Food Label Analyzer** solves this problem. Simply upload a picture of any ingredients list, and the AI will extract the text, analyze the additives, and give the product a comprehensive Health Score.

This project was built to bring transparency to the foods we consume, making nutritional analysis accessible and incredibly easy to understand.

## ✨ Features
* 📸 **Smart Image Upload:** Drag-and-drop interface to upload photos of food labels or chips packets.
* 🔍 **Advanced Computer Vision:** Uses Google's Gemini 3.5 Flash Vision model to instantly extract hard-to-read ingredient text.
* 📊 **Automated Health Score:** Calculates a 0-100% health rating based on the presence of harmful additives vs. beneficial nutrients.
* 🥗 **Ingredient Categorization:** Automatically groups extracted text into Harmful, Beneficial, and Neutral ingredients.
* 💡 **Simple Explanations:** Translates complex chemical preservatives and additives into simple, plain-English explanations so consumers know exactly what they are eating.
* 🎨 **Premium Glassmorphism UI:** A highly responsive, modern frontend designed with rich aesthetics and micro-animations.

## 🛠️ Tech Stack
**Frontend:**
* React.js (Vite)
* Custom Vanilla CSS (Glassmorphism & modern UI/UX design)

**Backend & AI:**
* Python
* FastAPI
* Google Gemini 3.5 Flash (Vision & LLM integration)

---

## 🚀 How to Run Locally

### Prerequisites
* Python 3.8+
* Node.js & npm
* A Google Gemini API Key

### 1. Clone the repository
```bash
git clone https://github.com/OnkarKadam269/Ai-Food-Label-Analyzer.git
cd Ai-Food-Label-Analyzer
```

### 2. Start the Backend
Open a terminal and navigate to the backend folder:
```cmd
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt

# Set your API Key
set GEMINI_API_KEY=your_actual_api_key_here

# Run the FastAPI server
uvicorn main:app --reload
```

### 3. Start the Frontend
Open a **second** terminal and navigate to the frontend folder:
```cmd
cd frontend
npm install
npm run dev
```

### 4. Open the App
Go to `http://localhost:5173` in your browser. Drop a food label image into the scanner, and let the AI do the rest!

---

## 👨‍💻 Author
**Omkar Kadam**
* GitHub: [@OnkarKadam269](https://github.com/OnkarKadam269)
