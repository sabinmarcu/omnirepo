/* eslint-disable no-undef */
jest.mock('moize', () => {
  const { mockMoize } = jest.requireActual('@sabinmarcu/utils-test');
  const moizeActual = jest.requireActual('moize');
  const patchedMoize = mockMoize(moizeActual);
  return patchedMoize;
});
