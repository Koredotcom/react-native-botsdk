import { Platform } from 'react-native';

/**
 * Localization Class - Centralized localization management
 * 
 * Usage Examples:
 * 
 * 1. Basic Usage:
 *    import { LocalizationManager } from '../constants/Localization';
 *    
 *    // Auto-detect device locale
 *    LocalizationManager.initializeLocale();
 *    
 *    // Get localized string
 *    const cancelText = LocalizationManager.getLocalizedString('CANCEL');
 * 
 * 2. With explicit locale:
 *    LocalizationManager.initializeLocale('fr');
 *    const closeText = LocalizationManager.getLocalizedString('CLOSE'); // Returns "FERMER"
 * 
 * 3. Check supported locales:
 *    const supportedLocales = LocalizationManager.getSupportedLocales(); // ['en', 'es', 'fr', 'de', 'hi']
 * 
 * 4. Add new locale:
 *    LocalizationManager.addLocaleStrings('it', {
 *      BACK_DIALOG_TITLE: 'Vuoi chiudere la conversazione o minimizzare?',
 *      CANCEL: 'ANNULLA',
 *      CLOSE: 'CHIUDI',
 *      MINIMIZE: 'MINIMIZZA'
 *    });
 * 
 * 5. Update specific keys in existing locale (smart merge):
 *    LocalizationManager.addLocaleStrings('fr', {
 *      CANCEL: 'NOUVEAU ANNULER',    // Overrides existing CANCEL
 *      NEW_KEY: 'NOUVELLE VALEUR'    // Adds new key  
 *    });
 *    // Result: All other keys (CLOSE, MINIMIZE, etc.) are preserved
 * 
 */

// Localized strings for the application
const LOCALIZED_STRINGS = {
  en: {
    back_dialog_title: 'Would you like to close the conversation or minimize?',
    cancel: 'CANCEL',
    close: 'CLOSE',
    minimize: 'MINIMIZE',
    view_more: 'View More',
    answered_by_ai: 'Answered by AI',
    did_not_get_code: 'Didn\'t get a code?'
  },
  es: {
    back_dialog_title: '¿Te gustaría cerrar la conversación o minimizar?',
    cancel: 'CANCELAR',
    close: 'CERRAR',
    minimize: 'MINIMIZAR',
  },
  fr: {
    back_dialog_title: 'Souhaitez-vous fermer la conversation ou la minimiser?',
    cancel: 'ANNULER',
    close: 'FERMER',
    minimize: 'MINIMISER',
  },
  de: {
    back_dialog_title: 'Möchten Sie das Gespräch schließen oder minimieren?',
    cancel: 'ABBRECHEN',
    close: 'SCHLIEßEN',
    minimize: 'MINIMIEREN',
  },
};

export class Localization {
  private static instance: Localization;
  private currentLocale: string = 'en';

  private constructor() {}

  // Singleton pattern to ensure single instance
  public static getInstance(): Localization {
    if (!Localization.instance) {
      Localization.instance = new Localization();
    }
    return Localization.instance;
  }

  /**
   * Get device locale using multiple detection methods
   * @returns Device locale code (e.g., 'en', 'fr', 'es')
   */
  public getDeviceLocale(): string {
    try {
      // Method 1: Use JavaScript Intl API (most reliable)
      const intlLocale = Intl.DateTimeFormat().resolvedOptions().locale;
      if (intlLocale) {
        const langCode = intlLocale.split(/[-_]/)[0];
        console.log('Localization: Device locale from Intl API:', intlLocale, '→', langCode);
        return langCode;
      }
    } catch (error) {
      console.warn('Localization: Intl API locale detection failed:', error);
    }

    try {
      // Method 2: Platform-specific detection
      const deviceLocale = Platform.select({
        ios: require('react-native').NativeModules.SettingsManager?.settings?.AppleLanguages?.[0],
        android: require('react-native').NativeModules.I18nManager?.localeIdentifier,
        default: null
      });
      
      if (deviceLocale) {
        const langCode = deviceLocale.split(/[-_]/)[0];
        console.log('Localization: Device locale from platform API:', deviceLocale, '→', langCode);
        return langCode;
      }
    } catch (error) {
      console.warn('Localization: Platform locale detection failed:', error);
    }

    console.log('Localization: No device locale detected, using English');
    return 'en';
  }

  /**
   * Set the current locale
   * @param locale - Locale code (e.g., 'en', 'fr', 'es')
   */
  public setLocale(locale: string): void {
    this.currentLocale = locale;
    console.log('Localization: Current locale set to:', locale);
  }

  /**
   * Get the current locale
   * @returns Current locale code
   */
  public getLocale(): string {
    return this.currentLocale;
  }

  /**
   * Initialize locale with auto-detection if no locale provided
   * @param providedLocale - Optional locale to override auto-detection
   * @param validateTranslations - Whether to validate translation completeness on init
   */
  public initializeLocale(providedLocale?: string | null, validateTranslations: boolean = true): void {
    if (providedLocale === null || providedLocale === undefined) {
      // No locale provided, auto-detect device locale
      const deviceLocale = this.getDeviceLocale();
      console.log('Localization: No locale provided, auto-detecting:', deviceLocale);
      this.setLocale(deviceLocale);
    } else {
      // Locale provided, use it
      console.log('Localization: Using provided locale:', providedLocale);
      this.setLocale(providedLocale);
    }

    // Validate translations if requested
    if (validateTranslations) {
      const missingTranslations = this.validateTranslations();
      if (Object.keys(missingTranslations).length > 0) {
        console.warn('🚨 Translation Validation Results:', missingTranslations);
      } else {
        console.log('✅ All translations are complete!');
      }
    }
  }

