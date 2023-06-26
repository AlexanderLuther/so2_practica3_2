import React from "react";
import { Card } from '../commons/Card'

export function AssignmentsInformation({rss, size, percentage}){
    return(
        <div className="cards">
                <div className="card">
                    <Card title="Memoria Residente" value={rss + ' MB'} />
                </div>
                <div className="card">
                    <Card title="Memoria Virtual" value={size + ' MB'} />
                </div>
                <div className="card">
                    <Card title="Porcentaje de Consumo" value={percentage + ' %'} />
                </div>
            </div>
    );
}