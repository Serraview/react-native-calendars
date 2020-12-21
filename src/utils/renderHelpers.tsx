import React, { ReactElement, isValidElement } from 'react';

import { RenderFunction, RenderProp } from './types';

function renderCustom(renderer: RenderProp, props: any): ReactElement | null {
  if (isValidElement(renderer)) {
    const Comp = renderer;
    return <Comp {...props} />;
  }
  if (typeof renderer === 'function')
    return (renderer as RenderFunction)(props);
  return null;
}

export { renderCustom };