  /**
   * Get localized string for a given key
   * @param key - The string key to translate
   * @param locale - Optional locale override
   * @returns Localized string or fallback
   */
  public getLocalizedString(key: string, locale?: string): string {
    const targetLocale = locale || this.currentLocale;
    // console.log('Localization: Looking up key:', key, 'in locale:', targetLocale);
    
    const strings = LOCALIZED_STRINGS[targetLocale as keyof typeof LOCALIZED_STRINGS];
    // console.log('Localization: Found strings for locale:', targetLocale, '→', !!strings);
    
    if (strings && strings[key as keyof typeof strings]) {
      const translatedString = strings[key as keyof typeof strings];
      // console.log(`Localization: Translated "${key}" to "${translatedString}" (${targetLocale})`);
      return translatedString;
    }
    
    // Fallback to English if locale not found or key not found
    const fallbackStrings = LOCALIZED_STRINGS.en;
    const fallbackString = fallbackStrings[key as keyof typeof fallbackStrings] || key;
    
    // Warn about missing translation
    if (targetLocale !== 'en' && strings) {
      console.warn(`⚠️  Missing translation for "${key}" in locale "${targetLocale}", using English fallback: "${fallbackString}"`);
    }
    
    console.log(`Localization: Using fallback for "${key}": "${fallbackString}"`);
    return fallbackString;
  }

  /**
   * Check for missing translations in a specific locale
   * @param locale - Locale to check
   * @returns Array of missing translation keys
   */
  public getMissingTranslations(locale: string): string[] {
    const englishKeys = Object.keys(LOCALIZED_STRINGS.en);
    const localeStrings = LOCALIZED_STRINGS[locale as keyof typeof LOCALIZED_STRINGS];
    
    if (!localeStrings) {
      return englishKeys; // All keys are missing if locale doesn't exist
    }
    
    const localeKeys = Object.keys(localeStrings);
    const missingKeys = englishKeys.filter(key => !localeKeys.includes(key));
    
    return missingKeys;
  }

  /**
   * Validate translation completeness for all locales
   * @returns Object with missing translations per locale
   */
  public validateTranslations(): Record<string, string[]> {
    const results: Record<string, string[]> = {};
    const supportedLocales = this.getSupportedLocales();
    
    supportedLocales.forEach(locale => {
      if (locale !== 'en') { // Skip English as it's the base
        const missing = this.getMissingTranslations(locale);
        if (missing.length > 0) {
          results[locale] = missing;
          console.warn(`🚨 Incomplete translations for "${locale}":`, missing);
        }
      }
    });
    
    return results;
  }

  /**
   * Check if a locale is supported
   * @param locale - Locale code to check
   * @returns True if locale is supported
   */
  public isLocaleSupported(locale: string): boolean {
    return locale in LOCALIZED_STRINGS;
  }

  /**
   * Get all supported locales
   * @returns Array of supported locale codes
   */
  public getSupportedLocales(): string[] {
    return Object.keys(LOCALIZED_STRINGS);
  }

  /**
   * Add or update locale strings (smart merge behavior)
   * 
   * Behavior:
   * - If locale doesn't exist: Creates new locale with provided strings
   * - If locale exists: 
   *   - Existing keys: Overrides values with new ones
   *   - New keys: Adds them to existing locale
   *   - Untouched keys: Preserves existing values
   * 
   * @param locale - Locale code
   * @param strings - Object containing localized strings to add/update
   */
  public addLocaleStrings(locale: string, strings: Record<string, string>): void {
    const existingStrings = (LOCALIZED_STRINGS as any)[locale];
    
    if (!existingStrings) {
      // Create new locale
      (LOCALIZED_STRINGS as any)[locale] = strings;
      console.log(`Localization: Created new locale "${locale}" with ${Object.keys(strings).length} strings`);
    } else {
      // Smart merge: override existing keys, add new keys, preserve untouched keys
      (LOCALIZED_STRINGS as any)[locale] = {
        ...existingStrings,  // Keep all existing keys
        ...strings,          // Override existing + add new keys
      };
      
      // Detailed logging
      const updatedKeys: string[] = [];
      const newKeys: string[] = [];
      
      Object.keys(strings).forEach(key => {
        if (existingStrings[key]) {
          updatedKeys.push(key);
        } else {
          newKeys.push(key);
        }
      });
      
      console.log(`Localization: Updated locale "${locale}"`);
      if (updatedKeys.length > 0) {
        console.log(`  ✏️  Overridden keys: [${updatedKeys.join(', ')}]`);
      }
      if (newKeys.length > 0) {
        console.log(`  ➕ Added new keys: [${newKeys.join(', ')}]`);
      }
      
      const preservedCount = Object.keys(existingStrings).length - updatedKeys.length;
      console.log(`  ✅ Preserved ${preservedCount} existing keys`);
    }
  }

  /**
   * Update a single localized string key
   * @param locale - Locale code
   * @param key - String key to update
   * @param value - New value for the key
   */
  public updateLocalizedString(locale: string, key: string, value: string): void {
    this.addLocaleStrings(locale, { [key]: value });
  }

  /**
   * Get current strings for a locale (useful for debugging)
   * @param locale - Locale code
   * @returns Object with current strings or undefined if locale doesn't exist
   */
  public getLocaleStrings(locale: string): Record<string, string> | undefined {
    return LOCALIZED_STRINGS[locale as keyof typeof LOCALIZED_STRINGS];
  }
}

// Export singleton instance for easy access
export const LocalizationManager = Localization.getInstance();

// Export the strings constant for backward compatibility if needed
export { LOCALIZED_STRINGS }; 