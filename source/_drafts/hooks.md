<!--
 * @Author: your name
 * @Date: 2021-07-28 14:21:28
 * @LastEditTime: 2021-07-28 14:21:49
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /droplets/source/_drafts/hooks.md
-->

```typescript
import { useEffect, useRef } from 'react';
import { isEqual } from 'lodash';

const deepCompareEquals = (a: any, b: any) => {
  return isEqual(a, b);
};

const useDeepCompareMemoize = (value: any) => {
  const ref = useRef();
  if (!deepCompareEquals(value, ref.current)) {
    ref.current = value;
  }
  return ref.current;
};
/**
 * effect依赖深拷贝对比
 * @param effect
 * @param deps
 */
const useDeepCompareEffect: typeof useEffect = (callback: any, dependencies: any) => {
  useEffect(callback, useDeepCompareMemoize(dependencies));
};

export default useDeepCompareEffect;
```
