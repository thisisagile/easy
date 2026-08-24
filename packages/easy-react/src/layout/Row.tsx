import React, { CSSProperties, ReactNode } from 'react';
import { ifDefined, isArray, OneOrMore } from '@thisisagile/easy';
import styles from './Row.module.scss';
import { toClasses } from '../utils';

type Cols = OneOrMore<number>;

export interface RowProps {
  cols?: Cols;
  tabletCols?: Cols;
  mobileCols?: Cols;
  equalHeight?: boolean;
  children?: ReactNode;
}

const toTemplate = (cols?: Cols): string | undefined => ifDefined(cols, c => (isArray(c) ? c.map(n => `${n}fr`).join(' ') : `repeat(${c}, 1fr)`));

export const Row = ({ cols = 1, tabletCols, mobileCols, children, equalHeight = true }: RowProps) => {
  const vars = {
    '--cols': toTemplate(cols),
    '--tablet-cols': toTemplate(tabletCols ?? cols),
    '--mobile-cols': toTemplate(mobileCols ?? tabletCols ?? cols),
  } as CSSProperties;

  return (
    <div className={styles.w}>
      <div className={toClasses(styles, 'r', { equalHeight })} style={vars}>
        {React.Children.map(children, c => (
          <div className={styles.c}>{c as ReactNode}</div>
        ))}
      </div>
    </div>
  );
};
