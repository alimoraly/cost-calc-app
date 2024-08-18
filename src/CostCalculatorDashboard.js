// src/CostCalculatorDashboard.js

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Tabs, TabsContent } from './components/ui/tabs';
import { Switch } from './components/ui/switch';
import IntegratedTabsAndSwitches from './components/ui/IntegratedTabsAndSwitches';
import { Card, CardContent } from './components/ui/card';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from './components/ui/accordion';
import { ChevronDown, ChevronUp, Settings } from 'lucide-react';

import { EventHubs } from './components/stages/EventHubs';
import { DataLake } from './components/stages/DataLake';
import { Databricks } from './components/stages/Databricks';
import { CosmosDB } from './components/stages/CosmosDB';
import CostDistributionPieChart from './components/charts/CostDistributionPieChart';
import AccumulativeCostChart from './components/charts/AccumulativeCostChart';
import { MachineLearning } from './components/stages/MachineLearning';
import TotalCostSummary from './components/TotalCostSummary';

import { useEventHubsCalculator } from './hooks/useEventHubsCalculator';
import { useDataLakeCalculator } from './hooks/useDataLakeCalculator';
import { useDatabricksCalculator } from './hooks/useDatabricksCalculator';
import { useCosmosDBCalculator } from './hooks/useCosmosDBCalculator';
import { useMachineLearningCalculator } from './hooks/useMachineLearningCalculator';
import { useCostTracker } from './components/useCostTracker';

