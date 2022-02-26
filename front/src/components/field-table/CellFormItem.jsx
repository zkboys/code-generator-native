import React, { useState, useRef, useCallback } from 'react';
import { FormItem } from '@ra-lib/admin';
import { OptionsTag } from 'src/components';

export default function CellFormItem(props) {
    const {
        switch: switchForm = true,
        name,
        width,
        form,
        type,
        ...others
    } = props;
    const rootRef = useRef(null);
    const stRef = useRef(null);

    const [showForm, setShowForm] = useState(!switchForm);

    const value = form.getFieldValue(name);
    let label = others.options?.find(item => item.value === value)?.label || value;
    if (type === 'options-tag') {
        label = (
            <OptionsTag
                value={value}
                options={others.options}
            />
        );
    }
    const handleMouseEnter = useCallback(() => {
        if (!switchForm) return;
        stRef.current && clearTimeout(stRef.current);
        setShowForm(true);
    }, [switchForm]);
    const handleMouseLeave = useCallback(() => {
        if (!switchForm) return;
        others.options ? stRef.current = setTimeout(() => {
            setShowForm(false);
        }, 300) : setShowForm(false);

        return () => stRef.current && clearTimeout(stRef.current);
    }, [others.options, switchForm]);
    return (
        <div
            ref={rootRef}
            style={{ width }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {showForm ? (
                <FormItem
                    label=" "
                    type={type}
                    colon={false}
                    name={name}
                    onFocus={e => e.target.select()}
                    // getPopupContainer={() => rootRef.current}
                    {...others}
                />
            ) : (
                <div style={{ height: 32, display: 'flex', alignItems: 'center', paddingLeft: 10 }}>
                    {label}
                </div>
            )}
        </div>
    );
}
