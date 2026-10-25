import pytest
from app.engine.rule_dsl import DeterministicRuleEngine, RuleValidationError
from app.engine.impact_comparator import ImpactComparator
from app.data.seed_data import BASELINE_RULE_DSL, CANDIDATE_RULE_DSL, generate_synthetic_dataset

def test_dsl_validation_valid():
    is_valid, errors = DeterministicRuleEngine.validate_dsl(CANDIDATE_RULE_DSL)
    assert is_valid is True
    assert len(errors) == 0

def test_dsl_validation_invalid_operator():
    invalid_dsl = {
        "name": "Invalid Test Rule",
        "version": "1.0",
        "rules": [
            {
                "id": "STEP_1",
                "conditions": {
                    "operator": "AND",
                    "clauses": [
                        {"field": "amount", "operator": "EXECUTE_ARBITRARY_CODE", "value": 100}
                    ]
                },
                "action": {"decision": "FAIL"}
            }
        ]
    }
    is_valid, errors = DeterministicRuleEngine.validate_dsl(invalid_dsl)
    assert is_valid is False
    assert any("unsupported operator" in e for e in errors)

def test_deterministic_evaluation_baseline():
    payload = {
        "loan_type": "UNSECURED_PERSONAL",
        "loan_amount": 100000,
        "borrower_credit_score": 750,
        "is_regulatory_exempt": False
    }
    res = DeterministicRuleEngine.evaluate(BASELINE_RULE_DSL, payload)
    assert res["matched_step_id"] == "BASELINE_ALL_UNSECURED"
    assert res["action"]["risk_weight"] == 100
    assert res["action"]["additional_buffer_percent"] == 0.0

def test_deterministic_evaluation_candidate_high_risk():
    # Unsecured personal loan > 50,000 must trigger enhanced 125% risk weight
    payload = {
        "loan_type": "UNSECURED_PERSONAL",
        "loan_amount": 100000,
        "borrower_credit_score": 750,
        "is_regulatory_exempt": False
    }
    res = DeterministicRuleEngine.evaluate(CANDIDATE_RULE_DSL, payload)
    assert res["matched_step_id"] == "STEP_2_ENHANCED_UNSECURED_SURCHARGE"
    assert res["action"]["risk_weight"] == 125
    assert res["action"]["additional_buffer_percent"] == 2.5
    assert res["action"]["decision"] == "ENHANCED_RISK_WEIGHT"

def test_deterministic_evaluation_candidate_exempt():
    # Priority sector microcredit is exempt
    payload = {
        "loan_type": "UNSECURED_PERSONAL",
        "loan_amount": 100000,
        "borrower_credit_score": 650,
        "is_regulatory_exempt": True
    }
    res = DeterministicRuleEngine.evaluate(CANDIDATE_RULE_DSL, payload)
    assert res["matched_step_id"] == "STEP_1_STATUTORY_EXEMPTION"
    assert res["action"]["risk_weight"] == 100
    assert res["action"]["additional_buffer_percent"] == 0.0

def test_impact_comparator_deterministic():
    dataset = generate_synthetic_dataset(50)
    comparison = ImpactComparator.compare_versions(BASELINE_RULE_DSL, CANDIDATE_RULE_DSL, dataset)
    assert comparison["total_evaluated"] == 50
    assert comparison["changed_count"] > 0
    assert comparison["unchanged_count"] > 0
    assert comparison["changed_count"] + comparison["unchanged_count"] == 50
    # Every changed case has differential fields identified
    for c in comparison["changed_cases"]:
        assert len(c["differential_fields"]) > 0
