// src/components/stages/MachineLearning.js

import React from 'react';
import { Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Slider } from '../ui/slider';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';

export const MachineLearning = ({ isActive, totalMW, machineLearningData, setMachineLearningData, cost }) => {
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
        setMachineLearningData({ ...machineLearningData, [key]: Number(value) });
    };

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>Configuration</CardTitle>
                    <CardDescription>Adjust parameters to calculate Machine Learning costs</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <Label htmlFor="customers-number">Number of customers</Label>
                        <Slider
                            id="average-customer-size"
                            min={1}
                            max={100}
                            step={1}
                            value={[machineLearningData.customersNumbers]}
                            onValueChange={(value) => handleInputChange('customersNumbers', value[0])}
                        />
                        <Input
                            type="number"
                            value={machineLearningData.customersNumbers}
                            onChange={(e) => handleInputChange('customersNumbers', e.target.value)}
                            className="mt-2"
                        />
                    </div>
                    <div>
                        <Label htmlFor="retraining-frequency">retraining sessions per month</Label>
                        <Slider
                            id="retraining-frequency"
                            min={1}
                            max={10}
                            step={1}
                            value={[machineLearningData.retrainingFrequency]}
                            onValueChange={(value) => handleInputChange('retrainingFrequency', value[0])}
                        />
                        <Input
                            type="number"
                            value={machineLearningData.retrainingFrequency}
                            onChange={(e) => handleInputChange('retrainingFrequency', e.target.value)}
                            className="mt-2"
                        />
                    </div>
                    <div>
                        <Label htmlFor="training-hours">Initial training duration per customer (hour)</Label>
                        <Slider
                            id="training-hours"
                            min={1}
                            max={100}
                            step={1}
                            value={[machineLearningData.trainingHoursPerCustomer]}
                            onValueChange={(value) => handleInputChange('trainingHoursPerCustomer', value[0])}
                        />
                        <Input
                            type="number"
                            value={machineLearningData.trainingHoursPerCustomer}
                            onChange={(e) => handleInputChange('trainingHoursPerCustomer', e.target.value)}
                            className="mt-2"
                        />
                    </div>
                    <div>
                        <Label htmlFor="retraining-hours">Retraining session duration (hour)</Label>
                        <Slider
                            id="retraining-hours"
                            min={1}
                            max={50}
                            step={1}
                            value={[machineLearningData.retrainingHoursPerCustomer]}
                            onValueChange={(value) => handleInputChange('retrainingHoursPerCustomer', value[0])}
                        />
                        <Input
                            type="number"
                            value={machineLearningData.retrainingHoursPerCustomer}
                            onChange={(e) => handleInputChange('retrainingHoursPerCustomer', e.target.value)}
                            className="mt-2"
                        />
                    </div>
                    <div>
                        <Label htmlFor="retraining-percentage"> Customers retraining percentage monthly (%)</Label>
                        <Slider
                            id="retraining-percentage"
                            min={0}
                            max={100}
                            step={5}
                            value={[machineLearningData.retrainingPercentage]}
                            onValueChange={(value) => handleInputChange('retrainingPercentage', value[0])}
                        />
                        <Input
                            type="number"
                            value={machineLearningData.retrainingPercentage}
                            onChange={(e) => handleInputChange('retrainingPercentage', e.target.value)}
                            className="mt-2"
                        />
                    </div>
                    <div>
                        <Label htmlFor="inference-hours">Inference cluster daily usage (hours)</Label>
                        <Slider
                            id="inference-hours"
                            min={1}
                            max={24}
                            step={1}
                            value={[machineLearningData.inferenceHoursPerDay]}
                            onValueChange={(value) => handleInputChange('inferenceHoursPerDay', value[0])}
                        />
                        <Input
                            type="number"
                            value={machineLearningData.inferenceHoursPerDay}
                            onChange={(e) => handleInputChange('inferenceHoursPerDay', e.target.value)}
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
                            <Label>Initial training Cost per MW</Label>
                            <p className="text-2xl font-bold">${cost.initialtrainingCostPerMW.toFixed(2)}</p>
                        </div>
                        <div>
                            <Label>Training Initial Cost</Label>
                            <p className="text-2xl font-bold">${cost.trainingInitialCost.toFixed(2)}</p>
                        </div>
                        <div>
                            <Label>Retraining Monthly Cost</Label>
                            <p className="text-2xl font-bold">${cost.trainingMonthlyCost.toFixed(2)}</p>
                        </div>
                        <div>
                            <Label>Inference Monthly Cost</Label>
                            <p className="text-2xl font-bold">${cost.inferenceMonthlyCost.toFixed(2)}</p>
                        </div>
                        <div className="col-span-2">
                            <Label>Total Monthly Cost (exclude initial cost)</Label>
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
                            <AccordionTrigger>Resource Units</AccordionTrigger>
                            <AccordionContent>
                                <ul className="list-disc pl-5 space-y-2 text-left">
                                    <li>Training cluster: NC16as T4 v3 (16vCPU 110GB RAM, 352GB Temp Storage, 16GB GPU)</li>
                                    <li>Inference cluster: D32sv v3 (32vCPU, 128GB RAM, 256 GB temp storage)</li>
                                </ul>
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-2">
                            <AccordionTrigger>Pricing</AccordionTrigger>
                            <AccordionContent>
                                <ul className="list-disc pl-5 space-y-2 text-left">
                                    <li>Training cluster: $1.51 per hour</li>
                                    <li>Inference cluster: $1.92 per hour</li>
                                </ul>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </CardContent>
            </Card>
        </>
    );
};

export default MachineLearning;