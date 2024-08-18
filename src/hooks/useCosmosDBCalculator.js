// src/hooks/useCosmosDBCalculator.js

import { useState, useEffect } from 'react';

export const useCosmosDBCalculator = (isActive, goldStorageGB, cosmosDBData) => {
    const [requestsPerSecond, setRequestsPerSecond] = useState(1000);
    const [hoursPerDay, setHoursPerDay] = useState(12);
    const [expectedUtilization, setExpectedUtilization] = useState(70);
    const [dataVolumeFactor, setDataVolumeFactor] = useState(1);
    const [cosmosDBCost, setCosmosDBCost] = useState({
        storageSize: 0,
        storageMonthCost: 0,
        transactionMonthCost: 0,
        totalMonthlyCost: 0
    });

    useEffect(() => {
        console.log('useCosmosDBCalculator: Effect triggered');
        console.log('isActive:', isActive, 'goldStorageGB:', goldStorageGB);
        if (isActive && goldStorageGB !== undefined && goldStorageGB !== null) {
            const { requestsPerSecond, hoursPerDay, expectedUtilization, dataVolumeFactor } = cosmosDBData;
            // Data volume (GB/month) = Gold storage from azure datalake stage
            // const dataVolume = goldStorageGB;

            // Request Units per hour = RU * 3600
            // const requestUnitsPerHour = requestsPerSecond * 3600;

            const storageSize = goldStorageGB * dataVolumeFactor;
            console.log('Calculated storageSize:', storageSize);
            // Effective Request Units per hour = Request Units per hour * (AD / 100)
            const effectiveRequestUnitsPerHour = requestsPerSecond * (expectedUtilization / 100);

            // Transaction cost per hour = (Effective Request Units per hour / 100) * $0.012
            const transactionCostPerHour = (effectiveRequestUnitsPerHour / 100) * 0.012;

            // Storage cost per month = Data volume * $0.25
            const storageMonthCost = storageSize * 0.25;

            // Daily transaction cost = Transaction cost per hour * DT
            // const dailyTransactionCost = transactionCostPerHour * hoursPerDay;

            // Monthly transaction cost = Daily transaction cost * 30
            // const transactionMonthCost = dailyTransactionCost * 30;
            const transactionMonthCost = transactionCostPerHour * hoursPerDay * 30;

            // Total monthly cost for Stage 4 = Storage cost per month + Monthly transaction cost
            const totalMonthlyCost = storageMonthCost + transactionMonthCost;

            setCosmosDBCost({
                storageSize,
                storageMonthCost,
                transactionMonthCost,
                totalMonthlyCost
            });
            console.log('Set cosmosDBCost:', { storageSize, storageMonthCost, transactionMonthCost, totalMonthlyCost });
        } else {
            console.log('Conditions not met for calculation');
        }
    }, [isActive, goldStorageGB, cosmosDBData]);

    return { cosmosDBCost };
};