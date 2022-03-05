import { forwardRef } from 'react';
import classNames from 'classnames';
import Content from '../content';
import s from './style.module.less';

const PageContent = forwardRef((props, ref) => {
  let {
    isRoot = true,
    className,
    fitHeight,
    ...others
  } = props;

  const rootClass = classNames(s.root, className);
  return (
    <Content
      className={rootClass}
      fitHeight={fitHeight}
      isRoot={isRoot}
      {...others}
      ref={ref}
    />
  );
});

export default PageContent;
