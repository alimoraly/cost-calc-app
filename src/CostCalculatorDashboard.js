import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './components/ui/card';
import { Input } from './components/ui/input';
import { Label } from './components/ui/label';
import { Slider } from './components/ui/slider';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Tabs, TabsContent } from './components/ui/tabs';
import EventHubsInfoPanel from './components/EventHubsInfoPanel';
import IntegratedTabsAndSwitches from './components/ui/IntegratedTabsAndSwitches';

const CostCalculatorDashboard = () => {
  const [updatesPerSecond, setUpdatesPerSecond] = useState(33);
  const [bytesPerUpdate, setBytesPerUpdate] = useState(4);
  const [totalMW, setTotalMW] = useState(280);
  const [hoursDay, setHoursDaily] = useState(12);
  const [costDistribution, setCostDistribution] = useState([
    { name: 'Event Hubs', value: 400 },
    { name: 'Data Lake', value: 300 },
    { name: 'Databricks', value: 300 },
    { name: 'Cosmos DB', value: 200 },
    { name: 'Machine Learning', value: 100 },
  ]);
  const [accumulativeCostData, setAccumulativeCostData] = useState([]);
  const [eventHubsCost, setEventHubsCost] = useState({
    throughputUnits: 0,
    hourlyCost: 0,
    ThroughputUnitMonthlyCost: 0,
    ingressCostPerMonth: 0,
    totalMonthlyCost: 0
  });

  const stages = ['Event Hubs', 'Data Lake', 'Databricks', 'Cosmos DB', 'Machine Learning'];
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  const [activeTab, setActiveTab] = useState('event-hubs');
  const [activeStages, setActiveStages] = useState(stages.reduce((acc, stage) => ({ ...acc, [stage]: true }), {}));

  const toggleStage = (stage) => {
    setActiveStages(prev => ({ ...prev, [stage]: !prev[stage] }));
  };

  const calculateEventHubsCost = useCallback(() => {
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

    const newCostDistribution = costDistribution.map(item =>
      item.name === 'Event Hubs' ? { ...item, value: totalMonthlyCost } : item
    );

    return {
      throughputUnits,
      hourlyCost,
      ThroughputUnitMonthlyCost,
      ingressCostPerMonth,
      totalMonthlyCost,
      newCostDistribution
    };
  }, [updatesPerSecond, bytesPerUpdate, totalMW, hoursDay, costDistribution]);

  const randomFactors = useMemo(() =>
    Array.from({ length: 12 }, () => 1 + Math.random() * 0.1),
    []
  );

  const generateAccumulativeCostData = useCallback(() => {
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
          const monthlyCost = item.value * randomFactors[index];
          month[item.name] = (index > 0 ? monthlyData[index - 1][item.name] : 0) + monthlyCost;
        }
      });
    });

    return monthlyData;
  }, [costDistribution, randomFactors, activeStages]);

  useEffect(() => {
    const { newCostDistribution, ...cost } = calculateEventHubsCost();
    setEventHubsCost(cost);
    setCostDistribution(newCostDistribution);
  }, [calculateEventHubsCost]);

  useEffect(() => {
    setAccumulativeCostData(generateAccumulativeCostData());
  }, [generateAccumulativeCostData]);

  
  const renderStageContent = (stage) => {
    switch (stage) {
      case 'Event Hubs':
        return (
          <div className="space-y-4">
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
                  onValueChange={(value) => setHoursDaily(value[0])}
                />
                <Input
                  id="hours-daily"
                  type="number"
                  value={hoursDay}
                  onChange={(e) => setHoursDaily(Number(e.target.value))}
                  className="mt-2"
                />
              </div>
            </div>
          </div>
        );
      case 'Data Lake':
        return (
          <div className="space-y-4">
            <p>Data Lake specific configuration options will be shown here.</p>
            {/* Add Data Lake specific inputs */}
          </div>
        );
      case 'Databricks':
        return (
          <div className="space-y-4">
            <p>Databricks specific configuration options will be shown here.</p>
            {/* Add Databricks specific inputs */}
          </div>
        );
      case 'Cosmos DB':
        return (
          <div className="space-y-4">
            <p>Cosmos DB specific configuration options will be shown here.</p>
            {/* Add Cosmos DB specific inputs */}
          </div>
        );
      case 'Machine Learning':
        return (
          <div className="space-y-4">
            <p>Machine Learning specific configuration options will be shown here.</p>
            {/* Add Machine Learning specific inputs */}
          </div>
        );
      default:
        return <p>Configure {stage} parameters here</p>;
    }
  };

  const renderStageSummary = (stage) => {
    switch (stage) {
      case 'Event Hubs':
        return (
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
        );      // Add cases for other stages with their specific summary information
      default:
        return <p>Summary for {stage} will be shown here.</p>;
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Azure Cost Calculator</h1>
      <p className="text-lg mb-8">Estimate and analyze costs for your Azure infrastructure across different stages of your data pipeline.</p>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <IntegratedTabsAndSwitches
          stages={stages}
          activeStages={activeStages}
          toggleStage={toggleStage}
          setActiveTab={setActiveTab}
        />
        {stages.map((stage) => (
          <TabsContent key={stage} value={stage.toLowerCase().replace(' ', '-')}>
            <Card>
              <CardHeader>
                <CardTitle>{stage} Configuration</CardTitle>
                <CardDescription>Adjust parameters to calculate costs for {stage}.</CardDescription>
              </CardHeader>
              <CardContent>
                {activeStages[stage] ? renderStageContent(stage) : (
                  <p className="text-muted-foreground">This stage is currently disabled. Enable it in Stage Management to configure.</p>
                )}
              </CardContent>
            </Card>
            {stage === 'Event Hubs' && <EventHubsInfoPanel />}

            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Real-time Cost Summary</CardTitle>
                <CardDescription>Current stage: {stage}</CardDescription>
              </CardHeader>
              <CardContent>
                {activeStages[stage] ? renderStageSummary(stage) : (
                  <p className="text-muted-foreground">This stage is currently disabled. Enable it to view the cost summary.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Cost Distribution</CardTitle>
            <CardDescription>Breakdown of costs across all stages</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={costDistribution.filter(item => activeStages[item.name])}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value, percent }) => `${name} $${value.toFixed(2)} (${(percent * 100).toFixed(0)}%)`}
                >
                  {costDistribution.filter(item => activeStages[item.name]).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Accumulative Cost Over a Year</CardTitle>
            <CardDescription>Projected costs for each stage over 12 months</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={accumulativeCostData}>
                <XAxis dataKey="month" />
                <YAxis /> {/* Added YAxis */}
                <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                <Legend />
                {stages.map((stage, index) =>
                  activeStages[stage] && (
                    <Bar
                      key={stage}
                      dataKey={stage}
                      stackId="a"
                      fill={COLORS[index]}
                    />
                  )
                )}
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

    </div>
  );
};

export default CostCalculatorDashboard;