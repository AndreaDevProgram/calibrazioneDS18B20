import {Chart, registerables, type ChartConfiguration, type ChartData, type ChartDataset} from 'chart.js';
import { useEffect, useRef, useState } from "react";
import { FlexLayout } from './FlexLayout.tsx';
import { FitLineareManuale } from './FitLineareManuale.tsx';
import { useParametriFitLineare } from '../ts/ParametriRettaContex.tsx';

Chart.register(...registerables);

interface GraficoProps{
    titolo?: string;
    titoloAsseX?: string;
    titoloAsseY?: string;
    width?: string;
    height?: string;
    colorePunti: string;
    punto: {x: number, y: number};
};



function Grafico(props: GraficoProps){

    const chartRef = useRef<Chart>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const {m} = useParametriFitLineare();
    const {q} = useParametriFitLineare();
    const [punti, setPunti] = useState<{x: number, y: number}[]>([]);


    useEffect(()=>{
        if(!canvasRef.current)return;

        let dataset: ChartDataset[] = [{
            label:'temperatura',
            type:'scatter',
            data: punti,
            pointBackgroundColor: props.colorePunti,
            pointRadius: 6,
            animation: false,
            showLine: false
        },
        {
            label:'Fit Lineare',
            type:'scatter',
            data:[
                {x: -1000, y: Number(m) * -1000 + Number(q)},
                {x: 1000, y: Number(m) * 1000 + Number(q)}
            ],
            pointRadius: 0,
            showLine: true,
            animation: false,
            borderColor: 'red',
            borderWidth: 2
        }];

        let datasetArray: ChartData = {datasets: dataset};
        let config: ChartConfiguration = {
            type:'scatter',
            data: datasetArray,
            options:{
                responsive: true,
                maintainAspectRatio: false,
                scales:{
                    x:{
                        type:'linear',
                        position:'bottom',
                        min: -20,
                        max: 150,
                        title:{
                            display: true,
                            text:props.titoloAsseX,
                            color: 'white'
                        },
                        ticks:{
                            color: 'white'
                        },
                        grid:{
                            color: 'white'
                        }
                    },
                    y:{
                        type:'linear',
                        position:'left',
                        min: -20,
                        max: 150,
                        title:{
                            display: true,
                            text:props.titoloAsseY,
                            color: 'white'
                        },
                        ticks:{
                            color: 'white'
                        },
                        grid:{
                            color: 'white'
                        }
                    }
                },
                plugins:{
                    title:{
                        display: true,
                        text: props.titolo,
                        color: 'white'
                    },
                    legend:{
                        display: true,
                        position:'right',
                        align:'start',
                        title:{
                            display: false,
                            text: 'Legenda',
                            color: 'white'
                        },
                        labels:{
                            color: 'white'
                        }
                    }
                }
            }
        };
        
        chartRef.current = new Chart(canvasRef.current, config);
        
        return ()=>{
            if(chartRef.current){
                chartRef.current.destroy();
            }
        };
    },[]);

    // Effetto per aggiornare la retta quando m o q cambiano
    useEffect(() => {
        if (chartRef.current) {
            const mNum = Number(m);
            const qNum = Number(q);
            
            // Definiamo i limiti dell'area visibile (devono coincidere con min/max delle scale)
            const minX = -20;
            const maxX = 150;
            const minY = -20;
            const maxY = 150;

            const points: {x: number, y: number}[] = [];

            // 1. Calcoliamo l'intersezione con il bordo sinistro (x = minX)
            const yAtMinX = mNum * minX + qNum;
            if (yAtMinX >= minY && yAtMinX <= maxY) {
                points.push({x: minX, y: yAtMinX});
            }

            // 2. Calcoliamo l'intersezione con il bordo destro (x = maxX)
            const yAtMaxX = mNum * maxX + qNum;
            if (yAtMaxX >= minY && yAtMaxX <= maxY) {
                points.push({x: maxX, y: yAtMaxX});
            }

            // 3. Calcoliamo l'intersezione con il bordo inferiore (y = minY)
            // x = (y - q) / m
            if (mNum !== 0) {
                const xAtMinY = (minY - qNum) / mNum;
                // Usiamo > e < stretto per evitare duplicati se l'intersezione è esattamente sull'angolo
                if (xAtMinY > minX && xAtMinY < maxX) {
                    points.push({x: xAtMinY, y: minY});
                }
            }

            // 4. Calcoliamo l'intersezione con il bordo superiore (y = maxY)
            if (mNum !== 0) {
                const xAtMaxY = (maxY - qNum) / mNum;
                if (xAtMaxY > minX && xAtMaxY < maxX) {
                    points.push({x: xAtMaxY, y: maxY});
                }
            }

            // Ordiniamo i punti per x per disegnare il segmento correttamente
            points.sort((a, b) => a.x - b.x);

            // Aggiorniamo i dati del dataset della retta (indice 1)
            chartRef.current.data.datasets[1].data = points;
            chartRef.current.update();
        }
    }, [m, q]);

    // Effetto per aggiornare i punti del grafico quando l'array 'punti' cambia
    useEffect(()=>{
        if (chartRef.current) {
            chartRef.current.data.datasets[0].data = punti;
            chartRef.current.update();
        }
    }, [punti]);


    return<>
            <FlexLayout
                flexDirection='column'
                flexWrap='wrap'
                justifyContent='center'
                alignItems='center'
                gap='10px'
                width='80%'
            >
                <div style={{width:'100%', height:props.height}} className='altezza-grafico-pc altezza-grafico-tablet altezza-grafico-mobile'>
                    <canvas ref={canvasRef}></canvas>
                </div>
                <FlexLayout
                    flexDirection='row'
                    flexWrap='wrap'
                    justifyContent='start'
                    alignItems='start'
                    gap='10px'
                >
                    <button id='btnAggiungi' onClick={()=>{AggiornaGrafico(setPunti, false)}}>Aggiungi</button>
                    <button id='btnRimuovi' onClick={()=>{AggiornaGrafico(setPunti, true)}}>Rimuovi</button>
                    <input id='inputDatoLetto' type='number'></input>
                </FlexLayout>
                <FitLineareManuale
                    m_min={String(-10)}
                    m_max={String(10)}
                    m_step='0.1'
                    q_min={String(-100)}
                    q_max={String(100)}
                    q_step='0.1'
                ></FitLineareManuale>
            </FlexLayout>
    </>

}

