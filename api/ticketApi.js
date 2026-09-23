/**
 * Ticket API Service (Mock API Layer)
 * 
 * Interacts with localStorage to provide asynchronous CRUD operations for Tickets.
 * Designed to be seamlessly replaced by real backend REST/GraphQL API calls in the future
 * without breaking any UI logic.
 */

const STORAGE_TICKETS_KEY = 'parking_app_tickets';

class TicketApi {
  constructor() {
    this._init();
  }

  /** Initialize seed data in localStorage if empty */
  _init() {
    if (!localStorage.getItem(STORAGE_TICKETS_KEY)) {
      const seed = window.MOCK_TICKETS_SEED || [];
      localStorage.setItem(STORAGE_TICKETS_KEY, JSON.stringify(seed));
    }
  }

  /** Helper to fetch all raw tickets from localStorage */
  _getStoredTickets() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_TICKETS_KEY)) || [];
    } catch (e) {
      console.error('Failed to parse tickets from localStorage:', e);
      return [];
    }
  }

  /** Helper to save tickets array to localStorage */
  _saveTickets(tickets) {
    localStorage.setItem(STORAGE_TICKETS_KEY, JSON.stringify(tickets));
  }

  /** Simulate small network latency for realism */
  _delay(ms = 250) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Get all tickets (Admin view)
   * @returns {Promise<Array>}
   */
  async getTickets() {
    await this._delay();
    return this._getStoredTickets();
  }

  /**
   * Get single ticket by Ticket ID
   * @param {string} id 
   * @returns {Promise<Object|null>}
   */
  async getTicketById(id) {
    await this._delay();
    const tickets = this._getStoredTickets();
    return tickets.find(t => t.id === id) || null;
  }

  /**
   * Get tickets created by a specific User
   * @param {string} userId 
   * @returns {Promise<Array>}
   */
  async getUserTickets(userId) {
    await this._delay();
    const tickets = this._getStoredTickets();
    return tickets.filter(t => t.userId === userId);
  }

  /**
   * Create a new ticket
   * @param {Object} data 
   * @param {string} data.subject
   * @param {string} data.description
   * @param {string} data.category
   * @param {string} data.priority
   * @param {Object} data.user - Logged in user details (id, name, email)
   * @returns {Promise<Object>}
   */
  async createTicket(data) {
    await this._delay(350);
    const tickets = this._getStoredTickets();

    // Auto-generate ticket ID (e.g. TKT-0001, TKT-0002, ...)
    let maxNum = 0;
    tickets.forEach(t => {
      if (t.id && t.id.startsWith('TKT-')) {
        const num = parseInt(t.id.replace('TKT-', ''), 10);
        if (!isNaN(num) && num > maxNum) maxNum = num;
      }
    });

    const nextId = 'TKT-' + String(maxNum + 1).padStart(4, '0');
    const newTicket = {
      id: nextId,
      userId: data.user?.id || 'usr_guest',
      userName: data.user?.name || 'User',
      userEmail: data.user?.email || '',
      subject: data.subject,
      description: data.description,
      category: data.category || 'Other',
      priority: data.priority || 'Medium',
      status: 'OPEN',
      createdAt: new Date().toISOString(),
      replies: []
    };

    tickets.unshift(newTicket);
    this._saveTickets(tickets);

    return newTicket;
  }

  /**
   * Update ticket status (OPEN, IN_PROGRESS, RESOLVED, CLOSED)
   * @param {string} id 
   * @param {'OPEN'|'IN_PROGRESS'|'RESOLVED'|'CLOSED'} status 
   * @returns {Promise<Object>}
   */
  async updateTicketStatus(id, status) {
    await this._delay(300);
    const tickets = this._getStoredTickets();
    const index = tickets.findIndex(t => t.id === id);

    if (index === -1) {
      throw new Error(`Ticket ID ${id} not found.`);
    }

    tickets[index].status = status;
    tickets[index].updatedAt = new Date().toISOString();
    this._saveTickets(tickets);

    return tickets[index];
  }

  /**
   * Add reply to a ticket
   * @param {string} id 
   * @param {Object} reply 
   * @param {string} reply.senderId
   * @param {string} reply.senderName
   * @param {string} reply.message
   * @returns {Promise<Object>}
   */
  async addTicketReply(id, reply) {
    await this._delay(300);
    const tickets = this._getStoredTickets();
    const index = tickets.findIndex(t => t.id === id);

    if (index === -1) {
      throw new Error(`Ticket ID ${id} not found.`);
    }

    if (!tickets[index].replies) {
      tickets[index].replies = [];
    }

    const newReply = {
      id: 'reply-' + Date.now(),
      senderId: reply.senderId || 'admin',
      senderName: reply.senderName || 'Admin',
      message: reply.message,
      createdAt: new Date().toISOString()
    };

    tickets[index].replies.push(newReply);
    tickets[index].updatedAt = new Date().toISOString();
    this._saveTickets(tickets);

    return tickets[index];
  }
}

// Global instance export
window.ticketApi = new TicketApi();
