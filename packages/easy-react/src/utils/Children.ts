import { isDefined, List, toList } from '@thisisagile/easy';
import React, { ReactNode } from 'react';

export const toChildren = (children: ReactNode): List<ReactNode> => toList(React.Children.toArray(children).filter(isDefined));
