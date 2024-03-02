import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  let [count, setCount] = useState(0)
   
    setTimeout(()=>{     
      setCount(count=count+1)
    }, 1000)
  
  return (
    <>
      <h1>hi!</h1>
      <p>{count}</p>
    </>
  )
}

export default App
