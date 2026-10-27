# SkillProof — Complete Full-Stack Career Productivity & Portfolio Platform

> **“Your work speaks. Make the proof visible.”**

**SkillProof** is a modern, light-themed SaaS web application designed for students, fresh graduates, and software job seekers. It organizes skills and projects, builds professional developer portfolios, audits existing portfolio websites and resumes, compares competencies against target job roles, calculates transparent readiness scores, and generates tailored AI prompts for tools such as **Google Antigravity** and **ChatGPT**.

---

## 1. Key Application Features

### 1. Dashboard
- **Welcome & Identity:** Displays user profile details, target role, and LocalStorage session status.
- **Dynamic Metrics:** Real-time Profile Completion percentage, Documented Project count, and Resume ATS status.
- **5-Pillar Readiness Score:** Visual progress indicator and status label calculated deterministically across 5 weighted categories.
- **Recent Activity Feed:** Reflects real user actions (resume audits, project saves, prompt creations) persisted in LocalStorage.
- **Quick Action Launchers:** 1-click access to add projects, edit profile, build portfolio, audit resume, and match skills.

### 2. My Profile (Profile Management)
- **Comprehensive Fields:** Full name, professional headline, summary/about me, email, location, profile avatar URL.
- **Target Role Selector:** Select from 7 industry benchmarks (Full Stack, Frontend, Backend, Data Analyst, Machine Learning Engineer, Python Developer, Software Developer).
- **Skill & Language Arrays:** Tag-based input for technical skills, soft skills, and languages.
- **Repeatable Collections:** Multiple education degrees, internship/work experience entries, and professional certifications.
- **Online Links:** GitHub, LinkedIn, and personal website URLs.
- **Actions:** Real-time LocalStorage saving, reset to clean slate with confirmation, and 1-click preview in Portfolio Builder.

### 3. My Projects (Project Management)
- **Complete Project Metadata:** Title, category, problem statement, technical solution, detailed description, tech stack tags, personal contribution, key outcomes with metrics, GitHub repository URL, and live demo URL.
- **Actions:** Add project modal, edit existing project, delete with confirmation, view full project details modal.
- **Search, Filter & Sort:** Search across titles/descriptions/tech stacks; filter by category or technology; sort by newest, oldest, title, or featured.
- **Featured Toggle:** Mark showcase projects to display prominently on exported portfolios.
- **Data Safety:** Persisted to `skillproof_projects_v1` with zero data loss on browser refresh.

### 4. Portfolio Builder (3 Distinct Architectural Templates)
- **3 Distinct Templates (Genuinely different layouts):**
  1. **Minimal Professional:** Clean, white, typography-focused, elegant minimalist layout with quiet borders.
  2. **Modern Developer:** Technical, project-focused layout with terminal status pills, problem boxes, and metric callouts.
  3. **Creative Portfolio:** Visually expressive with asymmetric hero card, rich tag pills, and elevated hover cards.
- **Interactive Customizer:** Accent color palette (SkillProof Violet `#635BFF`, Emerald `#0D9488`, Royal Blue `#2563EB`, Executive Slate `#1E293B`, Sunset Orange `#EA580C`, Orchid `#9333EA`), typography selector, and section visibility toggles.
- **Live Responsive Device Preview:** Interactive preview iframe supporting **Desktop (100%)**, **Tablet (768px)**, and **Mobile (375px)** viewpoints.
- **Portfolio ZIP Export:** Generates complete static website files (`index.html`, `styles.css`, `script.js`, `README.md`) packaged into a downloadable ZIP archive using `JSZip` for hosting on GitHub Pages, Vercel, or Netlify.

### 5. Portfolio Analyzer
- **Method A — URL Audit:** Input any public HTTP/HTTPS URL. The backend fetches content with SSRF protection, timeout limits, and honest error handling if a site is unreachable or protected by anti-bot walls.
- **Method B — Paste Content:** Paste portfolio text, about section, and project descriptions for instant audit.
- **Scoring & Feedback:** Overall score out of 100, category scores (Content, Projects, Skills, Evidence, Structure), detected strengths, missing sections, and prioritized recommendations.

