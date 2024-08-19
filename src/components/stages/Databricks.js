// src/components/stages/Databricks.js

import React from 'react';
import { Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Slider } from '../ui/slider';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';

export const Databricks = ({ isActive, databricksData, setDatabricksData, cost }) => {
    if (!isActive) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Configuration</CardTitle>
                    <CardDescription>This stage is currently disabled</CardDescription>
                </CardHeader>
            </Card>
        );
    }

    const handleInputChange = (key, value) => {
        setDatabricksData({ ...databricksData, [key]: Number(value) });
    };

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>Configuration</CardTitle>
                    <CardDescription>Adjust parameters to calculate Databricks costs</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <Label htmlFor="xb">Processing Job Period (minutes)</Label>
                        <Slider id="xb" min={1} max={60} step={1} value={[databricksData.xb]} onValueChange={(value) => handleInputChange('xb', value[0])} />
                        <Input type="number" value={databricksData.xb} onChange={(e) => handleInputChange('xb', e.target.value)} className="mt-2" />
                    </div>
                    <div>
                        <Label htmlFor="dr">Job Running duration (minutes)</Label>
                        <Slider id="dr" min={1} max={60} step={1} value={[databricksData.dr]} onValueChange={(value) => handleInputChange('dr', value[0])} />
                        <Input type="number" value={databricksData.dr} onChange={(e) => handleInputChange('dr', e.target.value)} className="mt-2" />
                    </div>
                    <div>
                        <Label htmlFor="dt">Usage per day (Hours)</Label>
                        <Slider id="dt" min={1} max={24} step={1} value={[databricksData.dt]} onValueChange={(value) => handleInputChange('dt', value[0])} />
                        <Input type="number" value={databricksData.dt} onChange={(e) => handleInputChange('dt', e.target.value)} className="mt-2" />
                    </div>
                    <div>
                        <Label htmlFor="ds">SQL Compute Cluster instances Number</Label>
                        <Slider id="ds" min={1} max={10} step={1} value={[databricksData.ds]} onValueChange={(value) => handleInputChange('ds', value[0])} />
                        <Input type="number" value={databricksData.ds} onChange={(e) => handleInputChange('ds', e.target.value)} className="mt-2" />
                    </div>
                    <div>
                        <Label htmlFor="dm">SQL Compute Cluster running duration (minutes)</Label>
                        <Slider id="dm" min={0} max={720} step={5} value={[databricksData.dm]} onValueChange={(value) => handleInputChange('dm', value[0])} />
                        <Input type="number" value={databricksData.dm} onChange={(e) => handleInputChange('dm', e.target.value)} className="mt-2" />
                    </div>
                </CardContent>
            </Card>

            <Card className="mt-4">
                <CardHeader>
                    <CardTitle>Cost Estimation</CardTitle>
                    <CardDescription>Monthly</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label>Delta Live Tables Cost</Label>
                            <p className="text-2xl font-bold">${cost.deltaLiveTablesCost.toFixed(2)}</p>
                        </div>
                        <div>
                            <Label>SQL Compute Cluster Cost</Label>
                            <p className="text-2xl font-bold">${cost.sqlComputeClusterCost.toFixed(2)}</p>
                        </div>
                        <div className="col-span-2">
                            <Label>Total Monthly Cost</Label>
                            <p className="text-3xl font-bold text-blue-600">${cost.totalMonthlyCost.toFixed(2)}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="mt-4">
                <CardHeader>
                    <CardTitle className="flex items-center">
                        <Info className="mr-2" size={20} />
                        Details
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Accordion type="single" collapsible>
                        <AccordionItem value="item-1">
                            <AccordionTrigger>Delta Live Tables Cluster</AccordionTrigger>
                            <AccordionContent>
                                <ul className="list-disc pl-5 space-y-2 text-left">
                                    <li>F16s VM: 16vCPU, 32GB RAM, 256GB Temp storage</li>
                                    <li>2 DBU per VM</li>
                                    <li>VM cost: $0.91 per hour</li>
                                    <li>DBU cost: $0.380 per DBU per hour</li>
                                </ul>
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-2">
                            <AccordionTrigger>SQL Compute Cluster</AccordionTrigger>
                            <AccordionContent>
                                <ul className="list-disc pl-5 space-y-2 text-left">
                                    <li>Small instance: 12 Database Units, 1 Driver, 4 Workers</li>
                                    <li>Cost: $3.89 per hour (billed by minute)</li>
                                </ul>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </CardContent>
            </Card>
        </>
    );
};

export default Databricks;