/**
 * Custom UUID utility to replace react-native-uuid dependency
 * Generates RFC4122 version 4 UUIDs
 */

class UUID {
  /**
   * Generate a version 4 UUID string
   * Format: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
   * where x is any hexadecimal digit and y is one of 8, 9, A, or B
   * @returns {string} UUID v4 string
   */
  static v4() {
    // Use crypto.getRandomValues if available (web environment)
    if (typeof globalThis !== 'undefined' && 
        globalThis.crypto && 
        globalThis.crypto.getRandomValues) {
      const buffer = new Uint8Array(16);
      globalThis.crypto.getRandomValues(buffer);
      
      // Set version (4) and variant bits according to RFC 4122
      buffer[6] = (buffer[6] & 0x0f) | 0x40; // Version 4
      buffer[8] = (buffer[8] & 0x3f) | 0x80; // Variant 10
      
      const hexArray = Array.from(buffer, byte => byte.toString(16).padStart(2, '0'));
      
      return [
        hexArray.slice(0, 4).join(''),
        hexArray.slice(4, 6).join(''),
        hexArray.slice(6, 8).join(''),
        hexArray.slice(8, 10).join(''),
        hexArray.slice(10, 16).join('')
      ].join('-');
    }
    
    // Fallback for React Native environment
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
}

// Export both named and default exports for compatibility
export default UUID;
export { UUID }; 