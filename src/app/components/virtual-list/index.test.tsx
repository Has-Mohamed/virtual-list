import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import VirtualList from "./index";

describe("VirtualList", () => {
  // Test data
  const testData = Array.from({ length: 100 }, (_, i) => ({
    id: i + 1,
    title: `Item ${i + 1}`,
    description: `Description ${i + 1}`,
  }));

  describe("Header Component", () => {
    it("renders header with correct titles", () => {
      render(
        <VirtualList.Header
          titles={["Title 1", "Title 2"]}
          className="test-header"
        />
      );

      expect(screen.getByText("Title 1")).toBeInTheDocument();
      expect(screen.getByText("Title 2")).toBeInTheDocument();
    });

    it("applies custom className to header", () => {
      const { container } = render(
        <VirtualList.Header titles={["Title"]} className="custom-header" />
      );

      expect(container.firstChild).toHaveClass("custom-header");
    });

    it("applies custom cellClassName to header cells", () => {
      render(
        <VirtualList.Header titles={["Title"]} cellClassName="custom-cell" />
      );

      expect(screen.getByText("Title")).toHaveClass("custom-cell");
    });
  });

  describe("List Component", () => {
    it("renders visible items correctly", () => {
      render(
        <VirtualList.List
          rowHeight={50}
          visibleRowCount={5}
          dataList={testData.slice(0, 10)}
          className="test-list"
        >
          {({ title }) => <div>{title}</div>}
        </VirtualList.List>
      );

      expect(screen.getByText("Item 1")).toBeInTheDocument();
      expect(screen.getByText("Item 5")).toBeInTheDocument();
      expect(screen.queryByText("Item 10")).not.toBeInTheDocument();
    });

    it("handles scroll events", () => {
      const { container } = render(
        <VirtualList.List
          rowHeight={50}
          visibleRowCount={5}
          dataList={testData}
        >
          {({ title }) => <div>{title}</div>}
        </VirtualList.List>
      );

      act(() => {
        fireEvent.scroll(container.firstChild as Element, {
          target: { scrollTop: 250 },
        });
      });

      // Should show items from the new scroll position
      expect(screen.getByText("Item 6")).toBeInTheDocument();
      expect(screen.queryByText("Item 1")).not.toBeInTheDocument();
    });

    it("applies custom rowClassName to rows", () => {
      render(
        <VirtualList.List
          rowHeight={50}
          visibleRowCount={5}
          dataList={testData.slice(0, 5)}
          rowClassName="custom-row"
        >
          {({ title }) => <div>{title}</div>}
        </VirtualList.List>
      );

      const rows = document.querySelectorAll(".custom-row");
      expect(rows.length).toBeGreaterThan(0);
    });

    it("calculates correct total height", () => {
      const { container } = render(
        <VirtualList.List
          rowHeight={50}
          visibleRowCount={5}
          dataList={testData.slice(0, 10)}
        >
          {({ title }) => <div>{title}</div>}
        </VirtualList.List>
      );

      const virtualContainer = container.querySelector("div > div");
      expect(virtualContainer).toHaveStyle({ height: "250px" }); // 5 visibleRowCount * 50px
    });
  });

  describe("Integration", () => {
    it("renders full virtual list with header and items", () => {
      render(
        <VirtualList>
          <VirtualList.Header titles={["Title", "Description"]} />
          <VirtualList.List
            rowHeight={50}
            visibleRowCount={5}
            dataList={testData.slice(0, 10)}
          >
            {({ title, description }) => (
              <div>
                <span>{title}</span>
                <span>{description}</span>
              </div>
            )}
          </VirtualList.List>
        </VirtualList>
      );

      expect(screen.getByText("Title")).toBeInTheDocument();
      expect(screen.getByText("Item 1")).toBeInTheDocument();
      expect(screen.getByText("Description 1")).toBeInTheDocument();
    });
  });
});
