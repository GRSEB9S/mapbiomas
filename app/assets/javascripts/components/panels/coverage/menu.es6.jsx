import React from 'react';
import _ from 'underscore';
import CoverageLineChart from '../../charts/coverage/line';
import CoveragePieChart from '../../charts/coverage/pie';

const INFRA_MENU_OPTION = 3;

export default class CoverageMenu extends React.Component {
  constructor(props) {
    super(props);
  }

  renderTerritoryName() {
    let label;

    if (this.props.myMapsPage && this.props.map) {
      return (
        <label>{ I18n.t('map.index.chart.map', { map: this.props.map.name }) }</label>
      );
    }

    if (!this.props.myMapsPage) {
      return (
        <label>{ I18n.t('map.index.chart.territory', { territory: _.first(this.props.territory).name }) }</label>
      );
    }

    return null;
  };

  renderInfraBufferInfo() {
    if (this.props.viewOptionsIndex == INFRA_MENU_OPTION && this.props.showInfraStats) {
      return (
        <label>Buffer: { this.props.infraBuffer.label }</label>
      );
    }

    return null;
  }

  renderInfraLevelsInfo() {
    if (this.props.viewOptionsIndex == INFRA_MENU_OPTION && this.props.showInfraStats) {
      if (_.isEmpty(this.props.infraLevels)) {
        return null;
      } else {
        let infraLevels = _.map(this.props.infraLevels, 'name').join(',');

        return (
          <label>Categoria(s): { infraLevels }</label>
        );
      }
    }
  }

  renderInstructions() {
    if (this.props.showInfraStats && this.props.viewOptionsIndex == INFRA_MENU_OPTION && (this.props.infraBuffer == 'none' || _.isEmpty(this.props.infraLevels))) {
      return (
        <label className="chart-tooltip">Selecione um buffer e uma ou mais categorias para visualizar a estatística de infraestrutura para a(s) mesma(s).</label>
      );
    }

    return (
      <label className="chart-tooltip">{I18n.t('map.index.chart.tooltip')}</label>
    );
  }

  renderPieChart() {
    if (this.props.showInfraStats && this.props.viewOptionsIndex == INFRA_MENU_OPTION && (this.props.infraBuffer == 'none' || _.isEmpty(this.props.infraLevels))) {
      return null;
    }

    return (
      <CoveragePieChart
        availableClassifications={this.props.availableClassifications}
        defaultClassifications={this.props.defaultClassifications}
        territory={this.props.territory}
        infraLevels={this.props.infraLevels}
        infraBuffer={this.props.infraBuffer}
        year={this.props.year}
        showInfraStats={this.props.showInfraStats}
        showCarStats={this.props.showCarStats}
        viewOptionsIndex={this.props.viewOptionsIndex}
      />
    );
  }

  renderLineChart() {
    if (this.props.showInfraStats && this.props.viewOptionsIndex == INFRA_MENU_OPTION && (this.props.infraBuffer == 'none' || _.isEmpty(this.props.infraLevels))) {
      return null;
    }

    return (
      <CoverageLineChart
        availableYears={this.props.availableYears}
        availableClassifications={this.props.availableClassifications}
        defaultClassifications={this.props.defaultClassifications}
        territory={this.props.territory}
        infraLevels={this.props.infraLevels}
        infraBuffer={this.props.infraBuffer}
        year={this.props.year}
        showInfraStats={this.props.showInfraStats}
        showCarStats={this.props.showCarStats}
        viewOptionsIndex={this.props.viewOptionsIndex}
      />
    );
  }

  renderDetailsButton() {
    if (this.props.showInfraStats && this.props.viewOptionsIndex == INFRA_MENU_OPTION && (this.props.infraBuffer == 'none' || _.isEmpty(this.props.infraLevels))) {
      return null;
    }

    return (
      <button className="primary" onClick={this.props.onExpandModal}>
        {I18n.t('map.index.coverage.details')}
      </button>
    );
  }

  render() {
    return (
      <div>
        <h3 className="map-control__header">
          {I18n.t('map.index.coverage.analysis')}
        </h3>

        <div>
          { this.renderInstructions() }
          <label>{I18n.t('map.index.chart.year', {year: this.props.year})}</label>
          { this.renderTerritoryName() }
          { this.renderInfraBufferInfo() }
          { this.renderInfraLevelsInfo() }
        </div>

        { this.renderPieChart() }
        { this.renderLineChart() }
        { this.renderDetailsButton() }
      </div>
    );
  }
}
