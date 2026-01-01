import type React from "react";
import { FlexLayout } from "./FlexLayout.tsx";
import '../css/StyleFitLineareManuale.css'
import { useParametriFitLineare } from "../ts/ParametriRettaContex.tsx";

interface FitLineareManualeProps{
    m_min: string;
    m_max: string;
    m_step: string;
    q_min: string;
    q_max: string;
    q_step: string;
}


function FitLineareManuale(props: FitLineareManualeProps){

    // Utilizziamo il context per gestire i valori di m e q
    const {m, setM, q, setQ} = useParametriFitLineare();

    let style: React.CSSProperties = {
        width:'80%'
    };

    return (<>
        <FlexLayout
            flexDirection="column"
            flexWrap="wrap"
            justifyContent="center"
            alignItems="center"
            gap="25px"
            width="100%"
            margin="15px 0px 0px 0px"
        >
            <FlexLayout
                flexDirection="row"
                flexWrap="wrap"
                gap="10px"
                justifyContent="start"
                alignItems="start"
                width="100%"
            >
                <label>m:</label>
                <input type="range" step={props.m_step} 
                    min={props.m_min} 
                    max={props.m_max} 
                    style={style as React.CSSProperties}
                    id='inputRangePendenza'
                    value={m}
                    onChange={(e) => setM(e.target.value)}>
                </input>
                <input type='text' readOnly={true} id='inputTextPendenza' value={m}></input>
            </FlexLayout>
            <FlexLayout
                flexDirection="row"
                flexWrap="wrap"
                gap="10px"
                justifyContent="start"
                alignItems="start"
                width="100%"
            >
                <label>q:</label>
                <input type="range" step={props.q_step} 
                    min={props.q_min} 
                    max={props.q_max} 
                    style={style as React.CSSProperties}
                    value={q}
                    onChange={(e) => setQ(e.target.value)}>
                </input>
                <input type='text' readOnly={true} value={q}></input>
            </FlexLayout>
        </FlexLayout>
    </>);
}

export {FitLineareManuale};