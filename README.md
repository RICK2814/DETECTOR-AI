<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:00e5ff,50:7c4dff,100:0b1020&height=240&section=header&text=DetectAI&fontSize=72&fontColor=ffffff&animation=twinkling&fontAlignY=38&desc=AI%20Text%20Forensics%20Engine&descSize=20&descAlignY=60" alt="DetectAI" width="100%"/>

<img src="https://readme-typing-svg.demolab.com?font=JetBrains+Mono&weight=600&size=20&duration=3000&pause=900&color=00E5FF&background=00000000&center=true&vCenter=true&width=700&height=40&lines=%F0%9F%A4%96+Booting+DetectAI...;Scanning+text%2C+URLs+and+files;Perplexity+%2B+burstiness+%2B+phrasing;Verdict%3A+HUMAN+or+AI%3F+Let+Claude+decide" alt="typing robot" />

<br/>

**Detect whether text was written by a human or an AI.**
Plain text · URLs · file uploads — scored by Claude, saved to SQLite.

<br/>

![React](https://img.shields.io/badge/React_18-0d1117?style=for-the-badge&logo=react&logoColor=00e5ff)
![Vite](https://img.shields.io/badge/Vite-0d1117?style=for-the-badge&logo=vite&logoColor=b388ff)
![Express](https://img.shields.io/badge/Express_4-0d1117?style=for-the-badge&logo=express&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-0d1117?style=for-the-badge&logo=sqlite&logoColor=4da3ff)
![Docker](https://img.shields.io/badge/Docker-0d1117?style=for-the-badge&logo=docker&logoColor=4da3ff)
![Claude](https://img.shields.io/badge/Claude_AI-0d1117?style=for-the-badge&logo=anthropic&logoColor=ff9f43)
![License](https://img.shields.io/badge/License-MIT-0d1117?style=for-the-badge&logoColor=39ff88)

<br/>

[Quick Start](#-quick-start) · [Docker](#-docker-production) · [API](#-api-reference) · [Database](#-database-schema) · [Security](#-security-notes)

</div>

<br/>

<img src="https://capsule-render.vercel.app/api?type=rect&color=0:00e5ff,100:0b1020&height=70&section=header&text=How%20It%20Works&fontSize=28&fontColor=ffffff&animation=fadeIn&fontAlignY=50" alt="How It Works" width="100%"/>

<div align="center">
<img src="https://readme-typing-svg.demolab.com?font=JetBrains+Mono&weight=600&size=15&duration=2500&pause=700&color=00E5FF&background=00000000&center=true&vCenter=true&width=600&height=28&lines=%F0%9F%A4%96+MODULE+00+-+PIPELINE;INPUT+%3E+EXTRACT+%3E+CLAUDE+%3E+VERDICT" alt="module 00" />
</div>

```mermaid
flowchart LR
    A[📥 Input<br/>text · url · file] --> B[🧹 Extract<br/>cheerio · multer]
    B --> C[🧠 Claude<br/>analysis]
    C --> D{🔬 Verdict}
    D --> E[🟢 Human]
    D --> F[🔴 AI]
    D --> G[🟡 Mixed]
    D --> H[(💾 SQLite)]
```

1. **Input** — paste text, give a URL, or upload `.txt` / `.md` / `.html`.
2. **Extract** — Cheerio scrapes pages, Multer handles uploads, text is trimmed to 8000 chars.
3. **Analyze** — Claude scores perplexity, burstiness, phrasing and vocabulary.
4. **Verdict** — `AI`, `Human` or `Mixed`, with probability, confidence, flagged phrases, saved to history.

<br/>

<img src="https://capsule-render.vercel.app/api?type=rect&color=0:00e5ff,100:0b1020&height=70&section=header&text=Project%20Structure&fontSize=28&fontColor=ffffff&animation=fadeIn&fontAlignY=50" alt="Project Structure" width="100%"/>

<div align="center">
<img src="https://readme-typing-svg.demolab.com?font=JetBrains+Mono&weight=600&size=15&duration=2500&pause=700&color=00E5FF&background=00000000&center=true&vCenter=true&width=600&height=28&lines=%F0%9F%A4%96+MODULE+01+-+ARCHITECTURE;Mapping+backend+and+frontend...;2+services+detected" alt="module 01" />
</div>

```
DETECTOR-AI/
├── backend/
│   ├── server.js          # Express entry point
│   ├── db.js              # SQLite database (better-sqlite3)
│   ├── routes/
│   │   ├── detect.js      # POST /api/detect/text|url|file
│   │   └── history.js     # GET/DELETE /api/history
│   ├── .env.example       # Copy to .env and fill in
│   ├── Dockerfile
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   ├── index.css
│   │   ├── utils/api.js          # Axios API helpers
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Results.jsx       # Detection results display
│   │   │   └── UI.jsx            # Shared components
│   │   └── pages/
│   │       ├── Detect.jsx        # Main detection page
│   │       ├── History.jsx       # Scan history
│   │       ├── ScanDetail.jsx    # Single scan detail
│   │       └── Stats.jsx         # Statistics dashboard
│   ├── vite.config.js
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
│
├── docker-compose.yml
└── README.md
```

<br/>

<img src="https://capsule-render.vercel.app/api?type=rect&color=0:39ff88,100:0b1020&height=70&section=header&text=Quick%20Start&fontSize=28&fontColor=ffffff&animation=scaleIn&fontAlignY=50" alt="Quick Start" width="100%"/>

<div align="center">
<img src="https://readme-typing-svg.demolab.com?font=JetBrains+Mono&weight=600&size=15&duration=2500&pause=700&color=39FF88&background=00000000&center=true&vCenter=true&width=600&height=28&lines=%F0%9F%A4%96+MODULE+02+-+BOOT+SEQUENCE;npm+install...;npm+run+dev...;ALL+SYSTEMS+GO" alt="module 02" />
</div>

### 1 · Clone and install

```bash
git clone https://github.com/RICK2814/DETECTOR-AI.git
cd DETECTOR-AI

# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2 · Configure backend

```bash
cd backend
cp .env.example .env
```

Edit `.env`:

```env
PORT=4000
ANTHROPIC_API_KEY=sk-ant-your-key-here   # Get from console.anthropic.com
FRONTEND_URL=http://localhost:5173
```

### 3 · Start backend

```bash
cd backend
npm run dev      # uses nodemon for auto-reload
# or
npm start
```

> 🟢 Backend online at **http://localhost:4000**

### 4 · Start frontend

```bash
cd frontend
npm run dev
```

> 🟢 Frontend online at **http://localhost:5173**

<br/>

<img src="https://capsule-render.vercel.app/api?type=rect&color=0:4da3ff,100:0b1020&height=70&section=header&text=Docker%20Production&fontSize=28&fontColor=ffffff&animation=blinking&fontAlignY=50" alt="Docker Production" width="100%"/>

<div align="center">
<img src="https://readme-typing-svg.demolab.com?font=JetBrains+Mono&weight=600&size=15&duration=2500&pause=700&color=4DA3FF&background=00000000&center=true&vCenter=true&width=600&height=28&lines=%F0%9F%A4%96+MODULE+03+-+DEPLOYMENT;Building+containers...;Shipping+to+production" alt="module 03" />
</div>

```bash
# At project root
cp backend/.env.example backend/.env
# Edit backend/.env with your ANTHROPIC_API_KEY

docker-compose up --build
```

| Service | URL |
|---|---|
| 🖥️ Frontend | http://localhost:5173 |
| ⚙️ Backend API | http://localhost:4000 |

<br/>

<img src="https://capsule-render.vercel.app/api?type=rect&color=0:ff9f43,100:0b1020&height=70&section=header&text=API%20Reference&fontSize=28&fontColor=ffffff&animation=twinkling&fontAlignY=50" alt="API Reference" width="100%"/>

<div align="center">
<img src="https://readme-typing-svg.demolab.com?font=JetBrains+Mono&weight=600&size=15&duration=2500&pause=700&color=FF9F43&background=00000000&center=true&vCenter=true&width=600&height=28&lines=%F0%9F%A4%96+MODULE+04+-+INTERFACE;POST+%2Fapi%2Fdetect%2Ftext;GET+%2Fapi%2Fhistory;200+OK" alt="module 04" />
</div>

<details open>
<summary><b>🔍 Detect</b></summary>

<br/>

**Text**
```http
POST /api/detect/text
Content-Type: application/json

{ "text": "Your text here..." }
```

**URL**
```http
POST /api/detect/url
Content-Type: application/json

{ "url": "https://example.com/article" }
```

**File**
```http
POST /api/detect/file
Content-Type: multipart/form-data

file: <file upload>   (.txt, .md, .html)
```

</details>

<details>
<summary><b>🕘 History and stats</b></summary>

<br/>

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/history?page=1&limit=20` | Paginated scan history |
| `GET` | `/api/history/:id` | Single scan |
| `DELETE` | `/api/history/:id` | Delete scan |
| `GET` | `/api/history/stats` | Dashboard stats |
| `GET` | `/api/health` | Health check |

</details>

<br/>

<img src="https://capsule-render.vercel.app/api?type=rect&color=0:b388ff,100:0b1020&height=70&section=header&text=Database%20Schema&fontSize=28&fontColor=ffffff&animation=fadeIn&fontAlignY=50" alt="Database Schema" width="100%"/>

<div align="center">
<img src="https://readme-typing-svg.demolab.com?font=JetBrains+Mono&weight=600&size=15&duration=2500&pause=700&color=B388FF&background=00000000&center=true&vCenter=true&width=600&height=28&lines=%F0%9F%A4%96+MODULE+05+-+MEMORY+CORE;Indexing+scans...;detector.db+synced" alt="module 05" />
</div>

SQLite database is stored at `backend/data/detector.db`.

**`scans`** table — stores every detection result:

| Column | Type | Description |
|---|---|---|
| `id` | TEXT (UUID) | Primary key |
| `created_at` | DATETIME | Timestamp |
| `source_type` | TEXT | `text`, `url`, or `file` |
| `source_ref` | TEXT | URL or filename |
| `input_text` | TEXT | First 500 chars of input |
| `word_count` | INTEGER | Total words |
| `verdict` | TEXT | `AI`, `Human`, or `Mixed` |
| `ai_prob` | REAL | 0–100 probability |
| `confidence` | TEXT | Low / Medium / High / Very High |
| `summary` | TEXT | Analysis summary |
| `signals` | TEXT | JSON: perplexity / burstiness / etc |
| `ai_flags` | TEXT | JSON array |
| `human_flags` | TEXT | JSON array |
| `phrases` | TEXT | JSON array of flagged phrases |
| `ip_address` | TEXT | Client IP |

**`stats`** table — running totals for the dashboard.

<br/>

<img src="https://capsule-render.vercel.app/api?type=rect&color=0:ff5ca8,100:0b1020&height=70&section=header&text=Tech%20Stack&fontSize=28&fontColor=ffffff&animation=scaleIn&fontAlignY=50" alt="Tech Stack" width="100%"/>

<div align="center">
<img src="https://readme-typing-svg.demolab.com?font=JetBrains+Mono&weight=600&size=15&duration=2500&pause=700&color=FF5CA8&background=00000000&center=true&vCenter=true&width=600&height=28&lines=%F0%9F%A4%96+MODULE+06+-+HARDWARE;React+%2B+Express+%2B+SQLite;Powered+by+Claude" alt="module 06" />
</div>

| Layer | Tech |
|---|---|
| 🎨 Frontend | React 18, Vite, React Router |
| ⚙️ Backend | Node.js, Express 4 |
| 🗄️ Database | SQLite via better-sqlite3 |
| 🧠 AI | Anthropic Claude (claude-sonnet-4) |
| 🕸️ Web scraping | Axios + Cheerio |
| 📤 File uploads | Multer |
| 🛡️ Security | Helmet, express-rate-limit, CORS |
| 🚢 Deployment | Docker + Nginx |

<br/>

<img src="https://capsule-render.vercel.app/api?type=rect&color=0:ff5252,100:0b1020&height=70&section=header&text=Security%20Notes&fontSize=28&fontColor=ffffff&animation=blinking&fontAlignY=50" alt="Security Notes" width="100%"/>

<div align="center">
<img src="https://readme-typing-svg.demolab.com?font=JetBrains+Mono&weight=600&size=15&duration=2500&pause=700&color=FF5252&background=00000000&center=true&vCenter=true&width=600&height=28&lines=%F0%9F%A4%96+MODULE+07+-+DEFENSE+GRID;Shields+up...;Threat+level%3A+LOW" alt="module 07" />
</div>

- 🚦 **Rate limiting:** 30 requests/minute per IP on `/api/detect`
- 📦 **File uploads** capped at 5 MB
- ✂️ **Input text** truncated to 8000 characters before sending to Claude
- 🌐 **CORS** restricted to `FRONTEND_URL`
- 🪖 **Helmet** sets secure HTTP headers

<br/>

<img src="https://capsule-render.vercel.app/api?type=rect&color=0:ffd54f,100:0b1020&height=70&section=header&text=License&fontSize=28&fontColor=ffffff&animation=twinkling&fontAlignY=50" alt="License" width="100%"/>

<div align="center">
<img src="https://readme-typing-svg.demolab.com?font=JetBrains+Mono&weight=600&size=15&duration=2500&pause=700&color=FFD54F&background=00000000&center=true&vCenter=true&width=600&height=28&lines=%F0%9F%A4%96+MODULE+08+-+SYSTEM+STATUS;Released+under+MIT;Free+to+use+and+remix" alt="module 08" />
</div>

Released under the **MIT** license.

<br/>

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:0b1020,50:7c4dff,100:00e5ff&height=140&section=footer&text=SYSTEM%20ONLINE&fontSize=30&fontColor=ffffff&animation=twinkling&fontAlignY=65" alt="System online" width="100%"/>
