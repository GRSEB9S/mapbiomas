import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import TransitionsLabels from './labels';
import TogglesControl from '../../controls/toggles';


class TransitionsAuxiliarControls extends React.Component {
  componentDidMount() {
    $('#base-maps-tooltip').tooltipster({
      theme: 'tooltip-custom-theme',
      interactive: true,
      contentAsHTML: true,
      content: $(I18n.t('map.index.base_maps.tooltip'))
    });
  }

  render() {
    return (
      <Tabs
          className="map-panel__action-panel map-panel__tab-panel"
          selectedIndex={this.props.viewOptionsIndex}
          onSelect={this.props.handleViewOptionsIndexSelect}>
        <TabList>
          <Tab>{I18n.t('map.index.transitions.labels.title')}</Tab>
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
          <TransitionsLabels
            transition={this.props.transition}
            transitionsLayers={this.props.transitionsLayers}
            classifications={this.props.classifications}
            availableTransitionsLayers={this.props.availableTransitionsLayers}
            handleTransitionReset={this.props.handleTransitionReset}
            handleTransitionsLayersChange={this.props.handleTransitionsLayersChange}
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

export default TransitionsAuxiliarControls;
