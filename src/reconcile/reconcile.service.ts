import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as csv from 'fast-csv';
import { Transaction } from './types/transaction.interface';

@Injectable()
export class ReconcileService {
  async reconcileFiles(fileAPath: string, fileBPath: string) {
    const sourceAMap = new Map<string, Transaction>();
    const sourceBMap = new Map<string, Transaction>();

    // 1. Load file A into map
    await this.parseCSV(fileAPath, (row) => {
      sourceAMap.set(row.id, row);
    });

    // 2. Load file B into map
    await this.parseCSV(fileBPath, (row) => {
      sourceBMap.set(row.id, row);
    });

    // 3. Compare maps
    const missingInB: Transaction[] = [];
    const missingInA: Transaction[] = [];
    const amountMismatch: { id: string, from: number, to: number }[] = [];
    const statusMismatch: { id: string, from: string, to: string }[] = [];

    for (const [id, txA] of sourceAMap.entries()) {
      const txB = sourceBMap.get(id);
      if (!txB) {
        missingInB.push(txA);
      } else {
        if (txA.amount !== txB.amount) {
          amountMismatch.push({ id, from: txA.amount, to: txB.amount });
        }
        if (txA.status !== txB.status) {
          statusMismatch.push({ id, from: txA.status, to: txB.status });
        }
      }
    }

    for (const [id, txB] of sourceBMap.entries()) {
      if (!sourceAMap.has(id)) {
        missingInA.push(txB);
      }
    }

    return {
      missingInB,
      missingInA,
      amountMismatch,
      statusMismatch,
    };
  }

  private parseCSV(filePath: string, onRow: (row: Transaction) => void): Promise<void> {
    return new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csv.parse({ headers: true }))
        .on('data', (row) => {
          const formatted: Transaction = {
            id: row.transactionId,
            timestamp: row.timestamp,
            amount: parseFloat(row.amount),
            currency: row.currency,
            status: row.status,
          };
          onRow(formatted);
        })
        .on('end', resolve)
        .on('error', reject);
    });
  }
}
