"use client"

import { AlertTriangle, X, RefreshCw, Code } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ErrorCardProps {
    title?: string
    message: string
    details?: string
    onContinue?: () => void
    onDismiss?: () => void
    variant?: "error" | "warning"
    className?: string
}

export function ErrorCard({
    title = "Something went wrong",
    message,
    details,
    onContinue,
    onDismiss,
    variant = "error",
    className,
}: ErrorCardProps) {
    return (
        <Card
            className={cn(
                "border-l-4 md:min-w-lg",
                variant === "error"
                    ? "border-l-destructive bg-destructive/40"
                    : "border-l-yellow-500 bg-yellow-50 dark:bg-yellow-950/20",
                className,
            )}
        >
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <div className="flex gap-2 flex-col">
                        <div className="flex">
                            <AlertTriangle
                                className={cn("h-5 mr-4 w-5 flex-shrink-0", variant === "error" ? "text-destructive" : "text-yellow-500")}
                            />
                            <CardTitle className="text-base font-medium">{title}</CardTitle>
                        </div>
                        <CardDescription
                            className={cn("mt-1 text-sm", variant === "error" ? "text-foreground/80" : "text-foreground/70")}
                        >
                            {message}
                        </CardDescription>
                    </div>
                    {onDismiss && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onDismiss}
                            className={cn(
                                "h-6 w-6 p-0 hover:text-foreground",
                                variant === "error" ? "text-foreground/60" : "text-foreground/60",
                            )}
                        >
                            <X className="h-4 w-4" />
                            <span className="sr-only">Dismiss</span>
                        </Button>
                    )}
                </div>
            </CardHeader>
            {(details || onContinue) && (
                <CardContent className="pt-0">
                    {details && (
                        <div className="mb-4 rounded-md bg-muted/50 p-3">
                            <p className="text-sm text-foreground/70 font-mono">
                                {details.split("\n").map(x =>
                                    (<>{x} <br /></>)
                                )}
                            </p>
                        </div>
                    )}
                    {onContinue && (
                        <Button variant="outline" size="sm" onClick={onContinue} className="gap-2 bg-transparent hover:bg-transparent hover:text-white/50 cursor-pointer">
                            <Code className="h-4 w-4" />
                            View Code
                        </Button>
                    )}
                </CardContent>
            )}
        </Card>
    )
}
