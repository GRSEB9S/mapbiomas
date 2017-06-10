import Highcharts from 'highcharts';

Highcharts.setOptions({
  lang: {
    decimalPoint: I18n.t('number.format.delimiter'),
    thousandsSep: I18n.t('number.format.separator'),
  },
  credits: {
    enabled: false
  }
});
