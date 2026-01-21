import type { PropsWithChildren } from 'react';
import { Children } from 'react';
import { tocAnchorSelector } from './PageTOCLayout.constants';

export function extractChildrenText(
  children: PropsWithChildren<{}>['children'],
): string {
  if (Children.count(children) === 1 && typeof children === 'string') {
    return children;
  }
  const extractedChildren = Children.map(
    children,
    (child) => {
      if (
        child === undefined
        || child == null
      ) {
        return undefined;
      }
      if (typeof child === 'string') {
        return child;
      }
      if (
        typeof child === 'number'
        || typeof child === 'bigint'
        || typeof child === 'boolean'
      ) {
        return `${child}`;
      }
      if (!('props' in child!) || !('children' in (child!.props as any))) {
        return undefined;
      }
      if (
        (Children.count((child.props as any).children) === 1)
        && typeof (child.props as any).children === 'string'
      ) {
        return (child.props as any).children;
      }
      return extractChildrenText((child.props as any).children);
    },
  );
  if (!extractedChildren) {
    return '';
  }
  return extractedChildren.filter(Boolean).join(' ');
}

export function extractToc(
  children: PropsWithChildren<{}>['children'],

): any {
  if (
    typeof children === 'string'
    || typeof children === 'number'
    || typeof children === 'bigint'
    || typeof children === 'boolean'
  ) {
    return undefined;
  }
  return Children.map(
    children,
    (child) => {
      if (
        typeof child === 'string'
        || typeof child === 'number'
        || typeof child === 'bigint'
        || typeof child === 'boolean'
      ) {
        return undefined;
      }
      if ('props' in child! && 'children' in (child!.props as any)) {
        return extractToc((child!.props as any).children);
      }
      return undefined;
    },
  ) as any;
}