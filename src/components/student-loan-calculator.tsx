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
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  calculateLoanMetrics,
  formatCurrency,
  getLimitLabel,
} from "@/util/loan-calculations";
import {
  type CalculationResult,
  LOAN_CAP_CONSTANTS,
  type StudentType,
  enrollmentStatuses,
  programPresets,
  studentTypes,
} from "@/util/loan-data";

export default function StudentLoanCalculator() {
  const [studentType, setStudentType] = useState<StudentType>("graduate");
  const [programLength, setProgramLength] = useState<string>("2");
  const [annualCost, setAnnualCost] = useState<string>("");
  const [existingLoans, setExistingLoans] = useState<string>("0");
  const [enrollmentPercentage, setEnrollmentPercentage] = useState<number>(100);
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<CalculationResult | null>(null);

  const handleCalculate = useCallback(() => {
    const cost = parseFloat(annualCost) || 0;
    const length = parseInt(programLength) || 1;
    const existing = parseFloat(existingLoans) || 0;

    if (cost <= 0) return;

    const calculationResults = calculateLoanMetrics(
      studentType,
      length,
      cost,
      existing,
      enrollmentPercentage,
    );

    setResults(calculationResults);
    setShowResults(true);
  }, [
    studentType,
    programLength,
    annualCost,
    existingLoans,
    enrollmentPercentage,
  ]);

  const handlePresetSelect = (presetId: string) => {
    const preset = programPresets.find((p) => p.id === presetId);
    if (preset) {
      setStudentType(preset.studentType);
      setProgramLength(preset.years.toString());
      setAnnualCost(preset.annualCost.toString());
      setShowResults(false);
    }
  };

  const resetForm = () => {
    setShowResults(false);
    setResults(null);
  };

  // Generate summary text based on results
  const getSummaryText = () => {
    if (!results) return null;

    const { fundingGap, totalProgramCost, totalBorrowingCapacity } = results;
    const gapPercent = ((fundingGap / totalProgramCost) * 100).toFixed(0);

    if (fundingGap === 0) {
      return `Your program costs can be fully covered by federal student loans under the new BBB limits. You can borrow up to ${formatCurrency(totalBorrowingCapacity)} for your ${programLength}-year program.`;
    }

    const limitType = getLimitLabel(studentType);
    const aggregateLimit =
      studentType === "professional"
        ? LOAN_CAP_CONSTANTS.PROFESSIONAL_AGGREGATE
        : LOAN_CAP_CONSTANTS.GRADUATE_AGGREGATE;

    return `Under the new BBB limits, you face a funding gap of ${formatCurrency(fundingGap)} (${gapPercent}% of total costs). As a ${limitType}, you can borrow up to ${formatCurrency(aggregateLimit)} total, but your ${programLength}-year program costs ${formatCurrency(totalProgramCost)}. You'll need to find alternative funding sources for the gap.`;
  };

  // Chart data for comparison visualization
  const getChartData = () => {
    if (!results) return [];

    return results.comparisonData.map((scenario) => ({
      scenario: scenario.scenario,
      covered: scenario.loanCapacity,
      gap: scenario.fundingGap,
    }));
  };

  const chartData = getChartData();
  const summaryText = getSummaryText();

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          Big Beautiful Bill: Student Loan Caps Calculator
        </h1>
        <p className="text-muted-foreground">
          See how the new federal student loan limits affect your graduate or
          professional education. Starting July 2026, graduate students face
          strict annual and aggregate borrowing caps.
        </p>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Your Program Information</CardTitle>
          <CardDescription>
            Enter your program details to see your borrowing capacity and any
            funding gaps
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Quick Presets */}
          <div>
            <Label className="mb-2 block">Quick Start: Select a Program Type</Label>
            <div className="flex flex-wrap gap-2">
              {programPresets.map((preset) => (
                <Button
                  key={preset.id}
                  variant="outline"
                  size="sm"
                  onClick={() => handlePresetSelect(preset.id)}
                >
                  {preset.label}
                </Button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="student-type">Student Type</Label>
              <Select
                value={studentType}
                onValueChange={(value: StudentType) => {
                  setStudentType(value);
                  resetForm();
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select student type" />
                </SelectTrigger>
                <SelectContent>
                  {studentTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-1">
                Professional includes MD, JD, DDS, PharmD, DVM, OD, DPM
              </p>
            </div>

            <div>
              <Label htmlFor="enrollment-status">Enrollment Status</Label>
              <Select
                value={enrollmentPercentage.toString()}
                onValueChange={(value) => {
                  setEnrollmentPercentage(parseInt(value));
                  resetForm();
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select enrollment status" />
                </SelectTrigger>
                <SelectContent>
                  {enrollmentStatuses.map((status) => (
                    <SelectItem
                      key={status.value}
                      value={status.value.toString()}
                    >
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="program-length">Program Length (years)</Label>
              <Select
                value={programLength}
                onValueChange={(value) => {
                  setProgramLength(value);
                  resetForm();
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select program length" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((years) => (
                    <SelectItem key={years} value={years.toString()}>
                      {years} {years === 1 ? "year" : "years"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="annual-cost">Annual Program Cost</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                  $
                </span>
                <Input
                  id="annual-cost"
                  type="number"
                  placeholder="50,000"
                  value={annualCost}
                  className="pl-8"
                  onChange={(e) => {
                    setAnnualCost(e.target.value);
                    resetForm();
                  }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Include tuition, fees, and living expenses
              </p>
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="existing-loans">Existing Federal Student Loans</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                  $
                </span>
                <Input
                  id="existing-loans"
                  type="number"
                  placeholder="0"
                  value={existingLoans}
                  className="pl-8"
                  onChange={(e) => {
                    setExistingLoans(e.target.value);
                    resetForm();
                  }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Total Direct Stafford loans from undergrad (affects lifetime
                $257,500 limit)
              </p>
            </div>
          </div>

          <Button
            onClick={handleCalculate}
            className="w-full"
            disabled={!annualCost || parseFloat(annualCost) <= 0}
          >
            Calculate My Funding Gap
          </Button>
        </CardContent>
      </Card>

      {showResults && results && (
        <>
          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Total Program Cost</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">
                  {formatCurrency(results.totalProgramCost)}
                </p>
                <p className="text-sm text-muted-foreground">
                  {programLength} years × {formatCurrency(parseFloat(annualCost))}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Borrowing Capacity</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-green-600">
                  {formatCurrency(results.totalBorrowingCapacity)}
                </p>
                <p className="text-sm text-muted-foreground">
                  {formatCurrency(results.annualLimit)}/year,{" "}
                  {formatCurrency(results.aggregateLimit)} max
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Funding Gap</CardTitle>
              </CardHeader>
              <CardContent>
                <p
                  className={`text-3xl font-bold ${results.fundingGap > 0 ? "text-red-600" : "text-green-600"}`}
                >
                  {formatCurrency(results.fundingGap)}
                </p>
                <p className="text-sm text-muted-foreground">
                  {results.fundingGap > 0
                    ? "Needs alternative funding"
                    : "Fully covered"}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Summary Text */}
          {summaryText && (
            <div
              className={`mb-6 p-4 rounded-lg border ${
                results.fundingGap > 0
                  ? "bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800"
                  : "bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800"
              }`}
            >
              <p className="text-foreground font-medium">{summaryText}</p>
            </div>
          )}

          {/* Comparison Chart */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Old System vs. New BBB Limits</CardTitle>
              <CardDescription>
                Compare your borrowing capacity under the old unlimited system
                vs. new caps
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                    <YAxis dataKey="scenario" type="category" width={140} />
                    <Tooltip
                      formatter={(value, name) => [
                        formatCurrency(Number(value ?? 0)),
                        name === "covered" ? "Loan Coverage" : "Funding Gap",
                      ]}
                    />
                    <Bar dataKey="covered" stackId="a" name="covered">
                      {chartData.map((entry, index) => (
                        <Cell
                          key={`cell-covered-${index}`}
                          fill={entry.gap > 0 ? "#f59e0b" : "#22c55e"}
                        />
                      ))}
                    </Bar>
                    <Bar dataKey="gap" stackId="a" fill="#ef4444" name="gap" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 text-xs text-muted-foreground space-y-1">
                <p>
                  <span className="inline-block w-3 h-3 bg-green-500 rounded mr-1"></span>
                  Fully covered by federal loans
                  <span className="inline-block w-3 h-3 bg-amber-500 rounded ml-4 mr-1"></span>
                  Partially covered
                  <span className="inline-block w-3 h-3 bg-red-500 rounded ml-4 mr-1"></span>
                  Funding gap (needs private loans, savings, etc.)
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Year-by-Year Breakdown */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Year-by-Year Breakdown</CardTitle>
              <CardDescription>
                See how the annual and aggregate limits affect each year of your
                program
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-2">Year</th>
                      <th className="text-right py-2 px-2">Annual Cost</th>
                      <th className="text-right py-2 px-2">Max Borrowing</th>
                      <th className="text-right py-2 px-2">Cumulative</th>
                      <th className="text-right py-2 px-2">Remaining Cap</th>
                      <th className="text-right py-2 px-2">Annual Gap</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.yearBreakdown.map((year) => (
                      <tr key={year.year} className="border-b">
                        <td className="py-2 px-2 font-medium">
                          Year {year.year}
                        </td>
                        <td className="text-right py-2 px-2">
                          {formatCurrency(year.annualCost)}
                        </td>
                        <td className="text-right py-2 px-2">
                          {formatCurrency(year.maxBorrowing)}
                        </td>
                        <td className="text-right py-2 px-2">
                          {formatCurrency(year.cumulativeBorrowed)}
                        </td>
                        <td className="text-right py-2 px-2 text-muted-foreground">
                          {formatCurrency(year.remainingCapacity)}
                        </td>
                        <td
                          className={`text-right py-2 px-2 font-medium ${year.annualGap > 0 ? "text-red-600" : "text-green-600"}`}
                        >
                          {year.annualGap > 0
                            ? formatCurrency(year.annualGap)
                            : "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="font-bold bg-muted">
                      <td className="py-2 px-2">Total</td>
                      <td className="text-right py-2 px-2">
                        {formatCurrency(results.totalProgramCost)}
                      </td>
                      <td className="text-right py-2 px-2">
                        {formatCurrency(results.totalBorrowingCapacity)}
                      </td>
                      <td className="text-right py-2 px-2">-</td>
                      <td className="text-right py-2 px-2">-</td>
                      <td
                        className={`text-right py-2 px-2 ${results.fundingGap > 0 ? "text-red-600" : "text-green-600"}`}
                      >
                        {results.fundingGap > 0
                          ? formatCurrency(results.fundingGap)
                          : "-"}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              <div className="mt-4 p-3 bg-muted rounded-lg text-sm">
                <p className="font-medium mb-1">Understanding the Limits:</p>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  <li>
                    Annual limit:{" "}
                    {studentType === "professional" ? "$50,000" : "$20,500"} per
                    year
                    {enrollmentPercentage < 100 &&
                      ` (${formatCurrency(results.annualLimit)} at ${enrollmentPercentage}% enrollment)`}
                  </li>
                  <li>
                    Aggregate limit:{" "}
                    {formatCurrency(
                      studentType === "professional"
                        ? LOAN_CAP_CONSTANTS.PROFESSIONAL_AGGREGATE
                        : LOAN_CAP_CONSTANTS.GRADUATE_AGGREGATE,
                    )}{" "}
                    total for {studentType} students
                  </li>
                  <li>
                    Lifetime maximum: $257,500 across all federal student loans
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Disclaimer */}
          <div className="text-xs text-muted-foreground text-center">
            <p>
              Based on Big Beautiful Bill (Public Law 119-21) Section 81001.
              Limits take effect July 1, 2026. This calculator is for
              educational purposes only.
            </p>
          </div>
        </>
      )}
    </div>
  );
}
