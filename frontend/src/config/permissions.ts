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
  COMPLIANCE_ANALYST: '/analyst/dashboard',
  RULE_ENGINEER: '/engineer/dashboard',
  COMPLIANCE_APPROVER: '/approver/dashboard',
  PLATFORM_ADMIN: '/admin/dashboard',
};

export const ROLE_NAVIGATION: Record<UserRole, NavSection[]> = {
  COMPLIANCE_ANALYST: [
    {
      title: 'Analyst Workspace',
      items: [
        { name: 'Analyst Dashboard', path: '/analyst/dashboard', icon: 'overview', description: 'Obligation and circular workflow metrics' },
        { name: 'Circular Library', path: '/circulars', icon: 'circular', description: 'Regulatory publications repository' },
        { name: 'Upload Circular', path: '/circulars/upload', icon: 'plus', description: 'Ingest new regulatory publication' },
      ]
    },
    {
      title: 'Obligation Intelligence',
      items: [
        { name: 'Obligation Review', path: '/obligations', icon: 'obligation', description: 'Verify conditions and applicability' },
        { name: 'Policy & Control Mapping', path: '/mapping', icon: 'mapping', description: 'Map obligations to internal policies' },
        { name: 'My Assigned Work', path: '/analyst/assigned', icon: 'check', description: 'Assigned circulars and obligations' },
        { name: 'Submission History', path: '/analyst/submissions', icon: 'audit', description: 'Past certified obligation reviews' },
      ]
    }
  ],

  RULE_ENGINEER: [
    {
      title: 'Engineering Workspace',
      items: [
        { name: 'Engineering Dashboard', path: '/engineer/dashboard', icon: 'overview', description: 'Implementation backlog & test status' },
        { name: 'Implementation Queue', path: '/engineer/queue', icon: 'obligation', description: 'Reviewed obligations ready for rules' },
        { name: 'Rule Studio (DSL)', path: '/rules', icon: 'rules', description: 'Restricted JSON Rule DSL editor' },
        { name: 'Rule Versions', path: '/rules/versions', icon: 'audit', description: 'Version differences & AST history' },
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
        { name: 'Approval Dashboard', path: '/approver/dashboard', icon: 'overview', description: 'Pending decisions & portfolio risk overview' },
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
        { name: 'System Overview', path: '/admin/dashboard', icon: 'overview', description: 'Operational telemetry & services' },
        { name: 'User Management', path: '/admin/users', icon: 'user', description: 'Accounts, activation & role assignment' },
        { name: 'Role & Permissions', path: '/admin/roles', icon: 'approvals', description: 'Granular access control matrix' },
        { name: 'Processing Jobs', path: '/admin/jobs', icon: 'circular', description: 'Document parsing job monitor & failures' },
        { name: 'System Health', path: '/admin/health', icon: 'admin', description: 'FastAPI, database, and AI status' },
        { name: 'Security Audit Logs', path: '/audit', icon: 'audit', description: 'Platform-wide tamper-evident events' },
      ]
    }
  ]
};

export const ROUTE_PERMISSIONS: Record<string, UserRole[]> = {
  // Analyst Routes
  '/analyst/dashboard': ['COMPLIANCE_ANALYST', 'PLATFORM_ADMIN'],
  '/circulars': ['COMPLIANCE_ANALYST', 'COMPLIANCE_APPROVER', 'PLATFORM_ADMIN'],
  '/circulars/upload': ['COMPLIANCE_ANALYST', 'PLATFORM_ADMIN'],
  '/circulars/:circularId': ['COMPLIANCE_ANALYST', 'COMPLIANCE_APPROVER', 'RULE_ENGINEER', 'PLATFORM_ADMIN'],
  '/obligations': ['COMPLIANCE_ANALYST', 'RULE_ENGINEER', 'COMPLIANCE_APPROVER', 'PLATFORM_ADMIN'],
  '/obligations/:obligationId': ['COMPLIANCE_ANALYST', 'COMPLIANCE_APPROVER', 'PLATFORM_ADMIN'],
  '/mapping': ['COMPLIANCE_ANALYST', 'RULE_ENGINEER', 'PLATFORM_ADMIN'],
  '/analyst/assigned': ['COMPLIANCE_ANALYST', 'PLATFORM_ADMIN'],
  '/analyst/submissions': ['COMPLIANCE_ANALYST', 'PLATFORM_ADMIN'],

  // Engineer Routes
  '/engineer/dashboard': ['RULE_ENGINEER', 'PLATFORM_ADMIN'],
  '/engineer/queue': ['RULE_ENGINEER', 'PLATFORM_ADMIN'],
  '/rules': ['RULE_ENGINEER', 'PLATFORM_ADMIN'],
  '/rules/:ruleId': ['RULE_ENGINEER', 'COMPLIANCE_APPROVER', 'PLATFORM_ADMIN'],
  '/rules/versions': ['RULE_ENGINEER', 'COMPLIANCE_APPROVER', 'PLATFORM_ADMIN'],
  '/tests': ['RULE_ENGINEER', 'PLATFORM_ADMIN'],
  '/impact': ['RULE_ENGINEER', 'COMPLIANCE_APPROVER', 'PLATFORM_ADMIN'],
  '/deployments': ['RULE_ENGINEER', 'PLATFORM_ADMIN'],
  '/engineer/submissions': ['RULE_ENGINEER', 'PLATFORM_ADMIN'],

  // Approver Routes
  '/approver/dashboard': ['COMPLIANCE_APPROVER', 'PLATFORM_ADMIN'],
  '/approvals': ['COMPLIANCE_APPROVER'],
  '/approver/evidence': ['COMPLIANCE_APPROVER', 'PLATFORM_ADMIN'],
  '/approver/history': ['COMPLIANCE_APPROVER', 'PLATFORM_ADMIN'],

  // Admin Routes
  '/admin/dashboard': ['PLATFORM_ADMIN'],
  '/admin/users': ['PLATFORM_ADMIN'],
  '/admin/roles': ['PLATFORM_ADMIN'],
  '/admin/jobs': ['PLATFORM_ADMIN'],
  '/admin/health': ['PLATFORM_ADMIN'],
  '/audit': ['COMPLIANCE_APPROVER', 'PLATFORM_ADMIN', 'COMPLIANCE_ANALYST', 'RULE_ENGINEER'],
};
