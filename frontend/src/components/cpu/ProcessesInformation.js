import React from "react";
import { Card } from '../commons/Card'

export function ProcessesInformation({totalAmount, runningAmount, sleepingAmount, stoppedAmount, zombieAmount}){
    return(
        <div className="cards">
                <div className="card">
                    <Card title="Procesos" value={totalAmount}/>
                </div>
                <div className="card">
                    <Card title="Ejecutando" value={runningAmount}/>
                </div>
                <div className="card">
                    <Card title="Dormidos" value={sleepingAmount}/>
                </div>
                <div className="card">
                    <Card title="Detenidos" value={stoppedAmount}/>
                </div>
                <div className="card">
                    <Card title="Zombie" value={zombieAmount}/>
                </div>
            </div>
    );
}