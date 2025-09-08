import { AlertTriangle, X, RefreshCw, Code, BluetoothConnected } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Progress } from "./ui/progress";

const states = [
    "Connecting to remote...",
    "Downloading manifest...",
    "Downloading repository..."
];

interface ErrorCardProps {
    onFinished: () => void
    className?: string
}

export function LoadingCard({
    onFinished,
    className,
}: ErrorCardProps) {
    const [state, setState] = useState(0);

    useEffect(()=>{
        const timeoutOne = setTimeout(() => {
            setState(1);
        }, 500);
        const timeoutTwo = setTimeout(() => {
            setState(2);
        }, 750);
        const timeoutThree = setTimeout(() => {
            onFinished();
        }, 1300);
    }, [])

    return (
        <Card
            className={cn(
                "border-l-4 md:min-w-lg",
                className,
            )}
        >
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <div className="flex gap-2 flex-col">
                        <div className="flex">
                            <BluetoothConnected
                                className={cn("h-5 mr-4 w-5 flex-shrink-0")}
                            />
                            <CardTitle className="text-base font-medium">Connecting to Remote Session.</CardTitle>
                        </div>
                        <CardDescription
                            className={cn("mt-1 text-sm")}
                        >
                            Loading repository dmrgn/portfolio.
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="pt-0">
                <div className="mb-4 rounded-md bg-muted/50 p-3">
                    <p className="text-sm">
                        {states[state]}
                    </p>
                </div>
            </CardContent>
            <CardFooter>
                <Progress value={state * 100/2} />
            </CardFooter>
        </Card>
    )
}
