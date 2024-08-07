import { useAtomValue } from 'jotai';
import {
  percentDropRate,
  upperLimitDropRate,
} from '../state/atoms.js';
import { Counter } from './Counter.js';
import { Section } from './Section.js';
import {
  BodyDescription,
  BodyText,
} from './Display.js';

export function CounterSection() {
  const upperLimit = useAtomValue(upperLimitDropRate);
  const print = Number.parseInt(`${upperLimit}`, 10);

  return (
    <Section style={{ marginBlockStart: '2rem' }}>
      <BodyText>Enter your drop-rate below</BodyText>
      <Counter atom={percentDropRate} afterText="%" />
      {print === 1
        ? (
          <BodyDescription>
            ... that&apos;s a guaranteed drop, what are you doing here?
          </BodyDescription>
        )
        : (
          <BodyDescription>
            ... this is equal to a 1 in roughly
            {` ${print} `}
            chances you&apos;ll win
          </BodyDescription>
        )}
    </Section>
  );
}
