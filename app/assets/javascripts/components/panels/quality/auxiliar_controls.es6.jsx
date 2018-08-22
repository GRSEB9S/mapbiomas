import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import TogglesControl from '../../controls/toggles';
import QualityLabels from './labels';
import CarControl from '../../controls/car';
import InfrastructureControl from '../../controls/infrastructure/infrastructure';

class QualityAuxiliarControls extends React.Component {
  componentDidMount() {
    $('#base-maps-tooltip').tooltipster({
      theme: 'tooltip-custom-theme',
      interactive: true,
      contentAsHTML: true,
      content: $(I18n.t('map.index.base_maps.tooltip'))
    });
  }

  get baseMapsOptions() {
    return _.filter(this.props.availableBaseMaps, (m) => !m.data);
  }

  render() {
    return (
      <Tabs
          className="map-panel__action-panel map-panel__tab-panel"
          selectedIndex={this.props.viewOptionsIndex}
          onSelect={this.props.handleViewOptionsIndexSelect}>
        <TabList>
          <Tab>{I18n.t('map.index.quality.labels.title')}</Tab>
          <Tab>
            <div>
              {I18n.t('map.index.base_maps.title')}

              <i id="base-maps-tooltip"
                className="material-icons tooltip">
                &#xE88E;
              </i>
            </div>
          </Tab>
          <Tab>{I18n.t('map.index.layers.title')}</Tab>
          <Tab>{I18n.t('map.index.infra_levels.title')}</Tab>
          <Tab>{I18n.t('map.index.car.title')}</Tab>
        </TabList>
        <TabPanel>
          <div className="map-panel-can-hide" id="quality-labels">
            <QualityLabels />
          </div>
        </TabPanel>
        <TabPanel>
          <TogglesControl
            className="map-panel__content"
            options={this.props.baseMaps}
            availableOptions={this.baseMapsOptions}
            onChange={this.props.handleBaseMapsChange}
          />
        </TabPanel>
        <TabPanel>
          <TogglesControl
            className="map-panel__content"
            options={this.props.layers}
            availableOptions={this.props.availableLayers}
            onChange={this.props.handleLayersChange}
          />
        </TabPanel>
        <TabPanel>
          <InfrastructureControl
            className="map-panel__content"
            infraLevels={this.props.infraLevels}
            availableInfraLevels={this.props.availableInfraLevels}
            calcMaxHeight={() => (
              $('#transitions-auxiliar-controls').height() - 55
            )}
            onChange={this.props.handleInfraLevelsChange}
          />
        </TabPanel>
        <TabPanel>
          <CarControl
            showCarLayer={this.props.showCarLayer}
            showCarStats={this.props.showCarStats}
            onCarLayerChange={this.props.handleCarLayerChange}
            onCarStatsChange={this.props.handleCarStatsChange}
          />
        </TabPanel>
      </Tabs>
    );
  }
}

export default QualityAuxiliarControls;
