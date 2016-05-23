export class Locale {
  static setLocale(params) {
    return $.get(Routes.set_language_path(params));
  }
}
