import { useState, useRef, useCallback, useEffect } from 'react';
import getMyFiles from '../services/getFilesApi';

export function useFileSearch(userId) {
    const [files, setFiles] = useState([]);
    const [searchValue, setSearchValue] = useState('');
    const searchTimeoutRef = useRef(null);

    const loadFiles = useCallback(async (search = '') => {
        try {
            const result = await getMyFiles(userId, search, search ? 'search' : 'files');
            setFiles(result.result || []);
        } catch (error) {
            console.error('File load error:', error.message);
        }
    }, [userId]);

    // Поиск с debounce
    const handleSearch = useCallback((value) => {
        setSearchValue(value);

        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        if (value.trim() === '') {
            loadFiles('');
            return;
        }

        searchTimeoutRef.current = setTimeout(() => {
            loadFiles(value);
        }, 500);
    }, [loadFiles]);

    // Очистка таймера
    useEffect(() => {
        return () => {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }
        };
    }, []);

    return {
        files,
        searchValue,
        setFiles,
        loadFiles,
        handleSearch
    };
}