import { Dispatch, ReactNode, SetStateAction, useContext, useEffect, useState } from "react";
import PlaidLink from "../PlaidLink/PlaidLink";
import {
  ClickAwayListener,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  MenuList,
  Paper,
  Popper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { FaEdit, FaSort } from "react-icons/fa";
import { Category, Transaction } from "@/app/budget/page";
import { PickerValue } from "@mui/x-date-pickers/internals";
import dayjs from "dayjs";
import { Dayjs } from "dayjs";
import DeleteButton from "../DeleteButton/DeleteButton";
import { ConfirmModalContext } from "@/contexts/ConfirmModalContext";

const Transactions = ({ children, ...props }: Props) => {
  const [accountsAnchor, setAccountsAnchor] = useState<null | HTMLElement>(null);
  const [dateAnchor, setDateAnchor] = useState<null | HTMLElement>(null);
  const [isAccountsPopperOpen, setIsAccountsPopperOpen] = useState(false);
  const [isDatePopperOpen, setIsDatePopperOpen] = useState(false);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [accountsMap, setAccountsMap] = useState<Map<string, string>>(new Map());
  const [dateFilter, setDateFilter] = useState<string>("allDates");
  const [accountsFilter, setAccountsFilter] = useState<string>("allAccounts");
  const { setIsConfirmModalOpen, setConfirmModalTitle, setConfirmModalFunction } = useContext(ConfirmModalContext);

  useEffect(() => {
    const getTransactions = async () => {
      const transactionsCall = await fetch("/api/getTransactions", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      const response = await transactionsCall.json();
      const transactions = response.map((transaction: Transaction) => {
        return { ...transaction, category: "", manuallyAdded: false };
      });
      props.setTransactions(transactions);

      const allTransactions = new Map();
      transactions.forEach((transaction: Transaction) => allTransactions.set(transaction.transaction_id, transaction));
      props.setAllTransactions(allTransactions);
    };

    const getAccounts = async () => {
      const accountsCall = await fetch("/api/getAccounts", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      const response = await accountsCall.json();
      setAccounts(response);
    };

    getTransactions();
    getAccounts();
  }, []);

  useEffect(() => {
    if (accounts.length > 0) {
      const newAccountsMap = new Map();

      accounts.forEach((account) => {
        newAccountsMap.set(account.account_id, account.name);
      });

      setAccountsMap(newAccountsMap);
    }
  }, [accounts]);

  useEffect(() => {
    filterTransactions();
  }, [dateFilter, accountsFilter, props.allTransactions]);

  const formattedAmount = (amount: number | string) => {
    amount = Number(amount);
    if (amount >= 0) {
      return "$" + amount.toFixed(2);
    } else {
      return "-$" + (amount * -1).toFixed(2);
    }
  };

  const handleDatePopperClick = (event: React.MouseEvent<HTMLElement>) => {
    setDateAnchor(accountsAnchor ? null : event.currentTarget);
    setIsDatePopperOpen((prev) => !prev);
  };

  const closeDatePopper = () => {
    setIsDatePopperOpen(false);
    setDateAnchor(null);
  };

  const handleAccountsPopperClick = (event: React.MouseEvent<HTMLElement>) => {
    setAccountsAnchor(accountsAnchor ? null : event.currentTarget);
    setIsAccountsPopperOpen((prev) => !prev);
  };

  const closeAccountsPopper = () => {
    setIsAccountsPopperOpen(false);
    setAccountsAnchor(null);
  };

  const filterTransactions = () => {
    let newTransactions: Transaction[] = [];
    if (dateFilter === "lastMonth") {
      newTransactions = [...props.allTransactions.values()].filter((transaction) => {
        const oneMonthAgo = new Date(
          Date.UTC(new Date().getFullYear(), new Date().getMonth() - 1, new Date().getDate())
        )
          .toISOString()
          .split("T")[0];
        return transaction.date >= oneMonthAgo;
      });
    } else if (dateFilter === "allDates") {
      newTransactions = [...props.allTransactions.values()];
    }

    if (accountsFilter === "allAccounts") {
      props.setTransactions(newTransactions);
    } else if (accountsFilter) {
      newTransactions = newTransactions.filter(
        (transaction) => accountsMap.get(transaction.account_id) === accountsFilter
      );
      props.setTransactions(newTransactions);
    }
  };

  const updateTransaction = (transactionId: string, field: string, value: string | PickerValue) => {
    const newTransactions = new Map(props.allTransactions);
    const transactionToUpdate = newTransactions.get(transactionId);
    if (transactionToUpdate) {
      if (field === "amount") {
        const sanitizedValue = sanitizeString(value as string);
        value = sanitizedValue;
      } else if (field === "date") {
        const formattedDate = (value as Dayjs).format("YYYY-MM-DD");
        value = formattedDate;
      }

      (transactionToUpdate as any)[field] = value;
      newTransactions.set(transactionId, transactionToUpdate);
      props.setAllTransactions(newTransactions);
    }
  };

  const deleteTransaction = (transactionId: string) => {
    setConfirmModalFunction(() => () => {
      const newTransactions = new Map(props.allTransactions);
      newTransactions.delete(transactionId);
      props.setAllTransactions(newTransactions);
    });
    setConfirmModalTitle(
      `Are You Sure You Want To Delete The Transaction "${props.allTransactions.get(transactionId)?.name}"?`
    );
    setIsConfirmModalOpen(true);
  };

  const onAmountClick = (transactionId: string) => {
    const newTransactions = new Map(props.allTransactions);
    const transactionToUpdate = newTransactions.get(transactionId);
    if (transactionToUpdate) {
      (transactionToUpdate as any).amount = sanitizeString(transactionToUpdate.amount);
      newTransactions.set(transactionId, transactionToUpdate);
      props.setAllTransactions(newTransactions);
    }
  };

  const onAmountBlur = (transactionId: string) => {
    const newTransactions = new Map(props.allTransactions);
    const transactionToUpdate = newTransactions.get(transactionId);
    if (transactionToUpdate) {
      (transactionToUpdate as any).amount = formattedAmount(sanitizeString(transactionToUpdate.amount));
      newTransactions.set(transactionId, transactionToUpdate);
      props.setAllTransactions(newTransactions);
    }
  };

  const sanitizeString = (str: string) => {
    return str.replace(/(?!^)-|[^0-9.-]/g, "");
  };

  return (
    <div>
      {props.hasConnectedBank && accounts.length > 0 ? (
        <TableContainer component={Paper} style={{ maxHeight: "500px" }}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Transaction</TableCell>
                <TableCell>
                  <div className="flex items-center justify-start gap-1">
                    Account
                    <div onClick={handleAccountsPopperClick}>
                      <FaSort />
                    </div>
                    <Popper open={isAccountsPopperOpen} anchorEl={accountsAnchor} placement="bottom-end">
                      <ClickAwayListener onClickAway={closeAccountsPopper}>
                        <Paper sx={{ boxShadow: 3 }}>
                          <MenuList autoFocusItem={isAccountsPopperOpen}>
                            <MenuItem
                              onClick={() => {
                                setAccountsFilter("allAccounts");
                                closeAccountsPopper();
                              }}
                              style={
                                accountsFilter === "allAccounts" ? { fontWeight: "bold" } : { fontWeight: "normal" }
                              }
                            >
                              All Accounts
                            </MenuItem>
                            {accounts.map((account) => (
                              <MenuItem
                                key={account.name}
                                onClick={() => {
                                  setAccountsFilter(account.name);
                                  closeAccountsPopper();
                                }}
                                style={
                                  accountsFilter === account.name ? { fontWeight: "bold" } : { fontWeight: "normal" }
                                }
                              >
                                {account.name}
                              </MenuItem>
                            ))}
                          </MenuList>
                        </Paper>
                      </ClickAwayListener>
                    </Popper>
                  </div>
                </TableCell>
                <TableCell align="right">Amount</TableCell>
                <TableCell align="right">
                  <div className="flex items-center justify-end gap-1">
                    Date
                    <div onClick={handleDatePopperClick}>
                      <FaSort />
                    </div>
                    <Popper open={isDatePopperOpen} anchorEl={dateAnchor} placement="bottom-end">
                      <ClickAwayListener onClickAway={closeDatePopper}>
                        <Paper sx={{ boxShadow: 3 }}>
                          <MenuList autoFocusItem={isDatePopperOpen}>
                            <MenuItem
                              onClick={() => {
                                setDateFilter("allDates");
                                closeDatePopper();
                              }}
                              style={dateFilter === "allDates" ? { fontWeight: "bold" } : { fontWeight: "normal" }}
                            >
                              All Transactions
                            </MenuItem>
                            <MenuItem
                              onClick={() => {
                                setDateFilter("lastMonth");
                                closeDatePopper();
                              }}
                              style={dateFilter === "lastMonth" ? { fontWeight: "bold" } : { fontWeight: "normal" }}
                            >
                              Last Month
                            </MenuItem>
                          </MenuList>
                        </Paper>
                      </ClickAwayListener>
                    </Popper>
                  </div>
                </TableCell>
                <TableCell align="right">
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      justifyContent: "flex-end",
                    }}
                  >
                    Category
                    <FaEdit size={20} onClick={() => props.setIsCategoriesModalOpen(true)} />
                  </div>
                </TableCell>
                <TableCell align="right"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {props.transactions.map((transaction) => (
                <TableRow key={transaction.transaction_id} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                  <TableCell component="th" scope="row">
                    {transaction.manuallyAdded ? (
                      <TextField
                        value={transaction.name}
                        variant="standard"
                        onChange={(e) => updateTransaction(transaction.transaction_id, "name", e.target.value)}
                      />
                    ) : (
                      transaction.name
                    )}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {transaction.manuallyAdded ? (
                      <FormControl size="small" style={{ width: "200px", marginLeft: "-14px" }}>
                        {!transaction.account_id && <InputLabel>Account</InputLabel>}
                        <Select
                          value={transaction.account_id}
                          onChange={(e) => updateTransaction(transaction.transaction_id, "account_id", e.target.value)}
                          style={{ fontSize: "0.875rem" }}
                        >
                          <MenuItem value="">Select Account</MenuItem>
                          {[...accountsMap.entries()].map((account) => (
                            <MenuItem value={account[0]}>{account[1]}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    ) : (
                      accountsMap.get(transaction.account_id)
                    )}
                  </TableCell>
                  <TableCell
                    align="right"
                    style={{ color: Number(transaction.amount) >= 0 ? "#11c261" : "#e33b3b", width: "100px" }}
                  >
                    {transaction.manuallyAdded ? (
                      <TextField
                        value={transaction.amount}
                        variant="standard"
                        onChange={(e) => updateTransaction(transaction.transaction_id, "amount", e.target.value)}
                        onClick={() => onAmountClick(transaction.transaction_id)}
                        onBlur={() => onAmountBlur(transaction.transaction_id)}
                        slotProps={{
                          htmlInput: {
                            style: {
                              color: Number(sanitizeString(transaction.amount)) >= 0 ? "#11c261" : "#e33b3b",
                              textAlign: "right",
                            },
                          },
                        }}
                      />
                    ) : (
                      formattedAmount(transaction.amount)
                    )}
                  </TableCell>
                  <TableCell align="right">
                    {transaction.manuallyAdded ? (
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          sx={{ width: "150px" }}
                          value={transaction.date ? dayjs(transaction.date) : dayjs()}
                          onChange={(date) => updateTransaction(transaction.transaction_id, "date", date)}
                        />
                      </LocalizationProvider>
                    ) : (
                      transaction.date
                    )}
                  </TableCell>
                  <TableCell align="right">
                    <FormControl size="small" style={{ width: "200px" }}>
                      {!transaction.category && <InputLabel>Category</InputLabel>}
                      <Select
                        value={transaction.category}
                        onChange={(e) => updateTransaction(transaction.transaction_id, "category", e.target.value)}
                        style={{
                          backgroundColor: props.getCategoryColorFromId(transaction.category),
                          textAlign: "left",
                        }}
                      >
                        <MenuItem value={""}>Select Category</MenuItem>
                        {[...props.categories.entries()].map((category) => (
                          <MenuItem value={category[0]}>{category[1].categoryName}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </TableCell>
                  <TableCell align="right">
                    {transaction.manuallyAdded && (
                      <DeleteButton
                        onClick={() => {
                          deleteTransaction(transaction.transaction_id);
                        }}
                      />
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        props.hasConnectedBank === false && <PlaidLink />
      )}
    </div>
  );
};

interface Props {
  children?: ReactNode;
  hasConnectedBank: Boolean | undefined;
  allTransactions: Map<String, Transaction>;
  setAllTransactions: Dispatch<SetStateAction<Map<String, Transaction>>>;
  transactions: Transaction[];
  setTransactions: Dispatch<SetStateAction<Transaction[]>>;
  categories: Map<string, Category>;
  setCategories: Dispatch<SetStateAction<Map<string, Category>>>;
  setIsCategoriesModalOpen: Dispatch<SetStateAction<boolean>>;
  getCategoryColorFromId: (categoryId: string) => string;
}

export default Transactions;
