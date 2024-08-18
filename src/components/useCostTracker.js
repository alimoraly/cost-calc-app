//src/components/useCostTracker.js

import { useState, useRef, useCallback } from 'react';

export const useCostTracker = (initialCost) => {
    const [currentCost, setCurrentCost] = useState(initialCost);
    const previousCostRef = useRef(initialCost);
    const changeTimeoutRef = useRef(null);

    const updateCost = useCallback((newCost) => {
        console.log('Updating cost:', newCost);
        setCurrentCost(newCost);

        if (changeTimeoutRef.current) {
            clearTimeout(changeTimeoutRef.current);
        }

        changeTimeoutRef.current = setTimeout(() => {
            console.log('Updating previous cost:', newCost);
            previousCostRef.current = newCost;
        }, 2000); // Adjust this delay as needed
    }, []);

    const getChangePercentage = useCallback(() => {
        const change = currentCost - previousCostRef.current;
        const percentage = previousCostRef.current !== 0 ? (change / previousCostRef.current) * 100 : 0;
        console.log('Calculating change percentage:', {
            currentCost,
            previousCost: previousCostRef.current,
            change,
            percentage
        });
        return percentage;
    }, [currentCost]);

    return {
        currentCost,
        updateCost,
        getChangePercentage,
    };
};