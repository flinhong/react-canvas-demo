import React, { useRef, useEffect, useState } from 'react';
import color from '../utils/randomColor';

const Canvas = props => {
  const CANVAS_DISPLAY_WIDTH = 1200;

  const { backgroundImage, dimension, components } = props.data;
  const { width, height } = dimension;

  const bgCanvasRef = useRef(null);
  const paintCanvasRef = useRef(null);
  const textCodeRef = useRef(null);

  const [scale, setScale] = useState(1.0);
  const [canvasSize, setCanvasSize] = useState({ width:0, height:0 });
  const [paintCtx, setPaintCtx] = useState(null);
  const [rectHover, setRectHover] = useState(false);
  const [focusComponent, setFocusComponent] = useState({});

  const mouseMove = (e) => {
    // get real mouse position relative to canvas position
    const rect = bgCanvasRef.current.getBoundingClientRect()
    const x = Math.floor((e.clientX - rect.left) / (rect.right - rect.left) * canvasSize.width);
    const y = Math.floor((e.clientY - rect.top) / (rect.bottom - rect.top) * canvasSize.height);
    
    // console.log("x&y: ", `${x} & ${y}`);
    textCodeRef.current.innerHTML = `${x} & ${y}`;

    const currentRect = components.filter((component) => {
      return isMouseInRect(x, y, component.boundingBox)
    });

    if (currentRect.length > 0) {
      setRectHover(true);
      if (paintCtx !== null) setFocusComponent(currentRect[0]);
    } else {
      setRectHover(false);
      if (paintCtx !== null) setFocusComponent({});
    }
  }

  // just for regular rectangle without tilt
  const isMouseInRect = (x, y, boundingBox) => {
    const rect = reScaleRect(boundingBox, true);
    const ctx = bgCanvasRef.current.getContext('2d');
    return ctx.isPointInPath(rect, x, y);
  }

  const reScaleRect = (boundingBox, need2DPath) => {
    const {xmin, xmax, ymin, ymax} = boundingBox;
    const { width, height } = canvasSize
    const x = Math.floor((xmin * width) / scale);
    const y = Math.floor((ymin * height) / scale);
    const w = Math.floor(((xmax - xmin) * width) / scale);
    const h = Math.floor(((ymax - ymin) * height) / scale);
    if (need2DPath) {
      const rect = new Path2D();
      rect.rect(x, y, w, h);
      return rect;
    } else {
      const rect = { x, y, w, h };
      return rect;
    }
  }

  const drawRect = (paintCtx, boundingBox, lineWidth, color, text) => {
    const rect = reScaleRect(boundingBox);
    const { x, y, w, h } = rect;
    paintCtx.beginPath();
    paintCtx.lineWidth = lineWidth;
    paintCtx.strokeStyle = color;
    paintCtx.clearRect(x, y, w, h);
    paintCtx.strokeRect(x, y, w, h);

    paintCtx.font=`${14/scale}px monospace`; // css font property
    paintCtx.fillStyle=color; // text color
    paintCtx.fillText(text, x, y - 15); // move the titlee above rectangle
  }

  const drawDetails = (paintCtx, details) => {
    details.forEach((component) => {
      const {
        boundingBox,
        title,
        image,
        style
      } = component;
      const { lineWidth, color } = style;

      const { x, y, w, h } = reScaleRect(boundingBox);
      const img = new Image();
      img.onload = () => {
        paintCtx.beginPath();
        paintCtx.drawImage(img, x, y, w, h);
        paintCtx.lineWidth = lineWidth;
        paintCtx.strokeStyle = color;
        paintCtx.strokeRect(x, y, w, h);
        paintCtx.fillStyle = color;
        paintCtx.fillText(title, x, y - 15);
      }
      img.src = image;
    })
  }

  const drawComponents = (paintCtx, focusComponent) => {
    if (paintCtx === null) {
      return;
    }

    // clear the context each time and repaint
    paintCtx.clearRect(0, 0, width, height);

    if (focusComponent !== null) {
      const { boundingBox, title } = focusComponent;
      drawRect(paintCtx, boundingBox, 8, 'red', title); // highlight current component
      drawDetails(paintCtx, focusComponent.details);
    } else {
      components.forEach(component => {
        const {
          boundingBox,
          title,
          style
        } = component;
        const { lineWidth, color } = style;
        drawRect(paintCtx, boundingBox, lineWidth, color, title);
      })
    }
  }

  useEffect(() => {
    if (focusComponent.details) {
      drawComponents(paintCtx, focusComponent)
    } else {
      drawComponents(paintCtx, null);
    }
  }, [focusComponent])

  useEffect(() => {
    if (bgCanvasRef.current !== null) {
      const ctx = bgCanvasRef.current.getContext('2d');
      ctx.scale(scale, scale); // scale by background image size
      ctx.clearRect(0, 0, width, height);

      const background = new Image();
      background.onload = function() {
        ctx.beginPath();
        ctx.drawImage(background, 0, 0); // draw background image at (0, 0)
      }
      background.src = backgroundImage;
    }
  }, [scale, canvasSize, backgroundImage, width, height])

  useEffect(() => {
    if (paintCanvasRef.current !== null) {
      const paintCtx = paintCanvasRef.current.getContext('2d');
      paintCtx.scale(scale, scale);
      setPaintCtx(paintCtx);
      drawComponents(paintCtx, null)
    }
  }, [scale, canvasSize]);

  useEffect(() => {
    // get scale ration after mounting component
    const ratio = CANVAS_DISPLAY_WIDTH / width;
    setScale(ratio);
    setCanvasSize({
      width: Math.floor(width * ratio),
      height: Math.floor(height * ratio)
    })
  }, [])

  return (
    <>
    <div className={`canvas-container${rectHover ? ' component-on-hover': ''}`}>
      <div className='positionInfo'>
        <pre><code ref={textCodeRef}>x and y position</code></pre>
      </div>
      <div className='main'>
        {canvasSize.width > 0 &&
          <>
            <canvas ref={paintCanvasRef} width={canvasSize.width} height={canvasSize.height} style={{ zIndex: '10' }} onMouseMove={mouseMove} />
            <canvas ref={bgCanvasRef} width={canvasSize.width} height={canvasSize.height} style={{ zIndex: '-10' }} />
          </>
        }
      </div>
    </div>
    </>
  )
}

export default Canvas;