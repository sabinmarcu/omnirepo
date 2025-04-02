import { vi } from 'vitest';

vi.mock('moize', async (importOriginal) => {
  const { mockMoize } = await vi.importActual('@sabinmarcu/utils-test');
  const { default: moizeActual } = await importOriginal();
  const patchedMoize = mockMoize(moizeActual);
  return {
    default: patchedMoize,
  };
});
