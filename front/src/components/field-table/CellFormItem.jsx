import React, { useState, useRef, useCallback, useEffect } from 'react';
import { FormItem } from '@ra-lib/admin';
import s from './CellFormItem.less';
import theme from 'src/theme.less';

export default function CellFormItem(props) {
    const {
        showForm,
        name,
        type,
        form,
        placeholder,
        renderCell = value => value,
        style,
        required,
        ...others
    } = props;

    const value = form.getFieldValue(name);

    const rootRef = useRef(null);
    const stRef = useRef(null);
    const [_showForm, setShowForm] = useState(false);
    useEffect(() => setShowForm(showForm), [showForm]);

    const handleMouseEnter = useCallback(() => {
        stRef.current && clearTimeout(stRef.current);
        setShowForm(true);
    }, []);
    const handleMouseLeave = useCallback(() => {
        if (props.showForm) return;
        others.options ? stRef.current = setTimeout(() => {
            setShowForm(false);
        }, 300) : setShowForm(false);

        return () => stRef.current && clearTimeout(stRef.current);
    }, [others.options, props.showForm]);

    return (
        <div
            className={[s.root, required && s.required]}
            ref={rootRef}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {_showForm ? (
                <FormItem
                    type={type}
                    name={name}
                    style={{ width: '100%', ...style }}
                    required={required}
                    placeholder={placeholder}
                    {...others}
                />
            ) : (
                <div
                    className={[s[type], (!value || !value.length) && s.placeholder]}
                >
                    <div className={s.value}>{renderCell(value) || placeholder}</div>
                    {type === 'select' && (
                        <span
                            className={`${theme.antPrefix}-select-arrow`}
                            unselectable="on"
                            aria-hidden="true"
                            style={{ userSelect: 'none' }}
                        >
                            <span
                                role="img"
                                aria-label="down"
                                className={`anticon anticon-down ${theme.antPrefix}-select-suffix`}
                            >
                                <svg
                                    viewBox="64 64 896 896"
                                    focusable="false"
                                    data-icon="down"
                                    width="1em"
                                    height="1em"
                                    fill="currentColor"
                                    aria-hidden="true"
                                >
                                    <path d="M884 256h-75c-5.1 0-9.9 2.5-12.9 6.6L512 654.2 227.9 262.6c-3-4.1-7.8-6.6-12.9-6.6h-75c-6.5 0-10.3 7.4-6.5 12.7l352.6 486.1c12.8 17.6 39 17.6 51.7 0l352.6-486.1c3.9-5.3.1-12.7-6.4-12.7z" />
                                </svg>
                            </span>
                        </span>
                    )}
                </div>
            )}
        </div>
    );
}
