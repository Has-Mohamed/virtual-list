"use client";

import { cn } from "@/utils/cn";
import React, { useCallback, useRef, useState } from "react";

// Header Component
interface HeaderProps {
  titles: string[];
  className?: string;
  cellClassName?: string;
}

const VirtualListHeader: React.FC<HeaderProps> = ({
  titles,
  className,
  cellClassName,
}) => {
  return (
    <div className={className}>
      {titles.map((title, index) => (
        <span className={cellClassName} key={`${title}-${index}`}>
          {title}
        </span>
      ))}
    </div>
  );
};

// List Component
interface ListProps<T extends { id: React.Key }> {
  className?: string;
  rowClassName?: string;
  rowHeight: number;
  visibleRowCount: number;
  dataList: T[];
  children: (props: T & { index: number }) => React.ReactNode;
}

const VirtualListList = <T extends { id: React.Key }>({
  className,
  rowHeight,
  visibleRowCount,
  dataList,
  rowClassName,
  children,
}: ListProps<T>): React.ReactElement => {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleScroll = useCallback(() => {
    if (containerRef.current) {
      setScrollTop(containerRef.current.scrollTop);
    }
  }, []);

  const totalHeight = dataList.length * rowHeight;
  const startIndex = Math.floor(scrollTop / rowHeight);
  const endIndex = Math.min(startIndex + visibleRowCount + 1, dataList.length);
  const visibleItems = dataList.slice(startIndex, endIndex);

  return (
    <div
      className={className}
      ref={containerRef}
      onScroll={handleScroll}
      style={{ height: visibleRowCount * rowHeight, overflowY: "auto" }}
    >
      <div style={{ height: totalHeight, position: "relative" }}>
        {visibleItems.map((row, index) => (
          <div
            key={row.id}
            className={cn("w-full px-3 border-b border-gray-800",{
            }, rowClassName)}
            style={{
              position: "absolute",
              top: (startIndex + index) * rowHeight,
              height: rowHeight,
            }}
          >
            {children({ ...row, index })}
          </div>
        ))}
      </div>
    </div>
  );
};

interface VirtualListProps {
  children: React.ReactNode;
}

const VirtualList: React.FC<VirtualListProps> & {
  Header: typeof VirtualListHeader;
  List: typeof VirtualListList;
} = ({ children }) => {
  return <>{children}</>;
};

VirtualList.Header = VirtualListHeader;
VirtualList.List = VirtualListList;

export default VirtualList;
