/**
 * wrap values with datetime
 * @param {Array<Object.<string, *>>} valuesList - values list.
 * @returns {Array<Object.<string, *>>} A list of data with datetime type parameters wrapped in it.
 */
export const wrapValueWithdatetime = (valuesList) => {
  return valuesList.map((values) => {
    return {
      ...values,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  });
};
