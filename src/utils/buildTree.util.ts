import { TreeNode } from '../types/commons.type.js';
type KeyOfObject<T extends object> = keyof T;

export const buildTree = <T extends object & { children?: T[] }>(
  flatList: T[],
  idField: KeyOfObject<T>,
  parentIdField: KeyOfObject<T>
): TreeNode<T>[] => {
  const map = new Map();
  const tree: TreeNode<T>[] = [];

  for (const node of flatList) {
    if (!node.children) {
      node.children = [];
      map.set(String(node[idField]), node);
    }
  }

  for (const node of flatList) {
    const parentId = String(node[parentIdField]);
    if (parentId !== 'null') {
      const parentNode = map.get(parentId) as T | null;
      if (parentNode) {
        parentNode.children!.push(node);
        continue;
      }
    }

    tree.push(node);
  }

  return tree as TreeNode<T>[];
};

export class BuildTree<T extends object & { children?: T[] }> {
  private _flatList: T[];
  private _idFiled: KeyOfObject<T>;
  private _parentIdField: KeyOfObject<T>;
  private _map = new Map();
  private _tree: TreeNode<T>[] = [];

  constructor(flatList: T[], idField: KeyOfObject<T>, parentIdField: KeyOfObject<T>) {
    this._flatList = flatList;
    this._idFiled = idField;
    this._parentIdField = parentIdField;
  }

  private _nodeWithChildren() {
    for (const node of this._flatList) {
      node.children = [];

      this._map.set(String(node[this._idFiled]), node);
    }
  }

  private _nodeWithTree() {
    for (const node of this._flatList) {
      const parentId = String(node[this._parentIdField]);
      if (parentId !== 'null') {
        const parentNode = this._map.get(parentId) as T;
        if (parentNode) {
          parentNode.children!.push(node);
          continue;
        }
      }

      this._tree.push(node);
    }
  }

  public sortTree(nodes: TreeNode<T>[], keySort: KeyOfObject<T>) {
    nodes.sort((a, b) => {
      if (a[keySort] > b[keySort]) return 1;
      if (a[keySort] < b[keySort]) return -1;
      return 0;
    });

    for (const node of nodes) {
      if (node.children && node.children.length > 0) {
        this.sortTree(node.children, keySort);
      }
    }

    return this._tree;
  }

  public getTree() {
    this._nodeWithChildren();
    this._nodeWithTree();

    return this._tree;
  }
}
