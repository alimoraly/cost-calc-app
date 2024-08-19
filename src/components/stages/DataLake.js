// src/components/stages/DataLake.js


import React from 'react';
import { Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Slider } from '../ui/slider';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';

export const DataLake = ({ isActive, isEventHubsActive, dataLakeData, setDataLakeData, cost }) => {
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
        setDataLakeData({ ...dataLakeData, [key]: Number(value) });
    };

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>Configuration</CardTitle>
                    <CardDescription>Adjust parameters to calculate costs</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {!isEventHubsActive && (
                        <div>
                            <Label htmlFor="manual-bronze">Manual Bronze Storage (GB)</Label>
                            <Slider
                                id="manual-bronze"
                                min={0}
                                max={1000}
                                step={1}
                                value={[dataLakeData.manualBronzeStorageGB]}
                                onValueChange={(value) => handleInputChange('manualBronzeStorageGB', value[0])}
                            />
                            <Input
                                type="number"
                                value={dataLakeData.manualBronzeStorageGB}
                                onChange={(e) => handleInputChange('manualBronzeStorageGB', e.target.value)}
                                className="mt-2"
                            />
                        </div>
                    )}
                    <div>
                        <Label htmlFor="silver-expansion">Silver Storage Expansion Factor</Label>
                        <Slider
                            id="silver-expansion"
                            min={1}
                            max={50}
                            step={0.1}
                            value={[dataLakeData.silverExpansionFactor]}
                            onValueChange={(value) => handleInputChange('silverExpansionFactor', value[0])}
                        />
                        <Input
                            type="number"
                            value={dataLakeData.silverExpansionFactor}
                            onChange={(e) => handleInputChange('silverExpansionFactor', e.target.value)}
                            className="mt-2"
                        />
                    </div>
                    <div>
                        <Label htmlFor="gold-expansion">Gold Storage Expansion Factor</Label>
                        <Slider
                            id="gold-expansion"
                            min={1}
                            max={10}
                            step={0.1}
                            value={[dataLakeData.goldExpansionFactor]}
                            onValueChange={(value) => handleInputChange('goldExpansionFactor', value[0])}
                        />
                        <Input
                            type="number"
                            value={dataLakeData.goldExpansionFactor}
                            onChange={(e) => handleInputChange('goldExpansionFactor', e.target.value)}
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
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <Label>Bronze Storage</Label>
                            <p className="text-2xl font-bold">{cost.bronzeStorageGB.toFixed(2)} GB</p>
                        </div>
                        <div>
                            <Label>Silver Storage</Label>
                            <p className="text-2xl font-bold">{cost.silverStorageGB.toFixed(2)} GB</p>
                        </div>
                        <div>
                            <Label>Gold Storage</Label>
                            <p className="text-2xl font-bold">{cost.goldStorageGB.toFixed(2)} GB</p>
                        </div>
                        <div>
                            <Label>Total Storage</Label>
                            <p className="text-2xl font-bold">{cost.totalStorageGB.toFixed(2)} GB</p>
                        </div>
                        <div>
                            <Label>Storage Cost</Label>
                            <p className="text-2xl font-bold">${cost.storageCost.toFixed(2)}</p>
                        </div>
                        <div>
                            <Label>Operations Cost</Label>
                            <p className="text-2xl font-bold">
                                ${(cost.writeOperationsCost + cost.readOperationsCost).toFixed(2)}
                            </p>
                        </div>
                        <div className="col-span-3">
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
                            <AccordionTrigger>Azure Data Lake Storage Gen2 (ADLS2)</AccordionTrigger>
                            <AccordionContent>
                                <ul className="list-disc pl-5 space-y-2 text-left">
                                    <li>Premium Tier</li>
                                    <li>Zone-redundant storage (ZRS)</li>
                                </ul>
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-2">
                            <AccordionTrigger>Pricing</AccordionTrigger>
                            <AccordionContent>
                                <ul className="list-disc pl-5 space-y-2 text-left">
                                    <li>$26 per 100 GB per month</li>
                                    <li>$0.0394 per 10,000 write operations. For simplicity, operations cost shown for 10 Million write operations per month</li>
                                    <li>$0.0031 per 10,000 read operations. For simplicity, operations cost show for 100 Million read operations per month</li>
                                    <li></li>
                                </ul>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </CardContent>
            </Card>
        </>
    );
};

export default DataLake;