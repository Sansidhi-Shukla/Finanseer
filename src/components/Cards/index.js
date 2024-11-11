import React from 'react';
import "./styles.css";
import Card from 'antd/lib/card/Card';
import { Row } from 'antd';
import Button from '../Button';

function Cards({income , expense , balance , showExpenseModal , showIncomeModal}) {
  return (
    <>
        <div>
          <Row className='my-row'>
            <Card bordered={true} className='my-card' title="Current Balance" >
                <p>Rs {balance} </p>
                <Button text="Reset Balance" blue={true} />
            </Card>
            <Card bordered={true} className='my-card' title="Total Income" >
                <p>Rs {income} </p>
                <Button text="Add Income" blue={true} onClick={showIncomeModal} />
            </Card>
            <Card bordered={true} className='my-card' title="Total Expense" >
                <p>Rs {expense} </p>
                <Button text="Add Expense" blue={true} onClick={showExpenseModal} />
            </Card>
          </Row>
        </div>
    </>
  )
}


export default Cards
