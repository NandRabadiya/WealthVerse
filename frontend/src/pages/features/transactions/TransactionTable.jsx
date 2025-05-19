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
import { useTransactions } from "../../../context/TransactionContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/Dialog";
import { Input } from "@/components/ui/Input";

// Category color mapping
const typeColors = {
  ELECTRICITY: "bg-blue-500",
  FUEL: "bg-yellow-500",
  FLIGHT: "bg-red-500",
  PUBLIC_TRANSPORT: "bg-green-500",
  GROCERIES: "bg-purple-500",
  FOOD_DINNING: "bg-pink-500",
  ONLINE_FOOD: "bg-orange-500",
  CLOTHINNG_SHOPPING: "bg-teal-500",
  ONLINE_SHOPPING: "bg-indigo-500",
  SUBSCRIPTIONS: "bg-gray-500",
  HOTEL_STAY: "bg-lime-500",
  TRAVELING: "bg-emerald-500",
  CREDITECART_PAYMENT: "bg-rose-500",
  INSURANCE: "bg-amber-500",
  CASH: "bg-slate-500",
  NGO: "bg-cyan-500",
  INVESTMENT: "bg-rose-500",
  RECHARGE: "bg-emerald-500",
  MISCELLANEOUS: "bg-gray-500",
};

const defaultCategories = [
  "ELECTRICITY",
  "FUEL",
  "FLIGHT",
  "PUBLIC_TRANSPORT",
  "GROCERIES",
  "FOOD_DINNING",
  "ONLINE_FOOD",
  "CLOTHINNG_SHOPPING",
  "ONLINE_SHOPPING",
  "SUBSCRIPTIONS",
  "HOTEL_STAY",
  "TRAVELING",
  "CREDITECART_PAYMENT",
  "INSURANCE",
  "CASH",
  "NGO",
  "INVESTMENT",
  "RECHARGE",
  "MISCELLANEOUS",
];

