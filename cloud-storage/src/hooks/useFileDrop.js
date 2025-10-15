import { useState, useCallback, useRef } from 'react';

export function useFileDrop() {
    const [isDragOver, setIsDragOver] = useState(false);
    const dragCounter = useRef(0);

    const handleDragEnter = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        dragCounter.current += 1;
        setIsDragOver(true);
    }, []);

    const handleDragLeave = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        dragCounter.current -= 1;

        // Ждем немного чтобы убедиться, что это не вложенный элемент
        setTimeout(() => {
            if (dragCounter.current === 0) {
                setIsDragOver(false);
            }
        }, 0);
    }, []);

    const handleDragOver = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
    }, []);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);
        dragCounter.current = 0;

        const files = Array.from(e.dataTransfer.files);
        return files;
    }, []);

    return {
        isDragOver,
        handleDragEnter,
        handleDragLeave,
        handleDragOver,
        handleDrop
    };
}