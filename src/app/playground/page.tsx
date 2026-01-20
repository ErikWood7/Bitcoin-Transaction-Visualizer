import { PlaygroundBuilder } from '@/components/PlaygroundBuilder';

export default function PlaygroundPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">Playground</h1>
      <p className="text-lg text-gray-600 mb-8">
        Build and experiment with Bitcoin transactions. Learn how UTXOs, change, and fees work together.
      </p>
      <PlaygroundBuilder />
    </div>
  );
}