/*
async function AggiungiPunto(impostaPunti: React.Dispatch<React.SetStateAction<{x: number, y: number}[]>>){
    let response = await fetch("http://localhost:3000/temperatura");
    if(response.ok){
        let textInput = document.getElementById('inputDatoLetto') as HTMLInputElement;
        if(textInput.value !== "" && textInput.value !== null){
            let dataTemperatura = await response.json();
            let puntoGrafico: {x: number, y: number} = {x: Number(textInput.value), y:dataTemperatura.temperatura};
            impostaPunti(puntiPrecedenti => [...puntiPrecedenti, puntoGrafico]);
        }        
    }
}*/

async function AggiornaGrafico(impostaPunti: React.Dispatch<React.SetStateAction<{x:number, y:number}[]>>, elimina: boolean) {
    if(!elimina){
        // In sviluppo (PC) usa la porta 3000, in produzione (ESP32) usa il percorso relativo
        const url = import.meta.env.DEV 
            ? `http://${window.location.hostname}:3000/temperatura` 
            : '/temperatura';
        let response = await fetch(url);
        if(response.ok){
            let textInput = document.getElementById('inputDatoLetto') as HTMLInputElement;
            if(textInput.value !== "" && textInput.value !== null){
                let dataTemperatura = await response.json();
                let puntoGrafico: {x: number, y: number} = {x: dataTemperatura.temperatura , y: Number(textInput.value)};
                impostaPunti(puntiPrecedenti => [...puntiPrecedenti, puntoGrafico]);
            }        
        }
    }
    else{
        impostaPunti(prev => [...prev.slice(0, prev.length - 1)]);
    }
}


export {Grafico};
