// src/components/stages/CosmosDB.js

import React from 'react';
import { Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Slider } from '../ui/slider';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';

export const CosmosDB = ({ isActive, goldStorageGB, cosmosDBData, setCosmosDBData, cost }) => {
    console.log('CosmosDB: Received goldStorageGB:', goldStorageGB);

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
        setCosmosDBData({ ...cosmosDBData, [key]: Number(value) });
    };

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>Configuration</CardTitle>
                    <CardDescription>Adjust parameters to calculate Cosmos DB costs</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <Label htmlFor="data-volume-factor">Data Volume Factor</Label>
                        <Slider
                            id="data-volume-factor"
                            min={0.1}
                            max={10}
                            step={0.1}
                            value={[cosmosDBData.dataVolumeFactor]}
                            onValueChange={(value) => handleInputChange('dataVolumeFactor', value[0])}
                        />
                        <Input
                            type="number"
                            value={cosmosDBData.dataVolumeFactor}
                            onChange={(e) => handleInputChange('dataVolumeFactor', e.target.value)}
                            className="mt-2"
                        />
                    </div>
                    <div>
                        <Label htmlFor="requests-per-second">Requests per second (RU)</Label>
                        <Slider
                            id="requests-per-second"
                            min={100}
                            max={10000}
                            step={100}
                            value={[cosmosDBData.requestsPerSecond]}
                            onValueChange={(value) => handleInputChange('requestsPerSecond', value[0])}
                        />
                        <Input
                            type="number"
                            value={cosmosDBData.requestsPerSecond}
                            onChange={(e) => handleInputChange('requestsPerSecond', e.target.value)}
                            className="mt-2"
                        />
                    </div>
                    <div>
                        <Label htmlFor="hours-per-day">Usage per day (Hours)</Label>
                        <Slider
                            id="hours-per-day"
                            min={1}
                            max={24}
                            step={1}
                            value={[cosmosDBData.hoursPerDay]}
                            onValueChange={(value) => handleInputChange('hoursPerDay', value[0])}
                        />
                        <Input
                            type="number"
                            value={cosmosDBData.hoursPerDay}
                            onChange={(e) => handleInputChange('hoursPerDay', e.target.value)}
                            className="mt-2"
                        />
                    </div>
                    <div>
                        <Label htmlFor="expected-utilization">Expected utilization (%)</Label>
                        <Slider
                            id="expected-utilization"
                            min={1}
                            max={100}
                            step={1}
                            value={[cosmosDBData.expectedUtilization]}
                            onValueChange={(value) => handleInputChange('expectedUtilization', value[0])}
                        />
                        <Input
                            type="number"
                            value={cosmosDBData.expectedUtilization}
                            onChange={(e) => handleInputChange('expectedUtilization', e.target.value)}
                            className="mt-2"
                        />
                    </div>
                </CardContent>
            </Card>

            <Card className="mt-4">
                <CardHeader>
                    <CardTitle>Cost Estimation</CardTitle>
                    <CardDescription>one month data retention</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label>Storage Size</Label>
                            <p className="text-2xl font-bold">{cost.storageSize.toFixed(2)} GB</p>
                        </div>
                        <div>
                            <Label>Storage Cost</Label>
                            <p className="text-2xl font-bold">${cost.storageMonthCost.toFixed(2)}</p>
                        </div>
                        <div>
                            <Label>Transaction Cost</Label>
                            <p className="text-2xl font-bold">${cost.transactionMonthCost.toFixed(2)}</p>
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
                            <AccordionTrigger>Azure Cosmos DB</AccordionTrigger>
                            <AccordionContent>
                                <ul className="list-disc pl-5 space-y-2 text-left">
                                    <li>NoSQL database</li>
                                    <li>Flexible scaling of throughput and storage</li>
                                    <li>Global distribution and multi-region writes</li>
                                </ul>
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-2">
                            <AccordionTrigger>Pricing</AccordionTrigger>
                            <AccordionContent>
                                <ul className="list-disc pl-5 space-y-2 text-left">
                                    <li>Storage cost: $0.25 per GB per month</li>
                                    <li>Transaction cost: $0.012 per R/s per hour multiplied by expected utilization</li>
                                </ul>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </CardContent>
            </Card>
        </>
    );
};

export default CosmosDB;