import React from "react";
import { TransactionTable } from "./TransactionTable/";
import FeaturesNavbar from "../FeaturesNavbar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useState } from "react";

export default function TransactionsPage() {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return (
    <>
      <FeaturesNavbar />
      <div className="min-h-screen bg-gray-900 pt-30 p-6">
        <div className="w-full max-w-6xl mx-auto">
          <div className="mb-4">
            <div className="flex items-center space-x-2 w-auto">
              <Label htmlFor="month" className="text-white whitespace-nowrap">
                Select Month:
              </Label>
              <Select
                value={selectedMonth.toString()}
                onValueChange={(value) => setSelectedMonth(parseInt(value))}
              >
                <SelectTrigger
                  id="month"
                  className="bg-gray-800 border-gray-700 text-white w-[150px]"
                >
                  <SelectValue placeholder="Select Month" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700 text-white">
                  {monthNames.map((name, index) => (
                    <SelectItem key={index} value={index.toString()}>
                      {name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <TransactionTable selectedMonth={selectedMonth} />
        </div>
      </div>
    </>
  );
}