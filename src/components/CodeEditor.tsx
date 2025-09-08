"use client"

import { useState } from "react"
import { X, Play, Save, Settings, File } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface Tab {
    id: string
    name: string
    path: string
    content: string
    language: string
    isDirty: boolean
}

interface CodeEditorProps {
    tabs: Tab[]
    activeTab?: string
    onTabChange: (tabId: string) => void
    onTabClose: (tabId: string) => void
    onContentChange: (tabId: string, content: string) => void
}

const getLanguageFromPath = (path: string): string => {
    const ext = path.split(".").pop()?.toLowerCase()
    switch (ext) {
        case "js":
        case "jsx":
            return "javascript"
        case "ts":
        case "tsx":
            return "typescript"
        case "css":
            return "css"
        case "html":
            return "html"
        case "json":
            return "json"
        case "md":
            return "markdown"
        default:
            return "text"
    }
}

const syntaxHighlight = (code: string, language: string): string => {
    // Simple syntax highlighting for demo purposes
    let highlighted = code

    if (language === "javascript" || language === "typescript") {
        highlighted = highlighted
            .replace(
                /\b(const|let|var|function|return|if|else|for|while|class|import|export|from|default)\b/g,
                '<span class="text-blue-400">$1</span>',
            )
            .replace(/\b(true|false|null|undefined)\b/g, '<span class="text-orange-400">$1</span>')
            .replace(/"([^"]*)"/g, '<span class="text-green-400">"$1"</span>')
            .replace(/'([^']*)'/g, "<span class=\"text-green-400\">'$1'</span>")
            .replace(/\/\/.*$/gm, '<span class="text-gray-500">$&</span>')
    }

    return highlighted
}

export function CodeEditor({ tabs, activeTab, onTabChange, onTabClose, onContentChange }: CodeEditorProps) {
    const [content, setContent] = useState<Record<string, string>>({})

    const currentTab = tabs.find((tab) => tab.id === activeTab)

    const handleContentChange = (value: string) => {
        if (currentTab) {
            setContent((prev) => ({ ...prev, [currentTab.id]: value }))
            onContentChange(currentTab.id, value)
        }
    }

    return (
        <div className="flex flex-col h-full">
            {/* Tab Bar */}
            <div className="flex items-center bg-card border-b border-border">
                <div className="flex items-center overflow-x-auto">
                    {tabs.map((tab) => (
                        <div
                            key={tab.id}
                            className={cn(
                                "flex items-center gap-2 px-3 py-2 text-sm border-r border-border cursor-pointer group min-w-0",
                                activeTab === tab.id
                                    ? "bg-background text-foreground"
                                    : "bg-card text-card-foreground hover:bg-background/50",
                            )}
                            onClick={() => onTabChange(tab.id)}
                        >
                            <span className="truncate max-w-32">{tab.name}</span>
                            {tab.isDirty && <div className="w-2 h-2 bg-primary rounded-full" />}
                            <Button
                                variant="ghost"
                                size="sm"
                                className="w-4 h-4 p-0 opacity-0 group-hover:opacity-100 hover:bg-destructive hover:text-destructive-foreground"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    onTabClose(tab.id)
                                }}
                            >
                                <X className="w-3 h-3" />
                            </Button>
                        </div>
                    ))}
                </div>
                <div className="flex items-center gap-1 ml-auto px-2">
                    <Button variant="ghost" size="sm">
                        <Save className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                        <Play className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                        <Settings className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            {/* Editor Area */}
            <div className="flex-1 relative">
                {currentTab ? (
                    <div className="h-full">
                        <textarea
                            className="w-full h-full p-4 bg-background text-foreground font-mono text-sm resize-none border-none outline-none"
                            value={content[currentTab.id] || currentTab.content}
                            onChange={(e) => handleContentChange(e.target.value)}
                            placeholder="Start typing..."
                            spellCheck={false}
                        />
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-full text-foreground bg-background">
                        <div className="text-center">
                            <File className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                            <p className="text-lg font-medium text-foreground">No file selected</p>
                            <p className="text-sm text-gray-400">Select a file from the explorer to start editing</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Status Bar */}
            <div className="flex items-center justify-between px-4 py-1 bg-card border-t border-border text-xs text-card-foreground">
                <div className="flex items-center gap-4">
                    {currentTab && (
                        <>
                            <span>{getLanguageFromPath(currentTab.path)}</span>
                            <span>UTF-8</span>
                            <span>LF</span>
                        </>
                    )}
                </div>
                <div className="flex items-center gap-4">
                    <span>Ln 1, Col 1</span>
                    <span>Spaces: 2</span>
                </div>
            </div>
        </div>
    )
}
