// src/hooks/stages/useDatabricksCalculator.js

import { useState, useEffect } from 'react';

export const useDatabricksCalculator = (isActive, databricksData) => {
    const [databricksCost, setDatabricksCost] = useState({
        deltaLiveTablesCost: 0,
        sqlComputeClusterCost: 0,
        totalMonthlyCost: 0
    });

    useEffect(() => {
        if (isActive) {
            const { xb, dr, dt, ds, dm } = databricksData;

            // Delta Live Tables Cluster calculations
            const triggersPerHour = 60 / xb;
            const totalJobRuntimePerHour = (triggersPerHour * dr) / 60; // in hours
            const vmCostPerDay = dt * 0.91;
            const dbuCostPerDay = totalJobRuntimePerHour * dt * 2 * 0.380;
            const deltaLiveTablesMonthlyCost = (vmCostPerDay + dbuCostPerDay) * 30;

            // SQL Compute Cluster calculations
            const runsPerHour = 60 / xb;
            const totalRuntimePerHour = (runsPerHour * dm) / 60; // in hours
            const sqlComputeHourlyCost = totalRuntimePerHour * ds * 3.89;
            const sqlComputeDailyCost = sqlComputeHourlyCost * dt;
            const sqlComputeMonthlyCost = sqlComputeDailyCost * 30;

            // Total cost
            const totalMonthlyCost = deltaLiveTablesMonthlyCost + sqlComputeMonthlyCost;

            setDatabricksCost({
                deltaLiveTablesCost: deltaLiveTablesMonthlyCost,
                sqlComputeClusterCost: sqlComputeMonthlyCost,
                totalMonthlyCost: totalMonthlyCost
            });
        }
    }, [isActive, databricksData]);

    return { databricksCost };
};
