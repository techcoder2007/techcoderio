import { useEffect, useState } from "react";

interface BatteryManager extends EventTarget {
  charging: boolean;
  level: number;
  addEventListener(
    type: "chargingchange" | "levelchange",
    listener: () => void
  ): void;
  removeEventListener(
    type: "chargingchange" | "levelchange",
    listener: () => void
  ): void;
}

interface NavigatorWithBattery extends Navigator {
  getBattery?: () => Promise<BatteryManager>;
}

export function useBatteryStatus() {
  const [level, setLevel] = useState<number | null>(null);
  const [charging, setCharging] = useState(false);

  useEffect(() => {
    const getBatteryInfo = async () => {
      const nav = navigator as NavigatorWithBattery;

      if (!nav.getBattery) {
        console.warn("Battery Status API is not supported.");
        setLevel(null);
        return;
      }

      try {
        const battery = await nav.getBattery();

        setLevel(battery.level);
        setCharging(battery.charging);

        const handleLevel = () => setLevel(battery.level);
        const handleCharging = () => setCharging(battery.charging);

        battery.addEventListener("levelchange", handleLevel);
        battery.addEventListener("chargingchange", handleCharging);

        return () => {
          battery.removeEventListener("levelchange", handleLevel);
          battery.removeEventListener("chargingchange", handleCharging);
        };
      } catch (err) {
        console.error("Battery API error:", err);
        setLevel(null);
      }
    };

    const cleanupPromise = getBatteryInfo();

    return () => {
      cleanupPromise.then((cleanup) => cleanup?.());
    };
  }, []);

  return { level, charging };
}
