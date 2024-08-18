// src/components/TotalCostSummary.js

import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

const TotalCostSummary = React.memo(({ monthlyCost, annualCost, getChangePercentage }) => {
    const { changePercentage, showChange } = useMemo(() => {
        const percentage = getChangePercentage();
        console.log('Change percentage calculated:', percentage);
        return {
            changePercentage: percentage,
            showChange: Math.abs(percentage) >= 0.01
        };
    }, [getChangePercentage]);

    console.log('Rendering TotalCostSummary', { monthlyCost, annualCost, showChange, changePercentage });

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(value);
    };

    return (
        <Card className="w-full mb-8 shadow-lg">
            <CardHeader>
                <CardTitle className="text-2xl font-bold">PoC Cost Summary</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col">
                    <span className="text-lg font-semibold text-gray-600">Monthly Total</span>
                    <span className="text-4xl font-bold">{formatCurrency(monthlyCost)}</span>
                    {showChange && (
                        <div className="flex items-center mt-2">
                            {changePercentage > 0 ? (
                                <ArrowUpRight className="text-green-500 mr-1" size={20} />
                            ) : (
                                <ArrowDownRight className="text-red-500 mr-1" size={20} />
                            )}
                            <span className={`font-semibold ${changePercentage > 0 ? 'text-green-500' : 'text-red-500'}`}>
                                {Math.abs(changePercentage).toFixed(2)}%
                            </span>
                            <span className="text-gray-600 ml-1">vs last configuration</span>
                        </div>
                    )}
                </div>
                <div className="flex flex-col">
                    <span className="text-lg font-semibold text-gray-600">Annual Total</span>
                    <span className="text-4xl font-bold">{formatCurrency(annualCost)}</span>
                </div>
            </CardContent>
        </Card>
    );
});

export default TotalCostSummary;