const CostCalculatorDashboard = () => {
  const stages = ['Event Hubs', 'Data Lake', 'Databricks', 'Cosmos DB', 'Machine Learning'];

  const [showConfiguration, setShowConfiguration] = useState(false);

  const [activeTab, setActiveTab] = useState('event-hubs');
  const [activeStages, setActiveStages] = useState(stages.reduce((acc, stage) => ({ ...acc, [stage]: true }), {}));
  const [previousTotalCost, setPreviousTotalCost] = useState(0);
  const [eventHubsData, setEventHubsData] = useState({
    updatesPerSecond: 33,
    bytesPerUpdate: 4,
    totalMW: 280,
    hoursDay: 12
  });

  const [dataLakeData, setDataLakeData] = useState({
    silverExpansionFactor: 2,
    goldExpansionFactor: 1.5,
    manualBronzeStorageGB: 100
  });

  const [databricksData, setDatabricksData] = useState({
    xb: 15, // Minutes between Delta Live Tables job triggers
    dr: 10, // Running duration of each job in minutes 
    dt: 12, // Hours per day the VM is running
    ds: 1, // Number of SQL Compute Cluster instances
    dm: 5 // SQL Compute Cluster running duration in minutes
  });

  const [cosmosDBData, setCosmosDBData] = useState({
    requestsPerSecond: 1000,
    hoursPerDay: 12,
    expectedUtilization: 70,
    dataVolumeFactor: 1
  });

  const [machineLearningData, setMachineLearningData] = useState({
    trainingHoursPerCustomer: 24,
    customersNumbers: 10,
    retrainingFrequency: 1,
    retrainingHoursPerCustomer: 10,
    retrainingPercentage: 50,
    inferenceHoursPerDay: 24
  });


  // Initialize hooks for all stages
  const eventHubsCalc = useEventHubsCalculator(activeStages['Event Hubs'], eventHubsData);
  const dataLakeCalc = useDataLakeCalculator(eventHubsData, activeStages['Event Hubs'], activeStages['Data Lake'], dataLakeData);
  const databricksCalc = useDatabricksCalculator(activeStages['Databricks'], databricksData);
  const cosmosDBCalc = useCosmosDBCalculator(activeStages['Cosmos DB'], dataLakeCalc.dataLakeCost.goldStorageGB, cosmosDBData);
  const machineLearningCalc = useMachineLearningCalculator(activeStages['Machine Learning'], eventHubsData.totalMW, machineLearningData);

  const { currentCost, updateCost, getChangePercentage } = useCostTracker(0);

  const toggleStage = (stage) => {
    setActiveStages(prev => ({ ...prev, [stage]: !prev[stage] }));
  };

  const costDistribution = useMemo(() => [
    { name: 'Event Hubs', value: eventHubsCalc.eventHubsCost.totalMonthlyCost },
    { name: 'Data Lake', value: dataLakeCalc.dataLakeCost.totalMonthlyCost },
    { name: 'Databricks', value: databricksCalc.databricksCost.totalMonthlyCost },
    { name: 'Cosmos DB', value: cosmosDBCalc.cosmosDBCost.totalMonthlyCost },
    { name: 'Machine Learning', value: machineLearningCalc.mlCost.totalMonthlyCost },
  ].filter(item => activeStages[item.name]), [eventHubsCalc, dataLakeCalc, databricksCalc, cosmosDBCalc, machineLearningCalc, activeStages]);

  const generateAccumulativeCostData = useMemo(() => {
    const monthlyData = Array.from({ length: 12 }, (_, i) => ({
      month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i],
      'Event Hubs': 0,
      'Data Lake': 0,
      'Databricks': 0,
      'Cosmos DB': 0,
      'Machine Learning': 0,
    }));

    monthlyData.forEach((month, index) => {
      costDistribution.forEach(item => {
        if (activeStages[item.name]) {
          const monthlyCost = item.value;
          month[item.name] = (index > 0 ? monthlyData[index - 1][item.name] : 0) + monthlyCost;
        }
      });
    });

    return monthlyData;
  }, [costDistribution, activeStages]);

  const totalMonthlyCost = useMemo(() => {
    return costDistribution.reduce((total, item) => total + item.value, 0);
  }, [costDistribution]);

  useEffect(() => {
    console.log('Calculated total monthly cost:', totalMonthlyCost);
    updateCost(totalMonthlyCost);
  }, [totalMonthlyCost, updateCost]);

  const totalAnnualCost = useMemo(() => totalMonthlyCost * 12, [totalMonthlyCost]);

  const memoizedGetChangePercentage = useCallback(() => {
    const percentage = getChangePercentage();
    console.log('Change percentage:', percentage);
    return percentage;
  }, [getChangePercentage]);

  return (
    <div className="container mx-auto p-4 space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2">AI Backend Cost Analysis</h1>
        <p className="text-lg text-gray-600">Estimate and analyze costs for your Azure infrastructure across different stages of the data pipeline.</p>
      </div>

      <TotalCostSummary
        monthlyCost={totalMonthlyCost}
        annualCost={totalAnnualCost}
        getChangePercentage={memoizedGetChangePercentage}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CostDistributionPieChart costDistribution={costDistribution} />
        <AccumulativeCostChart accumulativeCostData={generateAccumulativeCostData} stages={stages} />
      </div>

      <Card className="shadow-lg">
        <CardContent className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Configure Services</h2>
          <Accordion type="single" collapsible className="w-full space-y-2">
            {stages.map((stage) => (
              <AccordionItem
                key={stage}
                value={stage.toLowerCase().replace(' ', '-')}
                className="border rounded-lg overflow-hidden"
              >
                <AccordionTrigger className="px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors flex justify-between items-center">
                  <div className="flex items-center flex-grow">
                    <span className="text-lg font-medium">{stage}</span>
                  </div>
                  <Switch
                    checked={activeStages[stage]}
                    onCheckedChange={() => toggleStage(stage)}
                    className="mr-4"
                  />                  
                </AccordionTrigger>
                <AccordionContent className="px-4 py-3 bg-white">
                  {stage === 'Event Hubs' && (
                    <EventHubs
                      isActive={activeStages['Event Hubs']}
                      eventHubsData={eventHubsData}
                      setEventHubsData={setEventHubsData}
                      cost={eventHubsCalc.eventHubsCost}
                    />
                  )}
                  {stage === 'Data Lake' && (
                    <DataLake
                      isActive={activeStages['Data Lake']}
                      isEventHubsActive={activeStages['Event Hubs']}
                      eventHubsData={eventHubsData}
                      dataLakeData={dataLakeData}
                      setDataLakeData={setDataLakeData}
                      cost={dataLakeCalc.dataLakeCost}
                    />
                  )}
                  {stage === 'Databricks' && (
                    <Databricks
                      isActive={activeStages['Databricks']}
                      databricksData={databricksData}
                      setDatabricksData={setDatabricksData}
                      cost={databricksCalc.databricksCost}
                    />
                  )}
                  {stage === 'Cosmos DB' && (
                    <CosmosDB
                      isActive={activeStages['Cosmos DB']}
                      goldStorageGB={dataLakeCalc.dataLakeCost.goldStorageGB}
                      cosmosDBData={cosmosDBData}
                      setCosmosDBData={setCosmosDBData}
                      cost={cosmosDBCalc.cosmosDBCost}
                    />
                  )}
                  {stage === 'Machine Learning' && (
                    <MachineLearning
                      isActive={activeStages['Machine Learning']}
                      totalMW={eventHubsData.totalMW}
                      machineLearningData={machineLearningData}
                      setMachineLearningData={setMachineLearningData}
                      cost={machineLearningCalc.mlCost}
                    />
                  )}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
};

export default React.memo(CostCalculatorDashboard);