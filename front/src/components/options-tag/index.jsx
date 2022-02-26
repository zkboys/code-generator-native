import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { Tag } from 'antd';
import stringToColor from 'string-to-color';
import s from './style.less';

function OptionsTag(props) {
    const { options = [], value = [], onChange } = props;

    const handleClick = useCallback(label => {
        const isSelected = value.includes(label);
        const nextValue = [...value];
        if (isSelected) {
            nextValue.splice(nextValue.indexOf(label), 1);
        } else {
            nextValue.push(label);
        }

        onChange && onChange(nextValue);
    }, [value, onChange]);

    return (
        <div>
            {options.map(label => {
                const isSelected = value.includes(label);

                let color = stringToColor(label);

                if (label.includes('删除')) color = '#ff0000';

                return (
                    <Tag
                        className={s.tag}
                        key={label}
                        color={isSelected ? color : '#bbbbbb'}
                        onClick={() => handleClick(label)}
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
