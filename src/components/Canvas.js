import React, { useRef, useEffect, useState } from 'react';
import { Modal } from 'semantic-ui-react';
import color from '../utils/randomColor';

const Canvas = props => {

  const { background, components } = props.data;
  const { width, height, image:bgImage } = background;

  const canvasRef = useRef(null);
  const zoomRef = useRef(null);

  const [component, setComponent] = useState({});
  const [rectHover, setRectHover] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const zoom = (e) => {
    // get real mouse position relative to canvas layout
    const rect = canvasRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / (rect.right - rect.left) * width;
    const y = (e.clientY - rect.top) / (rect.bottom - rect.top) * height;
    
    // console.log("x&y: ", `${x} & ${y}`);
    const zoomCtx = zoomRef.current.getContext('2d');

    zoomCtx.imageSmoothingEnabled = true;
    // scale mouse position (+- 10 px) (20*20 px) to 300*300 px in zoom div
    zoomCtx.drawImage(canvasRef.current, Math.abs(x - 10), Math.abs(y - 10), 20, 20, 0, 0, 300, 300);

    const currentRect = components.filter((component) => {
      return isMouseInRect(x, y, component.boundingBox)
    });
    
    if (currentRect.length > 0) {
      setComponent(currentRect[0]);
      setRectHover(true);
    } else {
      setComponent({});
      setRectHover(false);
    }
  }

  const handleClick = () => {
    if (component.title) setOpenModal(true);
  }

  // just for regular rectangle without tilt
  const isMouseInRect = (x, y, bounding) => {
    if (x >= bounding[0] && x <= bounding[0] + bounding[2] && y >= bounding[1] && y <= bounding[1] + bounding[3] ) {
      return true
    } else {
      return false
    }
  }

  const drawRect = (ctx, bounding, lineWidth, color, text) => {
    const x = bounding[0];
    const y = bounding[1];
    const w = bounding[2];
    const h = bounding[3];
    const rect = new Path2D();
    rect.rect(x, y, w, h);
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = color;
    ctx.stroke(rect);

    ctx.font=`14px monospace`; // css font property
    ctx.fillStyle=color; // text color
    ctx.fillText(text, x, y - 7); // move a little above rectangle
  }

  useEffect(() => {
    if (canvasRef.current !== null && zoomRef.current !== null) {
      const ctx = canvasRef.current.getContext('2d');

      // start drawing
      const backgroundImage = new Image();
      backgroundImage.onload = function() {
        ctx.drawImage(backgroundImage, 0, 0) // draw background image first
        backgroundImage.style.display = 'none';

        components.forEach(component => {
          const { boundingBox, title } = component;
          drawRect(ctx, boundingBox, 2, color(), title);
        })
      }
      backgroundImage.src = bgImage;
    }
  }, [bgImage, components])

  // useEffect(() => {
  //   if (component.title) {
  //     console.log('select: ', component.title);
  //   }
  // }, [component])

  return (
    <>
    <div className={`canvas-container${rectHover ? ' component-on-hover': ''}`}>
      <div className='main'>
        <canvas ref={canvasRef} height={height} width={width} onMouseMove={zoom} onClick={handleClick} />
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

    <Modal
      basic
      size='large'
      closeIcon
      onClose={() => setOpenModal(false)}
      onOpen={() => setOpenModal(true)}
      open={openModal}
      onClick={() => setOpenModal(false)}
      className='component-modal'
    >
      <Modal.Header>{component.title}</Modal.Header>
      <Modal.Content image>
        <div className='component-detail'>
          <img src={component.image} alt={component.title} />
        </div>
      </Modal.Content>
    </Modal>
    </>
  )
}

export default Canvas;