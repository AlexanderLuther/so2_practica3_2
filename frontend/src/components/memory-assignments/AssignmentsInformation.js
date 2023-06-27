import React from "react";
import { Card } from '../commons/Card'

export function AssignmentsInformation({rss, size, percentage}){
    return(
        <div className="stack">
                <div className="cardRow">
                    <Card title="Memoria Residente" value={rss + ' MB'} />
                </div>
                <div className="cardRow">
                    <Card title="Memoria Virtual" value={size + ' MB'} />
                </div>
                <div className="cardRow">
                    <Card title="Porcentaje de Consumo" value={percentage + ' %'} />
                </div>
            </div>
    );
}