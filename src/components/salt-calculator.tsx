"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCallback, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// Federal tax brackets for 2024 (can be easily updated)
const federalTaxBrackets = {
  single: [
    { min: 0, max: 11000, rate: 0.1 },
    { min: 11000, max: 44725, rate: 0.12 },
    { min: 44725, max: 95375, rate: 0.22 },
    { min: 95375, max: 182050, rate: 0.24 },
    { min: 182050, max: 231250, rate: 0.32 },
    { min: 231250, max: 578125, rate: 0.35 },
    { min: 578125, max: Infinity, rate: 0.37 },
  ],
  marriedJointly: [
    { min: 0, max: 22000, rate: 0.1 },
    { min: 22000, max: 89450, rate: 0.12 },
    { min: 89450, max: 190750, rate: 0.22 },
    { min: 190750, max: 364200, rate: 0.24 },
    { min: 364200, max: 462500, rate: 0.32 },
    { min: 462500, max: 693750, rate: 0.35 },
    { min: 693750, max: Infinity, rate: 0.37 },
  ],
  marriedSeparately: [
    { min: 0, max: 11000, rate: 0.1 },
    { min: 11000, max: 44725, rate: 0.12 },
    { min: 44725, max: 95375, rate: 0.22 },
    { min: 95375, max: 182100, rate: 0.24 },
    { min: 182100, max: 231250, rate: 0.32 },
    { min: 231250, max: 346875, rate: 0.35 },
    { min: 346875, max: Infinity, rate: 0.37 },
  ],
  headOfHousehold: [
    { min: 0, max: 15700, rate: 0.1 },
    { min: 15700, max: 59850, rate: 0.12 },
    { min: 59850, max: 95350, rate: 0.22 },
    { min: 95350, max: 182050, rate: 0.24 },
    { min: 182050, max: 231250, rate: 0.32 },
    { min: 231250, max: 578100, rate: 0.35 },
    { min: 578100, max: Infinity, rate: 0.37 },
  ],
};

// State tax information (simplified estimates)
const statesTaxInfo = {
  Alabama: { rate: 0.05, hasStateTax: true },
  Alaska: { rate: 0, hasStateTax: false },
  Arizona: { rate: 0.045, hasStateTax: true },
  Arkansas: { rate: 0.055, hasStateTax: true },
  California: { rate: 0.093, hasStateTax: true },
  Colorado: { rate: 0.0455, hasStateTax: true },
  Connecticut: { rate: 0.07, hasStateTax: true },
  Delaware: { rate: 0.066, hasStateTax: true },
  Florida: { rate: 0, hasStateTax: false },
  Georgia: { rate: 0.0575, hasStateTax: true },
  Hawaii: { rate: 0.08, hasStateTax: true },
  Idaho: { rate: 0.058, hasStateTax: true },
  Illinois: { rate: 0.0495, hasStateTax: true },
  Indiana: { rate: 0.032, hasStateTax: true },
  Iowa: { rate: 0.06, hasStateTax: true },
  Kansas: { rate: 0.057, hasStateTax: true },
  Kentucky: { rate: 0.045, hasStateTax: true },
  Louisiana: { rate: 0.04, hasStateTax: true },
  Maine: { rate: 0.075, hasStateTax: true },
  Maryland: { rate: 0.0575, hasStateTax: true },
  Massachusetts: { rate: 0.05, hasStateTax: true },
  Michigan: { rate: 0.0425, hasStateTax: true },
  Minnesota: { rate: 0.0985, hasStateTax: true },
  Mississippi: { rate: 0.05, hasStateTax: true },
  Missouri: { rate: 0.054, hasStateTax: true },
  Montana: { rate: 0.0675, hasStateTax: true },
  Nebraska: { rate: 0.0684, hasStateTax: true },
  Nevada: { rate: 0, hasStateTax: false },
  "New Hampshire": { rate: 0, hasStateTax: false },
  "New Jersey": { rate: 0.1075, hasStateTax: true },
  "New Mexico": { rate: 0.049, hasStateTax: true },
  "New York": { rate: 0.109, hasStateTax: true },
  "North Carolina": { rate: 0.0475, hasStateTax: true },
  "North Dakota": { rate: 0.029, hasStateTax: true },
  Ohio: { rate: 0.0385, hasStateTax: true },
  Oklahoma: { rate: 0.05, hasStateTax: true },
  Oregon: { rate: 0.099, hasStateTax: true },
  Pennsylvania: { rate: 0.0307, hasStateTax: true },
  "Rhode Island": { rate: 0.0599, hasStateTax: true },
  "South Carolina": { rate: 0.065, hasStateTax: true },
  "South Dakota": { rate: 0, hasStateTax: false },
  Tennessee: { rate: 0, hasStateTax: false },
  Texas: { rate: 0, hasStateTax: false },
  Utah: { rate: 0.0485, hasStateTax: true },
  Vermont: { rate: 0.086, hasStateTax: true },
  Virginia: { rate: 0.0575, hasStateTax: true },
  Washington: { rate: 0, hasStateTax: false },
  "West Virginia": { rate: 0.065, hasStateTax: true },
  Wisconsin: { rate: 0.0765, hasStateTax: true },
  Wyoming: { rate: 0, hasStateTax: false },
};

const filingStatuses = [
  { value: "single", label: "Single" },
  { value: "marriedJointly", label: "Married Filing Jointly" },
  { value: "marriedSeparately", label: "Married Filing Separately" },
  { value: "headOfHousehold", label: "Head of Household" },
];

type FilingStatus = keyof typeof federalTaxBrackets;

