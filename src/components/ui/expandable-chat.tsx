import React, { useState, ReactNode } from "react";
import { MessageCircle, X, Maximize2, Minimize2 } from "lucide-react";
import { Button } from "./button";
import { Card, CardContent, CardHeader, CardFooter } from "./card";
import { cn } from "@/lib/utils";

interface ExpandableChatProps {
  children: ReactNode;
  className?: string;
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
  size?: "sm" | "md" | "lg";
  icon?: ReactNode;
}

export const ExpandableChat: React.FC<ExpandableChatProps> = ({
  children,
  className,
  position = "bottom-right",
  size = "md",
  icon = <MessageCircle className="h-6 w-6" />,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);

  const sizeClasses = {
    sm: "w-80 h-96",
    md: "w-96 h-[32rem]",
    lg: "w-[28rem] h-[36rem]",
  };

  const positionClasses = {
    "bottom-right": "fixed bottom-4 right-4",
    "bottom-left": "fixed bottom-4 left-4",
    "top-right": "fixed top-4 right-4",
    "top-left": "fixed top-4 left-4",
  };

  const maximizedClasses = isMaximized
    ? "fixed inset-4 w-auto h-auto max-w-none max-h-none"
    : "";

  return (
    <div className={cn(positionClasses[position], className)}>
      {!isOpen ? (
        <Button
          onClick={() => setIsOpen(true)}
          className="rounded-full w-14 h-14 shadow-lg hover:shadow-xl transition-all duration-200 bg-primary hover:bg-primary/90"
          size="lg"
        >
          {icon}
        </Button>
      ) : (
        <Card
          className={cn(
            sizeClasses[size],
            maximizedClasses,
            "shadow-2xl border-2 bg-background flex flex-col overflow-hidden transition-all duration-300"
          )}
        >
          <CardHeader className="flex-row items-center justify-between space-y-0 pb-2 border-b">
            <div className="flex-1">{React.Children.toArray(children)[0]}</div>
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMaximized(!isMaximized)}
                className="h-8 w-8 p-0"
              >
                {isMaximized ? (
                  <Minimize2 className="h-4 w-4" />
                ) : (
                  <Maximize2 className="h-4 w-4" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="flex-1 p-0 overflow-hidden">
            {React.Children.toArray(children)[1]}
          </CardContent>
          <CardFooter className="border-t p-4">
            {React.Children.toArray(children)[2]}
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export const ExpandableChatHeader: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  return <>{children}</>;
};

export const ExpandableChatBody: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  return <div className="h-full overflow-hidden">{children}</div>;
};

export const ExpandableChatFooter: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  return <>{children}</>;
};
