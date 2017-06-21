import 'highcharts_config';
//import 'vendor/leaflet-google';
import 'vendor/spin';
import 'vendor/leaflet-spin';
import { Locale } from 'lib/locale';

import React from 'react';
import ReactDOM from 'react-dom';
import LandsatDownload from './components/download/landsat_download';
import Map from './components/map/map';
import Menu from './components/menu/menu';
import Stats from './components/stats/stats';

window.React = React;
window.ReactDOM = ReactDOM;

window.LandsatDownload = LandsatDownload;
window.Map = Map;
window.Menu = Menu;
window.Stats = Stats;
window.Locale = Locale;
