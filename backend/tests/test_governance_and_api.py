import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.data.init_db import init_db

@pytest.fixture(scope="module", autouse=True)
def setup_test_db():
    init_db()

client = TestClient(app)

def test_health_check():
    res = client.get("/health")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "healthy"

def test_list_circulars():
    res = client.get("/api/v1/circulars")
    assert res.status_code == 200
    circulars = res.json()
    assert len(circulars) >= 1
    assert circulars[0]["source_authority"] == "Reserve Bank of India"

def test_dashboard_metrics_role_specific():
    # Analyst metrics
    res_analyst = client.get("/api/v1/dashboard/metrics", headers={"X-User-Id": "usr-analyst-01"})
    assert res_analyst.status_code == 200
    data_a = res_analyst.json()
    assert data_a["role"] == "COMPLIANCE_ANALYST"
    assert "circulars_awaiting_review" in data_a["metrics"]

    # Engineer metrics
    res_eng = client.get("/api/v1/dashboard/metrics", headers={"X-User-Id": "usr-engineer-01"})
    assert res_eng.status_code == 200
    data_e = res_eng.json()
    assert data_e["role"] == "RULE_ENGINEER"
    assert "assigned_implementation_tasks" in data_e["metrics"]

    # Approver metrics
    res_appr = client.get("/api/v1/dashboard/metrics", headers={"X-User-Id": "usr-approver-01"})
    assert res_appr.status_code == 200
    data_ap = res_appr.json()
    assert data_ap["role"] == "COMPLIANCE_APPROVER"
    assert "pending_approval_decisions" in data_ap["metrics"]

    # Admin metrics
    res_adm = client.get("/api/v1/dashboard/metrics", headers={"X-User-Id": "usr-admin-01"})
    assert res_adm.status_code == 200
    data_ad = res_adm.json()
    assert data_ad["role"] == "PLATFORM_ADMIN"
    assert "total_users" in data_ad["metrics"]

def test_analyst_cannot_approve_or_deploy():
    # Analyst attempts to approve -> Must return 403 Forbidden
    res_appr = client.post(
        "/api/v1/approvals",
        json={
            "rule_version_id": "ver-cand-01",
            "test_run_id": "tr-01",
            "impact_report_id": "ir-01",
            "decision": "APPROVED",
            "rationale": "Analyst illegal approval"
        },
        headers={"X-User-Id": "usr-analyst-01"}
    )
    assert res_appr.status_code == 403

    # Analyst attempts to deploy -> Must return 403 Forbidden
    res_dep = client.post(
        "/api/v1/deployments",
        json={"rule_version_id": "ver-cand-01", "approval_id": "fake"},
        headers={"X-User-Id": "usr-analyst-01"}
    )
    assert res_dep.status_code == 403

def test_engineer_cannot_approve_own_rule():
    # Engineer attempts to approve candidate version authored by them -> Must return 403
    res = client.post(
        "/api/v1/approvals",
        json={
            "rule_version_id": "ver-cand-01",
            "test_run_id": "tr-01",
            "impact_report_id": "ir-01",
            "decision": "APPROVED",
            "rationale": "Engineer self-approval"
        },
        headers={"X-User-Id": "usr-engineer-01"}
    )
    assert res.status_code == 403

def test_admin_cannot_approve_without_approver_role():
    # Administrator privileges do not grant business approval
    res = client.post(
        "/api/v1/approvals",
        json={
            "rule_version_id": "ver-cand-01",
            "test_run_id": "tr-01",
            "impact_report_id": "ir-01",
            "decision": "APPROVED",
            "rationale": "Admin approval attempt"
        },
        headers={"X-User-Id": "usr-admin-01"}
    )
    assert res.status_code == 403

def test_approver_cannot_author_rule_or_deploy():
    # Approver cannot create rule version draft
    res_rule = client.post(
        "/api/v1/rules/rule-cr-01/versions",
        json={"version_number": "1.3.0", "dsl_definition": {}, "change_summary": "Illegal edit"},
        headers={"X-User-Id": "usr-approver-01"}
    )
    assert res_rule.status_code == 403

    # Approver cannot deploy to sandbox
    res_dep = client.post(
        "/api/v1/deployments",
        json={"rule_version_id": "ver-cand-01", "approval_id": "some-id"},
        headers={"X-User-Id": "usr-approver-01"}
    )
    assert res_dep.status_code == 403

def test_legitimate_approver_approval_and_engineer_deployment():
    # 1. Approver approves candidate version
    res_appr = client.post(
        "/api/v1/approvals",
        json={
            "rule_version_id": "ver-cand-01",
            "test_run_id": "tr-01",
            "impact_report_id": "ir-01",
            "decision": "APPROVED",
            "rationale": "Certified by Compliance Approver against RBI Circular 2026/84."
        },
        headers={"X-User-Id": "usr-approver-01"}
    )
    assert res_appr.status_code == 200
    approval_id = res_appr.json()["id"]

    # 2. Rule Engineer deploys to sandbox
    res_dep = client.post(
        "/api/v1/deployments",
        json={
            "rule_version_id": "ver-cand-01",
            "approval_id": approval_id,
            "notes": "Sandbox promotion of certified version"
        },
        headers={"X-User-Id": "usr-engineer-01"}
    )
    assert res_dep.status_code == 200
    assert res_dep.json()["status"] == "DEPLOYED"

def test_deploy_unapproved_version_fails():
    # Engineer attempts to deploy unapproved baseline version
    res = client.post(
        "/api/v1/deployments",
        json={"rule_version_id": "ver-base-01", "approval_id": "non-existent-approval"},
        headers={"X-User-Id": "usr-engineer-01"}
    )
    assert res.status_code == 400
