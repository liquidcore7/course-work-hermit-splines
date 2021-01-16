import React from 'react';
import './App.css';
import { Main } from './view/main';


const NumberOfPoints: number = 1000;


const App = () => (
    <Main numberOfPoints={NumberOfPoints} />
);

export default App;
