import { TourPlayer } from '@/components/TourPlayer';

export default function TourPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">Interactive Tour</h1>
      <p className="text-lg text-gray-600 mb-8">
        Take a guided tour through Bitcoin transactions. Learn about inputs, outputs, fees, and more.
      </p>
      <TourPlayer />
    </div>
  );
}
