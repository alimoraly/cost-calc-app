import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './components/ui/card';
import { Input } from './components/ui/input';
import { Label } from './components/ui/label';
import { Slider } from './components/ui/slider';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import EventHubsInfoPanel from './components/EventHubsInfoPanel';

const CostCalculatorDashboard = () => {
  const [currentStage, setCurrentStage] = useState(0);
  const [updatesPerSecond, setUpdatesPerSecond] = useState(33);
  const [bytesPerUpdate, setBytesPerUpdate] = useState(4);
  const [totalMW, setTotalMW] = useState(280);
  const [hoursDay, sethoursDaily] = useState(12);

  const stages = ['Event Hubs', 'Data Lake', 'Databricks', 'Cosmos DB', 'Machine Learning'];
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  const calculateEventHubsCost = () => {
    const totalUpdatesPerSecond = updatesPerSecond * totalMW;
    const totalBytesPerSecond = totalUpdatesPerSecond * bytesPerUpdate;
    const mbPerSecond = totalBytesPerSecond / (1024 * 1024);

    const throughputUnits = Math.max(
      Math.ceil(mbPerSecond),
      Math.ceil(totalUpdatesPerSecond / 1000)
    );

    const hourlyCost = throughputUnits * 0.030;
    const ThroughputUnitMonthlyCost = hourlyCost * hoursDay * 30;
    const ingressCostPerMonth = (totalUpdatesPerSecond * 3600 * 24 * 30) / 1000000 * 0.028;

    const totalMonthlyCost = ThroughputUnitMonthlyCost + ingressCostPerMonth;

    return {
      throughputUnits,
      hourlyCost,
      ThroughputUnitMonthlyCost,
      ingressCostPerMonth,
      totalMonthlyCost
    };
  };


  // Mock data for charts
  const costDistributionData = [
    { name: 'Event Hubs', value: 400 },
    { name: 'Data Lake', value: 300 },
    { name: 'Databricks', value: 300 },
    { name: 'Cosmos DB', value: 200 },
    { name: 'Machine Learning', value: 100 },
  ];

  // Generate accumulative cost data for stacked bar chart
  const generateAccumulativeCostData = () => {
    const monthlyData = Array.from({ length: 12 }, (_, i) => ({
      month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i],
      'Event Hubs': 0,
      'Data Lake': 0,
      'Databricks': 0,
      'Cosmos DB': 0,
      'Machine Learning': 0,
    }));

    const stageNames = ['Event Hubs', 'Data Lake', 'Databricks', 'Cosmos DB', 'Machine Learning'];

    monthlyData.forEach((month, index) => {
      stageNames.forEach(stage => {
        const monthlyCost = Math.round(costDistributionData.find(item => item.name === stage).value * (1 + Math.random() * 0.1));
        month[stage] = (index > 0 ? monthlyData[index - 1][stage] : 0) + monthlyCost;
      });
    });

    return monthlyData;
  };

  // Call the calculation function
  const accumulativeCostData = generateAccumulativeCostData();
  const eventHubsCost = calculateEventHubsCost();

  const renderStageContent = (stage) => {
    switch (stage) {
      case 'Event Hubs':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="updates-per-second">Updates per second per MW</Label>
              <Slider
                defaultValue={[updatesPerSecond]}
                max={100}
                step={1}
                onValueChange={(value) => setUpdatesPerSecond(value[0])}
              />
              <Input
                id="updates-per-second"
                type="number"
                value={updatesPerSecond}
                onChange={(e) => setUpdatesPerSecond(Number(e.target.value))}
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="bytes-per-update">Bytes per update</Label>
              <Slider
                defaultValue={[bytesPerUpdate]}
                max={64}
                step={1}
                onValueChange={(value) => setBytesPerUpdate(value[0])}
              />
              <Input
                id="bytes-per-update"
                type="number"
                value={bytesPerUpdate}
                onChange={(e) => setBytesPerUpdate(Number(e.target.value))}
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="total-mw">Total MW managed</Label>
              <Slider
                defaultValue={[totalMW]}
                max={1000}
                step={10}
                onValueChange={(value) => setTotalMW(value[0])}
              />
              <Input
                id="total-mw"
                type="number"
                value={totalMW}
                onChange={(e) => setTotalMW(Number(e.target.value))}
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="hours-daily">Hours per day</Label>
              <Slider
                defaultValue={[hoursDay]}
                max={24}
                step={1}
                onValueChange={(value) => sethoursDaily(value[0])}
              />
              <Input
                id="hours-daily"
                type="number"
                value={hoursDay}
                onChange={(e) => sethoursDaily(Number(e.target.value))}
                className="mt-2"
              />
            </div>
          </div>
        );
      // Add cases for other stages
      default:
        return <p>Configure {stage} parameters here</p>;
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Azure Cost Calculator</h1>
      <p className="text-lg mb-8">Estimate and analyze costs for your Azure infrastructure across different stages of your data pipeline.</p>

      <Tabs defaultValue="event-hubs" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          {stages.map((stage, index) => (
            <TabsTrigger key={stage} value={stage.toLowerCase().replace(' ', '-')}>
              {index + 1}. {stage}
            </TabsTrigger>
          ))}
        </TabsList>

        {stages.map((stage, index) => (
          <TabsContent key={stage} value={stage.toLowerCase().replace(' ', '-')}>
            <Card>
              <CardHeader>
                <CardTitle>{stage} Configuration</CardTitle>
                <CardDescription>Adjust parameters to calculate costs for {stage}.</CardDescription>
              </CardHeader>
              <CardContent>
                {renderStageContent(stage)}
              </CardContent>
            </Card>
            <EventHubsInfoPanel />
          </TabsContent>
        ))}
      </Tabs>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Real-time Cost Summary</CardTitle>
            <CardDescription>Current stage: Event Hubs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Throughput Units</Label>
                <p className="text-2xl font-bold">{eventHubsCost.throughputUnits}</p>
              </div>
              <div>
                <Label>Hourly Cost</Label>
                <p className="text-2xl font-bold">${eventHubsCost.hourlyCost.toFixed(2)}</p>
              </div>
              <div>
                <Label>Monthly Throughput Cost</Label>
                <p className="text-2xl font-bold">${eventHubsCost.ThroughputUnitMonthlyCost.toFixed(2)}</p>
              </div>
              <div>
                <Label>Monthly Ingress Cost</Label>
                <p className="text-2xl font-bold">${eventHubsCost.ingressCostPerMonth.toFixed(2)}</p>
              </div>
              <div className="col-span-2">
                <Label>Total Monthly Cost</Label>
                <p className="text-3xl font-bold text-blue-600">${eventHubsCost.totalMonthlyCost.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cost Distribution</CardTitle>
            <CardDescription>Breakdown of costs across all stages</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={costDistributionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {costDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Accumulative Cost Over a Year</CardTitle>
          <CardDescription>Projected costs for each stage over 12 months</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={accumulativeCostData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
              <Legend />
              {stages.map((stage, index) => (
                <Bar
                  key={stage}
                  dataKey={stage}
                  stackId="a"
                  fill={COLORS[index]}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default CostCalculatorDashboard;
