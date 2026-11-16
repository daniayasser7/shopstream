const DASHBOARD_ROLES = ["admin"];

export function canAccessDashboard(user) {
  return Boolean(user) && DASHBOARD_ROLES.includes(user.role);
}