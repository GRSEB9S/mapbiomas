import _ from 'underscore';
import lodash from 'lodash';

export class Classifications {
  constructor(classifications) {
    this.classifications = classifications;
  }

  findById(id) {
    return this.classifications.find((classification) => {
      return classification.id === id;
    });
  }

  toOptions() {
    let result = [];
    let tree = this.buildTree();
    let index = 1;

    const label = (index, parentSummary) => {
      return parentSummary ? `${parentSummary}.${index}` : index;
    }

    const buildOption = (classification, index, parentSummary) => {
      result.push({
        label: `${label(index, parentSummary)} ${classification.name}`,
        color: classification.color,
        value: classification.id,
        summary: label(index, parentSummary)
      });

      if (classification.children) {
        let childrenIndex = 1;

        _.each(classification.children, (c) => {
          parent = result.find((c) => c.value == classification.id);

          buildOption(c, childrenIndex++, parent.summary)
        });
      }
    }

    _.each(tree, (node) => {
      buildOption(node, index++);
    })

    return result;
  }

  getTreeIds(obj = this.buildTree(), ids = []) {
    return lodash.toPairs(obj).reduce((ids, [id, child]) => {
      ids.push(lodash.toNumber(id))
      return this.getTreeIds(child.children, ids)
    }, ids)
  }

  buildTree(idProp = 'id', parentIdProp = 'parentId') {
    const parsedOptions = _.map(this.classifications, (item) => ({
      ...item,
      parentId: (
        item.l3 !== item.id ? item.l3 : (
          item.l2 !== item.id ? item.l2 : (
            item.l1 !== item.id ? item.l1 : (
              null
            )
          )
        )
      )
    }));

    const tree = _.memoize((idProp = 'id', parentIdProp = 'parentId') => {
      const { tree, _map } = _.reduce(parsedOptions, (acc, node) => {
       const obj = {...node, children: {}};
        acc.tree[node[idProp]] = obj;
        acc._map[node[idProp]] = obj;
        return acc;
      }, { tree: {}, _map: {} });

      _.each(_map, (node, id) => {
        if(node[parentIdProp]) {
          delete tree[node[idProp]];

          if(_map[node[parentIdProp]]) {
            _map[node[parentIdProp]].children[node[idProp]] = node;
          }
        }
      });

      return tree;
    });

    return _.indexBy(tree(), 'id');
  }
}
