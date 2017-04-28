import React from 'react';
import Select from 'react-select-plus';
import { Cards } from '../../lib/cards';
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

  get cards() {
    if(this.state.cards) {
      return this.state.cards.features.map((c, index) => {
        return {
          id: index + 1,
          name: c.properties.name
        };
      });
    } else {
      return [];
    }
  }

  get card() {
    let fakeCard = {
      id: null,
      name: null
    };

    return this.state.card || _.first(this.cards) || fakeCard;
  }

  handleClick(cardName) {
    window.open(`http://seeg-mapbiomas.terras.agr.br/dashboard/downloads/landsat/${cardName}/${this.year.name}`, '_blank');
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
          this.handleClick(feature.properties.name);
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

  handleCardChange(newCard) {
    let card = this.cards.find((c) => c.id == newCard.value);
    this.setState({ card });
  }

  componentDidMount() {
    this.setup();
  }

  renderYearSelect() {
    let years = new Years(this.years);

    return (
      <Select
        name="year-select"
        value={this.year.id}
        options={years.toOptions()}
        onChange={this.handleYearChange.bind(this)}
        clearable={false}
      />
    );
  }

  renderCardSelect() {
    let cards = new Cards(this.cards);

    return (
      <Select
        name="card-select"
        value={this.card.id}
        options={cards.toOptions()}
        onChange={this.handleCardChange.bind(this)}
        clearable={false}
      />
    );
  }

  render() {
    return (
      <div className="landsat-download">
        <div className="map">
          <div className="page__box-download">
            <div className="map-control-wrapper landsat-download__select">
              <div className="map-control__content">
                {this.renderYearSelect()}
                {this.renderCardSelect()}
                <div className="Select">
                  <button
                      className="primary"
                      onClick={this.handleClick.bind(this, this.card.name)}>
                    {I18n.t('landsat_mosaics.download')}
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="map__canvas" ref="element"></div>
        </div>
      </div>
    );
  }
}