### 6. Resume Analyzer
- **Dual Input Options:** Paste resume text directly or upload text-based PDF/DOCX files (parsed in-memory via `pdf-parse` and `mammoth`).
- **Comprehensive ATS Readability:** Evaluates contact details, role-specific keyword density for the target role, and action-oriented bullet points.
- **Output:** Overall score out of 100, quality grade, matched vs. missing keywords, and concrete bullet point improvement suggestions.

### 7. Skill Matcher
- **Target Role Comparison:** Select from standard role benchmarks or customize.
- **Job Description Keyword Extraction:** Paste actual job posting text to extract demanded technology keywords.
- **Match Ratio:** Visual circular gauge showing percentage alignment against required competencies.
- **Matched vs. Missing Skills:** Clear badge breakdown of covered skills and underrepresented areas.
- **Prioritized Learning Checklist:** High, Medium, and Low priority competencies with estimated weeks to master.
- **Suggested Project Evidence:** Practical project concepts designed to demonstrate missing skills without falsely claiming completion.
- **Transparency Notice:** Clearly documented as an automated estimate, not an employer hiring prediction.

### 8. AI Prompt Studio
- **12 Specialized Categories:**
  1. Portfolio website generation
  2. Portfolio improvement
  3. Project development
  4. Resume improvement
  5. Job-role skill learning plan
  6. GitHub README generation
  7. Project documentation
  8. UI/UX redesign
  9. Bug fixing and debugging
  10. Code explanation
  11. Interview preparation
  12. Custom prompt
- **Target AI Tool Selection:** Toggle between **Google Antigravity** (strict, production-grade implementation) and **ChatGPT** (structured conceptual/code deliverables).
- **Personalized Context:** Injects candidate's real projects, metrics, target role, and tech stacks.
- **Workspace Tools:** In-place prompt editor, copy to clipboard, download as `.md` or `.txt`, save to history, reopen saved prompts, and delete prompt records.

### 9. Settings & LocalStorage Management
- **Persistence Disclosure:** Transparent explanation that all data resides in the user's browser.
- **Storage Metrics:** Live count of saved projects, skills, prompts, and profile status.
- **JSON Backup:** 1-click **Export Application JSON** and **Import Backup JSON** with schema validation.
- **Danger Zone:** Complete wipe of all application data with strong confirmation modal.
- **Demo Reset:** Instant button to reload sample data.

---

## 2. Technology Stack

- **Frontend:**
  - React 18
  - Vite 6
  - Lucide React icons
  - JSZip (Client-side ZIP packaging)
  - Plain modern CSS with CSS variables (`#635BFF` violet accent, clean light background `#FFFFFF` / `#F7F8FA`)
- **Backend:**
  - Node.js (ES Modules)
  - Express.js
  - Multer (Safe in-memory file parsing)
  - pdf-parse (PDF extraction)
  - mammoth (DOCX extraction)
  - cors & dotenv
- **Persistence:**
  - Browser LocalStorage (Primary local-first persistence layer; zero MongoDB, Postgres, or external database required)

---

## 3. Versioned LocalStorage Keys

SkillProof manages all state using standardized, versioned LocalStorage keys:

| Key | Purpose |
|---|---|
| `skillproof_profile_v1` | Candidate personal details, headline, skills, education, experience, and links |
| `skillproof_projects_v1` | Array of documented projects with problem statements, outcomes, and URLs |
| `skillproof_portfolio_config_v1` | Template selection (`minimal`, `modern`, `creative`), accent color, fonts, visible sections |
| `skillproof_prompt_history_v1` | History of generated AI prompt specifications |
| `skillproof_analysis_history_v1` | Recent portfolio and resume audit results |
| `skillproof_preferences_v1` | Workspace preferences and display settings |
| `skillproof_session_v1` | Local prototype authentication and demo session |

---

## 4. Backend REST API Endpoints

The Express server runs on `http://localhost:5001` and adheres to standard response formatting:

```json
{
  "success": true,
  "data": {},
  "message": "Operation completed"
}
```

