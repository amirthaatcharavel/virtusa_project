import { defineStore } from 'pinia';
import type { User, UserRole } from '../types';
import { apiService } from '../services/api';
import { ROLE_NAVIGATION, ROLE_DEFAULT_ROUTES, type NavSection } from '../config/permissions';

export const useAuthStore = defineStore('auth', {
  state: () => {
    const savedUserId = localStorage.getItem('current_user_id') || 'usr-analyst-01';
    return {
      currentUser: {
        id: savedUserId,
        username: 'analyst_maya',
        full_name: 'Maya Sen',
        email: 'maya.sen@compliance.bank.internal',
        role: 'COMPLIANCE_ANALYST' as UserRole,
        is_active: true,
      } as User,
      availableUsers: [] as User[],
      isLoading: false,
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
        case 'COMPLIANCE_ANALYST': return 'Compliance Analyst';
        case 'COMPLIANCE_APPROVER': return 'Compliance Approver';
        case 'RULE_ENGINEER': return 'Rule Engineer / IT Operator';
        case 'PLATFORM_ADMIN': return 'Platform Administrator';
        default: return state.currentUser.role;
      }
    },

    navigationSections: (state): NavSection[] => {
      return ROLE_NAVIGATION[state.currentUser.role] || [];
    },

    defaultLandingRoute: (state): string => {
      return ROLE_DEFAULT_ROUTES[state.currentUser.role] || '/overview';
    }
  },

  actions: {
    async fetchUsers() {
      try {
        this.isLoading = true;
        const users = await apiService.getUsers();
        if (users && users.length > 0) {
          this.availableUsers = users;
          const currentId = localStorage.getItem('current_user_id') || this.currentUser.id;
          const found = users.find(u => u.id === currentId);
          if (found) {
            this.currentUser = { ...found };
            localStorage.setItem('current_user_id', found.id);
          }
        }
      } catch (err) {
        console.warn('Backend user fetch failed, using default role fixtures', err);
      } finally {
        this.isLoading = false;
      }
    },

    switchUser(userId: string) {
      const user = this.availableUsers.find(u => u.id === userId);
      if (user) {
        this.currentUser = { ...user };
        localStorage.setItem('current_user_id', user.id);
      }
    },

    hasRole(allowedRoles: UserRole[]): boolean {
      return allowedRoles.includes(this.currentUser.role);
    }
  }
});
