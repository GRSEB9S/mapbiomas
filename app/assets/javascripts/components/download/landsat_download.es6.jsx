import React from 'react';
import Select from 'react-select';
import { Years } from '../../lib/years';

export default class LandsatDownload extends React.Component {
  constructor() {
    super();

    this.state = {
      year: null
    }
  }

  get years() {
    return this.props.availableYears.map((t, index) => {
      return {
        id: index + 1,
        name: t
      };
    });
  }

  get year() {
    return this.state.year || _.last(this.years);
  }

  addBaseMap(map) {
    L.tileLayer('http://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
    }).addTo(map);
  }

  setCardsLayer(cards, map) {
    const style = {
      color: '#000',
      fillColor: '#aaa',
      weight: 0.3
    };

    L.geoJson(cards, {
      style: style,
      onEachFeature: (feature, layer) => {
        layer.on('mouseover', (e) => {
          e.target.bindPopup(feature.properties.name).openPopup();
        });
        layer.on('click', (e) => {
          window.open(`http://seeg-mapbiomas.terras.agr.br/dashboard/downloads/landsat/${feature.properties.name}/${this.year.name}`, '_blank');
        });
      }
    }).addTo(map);
  }

  addCardsLayer(map) {
    $.getJSON(this.props.cardsUrl, (cards) => {
      this.setState({ cards }, () => {
        this.setCardsLayer(cards, map);
      });
    });
  }

  setup() {
    let node = this.refs.element;
    this.map = L.map(node, {
      minZoom: 4
    }).setView([-15, -57], 4);

    this.addBaseMap(this.map);
    this.addCardsLayer(this.map);
  }

  handleYearChange(newYear) {
    let year = this.years.find((t) => t.id == newYear.value);
    this.setState({ year });
  }

  onYearChange(id) {
    let year = _.findWhere(this.years, {value: id});
    this.setState({ year });
  }

  componentDidMount() {
    this.setup();
  }

  renderSelect() {
    let years = new Years(this.years);

    return (
      <div className="map-control-wrapper year-select-wrapper">
        <Select
          name="territory-select"
          value={this.year.id}
          options={years.toOptions()}
          onChange={this.handleYearChange.bind(this)}
          clearable={false}
        />
      </div>
    );
  }

  render() {
    return (
      <div className="landsat-download">
        <div className="map">
          <div className="map__canvas" ref="element"></div>
          {this.renderSelect()}
        </div>
      </div>
    );
  }
}
