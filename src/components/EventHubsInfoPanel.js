import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { Info } from 'lucide-react';

const EventHubsInfoPanel = () => {
    return (
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
    );
};

export default EventHubsInfoPanel;