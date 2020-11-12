import { dataType } from './util'

// 深度遍历查找目标节点及缓存相关路径
function findTreeNode(tree, id, key) {
  if (tree.id === id) {
    return { path: [], nodes: [], index: [], pathName: [], currentNode: tree }
  }
  if (tree[key] && tree[key].length) {
    let result
    for (let i = 0; i < tree[key].length; i++) {
      result = findTreeNode(tree[key][i], id, key)
      if (result !== undefined) {
        result.nodes.unshift(tree[key][i])
        result.path.unshift(tree[key][i].id)
        result.pathName.unshift(tree[key][i].name)
        result.index.unshift(i)
        return result
      }
    }
  }
  return undefined
}

export function traceTreePath(tree, id, key) {
  const isArray = dataType(tree) === 'Array'
  if (isArray) {
    tree = { id: '-1', name: '树形根结点', [key]: tree }
  }
  let result = findTreeNode(tree, id, key)

  if (result === undefined) {
    return [] // '在该树的中没有相对应的id的节点'
  }

  if (!isArray) {
    result.nodes.unshift(tree)
    result.pathName.unshift(tree.name)
    result.path.unshift(tree.id)
  }
  return result
}
