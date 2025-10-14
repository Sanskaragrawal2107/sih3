import React, { createContext, useContext, useState, ReactNode } from "react";
import { DPRAnalysis } from "../types";

interface ChatContextType {
  analysisData: DPRAnalysis | null;
  setAnalysisData: (data: DPRAnalysis | null) => void;
  fileName: string | null;
  setFileName: (name: string | null) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [analysisData, setAnalysisData] = useState<DPRAnalysis | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  return (
    <ChatContext.Provider
      value={{
        analysisData,
        setAnalysisData,
        fileName,
        setFileName,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChatContext must be used within a ChatProvider");
  }
  return context;
};
