"""
Seed data fixtures for Regulatory Change Intelligence Platform.
Contains realistic synthetic regulatory circulars, internal policies,
baseline/candidate rules, test suites, and demo users.
"""

from datetime import datetime
import json
import uuid

SAMPLE_CIRCULAR_TEXT_P1 = """
RESERVE BANK OF INDIA
DEPARTMENT OF REGULATION
CENTRAL OFFICE, MUMBAI 400 001

Circular Ref: RBI/2026-27/84
DOR.STR.REC.57/21.06.001/2026-27
Dated: March 15, 2026

To: All Commercial Banks (excluding RRBs)
    All Non-Banking Financial Companies (including HFCs)
    All Small Finance Banks and Primary Urban Co-operative Banks

Madam / Dear Sir,

Regulatory Measures on Consumer Credit, Capital Adequacy and Risk-Weight Calibration

1. Background and Macroprudential Assessment
The Reserve Bank has been closely monitoring the rapid growth in consumer credit, particularly in the personal loan and unsecured retail credit segments. While consumer credit expansion supports household consumption and broader economic activity, high credit velocity without commensurate capital buffers poses macro-prudential risks to balance sheet resilience during potential cyclical downturns.

2. Prudential Scope and Applicable Entities
These directives are issued in exercise of powers conferred under Section 21 and Section 35A of the Banking Regulation Act, 1949, and Section 45JA of the Reserve Bank of India Act, 1934. All regulated commercial banks, licensed NBFCs, and Small Finance Banks shall align their credit underwriting and capital computation frameworks in accordance with the provisions specified herein.

3. Calibration of Risk Weights on Unsecured Consumer Exposures
On a review of prevailing credit risk profiles, it has been decided to recalibrate the regulatory risk weights applicable to consumer credit exposures:
(a) Commercial Banks: In terms of Master Circular on Basel III Capital Regulations, consumer credit exposures of commercial banks (outstanding as well as new) shall attract a risk weight of 125% where individual borrower commitments exceed INR 50,000 or credit bureau score is below 700.
(b) NBFCs: The risk weight on consumer credit exposures of NBFCs categorized under Upper and Middle layers shall similarly be elevated to 125%.
(c) The above recalibration shall explicitly exclude designated housing loans, education loans, and vehicle loans secured by registered hypothecation.
"""

SAMPLE_CIRCULAR_TEXT_P2 = """
4. Underwriting Standards & Debt-to-Income (DTI) Thresholds
Regulated entities must ensure robust credit discipline prior to disbursal of any consumer facility:
(a) Comprehensive Debt-to-Income (DTI) ratio computation shall be mandatory for all credit facilities where sanction limit exceeds INR 200,000.
(b) Total verified monthly debt repayment obligations, inclusive of the proposed new sanction, shall not exceed 50.0% of the applicant's validated net monthly income.
(c) Lenders shall obtain independent confirmation of source of funds and debt servicing obligations from registered Credit Information Companies (CICs) within 72 hours prior to disbursal.

5. Priority Sector and Microfinance Exemptions
To preserve financial inclusion objectives:
(a) Microfinance loans extended to qualifying households whose annual household income does not exceed INR 300,000 shall remain exempt from the enhanced 125% risk weight surcharge.
(b) Qualifying Self-Help Group (SHG) and Joint Liability Group (JLG) advances under priority sector lending guidelines shall continue to be risk-weighted at the standard baseline of 100%.

6. Implementation Timeline and Board Governance
(a) Regulated entities shall place this circular before their respective Risk Management Committees and Boards of Directors within 30 days of receipt.
(b) The recalibrated risk-weight computations and DTI validation controls shall become effective from close of business on June 30, 2026.
(c) Internal audit teams shall review algorithmic decision systems and underwriting rule engines to certify compliance.

Yours faithfully,
(Dr. S. K. Venkataraman)
Chief General Manager-in-Charge
"""

