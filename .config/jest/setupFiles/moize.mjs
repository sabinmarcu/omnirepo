/* eslint-disable no-undef */
jest.mock('moize', () => {
  const moizeMock = jest.requireActual('../mocks/moize').mock;
  const moizeActual = jest.requireActual('moize');
  const patchedMoize = moizeMock(moizeActual);
  return patchedMoize;
});
