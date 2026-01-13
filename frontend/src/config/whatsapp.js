/**
 * WhatsApp Configuration
 * 
 * Update the phone number below with your actual WhatsApp Business number
 * Format: Country code + number (no + symbol, no spaces, no dashes)
 * 
 * Examples:
 * - India: 919876543210 (91 is country code for India)
 * - USA: 14155552671 (1 is country code for USA)
 * - UK: 447911123456 (44 is country code for UK)
 */

export const WHATSAPP_CONFIG = {
  // Chinggizz WhatsApp Business number
  phoneNumber: '917012897008',

  // Default message when customer clicks "Chat with Chinggizz"
  defaultMessage: 'Hi Chinggizz! I need help with a special gift or have some questions.',

  // Message for special gift inquiries
  specialGiftMessage: 'Hi! I\'m looking for a special customized gift. Can you help me?',

  // Message for general inquiries
  generalInquiryMessage: 'Hi Chinggizz! I have some questions about your products.',
};

/**
 * Helper function to open WhatsApp chat
 * @param {string} message - Custom message to send (optional)
 * @returns {string} WhatsApp URL
 */
export const getWhatsAppUrl = (message = WHATSAPP_CONFIG.defaultMessage) => {
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${WHATSAPP_CONFIG.phoneNumber}?text=${encodedMessage}`;
};

/**
 * Helper function to open WhatsApp chat in new window
 * @param {string} message - Custom message to send (optional)
 */
export const openWhatsAppChat = (message = WHATSAPP_CONFIG.defaultMessage) => {
  const url = getWhatsAppUrl(message);
  window.open(url, '_blank');
};