### Endpoints:
- `GET /api/health` — Service health check and uptime status.
- `POST /api/portfolio/analyze` — Audits a portfolio URL (with SSRF protection) or pasted content.
- `POST /api/portfolio/generate` — Generates static portfolio website files (`index.html`, `styles.css`, `script.js`, `README.md`) for the selected template.
- `POST /api/resume/analyze` — Parses PDF/DOCX files or raw text and evaluates ATS keyword alignment.
- `POST /api/skills/match` — Evaluates role-to-skill alignment, extracts job description keywords, and returns prioritized learning checklists.
- `GET /api/skills/roles` — Returns supported benchmark role profiles.
- `POST /api/readiness/score` — Computes 5-pillar composite readiness score (25/25/20/15/15 weights).
- `POST /api/prompts/generate` — Generates structured prompts for Google Antigravity or ChatGPT across 12 categories.
- `GET /api/prompts/categories` — Returns metadata for all 12 prompt categories.

---

## 5. Folder Structure

```
SkillsProof/
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Sidebar.jsx            # 9-section collapsible navigation
│   │   │   └── TopBar.jsx             # Role selector, search, avatar menu & actions
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx        # SaaS welcome page, login modal, and demo access
│   │   │   ├── Dashboard.jsx          # Live metrics, score bar, recent activity
│   │   │   ├── ProfileOnboarding.jsx  # "My Profile" tabbed profile editor
│   │   │   ├── ProjectsManager.jsx    # "My Projects" CRUD, search, filter, sort
│   │   │   ├── PortfolioStudio.jsx    # "Portfolio Builder" with 3 templates & ZIP export
│   │   │   ├── PortfolioAnalyzer.jsx  # URL / text audit with transparent scoring
│   │   │   ├── ResumeAnalyzer.jsx     # PDF/DOCX and text ATS readability audit
│   │   │   ├── SkillMatcher.jsx       # Role comparison & job description keyword extractor
│   │   │   ├── PromptStudio.jsx       # 12-category AI prompt generator with history
│   │   │   └── SettingsPage.jsx       # JSON export/import & data clearing
│   │   ├── services/
│   │   │   ├── api.js                 # Frontend REST API client with local fallbacks
│   │   │   └── storage.js             # Centralized versioned LocalStorage manager
│   │   ├── styles/
│   │   │   └── index.css              # Design tokens, light theme, responsive rules
│   │   ├── App.jsx                    # Root view controller & route manager
│   │   └── main.jsx                   # Vite entry point
│   ├── index.html                     # Application HTML shell
│   ├── vite.config.js                 # Vite configuration with /api proxy to 5001
│   └── package.json
├── server/
│   ├── services/
│   │   ├── portfolioService.js        # Web crawler & text analyzer
│   │   ├── portfolioGeneratorService.js # 3 template generator (Minimal, Modern, Creative)
│   │   ├── resumeService.js           # PDF/DOCX parser & ATS keyword matcher
│   │   ├── skillMatcherService.js     # Role benchmark libraries & job text extractor
│   │   ├── readinessService.js        # Deterministic 5-pillar scoring engine
│   │   └── promptService.js           # 12-category prompt template engine
│   ├── utils/
│   │   └── ssrf.js                    # SSRF protection and private IP filtering
│   ├── server.js                      # Express application & route handlers
│   ├── test-endpoints.js              # Node.js service verification suite
│   ├── .env.example
│   └── package.json
├── package.json                       # Root script orchestrator
├── README.md
└── .gitignore
```

---

## 6. How to Run & Deploy the Application

### Prerequisites
- Node.js (version 18 or higher)
- npm or pnpm

### Quick Commands (Root Orchestrator)

| Purpose | Command | Description |
|---|---|---|
| **Install Dependencies** | `npm run install:all` | Installs root, client, and server dependencies |
| **Run Tests** | `npm test` | Runs the 20-test automated verification suite |
| **Build for Production** | `npm run build` | Compiles Vite React client into `client/dist` |
| **Start Production Server** | `npm start` | **Single-Host production server** on `http://localhost:5001` (or `$PORT`) |
| **Start Development** | `npm run dev` | Concurrently runs Express backend and Vite client |

