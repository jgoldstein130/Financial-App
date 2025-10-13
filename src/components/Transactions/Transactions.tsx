import { ReactNode, useEffect, useState } from "react";
import PlaidLink from "../PlaidLink/PlaidLink";
import {
  ClickAwayListener,
  MenuItem,
  MenuList,
  Paper,
  Popper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { FaSort } from "react-icons/fa";

const Transactions = ({ children, ...props }: Props) => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [allTransactions, setAllTransactions] = useState<any[]>([]);
  const [hasConnectedBank, setHasConnectedBank] = useState<boolean>(false);
  const [accountsAnchor, setAccountsAnchor] = useState<null | HTMLElement>(null);
  const [dateAnchor, setDateAnchor] = useState<null | HTMLElement>(null);
  const [isAccountsPopperOpen, setIsAccountsPopperOpen] = useState(false);
  const [isDatePopperOpen, setIsDatePopperOpen] = useState(false);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [accountsMap, setAccountsMap] = useState<Map<string, string>>(new Map());
  const [dateFilter, setDateFilter] = useState<string>("allDates");
  const [accountsFilter, setAccountsFilter] = useState<string>("allAccounts");

  useEffect(() => {
    const getTransactions = async () => {
      const transactionsCall = await fetch("/api/getTransactions", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      const response = await transactionsCall.json();
      setTransactions(response);
      setAllTransactions(response);
    };

    const getHasConnectedBank = async () => {
      const hasConnectedBankCall = await fetch("/api/hasConnectedBankAccount", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      const response = await hasConnectedBankCall.json();
      setHasConnectedBank(response);
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
    getHasConnectedBank();
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
  }, [dateFilter, accountsFilter]);

  const formattedAmount = (amount: number) => {
    if (amount > 0) {
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
    let newTransactions = [];
    if (dateFilter === "lastMonth") {
      newTransactions = allTransactions.filter((transaction) => {
        const oneMonthAgo = new Date(
          Date.UTC(new Date().getFullYear(), new Date().getMonth() - 1, new Date().getDate())
        )
          .toISOString()
          .split("T")[0];
        return transaction.date >= oneMonthAgo;
      });
    } else if (dateFilter === "allDates") {
      newTransactions = allTransactions;
    }

    if (accountsFilter === "allAccounts") {
      setTransactions(newTransactions);
    } else if (accountsFilter) {
      newTransactions = newTransactions.filter(
        (transaction) => accountsMap.get(transaction.account_id) === accountsFilter
      );
      setTransactions(newTransactions);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      {hasConnectedBank && transactions.length > 0 && accounts.length > 0 ? (
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
              </TableRow>
            </TableHead>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction.transaction_id} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                  <TableCell component="th" scope="row">
                    {transaction.name}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {accountsMap.get(transaction.account_id)}
                  </TableCell>
                  <TableCell align="right" style={transaction.amount > 0 ? { color: "#11c261" } : { color: "#e33b3b" }}>
                    {formattedAmount(transaction.amount)}
                  </TableCell>
                  <TableCell align="right">{transaction.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <PlaidLink />
      )}
    </div>
  );
};

interface Props {
  children?: ReactNode;
}

export default Transactions;
