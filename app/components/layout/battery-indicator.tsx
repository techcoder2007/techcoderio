import { BatteryCharging } from 'lucide-react';
import { useBatteryStatus } from '~/hooks/useBatteryStatus';
import { Battery } from '~/icons';

function BatteryIndicator() {
  const {  charging,  level } =  useBatteryStatus();

  if (level === null) {
    return <p>Battery information is not available.</p>;
  }

  return (
    <div className='flex items-center gap-1'>
      <BatteryStatus
        isCharging={charging}
      />
      <p>{Math.round(level * 100)}%</p>
    </div>
  );
}


interface BatteryStatusProps {
  isCharging: boolean;
}

function BatteryStatus({ isCharging }: BatteryStatusProps) {
  return <>
    {isCharging ? <BatteryCharging size={16} /> : <Battery />}
  </>
}

export { BatteryIndicator, BatteryStatus };
