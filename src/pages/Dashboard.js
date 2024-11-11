import React, { useEffect, useState } from 'react'
import Header from '../components/Header'
import Cards from '../components/Cards';
import AddExpenseModal from '../components/Modals/addExpense';
import AddIncomeModal from '../components/Modals/addIncome';
import { addDoc, collection, getDocs, query } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { toast } from 'react-toastify';
import TransactionsTable from '../components/TransactionTable';
import ChartComponent from '../components/Charts';
import NoTransaction from '../components/NoTransaction';

function Dashboard() {

	/* const transactions = [                     this is how transactions should be added in form of array 
		{
			type: "income",
			amount:1200,
			tag:"salary",
			name: "income 1",
			date: "2023-05-23",
		},
		{
			type: "expense",
			amount:800,
			tag:"food",
			name: "expense 1",
			date: "2023-05-26",
		}
	] */

	const [transactions,setTransactions] = useState([]);
	const [loading,setLoading] = useState(false);
	const [user] = useAuthState(auth);
	const [isExpenseModalVisible, setIsExpenseModalVisible] = useState(false);
	const [isIncomeModalVisible , setIsIncomeModalVisible] = useState(false);
	const [income,setIncome] = useState(0);
	const [expense,setExpense] = useState(0);
	const [balance,setBalance] = useState(0);
 
  	const showExpenseModal = () => {
    	setIsExpenseModalVisible(true);
  	};
  	const showIncomeModal = () => {
    	setIsIncomeModalVisible(true);
  	};
  	const handleExpenseCancel = () => {
    	setIsExpenseModalVisible(false);
  	};
  	const handleIncomeCancel = () => {
    	setIsIncomeModalVisible(false);
  	};

  	const onFinish = (values,type) =>{
    	const newTransaction = {
      		type: type,
      		date: (values.date).format("YYYY-MM-DD"),           /* moment package allows us create a global time object */
      		amount: parseFloat(values.amount),
      		tag: values.tag,
      		name: values.name,
    	};
    	addTransaction(newTransaction);
  	};

  	async function addTransaction(transaction , many){
    	try {
      		const docRef = await addDoc(
        		collection(db, `users/${user.uid}/transactions`),
				transaction
      		);
			console.log("Document Written With ID : " , docRef.id);
			if(!many) toast.success("Transaction Added");
			let newArr = transactions;
			newArr.push(transaction);
			setTransactions(newArr);  
			calculateBalance() ;                            /* this way transaction is also getting updated and whenever transaction is updated get Balance is updated */

    	} 
		catch (error) {
			console.error("Error adding Document : ",error);
			if(!many) toast.error("Coundn't add transaction");
   		}
  	}

	useEffect(() => {
		// get all docs from a collection in firebase
		fetchTransaction();
	}, [user]);

	useEffect(() => {
		calculateBalance();
	} , [transactions]);

	function calculateBalance(){
		let incomeTotal = 0 ;
		let expenseTotal = 0 ;
		
		transactions.forEach((transaction) => {     /* transactions array contains the object which contains the type */
			if(transaction.type === "income"){
				incomeTotal += transaction.amount ;
			}
			else{
				expenseTotal += transaction.amount ;
			}
		} ) ;

		setIncome(incomeTotal);
		setExpense(expenseTotal);
		setBalance(incomeTotal - expenseTotal) ;
	};

	async function fetchTransaction() {
		setLoading(true);
		if(user){
			const q = query(collection(db, `users/${user.uid}/transactions`));
			const querySnapshot = await getDocs(q);
			let transactionArray = [];
			querySnapshot.forEach((doc) => {               /* query is created to fetch items */
				//doc.data() is never undefined for query doc snapshots
				transactionArray.push(doc.data());       /* doc.data gets all the data in object form which is then pushed in an array */
			});
			setTransactions(transactionArray);
			console.log("Transactions Array : ",transactionArray);
			toast.success("Transaction Fetched!");
		}
		setLoading(false);
	}

	let sortedTransactions = transactions.sort((a,b) => {
    	return new Date(a.date) - new Date(b.date);
	});

  	return (
    	<>
      		<div>
        		<Header/>
				{loading ? (
					<p>Loading....</p>
				) : (
					<>
						<Cards 
							income = {income}
							expense = {expense}
							balance = {balance}
		          			showExpenseModal={showExpenseModal}
        		  			showIncomeModal = {showIncomeModal}
        				/>

						{(transactions||[]).length !== 0 ? <ChartComponent sortedTransactions = {sortedTransactions}/> :<NoTransaction/>}
						

		        		<AddExpenseModal 
        		  			isExpenseModalVisible = {isExpenseModalVisible}
          					handleExpenseCancel = {handleExpenseCancel}
		          			onFinish={onFinish}
        				/>

        				<AddIncomeModal
					        isIncomeModalVisible = {isIncomeModalVisible}
					        handleIncomeCancel = {handleIncomeCancel}
          					onFinish={onFinish}
        				/>
						<TransactionsTable 
							transactions={transactions} 
							addTransaction={addTransaction}
							fetchTransaction={fetchTransaction}
						/>
					</>
				)}
      		</div>
    	</>
  	)
}

export default Dashboard
