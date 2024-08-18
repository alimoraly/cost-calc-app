// src/components/charts/CostDistributionPieChart.js

import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export const CostDistributionPieChart = ({ costDistribution }) => {
    return (
        <Card className="flex flex-col shadow-lg">
            <CardHeader>
                <CardTitle>Cost Distribution</CardTitle>
                <CardDescription>Breakdown of monthly costs across all services</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
                <ResponsiveContainer width="100%" height={350}>
                    <PieChart>
                        <Pie
                            data={costDistribution}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, value, percent }) => `${name} $${value.toFixed(2)} (${(percent * 100).toFixed(0)}%)`}
                        >
                            {costDistribution.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                    </PieChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
};

export default CostDistributionPieChart;