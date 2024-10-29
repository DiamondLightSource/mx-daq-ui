import { useState } from 'react'
import {Grid2, useTheme} from "@mui/material"
import './App.css'

function App() {
  const theme = useTheme();

  return (
    <Grid2 container spacing={2}>
      <Grid2 size={4} sx={{bgcolor: theme.palette.primary.dark}}>
        <h1>Test</h1>
        <p>Test</p>
      </Grid2>
      <Grid2 size={4} sx={{bgcolor: theme.palette.primary.dark}}>
        <h1>Test</h1>
        <p>Test</p>
      </Grid2>
      <Grid2 size={4} sx={{bgcolor: theme.palette.primary.dark}}>
        <h1>Test</h1>
        <p>Test</p>
      </Grid2>
    </Grid2>
  )
}

export default App
