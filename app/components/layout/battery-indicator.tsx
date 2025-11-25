import { BatteryCharging } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Battery } from '~/icons';
import type { NavigatorWithBattery } from '~/interfaces/battery-manager';


function BatteryIndicator() {
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null);
  const [isCharging, setIsCharging] = useState<boolean>(false);

  useEffect(() => {
    const getBatteryInfo = async () => {
      const navigatorWithBattery = navigator as NavigatorWithBattery;

      if (navigatorWithBattery.getBattery) {
        try {
          const battery = await navigatorWithBattery.getBattery!();
          setBatteryLevel(battery.level);
          setIsCharging(battery.charging);

          const handleLevelChange = () => {
            setBatteryLevel(battery.level);
          };

          const handleChargingChange = () => {
            setIsCharging(battery.charging);
          };

          battery.addEventListener('levelchange', handleLevelChange);
          battery.addEventListener('chargingchange', handleChargingChange);

          // Cleanup function to remove event listeners
          return () => {
            battery.removeEventListener('levelchange', handleLevelChange);
            battery.removeEventListener('chargingchange', handleChargingChange);
          };
        } catch (error) {
          console.error('Battery status is not supported or an error occurred:', error);
          setBatteryLevel(null);
        }
      } else {
        console.warn('Battery Status API is not supported in this browser.');
        setBatteryLevel(null);
      }
    };

    getBatteryInfo();
  }, []);

  if (batteryLevel === null) {
    return <p>Battery information is not available.</p>;
  }

  return (
    <div className='flex items-center gap-1'>
      <BatteryStatus
        isCharging={isCharging}
      />
      <p>{Math.round(batteryLevel * 100)}%</p>
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