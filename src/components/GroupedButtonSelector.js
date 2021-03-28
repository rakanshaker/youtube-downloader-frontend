import {
    MenuItem,
    Select,
    makeStyles,
    InputLabel,
    FormControl,
} from '@material-ui/core';
import { useState } from 'react';

const useStyles = makeStyles((theme) => ({
    item: {
        paddingLeft: 3 * theme.spacing(2),
    },
    group: {
        fontWeight: theme.typography.fontWeightMedium,
        opacity: 1,
    },
}));

const GroupedButtonSelector = ({
    groupedOptions,
    onItemChange,
    selectorId,
}) => {
    const classes = useStyles();
    console.log(groupedOptions);

    const renderGroupedItems = (items) => {
        return (
            <Select
                value={
                    selectorId
                        ? selectorId
                        : `${groupedOptions[0].records[0].format_id}`
                }
                color="secondary"
                className={classes.select}
                labelId="format-selector"
            >
                {items.map((group) => {
                    return [
                        <MenuItem disabled className={classes.group}>
                            {group.groupName}
                        </MenuItem>,
                        ...group.records.map((item) => {
                            return (
                                <MenuItem
                                    value={item.format_id}
                                    className={classes.item}
                                    key={item.format_id}
                                    onClick={onItemChange}
                                >
                                    {`${item.format_note} ${item.ext}`}
                                </MenuItem>
                            );
                        }),
                    ];
                })}
            </Select>
        );
    };
    return renderGroupedItems(groupedOptions);
};

export default GroupedButtonSelector;
