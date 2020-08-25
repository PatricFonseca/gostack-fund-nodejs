import { Router, request, response } from 'express';

import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';

const transactionRouter = Router();
const transactionsRepository = new TransactionsRepository();

transactionRouter.get('/', (request, response) => {
  try {
    const transactions = transactionsRepository.all();

    const balance = transactionsRepository.getBalance();

    const result = {
      transactions,
      balance,
    };

    return response.json(result);
  } catch (err) {
    return response.status(400).json({ error: err.message });
  }
});

transactionRouter.post('/', (request, response) => {
  try {
    const createTransaction = new CreateTransactionService(
      transactionsRepository,
    );

    const { title, value, type } = request.body;

    const balance = transactionsRepository.getBalance();

    let total = balance.total;

    switch (type) {
      case 'outcome':
        if (total < value) {
          throw new Error('Not income enough');
        }
        break;
    }

    const transaction = createTransaction.execute({
      title,
      value,
      type,
    });

    return response.json(transaction);
  } catch (err) {
    return response.status(400).json({ error: err.message });
  }
});

export default transactionRouter;