export function TransactionTable({ selectedMonth, refreshTrigger }) {
  const {
    transactions,
    totalElements,
    totalPages,
    loading,
    currentPage,
    itemsPerPage,
    fetchTransactions,
    updateCategory,
    addCustomCategory,
    getUsersCategory,
    setCurrentPage,
    setItemsPerPage,
  } = useTransactions();

  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [userCategories, setUserCategories] = useState([]);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [currentMerchantName, setCurrentMerchantName] = useState("");
  const [currentTransactionId, setCurrentTransactionId] = useState(null);
  const [showApplyDialog, setShowApplyDialog] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    fetchTransactions(currentPage, itemsPerPage, selectedMonth);
  }, [currentPage, itemsPerPage, selectedMonth, refreshTrigger]);

  useEffect(() => {
    const fetchUserCategories = async () => {
      const categories = await getUsersCategory();
      setUserCategories(categories.map((cat) => cat.name));
    };

    fetchUserCategories();
  }, [getUsersCategory]);

  // Focus input when adding new category dialog opens
  useEffect(() => {
    if (isAddingCategory && inputRef.current) {
      setTimeout(() => {
        inputRef.current.focus();
      }, 100);
    }
  }, [isAddingCategory]);

  const handleAddCategory = async () => {
    if (newCategoryName.trim()) {
      try {
        // Call API to add new category
        const success = await addCustomCategory(newCategoryName);
        
        if (success) {
          // Add to user categories if it's not already there
          if (!userCategories.includes(newCategoryName)) {
            setUserCategories((prev) => [...prev, newCategoryName]);
          }

          // Show success dialog with apply options
          setShowSuccessDialog(true);
        }
      } catch (error) {
        console.error("Failed to add category:", error);
      }
    }
  };

  const handleApplyCategory = async (applyToAll) => {
    try {
      await updateCategory(
        currentTransactionId,
        selectedCategory,
        currentMerchantName,
        applyToAll,
        currentPage,
        itemsPerPage,
        selectedMonth
      );
      
      setShowApplyDialog(false);
      setEditingCategoryId(null);
    } catch (error) {
      console.error("Failed to apply category:", error);
    }
  };

  const handleApplyNewCategory = async (applyToAll) => {
    try {
      await updateCategory(
        currentTransactionId,
        newCategoryName,
        currentMerchantName,
        applyToAll,
        currentPage,
        itemsPerPage,
        selectedMonth
      );
      
      setShowSuccessDialog(false);
      setIsAddingCategory(false);
      setNewCategoryName("");
      setEditingCategoryId(null);
    } catch (error) {
      console.error("Failed to apply new category:", error);
    }
  };

  const getEcoTag = (emission) => {
    return emission > 30 ? (
      <Badge className="bg-red-600 text-white">High</Badge>
    ) : (
      <Badge className="bg-green-600 text-white">Low</Badge>
    );
  };

  const getUniqueCategories = () => {
    const defaultSet = new Set(defaultCategories);
    const userCats = userCategories.filter((cat) => !defaultSet.has(cat));
    return [...defaultCategories, ...userCats];
  };

  const nextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <Card className="bg-gray-900 border border-gray-800 shadow-lg rounded-xl">
      <CardHeader>
        <CardTitle className="text-white">Transaction History</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="text-white">Loading transactions...</div>
          </div>
        ) : (
          <>
            <Table className="w-full">
              <TableHeader>
                <TableRow className="border-gray-800 hover:bg-gray-900">
                  <TableHead className="text-gray-400 w-10">Date</TableHead>
                  <TableHead className="text-gray-400 w-44">Merchant</TableHead>
                  <TableHead className="text-gray-400 w-24">
                    Merchant ID
                  </TableHead>
                  <TableHead className="text-gray-400 w-40">Category</TableHead>
                  <TableHead className="text-gray-400 w-28">
                    Payment Mode
                  </TableHead>
                  <TableHead className="text-gray-400 w-20">Type</TableHead>
                  <TableHead className="text-gray-400 text-right w-28">
                    Amount
                  </TableHead>
                  <TableHead className="text-gray-400 w-32">
                    Carbon Emission
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.length > 0 ? (
                  transactions.map((transaction) => (
                    <TableRow
                      key={transaction.id}
                      className="hover:bg-gray-800"
                    >
                      <TableCell className="text-white w-10">
                        {format(new Date(transaction.date), "dd")}
                      </TableCell>
                      <TableCell className="text-white w-44 truncate">
                        {transaction.merchant_name}
                      </TableCell>
                      <TableCell className="text-white w-24 truncate">
                        {transaction.merchant_id}
                      </TableCell>
                      <TableCell className="text-white w-40">
                        {editingCategoryId === transaction.id ? (
                          <div className="flex items-start gap-2">
                            <Select
                              onValueChange={(val) => {
                                if (val === "__add__") {
                                  setIsAddingCategory(true);
                                } else {
                                  setSelectedCategory(val);
                                  setShowApplyDialog(true);
                                }
                              }}
                              defaultValue={transaction.category}
                            >
                              <SelectTrigger className="w-28 bg-gray-800 border-gray-700 text-white">
                                <SelectValue placeholder="Select Category" />
                              </SelectTrigger>
                              <SelectContent className="bg-gray-800 text-white">
                                <SelectItem
                                  value="__add__"
                                  className="text-green-400 border-b border-gray-700 mb-1"
                                >
                                  <Plus className="inline mr-1" /> Add new
                                  category
                                </SelectItem>
                                {getUniqueCategories().map((cat) => (
                                  <SelectItem key={cat} value={cat}>
                                    {cat}
                                  </SelectItem>
                                ))}
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
                                typeColors[transaction.category] ||
                                "bg-gray-500"
                              } text-white border-0`}
                            >
                              {transaction.category}
                            </Badge>
                            {transaction.isGlobal === false && (
                              <button
                                onClick={() => {
                                  setEditingCategoryId(transaction.id);
                                  setCurrentMerchantName(
                                    transaction.merchant_name
                                  );
                                  setCurrentTransactionId(transaction.id);
                                }}
                                className="text-gray-400 hover:text-white"
                              >
                                <Pencil className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        )}
                      </TableCell>

                      <TableCell className="text-white w-28">
                        {transaction.payment_mode}
                      </TableCell>
                      <TableCell className="text-white w-20">
                        {transaction.transaction_type}
                      </TableCell>
                      <TableCell className="text-right text-green-400 font-semibold w-28">
                        ₹{parseFloat(transaction.amount).toFixed(2)}
                      </TableCell>
                      <TableCell className="text-white flex gap-2 items-center w-32">
                        {getEcoTag(transaction.carbon_emission)}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="text-center py-8 text-gray-400"
                    >
                      No transactions found for the selected period.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>

            {/* Category Add Dialog */}
            <Dialog open={isAddingCategory} onOpenChange={setIsAddingCategory}>
              <DialogContent className="bg-gray-800 text-white">
                <DialogHeader>
                  <DialogTitle>Add New Category</DialogTitle>
                  <DialogDescription>
                    Enter a name for your new category
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <Input
                    ref={inputRef}
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    className="w-full p-2 text-white border rounded bg-gray-900"
                    placeholder="New category name"
                  />
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsAddingCategory(false);
                      setNewCategoryName("");
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleAddCategory}
                    disabled={!newCategoryName.trim()}
                  >
                    Add Category
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Apply Category Dialog */}
            <Dialog open={showApplyDialog} onOpenChange={setShowApplyDialog}>
              <DialogContent className="bg-gray-800 text-white">
                <DialogHeader>
                  <DialogTitle>Apply Category</DialogTitle>
                  <DialogDescription>
                    How would you like to apply this category?
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <p className="mb-4">Apply "{selectedCategory}" to:</p>
                  <div className="space-y-4">
                    <Button
                      className="w-full"
                      onClick={() => handleApplyCategory(true)}
                    >
                      All transactions from {currentMerchantName}
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => handleApplyCategory(false)}
                    >
                      Only this transaction
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            {/* Success Dialog for New Category */}
            <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
              <DialogContent className="bg-gray-800 text-white">
                <DialogHeader>
                  <DialogTitle>Category Added Successfully!</DialogTitle>
                  <DialogDescription>
                    How would you like to apply the new category?
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <p className="mb-4">Apply "{newCategoryName}" to:</p>
                  <div className="space-y-4">
                    <Button
                      className="w-full"
                      onClick={() => handleApplyNewCategory(true)}
                    >
                      All transactions from {currentMerchantName}
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => handleApplyNewCategory(false)}
                    >
                      Only this transaction
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-gray-400">
                {transactions.length > 0
                  ? `Showing ${currentPage * itemsPerPage + 1}-${Math.min(
                      (currentPage + 1) * itemsPerPage,
                      totalElements
                    )} of ${totalElements} transactions`
                  : "No transactions"}
              </p>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-400">Show:</span>
                <Select
                  value={itemsPerPage.toString()}
                  onValueChange={(value) => {
                    setItemsPerPage(parseInt(value));
                    setCurrentPage(0); // Reset to first page when changing page size
                  }}
                >
                  <SelectTrigger className="w-20 bg-gray-800 border-gray-700 text-white">
                    <SelectValue placeholder="5" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 text-white">
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="15">15</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={prevPage}
                  disabled={currentPage === 0}
                  className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700 hover:text-white"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span className="sr-only">Previous Page</span>
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={nextPage}
                  disabled={currentPage === totalPages - 1 || totalPages === 0}
                  className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700 hover:text-white"
                >
                  <ChevronRight className="h-4 w-4" />
                  <span className="sr-only">Next Page</span>
                </Button>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}