"use client";

import { Line, LineChart, ResponsiveContainer, Tooltip } from "recharts";

interface SparklineProps {
    data: { value: number; date: string }[];
    color?: string;
}

export function Sparkline({ data, color = "#3b82f6" }: SparklineProps) {
    return (
        <div className="h-[50px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                    <Line
                        type="monotone"
                        dataKey="value"
                        stroke={color}
                        strokeWidth={2}
                        dot={false}
                    />
                    <Tooltip
                        contentStyle={{ background: 'transparent', border: 'none', boxShadow: 'none' }}
                        itemStyle={{ display: 'none' }}
                        labelStyle={{ display: 'none' }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
