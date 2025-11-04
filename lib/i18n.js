// Internationalization utility for NeoNest
// This provides a foundation for multi-language support

const translations = {
  en: {
    // Common labels
    'name': 'Name',
    'email': 'Email',
    'password': 'Password',
    'login': 'Login',
    'signup': 'Sign Up',
    'save': 'Save',
    'cancel': 'Cancel',
    'delete': 'Delete',
    'edit': 'Edit',
    'add': 'Add',
    'update': 'Update',
    'submit': 'Submit',
    'close': 'Close',
    'back': 'Back',
    'next': 'Next',
    'previous': 'Previous',
    'loading': 'Loading...',
    'error': 'Error',
    'success': 'Success',
    'warning': 'Warning',
    'info': 'Information',
    
    // Medical page labels
    'vaccine_name': 'Vaccine Name',
    'vaccine_date': 'Vaccine Date',
    'next_due': 'Next Due',
    'doctor_notes': 'Doctor Notes',
    'medical_records': 'Medical Records',
    'vaccination_schedule': 'Vaccination Schedule',
    
    // Essentials page labels
    'item_name': 'Item Name',
    'category': 'Category',
    'quantity': 'Quantity',
    'low_stock_alert': 'Low Stock Alert',
    'baby_essentials': 'Baby Essentials',
    'add_item': 'Add Item',
    
    // Feeding page labels
    'feeding_time': 'Feeding Time',
    'amount': 'Amount',
    'feeding_type': 'Feeding Type',
    'notes': 'Notes',
    'feeding_log': 'Feeding Log',
    
    // Sleep page labels
    'sleep_start': 'Sleep Start',
    'sleep_end': 'Sleep End',
    'duration': 'Duration',
    'sleep_quality': 'Sleep Quality',
    'sleep_log': 'Sleep Log',
    
    // Growth page labels
    'weight': 'Weight',
    'height': 'Height',
    'head_circumference': 'Head Circumference',
    'growth_chart': 'Growth Chart',
    'milestone': 'Milestone',
    
    // Lullaby page labels
    'play': 'Play',
    'pause': 'Pause',
    'volume': 'Volume',
    'playlist': 'Playlist',
    
    // Contact labels
    'emergency_contact': 'Emergency Contact',
    'pediatrician': 'Pediatrician',
    'hospital': 'Hospital',
    'pharmacy': 'Pharmacy'
  },
  
  // Add more languages as needed
  es: {
    'name': 'Nombre',
    'email': 'Correo electrónico',
    'password': 'Contraseña',
    'login': 'Iniciar sesión',
    'signup': 'Registrarse',
    'save': 'Guardar',
    'cancel': 'Cancelar',
    // ... add more Spanish translations
  },
  
  hi: {
    'name': 'नाम',
    'email': 'ईमेल',
    'password': 'पासवर्ड',
    'login': 'लॉगिन',
    'signup': 'साइन अप',
    'save': 'सेव करें',
    'cancel': 'रद्द करें',
    // ... add more Hindi translations
  }
};

// Default language
let currentLanguage = 'en';

/**
 * Set the current language
 * @param {string} language - Language code (e.g., 'en', 'es', 'hi')
 */
export function setLanguage(language) {
  if (translations[language]) {
    currentLanguage = language;
    // Store in localStorage for persistence
    if (typeof window !== 'undefined') {
      localStorage.setItem('neonest_language', language);
    }
  }
}

/**
 * Get the current language
 * @returns {string} Current language code
 */
export function getCurrentLanguage() {
  return currentLanguage;
}

/**
 * Initialize language from localStorage or browser preference
 */
export function initializeLanguage() {
  if (typeof window !== 'undefined') {
    // Try to get from localStorage first
    const savedLanguage = localStorage.getItem('neonest_language');
    if (savedLanguage && translations[savedLanguage]) {
      currentLanguage = savedLanguage;
      return;
    }
    
    // Fall back to browser language
    const browserLanguage = navigator.language.split('-')[0];
    if (translations[browserLanguage]) {
      currentLanguage = browserLanguage;
    }
  }
}

/**
 * Translate a key to the current language
 * @param {string} key - Translation key
 * @param {string} fallback - Fallback text if translation not found
 * @returns {string} Translated text
 */
export function t(key, fallback = key) {
  const translation = translations[currentLanguage]?.[key];
  return translation || fallback;
}

/**
 * Get all available languages
 * @returns {Array} Array of language objects with code and name
 */
export function getAvailableLanguages() {
  return [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'hi', name: 'हिंदी' }
  ];
}

/**
 * Check if a language is supported
 * @param {string} language - Language code to check
 * @returns {boolean} Whether the language is supported
 */
export function isLanguageSupported(language) {
  return !!translations[language];
}

/**
 * Add translations for a specific language
 * @param {string} language - Language code
 * @param {Object} newTranslations - Object with translation key-value pairs
 */
export function addTranslations(language, newTranslations) {
  if (!translations[language]) {
    translations[language] = {};
  }
  translations[language] = { ...translations[language], ...newTranslations };
}

// Initialize language on module load
if (typeof window !== 'undefined') {
  initializeLanguage();
}