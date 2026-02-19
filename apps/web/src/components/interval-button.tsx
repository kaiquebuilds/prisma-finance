"use client";

import { Button } from "@/components/ui/button";
import { useState, useRef, useEffect, ReactNode } from "react";

type IntervalButtonProps = {
  onClick: () => void;
  waitAmountInSecods: number;
  render: (isIntervalActive: boolean, secondsRemaining: number) => ReactNode;
};

export function IntervalButton({
  onClick,
  waitAmountInSecods,
  render,
}: IntervalButtonProps) {
  const [secondsRemaining, setSecondsRemaining] = useState(waitAmountInSecods);
  const intervalIdRef = useRef<NodeJS.Timeout | null>(null);
  const isIntervalActive = secondsRemaining > 0;

  function createInterval() {
    if (intervalIdRef.current !== null) return;

    intervalIdRef.current = setInterval(() => {
      setSecondsRemaining((curr) => {
        if (curr > 1) {
          return curr - 1;
        }
        if (intervalIdRef.current) {
          clearInterval(intervalIdRef.current);
          intervalIdRef.current = null;
        }
        return 0;
      });
    }, 1000);
  }

  useEffect(() => {
    createInterval();
    return () => {
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
        intervalIdRef.current = null;
      }
    };
  }, []);

  function clickHandler() {
    setSecondsRemaining(waitAmountInSecods);
    createInterval();
    onClick();
  }

  return (
    <Button
      variant="link"
      className="text-sm p-0 text-text-brand-secondary"
      disabled={isIntervalActive}
      onClick={clickHandler}
    >
      {render(isIntervalActive, secondsRemaining)}
    </Button>
  );
}