BASELINE_RULE_DSL = {
    "rule_id": "RULE-CR-2026-01",
    "name": "Consumer Credit Risk Weight & Capital Buffer Rule",
    "description": "Baseline rule computing regulatory risk weight and Tier-1 capital conservation buffer for retail credit.",
    "version": "1.0.0",
    "effective_date": "2024-01-01",
    "input_schema": {
        "loan_type": "string",
        "loan_amount": "number",
        "borrower_credit_score": "number",
        "debt_to_income_ratio": "number",
        "is_regulatory_exempt": "boolean"
    },
    "rules": [
        {
            "id": "BASELINE_EXEMPTION",
            "description": "Exempt priority sector microfinance",
            "conditions": {
                "operator": "AND",
                "clauses": [
                    { "field": "is_regulatory_exempt", "operator": "EQUALS", "value": True }
                ]
            },
            "action": {
                "decision": "STANDARD_RISK",
                "risk_weight": 100,
                "additional_buffer_percent": 0.0,
                "provision_tier": "TIER_1",
                "compliance_flag": "EXEMPT_BASELINE"
            }
        },
        {
            "id": "BASELINE_ALL_UNSECURED",
            "description": "Prior baseline: All unsecured credit risk weighted at 100%",
            "conditions": {
                "operator": "AND",
                "clauses": [
                    { "field": "loan_type", "operator": "EQUALS", "value": "UNSECURED_PERSONAL" }
                ]
            },
            "action": {
                "decision": "STANDARD_RISK",
                "risk_weight": 100,
                "additional_buffer_percent": 0.0,
                "provision_tier": "TIER_1",
                "compliance_flag": "BASELINE_STANDARD"
            }
        },
        {
            "id": "BASELINE_DEFAULT",
            "description": "Default compliant secured portfolio",
            "conditions": {
                "operator": "AND",
                "clauses": []
            },
            "action": {
                "decision": "STANDARD_RISK",
                "risk_weight": 75,
                "additional_buffer_percent": 0.0,
                "provision_tier": "TIER_1",
                "compliance_flag": "SECURED_BASELINE"
            }
        }
    ]
}

CANDIDATE_RULE_DSL = {
    "rule_id": "RULE-CR-2026-01",
    "name": "Consumer Credit Risk Weight & Capital Buffer Rule",
    "description": "Candidate revised rule implementing RBI Circular 2026/84 mandatory 125% risk weight and 2.5% Tier-1 buffer on unsecured credit exceeding INR 50,000 or credit score < 700.",
    "version": "1.1.0-draft",
    "effective_date": "2026-06-30",
    "input_schema": {
        "loan_type": "string",
        "loan_amount": "number",
        "borrower_credit_score": "number",
        "debt_to_income_ratio": "number",
        "is_regulatory_exempt": "boolean"
    },
    "rules": [
        {
            "id": "STEP_1_STATUTORY_EXEMPTION",
            "description": "Priority sector microfinance and SHG portfolios retain statutory standard 100% risk weight",
            "conditions": {
                "operator": "AND",
                "clauses": [
                    { "field": "is_regulatory_exempt", "operator": "EQUALS", "value": True }
                ]
            },
            "action": {
                "decision": "STANDARD_RISK",
                "risk_weight": 100,
                "additional_buffer_percent": 0.0,
                "provision_tier": "TIER_1",
                "compliance_flag": "PRIORITY_SECTOR_EXEMPT"
            }
        },
        {
            "id": "STEP_2_ENHANCED_UNSECURED_SURCHARGE",
            "description": "Mandatory 125% risk weight + 2.5% buffer for unsecured loans > INR 50,000 OR credit score < 700",
            "conditions": {
                "operator": "AND",
                "clauses": [
                    { "field": "loan_type", "operator": "EQUALS", "value": "UNSECURED_PERSONAL" },
                    {
                        "operator": "OR",
                        "clauses": [
                            { "field": "loan_amount", "operator": "GREATER_THAN", "value": 50000 },
                            { "field": "borrower_credit_score", "operator": "LESS_THAN", "value": 700 }
                        ]
                    }
                ]
            },
            "action": {
                "decision": "ENHANCED_RISK_WEIGHT",
                "risk_weight": 125,
                "additional_buffer_percent": 2.5,
                "provision_tier": "TIER_3_ELEVATED",
                "compliance_flag": "MANDATORY_REGULATORY_SURCHARGE"
            }
        },
        {
            "id": "STEP_3_STANDARD_UNSECURED_BELOW_THRESHOLD",
            "description": "Unsecured credit <= INR 50,000 with credit score >= 700 retains standard 100% risk weight",
            "conditions": {
                "operator": "AND",
                "clauses": [
                    { "field": "loan_type", "operator": "EQUALS", "value": "UNSECURED_PERSONAL" }
                ]
            },
            "action": {
                "decision": "STANDARD_RISK",
                "risk_weight": 100,
                "additional_buffer_percent": 0.0,
                "provision_tier": "TIER_1",
                "compliance_flag": "STANDARD_LOW_TICKET_COMPLIANT"
            }
        },
        {
            "id": "STEP_4_SECURED_RETAIL_DEFAULT",
            "description": "Secured housing, vehicle, and asset-backed credit",
            "conditions": {
                "operator": "AND",
                "clauses": []
            },
            "action": {
                "decision": "STANDARD_RISK",
                "risk_weight": 75,
                "additional_buffer_percent": 0.0,
                "provision_tier": "TIER_1",
                "compliance_flag": "SECURED_ASSET_BACKED"
            }
        }
    ]
}