export default function SaltCalculator() {
  const [agi, setAgi] = useState<string>("");
  const [filingStatus, setFilingStatus] = useState<FilingStatus>("single");
  const [selectedState, setSelectedState] = useState<string>("");
  const [estimatedStateTax, setEstimatedStateTax] = useState<string>("");
  const [estimatedFederalTax, setEstimatedFederalTax] = useState<string>("");
  const [showResults, setShowResults] = useState(false);

  const calculateFederalTax = (
    income: number,
    status: FilingStatus,
  ): number => {
    const brackets = federalTaxBrackets[status];
    let totalTax = 0;

    for (const bracket of brackets) {
      if (income <= bracket.min) break;

      const taxableInThisBracket = Math.min(income, bracket.max) - bracket.min;
      totalTax += taxableInThisBracket * bracket.rate;
    }

    return totalTax;
  };

  const estimateStateTax = (income: number, state: string): number => {
    const stateInfo = statesTaxInfo[state as keyof typeof statesTaxInfo];
    if (!stateInfo || !stateInfo.hasStateTax) return 0;

    // Simplified calculation - in reality this would need brackets too
    // This is a rough estimate using effective rate
    return income * stateInfo.rate * 0.8; // Assume 80% effective rate
  };

  const handleCalculate = useCallback(() => {
    if (!agi || !selectedState) return;

    const agiNum = parseFloat(agi);
    const baseFederalTax = calculateFederalTax(agiNum, filingStatus);
    const baseStateTax = estimateStateTax(agiNum, selectedState);

    setEstimatedFederalTax(baseFederalTax.toFixed(0));
    setEstimatedStateTax(baseStateTax.toFixed(0));
    setShowResults(true);
  }, [agi, selectedState, filingStatus]);

  const getChartData = () => {
    if (!estimatedFederalTax || !estimatedStateTax) return [];

    const federalTax = parseFloat(estimatedFederalTax);
    const stateTax = parseFloat(estimatedStateTax);

    // Calculate total tax for each scenario
    const noCapTotal = federalTax + stateTax - stateTax * 0.22; // Full deduction
    const cap10kTotal =
      federalTax + stateTax - Math.min(stateTax, 10000) * 0.22;
    const cap40kTotal =
      federalTax + stateTax - Math.min(stateTax, 40000) * 0.22;

    return [
      {
        scenario: "No Cap",
        totalTax: Math.round(noCapTotal),
        saltDeduction: Math.round(stateTax),
        taxSavings: Math.round(stateTax * 0.22),
      },
      {
        scenario: "Current ($10k Cap)",
        totalTax: Math.round(cap10kTotal),
        saltDeduction: Math.round(Math.min(stateTax, 10000)),
        taxSavings: Math.round(Math.min(stateTax, 10000) * 0.22),
      },
      {
        scenario: "Proposed ($40k Cap)",
        totalTax: Math.round(cap40kTotal),
        saltDeduction: Math.round(Math.min(stateTax, 40000)),
        taxSavings: Math.round(Math.min(stateTax, 40000) * 0.22),
      },
    ];
  };

  const chartData = getChartData();

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">SALT Deduction Calculator</h1>
        <p className="text-muted-foreground">
          Calculate how the State and Local Tax (SALT) deduction cap affects
          your tax burden
        </p>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Your Information</CardTitle>
          <CardDescription>
            Enter your tax information to see the impact of different SALT cap
            scenarios
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <Label htmlFor="agi">Adjusted Gross Income (AGI)</Label>
              <Input
                id="agi"
                type="number"
                placeholder="150000"
                value={agi}
                onChange={(e) => setAgi(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="filing-status">Filing Status</Label>
              <Select
                value={filingStatus}
                onValueChange={(value: FilingStatus) => setFilingStatus(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select filing status" />
                </SelectTrigger>
                <SelectContent>
                  {filingStatuses.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="state">State</Label>
              <Select value={selectedState} onValueChange={setSelectedState}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your state" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(statesTaxInfo).map((state) => (
                    <SelectItem key={state} value={state}>
                      {state}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            onClick={handleCalculate}
            className="w-full"
            disabled={!agi || !selectedState}
          >
            Show Me the Impact
          </Button>
        </CardContent>
      </Card>

      {showResults && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Estimated State Tax</CardTitle>
                <CardDescription>
                  You can edit this value for more accuracy
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Input
                  type="number"
                  value={estimatedStateTax}
                  onChange={(e) => setEstimatedStateTax(e.target.value)}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Estimated Federal Tax (before deductions)</CardTitle>
                <CardDescription>
                  You can edit this value for more accuracy
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Input
                  type="number"
                  value={estimatedFederalTax}
                  onChange={(e) => setEstimatedFederalTax(e.target.value)}
                />
              </CardContent>
            </Card>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>SALT Deduction Comparison</CardTitle>
              <CardDescription>
                See how different SALT cap scenarios affect your total tax
                burden
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="scenario" />
                    <YAxis />
                    <Tooltip
                      formatter={(value, name) => [
                        `$${value.toLocaleString()}`,
                        name === "totalTax"
                          ? "Total Tax"
                          : name === "saltDeduction"
                          ? "SALT Deduction"
                          : "Tax Savings",
                      ]}
                    />
                    <Bar dataKey="totalTax" fill="#8884d8" name="totalTax" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-6 space-y-4">
                {chartData.map((data, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-4 bg-muted rounded-lg"
                  >
                    <div>
                      <h3 className="font-semibold">{data.scenario}</h3>
                      <p className="text-sm text-muted-foreground">
                        SALT Deduction: ${data.saltDeduction.toLocaleString()} |
                        Tax Savings: ${data.taxSavings.toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold">
                        ${data.totalTax.toLocaleString()}
                      </p>
                      <p className="text-sm text-muted-foreground">Total Tax</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
