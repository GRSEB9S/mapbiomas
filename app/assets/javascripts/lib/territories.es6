class Territories {
  constructor(territories) {
    this.territories = territories;
  }

  toOptions() {
    return this.territories.map((territory) => {
      return {
        label: territory.name,
        value: territory.id
      };
    });
  }
}
