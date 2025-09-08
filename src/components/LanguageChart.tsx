"use client"

import { Code, Monitor, TrendingUp } from "lucide-react"
import { Bar, BarChart, XAxis, YAxis } from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    type ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"

import rawData from "../../assets/languages.json";
const languageMap = (Object.values(rawData) as Record<string, number>[]).reduce((acc: Record<string, number>, x: Record<string, number>)=>{
    const languageData = Object.entries(x);
    for (const entry of languageData) {
        if (!(entry[0] in acc))
            acc[entry[0]] = 0;
        acc[entry[0]] += entry[1];
    }
    return acc;
}, {} as Record<string, number>);
const chartData = Object.entries(languageMap).map(x=>({
    language: x[0],
    linesOfCode: x[1]
})).sort((a,b)=>{
    return b.linesOfCode - a.linesOfCode;
}).slice(0,15);

const chartConfig = {
    linesOfCode: {
        label: "Lines of Code",
        icon: Monitor,
        color: "white"
    },
} satisfies ChartConfig

export function LanguageChart() {
    return (
        <Card className="text-white">
            <div className="flex w-full gap-6">
                <Code className="ml-6" />
                <CardHeader className="w-full pl-0">
                    <CardTitle>
                        Daniel's Language Usage
                    </CardTitle>
                    <CardDescription className="text-white">January 2023 - September 2025</CardDescription>
                </CardHeader>
            </div>
            <CardContent className="text-white h-full">
                <ChartContainer config={chartConfig} className="min-h-[600px] w-full">
                    <BarChart
                        accessibilityLayer
                        data={chartData}
                        layout="vertical"
                        margin={{
                            left: -20,
                        }}
                        barGap={20}
                    >
                        <XAxis type="number" dataKey="linesOfCode" hide />
                        <YAxis
                            dataKey="language"
                            type="category"
                            tickLine={false}
                            tickMargin={10}
                            width={140}
                            axisLine={false}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent />}
                            label="Lines of Code: "
                            labelClassName="text-white"
                        />
                        <Bar dataKey="linesOfCode" fill="var(--chart-3)" radius={[2, 4, 4, 2]} />
                    </BarChart>
                </ChartContainer>
            </CardContent>
            {/* <CardFooter className="flex-col items-start gap-2 text-sm">
                <div className="flex gap-2 leading-none font-medium">
                    Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
                </div>
                <div className="text-white leading-none">
                    Showing total visitors for the last 6 months
                </div>
            </CardFooter> */}
        </Card>
    )
}
