import type { Context } from "hono";
import type Middleware from "../core/middlewares/contracts/Middleware.ts";
import Locale from "../modules/localization/Locale.ts";

/**
 * Middleware to extract and set the accepted language from request headers.
 * Sets the locale in the Locale singleton and stores it in Hono context.
 */
class AcceptLanguageMiddleware implements Middleware {
  private defaultLocale: string;
  private supportedLocales: string[];

  constructor(defaultLocale: string = "en", supportedLocales: string[] = ["en"]) {
    this.defaultLocale = defaultLocale;
    this.supportedLocales = supportedLocales;
  }

  async handle(c: Context, next: () => Promise<Response>): Promise<Response> {
    // Extract Accept-Language header
    const acceptLanguage = c.req.header("Accept-Language");
    
    // Parse and determine the best locale
    const locale = this.parseAcceptLanguage(acceptLanguage || this.defaultLocale);
    
    // Set locale in the Locale singleton
    Locale.make().setLocale(locale);
    
    // Store locale in Hono context for use in handlers
    c.set("locale", locale);
    
    // Continue to next middleware/handler
    return await next();
  }

  /**
   * Parse Accept-Language header and return the best matching locale.
   * Falls back to the default locale if no match is found.
   */
  private parseAcceptLanguage(acceptLanguage: string): string {
    if (!acceptLanguage) {
      return this.defaultLocale;
    }

    // Parse Accept-Language header (e.g., "en-US,en;q=0.9,fr;q=0.8")
    const languages = acceptLanguage
      .split(",")
      .map((lang) => {
        const [locale, qValue] = lang.trim().split(";q=");
        const quality = qValue ? parseFloat(qValue) : 1.0;
        return { locale: locale.split("-")[0].toLowerCase(), quality };
      })
      .sort((a, b) => b.quality - a.quality);

    // Find the first supported locale
    for (const { locale } of languages) {
      if (this.supportedLocales.includes(locale)) {
        return locale;
      }
    }

    // Fallback to default locale
    return this.defaultLocale;
  }
}

export default AcceptLanguageMiddleware;
