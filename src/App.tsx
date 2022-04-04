import React, { useState } from 'react';

import { NormalOperations } from './operations/normal';

import './styles/global.css';
import './styles/calculator.css';

const normalOperations = new NormalOperations();

function App() {
  const [operationHistoric, setOperationHistoric] = useState<string>(''); //Historic of the operation
  const [screenResult, setScreenResult] = useState<string>('0'); // Result in screen
  const [operator, setOperator] = useState<string>(''); // +, -, *, /

  const [showHistoric, setShowHistoric] = useState<boolean>(false);
  const [isAfterOperator, setIsAfterOperator] = useState<boolean>(false);
  const [isAfterResult, setIsAfterResult] = useState<boolean>(false);
  const [hasOperator, setHasOperator] = useState<boolean>(false);

  const operationsSignals = '+-/*';

  function handleAddOperator(operatorSignal: string) {
    if(showHistoric === false) setShowHistoric(true);

    if(operationsSignals.includes(operatorSignal)) {
      if(isAfterResult) {
        let new_historic = `${screenResult} ${operatorSignal}`;
  
        setOperator(operatorSignal);
        setOperationHistoric(new_historic);
        setIsAfterResult(false);
        setIsAfterOperator(true);
        setHasOperator(true);
      }
      else {
        let current_historic = operationHistoric;
        let lastIndex = current_historic[current_historic.length - 1];
  
        let new_historic: string = '';
  
        if(hasOperator) {  
          if(operationsSignals.includes(lastIndex)) {
            new_historic = current_historic.replace(lastIndex, operatorSignal);
    
            setOperationHistoric(new_historic);
            setIsAfterOperator(true);
            setHasOperator(true);
            setOperator(operatorSignal);
          }
          else {
            calculate();
          }
        }
        else {
          new_historic = `${current_historic} ${operatorSignal}`;
  
          setOperationHistoric(new_historic);
          setIsAfterOperator(true);
          setHasOperator(true);
          setOperator(operatorSignal);
        }
      }
    }
  }

  function handleAddNumber(digit: string) {
    let new_result = screenResult;
    let historicDigit = digit;

    console.log(isAfterOperator);
    if(isAfterOperator) {
      new_result = digit;
      historicDigit = ` ${digit}`;

      setIsAfterOperator(false);
      setOperationHistoric(operationHistoric.concat(historicDigit));
    }
    else {
      if(isAfterResult) {
        new_result = digit;

        setOperationHistoric('');
        setOperator('');
    
        setShowHistoric(false);
        setIsAfterResult(false);
        setHasOperator(false);
      }
      else {
        if(new_result === '0' && digit !== '.') {
          new_result = digit;
        } 
        else {
          new_result += digit;
        }

        setOperationHistoric(operationHistoric.concat(historicDigit));
      }
    }

    setScreenResult(new_result);
  }

  function handleRemoveNumber() {
    let current_result = screenResult;
    let canRemoveFromHistoric: boolean = false;

    let new_result: string = '';

    if(isAfterOperator) {
      canRemoveFromHistoric = false;
    }
    else if(current_result.length === 1) {
      if(current_result !== '0') canRemoveFromHistoric = true;
      else canRemoveFromHistoric = false;

      new_result = '0';

      if(hasOperator) {
        setIsAfterOperator(true); 
      }
    }
    else {
      new_result = current_result.slice(0, -1);

      canRemoveFromHistoric = true;
    }

    if(canRemoveFromHistoric) {
      setOperationHistoric(operationHistoric.slice(0, -1));
      setScreenResult(new_result);
    }
  }

  function resetAll() {
    setScreenResult('0');
    setOperationHistoric('');
    setOperator('');

    setShowHistoric(false);
    setIsAfterOperator(false);
    setIsAfterResult(false);
    setHasOperator(false);
  }

  function calculate() {
    let current_historic = operationHistoric.trim();

    if(current_historic !== ' ') {
      let historic_array = current_historic.split(' ');

      if(historic_array.length < 3) {
        return;
      } 
      else {
        let number1 = Number(historic_array[0]);
        let number2 = Number(historic_array[2]);

        let result: number = 0;

        switch (operator) {
          case '+':
            result = normalOperations.sum(number1, number2);
            break;
          case '-':
            result = normalOperations.subtraction(number1, number2);
            break;
          case '*':
            result = normalOperations.multiplication(number1, number2);
            break;
          case '/':
            result = normalOperations.division(number1, number2);
            break;
        }

        if(Number.isInteger(result)) setScreenResult(result.toString());
        else setScreenResult(result.toFixed(2).toString());


        setIsAfterResult(true);
        setHasOperator(false);
      }
    }
  }

  return (
    <div id="calculator-page">
      <div id="calculator-container">
        <div id="screen">
          <h3 id={ showHistoric ? 'show' : '' } > {operationHistoric} </h3>
          <h2> {screenResult} </h2>
        </div>

        <div id="buttons">
          <button className="button"> % </button>
          <button className="button"> CE </button>
          <button className="button" onClick={ resetAll } > C </button>
          <button className="button" onClick={ handleRemoveNumber } > X </button>

          <button className="button"> 1/X </button>
          <button className="button"> X2 </button>
          <button className="button"> 2X </button>
          <button className="button" onClick={ () => handleAddOperator('/') } > / </button>

          <button className="button" onClick={ () => handleAddNumber('7') } > 7 </button>
          <button className="button" onClick={ () => handleAddNumber('8') } > 8 </button>
          <button className="button" onClick={ () => handleAddNumber('9') } > 9 </button>
          <button className="button" onClick={ () => handleAddOperator('*') } > * </button>

          <button className="button" onClick={ () => handleAddNumber('4') } > 4 </button>
          <button className="button" onClick={ () => handleAddNumber('5') } > 5 </button>
          <button className="button" onClick={ () => handleAddNumber('6') } > 6 </button>
          <button className="button" onClick={ () => handleAddOperator('-') } > - </button>

          <button className="button" onClick={ () => handleAddNumber('1') } > 1 </button>
          <button className="button" onClick={ () => handleAddNumber('2') } > 2 </button>
          <button className="button" onClick={ () => handleAddNumber('3') } > 3 </button>
          <button className="button" onClick={ () => handleAddOperator('+') } > + </button>

          <button className="button"> +/- </button>
          <button className="button" onClick={ () => handleAddNumber('0') } > 0 </button>
          <button className="button" onClick={ () => handleAddNumber('.') } > , </button>
          <button className="button" onClick={ calculate } > = </button>
        </div>
      </div>
    </div>

  );
}

export default App;
