# 🪙 WealthVerse – Financial & Carbon Emission Tracker

[![Demo](https://img.shields.io/badge/Demo-WealthVerse-blue?style=for-the-badge\&logo=internet-explorer)](https://drive.google.com/file/d/1HlXDP2OyA0qzbY1eB833b1eaX9GyXkTp/view?usp=drive_link)

---

## 🚀 Overview

**WealthVerse** helps recent graduates and young professionals build **financial awareness** and **eco-consciousness** in one intuitive platform. It simplifies **expense tracking**, auto-categorizes transactions (even for local merchants), and translates spending into monthly **carbon footprint insights** — giving users a dual view of their money and environmental impact.

What makes it special:

* 💡 **Smart Categorization**: Automatically maps popular merchant IDs (e.g., DMart, Jio Oil, MacD) to global categories like *Fuel*, *Food*, *Transport*, etc. Unrecognized local merchants default to *Miscellaneous*, but users can reassign them once or globally.
* 🌱 **Carbon Impact Estimation**: Calculates the CO₂ emissions for each transaction based on category-specific emission factors stored in the database.
* 📊 **Insightful Dashboards**: See detailed monthly analytics for both **spending** and **carbon emissions** using pie charts and summary views.
* 🤖 **Chatbot Assistant**: Integrated AI-powered chatbot (via Groq LLM + Flask API) helps users with financial questions and monthly category insights.

🔧 **Deployed fully on AWS**: React frontend on Amplify, Spring Boot backend on EC2, RDS for database, chatbot hosted on Railway, and global routing via Route 53 with a custom domain from Hostinger.

---

<details>
<summary>✨ Features</summary>

### 💳 Transaction Management

* Import bank statements in **CSV** format or add transactions manually
* Global auto-categorization using popular **merchant IDs**
* Custom category overrides for **individual merchant** or **all matching IDs**

### 🌍 Carbon Emission Tracker

* Calculates CO₂ emissions per transaction
* Uses backend-stored **carbon factors** for each category
* Monthly **category-wise footprint breakdown**

### 📈 Analytics Dashboard

* Interactive **pie charts** for:

  * Monthly spending by category
  * Monthly carbon footprint by category

### 🤖 Chatbot (Groq LLM + Flask)

* A lightweight Flask API backend using **Groq’s LLM**
* Helps users analyze monthly insights and answer finance-related queries

### 🔐 Secure Authentication

* **JWT-based login** and backend access

### ⚡ Performance

* Paged APIs for handling large datasets
* Batched calculations for dashboard summaries

</details>

---

## 🛠️ Tech Stack

* **Frontend:** React.js, Tailwind CSS, Vite, Context API
* **Backend:** Spring Boot, Spring Security, Python (Flask)
* **ORM & Data:** Hibernate, MySQL, AWS RDS
* **AI:** Groq LLM via lightweight chatbot
* **Hosting & Infrastructure:**

  * **Frontend:** AWS Amplify
  * **Backend:** AWS EC2 (Spring Boot)
  * **Database:** AWS RDS
  * **Chatbot:** Hosted on Railway
  * **Domain:** Purchased from Hostinger
  * **Routing & DNS:** AWS Route 53

---

## 🎯 Vision

**WealthVerse** is designed to bridge the gap between personal finance and climate responsibility. By combining **transaction insights** with **carbon data**, it guides users toward both smarter spending and greener living — all through one modern, educational tool.
