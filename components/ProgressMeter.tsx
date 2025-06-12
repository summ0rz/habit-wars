'use client';

type ProgressMeterProps = {
  currentValue: number;
  maxValue: number;
  cadence: 'daily' | 'weekly' | 'monthly';
};

export default function ProgressMeter({ currentValue, maxValue, cadence }: ProgressMeterProps) {
  const progressPercentage = Math.min((currentValue / maxValue) * 100, 100);

  return (
    <div className="mt-2">
      <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
        <span>Progress</span>
        <span>
          {currentValue} / {maxValue} times {cadence === 'daily' ? 'today' : 'this ' + cadence.slice(0, -2)}
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mt-1">
        <div
          className="bg-green-600 h-2.5 rounded-full"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
    </div>
  );
} 