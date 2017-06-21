import Highcharts from 'highcharts';

export class Locale {
  static setLocale(params) {
    return $.get(Routes.set_language_path(params));
  }

  static setHighchartsLang() {
    Highcharts.setOptions({
      lang: {
        contextButtonTitle: I18n.t('charts.buttons.context_button.title'),
        downloadJPEG: I18n.t('charts.lang.download_jpeg'),
        downloadPDF: I18n.t('charts.lang.download_pdf'),
        downloadPNG: I18n.t('charts.lang.download_png'),
        downloadSVG: I18n.t('charts.lang.download_svg'),
        loading: I18n.t('charts.lang.loading'),
        printChart: I18n.t('charts.lang.print_chart')
      }
    });
  }
}
