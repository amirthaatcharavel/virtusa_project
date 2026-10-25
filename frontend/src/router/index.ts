import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import type { UserRole } from '../types';

// Dashboards
import AnalystDashboardView from '../features/dashboards/AnalystDashboardView.vue';
import EngineerDashboardView from '../features/dashboards/EngineerDashboardView.vue';
import ApproverDashboardView from '../features/dashboards/ApproverDashboardView.vue';
import AdminDashboardView from '../features/dashboards/AdminDashboardView.vue';
import AccessDeniedView from '../features/dashboards/AccessDeniedView.vue';

// Sub-views
import AnalystAssignedWorkView from '../features/dashboards/AnalystAssignedWorkView.vue';
import EngineerQueueView from '../features/dashboards/EngineerQueueView.vue';
import ApproverEvidenceView from '../features/dashboards/ApproverEvidenceView.vue';
import AdminUserManagementView from '../features/dashboards/AdminUserManagementView.vue';

// Core Workflow Views
import CircularListView from '../features/circulars/CircularListView.vue';
import CircularDetailView from '../features/circulars/CircularDetailView.vue';
import ObligationReviewView from '../features/obligations/ObligationReviewView.vue';
import PolicyMappingView from '../features/policy-mapping/PolicyMappingView.vue';
import RuleStudioView from '../features/rules/RuleStudioView.vue';
import TestRunnerView from '../features/simulation/TestRunnerView.vue';
import ImpactSimulatorView from '../features/simulation/ImpactSimulatorView.vue';
import ApprovalCenterView from '../features/approvals/ApprovalCenterView.vue';
import DeploymentMonitorView from '../features/deployments/DeploymentMonitorView.vue';
import AuditTrailView from '../features/audit/AuditTrailView.vue';
import AdminStatusView from '../features/admin/AdminStatusView.vue';
import LandingView from '../features/auth/LandingView.vue';
import LoginView from '../features/auth/LoginView.vue';

