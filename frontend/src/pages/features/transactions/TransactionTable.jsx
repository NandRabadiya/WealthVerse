// Replace your current TransactionTable.jsx with this version
import { useState, useEffect, useRef } from "react";
import { format } from "date-fns";
import { ChevronLeft, ChevronRight, Pencil, Plus, X } from "lucide-react";
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

// Sample data updated with new fields
const sampleTransactions = [
  {
    id: 1,
    date: "2023-06-01",
    merchant_name: "Walmart",
    merchant_id: "M005",
    category: "Shopping",
    payment_mode: "Card",
    transaction_type: "debit",
    amount: 150.75,
    carbon_emission: 35.4,
  },
  {
    id: 2,
    date: "2023-06-03",
    merchant_name: "Zomato",
    merchant_id: "M006",
    category: "Food",
    payment_mode: "UPI",
    transaction_type: "debit",
    amount: 68.5,
    carbon_emission: 20.3,
  },
  {
    id: 3,
    date: "2023-06-05",
    merchant_name: "Uber Eats",
    merchant_id: "M007",
    category: "Food",
    payment_mode: "Card",
    transaction_type: "debit",
    amount: 35.99,
    carbon_emission: 15.2,
  },
  {
    id: 4,
    date: "2023-06-07",
    merchant_name: "Flipkart",
    merchant_id: "M008",
    category: "Shopping",
    payment_mode: "NetBanking",
    transaction_type: "debit",
    amount: 500.0,
    carbon_emission: 40.0,
  },
  {
    id: 5,
    date: "2023-06-09",
    merchant_name: "Spotify",
    merchant_id: "M009",
    category: "Entertainment",
    payment_mode: "UPI",
    transaction_type: "debit",
    amount: 19.99,
    carbon_emission: 5.0,
  },
  {
    id: 6,
    date: "2023-06-11",
    merchant_name: "Uber",
    merchant_id: "M010",
    category: "Transportation",
    payment_mode: "Card",
    transaction_type: "debit",
    amount: 72.5,
    carbon_emission: 28.7,
  },
  {
    id: 7,
    date: "2023-06-13",
    merchant_name: "Amazon",
    merchant_id: "M011",
    category: "Shopping",
    payment_mode: "NetBanking",
    transaction_type: "debit",
    amount: 215.3,
    carbon_emission: 33.9,
  },
  {
    id: 8,
    date: "2023-06-15",
    merchant_name: "Cinemax",
    merchant_id: "M012",
    category: "Entertainment",
    payment_mode: "Card",
    transaction_type: "debit",
    amount: 150.0,
    carbon_emission: 25.0,
  },
  {
    id: 9,
    date: "2023-06-17",
    merchant_name: "Tesla",
    merchant_id: "M013",
    category: "Transportation",
    payment_mode: "UPI",
    transaction_type: "debit",
    amount: 10000.0,
    carbon_emission: 55.0,
  },
  {
    id: 10,
    date: "2023-06-19",
    merchant_name: "H&M",
    merchant_id: "M014",
    category: "Shopping",
    payment_mode: "Card",
    transaction_type: "debit",
    amount: 120.0,
    carbon_emission: 15.5,
  },
  {
    id: 11,
    date: "2023-06-21",
    merchant_name: "HealthKart",
    merchant_id: "M015",
    category: "Healthcare",
    payment_mode: "NetBanking",
    transaction_type: "debit",
    amount: 250.0,
    carbon_emission: 10.0,
  },
  {
    id: 12,
    date: "2023-06-23",
    merchant_name: "Apple",
    merchant_id: "M016",
    category: "Shopping",
    payment_mode: "UPI",
    transaction_type: "debit",
    amount: 999.99,
    carbon_emission: 50.3,
  },
];

// Category color mapping
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

