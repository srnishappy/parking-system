/**
 * ProtectedRoute Component & Navigation Guard
 * Prevents unauthorized access to protected application routes.
 */

(function () {
  /**
   * Check route protection rules
   * @param {Object} options 
   * @param {boolean} [options.requireAuth=true] - Set to true for protected pages, false for public auth pages (login/register)
   * @param {string} [options.redirectPath] - Custom redirect destination
   */
  function checkRouteGuard(options = { requireAuth: true }) {
    if (!window.authService) {
      console.error('AuthService not found! Make sure utils/auth.js is loaded before ProtectedRoute.js');
      return;
    }

    const isAuthenticated = window.authService.isAuthenticated();
    const isAuthPage = window.location.pathname.includes('/pages/login.html') || 
                       window.location.pathname.includes('/pages/register.html');

    // Calculate relative root path
    const isSubPage = window.location.pathname.includes('/pages/');
    const loginPageUrl     = isSubPage ? './login.html'      : './pages/login.html';
    const dashboardPageUrl = isSubPage ? './dashboard.html'  : './pages/dashboard.html';

    if (options.requireAuth && !isAuthenticated) {
      // User is trying to access protected route without login
      console.warn('Unauthorized access detected. Redirecting to Login page...');
      window.location.href = options.redirectPath || loginPageUrl;
    } else if (!options.requireAuth && isAuthenticated) {
      // User is already logged in, redirect away from Login/Register to Dashboard
      console.info('User is already authenticated. Redirecting to Dashboard...');
      window.location.href = options.redirectPath || dashboardPageUrl;
    }
  }

  // Global export
  window.ProtectedRoute = {
    guard: checkRouteGuard,
    getUser: () => window.authService ? window.authService.getCurrentUser() : null
  };
})();
