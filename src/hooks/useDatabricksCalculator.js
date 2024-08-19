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
            const tiggersPerDay = Math.floor(60 * dt / xb)
            const jobRuntimeMinutesPerDay = tiggersPerDay * dr
            const vmCostPerDay = dt * 0.91;
            const dbuCostPerDay = jobRuntimeMinutesPerDay / 60 * 2 * 0.380; // 2 DBU for selected cluster HW
            const deltaLiveTablesMonthlyCost = (vmCostPerDay + dbuCostPerDay) * 30;

            // SQL Compute Cluster calculations
            const sqlComputeHourlyCostDaily = (dm / 60) * ds * 12 * 0.700;
            const sqlComputeMonthlyCost = sqlComputeHourlyCostDaily * 30;

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

// xb: 15, // Minutes between Delta Live Tables job triggers
//     dr: 10, // Running duration of each job in minutes 
//         dt: 12, // Hours per day the VM is running
//             ds: 1, // Number of SQL Compute Cluster instances
//                 dm: 5 // SQL Compute Cluster running duration in minutes