---

## 7. Single-Host Deployment Architecture

SkillProof is architected for deployment using **ONE hosting service and ONE public website URL** (e.g., Render, Railway, DigitalOcean App Platform, Fly.io, or Heroku).

```
                      +---------------------------------------+
                      |       ONE Public URL / One Host       |
                      |        Express Server (Node.js)       |
                      +-------------------+-------------------+
                                          |
                +-------------------------+-------------------------+
                |                                                   |
       [ /api/* Routes ]                                  [ All Other Routes ]
                |                                                   |
   - POST /api/readiness/score                        - Serves client/dist static assets
   - POST /api/skills/match                           - Falls back to client/dist/index.html
   - POST /api/resume/analyze                           (React Router SPA navigation)
   - POST /api/portfolio/analyze                      - Unknown /api/* routes return JSON 404
   - POST /api/prompts/generate
   - SSRF Protection & File Parsers
```

### Deployment Steps on Any Node.js Host:
1. **Build Command:** `npm run build`
2. **Start Command:** `npm start`
3. **Environment Variables:**
   - `PORT`: (Optional) Port provided by the hosting environment (defaults to `5001`).
   - `NODE_ENV`: Set to `production`.

---

## 8. Verification & Automated Test Suite

The comprehensive automated test suite (`server/test-endpoints.js`) verifies all services, SSRF protections, scoring mathematics, and single-host build artifacts:

```bash
# Execute automated test suite
npm test
```

### Verified Test Results (20 Passed, 0 Failed):
- [x] **SSRF Protection:** Successfully blocks loopback (`127.0.0.1`), RFC 1918 private subnets (`10.0.0.1`), link-local/AWS cloud metadata (`169.254.169.254`), `localhost` hostnames, non-HTTP protocols (`ftp://`, `file://`), and safely permits valid public HTTPS targets.
- [x] **Skill Normalization & Matching:** Correctly normalizes aliases (e.g. `node` -> `Node.js`, `ReactJS` -> `React`, `Postgres` -> `PostgreSQL`, `TS` -> `TypeScript`), calculates accurate match ratios, and extracts skills from pasted job descriptions.
- [x] **Readiness Scoring Engine:** Accurately calculates 0-100 scores with correct pillar weighting (25% Skills, 25% Projects, 20% Evidence, 15% Resume, 15% Structure), flags preliminary scores for empty profiles, and awards 0 points for missing evidence.
- [x] **Resume ATS Readability:** Accurately extracts contact info (email, GitHub, LinkedIn), keywords, and action verbs; rejects empty/0-byte/corrupt files with informative error messages.
- [x] **Portfolio Analyzer & Generator:** Validates pasted text evaluation and ensures all 3 templates (`minimal`, `modern`, `creative`) generate valid HTML, CSS, JS, and README.
- [x] **AI Prompt Studio:** Generates structured prompts across all 12 categories for both Google Antigravity and ChatGPT.
- [x] **Single-Host Production Build:** Confirms `client/dist` exists with valid `index.html` and bundled assets.

---

## 9. Architectural Limitations Policy

In adherence to strict engineering standards, SkillProof retains **ONLY ONE major documented architectural limitation**:

### Primary Documented Architectural Limitation
- **Browser LocalStorage Persistence:** Application data (profile details, documented projects, portfolio configuration, prompt history, analysis reports, and user preferences) is stored in the local browser on the current device. Data does not automatically synchronize across different browsers or separate devices without an external central database.
- **Transfer & Backup Solution:** Users can transfer or back up their entire workspace between devices at any time using the built-in **Export Application JSON** and **Import Backup JSON** utilities located in the **Settings** view.

### Documented Subcase Note
- **Scanned Resumes Without Selectable Text:** Uploaded resume files (PDF/DOCX) must contain an embedded digital text layer. Scanned images or rasterized PDFs lack selectable text and cannot be reliably parsed without heavy native OCR dependencies; the application detects this condition honestly, informs the user, and provides an instant text-paste fallback.
