# Sidebar Collapse Feature - Implementation Guide

## Summary
The App.tsx file has become corrupted during the edit. Here's how to add the collapsible sidebar feature:

## Changes Needed

### 1. Add State Variable (Line ~65)
```typescript
const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
```

### 2. Add Icons to Imports (Line ~14)
```typescript
import {
  // ... existing imports
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
```

### 3. Replace the Sidebar Section (around line 260-334)

**Replace:**
```tsx
<ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
  <div className="h-full bg-white border-r border-gray-200 shadow-sm">
    <div className="p-4">
      <nav className="space-y-2">
        {/* navigation buttons */}
      </nav>
    </div>
  </div>
</ResizablePanel>
```

**With:**
```tsx
{/* Sidebar - Collapsible */}
{!isSidebarCollapsed && (
  <div className="w-64 bg-white border-r border-gray-200 shadow-sm flex-shrink-0">
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-gray-700">Navigation</h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsSidebarCollapsed(true)}
          className="h-8 w-8 p-0"
          title="Collapse Sidebar"
        >
          <PanelLeftClose className="h-4 w-4" />
        </Button>
      </div>
      <nav className="space-y-2">
        {/* Keep all existing navigation buttons */}
      </nav>
    </div>
  </div>
)}

{/* Collapsed Sidebar - Expand Button */}
{isSidebarCollapsed && (
  <div className="w-12 bg-white border-r border-gray-200 shadow-sm flex-shrink-0 flex flex-col items-center py-4">
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setIsSidebarCollapsed(false)}
      className="h-10 w-10 p-0 mb-4"
      title="Expand Sidebar"
    >
      <PanelLeftOpen className="h-5 w-5" />
    </Button>
  </div>
)}
```

### 4. Change ResizablePanelGroup to Regular Flex (around line 258)

**Replace:**
```tsx
<div className="flex-1 overflow-hidden">
  <ResizablePanelGroup direction="horizontal" className="h-full">
    {/* sidebar */}
    <ResizableHandle />
    <ResizablePanel defaultSize={80}>
      {/* content */}
    </ResizablePanel>
  </ResizablePanelGroup>
</div>
```

**With:**
```tsx
<div className="flex-1 overflow-hidden">
  <div className="flex h-full">
    {/* Collapsible sidebar code from step 3 */}
    
    {/* Main Content Area */}
    <div className="flex-1 overflow-hidden">
      <div className="h-full overflow-auto">
        <div className="p-6 space-y-6">
          {/* Keep all existing content */}
        </div>
      </div>
    </div>
  </div>
</div>
```

## Benefits
- ✅ Sidebar can be collapsed to give full-width view
- ✅ Small expand button (48px width) when collapsed  
- ✅ Smooth toggle between collapsed/expanded states
- ✅ More screen space for charts and dashboards
- ✅ Better UX for viewing sustainability tab and other wide content

## Note
The App.tsx file currently has duplicate content and needs to be manually fixed. Please restore from git or manually remove the duplicate sections before applying these changes.
