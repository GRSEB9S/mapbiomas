import _ from 'lodash';
import { Classifications } from './classifications';

export class Sankey {
  constructor(classifications, transitions) {
    this.classifications = classifications;
    this.transitions = transitions;

    this.defaultClassificationsObject = new Classifications(classifications);
    this.defaultClassificationsTree = this.defaultClassificationsObject.buildTree();
  }

  defaultClassificationsTreeIds(tree = this.defaultClassificationsTree, ids = []) {
    return _.toPairs(tree).reduce((ids, [id, child]) => {
      ids.push(_.toNumber(id))
      return this.defaultClassificationsTreeIds(child.children, ids)
    }, ids)
  }

  get nodes() {
    let nodes = this.transitions.reduce((memo, transition) => {
      let from = this.defaultClassificationsObject.findById(transition.from);
      let to = this.defaultClassificationsObject.findById(transition.to);

      if(_.isUndefined(from) || _.isUndefined(to)) return memo;
      return memo.concat([
        {
          name: from.name,
          id: from.id,
          type: 'from',
          color: from.color
        },
        {
          name: to.name,
          id: to.id,
          color: to.color,
          type: 'to'
        }
      ]);
    }, []);

    nodes = _.uniqBy(nodes, (n) => [n.type, n.name].join());

    return _.sortBy(nodes, (n) => _.indexOf(this.defaultClassificationsTreeIds(), n.id));
  }

  get links() {
    return this.transitions.map((transition) => {
      let fromIndex = _.findIndex(this.nodes, (n) => {
        return n.id == transition.from && n.type == 'from';
      });
      let toIndex = _.findIndex(this.nodes, (n) => {
        return n.id == transition.to && n.type == 'to';
      });

      if(fromIndex === -1 || toIndex === -1) return;

      return {
        source: fromIndex,
        target: toIndex,
        value: parseFloat(transition.area)
      };
    }).filter((t) => !_.isUndefined(t) && parseFloat(t.value) != 0);
  }
}
