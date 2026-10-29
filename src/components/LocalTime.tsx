import { useEffect, useState } from "react";

// Etc/GMT+3 is POSIX notation for UTC-3 (the sign is inverted), so no city is implied
const format = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Etc/GMT+3",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

export const LocalTime = () => {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const tick = () => {
      setNow(new Date());
      timer = setTimeout(tick, 60_000 - (Date.now() % 60_000));
    };
    timer = setTimeout(tick, 60_000 - (Date.now() % 60_000));
    return () => clearTimeout(timer);
  }, []);

  const [hours, minutes] = format.format(now).split(":");
  return (
    <time dateTime={now.toISOString()} className="m1-local-time">
      {hours}
      <span className="m1-local-colon">:</span>
      {minutes} · UTC-3
    </time>
  );
};
