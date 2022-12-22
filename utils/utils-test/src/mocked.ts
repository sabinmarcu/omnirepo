export const mocked = <
  Arguments extends any[],
  ReturnValue extends any,
>(
  function_: (...arguments_: Arguments) => ReturnValue,
): jest.Mock<ReturnValue, Arguments> => function_ as unknown as jest.Mock;
