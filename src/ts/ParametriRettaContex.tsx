import { createContext, useContext, useState, type ReactNode } from "react";

interface ParametriContextType{
    m: string;
    q: string;
    setM: (m: string) => void;
    setQ: (q: string) => void;
}

const ParametriContext = createContext<ParametriContextType|undefined>(undefined);

export const ParametriProvider = ({children}:{children: ReactNode})=>{
    const [m, impostaM] = useState('0');
    const [q, impostaQ] = useState('0');

    const setM = (m: string) => {
        impostaM(m);
    };

    const setQ = (q: string) => {
        impostaQ(q);
    };

    return(<>
        <ParametriContext.Provider value={{m, q, setM, setQ}}>{children}</ParametriContext.Provider>            
    </>);
};

export const useParametriFitLineare = () => {
    const contesto = useContext(ParametriContext);
    if(!contesto){
        throw new Error("useParametri deve essere usato dentro un ParametriProvider");
    }
    return contesto;
};