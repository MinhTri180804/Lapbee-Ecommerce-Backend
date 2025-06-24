import { createDTO, CreateDTO } from './create.dto.js';
import { getAllDTO, GetAllDTO } from './getAll.dto.js';
import { getDetailsDTO, GetDetailsDTO } from './getDetails.dto.js';
import { updateDTO, UpdateDTO } from './update.dto.js';
import { ICategoryDocument } from './../../../models/category.model.js';
import { TreeNode } from '../../../types/commons.type.js';
import { getAllTreeDTO, GetAllTreeDTO } from './getAllTree.dto.js';
import { z } from 'zod';
export class CategoryResponseDTO {
  constructor() {}

  static create(category: ICategoryDocument) {
    const candidate: CreateDTO = {
      id: String(category._id),
      name: category.name,
      parentId: category.parentId ? String(category.parentId) : null,
      hashChildren: category.hasChildren,
      order: category.order,
      slug: category.slug,
      createdAt: category.createdAt.toISOString(),
      updatedAt: category.updatedAt.toISOString()
    };

    return createDTO.parse(candidate);
  }

  static update(category: ICategoryDocument) {
    const candidate: UpdateDTO = {
      id: String(category._id),
      name: category.name,
      slug: category.slug,
      parentId: category.parentId ? String(category.parentId) : null,
      hashChildren: category.hasChildren,
      order: category.order,
      createdAt: category.createdAt.toISOString(),
      updatedAt: category.updatedAt.toISOString()
    };

    return updateDTO.parse(candidate);
  }
  static getDetails(category: ICategoryDocument) {
    const candidate: GetDetailsDTO = {
      id: String(category._id),
      name: category.name,
      slug: category.slug,
      parentId: category.parentId ? String(category.parentId) : null,
      hashChildren: category.hasChildren,
      order: category.order,
      createdAt: category.createdAt.toISOString(),
      updatedAt: category.updatedAt.toISOString()
    };

    return getDetailsDTO.parse(candidate);
  }

  static getAll(categories: ICategoryDocument[]) {
    const candidate: GetAllDTO = categories.map((category) => ({
      id: String(category._id),
      name: category.name,
      slug: category.slug,
      order: category.order,
      parentId: category.parentId ? String(category.parentId) : null,
      hashChildren: category.hasChildren,
      createdAt: category.createdAt.toISOString(),
      updatedAt: category.updatedAt.toISOString()
    }));

    return getAllDTO.parse(candidate);
  }

  static getAllTree(categoriesTreeNode: TreeNode<ICategoryDocument>[]) {
    const mapTreeNodeToDTO = (node: TreeNode<ICategoryDocument>): z.infer<typeof getAllTreeDTO.element> => {
      return {
        id: String(node._id),
        name: node.name,
        slug: node.slug,
        parentId: node.parentId ? String(node.parentId) : null,
        hasChildren: node.hasChildren,
        createdAt: node.createdAt.toISOString(),
        updatedAt: node.updatedAt.toISOString(),
        children: node.children ? node.children.map(mapTreeNodeToDTO) : [],
        order: node.order
      };
    };

    const candidate: GetAllTreeDTO = categoriesTreeNode.map(mapTreeNodeToDTO);
    return getAllTreeDTO.parse(candidate);
  }
}
