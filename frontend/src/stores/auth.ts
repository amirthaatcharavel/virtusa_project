import { defineStore } from 'pinia';
import type { User, UserRole } from '../types';
import { ROLE_NAVIGATION, ROLE_DEFAULT_ROUTES, type NavSection } from '../config/permissions';
import { INITIAL_USERS } from '../mock/mockData';

export const useAuthStore = defineStore('auth', {
  state: () => {
    const savedUserId = localStorage.getItem('current_user_id') || 'usr-analyst-01';
    const foundUser = INITIAL_USERS.find((u) => u.id === savedUserId) || INITIAL_USERS[0];

    return {
      currentUser: { ...foundUser } as User,
      availableUsers: [...INITIAL_USERS] as User[],
      isLoading: false,
      isAuthenticated: true,
      systemHealthy: true,
    };
  },

  getters: {
    isAnalyst: (state) => state.currentUser.role === 'COMPLIANCE_ANALYST',
    isApprover: (state) => state.currentUser.role === 'COMPLIANCE_APPROVER',
    isEngineer: (state) => state.currentUser.role === 'RULE_ENGINEER',
    isAdmin: (state) => state.currentUser.role === 'PLATFORM_ADMIN',

    roleLabel: (state): string => {
      switch (state.currentUser.role) {
        case 'COMPLIANCE_ANALYST':
          return 'Compliance Analyst';
        case 'COMPLIANCE_APPROVER':
          return 'Compliance Approver';
        case 'RULE_ENGINEER':
          return 'Rule Engineer / IT Operator';
        case 'PLATFORM_ADMIN':
          return 'Platform Administrator';
        default:
          return state.currentUser.role || 'Compliance Analyst';
      }
    },

    navigationSections: (state): NavSection[] => {
      return ROLE_NAVIGATION[state.currentUser.role] || [];
    },

    defaultLandingRoute: (state): string => {
      return ROLE_DEFAULT_ROUTES[state.currentUser.role] || '/dashboard/compliance-analyst';
    },
  },

  actions: {
    async fetchUsers() {
      // In demo mode, users are synchronized from mock fixtures / store
      this.availableUsers = [...INITIAL_USERS];
      const savedId = localStorage.getItem('current_user_id');
      if (savedId) {
        const found = this.availableUsers.find((u) => u.id === savedId);
        if (found) {
          this.currentUser = { ...found };
        }
      }
    },

    switchUser(userId: string) {
      const user = this.availableUsers.find((u) => u.id === userId);
      if (user) {
        this.currentUser = { ...user };
        this.isAuthenticated = true;
        localStorage.setItem('current_user_id', user.id);
        localStorage.setItem('current_user_role', user.role);
      }
    },

    switchRole(role: UserRole) {
      const user = this.availableUsers.find((u) => u.role === role);
      if (user) {
        this.switchUser(user.id);
      }
    },

    logout() {
      // Clear or reset user state and remember logged out
      this.isAuthenticated = false;
      localStorage.removeItem('current_user_id');
      localStorage.removeItem('current_user_role');
      // Reset to default analyst template for when they log back in
      this.currentUser = { ...INITIAL_USERS[0] };
    },

    hasRole(allowedRoles: UserRole[]): boolean {
      if (!this.currentUser || !this.currentUser.role) return false;
      return allowedRoles.includes(this.currentUser.role);
    },
  },
});
