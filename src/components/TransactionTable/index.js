import { Radio, Select, Table } from 'antd';
import React, { useState } from 'react';
import searchImg from "../../assets/search.png";
import "./styles.css";
import { parse, unparse } from 'papaparse';
import { toast } from 'react-toastify';

function TransactionsTable({transactions , addTransaction , fetchTransaction}) {

    const {Option} = Select ;

    const [search , setSearch] = useState("");
    const [typeFilter , setTypeFilter] = useState("");
    const [sortKey , setSortKey] = useState("") ;
    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Amount',
            dataIndex: 'amount',
            key: 'amount',
        },
        {
            title: 'Tag',
            dataIndex: 'tag',
            key: 'tag',
        },
        {
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
        },
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
        },
    ];

    let filteredTransaction = transactions.filter((item) => 
        item.name?.toLowerCase().includes(search?.toLowerCase() || '') && 
        item.type?.includes(typeFilter || '')
    );

    let sortedTransactions = filteredTransaction.sort((a,b) => {
        if(sortKey === "date") {
            return new Date(a.date) - new Date(b.date);
        }
        else if(sortKey === "amount") {
            return a.amount - b.amount ;
        }
        else return 0 ;
    });

    function exportToCsv(){
        var csv = unparse({
            fields : ["name" , "type" ,  "tag" , "date" , "amount"],
            data : transactions,
        });
        var data = new Blob([csv], {type: 'text/csv;charset=utf-8'});
        var csvURL = URL.createObjectURL(data);
        const link = document.createElement("a");
        link.href = csvURL;
        link.download = "transactions.csv" ;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);    
    }

    function importFromCsv(event){
        event.preventDefault();
        try{
            parse(event.target.files[0], {
                header : true ,
                complete : async function (results) {
                    console.log("Results : ",results)
                    //Now results.data is an array of objects represeenting your CSV rows
                    for(const transaction of results.data) {
                        //Write each transaction to Firebase you can use the addTransaction function here
                        console.log("Transactions : " , transaction);
                        const newTransaction = {
                            ...transaction,
                            amount : parseFloat(transaction.amount),
                        };
                        await addTransaction(newTransaction, true);
                    }
                }
            });
            toast.success("All transactions Added");
            fetchTransaction();
            event.target.files = null ;
        }
        catch(e){
            toast.error(e.message);
        }
    }

    return(
        <>
            <div className='table-section'>
                <div className='filter-table'>
            <div className='input-flex'>
                <img src={searchImg} width="16" alt=''/>
                <input
                    onChange={(e)=>setSearch(e.target.value)}
                    placeholder="Search By Name"
                />
            </div>

            <Select
                className='select-input'
                onChange={(value) => setTypeFilter(value)}
                value = {typeFilter}
                placeholder = "Filter"
                allowClear
                style={{width: 200}}
            >
                <Option value="">All</Option>
                <Option value="income">Income</Option>
                <Option value='expense'>Expense</Option>
            </Select>
            </div>
            
            <div className='my-table sort-table'>
                <h2>My Transactions</h2>
            <Radio.Group
                className='input-radio'
                onChange={(e) => setSortKey(e.target.value)}
                value = {sortKey}
            >
                <Radio.Button value="">No Sort</Radio.Button>
                <Radio.Button value="date">Sort by Date</Radio.Button>
                <Radio.Button value="amount">Sort by Amount</Radio.Button>
            </Radio.Group>
            <div className='import-export'>
                <button className="btn btn-blue" onClick={exportToCsv}>
                    Export To CSV
                </button>
                <label for="file-csv" className='btn btn-blue'>
                    Import From CSV
                </label>
                <input
                    onChange={importFromCsv}
                    id="file-csv"
                    type="file"
                    accept=".csv"
                    required
                    style={{display:"none"}}
                />
            </div>
            </div>
            <Table dataSource={sortedTransactions} columns={columns} />
            </div>
        </>
    );
}

export default TransactionsTable;
