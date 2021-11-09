import * as React from 'react';
import { FunctionComponent, ReactElement, ReactNode } from 'react';

export interface IfProps {
  condition: any | undefined;
  children?: ReactNode;
}

export const If: FunctionComponent<IfProps> = ({ condition, children }): ReactElement | null => (condition ? <>{children}</> : null);
