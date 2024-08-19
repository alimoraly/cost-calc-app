// src/components/stages/EventHubs.js

import React, { useEffect } from 'react';
import { Info } from 'lucide-react';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Slider } from '../ui/slider';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';

export const EventHubs = ({ isActive, eventHubsData, setEventHubsData, cost }) => {
    const handleInputChange = (key, value) => {
        setEventHubsData({ ...eventHubsData, [key]: Number(value) });
    };

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

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>Configuration</CardTitle>
                    <CardDescription>Adjust parameters to calculate costs</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <Label htmlFor="updates-per-second">Updates per second per MW</Label>
                        <Slider
                            id="updates-per-second"
                            min={1}
                            max={100}
                            step={1}
                            value={[eventHubsData.updatesPerSecond]}
                            onValueChange={(value) => handleInputChange('updatesPerSecond', value[0])}
                        />
                        <Input
                            type="number"
                            value={eventHubsData.updatesPerSecond}
                            onChange={(e) => handleInputChange('updatesPerSecond', e.target.value)}
                            className="mt-2"
                        />
                    </div>
                    <div>
                        <Label htmlFor="bytes-per-update">Bytes per update</Label>
                        <Slider
                            id="bytes-per-update"
                            min={1}
                            max={64}
                            step={1}
                            value={[eventHubsData.bytesPerUpdate]}
                            onValueChange={(value) => handleInputChange('bytesPerUpdate', value[0])}
                        />
                        <Input
                            type="number"
                            value={eventHubsData.bytesPerUpdate}
                            onChange={(e) => handleInputChange('bytesPerUpdate', e.target.value)}
                            className="mt-2"
                        />
                    </div>
                    <div>
                        <Label htmlFor="total-mw">Total MW managed</Label>
                        <Slider
                            id="total-mw"
                            min={10}
                            max={1000}
                            step={10}
                            value={[eventHubsData.totalMW]}
                            onValueChange={(value) => handleInputChange('totalMW', value[0])}
                        />
                        <Input
                            type="number"
                            value={eventHubsData.totalMW}
                            onChange={(e) => handleInputChange('totalMW', e.target.value)}
                            className="mt-2"
                        />
                    </div>
                    <div>
                        <Label htmlFor="hours-daily">Usage per day (Hours)</Label>
                        <Slider
                            id="hours-daily"
                            min={1}
                            max={24}
                            step={1}
                            value={[eventHubsData.hoursDay]}
                            onValueChange={(value) => handleInputChange('hoursDay', value[0])}
                        />
                        <Input
                            type="number"
                            value={eventHubsData.hoursDay}
                            onChange={(e) => handleInputChange('hoursDay', e.target.value)}
                            className="mt-2"
                        />
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
                            <Label>Throughput Units</Label>
                            <p className="text-2xl font-bold">{cost.throughputUnits}</p>
                        </div>
                        <div>
                            <Label>Hourly Cost</Label>
                            <p className="text-2xl font-bold">${cost.hourlyCost.toFixed(2)}</p>
                        </div>
                        <div>
                            <Label>Monthly Throughput Cost</Label>
                            <p className="text-2xl font-bold">${cost.ThroughputUnitMonthlyCost.toFixed(2)}</p>
                        </div>
                        <div>
                            <Label>Monthly Ingress Cost</Label>
                            <p className="text-2xl font-bold">${cost.ingressCostPerMonth.toFixed(2)}</p>
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
                            <AccordionTrigger>Throughput Unit (TU)</AccordionTrigger>
                            <AccordionContent>
                                <ul className="list-disc pl-5 space-y-2 text-left">
                                    <li>Standard tier</li>
                                    <li><strong>Ingress:</strong> Up to 1 MB per second or 1,000 events per second (whichever comes first)</li>
                                    <li><strong>Egress:</strong> Up to 2 MB per second or 4,096 events per second</li>
                                    <li>Capture mode not included</li>
                                </ul>
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-2">
                            <AccordionTrigger>Pricing</AccordionTrigger>
                            <AccordionContent>
                                <ul className="list-disc pl-5 space-y-2 text-left">
                                    <li>Billed hourly</li>
                                    <li>$0.030 per throughput unit per hour</li>
                                    <li>$0.028 per 1 million events per month</li>
                                </ul>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </CardContent>
            </Card>
        </>
    );
};