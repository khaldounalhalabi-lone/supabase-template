import { type LocaleMessageKey } from "@/shared/modules/localization/Locale.ts";
import App from "../../core/bootstrap/App.ts";

export function trans(key: LocaleMessageKey, locale?: string) {
  return App.make().locale.translate(key, locale);
}
