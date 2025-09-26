import * as React from 'react';
import { emphasize, styled } from '@mui/material/styles';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Chip from '@mui/material/Chip';
import { Link } from 'react-router-dom';

const StyledBreadcrumb = styled(Chip)(({ theme }) => {
    const backgroundColor =
        theme.palette.mode === 'light'
            ? theme.palette.grey[100]
            : theme.palette.grey[800];
    return {
        backgroundColor,
        height: theme.spacing(4),
        padding: theme.spacing(0.5),
        color: theme.palette.text.primary,
        fontWeight: theme.typography.fontWeightRegular,
        '&:hover, &:focus': {
            backgroundColor: emphasize(backgroundColor, 0.06),
        },
        '&:active': {
            boxShadow: theme.shadows[1],
            backgroundColor: emphasize(backgroundColor, 0.12),
        },
    };
});

const CustomBreadcrumbs = ({ items }) => {
    return (
        <div>
            <Breadcrumbs aria-label="breadcrumb" sx={{ marginBottom: 2 }}>
                {items.map((ele) => (
                    <Link key={ele.label} to={ele.href} style={{ textDecoration: 'none' }}>
                        <StyledBreadcrumb
                            sx={{ cursor: 'pointer' }}
                            label={ele.label}
                            icon={ele.icon}
                        />
                    </Link>
                ))}
            </Breadcrumbs>
        </div>
    );
};

export default CustomBreadcrumbs;