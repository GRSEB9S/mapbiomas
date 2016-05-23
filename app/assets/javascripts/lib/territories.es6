import _ from 'underscore';

export class Territories {
  constructor(territories) {
    this.territories = territories;
  }

  withOptions() {
    return this.territories.map((territory) => {
      return _.extend(territory, {
        label: `${territory.name} (${territory.category})`,
        value: territory.id
      });
    });
  }
}
