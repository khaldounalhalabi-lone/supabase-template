import type { Context } from "hono";
import type Middleware from "@/shared/core/middlewares/contracts/Middleware.ts";
import Locale from "@/shared/modules/localization/Locale.ts";
import { APP_LOCALES, DEFAULT_LOCALE } from "@/shared/bootstrap.ts";

class AcceptLanguageMiddleware implements Middleware {
  async handle(c: Context, next: () => Promise<Response>): Promise<Response> {
    const acceptLanguage = c.req.header("Accept-Language");

    const locale = this.parseAcceptLanguage(
      acceptLanguage || this.defaultLocale,
    );

    Locale.make().setLocale(locale);

    c.set("locale", locale);

    return await next();
  }

  private parseAcceptLanguage(acceptLanguage: string): string {
    const supportedLocales = APP_LOCALES;
    const defaultLocale = DEFAULT_LOCALE;
    if (!acceptLanguage) {
      return defaultLocale;
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

    for (const { locale } of languages) {
      if (supportedLocales.includes(locale)) {
        return locale;
      }
    }

    return defaultLocale;
  }
}

export default AcceptLanguageMiddleware;
