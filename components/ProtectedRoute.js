/**
 * ProtectedRoute Component & Navigation Guard
 * Prevents unauthorized access and enforces role-based permissions (User vs Admin).
 */

(function () {
  /**
   * Check route protection rules
   * @param {Object} options 
   * @param {boolean} [options.requireAuth=true] - Set to true for protected pages, false for public auth pages (login/register)
   * @param {Array<string>|string} [options.allowedRoles] - Roles allowed to access this page (e.g. ['ADMIN'] or ['USER', 'student', 'staff', 'guest'])
   * @param {string} [options.redirectPath] - Custom redirect destination
   */
  function checkRouteGuard(options = { requireAuth: true }) {
    if (!window.authService) {
      console.error('AuthService not found! Make sure utils/auth.js is loaded before ProtectedRoute.js');
      return;
    }

    const isAuthenticated = window.authService.isAuthenticated();
    const currentUser     = window.authService.getCurrentUser();
    const currentPath     = window.location.pathname.toLowerCase();

    // Determine current path location depth
    const isAdminSubFolder = currentPath.includes('/pages/admin/') || currentPath.includes('/admin/');
    const isPagesSubFolder = currentPath.includes('/pages/');

    // Calculate relative redirect URLs
    let loginUrl, userDashboardUrl, adminDashboardUrl;

    if (isAdminSubFolder) {
      loginUrl          = '../login.html';
      userDashboardUrl  = '../dashboard.html';
      adminDashboardUrl = './dashboard.html';
    } else if (isPagesSubFolder) {
      loginUrl          = './login.html';
      userDashboardUrl  = './dashboard.html';
      adminDashboardUrl = './admin/dashboard.html';
    } else {
      loginUrl          = './pages/login.html';
      userDashboardUrl  = './pages/dashboard.html';
      adminDashboardUrl = './pages/admin/dashboard.html';
    }

    // Rule 1: Protected route access check
    if (options.requireAuth && !isAuthenticated) {
      console.warn('Unauthorized access detected. Redirecting to Login page...');
      window.location.href = options.redirectPath || loginUrl;
      return;
    }

    // Rule 2: Public auth page (login/register) access while already logged in
    if (!options.requireAuth && isAuthenticated) {
      console.info('User is already authenticated. Redirecting based on role...');
      if (currentUser && (currentUser.role === 'ADMIN' || currentUser.role === 'admin')) {
        window.location.href = options.redirectPath || adminDashboardUrl;
      } else {
        window.location.href = options.redirectPath || userDashboardUrl;
      }
      return;
    }

    // Rule 3: Role-based permissions check for authenticated users
    if (options.requireAuth && isAuthenticated && currentUser) {
      const userRole = (currentUser.role || 'USER').toUpperCase();
      const isAdmin = userRole === 'ADMIN';

      // Explicit allowedRoles restriction
      if (options.allowedRoles) {
        const allowed = Array.isArray(options.allowedRoles) 
          ? options.allowedRoles.map(r => r.toUpperCase())
          : [options.allowedRoles.toUpperCase()];

        const hasPermission = allowed.includes(userRole) || 
          (!isAdmin && allowed.includes('USER'));

        if (!hasPermission) {
          console.warn(`User with role ${userRole} forbidden to access this page.`);
          window.location.href = isAdmin ? adminDashboardUrl : userDashboardUrl;
          return;
        }
      }

      // Default folder-level role enforcement:
      // - ADMIN must not access User pages
      // - USER must not access Admin pages
      if (isAdmin && !isAdminSubFolder) {
        console.info('Admin user attempted to access User page. Redirecting to Admin Dashboard...');
        window.location.href = adminDashboardUrl;
      } else if (!isAdmin && isAdminSubFolder) {
        console.warn('Regular user attempted to access Admin page. Redirecting to User Dashboard...');
        window.location.href = userDashboardUrl;
      }
    }
  }

  // Global export
  window.ProtectedRoute = {
    guard: checkRouteGuard,
    getUser: () => window.authService ? window.authService.getCurrentUser() : null
  };
})();
