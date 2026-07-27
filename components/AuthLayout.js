/**
 * AuthLayout Helper Component
 * Renders consistent layout elements and provides interactive helpers for Auth pages.
 */

window.AuthLayout = {
  /**
   * Set up toggle password visibility button
   * @param {string} inputId 
   * @param {string} buttonId 
   */
  setupPasswordToggle(inputId, buttonId) {
    const input = document.getElementById(inputId);
    const button = document.getElementById(buttonId);
    if (!input || !button) return;

    button.addEventListener('click', () => {
      const isPassword = input.type === 'password';
      input.type = isPassword ? 'text' : 'password';

      button.innerHTML = isPassword
        ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`
        : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`;
    });
  },

  /**
   * Display dynamic Alert Banner
   * @param {string} containerId 
   * @param {'error'|'success'} type 
   * @param {string} message 
   */
  showAlert(containerId, type, message) {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (!message) {
      container.innerHTML = '';
      return;
    }

    const icon = type === 'error'
      ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`
      : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`;

    container.innerHTML = `
      <div class="alert alert-${type}">
        ${icon}
        <div>${message}</div>
      </div>
    `;
  },

  /**
   * Set loading state on form submit button
   * @param {HTMLButtonElement} button 
   * @param {boolean} isLoading 
   * @param {string} originalText 
   */
  setButtonLoading(button, isLoading, originalText) {
    if (!button) return;
    if (isLoading) {
      button.disabled = true;
      button.dataset.originalText = originalText || button.innerHTML;
      button.innerHTML = `<span class="spinner"></span> กำลังดำเนินการ...`;
    } else {
      button.disabled = false;
      button.innerHTML = button.dataset.originalText || originalText;
    }
  }
};
