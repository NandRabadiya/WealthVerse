import { useState, useEffect, useRef } from "react";
import { format } from "date-fns";
import { ChevronLeft, ChevronRight, Pencil, Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/Select";
import { Badge } from "@/components/ui/Badge";

// Sample data - in a real app, this would come from your Spring Boot API
const sampleTransactions = [
  {
    id: 1,
    amount: 45.99,
    merchant_name: "Starbucks",
    payment_mode: "Credit Card",
    transaction_type: "Food",
    date: "2023-05-01",
  },
  {
    id: 2,
    amount: 120.5,
    merchant_name: "Amazon",
    payment_mode: "Debit Card",
    transaction_type: "Shopping",
    date: "2023-05-03",
  },
  {
    id: 3,
    amount: 35.0,
    merchant_name: "Uber",
    payment_mode: "UPI",
    transaction_type: "Transportation",
    date: "2023-05-05",
  },
  {
    id: 4,
    amount: 89.99,
    merchant_name: "Netflix",
    payment_mode: "Credit Card",
    transaction_type: "Entertainment",
    date: "2023-05-07",
  },
  {
    id: 5,
    amount: 250.0,
    merchant_name: "Electricity Co.",
    payment_mode: "Net Banking",
    transaction_type: "Utilities",
    date: "2023-05-10",
  },
  {
    id: 6,
    amount: 75.5,
    merchant_name: "Pharmacy",
    payment_mode: "Credit Card",
    transaction_type: "Healthcare",
    date: "2023-05-12",
  },
  {
    id: 7,
    amount: 199.99,
    merchant_name: "Coursera",
    payment_mode: "Credit Card",
    transaction_type: "Education",
    date: "2023-05-15",
  },
  {
    id: 8,
    amount: 55.0,
    merchant_name: "Starbucks",
    payment_mode: "UPI",
    transaction_type: "Food",
    date: "2023-05-18",
  },
  {
    id: 9,
    amount: 145.75,
    merchant_name: "Amazon",
    payment_mode: "Credit Card",
    transaction_type: "Shopping",
    date: "2023-05-20",
  },
  {
    id: 10,
    amount: 42.0,
    merchant_name: "Uber",
    payment_mode: "UPI",
    transaction_type: "Transportation",
    date: "2023-05-22",
  },
  {
    id: 11,
    amount: 12.99,
    merchant_name: "Spotify",
    payment_mode: "Credit Card",
    transaction_type: "Entertainment",
    date: "2023-05-25",
  },
  {
    id: 12,
    amount: 180.0,
    merchant_name: "Water Co.",
    payment_mode: "Net Banking",
    transaction_type: "Utilities",
    date: "2023-05-28",
  },
];

// Transaction type to color mapping
const typeColors = {
  Food: "bg-green-500",
  Shopping: "bg-blue-500",
  Transportation: "bg-yellow-500",
  Entertainment: "bg-purple-500",
  Utilities: "bg-red-500",
  Healthcare: "bg-pink-500",
  Education: "bg-cyan-500",
  Other: "bg-gray-500",
};

const defaultCategories = [
  "Food",
  "Shopping",
  "Transportation",
  "Entertainment",
  "Utilities",
  "Healthcare",
  "Education",
  "Other",
];

export function TransactionTable({ viewType = "all" }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [transactions, setTransactions] = useState([]);
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [userCategories, setUserCategories] = useState([]);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  // Add a ref to maintain the focus on the input field
  const inputRef = useRef(null);

  useEffect(() => {
    // Sort sampleTransactions by date descending
    const sorted = [...sampleTransactions].sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );
    setTransactions(sorted);

    // Fetch user-defined categories (mocked)
    setUserCategories(["Investment", "Travel"]);
  }, []);

  // Focus the input field when adding a new category
  useEffect(() => {
    if (isAddingCategory && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isAddingCategory]);

  //Update category
  const updateCategory = (id, newCategory) => {
    const updated = transactions.map((t) =>
      t.id === id ? { ...t, transaction_type: newCategory } : t
    );
    setTransactions(updated);
    setEditingCategoryId(null);
  };

  // Handle adding a new category
  const handleAddCategory = (transactionId) => {
    if (newCategoryName && !userCategories.includes(newCategoryName)) {
      const updated = [...userCategories, newCategoryName];
      setUserCategories(updated);
      updateCategory(transactionId, newCategoryName);
      setIsAddingCategory(false);
      setNewCategoryName("");
    }
  };

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = transactions.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(transactions.length / itemsPerPage);

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <Card className="bg-gray-900 border border-gray-800 shadow-lg rounded-xl">
      <CardHeader>
        <CardTitle className="text-white">Transaction History</CardTitle>
      </CardHeader>
      <CardContent>
        <Table className="w-full table-fixed">
          <TableHeader>
            <TableRow className="border-gray-800 hover:bg-gray-900">
              <TableHead className="text-gray-400">Date</TableHead>
              <TableHead className="text-gray-400">Merchant</TableHead>
              <TableHead className="text-gray-400">Category</TableHead>
              <TableHead className="text-gray-400">Payment Mode</TableHead>
              <TableHead className="text-gray-400 text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentItems.map((transaction) => (
              <TableRow
                key={transaction.id}
                className="border-gray-800 hover:bg-gray-800"
              >
                <TableCell className="text-white">
                  {format(new Date(transaction.date), "MMM dd, yyyy")}
                </TableCell>
                <TableCell className="text-white font-medium">
                  {transaction.merchant_name}
                </TableCell>
                <TableCell className="text-white flex items-center space-x-2">
                  {editingCategoryId === transaction.id ? (
                    <Select
                      onValueChange={(val) => {
                        if (val !== "__add__") {
                          updateCategory(transaction.id, val);
                        } else {
                          setIsAddingCategory(true);
                        }
                      }}
                      defaultValue={transaction.transaction_type}
                    >
                      <SelectTrigger className="w-[200px] bg-gray-800 border-gray-700 text-white">
                        <SelectValue placeholder="Select Category" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 text-white">
                        {[...defaultCategories, ...userCategories].map(
                          (cat) => (
                            <SelectItem key={cat} value={cat}>
                              {cat}
                            </SelectItem>
                          )
                        )}
                        {!isAddingCategory ? (
                          <SelectItem
                            value="__add__"
                            className="text-green-400"
                          >
                            <Plus className="w-4 h-4 inline mr-1" /> Add new
                            category
                          </SelectItem>
                        ) : (
                          <div className="p-2 space-y-2">
                            <input
                              ref={inputRef} // Reference to maintain focus
                              type="text"
                              value={newCategoryName}
                              onChange={(e) =>
                                setNewCategoryName(e.target.value)
                              }
                              className="w-full p-1 text-gray-400 border-b rounded"
                              placeholder="New category name"
                            />
                            <Button
                              className="w-full text-sm bg-white text-black hover:bg-gray-400 cursor-pointer"
                              onClick={() => handleAddCategory(transaction.id)}
                            >
                              Add Category
                            </Button>
                          </div>
                        )}
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Badge
                        variant="outline"
                        className={`${
                          typeColors[transaction.transaction_type] ||
                          "bg-gray-500"
                        } text-white border-0`}
                      >
                        {transaction.transaction_type}
                      </Badge>
                      <button
                        onClick={() => setEditingCategoryId(transaction.id)}
                        className="text-gray-400 hover:text-white"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </TableCell>
                <TableCell className="text-white">
                  {transaction.payment_mode}
                </TableCell>
                <TableCell className="text-right font-medium text-green-400">
                  ₹{transaction.amount.toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-gray-400">
            Showing {indexOfFirstItem + 1}-
            {Math.min(indexOfLastItem, sampleTransactions.length)} of{" "}
            {sampleTransactions.length} transactions
          </p>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={prevPage}
              disabled={currentPage === 1}
              className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700 hover:text-white"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Previous Page</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={nextPage}
              disabled={currentPage === totalPages}
              className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700 hover:text-white"
            >
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Next Page</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
