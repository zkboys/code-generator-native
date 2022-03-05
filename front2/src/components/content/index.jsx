import { useRef, useState, useEffect, forwardRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Spin } from 'antd';
import classNames from 'classnames';
import { useHeight } from 'src/hooks';
import s from './style.module.less';

const Content = forwardRef((props, ref) => {
  let {
    fitHeight = false,
    className = '',
    style = {},
    loading: propsLoading = false,
    isRoot = false,
    offsetHeight = 0,
    children,
    otherHeight = 8,
    loadingTip,
    ...others
  } = props;

  const rootRef = useRef(null);
  let [height] = useHeight(rootRef, otherHeight || 0);
  const [loadingStyle, setLoadingStyle] = useState({});
  const [loading, setLoading] = useState(propsLoading);
  height -= offsetHeight;


  // 计算loading的样式，无论是否出现滚动，loading始终覆盖PageContent可视区域
  const handleSetLoadingStyle = useCallback(() => {
    if (!loading) {
      setLoadingStyle({ display: 'none' });
      return;
    }

    let { left, top, width, height } = rootRef.current.getBoundingClientRect();

    // margin部分也遮住
    const computedStyle = window.getComputedStyle(rootRef.current);
    const marginLeft = window.parseInt(computedStyle.getPropertyValue('margin-left') || '0px', 10);
    const marginTop = window.parseInt(computedStyle.getPropertyValue('margin-top') || '0px', 10);
    const marginRight = window.parseInt(computedStyle.getPropertyValue('margin-right') || '0px', 10);
    const marginBottom = window.parseInt(computedStyle.getPropertyValue('margin-bottom') || '0px', 10);
    left -= marginLeft;
    width = width + marginLeft + marginRight;
    top -= marginTop;
    height = height + marginTop + marginBottom;

    // body如果有滚动，算上body滚动偏移量
    top += (document.documentElement.scrollTop || document.body.scrollTop || 0);

    // 如果PageContent高度超过了窗口，只遮住可视范围
    const windowHeight = document.documentElement.clientHeight;
    let bottom = 'auto';
    if (height > windowHeight) {
      bottom = 0;
      height = 'auto';
    }

    setLoadingStyle({
      top,
      left,
      bottom,
      display: 'flex',
      width,
      height,
    });
  }, [loading]);

  // 多次连续设置loading时，保值loading不间断显示
  useEffect(() => {
    if (propsLoading) {
      setLoading(true);
      return null;
    }
    const timer = setTimeout(() => {
      setLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, [propsLoading]);

  useEffect(() => {
    handleSetLoadingStyle();
  }, [loading, height, handleSetLoadingStyle]);


  return (
    <>
      <div className={s.loading} style={loadingStyle}>
        <Spin spinning={loading} tip={loadingTip} />
      </div>
      <div
        ref={rootDom => {
          rootRef.current = rootDom;
          // @ts-ignore
          // eslint-disable-next-line no-param-reassign
          if (ref) ref.current = rootDom;
        }}
        className={classNames(s.root, className)}
        style={{
          height: fitHeight ? height : '',
          minHeight: isRoot ? height : '',
          ...style,
        }}
        {...others}
      >
        {children}
      </div>
    </>
  );
});

Content.propTypes = {
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

export default Content;
