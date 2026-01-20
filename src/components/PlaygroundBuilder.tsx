'use client';

import { useState, useMemo } from 'react';
import { playgroundScenarios, type PlaygroundScenario } from '@/content/playgroundScenarios';
import { buildSimTx } from '@/lib/playground/buildSimTx';
import { normalizeTx } from '@/lib/normalizeTx';
import { satsToBtcString, formatSats } from '@/lib/format';
import { TxPageClient } from './TxPageClient';

export function PlaygroundBuilder() {
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>(playgroundScenarios[0].id);
  const [sendAmountBtc, setSendAmountBtc] = useState<string>('0.01');
  const [feeRate, setFeeRate] = useState<string>('10');
  const [recipientAddress, setRecipientAddress] = useState<string>('bc1qrecipient1234567890abcdefghijklmnopqrstuvwxyz');
  const [changeAddress, setChangeAddress] = useState<string>('bc1qchange1234567890abcdefghijklmnopqrstuvwxyz');

  const selectedScenario = playgroundScenarios.find((s) => s.id === selectedScenarioId) || playgroundScenarios[0];

  // Calculate total available
  const totalAvailable = selectedScenario.utxos.reduce((sum, utxo) => sum + utxo.value_sats, 0);

  // Build simulated transaction
  const simResult = useMemo(() => {
    const sendAmountSats = Math.round(parseFloat(sendAmountBtc || '0') * 100_000_000);
    const feeRateSatPerVByte = parseFloat(feeRate || '10');

    if (sendAmountSats <= 0 || feeRateSatPerVByte <= 0) {
      return null;
    }

    return buildSimTx({
      utxos: selectedScenario.utxos,
      sendAmountSats,
      recipientAddress,
      changeAddress,
      feeRateSatPerVByte,
    });
  }, [selectedScenario, sendAmountBtc, feeRate, recipientAddress, changeAddress]);

  const normalizedTx = simResult?.canSend && simResult.tx ? normalizeTx(simResult.tx) : null;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Build a Transaction</h2>
        <p className="text-gray-600 mb-6">
          Select a scenario, set the amount to send and fee rate, then see how the transaction is constructed.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Scenario Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Scenario
            </label>
            <select
              value={selectedScenarioId}
              onChange={(e) => setSelectedScenarioId(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {playgroundScenarios.map((scenario) => (
                <option key={scenario.id} value={scenario.id}>
                  {scenario.name} - {scenario.utxos.length} UTXOs
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">{selectedScenario.description}</p>
            <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
              <p className="font-medium text-gray-700">Available UTXOs:</p>
              <ul className="list-disc list-inside mt-1 space-y-1 text-gray-600">
                {selectedScenario.utxos.map((utxo, idx) => (
                  <li key={idx}>
                    {satsToBtcString(utxo.value_sats)} (UTXO #{idx + 1})
                  </li>
                ))}
              </ul>
              <p className="mt-2 font-semibold text-gray-900">
                Total: {satsToBtcString(totalAvailable)}
              </p>
            </div>
          </div>

          {/* Transaction Parameters */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Send Amount (BTC)
              </label>
              <input
                type="number"
                step="0.00000001"
                min="0"
                value={sendAmountBtc}
                onChange={(e) => setSendAmountBtc(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0.01"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fee Rate (sat/vB)
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                value={feeRate}
                onChange={(e) => setFeeRate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="10"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Recipient Address
              </label>
              <input
                type="text"
                value={recipientAddress}
                onChange={(e) => setRecipientAddress(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                placeholder="bc1q..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Change Address
              </label>
              <input
                type="text"
                value={changeAddress}
                onChange={(e) => setChangeAddress(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                placeholder="bc1q..."
              />
            </div>
          </div>
        </div>

        {/* Transaction Summary */}
        {simResult && (
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">Transaction Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-blue-700">Selected UTXOs:</span>
                <p className="font-semibold text-blue-900">{simResult.selectedUTXOs.length}</p>
              </div>
              <div>
                <span className="text-blue-700">Total Input:</span>
                <p className="font-semibold text-blue-900">
                  {satsToBtcString(simResult.selectedUTXOs.reduce((sum, u) => sum + u.value_sats, 0))}
                </p>
              </div>
              <div>
                <span className="text-blue-700">Fee:</span>
                <p className="font-semibold text-blue-900">{satsToBtcString(simResult.fee)}</p>
              </div>
              <div>
                <span className="text-blue-700">Change:</span>
                <p className="font-semibold text-blue-900">{satsToBtcString(simResult.change)}</p>
              </div>
            </div>
            {simResult.error && (
              <div className="mt-3 p-3 bg-red-100 border border-red-300 rounded text-red-800 text-sm">
                {simResult.error}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Display Transaction */}
      {simResult?.canSend && normalizedTx && simResult.tx && (
        <div className="border-t-4 border-blue-500 pt-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Simulated Transaction</h2>
          <TxPageClient tx={simResult.tx} normalizedTx={normalizedTx} />
        </div>
      )}
    </div>
  );
}