def generate_synthetic_dataset(count: int = 100):
    """Generates deterministic synthetic retail borrower records."""
    records = []
    # Mix of cases designed to trigger before/after differences
    for i in range(1, count + 1):
        if i % 5 == 0:
            # Priority sector exempt
            rec = {
                "id": f"SYN-REC-{i:03d}",
                "borrower_name": f"Synthetic Borrower {i}",
                "loan_type": "UNSECURED_PERSONAL",
                "loan_amount": 75000 + (i * 200),
                "borrower_credit_score": 680,
                "debt_to_income_ratio": 0.38,
                "is_regulatory_exempt": True,
                "segment": "Priority Sector Micro-credit"
            }
        elif i % 3 == 0:
            # Large unsecured loan > 50,000 -> Triggers change from 100% to 125%
            rec = {
                "id": f"SYN-REC-{i:03d}",
                "borrower_name": f"Synthetic Borrower {i}",
                "loan_type": "UNSECURED_PERSONAL",
                "loan_amount": 120000 + (i * 500),
                "borrower_credit_score": 740,
                "debt_to_income_ratio": 0.42,
                "is_regulatory_exempt": False,
                "segment": "Prime Unsecured Personal Loan"
            }
        elif i % 7 == 0:
            # Subprime unsecured loan < 50,000 but score < 700 -> Triggers change from 100% to 125%
            rec = {
                "id": f"SYN-REC-{i:03d}",
                "borrower_name": f"Synthetic Borrower {i}",
                "loan_type": "UNSECURED_PERSONAL",
                "loan_amount": 42000,
                "borrower_credit_score": 650,
                "debt_to_income_ratio": 0.46,
                "is_regulatory_exempt": False,
                "segment": "Sub-Prime Low-Ticket Unsecured"
            }
        elif i % 2 == 0:
            # Unchanged: Small unsecured loan <= 50,000, good score >= 700 -> stays 100%
            rec = {
                "id": f"SYN-REC-{i:03d}",
                "borrower_name": f"Synthetic Borrower {i}",
                "loan_type": "UNSECURED_PERSONAL",
                "loan_amount": 35000,
                "borrower_credit_score": 760,
                "debt_to_income_ratio": 0.28,
                "is_regulatory_exempt": False,
                "segment": "Low-Ticket Prime Unsecured"
            }
        else:
            # Unchanged: Secured loan -> stays 75%
            rec = {
                "id": f"SYN-REC-{i:03d}",
                "borrower_name": f"Synthetic Borrower {i}",
                "loan_type": "SECURED_HOUSING",
                "loan_amount": 4500000 + (i * 10000),
                "borrower_credit_score": 790,
                "debt_to_income_ratio": 0.35,
                "is_regulatory_exempt": False,
                "segment": "Secured Residential Mortgage"
            }
        records.append(rec)
    return records
