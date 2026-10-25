"""
Impact Comparator Engine for comparing baseline and candidate rule versions
on the exact same versioned dataset.
"""

from typing import Any, Dict, List, Tuple
from .rule_dsl import DeterministicRuleEngine

class ImpactComparator:
    @staticmethod
    def compare_versions(
        baseline_dsl: Dict[str, Any],
        candidate_dsl: Dict[str, Any],
        dataset: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """
        Executes both baseline and candidate rules on the identical dataset records.
        Produces record-by-record comparison, pinpointing exact condition changes and difference causes.
        """
        total = len(dataset)
        unchanged_cases = []
        changed_cases = []

        for record in dataset:
            record_id = record.get("id") or record.get("borrower_id") or f"REC-{len(unchanged_cases)+len(changed_cases)+1}"
            
            baseline_result = DeterministicRuleEngine.evaluate(baseline_dsl, record)
            candidate_result = DeterministicRuleEngine.evaluate(candidate_dsl, record)

            baseline_action = baseline_result.get("action", {})
            candidate_action = candidate_result.get("action", {})

            # An outcome is changed if the core decision or quantitative metrics (risk_weight, buffer, decision) changed
            core_outcome_keys = ["decision", "risk_weight", "additional_buffer_percent"]
            has_difference = any(
                baseline_action.get(k) != candidate_action.get(k)
                for k in core_outcome_keys
            )
            step_transition = baseline_result.get("matched_step_id") != candidate_result.get("matched_step_id")

            case_summary = {
                "record_id": record_id,
                "input_data": record,
                "baseline_step": baseline_result.get("matched_step_id"),
                "baseline_action": baseline_action,
                "baseline_triggered": baseline_result.get("triggered_clauses", []),
                "candidate_step": candidate_result.get("matched_step_id"),
                "candidate_action": candidate_action,
                "candidate_triggered": candidate_result.get("triggered_clauses", []),
                "changed": has_difference
            }

            if has_difference:
                # Find specific differential fields in action
                diff_keys = []
                all_keys = set(baseline_action.keys()).union(set(candidate_action.keys()))
                for k in all_keys:
                    if baseline_action.get(k) != candidate_action.get(k):
                        diff_keys.append({
                            "field": k,
                            "baseline_value": baseline_action.get(k),
                            "candidate_value": candidate_action.get(k)
                        })

                case_summary["differential_fields"] = diff_keys
                case_summary["difference_reason"] = (
                    f"Transitioned from step '{baseline_result.get('matched_step_id')}' "
                    f"to candidate step '{candidate_result.get('matched_step_id')}'."
                )
                changed_cases.append(case_summary)
            else:
                unchanged_cases.append(case_summary)

        return {
            "total_evaluated": total,
            "unchanged_count": len(unchanged_cases),
            "changed_count": len(changed_cases),
            "changed_percentage": round((len(changed_cases) / total * 100), 1) if total > 0 else 0.0,
            "changed_cases": changed_cases,
            "unchanged_sample": unchanged_cases[:5] # sample of unchanged
        }
