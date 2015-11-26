class TransitionsMatrix extends React.Component {
  get colSpan() {
    return this.props.classifications.length + 1;
  }

  get rowSpan() {
    return this.props.classifications.length + 1;
  }

  renderToClassifications() {
    return this.props.classifications.map((c) => {
      let transition = this.props.transitions.find((t) => t.to == c.id);

      let classes = classNames(
        'to-classification',
        {
          highlight: c === _.last(this.props.classifications) ? true : !!transition
        }
      );

      return (
        <td key={`to-${c.id}`} className={classes}>
          {c.name}
        </td>
      );
    });
  }

  renderFromClassifications() {
    return this.props.classifications.map((c, i) => {
      let transition = this.props.transitions.find((t) => t.from == c.id);

      let classes = classNames(
        'from-classification',
        {
          highlight: c === _.last(this.props.classifications) ? true : !!transition
        }
      );

      if(i == 0) {
        var fromYearColumn = (
          <td rowSpan={this.rowSpan} className="from-year">
            {this.props.years[0]}
          </td>
        );
      }

      return (
        <tr key={`from-${c.id}`}>
          {fromYearColumn}
          <td className={classes}>
            {c.name}
          </td>
          {this.renderData(c)}
        </tr>
      );
    });
  }

  renderData(fromClassification) {
    let lastClassification = _.last(this.props.classifications);

    return this.props.classifications.map((toClassification) => {
      let transition = this.props.matrixTransitions.find((t) => {
        return t.to == toClassification.id && t.from == fromClassification.id;
      });
      let key = `transition-${toClassification.id}-${fromClassification.id}`;

      if(transition) {
        if (fromClassification === lastClassification || toClassification === lastClassification) {
          return (
            <td key={key} className="transition-value highlight">
              {Highcharts.numberFormat(transition.area, 0, '.')} ha
            </td>
          );
        } else {
          return (
            <td key={key} className="transition-value highlight">
              {Highcharts.numberFormat(transition.area, 0, '.')} ha
              ({transition.percentage}%)
            </td>
          );
        }
      } else {
        return <td key={key} className="transition-value">--</td>
      }
    });
  }

  render() {
    return (
      <table className="transitions-matrix">
        <tbody>
          <tr>
            <td></td>
            <td></td>
            <td colSpan={this.colSpan} className="to-year">
              {this.props.years[1]}
            </td>
          </tr>
          <tr>
            <td></td>
            <td></td>
            {this.renderToClassifications()}
          </tr>
          {this.renderFromClassifications()}
        </tbody>
      </table>
    );
  }
}
