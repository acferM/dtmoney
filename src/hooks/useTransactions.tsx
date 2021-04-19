import { createContext, useEffect, useState, ReactNode, useContext } from 'react'
import api from '../services/api'

interface Transaction {
  id: number
  title: string
  value: number
  type: string
  category: string
  createdAt: Date
}

type TransactionInput = Omit<Transaction, 'id' | 'createdAt'>

interface TransactionsContextData {
  transactions: Transaction[];
  createTransaction: (transaction: TransactionInput) => Promise<void>
}

interface TransactionsProviderProps {
  children: ReactNode
}

const TransactionsContext = createContext<TransactionsContextData>({} as TransactionsContextData)

export function TransactionsProvider({ children }: TransactionsProviderProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([])

  useEffect(() => {
    api.get('transactions')
      .then(({data}) => setTransactions(data.transactions))
  }, [])

  async function createTransaction(transactionInput: TransactionInput) {
    const { data } = await api.post('/transactions', {
      ...transactionInput, 
      createdAt: new Date()
    })
    
    const { transaction } = data

    setTransactions(state => [...state, transaction])
  }

  return (
    <TransactionsContext.Provider value={{transactions, createTransaction}}>
      {children}
    </TransactionsContext.Provider>
  )
}

export function useTransactions() {
  const context = useContext(TransactionsContext)

  return context
}