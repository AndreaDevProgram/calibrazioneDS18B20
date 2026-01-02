import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from "vite-plugin-singlefile"

export default defineConfig(() => {
  // Controlliamo se la variabile d'ambiente è impostata
  const isSingleFile = process.env.SINGLE_FILE === 'true';

  return {
    base: './',
    plugins: [
      react({
        babel: {
          plugins: [['babel-plugin-react-compiler']],
        },
      }),
      // Carica il plugin solo se richiesto
      isSingleFile ? viteSingleFile() : null,
    ].filter(Boolean), // Rimuove eventuali plugin nulli
    
    server: {
      host: true
    },

    build: {
      // SCELTA DELLA CARTELLA DI OUTPUT
      // Se è per ESP32 usa 'dist-esp32', altrimenti la classica 'dist'
      outDir: isSingleFile ? 'dist-esp32' : 'dist',

      // Configurazione condizionale per ESP32
      target: isSingleFile ? "esnext" : "es2020",
      assetsInlineLimit: isSingleFile ? 100000000 : 4096,
      cssCodeSplit: !isSingleFile,
      
      // Opzionale: pulisce la cartella prima di ogni build
      emptyOutDir: true,
    }
  }
})