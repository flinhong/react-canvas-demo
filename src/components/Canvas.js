import React, { useRef, useEffect, useState } from 'react';
import color from '../utils/randomColor';

const Canvas = props => {
  const CANVAS_DISPLAY_WIDTH = 1200;

  const { background, components } = props.data;
  const { width, height, image:bgImage } = background;

  const bgCanvasRef = useRef(null);
  const bgOriginCanvasRef = useRef(null);
  const paintCanvasRef = useRef(null);
  const zoomRef = useRef(null);

  const [scale, setScale] = useState(1.0);
  const [canvasSize, setCanvasSize] = useState({ width:0, height:0 });
  const [paintCtx, setPaintCtx] = useState(null);
  const [component, setComponent] = useState({});
  const [rectHover, setRectHover] = useState(false);

  const zoom = (e) => {
    // get real mouse position relative to canvas layout
    const rect = bgCanvasRef.current.getBoundingClientRect()
    const x = Math.floor((e.clientX - rect.left) / (rect.right - rect.left) * canvasSize.width);
    const y = Math.floor((e.clientY - rect.top) / (rect.bottom - rect.top) * canvasSize.height);
    
    // console.log("x&y: ", `${x} & ${y}`);
    const zoomCtx = zoomRef.current.getContext('2d');

    zoomCtx.imageSmoothingEnabled = true;
    // scale mouse position (+- 15 px) (30*30 px) to 300*300 px in zoom div
    const px = 15;
    zoomCtx.drawImage(bgOriginCanvasRef.current, Math.abs(x - px) / scale, Math.abs(y - px) / scale, px*2 / scale, px*2 / scale, 0, 0, 300, 300);

    const currentRect = components.filter((component) => {
      return isMouseInRect(x, y, component.boundingBox)
    });
    
    if (currentRect.length > 0) {
      setComponent(currentRect[0]); // TODO: further calc size
      setRectHover(true);
      if (paintCtx !== null) drawComponents(paintCtx, currentRect[0]);
    } else {
      setComponent({});
      setRectHover(false);
      if (paintCtx !== null) drawComponents(paintCtx, null);
    }
  }

  // just for regular rectangle without tilt
  const isMouseInRect = (x, y, bounding) => {
    const rect = newRect(bounding, true);
    const ctx = bgCanvasRef.current.getContext('2d');
    return ctx.isPointInPath(rect, x, y);
  }

  const newRect = (bounding, need2DPath) => {
    const x = Math.floor(bounding[0] / scale);
    const y = Math.floor(bounding[1] / scale);
    const w = bounding[2];
    const h = bounding[3];
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
    console.log('drawing...')
    const rect = newRect(boundingBox);
    const { x, y, w, h } = rect;
    paintCtx.beginPath();
    paintCtx.lineWidth = lineWidth;
    paintCtx.strokeStyle = color;
    paintCtx.clearRect(x, y, w, h);
    paintCtx.strokeRect(x, y, w, h);

    paintCtx.font=`${14/scale}px monospace`; // css font property
    paintCtx.fillStyle=color; // text color
    paintCtx.fillText(text, x, y - 14); // move a little above rectangle
  }

  const moveDgr = (startDgr, moveDgr, radius, x0, y0, box) => {
    const num2rad = (n) => {
      return n/180 * Math.PI;
    }
    const rad = num2rad(startDgr - moveDgr);
    const newX = x0 + radius * Math.cos(rad);
    const newY = y0 + (radius - radius * Math.sin(rad));
  
    box.x = newX - box.w/2;
    box.y = newY - box.h/2;
  }

  const drawSubDefects = (paintCtx, component) => {
    const { boundingBox, defects } = component;
    const {x, y, w, h} = newRect(boundingBox);
    const centerX = x + w / 2;
    const centerY = y + h / 2;
    // const radius = Math.floor(Math.sqrt(w*w + h*h));
    const radius = w > h ? h : w;
    let dgrStep = 360 / defects.length;

    let x0 = centerX;
    let y0 = centerY - radius;

    defects.forEach((defect, index) => {
      const { width, height, title, image } = defect;
      const r = Math.sqrt(width*width, height*height) + radius;
      if (index === 0) y0 = y0 - r*scale - width/2;
      const box = {
        x: x0 - width / 2,
        y: y0 - height / 2,
        w: width,
        h: height
      }
      const dgr = dgrStep * index;
      moveDgr(90, dgr, r, x0, y0, box);
      paintCtx.beginPath();
      // paintCtx.strokeStyle = 'green';
      // paintCtx.strokeRect(box.x, box.y, box.w, box.h);
      const img = new Image();
      img.onload = () => {
        paintCtx.beginPath();
        paintCtx.drawImage(img, box.x, box.y, box.w, box.h);
        paintCtx.strokeStyle = 'green';
        paintCtx.strokeRect(box.x, box.y, box.w, box.h);
        paintCtx.fillText(title, box.x, box.y - 14);
      }
      img.src = image;
    })
  }

  const drawComponents = (paintCtx, onComponent) => {
    // re-draw on painting canvas layer
    if (paintCtx === null) {
      return;
    }

    paintCtx.clearRect(0, 0, width, height);
    if (onComponent !== null) {
      const { boundingBox, title } = onComponent;
      drawRect(paintCtx, boundingBox, 8, 'red', title); // highlight current component
      drawSubDefects(paintCtx, onComponent);
    } else {
      paintCtx.clearRect(0, 0, width, height);
      components.forEach(component => {
        const {
          boundingBox,
          title
        } = component;
        drawRect(paintCtx, boundingBox, 4, 'orange', title);
      })
    }
  }

  useEffect(() => {
    if (bgCanvasRef.current !== null && zoomRef.current !== null) {
      const ctx = bgCanvasRef.current.getContext('2d');
      ctx.scale(scale, scale); // scale by background image size

      // ctx.clearRect(0, 0, canvasSize.width, canvasSize.height);
      // start drawing
      const backgroundImage = new Image();
      backgroundImage.onload = function() {
        // backgroundImage.style.display = 'none';
        ctx.beginPath();
        ctx.drawImage(backgroundImage, 0, 0); // draw background image first

        const bgOriginCtx = bgOriginCanvasRef.current.getContext('2d');
        bgOriginCtx.beginPath();
        bgOriginCtx.drawImage(backgroundImage, 0, 0);
      }
      backgroundImage.src = bgImage;
    }
  }, [scale, canvasSize, bgImage])

  useEffect(() => {
    if (paintCanvasRef.current !== null) {
      const paintCtx = paintCanvasRef.current.getContext('2d');
      paintCtx.scale(scale, scale);
      setPaintCtx(paintCtx);
    }
  }, [scale, canvasSize]);

  useEffect(() => {
    drawComponents(paintCtx, null);
  }, [paintCtx])

  useEffect(() => {
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
      <div className='main'>
        {canvasSize.width > 0 &&
          <>
            <canvas ref={bgCanvasRef} width={canvasSize.width} height={canvasSize.height} style={{ zIndex: '-10' }} />
            <canvas ref={paintCanvasRef} width={canvasSize.width} height={canvasSize.height} style={{ zIndex: '10' }} onMouseMove={zoom} />
            <canvas ref={bgOriginCanvasRef} width={width} height={height} style={{ zIndex: '-20', display: 'none' }} />
          </>
        }
      </div>
      <div className='zoom'>
        <canvas ref={zoomRef} width={300} height={300} />
        <div className='info'>
          {component.title &&
            <pre>
              hover on: 
              <code>{JSON.stringify(component, null, 2)}</code>
            </pre>
          }
        </div>
      </div>
    </div>
    </>
  )
}

export default Canvas;