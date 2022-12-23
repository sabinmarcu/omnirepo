/* eslint-disable no-undef */
jest.mock('moize', () => {
  const { moizeMock } = jest.requireActual('@sabinmarcu/utils-test');
  const moizeActual = jest.requireActual('moize');
  const patchedMoize = moizeMock(moizeActual);
  return patchedMoize;
});
