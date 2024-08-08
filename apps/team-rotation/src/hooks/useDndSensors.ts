import {
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';

export const useDndSensors = () => {
  const pointerSensor = useSensor(PointerSensor);
  const touchSensor = useSensor(TouchSensor);
  return useSensors(
    navigator.maxTouchPoints ? touchSensor : pointerSensor,
  );
};
