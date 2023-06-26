import * as React from 'react';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

export function Card({title, value}){
    return (
        <React.Fragment>
            <CardContent sx={{ backgroundColor: '#00B650' }}>
                <Typography sx={{ mb: 2.5, alignContent: 'center' }} variant="h5" color="black">
                    {title.toUpperCase()}
                </Typography>
                <Typography variant="h4" color="black">
                    {value}  
                </Typography>
            </CardContent>
        </React.Fragment>
    );
}