# Property Portal (HSBC Task 2)

A Next.js portal that hosts two independent applications, each with a different backend, both using the house price model from [Task 1](https://github.com/kumarimini/house-price-api-python-hsbc-task-1).

| Part | Tech | Port |
|---|---|---|
| `portal/` | Next.js (App Router), TypeScript, Tailwind CSS, Recharts | 3000 |
| `estimator-api/` | Python, FastAPI (App 1: Property Value Estimator) | 8001 |
| `market-api/` | Java 21, Spring Boot 3.4.4 (App 2: Property Market Analysis) | 8080 |
| Model API (Task 1) | Python, FastAPI, scikit-learn, Docker | 8000 |

## Run everything

Requires Docker, Python 3.12+, Java 21, Maven and Node.js 20.9+. Use four terminals, and start them in this order.

**1. Model API (Task 1)**

```bash
git clone https://github.com/kumarimini/house-price-api-python-hsbc-task-1.git
cd house-price-api-python-hsbc-task-1
docker build -t house-price-api .
docker run -d -p 8000:8000 --name house-price-model house-price-api
```

**2. Estimator API (Python)**

```bash
cd estimator-api
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8001
```

**3. Market API (Java)**

```bash
cd market-api
mvn spring-boot:run
```

**4. Portal**

```bash
cd portal
npm install
npm run dev
```

Open http://localhost:3000. API docs for the Python services: http://localhost:8000/docs and http://localhost:8001/docs.

## Status

- Portal shell: shared layout, navigation, loading and error states
- App 1 (Estimator): form with validation, table and chart results, history, comparison
- App 2 (Market Analysis): Java API with aggregate statistics, filters and caching; dashboard with charts, filters and a sortable, searchable table
- In progress: what-if tool, CSV and PDF export