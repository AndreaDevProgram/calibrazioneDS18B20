import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { FlexLayout } from '../component/FlexLayout.tsx'
import {Grafico} from '../component/Grafico.tsx'
import '../css/style.css'
import { ParametriProvider } from './ParametriRettaContex.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <FlexLayout
      flexDirection='column'
      flexWrap='wrap'
      justifyContent='start'
      alignItems='center'
      gap='10px'
      width='100vw'
      margin='0 auto'
      borderRadius='3px'
      borderColor='red'
      borderStyle='solid'
      borderWidth='1px'
    >
    <ParametriProvider>
      <Grafico
      titolo='calibrazione sensore temperatura'
      titoloAsseX='td [°C]'
      titoloAsseY='tr [°C]'
      colorePunti='rgba(72, 224, 255, 1)'
      punto={{x:0, y:0}}
      >
      </Grafico>
    </ParametriProvider>
        <ParametriProvider>
      <Grafico
      titolo='calibrazione sensore temperatura'
      titoloAsseX='td [°C]'
      titoloAsseY='tr [°C]'
      colorePunti='rgba(72, 224, 255, 1)'
      punto={{x:0, y:0}}
      >
      </Grafico>
    </ParametriProvider>
    </FlexLayout>
  </StrictMode>,
)
