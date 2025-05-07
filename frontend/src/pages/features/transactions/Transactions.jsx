import React from "react";
import { TransactionTable } from "./TransactionTable/";
import FeaturesNavbar from "../FeaturesNavbar";

export default function TransactionsPage() {
  return (
    <>
      <FeaturesNavbar />
      <div className="min-h-screen bg-gray-900 pt-30 p-6 flex justify-center items-start">
        <div className="w-full max-w-6xl">
          <TransactionTable />
        </div>
      </div>
    </>
  );
}
