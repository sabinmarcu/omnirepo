import { useAtomValue } from 'jotai';
import {
  percentDropRate,
  upperLimitDropRate,
} from '../state/atoms';
import { Counter } from './Counter';
import { Section } from './Section';
import {
  BodyDescription,
  BodyText,
} from './Display';

export const CounterSection = () => {
  const upperLimit = useAtomValue(upperLimitDropRate);
  const print = Number.parseInt(`${upperLimit}`, 10);

  return (
    <Section>
      <BodyText>Enter your drop-rate below</BodyText>
      <Counter atom={percentDropRate} afterText="%" />
      {print === 1
        ? (
          <BodyDescription>
            ... that&apos;s a guaranteed drop, what are you doing here?
          </BodyDescription>
        ) : (
          <BodyDescription>
            ... this is equal to a 1 in roughly
            {` ${print} `}
            chances you&apos;ll win
          </BodyDescription>
        )}
    </Section>
  );
};
