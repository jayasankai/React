import "./NewExpense.css";

import ExpenseForm from "./ExpenseForm";
import { useState } from "react";

const NewExpense = (props) => {

  const [showAddNewExpense, setShowAddNewExpense] = useState(false);

  const saveExpenseDataHandler = (enteredExpenseData) => {
    const expenseData = {
        ...enteredExpenseData,
        id : Math.random().toString()
    }
    props.onAddExpense(expenseData);
    setShowAddNewExpense(!showAddNewExpense);
  };

  const showAddNewExpenseHandler = () => {
    setShowAddNewExpense(!showAddNewExpense);
  }

  const hideAddNewExpenseHandler = () => {
    setShowAddNewExpense(!showAddNewExpense);
  }

  return (
    <div className="new-expense">
      {!showAddNewExpense && <button onClick={showAddNewExpenseHandler}>Add New Expense</button>}
      {showAddNewExpense && <ExpenseForm onSaveExpenseData={saveExpenseDataHandler} onCancel={hideAddNewExpenseHandler}/>}
    </div>
  );
};

export default NewExpense;