export function TransactionTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [transactions, setTransactions] = useState([]);
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [userCategories, setUserCategories] = useState([]);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  const inputRef = useRef(null);

  useEffect(() => {
    setTransactions(sampleTransactions);
    setUserCategories(["Investment", "Travel"]);
  }, []);

  useEffect(() => {
    if (isAddingCategory && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isAddingCategory]);

  const updateCategory = (id, newCategory) => {
    const updated = transactions.map((t) =>
      t.id === id ? { ...t, category: newCategory } : t
    );
    setTransactions(updated);
    setEditingCategoryId(null);
  };

  const handleAddCategory = (transactionId) => {
    if (newCategoryName && !userCategories.includes(newCategoryName)) {
      setUserCategories((prev) => [...prev, newCategoryName]);
      updateCategory(transactionId, newCategoryName);
      setIsAddingCategory(false);
      setNewCategoryName("");
    }
  };

  const getEcoTag = (emission) => {
    return emission > 30 ? (
      <Badge className="bg-red-600 text-white">High</Badge>
    ) : (
      <Badge className="bg-green-600 text-white">Low</Badge>
    );
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
              <TableHead className="text-gray-400">Merchant ID</TableHead>
              <TableHead className="text-gray-400">Category</TableHead>
              <TableHead className="text-gray-400">Payment Mode</TableHead>
              <TableHead className="text-gray-400">Type</TableHead>
              <TableHead className="text-gray-400 text-right">Amount</TableHead>
              <TableHead className="text-gray-400">Carbon Emission</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentItems.map((transaction) => (
              <TableRow key={transaction.id} className="hover:bg-gray-800">
                <TableCell className="text-white">
                  {format(new Date(transaction.date), "MMM dd, yyyy")}
                </TableCell>
                <TableCell className="text-white">
                  {transaction.merchant_name}
                </TableCell>
                <TableCell className="text-white">
                  {transaction.merchant_id}
                </TableCell>
                <TableCell className="text-white">
                  {editingCategoryId === transaction.id ? (
                    <div className="flex items-start gap-2">
                      <Select
                        onValueChange={(val) => {
                          if (val === "__add__") {
                            setIsAddingCategory(true);
                          } else {
                            updateCategory(transaction.id, val);
                          }
                        }}
                        defaultValue={transaction.category}
                      >
                        <SelectTrigger className="w-[180px] bg-gray-800 border-gray-700 text-white">
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
                          <SelectItem
                            value="__add__"
                            className="text-green-400"
                          >
                            <Plus className="inline mr-1" /> Add new category
                          </SelectItem>
                          {isAddingCategory && (
                            <div className="p-2 space-y-2">
                              <input
                                ref={inputRef}
                                type="text"
                                value={newCategoryName}
                                onChange={(e) =>
                                  setNewCategoryName(e.target.value)
                                }
                                className="w-full p-1 text-gray-400 border-b rounded bg-transparent"
                                placeholder="New category name"
                              />
                              <Button
                                className="w-full text-sm bg-white text-black hover:bg-gray-400"
                                onClick={() =>
                                  handleAddCategory(transaction.id)
                                }
                              >
                                Add Category
                              </Button>
                            </div>
                          )}
                        </SelectContent>
                      </Select>
                      <button
                        className="text-gray-400 hover:text-red-500"
                        onClick={() => {
                          setEditingCategoryId(null);
                          setIsAddingCategory(false);
                          setNewCategoryName("");
                        }}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Badge
                        variant="outline"
                        className={`${
                          typeColors[transaction.category] || "bg-gray-500"
                        } text-white border-0`}
                      >
                        {transaction.category}
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
                <TableCell className="text-white">
                  {transaction.transaction_type}
                </TableCell>
                <TableCell className="text-right text-green-400 font-semibold">
                  ₹{transaction.amount.toFixed(2)}
                </TableCell>
                <TableCell className="text-white flex gap-2 items-center">
                  {getEcoTag(transaction.carbon_emission)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-gray-400">
            Showing {indexOfFirstItem + 1}-
            {Math.min(indexOfLastItem, transactions.length)} of{" "}
            {transactions.length} transactions
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
