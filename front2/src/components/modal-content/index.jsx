import React, { forwardRef, useRef, useState, useContext, useEffect } from 'react';
import { Button, Spin, ConfigProvider } from 'antd';
import PropTypes from 'prop-types';
import { useHeight } from 'src/hooks';

const ModalContent = forwardRef((props, ref) => {
  const antdContext = useContext(ConfigProvider.ConfigContext);
  const prefixCls = '';
  const antdPrefixCls = antdContext.getPrefixCls();

  let {
    children,
    loading: propsLoading = false,
    style = {},
    bodyStyle = {},
    fitHeight = false,
    okHtmlType = '',
    onOk = () => undefined,
    onCancel = () => undefined,
    otherHeight,
    loadingTip,
    fullScreen,
    footer,
    okText,
    cancelText,
    ...others
  } = props;

  const [loading, setLoading] = useState(propsLoading);

  let defaultOtherHeight = 50;
  if (fullScreen) {
    defaultOtherHeight = 0;
    fitHeight = true;
  }

  const rootRef = useRef(null);
  const [height] = useHeight(rootRef, otherHeight || defaultOtherHeight);

  const outerStyle = {
    display: 'flex',
    flexDirection: 'column',
    height: fitHeight ? height : 'auto',
    ...style,
  };

  // 多次连续设置loading时，保值loading不间断显示
  useEffect(() => {
    if (propsLoading) {
      setLoading(true);
    } else {
      let timer = setTimeout(() => {
        setLoading(false);
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [propsLoading]);

  return (
    <Spin spinning={loading} tip={loadingTip}>
      <div
        className={`${prefixCls}-modal-content`}
        ref={rootDom => {
          rootRef.current = rootDom;
          // @ts-ignore
          // eslint-disable-next-line no-param-reassign
          if (ref) ref.current = rootDom;
        }}
        style={outerStyle}
        {...others}
      >
        <div
          className={`${prefixCls}-modal-content-inner`}
          style={{ flex: 1, padding: 16, overflow: (fitHeight || fullScreen) ? 'auto' : '', ...bodyStyle }}
        >
          {children}
        </div>
        {footer !== false ? (
          <div className={`${antdPrefixCls}-modal-footer`} style={{ flex: 0 }}>
            {footer || (
              <>
                <Button type="primary" onClick={onOk} htmlType={okHtmlType}>{okText}</Button>
                <Button onClick={onCancel}>{cancelText}</Button>
              </>
            )}
          </div>
        ) : null}
      </div>
    </Spin>
  );
});

ModalContent.propTypes = {
  children: PropTypes.node,
  prefixCls: PropTypes.string,
  // 是否全屏
  fullScreen: PropTypes.bool,
  // 是否使用屏幕剩余空间
  fitHeight: PropTypes.bool,
  // 除了主体内容之外的其他高度，用于计算主体高度；
  otherHeight: PropTypes.number,
  // 是否加载中
  loading: PropTypes.bool,
  // 加载中提示文案
  loadingTip: PropTypes.node,
  // 底部 默认 确定、取消
  footer: PropTypes.node,
  // 确定按钮类型
  okHtmlType: PropTypes.string,
  // 确定按钮文案
  okText: PropTypes.string,
  // 确定事件
  onOk: PropTypes.func,
  // 取消按钮文案
  cancelText: PropTypes.string,
  // 取消事件
  onCancel: PropTypes.func,
  // 最外层容器样式
  style: PropTypes.object,
  // 内容容器样式
  bodyStyle: PropTypes.object,
};

export default ModalContent;
