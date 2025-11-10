import i18next from "i18n";
import en from "@/shared/modules/localization/messages/en.json" assert { type: "json" };

type TranslationSchema = typeof en;

type DotPrefix<T extends string> = T extends "" ? "" : `.${T}`;

type DeepKeys<T> = (
  T extends object
    ? { [K in keyof T]: `${Extract<K, string>}${DotPrefix<DeepKeys<T[K]>>}` }[keyof T]
    : ""
  );

export type LocaleMessageKey =  DeepKeys<TranslationSchema>

class Locale {
  private static instance: Locale;
  private static currentLocale: string;

  private constructor() {
    i18next.init({
      fallbackLng: "en",
      resources: {
        en: {
          translation: en,
        },
      },
    });
  }

  public static make() {
    if (!Locale.instance) {
      Locale.instance = new Locale();
    }
    return Locale.instance;
  }

  public setLocale(locale: string) {
    Locale.currentLocale = locale;
  }

  public getLocale(): string {
    return Locale.currentLocale;
  }

  public translate(key: LocaleMessageKey, locale?: string) {
    const t = i18next.getFixedT(locale || this.getLocale());
    return t(key);
  }
}

export default Locale;
