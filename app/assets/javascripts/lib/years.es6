class Years {
  constructor(years) {
    this.years = years;
  }

  toOptions() {
    return this.years.map((year) => {
      return {
        label: year.name,
        value: year.id
      };
    });
  }
}
