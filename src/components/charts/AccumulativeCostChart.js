// src/components/charts/AccumulativeCostChart.js


import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export const AccumulativeCostChart = ({ accumulativeCostData, stages }) => {
    return (
        <Card className="flex flex-col shadow-lg">
            <CardHeader>
                <CardTitle>Cumulative Cost</CardTitle>
                <CardDescription>Projected costs for each service over 12 months</CardDescription>
                <CardDescription>with yearly data retention in datalake and cosomdb</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
                <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={accumulativeCostData}>
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                        <Legend />
                        {stages.map((stage, index) => (
                            <Bar
                                key={stage}
                                dataKey={stage}
                                stackId="a"
                                fill={COLORS[index % COLORS.length]}
                            />
                        ))}
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
};

export default AccumulativeCostChart;