import * as React from 'react';
import { useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';
import { Link } from "react-router-dom";
import style from './style.css'
import Button from '@mui/material/Button';


export default function Inicio() {

    useEffect(() => {
    }, [])



    return (
        <>
            <div className='TituloInicio'>
                <h1>
                    PRACTICA No. 3
                </h1>
                <Typography variant="body1" gutterBottom>
                    Haz clic en el botón para comenzar a monitoriar la memoria RAM y los procesos del CPU.
                </Typography>
            </div>
            <div className="Boton">
                <Link className={"navText"} to={"/procesos"}>
                    <Button variant="contained" size="large" color='error' >
                        MONITOREO RECURSOS
                    </Button>
                </Link>
            </div>

        </>
    );
}
