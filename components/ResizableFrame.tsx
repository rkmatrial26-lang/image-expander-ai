import React, { useState, useCallback, useEffect, useRef } from 'react';

type Bounds = { x: number; y: number; width: number; height: number };

interface ResizableFrameProps {
  bounds: Bounds;
  onBoundsChange: (bounds: Bounds) => void;
  minWidth: number;
  minHeight: number;
  containerRect?: DOMRect;
  imageRect: Bounds;
  aspectRatio: number | null;
}

type Handle = 'top' | 'right' | 'bottom' | 'left' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

const ResizableFrame: React.FC<ResizableFrameProps> = ({ bounds, onBoundsChange, minWidth, minHeight, containerRect, imageRect, aspectRatio }) => {
  const [activeHandle, setActiveHandle] = useState<Handle | null>(null);
  const startDragPos = useRef({ x: 0, y: 0 });
  const startBounds = useRef<Bounds>(bounds);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>, handle: Handle) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveHandle(handle);
    startDragPos.current = { x: e.clientX, y: e.clientY };
    startBounds.current = bounds;
  };

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!activeHandle || !containerRect) return;
    e.preventDefault();
    e.stopPropagation();

    const dx = e.clientX - startDragPos.current.x;
    const dy = e.clientY - startDragPos.current.y;

    let { x, y, width, height } = startBounds.current;

    if (aspectRatio) {
        // Aspect ratio locked resizing
        if (activeHandle.includes('right')) {
            width += dx;
        }
        if (activeHandle.includes('left')) {
            width -= dx;
            x += dx;
        }
        if (activeHandle.includes('bottom')) {
            height += dy;
        }
        if (activeHandle.includes('top')) {
            height -= dy;
            y += dy;
        }
        
        width = Math.max(minWidth, width);
        height = Math.max(minHeight, height);

        const newAR = width / height;

        if (activeHandle === 'top' || activeHandle === 'bottom') {
             const newWidth = height * aspectRatio;
             x -= (newWidth - width) / 2;
             width = newWidth;
        } else {
             const newHeight = width / aspectRatio;
             y -= (newHeight - height) / 2;
             height = newHeight;
        }

    } else {
        // Freeform resizing
        if (activeHandle.includes('top')) {
          height = Math.max(minHeight, height - dy);
          y = startBounds.current.y + dy;
        }
        if (activeHandle.includes('bottom')) {
          height = Math.max(minHeight, height + dy);
        }
        if (activeHandle.includes('left')) {
          width = Math.max(minWidth, width - dx);
          x = startBounds.current.x + dx;
        }
        if (activeHandle.includes('right')) {
          width = Math.max(minWidth, width + dx);
        }
    }

    // Constrain position and size within the container
    if (x < 0) {
      width += x;
      x = 0;
    }
    if (y < 0) {
      height += y;
      y = 0;
    }
    if (x + width > containerRect.width) {
      width = containerRect.width - x;
       if (aspectRatio) height = width / aspectRatio;
    }
    if (y + height > containerRect.height) {
      height = containerRect.height - y;
      if (aspectRatio) width = height * aspectRatio;
    }
    
    // Ensure frame always contains the image
    if(x > imageRect.x) x = imageRect.x;
    if(y > imageRect.y) y = imageRect.y;
    if(x + width < imageRect.x + imageRect.width) width = imageRect.x + imageRect.width - x;
    if(y + height < imageRect.y + imageRect.height) height = imageRect.y + imageRect.height - y;


    onBoundsChange({ x, y, width, height });

  }, [activeHandle, containerRect, onBoundsChange, minWidth, minHeight, imageRect, aspectRatio]);

  const handlePointerUp = useCallback(() => {
    setActiveHandle(null);
  }, []);

  useEffect(() => {
    const handleMove = (e: PointerEvent) => handlePointerMove(e as any);
    const handleUp = () => handlePointerUp();

    if (activeHandle) {
      document.body.style.cursor = getCursorStyle(activeHandle);
      window.addEventListener('pointermove', handleMove);
      window.addEventListener('pointerup', handleUp);
    }

    return () => {
      document.body.style.cursor = 'default';
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerup', handleUp);
    };
  }, [activeHandle, handlePointerMove, handlePointerUp]);

  const getCursorStyle = (handle: Handle) => {
    switch(handle){
        case 'top':
        case 'bottom':
            return 'ns-resize';
        case 'left':
        case 'right':
            return 'ew-resize';
        case 'top-left':
        case 'bottom-right':
            return 'nwse-resize';
        case 'top-right':
        case 'bottom-left':
            return 'nesw-resize';
        default:
            return 'default';
    }
  }

  const frameStyle: React.CSSProperties = {
    position: 'absolute',
    left: bounds.x,
    top: bounds.y,
    width: bounds.width,
    height: bounds.height,
    boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.7)',
    border: '2px solid #3b82f6',
    zIndex: 10,
  };

  const handleBaseStyle = 'absolute bg-primary-500 border border-white dark:border-gray-900';

  return (
    <div style={frameStyle}>
      <div onPointerDown={e => handlePointerDown(e, 'top-left')} className={`${handleBaseStyle} -top-1.5 -left-1.5 w-3 h-3 rounded-full`} style={{cursor: getCursorStyle('top-left')}} />
      <div onPointerDown={e => handlePointerDown(e, 'top-right')} className={`${handleBaseStyle} -top-1.5 -right-1.5 w-3 h-3 rounded-full`} style={{cursor: getCursorStyle('top-right')}} />
      <div onPointerDown={e => handlePointerDown(e, 'bottom-left')} className={`${handleBaseStyle} -bottom-1.5 -left-1.5 w-3 h-3 rounded-full`} style={{cursor: getCursorStyle('bottom-left')}}/>
      <div onPointerDown={e => handlePointerDown(e, 'bottom-right')} className={`${handleBaseStyle} -bottom-1.5 -right-1.5 w-3 h-3 rounded-full`} style={{cursor: getCursorStyle('bottom-right')}}/>
      
      {/* Only show edge handles in custom mode for a cleaner look, but keep them functional for ratio mode */}
       <>
        <div onPointerDown={e => handlePointerDown(e, 'top')} className="absolute -top-1 left-1/2 -translate-x-1/2 w-8 h-2" style={{cursor: getCursorStyle('top')}}/>
        <div onPointerDown={e => handlePointerDown(e, 'bottom')} className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-2" style={{cursor: getCursorStyle('bottom')}}/>
        <div onPointerDown={e => handlePointerDown(e, 'left')} className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-8" style={{cursor: getCursorStyle('left')}}/>
        <div onPointerDown={e => handlePointerDown(e, 'right')} className="absolute -right-1 top-1/2 -translate-y-1/2 w-2 h-8" style={{cursor: getCursorStyle('right')}}/>
       </>
    </div>
  );
};

export default ResizableFrame;