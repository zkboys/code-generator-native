import { forwardRef } from 'react';
import classNames from 'classnames';
import Content from '../content';
import s from './style.module.less';
import PropTypes from 'prop-types';

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


PageContent.propTypes = {
  // 样式类名
  className: PropTypes.string,
  // 适应窗口高度，内容过长，Content会产生滚动条 默认 false
  fitHeight: PropTypes.bool,
  // 计算高度时，额外的高度，默认0，content会撑满全屏
  otherHeight: PropTypes.number,
  // 计算之后，再做偏移的高度
  offsetHeight: PropTypes.number,
  // 样式对象
  style: PropTypes.object,
  // 显示loading 默认 false
  loading: PropTypes.bool,
  // loading的提示文字 默认 context.loadingTip
  loadingTip: PropTypes.node,
  // 样式前缀 默认 context.prefixCls
  prefixCls: PropTypes.string,
  // 是否是页面容器
  isRoot: PropTypes.bool,
  children: PropTypes.node,
};

export default PageContent;