const routes = [
  // Public Enterprise Landing and Login Portal
  {
    path: '/landing',
    name: 'Landing',
    component: LandingView,
    meta: { fullscreen: true }
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
    meta: { fullscreen: true }
  },

  // Default root redirects dynamically to active role's landing page
  {
    path: '/',
    redirect: () => {
      const auth = useAuthStore();
      return auth.defaultLandingRoute;
    }
  },
  {
    path: '/overview',
    redirect: () => {
      const auth = useAuthStore();
      return auth.defaultLandingRoute;
    }
  },

  // 1. Analyst Dedicated Routes
  {
    path: '/analyst/dashboard',
    name: 'AnalystDashboard',
    component: AnalystDashboardView,
    meta: { roles: ['COMPLIANCE_ANALYST', 'PLATFORM_ADMIN'] as UserRole[] }
  },
  {
    path: '/analyst/assigned',
    name: 'AnalystAssigned',
    component: AnalystAssignedWorkView,
    meta: { roles: ['COMPLIANCE_ANALYST', 'PLATFORM_ADMIN'] as UserRole[] }
  },
  {
    path: '/analyst/submissions',
    name: 'AnalystSubmissions',
    component: AuditTrailView,
    meta: { roles: ['COMPLIANCE_ANALYST', 'PLATFORM_ADMIN'] as UserRole[] }
  },
  {
    path: '/circulars',
    name: 'CircularList',
    component: CircularListView,
    meta: { roles: ['COMPLIANCE_ANALYST', 'COMPLIANCE_APPROVER', 'PLATFORM_ADMIN'] as UserRole[] }
  },
  {
    path: '/circulars/upload',
    name: 'CircularUpload',
    component: CircularListView,
    meta: { roles: ['COMPLIANCE_ANALYST', 'PLATFORM_ADMIN'] as UserRole[] }
  },
  {
    path: '/circulars/:circularId',
    name: 'CircularDetail',
    component: CircularDetailView,
    meta: { roles: ['COMPLIANCE_ANALYST', 'COMPLIANCE_APPROVER', 'RULE_ENGINEER', 'PLATFORM_ADMIN'] as UserRole[] }
  },
  {
    path: '/obligations',
    name: 'Obligations',
    component: ObligationReviewView,
    meta: { roles: ['COMPLIANCE_ANALYST', 'RULE_ENGINEER', 'COMPLIANCE_APPROVER', 'PLATFORM_ADMIN'] as UserRole[] }
  },
  {
    path: '/obligations/:obligationId',
    name: 'ObligationReview',
    component: ObligationReviewView,
    meta: { roles: ['COMPLIANCE_ANALYST', 'COMPLIANCE_APPROVER', 'PLATFORM_ADMIN'] as UserRole[] }
  },
  {
    path: '/mapping',
    name: 'PolicyMapping',
    component: PolicyMappingView,
    meta: { roles: ['COMPLIANCE_ANALYST', 'RULE_ENGINEER', 'PLATFORM_ADMIN'] as UserRole[] }
  },

  // 2. Rule Engineer Dedicated Routes
  {
    path: '/engineer/dashboard',
    name: 'EngineerDashboard',
    component: EngineerDashboardView,
    meta: { roles: ['RULE_ENGINEER', 'PLATFORM_ADMIN'] as UserRole[] }
  },
  {
    path: '/engineer/queue',
    name: 'EngineerQueue',
    component: EngineerQueueView,
    meta: { roles: ['RULE_ENGINEER', 'PLATFORM_ADMIN'] as UserRole[] }
  },
  {
    path: '/rules',
    name: 'Rules',
    component: RuleStudioView,
    meta: { roles: ['RULE_ENGINEER', 'PLATFORM_ADMIN'] as UserRole[] }
  },
  {
    path: '/rules/:ruleId',
    name: 'RuleStudio',
    component: RuleStudioView,
    meta: { roles: ['RULE_ENGINEER', 'COMPLIANCE_APPROVER', 'PLATFORM_ADMIN'] as UserRole[] }
  },
  {
    path: '/rules/versions',
    name: 'RuleVersions',
    component: RuleStudioView,
    meta: { roles: ['RULE_ENGINEER', 'COMPLIANCE_APPROVER', 'PLATFORM_ADMIN'] as UserRole[] }
  },
  {
    path: '/tests',
    name: 'TestRunner',
    component: TestRunnerView,
    meta: { roles: ['RULE_ENGINEER', 'PLATFORM_ADMIN'] as UserRole[] }
  },
  {
    path: '/impact',
    name: 'ImpactSimulator',
    component: ImpactSimulatorView,
    meta: { roles: ['RULE_ENGINEER', 'COMPLIANCE_APPROVER', 'PLATFORM_ADMIN'] as UserRole[] }
  },
  {
    path: '/deployments',
    name: 'Deployments',
    component: DeploymentMonitorView,
    meta: { roles: ['RULE_ENGINEER', 'PLATFORM_ADMIN'] as UserRole[] }
  },
  {
    path: '/engineer/submissions',
    name: 'EngineerSubmissions',
    component: AuditTrailView,
    meta: { roles: ['RULE_ENGINEER', 'PLATFORM_ADMIN'] as UserRole[] }
  },

  // 3. Compliance Approver Dedicated Routes
  {
    path: '/approver/dashboard',
    name: 'ApproverDashboard',
    component: ApproverDashboardView,
    meta: { roles: ['COMPLIANCE_APPROVER', 'PLATFORM_ADMIN'] as UserRole[] }
  },
  {
    path: '/approvals',
    name: 'ApprovalCenter',
    component: ApprovalCenterView,
    meta: { roles: ['COMPLIANCE_APPROVER'] as UserRole[] } // Strict Approver role only
  },
  {
    path: '/approver/evidence',
    name: 'ApproverEvidence',
    component: ApproverEvidenceView,
    meta: { roles: ['COMPLIANCE_APPROVER', 'PLATFORM_ADMIN'] as UserRole[] }
  },
  {
    path: '/approver/history',
    name: 'ApproverHistory',
    component: ApproverDashboardView,
    meta: { roles: ['COMPLIANCE_APPROVER', 'PLATFORM_ADMIN'] as UserRole[] }
  },

  // 4. Platform Administrator Dedicated Routes
  {
    path: '/admin/dashboard',
    name: 'AdminDashboard',
    component: AdminDashboardView,
    meta: { roles: ['PLATFORM_ADMIN'] as UserRole[] }
  },
  {
    path: '/admin/users',
    name: 'AdminUsers',
    component: AdminUserManagementView,
    meta: { roles: ['PLATFORM_ADMIN'] as UserRole[] }
  },
  {
    path: '/admin/roles',
    name: 'AdminRoles',
    component: AdminUserManagementView,
    meta: { roles: ['PLATFORM_ADMIN'] as UserRole[] }
  },
  {
    path: '/admin/jobs',
    name: 'AdminJobs',
    component: CircularListView,
    meta: { roles: ['PLATFORM_ADMIN'] as UserRole[] }
  },
  {
    path: '/admin/health',
    name: 'AdminHealth',
    component: AdminStatusView,
    meta: { roles: ['PLATFORM_ADMIN'] as UserRole[] }
  },

  // Shared Audit & Compliance Reports
  {
    path: '/audit',
    name: 'AuditTrail',
    component: AuditTrailView,
    meta: { roles: ['COMPLIANCE_APPROVER', 'PLATFORM_ADMIN', 'COMPLIANCE_ANALYST', 'RULE_ENGINEER'] as UserRole[] }
  },

  // Access Denied Interception View
  {
    path: '/access-denied',
    name: 'AccessDenied',
    component: AccessDeniedView,
  },

  // Fallback Catch-all
  {
    path: '/:pathMatch(.*)*',
    redirect: () => {
      const auth = useAuthStore();
      return auth.defaultLandingRoute;
    }
  }
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 };
  }
});

// Enterprise Frontend Navigation Guard enforcing Role-Based Authorization
router.beforeEach((to, _from, next) => {
  const authStore = useAuthStore();
  const requiredRoles = to.meta.roles as UserRole[] | undefined;

  // If route defines required roles, check user's role
  if (requiredRoles && requiredRoles.length > 0) {
    if (!authStore.hasRole(requiredRoles)) {
      console.warn(`[RBAC] Access denied to ${to.path} for role ${authStore.currentUser.role}`);
      return next({
        path: '/access-denied',
        query: { redirect: to.fullPath }
      });
    }
  }

  next();
});
