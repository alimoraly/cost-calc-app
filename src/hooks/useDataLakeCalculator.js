// src/hooks/useCosmosDBCalculator.js

import { useState, useEffect } from 'react';

export const useDataLakeCalculator = (eventHubsData, isEventHubsActive, isActive, dataLakeData) => {
    const [dataLakeCost, setDataLakeCost] = useState({
        bronzeStorageGB: 0,
        silverStorageGB: 0,
        goldStorageGB: 0,
        totalStorageGB: 0,
        storageCost: 0,
        writeOperationsCost: 0,
        readOperationsCost: 0,
        totalMonthlyCost: 0,
    });

    useEffect(() => {
        if (isActive) {
            const { silverExpansionFactor, goldExpansionFactor, manualBronzeStorageGB } = dataLakeData;
            let bronzeStorageGB;
            if (isEventHubsActive) {
                const { updatesPerSecond, bytesPerUpdate, totalMW, hoursDay } = eventHubsData;
                bronzeStorageGB = (updatesPerSecond * bytesPerUpdate * totalMW * 3600 * hoursDay * 30) / (1024 * 1024 * 1024);
            } else {
                bronzeStorageGB = manualBronzeStorageGB;
            }

            const silverStorageGB = bronzeStorageGB * silverExpansionFactor;
            const goldStorageGB = bronzeStorageGB * goldExpansionFactor;
            const totalStorageGB = bronzeStorageGB + silverStorageGB + goldStorageGB;

            const storageCost = (totalStorageGB / 100) * 26;
            const writeOperationsCost = (10000000 / 10000) * 0.0394;
            const readOperationsCost = (100000000 / 10000) * 0.0031;
            const totalMonthlyCost = storageCost + writeOperationsCost + readOperationsCost;

            setDataLakeCost({
                bronzeStorageGB,
                silverStorageGB,
                goldStorageGB,
                totalStorageGB,
                storageCost,
                writeOperationsCost,
                readOperationsCost,
                totalMonthlyCost
            });
        }
    }, [isActive, eventHubsData, dataLakeData, isEventHubsActive]);

    return { dataLakeCost };
};