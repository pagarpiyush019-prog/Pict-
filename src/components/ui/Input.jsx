import React from "react";
import { cn } from "../../utils/cn";

const Input = React.forwardRef(({
    className,
    type = "text",
    label,
    description,
    error,
    required = false,
    id,
    variant = "default",
    ...props
}, ref) => {
    // Generate unique ID if not provided
    const inputId = id || `input-${Math.random()?.toString(36)?.substr(2, 9)}`;

    // Base input classes - updated for dark theme compatibility
    const baseInputClasses = cn(
        "flex h-11 w-full rounded-xl border px-4 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors",
        variant === "dark" 
            ? "bg-white/5 border-white/10 text-white focus-visible:ring-blue-500/50 focus-visible:border-blue-500 hover:bg-white/10 hover:border-white/20"
            : "bg-background border-input text-foreground focus-visible:ring-ring"
    );

    // Checkbox-specific styles
    if (type === "checkbox") {
        return (
            <input
                type="checkbox"
                className={cn(
                    "h-4 w-4 rounded border border-input bg-background text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                    className
                )}
                ref={ref}
                id={inputId}
                {...props}
            />
        );
    }

    // Radio button-specific styles
    if (type === "radio") {
        return (
            <input
                type="radio"
                className={cn(
                    "h-4 w-4 rounded-full border border-input bg-background text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                    className
                )}
                ref={ref}
                id={inputId}
                {...props}
            />
        );
    }

    // For regular inputs with wrapper structure
    return (
        <div className="space-y-2">
            {label && (
                <label
                    htmlFor={inputId}
                    className={cn(
                        "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
                        variant === "dark" ? "text-slate-300" : (error ? "text-destructive" : "text-foreground")
                    )}
                >
                    {label}
                    {required && <span className={variant === "dark" ? "text-red-400 ml-1" : "text-destructive ml-1"}>*</span>}
                </label>
            )}

            <input
                type={type}
                className={cn(
                    baseInputClasses,
                    error && (variant === "dark" ? "border-red-500/50 focus-visible:ring-red-500/50" : "border-destructive focus-visible:ring-destructive"),
                    className
                )}
                ref={ref}
                id={inputId}
                {...props}
            />

            {description && !error && (
                <p className={cn("text-sm", variant === "dark" ? "text-slate-500" : "text-muted-foreground")}>
                    {description}
                </p>
            )}

            {error && (
                <p className={cn("text-sm", variant === "dark" ? "text-red-400" : "text-destructive")}>
                    {error}
                </p>
            )}
        </div>
    );
});

Input.displayName = "Input";

export default Input;