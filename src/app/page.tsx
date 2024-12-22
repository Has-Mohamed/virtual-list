"use client";

import { cn } from "@/utils/cn";
import VirtualList from "./components/virtual-list";

const tickets = Array.from({ length: 11000 }, (_, index) => ({
  id: "id" +index + 1,
  title: `Ticket #${index + 1}`,
  description: `Description for ticket #${index + 1}`,
  status: Math.random() < 0.5 ? "In Progress" : "Done",
}));

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center  p-12">
      <h1 className="text-3xl font-bold mb-8">Tickets</h1>
      <div className="w-full max-w-5xl">
        <VirtualList>
          <VirtualList.Header 
            titles={["Title", "Description","Status"]} 
            className="flex w-full bg-[#1f2937] p-3 font-semibold"
            cellClassName="flex-1"
          />
          <VirtualList.List
            rowHeight={50}
            visibleRowCount={20}
            rowClassName="hover:bg-[#7f8fa63b] flex items-center"
            dataList={tickets}
          >
            {({ id, title, description, status }) => (
              <div key={id} className="flex items-center w-full">
                <div className="flex-1">{title}</div>
                <div className="flex-1">{description}</div>
                <div className={cn("flex-1 text-blue-300",{ "text-green-600": status === "Done"})}>{status}</div>
              </div>
            )}
          </VirtualList.List>
        </VirtualList>
      </div>
    </main>
  );
}