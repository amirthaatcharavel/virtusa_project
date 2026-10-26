import type { UserRole } from '../types';

export interface NavItem {
  name: string;
  path: string;
  icon: string;
  description: string;
  badge?: string;
  badgeVariant?: 'purple' | 'navy' | 'teal' | 'success' | 'warning' | 'error' | 'info';
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

export const ROLE_DEFAULT_ROUTES: Record<UserRole, string> = {
  COMPLIANCE_ANALYST: '/dashboard/compliance-analyst',
  RULE_ENGINEER: '/dashboard/rule-engineer',
  COMPLIANCE_APPROVER: '/dashboard/compliance-approver',
  PLATFORM_ADMIN: '/dashboard/platform-admin',
};

export const ROLE_NAVIGATION: Record<UserRole, NavSection[]> = {
  COMPLIANCE_ANALYST: [
    {
      title: 'Analyst Workspace',
      items: [
        { name: 'Compliance Analyst Dashboard', path: '/dashboard/compliance-analyst', icon: 'overview', description: 'Overview and 5 regulatory modules' },
        { name: 'Circular Library & Upload', path: '/circulars', icon: 'circular', description: 'Search, filter, upload & preview circulars' },
        { name: 'Obligation Review', path: '/obligations', icon: 'obligation', description: 'Extract, verify & triage obligations' },
      ]
    },
    {
      title: 'Obligation Intelligence',
      items: [
        { name: 'Policy & Rule Mapping', path: '/mapping', icon: 'mapping', description: 'Map obligations to internal policies' },
        { name: 'My Assigned Work', path: '/analyst/assigned', icon: 'check', description: 'Assigned circulars and obligations' },
        { name: 'Submission History', path: '/analyst/submissions', icon: 'audit', description: 'Past certified obligation reviews' },
      ]
    }
  ],

  RULE_ENGINEER: [
    {
      title: 'Engineering Workspace',
      items: [
        { name: 'Rule Engineering Dashboard', path: '/dashboard/rule-engineer', icon: 'overview', description: 'Engineering overview & assigned work' },
        { name: 'Implementation Queue', path: '/engineer/queue', icon: 'obligation', description: 'Reviewed obligations ready for rules' },
        { name: 'Rule Studio (DSL)', path: '/rules', icon: 'rules', description: 'Restricted JSON Rule DSL editor & diff' },
      ]
    },
    {
      title: 'Validation & Sandbox',
      items: [
        { name: 'Test Execution Lab', path: '/tests', icon: 'simulator', description: 'Deterministic regression test suite' },
        { name: 'Impact Simulator', path: '/impact', icon: 'simulator', description: 'Baseline vs Candidate comparison' },
        { name: 'Sandbox Deploy & Rollback', path: '/deployments', icon: 'deployments', description: 'Promotion to isolated simulation sandbox' },
        { name: 'Approval Submission Log', path: '/engineer/submissions', icon: 'check', description: 'Rules submitted for independent approval' },
      ]
    }
  ],

  COMPLIANCE_APPROVER: [
    {
      title: 'Governance & Sign-Off',
      items: [
        { name: 'Compliance Approver Dashboard', path: '/dashboard/compliance-approver', icon: 'overview', description: 'Sign-off center & decision queue' },
        { name: 'Pending Approval Queue', path: '/approvals', icon: 'approvals', description: 'Candidate rule versions awaiting decision' },
        { name: 'Regulatory Evidence Viewer', path: '/approver/evidence', icon: 'file-text', description: 'Full circular-to-test provenance' },
        { name: 'Decision History', path: '/approver/history', icon: 'check', description: 'Audit log of certified decisions' },
        { name: 'Compliance Dossiers', path: '/audit', icon: 'audit', description: 'Complete evidence export packages' },
      ]
    }
  ],

  PLATFORM_ADMIN: [
    {
      title: 'Platform Administration',
      items: [
        { name: 'Platform Admin Dashboard', path: '/dashboard/platform-admin', icon: 'overview', description: 'System telemetry & operations hub' },
        { name: 'User & Permission Management', path: '/admin/users', icon: 'users', description: 'Accounts, activation & role assignment' },
        { name: 'Integration & Health', path: '/admin/health', icon: 'activity', description: 'Services, database & pipeline telemetry' },
        { name: 'Processing Jobs', path: '/admin/jobs', icon: 'circular', description: 'Document parsing job monitor & failures' },
        { name: 'Security Audit Logs', path: '/audit', icon: 'audit', description: 'Platform-wide tamper-evident events' },
      ]
    }
  ]
};

export const ROUTE_PERMISSIONS: Record<string, UserRole[]> = {
  // 1. Role-specific Dashboards (Strict Front-End Guards)
  '/dashboard/compliance-analyst': ['COMPLIANCE_ANALYST'],
  '/dashboard/rule-engineer': ['RULE_ENGINEER'],
  '/dashboard/compliance-approver': ['COMPLIANCE_APPROVER'],
  '/dashboard/platform-admin': ['PLATFORM_ADMIN'],

  // Legacy Aliases
  '/analyst/dashboard': ['COMPLIANCE_ANALYST'],
  '/engineer/dashboard': ['RULE_ENGINEER'],
  '/approver/dashboard': ['COMPLIANCE_APPROVER'],
  '/admin/dashboard': ['PLATFORM_ADMIN'],

  // Analyst Functional Routes
  '/circulars': ['COMPLIANCE_ANALYST', 'COMPLIANCE_APPROVER', 'PLATFORM_ADMIN'],
  '/circulars/upload': ['COMPLIANCE_ANALYST', 'PLATFORM_ADMIN'],
  '/circulars/:circularId': ['COMPLIANCE_ANALYST', 'COMPLIANCE_APPROVER', 'RULE_ENGINEER', 'PLATFORM_ADMIN'],
  '/obligations': ['COMPLIANCE_ANALYST', 'RULE_ENGINEER', 'COMPLIANCE_APPROVER', 'PLATFORM_ADMIN'],
  '/obligations/:obligationId': ['COMPLIANCE_ANALYST', 'COMPLIANCE_APPROVER', 'PLATFORM_ADMIN'],
  '/mapping': ['COMPLIANCE_ANALYST', 'RULE_ENGINEER', 'PLATFORM_ADMIN'],
  '/analyst/assigned': ['COMPLIANCE_ANALYST', 'PLATFORM_ADMIN'],
  '/analyst/submissions': ['COMPLIANCE_ANALYST', 'PLATFORM_ADMIN'],

  // Rule Engineer Functional Routes
  '/engineer/queue': ['RULE_ENGINEER', 'PLATFORM_ADMIN'],
  '/rules': ['RULE_ENGINEER', 'PLATFORM_ADMIN'],
  '/rules/:ruleId': ['RULE_ENGINEER', 'COMPLIANCE_APPROVER', 'PLATFORM_ADMIN'],
  '/rules/versions': ['RULE_ENGINEER', 'COMPLIANCE_APPROVER', 'PLATFORM_ADMIN'],
  '/tests': ['RULE_ENGINEER', 'PLATFORM_ADMIN'],
  '/impact': ['RULE_ENGINEER', 'COMPLIANCE_APPROVER', 'PLATFORM_ADMIN'],
  '/deployments': ['RULE_ENGINEER', 'PLATFORM_ADMIN'],
  '/engineer/submissions': ['RULE_ENGINEER', 'PLATFORM_ADMIN'],

  // Approver Functional Routes
  '/approvals': ['COMPLIANCE_APPROVER'],
  '/approver/evidence': ['COMPLIANCE_APPROVER', 'PLATFORM_ADMIN'],
  '/approver/history': ['COMPLIANCE_APPROVER', 'PLATFORM_ADMIN'],

  // Admin Functional Routes
  '/admin/users': ['PLATFORM_ADMIN'],
  '/admin/roles': ['PLATFORM_ADMIN'],
  '/admin/jobs': ['PLATFORM_ADMIN'],
  '/admin/health': ['PLATFORM_ADMIN'],

  // Shared
  '/audit': ['COMPLIANCE_APPROVER', 'PLATFORM_ADMIN', 'COMPLIANCE_ANALYST', 'RULE_ENGINEER'],
};
