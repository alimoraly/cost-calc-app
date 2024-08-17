import React from 'react';
import { Card, CardContent } from './card';
import { Tabs, TabsList, TabsTrigger } from './tabs';
import { Switch } from './switch';
import { Label } from './label';

const IntegratedTabsAndSwitches = ({ stages, activeStages, toggleStage, setActiveTab }) => {
    return (
        <Card className="mb-8">
            <CardContent className="pt-6">
                <Tabs defaultValue="event-hubs" className="w-full">
                    <TabsList className="grid w-full grid-cols-5 mb-4">
                        {stages.map((stage, index) => (
                            <TabsTrigger
                                key={stage}
                                value={stage.toLowerCase().replace(' ', '-')}
                                onClick={() => setActiveTab(stage.toLowerCase().replace(' ', '-'))}
                                className={!activeStages[stage] ? 'opacity-50' : ''}
                            >
                                {index + 1}. {stage}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                    <div className="grid grid-cols-5 gap-4 mt-2">
                        {stages.map((stage) => (
                            <div key={stage} className="flex flex-col items-center justify-center">
                                <Switch
                                    id={`stage-${stage}`}
                                    checked={activeStages[stage]}
                                    onCheckedChange={() => toggleStage(stage)}
                                />
                                <Label htmlFor={`stage-${stage}`} className="mt-2 text-sm">
                                    {stage}
                                </Label>
                            </div>
                        ))}
                    </div>
                </Tabs>
            </CardContent>
        </Card>
    );
};

export default IntegratedTabsAndSwitches;