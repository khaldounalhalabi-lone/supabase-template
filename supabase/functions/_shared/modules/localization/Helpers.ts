import Locale, { type LocaleMessageKey } from "@/shared/modules/localization/Locale.ts";

export function trans(key: LocaleMessageKey, locale?: string) {
  return Locale.make().translate(key, locale);
}
