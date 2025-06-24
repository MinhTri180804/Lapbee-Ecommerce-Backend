export interface ITimestamp {
  createdAt: Date;
  updatedAt: Date;
}

export type TreeNode<T> = T & {
  children?: TreeNode<T>[];
};
