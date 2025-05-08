import { useState } from "react";
import { format } from "date-fns";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { useTransactions } from "../../../context/TransactionContext";

const paymentModes = ["UPI", "CARD", "NET_BANKING"];
const transactionTypes = ["DEBIT", "CREDIT"];

export function AddTransactionForm({ onSuccess }) {
  const { addTransaction } = useTransactions();
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
      // Get current date and time in the required format
      const currentDateTime = format(new Date(), "yyyy-MM-dd'T'HH:mm:ss");
      
      const transactionData = {
        amount: Number.parseFloat(formData.amount),
        merchantId: formData.merchant_id,
        merchantName: formData.merchant_name,
        paymentMode: formData.payment_mode,
        transactionType: formData.transaction_type,
        createdAt: currentDateTime, // Using current date and time
      };

      // Use the context function
      const success = await addTransaction(transactionData);

      // Reset form
      if (success) {
        setFormData({
          amount: "",
          merchant_id: "",
          merchant_name: "",
          payment_mode: "",
          transaction_type: "",
        });

        if (onSuccess) onSuccess();
      }
    } catch (error) {
      console.error("Error adding transaction:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleFileUpload = async (e) => {
    console.log("File upload triggered");
    // const file = e.target.files[0];
    // if (!file) return;

    // const formData = new FormData();
    // formData.append("file", file);

    // setIsSubmitting(true);

    // try {
    //   console.log("Uploading file:", file.name);
    //   await new Promise((resolve) => setTimeout(resolve, 1500));
    //   if (onSuccess) onSuccess();
    // } catch (error) {
    //   console.error("Error uploading transactions:", error);
    // } finally {
    //   setIsSubmitting(false);
    // }
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
                step="1"
                placeholder="0.00"
                value={formData.amount}
                onChange={handleChange}
                required
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-white">
                Transaction Date
              </Label>
              <div className="text-gray-400 text-sm py-2 px-3 bg-gray-800 rounded-md border border-gray-700">
                {format(new Date(), "PPPpp")}
              </div>
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
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white ">
                  <SelectValue placeholder="Select payment mode" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700 text-white ">
                  {paymentModes.map((mode) => (
                    <SelectItem
                      key={mode}
                      value={mode}
                      className="hover:bg-gray-700 focus:bg-white"
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
                      className="hover:bg-gray-700 focus:bg-white"
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