# Regulatory Change Intelligence Platform
> **Regulatory Circular to Live Rule Engine** — Virtusa Hackathon Project

A human-governed, enterprise regulatory change workbench that transforms regulatory circulars into source-traceable, testable, human-approved decision-rule changes.

---

## 1. Executive Summary & Core Business Workflow

The **Regulatory Change Intelligence Platform** bridges the critical gap between unstructured regulatory directives and operational algorithmic rule execution:

```
[1. Ingest Circular] ──► [2. Source Citations & Obligation Review] ──► [3. Policy Mapping]
                                                                               │
[6. Sandbox Release] ◄── [5. Exact Version Approval] ◄── [4. Rule Studio & Impact Simulator]
         │
[7. Audit & Evidence Dossier]
```

1. **Ingest Circular**: Ingest regulatory circular (PDF or structured text) preserving page coordinates, layout, and document SHA-256 hash.
2. **Obligation Extraction**: Identify candidate obligations with source citations (Page number, Paragraph, exact quotation), actor, action, conditions, and ambiguity flags.
3. **Compliance Review**: Compliance Analyst certifies applicability (`Applicable`, `Not Applicable`, `Unresolved`) and records audit-bound rationale.
4. **Policy Mapping**: Match obligation against internal policy catalogue (`POL-CR-01`, `POL-UW-04`, `POL-PSL-12`) with match scoring or mark explicitly unmapped.
5. **Rule Studio**: Author decision logic in a **restricted JSON Rule DSL** with deterministic AST validation and zero arbitrary code execution (`eval()` and `exec()` strictly prohibited).
6. **Deterministic Testing**: Execute regression suites with exact version AST binding (5/5 verified passing assertions).
7. **Impact Simulator**: Compare baseline (`v1.0.0`) vs candidate (`v1.1.0-draft`) decision outcomes on identical versioned synthetic borrower portfolios (100 records).
8. **Independent Approval**: Dual-control sign-off by Compliance Approver referencing exact tested version with separation of duties enforcement.
9. **Sandbox Release & Rollback**: Promotion to isolated simulation sandbox (`demo-sandbox-v1`) with instant one-click rollback.
10. **Evidence Dossier**: Traceable audit trail linking Circular ➔ Citation ➔ Obligation ➔ Policy ➔ Rule Version ➔ Test Run ➔ Impact Report ➔ Approval ➔ Deployment.

---

## 2. Technology Stack & Architecture

- **Frontend**: Vue 3, TypeScript, Vite, Tailwind CSS, Pinia, Vue Router, Axios.
- **Design System**: Tailored enterprise palette (`#097172` Primary Teal, `#075456` Dark Teal, `#E8F5F4` Light Teal, `#F8FAFC` Surface, `#172033` Text, `#DCE7E7` Border). Pure vector SVG icon system (no Lucide, no emojis).
- **Backend**: Python 3.11, FastAPI, Pydantic v2 (`ConfigDict(from_attributes=True)`), SQLAlchemy 2.0.
- **Document Processing**: PyMuPDF (`fitz`) and PyPDF for page-accurate text extraction.
- **Rule Evaluator**: Custom deterministic JSON AST rule engine supporting logical operators (`AND`, `OR`, `NOT`) and typed comparators (`EQUALS`, `GREATER_THAN`, `LESS_THAN`, `IN`, `CONTAINS`).
- **Database**: SQLite (zero-setup out-of-the-box) / PostgreSQL compatible via SQLAlchemy.

---

## 3. Established Roles & Separation of Duties

| Role | Demo User | Responsibilities & Restrictions |
|---|---|---|
| **Compliance Analyst** | Maya Sen (`usr-analyst-01`) | Ingest circulars, review obligations, set applicability, configure policy mapping. *Cannot approve rules or perform releases.* |
| **Compliance Approver** | Vikram Mehta (`usr-approver-01`) | Inspect test evidence & impact reports, record formal approval decision. *Cannot approve self-authored rules or unverified versions.* |
| **Rule Engineer / IT Operator** | Arun Patel (`usr-engineer-01`) | Author restricted JSON DSL, run regression suites, promote approved versions to sandbox, execute emergency rollbacks. |
| **Platform Administrator** | Elena Rostova (`usr-admin-01`) | Monitor system health, inspect configuration & audit trail without bypassing business approvals. |

---

## 4. Quick Start & Run Instructions

### Prerequisites
- Python 3.11+
- Node.js v20+ / npm 10+

### Backend Setup & Launch
```powershell
# Navigate to backend
cd backend

# Install dependencies
python -m pip install -r requirements.txt

# Run test suite (13 unit & governance tests)
python -m pytest tests -v

# Launch FastAPI server (defaults to port 8000)
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000
```
*API interactive documentation will be available at:* `http://127.0.0.1:8000/docs`

### Frontend Setup & Launch
```powershell
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Run type check and production build
npm run build

# Launch Vite development server (port 5173)
npm run dev -- --host 127.0.0.1 --port 5173
```
*Application user interface will be available at:* `http://127.0.0.1:5173`

---

## 5. Automated Test Suite Results

```text
============================= test session starts =============================
platform win32 -- Python 3.11.9, pytest-9.1.1, pluggy-1.7.0
rootdir: D:\virtusa\backend
collected 13 items

tests/test_governance_and_api.py::test_health_check PASSED               [  7%]
tests/test_governance_and_api.py::test_list_circulars PASSED             [ 15%]
tests/test_governance_and_api.py::test_list_obligations_and_source_citations PASSED [ 23%]
tests/test_governance_and_api.py::test_governance_separation_of_duties_enforced PASSED [ 30%]
tests/test_governance_and_api.py::test_governance_approver_role_required PASSED [ 38%]
tests/test_governance_and_api.py::test_governance_legitimate_approval PASSED [ 46%]
tests/test_governance_and_api.py::test_deployment_gating_unapproved_version PASSED [ 53%]
tests/test_rule_engine.py::test_dsl_validation_valid PASSED              [ 61%]
tests/test_rule_engine.py::test_dsl_validation_invalid_operator PASSED   [ 69%]
tests/test_rule_engine.py::test_deterministic_evaluation_baseline PASSED [ 76%]
tests/test_rule_engine.py::test_deterministic_evaluation_candidate_high_risk PASSED [ 84%]
tests/test_rule_engine.py::test_deterministic_evaluation_candidate_exempt PASSED [ 92%]
tests/test_rule_engine.py::test_impact_comparator_deterministic PASSED   [100%]

======================= 13 passed in 5.90s =======================
```
