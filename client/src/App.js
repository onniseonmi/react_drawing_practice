import './App.css';
import React, { useRef, useEffect, useState } from 'react';
// npm install --save fabricjs-react fabric react react-dom
function App() {
  const CANVAS_SIZE = 700;
  const START_COLOR = 'white';
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const colorRef = useRef(null);
  const [currentX, setCurrentX] = useState(CANVAS_SIZE / 2);
  const [currentY, setCurrentY] = useState(CANVAS_SIZE / 2);
  const [isDrawing, setIsDrawing] = useState(false);
  const [rotationValue, setRotationValue] = useState(1);
  const [color, setColors] = useState('#2c2c2c');
  const [brush, setBrush] = useState('control_color');
  const [image, setImage] = useState(null);
  const [draggable, setDraggable] = useState(false);
  const [range, setRange] = useState(2.5);
  const [filling, setFilling] = useState(false);

  // HTMLImageElement(canvas) 객체에 접근하거나 drawImage()를 호출하는 등의 작업이 이미지가 로드된 이후에 이뤄지는 것을
  //  보장하도록 이미지 관련 작업을 onload 이벤트에 바인딩하는 것이 중요
  useEffect(() => {
    const imgUrl = new Image();
    imgUrl.src = 'https://thiscatdoesnotexist.com/';
    imgUrl.onload = () => {
      setImage(imgUrl);
    };
  }, []);

  useEffect(() => {
    // canvas의 사이즈를 조작해줘야 작동을 함(왜 두가지 방법을 쓰는지 모르겠음)
    if (!canvasRef) return;
    const canvas = canvasRef.current;
    console.log('canvas');
    console.log(canvas);
    canvas.width = CANVAS_SIZE;
    canvas.height = CANVAS_SIZE;
    canvas.style.width = `${CANVAS_SIZE}px`;
    canvas.style.height = `${CANVAS_SIZE}px`;
    const context = canvas.getContext('2d');
    contextRef.current = context;
    // get context of the canvas 픽셀들을 컨트롤 하는 것임
    // const context = canvasRef.current.getContext('2d');
    if (image && canvas) {
      contextRef.current.save();
      contextRef.current.fillStyle = 'black';
      contextRef.current.fillRect(0, 0, 700, 700);
      contextRef.current.drawImage(
        image,
        currentX - image.width / 2,
        currentY - image.height / 2
      );
    }
    // context.scale(2, 2); // 고해상도를 위해 캔버스의 크기를 2배로 설정을 해놓는 것임
    // context.lineCap = 'round';
  }, [currentY, currentX, image]);

  const onClear = () => {
    contextRef.current.fillStyle = START_COLOR;
    contextRef.current.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
  };
  const onUndo = () => {
    console.log('cancel');
  };
  // start
  const onMouseDown = ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent;
    if (brush === 'control_color') {
      // starting point
      contextRef.current.beginPath();
      contextRef.current.moveTo(offsetX, offsetY);
      setIsDrawing(true);
    } else if (
      brush === 'image_mode' &&
      offsetX <= currentX + image.width / 2 &&
      offsetX >= currentX - image.width / 2 &&
      offsetY <= currentY + image.height / 2 &&
      offsetY >= currentY - image.height / 2
    ) {
      console.log('도대체 어디야??');
      console.log(brush);
      setDraggable(true);
    }
  };
  //draw 이동
  const onMouseMove = ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent;
    if (!isDrawing && !draggable) {
      return;
    } else if (brush === 'control_color') {
      contextRef.current.lineCap = 'round';
      contextRef.current.lineJoin = 'round';
      contextRef.current.lineWidth = range;
      contextRef.current.lineTo(offsetX, offsetY);
      contextRef.current.stroke();
      setDraggable(false);
    } else if (brush === 'image_mode' && draggable) {
      setCurrentX(offsetX);
      setCurrentY(offsetY);
    } else if (brush === 'control_picker') {
      setDraggable(false);
    }
  };
  //stop
  const onStop = (e) => {
    // console.log('mouseUP');
    // console.log(e.nativeEvent);
    contextRef.current.stroke();
    contextRef.current.closePath();

    setIsDrawing(false);
    setDraggable(false);
  };

  //색깔바꾸기
  const changeColor = (e) => {
    const color = e.target.style.backgroundColor;
    const brush = e.target.className;
    contextRef.current.strokeStyle = color;
    contextRef.current.fillStyle = color;
    setColors(color);
    setBrush(brush);
  };
  const changColorPicker = (e) => {
    const color = e.target.value;
    contextRef.current.fillStyle = color;
    setColors(color);
  };
  //선굵기 바꾸기
  const handleChangeRange = (e) => {
    e.preventDefault();
    const range = e.target.value;
    setRange(range);
  };
  const handleMode = () => {
    filling ? setFilling(false) : setFilling(true);
  };
  //배경화면 바꾸기
  const handleChangebackground = () => {
    if (filling) {
      contextRef.current.fillRect(0, 0, 700, 700);
    }
  };
  const toRadian = (rotationValue) => {
    return (rotationValue * Math.PI) / 180;
  };
  const onDrawImg = () => {
    if (image) {
      contextRef.current.save();
      contextRef.current.fillStyle = 'black';
      contextRef.current.fillRect(0, 0, 700, 700);
      contextRef.current.drawImage(
        image,
        currentX - image.width / 2,
        currentY - image.height / 2
      );
      contextRef.current.rotate(toRadian(rotationValue));
      contextRef.current.restore();
      setRotationValue(rotationValue + 1);
      setBrush('image_mode');
    }
  };

  return (
    <div className='App'>
      <h1>Drawing App</h1>

      {/* canvas 는 픽셀을 다루는 능력이 있음 */}
      <canvas
        className='canvas'
        ref={canvasRef}
        onMouseMove={onMouseMove}
        onMouseUp={onStop}
        onMouseOut={onStop}
        onMouseDown={onMouseDown}
        isDrawing={isDrawing}
        onClick={handleChangebackground}
      />
      <img src='../public/logo192.png' alt='' />
      <div className='controls'>
        <div className='controls_range'>
          <input
            type='range'
            className='control_range'
            max='5.0'
            min='0.1'
            defaultValue={range}
            step='0.1'
            onChange={handleChangeRange}
          />
        </div>
        <div className='controls_buttons'>
          <button onClick={onUndo} className='change_mode'>
            Undo
          </button>

          {!filling ? (
            <button className='change_mode' onClick={handleMode}>
              Fill
            </button>
          ) : (
            <button className='change_mode' onClick={handleMode}>
              Paint
            </button>
          )}
          <button
            onClick={onDrawImg}
            isDrawing={isDrawing}
            className='image_mode'
          >
            Image
          </button>
          <button onClick={onClear} className='change_mode'>
            Clear
          </button>
          <button className='save'>Save</button>
        </div>
        <div className='controls_colors' onClick={changeColor}>
          <div
            ref={colorRef}
            className='control_color'
            style={{ backgroundColor: '#2c2c2c' }}
          ></div>
          <div
            ref={colorRef}
            className='control_color'
            style={{ backgroundColor: 'white' }}
          ></div>
          <div
            ref={colorRef}
            className='control_color'
            style={{ backgroundColor: 'blue' }}
          ></div>
          <div
            ref={colorRef}
            className='control_color'
            style={{ backgroundColor: 'yellow' }}
          ></div>
          <div
            ref={colorRef}
            className='control_color'
            style={{ backgroundColor: 'green' }}
          ></div>
          <div
            ref={colorRef}
            className='control_color'
            style={{ backgroundColor: 'navy' }}
          ></div>
          <div
            ref={colorRef}
            className='control_color'
            style={{ backgroundColor: 'purple' }}
          ></div>
          <div
            ref={colorRef}
            className='control_color'
            style={{ backgroundColor: 'orange' }}
          ></div>
          <div
            ref={colorRef}
            className='control_color'
            style={{ backgroundColor: 'lightblue' }}
          ></div>
          <input
            ref={colorRef}
            type='color'
            value={color}
            onChange={changColorPicker}
            className='control_picker'
          />
        </div>
      </div>
    </div>
  );
}

export default App;
