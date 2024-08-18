// src/hooks/useEventHubsCalculator.js

import { useState, useEffect, useCallback } from 'react';

export const useEventHubsCalculator = (isActive, eventHubsData) => {
    const [eventHubsCost, setEventHubsCost] = useState({
        throughputUnits: 0,
        hourlyCost: 0,
        ThroughputUnitMonthlyCost: 0,
        ingressCostPerMonth: 0,
        totalMonthlyCost: 0
    });

    const calculateEventHubsCost = useCallback(() => {
        const { updatesPerSecond, bytesPerUpdate, totalMW, hoursDay } = eventHubsData;
        const totalUpdatesPerSecond = updatesPerSecond * totalMW;
        const totalBytesPerSecond = totalUpdatesPerSecond * bytesPerUpdate;
        const mbPerSecond = totalBytesPerSecond / (1024 * 1024);

        const throughputUnits = Math.max(
            Math.ceil(mbPerSecond),
            Math.ceil(totalUpdatesPerSecond / 1000)
        );

        const hourlyCost = throughputUnits * 0.030;
        const ThroughputUnitMonthlyCost = hourlyCost * hoursDay * 30;
        const ingressCostPerMonth = (totalUpdatesPerSecond * 3600 * hoursDay * 30) / 1000000 * 0.028;

        const totalMonthlyCost = ThroughputUnitMonthlyCost + ingressCostPerMonth;

        return {
            throughputUnits,
            hourlyCost,
            ThroughputUnitMonthlyCost,
            ingressCostPerMonth,
            totalMonthlyCost
        };
    }, [eventHubsData]);

    useEffect(() => {
        if (isActive) {
            const cost = calculateEventHubsCost();
            setEventHubsCost(cost);
        }
    }, [calculateEventHubsCost, isActive]);

    return {
        eventHubsCost,
        calculateEventHubsCost
    };
};