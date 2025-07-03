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

// Import business logic and data
import {
  calculateFederalTax,
  calculateProposedSaltCap,
  estimateStateTax,
  generateSaltComparisonData,
  getEstimatedMarginalTaxRate,
} from "@/util/tax-calculations";
import {
  type FilingStatus,
  SALT_CAP_CONSTANTS,
  type StateName,
  filingStatuses,
  isAbovePhasedownThreshold,
  statesTaxInfo,
} from "@/util/tax-data";

export default function SaltCalculator() {
  const [agi, setAgi] = useState<string>("");
  const [filingStatus, setFilingStatus] = useState<FilingStatus>("single");
  const [selectedState, setSelectedState] = useState<string>("");
  const [estimatedStateTax, setEstimatedStateTax] = useState<string>("");
  const [estimatedFederalTax, setEstimatedFederalTax] = useState<string>("");
  const [showResults, setShowResults] = useState(false);

  const handleCalculate = useCallback(() => {
    if (!agi || !selectedState) return;

    const agiNum = parseFloat(agi);
    const baseFederalTax = calculateFederalTax(agiNum, filingStatus);
    const baseStateTax = estimateStateTax(
      agiNum,
      selectedState as StateName,
      filingStatus,
    );

    setEstimatedFederalTax(baseFederalTax.toFixed(0));
    setEstimatedStateTax(baseStateTax.toFixed(0));
    setShowResults(true);
  }, [agi, selectedState, filingStatus]);

  const getChartData = () => {
    if (!estimatedFederalTax || !estimatedStateTax) return [];

    const federalTax = parseFloat(estimatedFederalTax);
    const stateTax = parseFloat(estimatedStateTax);
    const agiNum = parseFloat(agi);

    // Use actual marginal tax rate for more accurate calculations
    const marginalTaxRate = getEstimatedMarginalTaxRate(agiNum, filingStatus);

    return generateSaltComparisonData(
      federalTax,
      stateTax,
      marginalTaxRate,
      agiNum,
      filingStatus,
    );
  };

  const chartData = getChartData();

  // Find the current $10k cap scenario for relative comparisons
  const currentCapData = chartData.find(
    (item) => item.scenario === "Current ($10k Cap)",
  );

  // Find the proposed scenario for summary
  const proposedCapData = chartData.find((item) =>
    item.scenario.includes("Proposed"),
  );

  // Generate summary text
  const getSummaryText = () => {
    if (!currentCapData || !proposedCapData || !agi) return null;

    const agiNum = parseFloat(agi);

    const formattedAgi = `$${agiNum.toLocaleString()}`;

    const currentTax = currentCapData.totalTax;
    const proposedTax = proposedCapData.totalTax;
    const difference = Math.abs(currentTax - proposedTax);
    const formattedDifference = `$${difference.toLocaleString()}`;

    if (difference === 0) {
      let summaryText = `With an income of ${formattedAgi}, this change in the proposed legislation does not affect you.`;

      // Add phaseout explanation even when there's no tax difference
      if (isAbovePhasedownThreshold(agiNum, filingStatus)) {
        const proposedCap = calculateProposedSaltCap(agiNum, filingStatus);

        if (proposedCap <= SALT_CAP_CONSTANTS.CURRENT_CAP) {
          summaryText += ` The new SALT cap is completely phased out at your income level, leaving you with the current $10k cap.`;
        } else {
          const capAmount = `$${Math.round(proposedCap / 1000)}k`;
          summaryText += ` Your effective SALT cap is ${capAmount} due to the phasedown provision for high-income earners.`;
        }
      }

      return summaryText;
    }

    const isLowerTax = proposedTax < currentTax;
    const direction = isLowerTax ? "lower" : "higher";

    let summaryText = `With an income of ${formattedAgi}, you will pay ${direction} taxes by ${formattedDifference} in the proposed legislation.`;

    // Add phaseout explanation if applicable
    if (isAbovePhasedownThreshold(agiNum, filingStatus)) {
      const proposedCap = calculateProposedSaltCap(agiNum, filingStatus);
      const capAmount = `$${Math.round(proposedCap / 1000)}k`;

      if (proposedCap <= SALT_CAP_CONSTANTS.CURRENT_CAP) {
        // Cap is completely phased out to current level
        summaryText += ` The new SALT cap is completely phased out at your income level, leaving you with the current $10k cap.`;
      } else {
        summaryText += ` Your effective SALT cap is ${capAmount} due to the phasedown provision for high-income earners.`;
      }
    }

    return summaryText;
  };

  const formatRelativeAmount = (
    amount: number,
    baseAmount: number,
    isForTotalTax: boolean = true,
  ) => {
    const difference = amount - baseAmount;
    if (difference === 0) return "";

    const sign = difference > 0 ? "+" : "-";
    const colorClass = isForTotalTax
      ? difference > 0
        ? "text-red-600"
        : "text-green-600" // Total tax: red for increase, green for decrease
      : difference > 0
      ? "text-green-600"
      : "text-red-600"; // Tax savings: green for more savings, red for less savings

    return (
      <span className={`text-sm ${colorClass} font-medium`}>
        ({sign}${Math.abs(difference).toLocaleString()})
      </span>
    );
  };

  // Calculate effective tax rates
  const calculateEffectiveTaxRate = (
    taxAmount: string,
    agiAmount: string,
  ): string => {
    const tax = parseFloat(taxAmount);
    const agiNum = parseFloat(agiAmount);

    if (!tax || !agiNum || agiNum === 0) return "0.00";

    const rate = (tax / agiNum) * 100;
    return rate.toFixed(2);
  };

  const stateEffectiveRate = calculateEffectiveTaxRate(estimatedStateTax, agi);
  const federalEffectiveRate = calculateEffectiveTaxRate(
    estimatedFederalTax,
    agi,
  );

  const summaryText = getSummaryText();

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">SALT Deduction Calculator</h1>
        <p className="text-muted-foreground">
          Calculate how the State and Local Tax (SALT) deduction cap affects
          your tax burden. The proposed $40k cap phases down by 30% of income
          over $500k (minimum $10k cap).
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
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                  $
                </span>
                <Input
                  id="agi"
                  type="number"
                  placeholder="150,000"
                  value={agi}
                  className="pl-8"
                  onChange={(e) => {
                    setAgi(e.target.value);
                    setShowResults(false);
                  }}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="filing-status">Filing Status</Label>
              <Select
                value={filingStatus}
                onValueChange={(value: FilingStatus) => {
                  setFilingStatus(value);
                  setShowResults(false);
                }}
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
              <Select
                value={selectedState}
                onValueChange={(value) => {
                  setSelectedState(value);
                  setShowResults(false);
                }}
              >
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
                <CardTitle>Estimated Federal Tax (before deductions)</CardTitle>
                <CardDescription>
                  You can edit this value for more accuracy
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                    $
                  </span>
                  <Input
                    type="number"
                    value={estimatedFederalTax}
                    className="pl-8"
                    onChange={(e) => setEstimatedFederalTax(e.target.value)}
                  />
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Effective tax rate: {federalEffectiveRate}%
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Estimated State Tax</CardTitle>
                <CardDescription>
                  You can edit this value for more accuracy
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                    $
                  </span>
                  <Input
                    type="number"
                    value={estimatedStateTax}
                    className="pl-8"
                    onChange={(e) => setEstimatedStateTax(e.target.value)}
                  />
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Effective tax rate: {stateEffectiveRate}%
                </p>
              </CardContent>
            </Card>
          </div>

          {summaryText && (
            <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
              <p className="text-foreground font-medium">{summaryText}</p>
            </div>
          )}

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
                      formatter={(value, name, props) => {
                        const displayName =
                          name === "totalTax"
                            ? "Total Tax"
                            : name === "saltDeduction"
                            ? "SALT Deduction"
                            : "Tax Savings";

                        const currentValue =
                          currentCapData?.[name as keyof typeof currentCapData];
                        const scenario = props?.payload?.scenario;

                        if (
                          scenario === "Current ($10k Cap)" ||
                          !currentValue
                        ) {
                          return [`$${value.toLocaleString()}`, displayName];
                        }

                        const difference = Number(value) - Number(currentValue);
                        const sign = difference > 0 ? "+" : "-";
                        const relativeText = ` (${sign}$${Math.abs(
                          difference,
                        ).toLocaleString()})`;

                        return [
                          `$${value.toLocaleString()}${relativeText}`,
                          displayName,
                        ];
                      }}
                    />
                    <Bar dataKey="totalTax" fill="#8884d8" name="totalTax" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-4 text-xs text-muted-foreground space-y-1">
                <p>
                  Relative amounts shown compared to current $10k cap.{" "}
                  <span className="text-green-600">Green = savings</span>,{" "}
                  <span className="text-red-600">Red = costs more</span>
                </p>
                <p>
                  <strong>Note:</strong> Proposed cap phases down by 30% of
                  income over $500k (min $10k cap applies)
                </p>
              </div>

              <div className="mt-6 space-y-4">
                {chartData.map((data, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-4 bg-muted rounded-lg"
                  >
                    <div>
                      <h3 className="font-semibold">{data.scenario}</h3>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <div className="flex items-center gap-2">
                          <span>
                            SALT Deduction: $
                            {data.saltDeduction.toLocaleString()}
                          </span>
                          {currentCapData &&
                            data.scenario !== "Current ($10k Cap)" &&
                            formatRelativeAmount(
                              data.saltDeduction,
                              currentCapData.saltDeduction,
                              false,
                            )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span>
                            Tax Savings: ${data.taxSavings.toLocaleString()}
                          </span>
                          {currentCapData &&
                            data.scenario !== "Current ($10k Cap)" &&
                            formatRelativeAmount(
                              data.taxSavings,
                              currentCapData.taxSavings,
                              false,
                            )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2 justify-end">
                        <p className="text-lg font-bold">
                          ${data.totalTax.toLocaleString()}
                        </p>
                        {currentCapData &&
                          data.scenario !== "Current ($10k Cap)" &&
                          formatRelativeAmount(
                            data.totalTax,
                            currentCapData.totalTax,
                            true,
                          )}
                      </div>
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
