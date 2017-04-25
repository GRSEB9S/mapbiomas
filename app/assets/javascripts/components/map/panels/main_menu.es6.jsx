import React from 'react';
import cx from 'classnames';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { CoverageControl } from '../../control/coverage_control';
import { QualityControl } from '../../control/quality/quality_control';
import { TransitionsControl } from '../../control/transitions/transitions_control';

const MainMenu = ({
  mode,
  menuIndex,
  onSelect,
  territory,
  transition,
  transitions,
  years,
  onExpandMatrix,
  onTransitionsLoad,
  setTransition,
  cards,
  year,
  classifications,
  qualities,
  qualityInfo,
  onTerritoryChange,
  loadTerritories,
  mapProps
}) => {
  const classes = cx("map-control-wrapper", {
    "map-control-wrapper--bigger": mode == 'transitions'
  });

  return(
    <Tabs
        selectedIndex={menuIndex}
        onSelect={onSelect}
        className={classes}>
      <TabList className="three-tabbed">
        <Tab>{I18n.t('map.index.coverage.title')}</Tab>
        <Tab>{I18n.t('map.index.transitions.title')}</Tab>
        <Tab>{I18n.t('map.index.quality.title')}</Tab>
      </TabList>
      <TabPanel>
        <CoverageControl
          {...mapProps}
          territory={territory}
          year={year}
          classifications={classifications}
          onTerritoryChange={onTerritoryChange}
          loadTerritories={loadTerritories}
        />
      </TabPanel>
      <TabPanel>
        <TransitionsControl
          {...mapProps}
          transition={transition}
          transitions={transitions}
          classifications={classifications}
          territory={territory}
          years={years}
          onExpandMatrix={onExpandMatrix}
          onTerritoryChange={onTerritoryChange}
          loadTerritories={loadTerritories}
          onTransitionsLoad={onTransitionsLoad}
          setTransition={setTransition}
        />
      </TabPanel>
      <TabPanel>
        <QualityControl
          {...mapProps}
          cards={cards}
          territory={territory}
          year={year}
          classifications={classifications}
          qualities={qualities}
          qualityInfo={qualityInfo}
          onTerritoryChange={onTerritoryChange}
          loadTerritories={loadTerritories}
        />
      </TabPanel>
    </Tabs>
  );
};

export default MainMenu;