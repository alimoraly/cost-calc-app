// src/hooks/useMachineLearningCalculator.js

import { useState, useEffect } from 'react';

export const useMachineLearningCalculator = (isActive, totalMW, machineLearningData) => {
    const [mlCost, setMlCost] = useState({
        trainingMonthlyCost: 0,
        trainingInitialCost: 0,
        initialtrainingCostPerMW: 0,
        inferenceMonthlyCost: 0,
        totalMonthlyCost: 0
    });

    useEffect(() => {
        if (isActive && totalMW > 0) {
            const {
                trainingHoursPerCustomer,
                customersNumbers,
                retrainingFrequency,
                retrainingHoursPerCustomer,
                retrainingPercentage,
                inferenceHoursPerDay
            } = machineLearningData;

            const initialTrainingHours = customersNumbers * trainingHoursPerCustomer;
            const customersForRetraining = customersNumbers * (retrainingPercentage / 100);
            const retrainingHoursPerMonth = retrainingFrequency * retrainingHoursPerCustomer * customersForRetraining;

            const trainingMonthlyCost = retrainingHoursPerMonth * 1.51;
            const trainingInitialCost = initialTrainingHours * 1.51;
            const initialtrainingCostPerMW = trainingInitialCost / totalMW;

            const inferenceRunningHoursPerMonth = inferenceHoursPerDay * 30;
            const inferenceMonthlyCost = inferenceRunningHoursPerMonth * 1.92;

            const totalMonthlyCost = trainingMonthlyCost + inferenceMonthlyCost;

            setMlCost({
                trainingMonthlyCost,
                trainingInitialCost,
                initialtrainingCostPerMW,
                inferenceMonthlyCost,
                totalMonthlyCost
            });
        }
    }, [isActive, totalMW, machineLearningData]);

    
    return { mlCost };
};