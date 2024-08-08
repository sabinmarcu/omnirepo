import { PrimitiveAtom, useAtom, useSetAtom } from "jotai";
import { useDndSensors } from "./useDndSensors.ts";
import { useCallback } from "react";
import { swapElementsInArray } from "../utils/arrays.ts";
import { DragEndEvent } from "@dnd-kit/core";

export const useDndSort = <
  T extends { id: string }
>(
  atom: PrimitiveAtom<T[]>
) => {
  const [list, setList] = useAtom(atom)
  const sensors = useDndSensors();
  const items = list.map((it) => it.id);
  const onDragEnd = useCallback(
    (event: DragEndEvent) => {
      setList((oldList) => swapElementsInArray(oldList, event));
    },
    [setList],
  );
  return {
    sensors,
    items,
    onDragEnd,
  } as const;
}
