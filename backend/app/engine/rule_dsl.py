"""
Deterministic Rule DSL Evaluator for Regulatory Intelligence Platform.
STRICT SAFETY GUARANTEE: Never uses eval(), exec(), or arbitrary code execution.
Only supports strictly typed deterministic operators and JSON AST.
"""

from typing import Any, Dict, List, Optional, Tuple

ALLOWED_COMPARISON_OPERATORS = {
    "EQUALS",
    "NOT_EQUALS",
    "GREATER_THAN",
    "GREATER_THAN_OR_EQUAL",
    "LESS_THAN",
    "LESS_THAN_OR_EQUAL",
    "IN",
    "NOT_IN",
    "CONTAINS"
}

ALLOWED_LOGICAL_OPERATORS = {"AND", "OR", "NOT"}

ALLOWED_PRIMITIVE_TYPES = {"string", "number", "boolean", "list"}


class RuleValidationError(Exception):
    def __init__(self, errors: List[str]):
        super().__init__("; ".join(errors))
        self.errors = errors


class DeterministicRuleEngine:
    @staticmethod
    def validate_dsl(dsl: Dict[str, Any]) -> Tuple[bool, List[str]]:
        """
        Validates the structure, types, operators, and clauses of the restricted JSON Rule DSL.
        Returns (is_valid, error_list).
        """
        errors = []

        if not isinstance(dsl, dict):
            return False, ["Rule DSL must be a valid JSON object."]

        # Check top-level required fields
        required_fields = ["name", "version", "rules"]
        for field in required_fields:
            if field not in dsl:
                errors.append(f"Missing required top-level field: '{field}'")

        # Validate input schema if present
        input_schema = dsl.get("input_schema", {})
        if not isinstance(input_schema, dict):
            errors.append("'input_schema' must be an object defining field types.")
        else:
            for field_name, expected_type in input_schema.items():
                if expected_type not in ALLOWED_PRIMITIVE_TYPES:
                    errors.append(
                        f"Field '{field_name}' in input_schema specifies unsupported type '{expected_type}'. "
                        f"Allowed types: {sorted(list(ALLOWED_PRIMITIVE_TYPES))}"
                    )

        # Validate rules array
        rules = dsl.get("rules", [])
        if not isinstance(rules, list):
            errors.append("'rules' must be a list of rule steps.")
        elif len(rules) == 0:
            errors.append("'rules' array must contain at least one step.")
        else:
            for idx, step in enumerate(rules):
                step_prefix = f"Rule step {idx+1}"
                if not isinstance(step, dict):
                    errors.append(f"{step_prefix} must be an object.")
                    continue

                if "id" not in step or not isinstance(step["id"], str):
                    errors.append(f"{step_prefix} missing string 'id'.")

                if "action" not in step or not isinstance(step["action"], dict):
                    errors.append(f"{step_prefix} missing 'action' dictionary.")

                conditions = step.get("conditions", {})
                step_errors = DeterministicRuleEngine._validate_condition_group(conditions, f"{step_prefix} condition")
                errors.extend(step_errors)

        return (len(errors) == 0, errors)

    @staticmethod
    def _validate_condition_group(cond_group: Any, path: str) -> List[str]:
        errors = []
        if not isinstance(cond_group, dict):
            return [f"{path} must be an object."]

        operator = cond_group.get("operator", "AND")
        if operator not in ALLOWED_LOGICAL_OPERATORS:
            errors.append(f"{path} uses invalid logical operator '{operator}'. Allowed: {sorted(list(ALLOWED_LOGICAL_OPERATORS))}")

        clauses = cond_group.get("clauses", [])
        if not isinstance(clauses, list):
            return [f"{path} 'clauses' must be a list."]

        for c_idx, clause in enumerate(clauses):
            c_path = f"{path} clause {c_idx+1}"
            if not isinstance(clause, dict):
                errors.append(f"{c_path} must be an object.")
                continue

            # Nested logical group
            if "operator" in clause and clause["operator"] in ALLOWED_LOGICAL_OPERATORS:
                errors.extend(DeterministicRuleEngine._validate_condition_group(clause, c_path))
                continue

            # Leaf comparison clause
            if "field" not in clause or not isinstance(clause["field"], str):
                errors.append(f"{c_path} missing string 'field'.")

            op = clause.get("operator")
            if op not in ALLOWED_COMPARISON_OPERATORS:
                errors.append(f"{c_path} uses unsupported operator '{op}'. Allowed: {sorted(list(ALLOWED_COMPARISON_OPERATORS))}")

            if "value" not in clause:
                errors.append(f"{c_path} missing comparison 'value'.")

        return errors

    @staticmethod
    def evaluate(dsl: Dict[str, Any], payload: Dict[str, Any]) -> Dict[str, Any]:
        """
        Deterministically evaluates payload against rule DSL steps in order.
        Returns result dict with action, matched_step_id, triggered_clauses, and execution telemetry.
        """
        is_valid, errors = DeterministicRuleEngine.validate_dsl(dsl)
        if not is_valid:
            raise RuleValidationError(errors)

        rules = dsl.get("rules", [])
        for step in rules:
            step_id = step.get("id", "UNNAMED_STEP")
            conditions = step.get("conditions", {})
            matched, triggered = DeterministicRuleEngine._eval_condition_group(conditions, payload)
            
            if matched:
                return {
                    "matched_step_id": step_id,
                    "action": step.get("action", {}),
                    "triggered_clauses": triggered,
                    "evaluated_successfully": True
                }

        # Fallback if no step matched
        return {
            "matched_step_id": None,
            "action": {"decision": "NO_RULE_MATCH", "compliance_flag": "FALLTHROUGH"},
            "triggered_clauses": [],
            "evaluated_successfully": True
        }

    @staticmethod
    def _eval_condition_group(cond_group: Dict[str, Any], payload: Dict[str, Any]) -> Tuple[bool, List[Dict[str, Any]]]:
        operator = cond_group.get("operator", "AND").upper()
        clauses = cond_group.get("clauses", [])
        
        # Empty clauses in AND group matches by default (e.g. default fallback step)
        if len(clauses) == 0:
            return True, []

        triggered_clauses = []
        clause_results = []

        for clause in clauses:
            if "operator" in clause and clause["operator"] in ALLOWED_LOGICAL_OPERATORS:
                sub_matched, sub_triggered = DeterministicRuleEngine._eval_condition_group(clause, payload)
                clause_results.append(sub_matched)
                if sub_matched:
                    triggered_clauses.extend(sub_triggered)
            else:
                matched, detail = DeterministicRuleEngine._eval_leaf_clause(clause, payload)
                clause_results.append(matched)
                if matched:
                    triggered_clauses.append(detail)

        if operator == "AND":
            final_match = all(clause_results)
        elif operator == "OR":
            final_match = any(clause_results)
        elif operator == "NOT":
            final_match = not any(clause_results)
        else:
            final_match = False

        return final_match, triggered_clauses if final_match else []

    @staticmethod
    def _eval_leaf_clause(clause: Dict[str, Any], payload: Dict[str, Any]) -> Tuple[bool, Dict[str, Any]]:
        field = clause.get("field", "")
        op = clause.get("operator", "EQUALS")
        expected_val = clause.get("value")
        actual_val = payload.get(field)

        detail = {
            "field": field,
            "operator": op,
            "expected_value": expected_val,
            "actual_value": actual_val
        }

        if actual_val is None and op not in ("EQUALS", "NOT_EQUALS"):
            return False, detail

        matched = False
        try:
            if op == "EQUALS":
                matched = (actual_val == expected_val)
            elif op == "NOT_EQUALS":
                matched = (actual_val != expected_val)
            elif op == "GREATER_THAN":
                matched = (float(actual_val) > float(expected_val))
            elif op == "GREATER_THAN_OR_EQUAL":
                matched = (float(actual_val) >= float(expected_val))
            elif op == "LESS_THAN":
                matched = (float(actual_val) < float(expected_val))
            elif op == "LESS_THAN_OR_EQUAL":
                matched = (float(actual_val) <= float(expected_val))
            elif op == "IN":
                matched = (actual_val in expected_val) if isinstance(expected_val, list) else False
            elif op == "NOT_IN":
                matched = (actual_val not in expected_val) if isinstance(expected_val, list) else True
            elif op == "CONTAINS":
                matched = (expected_val in actual_val) if actual_val is not None else False
        except (ValueError, TypeError):
            matched = False

        return matched, detail
