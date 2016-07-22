import React from 'react';
import _ from 'underscore';
import { AutoWidth } from 'react-timeline-slider';
import classNames from 'classnames';
import d3 from 'd3';
import d3Sankey from 'd3-sankey';

export class TransitionsChart extends React.Component {
  constructor(props) {
    super(props);
    this.formatNumber = (n) => I18n.toNumber(n, { precision: 0 });
    this.format = (d) => `${this.formatNumber(d)} ha`;
  }

  draw() {
    let element = ReactDOM.findDOMNode(this.refs.element);
    element.innerHTML = '';
    let width = this.props.width,
        height = 350;

    let svg = d3.select(element)
        .append("svg")
        .attr("width", width)
        .attr("height", height+10)
        .append("g")
        .attr("transform", "translate(0, 5)");

    let sankey = d3Sankey.sankey()
        .nodeWidth(12)
        .nodePadding(10)
        .size([width, height]);

    let path = sankey.link();

    sankey
        .nodes(this.props.nodes)
        .links(this.props.links)
        .layout(16);

    let link = svg.append("g")
        .selectAll(".link")
        .data(this.props.links)
        .enter()
        .append("path")
        .attr("class", (d) => {
          if(this.props.transition) {
            var active = (d.source.id == this.props.transition.from
                          && d.target.id == this.props.transition.to);
          }
          return classNames("link", "tooltip", { "link--active": active });
        })
        .attr("d", path)
        .style("stroke-width", (d) => Math.max(8, d.dy))
        .sort((a, b) => b.dy - a.dy)
        .on('click', (d) => {
          this.props.setTransition({
            from: d.source.id,
            to: d.target.id
          })
        });

    link.append("title")
        .text((d) => {
          return (
            `${d.source.name} → ${d.target.name}: ${this.format(d.value)}`
          );
        })

    let node = svg.append("g")
        .selectAll(".node")
        .data(this.props.nodes)
        .enter()
        .append("g")
        .attr("class", "node")
        .attr("transform", (d) => `translate(${d.x}, ${d.y})`)

    node.append("rect")
        .attr("class", "tooltip")
        .attr("height", (d) => d.dy)
        .attr("width", sankey.nodeWidth())
        .style("fill", (d) => d.color)

    node.append("title")
        .text((d) => {
          return (
            `${d.name}: ${this.format(d.value)}`
          );
        })

    node.append("text")
        .attr("x", -6)
        .attr("y", (d) => d.dy / 2)
        .attr("dy", ".35em")
        .attr("text-anchor", "end")
        .attr("transform", null)
        .text((d) => d.name)
        .filter((d) => d.x < width / 2)
        .attr("x", 6 + sankey.nodeWidth())
        .attr("text-anchor", "start");
  }

  componentDidMount() {
    this.draw();
  }

  componentDidUpdate(prevProps) {
    if(!_.isEqual(this.props, prevProps)) {
      this.draw();
    }
  }

  render() {
    return <div ref="element" className="transitions-chart chart sankey"></div>;
  }
}

TransitionsChart = AutoWidth(TransitionsChart);
