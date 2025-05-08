// contexts/TransactionContext.jsx
import { createContext, useContext, useState, useCallback } from 'react';
import api from '../api/api';

const TransactionContext = createContext();

export function TransactionProvider({ children }) {
  const [transactions, setTransactions] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const fetchTransactions = useCallback(async (page = currentPage, size = itemsPerPage, month = null) => {
    try {
      setLoading(true);
      const response = await api.get(`/transactions/getall`, {
        params: { page, size, month },
      });

      const { content, totalElements, totalPages } = response.data;
      
      const mappedTransactions = content.map((transaction) => ({
        id: transaction.id,
        date: transaction.createdAt,
        merchant_name: transaction.merchantName,
        merchant_id: transaction.merchantId,
        category_id: transaction.categoryId,
        category: transaction.categoryName,
        payment_mode: transaction.paymentMode,
        transaction_type: transaction.transactionType,
        amount: transaction.amount,
        carbon_emission: transaction.carbonEmitted || 0,
        isGlobal: transaction.global,
      }));

      setTransactions(mappedTransactions);
      setTotalElements(totalElements);
      setTotalPages(totalPages);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, itemsPerPage]);

  const addTransaction = async (transactionData) => {
    try {
      await api.post("/transactions/add", transactionData);
      // Refresh transactions after adding
      fetchTransactions();
      return true;
    } catch (error) {
      console.error("Error adding transaction:", error);
      return false;
    }
  };

  const updateCategory = async (transactionId, newCategory, merchantName, applyToAll = false) => {
    try {
      await api.post("/transactions/apply-category", {
        transactionId: transactionId,
        merchantName: merchantName,
        newCategoryName: newCategory,
        applyToAll: applyToAll,
      });
      
      // Refresh transactions
      fetchTransactions();
      return true;
    } catch (error) {
      console.error("Error updating category:", error);
      return false;
    }
  };

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        totalElements,
        totalPages,
        loading,
        currentPage,
        itemsPerPage,
        fetchTransactions,
        addTransaction,
        updateCategory,
        setCurrentPage,
        setItemsPerPage,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
}

export const useTransactions = () => useContext(TransactionContext);