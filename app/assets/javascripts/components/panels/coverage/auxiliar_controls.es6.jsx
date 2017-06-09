import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import ClassificationControl from '../../controls/classification';
import TogglesControl from '../../controls/toggles';


class CoverageAuxiliarControls extends React.Component {
  componentDidMount() {
    $('#base-maps-tooltip').tooltipster({
      theme: 'tooltip-custom-theme',
      content: $(I18n.t('map.index.base_maps.tooltip'))
    });
  }

  render() {
    return (
      <Tabs
          className="map-panel__action-panel map-panel__tab-panel"
          selectedIndex={this.props.viewOptionsIndex}
          onSelect={this.props.handleViewOptionsIndexSelect}>
        <TabList className="three-tabbed">
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
        </TabList>
        <TabPanel>
          <ClassificationControl
            className="map-panel__content"
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
            availableOptions={this.props.availableBaseMaps}
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
      </Tabs>
    );
  }
}

export default CoverageAuxiliarControls;
