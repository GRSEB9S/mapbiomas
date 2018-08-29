import React from 'react';
import _ from 'underscore';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import ClassificationControl from '../../controls/classification';
import InfrastructureControl from '../../controls/infrastructure/infrastructure';
import CarControl from '../../controls/car';
import TogglesControl from '../../controls/toggles';
import Scrollable from 'lib/scrollable';

class CoverageAuxiliarControls extends React.Component {
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
          <Tab>{I18n.t('map.index.classifications.title')}</Tab>
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
          <ClassificationControl
            className="map-panel__content"
            defaultClassificationsTree={this.props.defaultClassificationsTree}
            options={this.props.classifications}
            availableOptions={this.props.availableClassifications}
            onChange={this.props.handleClassificationsChange}
            calcMaxHeight={() => (
              $('#coverage-auxiliar-controls').height() - 55
            )}
          />
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
            infraBuffer={this.props.infraBuffer}
            availableInfraLevels={this.props.availableInfraLevels}
            calcMaxHeight={() => (
              $('#coverage-auxiliar-controls').height() - 55
            )}
            onInfraLevelsChange={this.props.handleInfraLevelsChange}
            onInfraBufferChange={this.props.handleInfraBufferChange}
          />
        </TabPanel>
        <TabPanel>
          <Scrollable calcMaxHeight={() => (
            $('#coverage-auxiliar-controls').height() - 55
          )}>
            <CarControl
              showCarLayer={this.props.showCarLayer}
              showCarStats={this.props.showCarStats}
              onCarLayerChange={this.props.handleCarLayerChange}
              onCarStatsChange={this.props.handleCarStatsChange}
            />
        </Scrollable>
        </TabPanel>
      </Tabs>
    );
  }
}

export default CoverageAuxiliarControls;
