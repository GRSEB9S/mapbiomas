import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import TogglesControl from '../../controls/toggles';
import TransitionsLayersControl from '../../controls/transitions_layers';


class TransitionsAuxiliarControls extends React.Component {
  findClassification(id) {
    return _.find(this.props.classifications, (c) => c.id == id);
  }

  renderTransitionLabel() {
    let from = this.findClassification(this.props.transition.from);
    let to = this.findClassification(this.props.transition.to);

    return (
      <div className="map-panel__content">
        <h3 className="map-control__header">
          {I18n.t('map.index.transitions.selected_transition.title')}
        </h3>

        <div className="transition-label__container">
          <label className="transition-label__item">
            {I18n.t('map.index.transitions.selected_transition.from', {from: from.name})}
          </label>
          <label className="transition-label__item">
            {I18n.t('map.index.transitions.selected_transition.to', {to: to.name})}
          </label>
          <label className="transition-label__item">
            {I18n.t('map.index.transitions.selected_transition.area', {
              area: I18n.toNumber(this.props.transition.area, { precision: 0 })
            })}
          </label>
        </div>

        <button className="primary" onClick={this.props.handleTransitionReset}>
          {I18n.t('map.index.transitions.selected_transition.all_transitions')}
        </button>
      </div>
    );
  }

  renderTransitionsLayersControl() {
    return (
      <TransitionsLayersControl
        options={this.props.transitionsLayers}
        availableOptions={this.props.availableTransitionsLayers}
        onChange={this.props.handleTransitionsLayersChange}
        calcMaxHeight={() => (
          $('#transitions-auxiliar-controls').height() - 55
        )}
      />
    );
  }

  renderLayersTab() {
    if (this.props.transition) {
      return this.renderTransitionLabel();
    } else {
      return this.renderTransitionsLayersControl();
    }
  }

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
          {this.renderLayersTab()}
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
