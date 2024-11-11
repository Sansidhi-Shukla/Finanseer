import { Line, Pie } from '@ant-design/charts';
import React from 'react'

function ChartComponent({sortedTransactions}) {
    console.log("transaction" , sortedTransactions);
    const data = (sortedTransactions || [] ).map((item) => {
        return {date: item.date , amount : item.amount };
    });

    /* const spendingData = (sortedTransactions || []).filter(
        (transaction) => {if(transaction.type === "expense"){
            return {tag:transaction.tag , amount : transaction.amount} ;
        }
    }); */

    const spendingData = (sortedTransactions || []).filter(
    (transaction) => transaction.type === "expense" // just filter the data
).map((transaction) => {
    return { tag: transaction.tag, amount: transaction.amount };
});

    /* let finalSpending = spendingData.reduce((acc,obj) => {
        let key = obj.tag;
        if(!acc[key]){
            acc[key] = {tag: obj.tag , amount : obj.amount};
        }
        else{
            acc[key].amount += (obj.amount || 0) ;
        }
        return acc;
    }, {}) ; */

    let finalSpending = Object.values(spendingData.reduce((acc, obj) => {
    let key = obj.tag;
    if (!acc[key]) {
        acc[key] = { tag: obj.tag, amount: obj.amount };
    } else {
        acc[key].amount += (obj.amount || 0);
    }
    return acc;
}, {}));


    /* const data = [
    { year: '1991', value: 3 },
    { year: '1992', value: 4 },
    { year: '1993', value: 3.5 },
    { year: '1994', value: 5 },
    { year: '1995', value: 4.9 },
    { year: '1996', value: 6 },
    { year: '1997', value: 7 },
    { year: '1998', value: 9 },
    { year: '1999', value: 13 },
  ]; */

    const config = {
        data : data,
        xField: 'date',
        yField: 'amount',
        width : 500 ,
        point:{
            size: 5,
            shape : "diamond" ,
        },
        label: {
            style : {
                fill: "#aaa",
            },
        }
    };

    const spendingConfig = {
        data : finalSpending,
        angleField : "amount",
        colorField : "tag" ,
        width : 500 ,
    }
    let chart ;
    let pieChart ;

    return (
        <div className='chart-wrapper'>
            <div className='chart-container'>
                <h1 className='heading'>Your Analytics</h1>
                <Line {...config} onReady={(chartInstance) => (chart = chartInstance)}/>
            </div>
            <div className='chart-container' style={{height:"500px" , padding:"2rem"}}>
                <h1 className='heading'>Your Spendings</h1>
                <Pie {...spendingConfig} onReady={(chartInstance) => (pieChart = chartInstance)}/>
            </div>
        </div>
    );
}

export default ChartComponent
