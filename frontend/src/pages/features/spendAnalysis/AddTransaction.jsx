import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon, Upload } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { Calendar } from "@/components/ui/Calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/Popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { cn } from "@/lib/utils";

const paymentModes = [
  "Credit Card",
  "Debit Card",
  "UPI",
  "Net Banking",
  "Cash",
];
const transactionTypes = [
  "Food",
  "Shopping",
  "Transportation",
  "Entertainment",
  "Utilities",
  "Healthcare",
  "Education",
  "Other",
];

export function AddTransactionForm({ onSuccess }) {
  const [date, setDate] = useState(new Date());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    amount: "",
    merchant_id: "",
    merchant_name: "",
    payment_mode: "",
    transaction_type: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Format the data for your Spring Boot API
      const transactionData = {
        ...formData,
        date: format(date, "yyyy-MM-dd"),
        amount: Number.parseFloat(formData.amount),
      };

      // API call to your Spring Boot backend
      // const response = await fetch('your-api-endpoint/transactions', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(transactionData),
      // })

      // if (!response.ok) throw new Error('Failed to add transaction')

      // Simulate API call for now
      console.log("Transaction data:", transactionData);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Reset form
      setFormData({
        amount: "",
        merchant_id: "",
        merchant_name: "",
        payment_mode: "",
        transaction_type: "",
      });
      setDate(new Date());

      // Close dialog
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Error adding transaction:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setIsSubmitting(true);

    try {
      // API call to your Spring Boot backend for CSV upload
      // const response = await fetch('your-api-endpoint/transactions/upload', {
      //   method: 'POST',
      //   body: formData,
      // })

      // if (!response.ok) throw new Error('Failed to upload transactions')

      // Simulate API call for now
      console.log("Uploading file:", file.name);
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Close dialog
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Error uploading transactions:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Function to disable future dates
  const disabledDays = (date) => {
    const today = new Date();
    return date > today;
  };

  return (
    <Tabs defaultValue="manual" className="w-full">
      <TabsList className="grid w-full grid-cols-2 bg-gray-800">
        <TabsTrigger
          value="manual"
          className="data-[state=active]:bg-gray-700 data-[state=active]:text-green-400"
        >
          Manual Entry
        </TabsTrigger>
        <TabsTrigger
          value="upload"
          className="data-[state=active]:bg-gray-700 data-[state=active]:text-green-400"
        >
          Upload CSV
        </TabsTrigger>
      </TabsList>

      <TabsContent value="manual">
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount" className="text-white">
                Amount
              </Label>
              <Input
                id="amount"
                name="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.amount}
                onChange={handleChange}
                required
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="date" className="text-white">
                Date
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal bg-gray-800 border-gray-700 text-white hover:bg-gray-700",
                      !date && "text-gray-400"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-gray-800 border-gray-700">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    disabled={disabledDays}
                    initialFocus
                    className="bg-gray-800 text-white"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="merchant_name" className="text-white">
              Merchant Name
            </Label>
            <Input
              id="merchant_name"
              name="merchant_name"
              placeholder="Enter merchant name"
              value={formData.merchant_name}
              onChange={handleChange}
              required
              className="bg-gray-800 border-gray-700 text-white"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="merchant_id" className="text-white">
              Merchant ID (Optional)
            </Label>
            <Input
              id="merchant_id"
              name="merchant_id"
              placeholder="Enter merchant ID"
              value={formData.merchant_id}
              onChange={handleChange}
              className="bg-gray-800 border-gray-700 text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="payment_mode" className="text-white">
                Payment Mode
              </Label>
              <Select
                onValueChange={(value) =>
                  handleSelectChange("payment_mode", value)
                }
                value={formData.payment_mode}
                required
              >
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                  <SelectValue placeholder="Select payment mode" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700 text-white">
                  {paymentModes.map((mode) => (
                    <SelectItem
                      key={mode}
                      value={mode}
                      className="hover:bg-gray-700 focus:bg-gray-700"
                    >
                      {mode}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="transaction_type" className="text-white">
                Transaction Type
              </Label>
              <Select
                onValueChange={(value) =>
                  handleSelectChange("transaction_type", value)
                }
                value={formData.transaction_type}
                required
              >
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700 text-white">
                  {transactionTypes.map((type) => (
                    <SelectItem
                      key={type}
                      value={type}
                      className="hover:bg-gray-700 focus:bg-gray-700"
                    >
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-600 text-white"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Adding..." : "Add Transaction"}
          </Button>
        </form>
      </TabsContent>

      <TabsContent value="upload">
        <div className="space-y-4 pt-4">
          <div className="border-2 border-dashed border-gray-700 rounded-lg p-6 text-center">
            <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
            <h3 className="text-white font-medium mb-1">Upload CSV File</h3>
            <p className="text-gray-400 text-sm mb-4">
              Upload a CSV file with your transaction data
            </p>
            <Input
              id="csv-upload"
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="hidden"
            />
            <Button
              onClick={() => document.getElementById("csv-upload").click()}
              variant="outline"
              className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
            >
              Select File
            </Button>
          </div>

          <div className="bg-gray-800 p-4 rounded-lg">
            <h4 className="text-white font-medium mb-2">
              CSV Format Requirements
            </h4>
            <p className="text-gray-400 text-sm mb-2">
              Your CSV file should have the following columns:
            </p>
            <ul className="text-gray-400 text-sm list-disc list-inside space-y-1">
              <li>amount (numeric)</li>
              <li>merchant_id (text, optional)</li>
              <li>merchant_name (text)</li>
              <li>payment_mode (text)</li>
              <li>transaction_type (text)</li>
              <li>date (YYYY-MM-DD format)</li>
            </ul>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
}
