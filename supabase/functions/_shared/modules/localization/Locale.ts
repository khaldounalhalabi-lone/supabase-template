import de from "@/shared/modules/localization/messages/de.json" with { type: "json" };
import en from "@/shared/modules/localization/messages/en.json" with { type: "json" };
import i18next from "i18n";
import { DEFAULT_LOCALE } from "../../bootstrap.ts";

type TranslationSchema = typeof en;

type DotPrefix<T extends string> = T extends "" ? "" : `.${T}`;

type DeepKeys<T> = T extends object
  ? {
      [K in keyof T]: `${Extract<K, string>}${DotPrefix<DeepKeys<T[K]>>}`;
    }[keyof T]
  : "";

export type LocaleMessageKey = DeepKeys<TranslationSchema>;

class Locale {
  private currentLocale: string;

  constructor() {
    this.currentLocale = DEFAULT_LOCALE;
    i18next.init({
      fallbackLng: "en",
      resources: {
        en: {
          translation: en,
        },
        de: {
          translation: de,
        },
      },
    });
  }

  public setLocale(locale: string) {
    this.currentLocale = locale;
  }

  public getLocale(): string {
    return this.currentLocale;
  }

  public translate(key: LocaleMessageKey, locale?: string) {
    const t = i18next.getFixedT(locale || this.getLocale());
    return t(key);
  }
}

export default Locale;
