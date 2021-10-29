import './App.css';
import React, { useRef, useEffect, useState } from 'react';

// npm install --save fabricjs-react fabric react react-dom
function App() {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const colorRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColors] = useState('#2c2c2c');
  const [range, setRange] = useState(2.5);
  const [filling, setFilling] = useState(false);

  useEffect(() => {
    // canvas의 사이즈를 조작해줘야 작동을 함(왜 두가지 방법을 쓰는지 모르겠음)

    const canvas = canvasRef.current;
    console.log('canvas');
    console.log(canvas);
    canvas.width = 700;
    canvas.height = 700;
    canvas.style.width = `${700}px`;
    canvas.style.height = `${700}px`;

    // get context of the canvas 픽셀들을 컨트롤 하는 것임
    const context = canvas.getContext('2d');
    // context.fillRect(25, 25, 100, 100);
    // context.clearRect(40, 40, 70, 70);
    // context.strokeRect(50, 50, 50, 50);

    // context.scale(2, 2);
    context.lineCap = 'round';
    context.strokeStyle = color;
    context.lineWidth = range;
    contextRef.current = context;
  }, [color, range]);

  console.log(canvasRef);
  console.log(contextRef);

  const onAddCircle = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    contextRef.current = context;

    // 간단하지만 확대·축소 비율을 적용한 사각형 그리기
    for (var i = 0; i < 3; i++) {
      for (var j = 0; j < 3; j++) {
        context.save();
        context.fillStyle = 'rgb(' + 51 * i + ', ' + (255 - 51 * i) + ', 255)';
        context.translate(10 + j * 50, 10 + i * 50);
        context.fillRect(0, 0, 25, 25);
        context.restore();
      }
    }
  };
  const onAddRectangle = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    contextRef.current = context;

    // 간단하지만 확대·축소 비율을 적용한 사각형 그리기
    context.save();
    // blue rect
    context.fillStyle = '#0095DD';
    context.fillRect(30, 30, 100, 100);
    context.rotate((Math.PI / 180) * 25);
    // grey rect
    context.fillStyle = '#4D4E53';
    context.fillRect(30, 30, 100, 100);
    context.restore();

    // right rectangles, rotate from rectangle center
    // draw blue rect
    context.fillStyle = '#0095DD';
    context.fillRect(150, 30, 100, 100);

    context.translate(200, 80); // translate to rectangle center
    // x = x + 0.5 * width
    // y = y + 0.5 * height
    context.rotate((Math.PI / 180) * 25); // rotate
    context.translate(-200, -80); // translate back

    // draw grey rect
    context.fillStyle = '#4D4E53';
    context.fillRect(150, 30, 100, 100);
  };
  // start
  const onMouseDown = ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent;
    // starting point
    contextRef.current.beginPath();
    contextRef.current.moveTo(offsetX, offsetY);
    setIsDrawing(true);
  };
  //draw
  const onMouseMove = ({ nativeEvent }) => {
    if (isDrawing) {
      const { offsetX, offsetY } = nativeEvent;
      contextRef.current.lineCap = 'round';
      contextRef.current.lineJoin = 'round';
      contextRef.current.strokeStyle = color;
      contextRef.current.lineTo(offsetX, offsetY);
      contextRef.current.stroke();
      // contextRef.current.translate(offsetX, offsetY);
      // setIsDrawing(true);
    }
  };
  //stop
  const onMouseUp = (e) => {
    console.log('mouseUP');
    console.log(e.nativeEvent);
    contextRef.current.stroke();
    contextRef.current.closePath();
    setIsDrawing(false);
  };

  const changeColor = (e) => {
    console.log('backgroundcolor');
    console.log(e.target.style);
    const color = e.target.style.backgroundColor;
    setColors(color);
  };
  const handleChangeRange = (e) => {
    e.preventDefault();
    console.log('e.target.value');
    console.log(e.target.value);
    const range = e.target.value;
    setRange(range);
  };
  const handleMode = () => {
    filling ? setFilling(false) : setFilling(true);
  };
  return (
    <div className='App'>
      <h1>Drawing App</h1>

      {/* canvas 는 픽셀을 다루는 능력이 있음 */}
      <canvas
        className='canvas'
        ref={canvasRef}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseDown={onMouseDown}
        // isDrawing={isDrawing}
      />

      <div className='controls'>
        <div className='controls_range'>
          <input
            type='range'
            className='control_range'
            max='5.0'
            min='0.1'
            defaultValue='2.5'
            step='0.1'
            onChange={handleChangeRange}
          />
        </div>
        <div className='controls_buttons'>
          {filling ? (
            <button className='change_mode' onClick={handleMode}>
              Fill
            </button>
          ) : (
            <button className='change_mode' onClick={handleMode}>
              Paint
            </button>
          )}

          <button className='save'>Save</button>
          <button onClick={onAddCircle} className='change_mode'>
            Circle
          </button>
          <button onClick={onAddRectangle} className='change_mode'>
            Rectangle
          </button>
        </div>
        <div className='controls_colors'>
          <div
            onClick={changeColor}
            ref={colorRef}
            className='control_color'
            style={{ backgroundColor: '#2c2c2c' }}
          ></div>
          <div
            onClick={changeColor}
            ref={colorRef}
            className='control_color'
            style={{ backgroundColor: 'lightgreen' }}
          ></div>
          <div
            onClick={changeColor}
            ref={colorRef}
            className='control_color'
            style={{ backgroundColor: 'blue' }}
          ></div>
          <div
            onClick={changeColor}
            ref={colorRef}
            className='control_color'
            style={{ backgroundColor: 'yellow' }}
          ></div>
          <div
            onClick={changeColor}
            ref={colorRef}
            className='control_color'
            style={{ backgroundColor: 'green' }}
          ></div>
          <div
            onClick={changeColor}
            ref={colorRef}
            className='control_color'
            style={{ backgroundColor: 'navy' }}
          ></div>
          <div
            onClick={changeColor}
            ref={colorRef}
            className='control_color'
            style={{ backgroundColor: 'purple' }}
          ></div>
          <div
            onClick={changeColor}
            ref={colorRef}
            className='control_color'
            style={{ backgroundColor: 'orange' }}
          ></div>
          <div
            onClick={changeColor}
            ref={colorRef}
            className='control_color'
            style={{ backgroundColor: 'lightblue' }}
          ></div>
        </div>
      </div>
    </div>
  );
}

export default App;
