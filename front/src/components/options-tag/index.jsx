import React, {useCallback, useEffect} from 'react';
import PropTypes from 'prop-types';
import {Tag} from 'antd';
import stringToColor from 'string-to-color';
import s from './style.less';

function OptionsTag(props) {
    const { options = [], value = [], onChange } = props;

    const handleClick = useCallback((e, label) => {
        e.stopPropagation();
        e.preventDefault();
        const { ctrlKey, metaKey } = e;
        let nextValue = [...value];

        // 全/反选
        if (ctrlKey || metaKey) {
            nextValue = value?.length ? [] : [...options];
        } else {
            value.includes(label) ? nextValue.splice(nextValue.indexOf(label), 1) : nextValue.push(label);
        }

        onChange && onChange(nextValue);
    }, [value, onChange, options]);

    // options改变，修正value内容
    useEffect(() => {
        if (!options?.length) return;
        const nextValue = value.filter(item => options.includes(item));

        // 防止死循环
        if ([...nextValue].sort().join() === [...value].sort().join()) return;

        onChange && onChange(nextValue);
    }, [onChange, options, value]);

    return (
        <div className={s.root}>
            {options.map(label => {
                const isSelected = value.includes(label);

                let color = stringToColor(label);

                if (label.includes('删除')) color = '#ff0000';

                if (label === '详情') color = '#ff8500';

                return (
                    <Tag
                        style={{ margin: 2 }}
                        key={label}
                        color={isSelected ? color : '#bbbbbb'}
                        onClick={(e) => handleClick(e, label)}
                    >
                        {label}
                    </Tag>
                );
            })}
        </div>
    );
}

OptionsTag.propTypes = {
    options: PropTypes.array,
    value: PropTypes.array,
    onChange: PropTypes.func,
};

export default OptionsTag;
