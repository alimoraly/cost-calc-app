import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        const total = payload.reduce((sum, entry) => sum + entry.value, 0);
        return (
            <div className="bg-white p-2 border border-gray-200 rounded shadow-md">
                <p className="font-bold">{`Month: ${label}`}</p>
                {payload.map((entry, index) => (
                    <p key={index} style={{ color: entry.color }}>
                        {`${entry.name}: $${entry.value.toLocaleString()}`}
                    </p>
                ))}
                <p className="font-bold mt-2">{`Total: $${total.toLocaleString()}`}</p>
            </div>
        );
    }
    return null;
};

export const AccumulativeCostChart = ({ accumulativeCostData, stages }) => {
    const maxValue = useMemo(() => {
        return Math.max(...accumulativeCostData.map(data =>
            stages.reduce((sum, stage) => sum + (data[stage] || 0), 0)
        ));
    }, [accumulativeCostData, stages]);

    const yAxisDomain = useMemo(() => {
        const upperLimit = Math.ceil((maxValue * 1.1) / 100) * 100; // Round up to nearest hundred
        return [0, upperLimit];
    }, [maxValue]);

    return (
        <Card className="flex flex-col shadow-lg">
            <CardHeader>
                <CardTitle>Cumulative Cost</CardTitle>
                <CardDescription>Projected costs for each service over 12 months</CardDescription>
                <CardDescription>Annual data retention</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
                <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={accumulativeCostData}>
                        <XAxis dataKey="month" />
                        <YAxis
                            tickFormatter={(value) => `$${(value / 1000).toLocaleString()}k`}
                            domain={yAxisDomain}
                        />
                        <Tooltip content={<CustomTooltip />} />
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