export const validateBackDatedPayment = async (
  paymentDate,
  accountId,
  repository,
  schemeAccountRepository,
) => {
  const date = new Date(paymentDate);
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  const sameDayPayment = await repository.findOne({
    id_scheme_account: accountId,
    createdAt: { $gte: startOfDay, $lte: endOfDay },
    payment_status: { $ne: 0 },
  });

  if (sameDayPayment) {
    return {
      isValid: false,
      message: "A payment already exists for this date.",
    };
  }

  const futurePayment = await repository.findOne({
    id_scheme_account: accountId,
    createdAt: { $gt: endOfDay },
    payment_status: { $ne: 0 },
  });

  if (futurePayment) {
    return {
      isValid: false,
      message: "Cannot add payment: A later payment already exists.",
    };
  }

  const schemeAccount = await schemeAccountRepository.findById(accountId);
  if (schemeAccount) {
    const accountStartDate = new Date(schemeAccount.createdAt);
    accountStartDate.setHours(0, 0, 0, 0);

    if (startOfDay < accountStartDate) {
      return {
        isValid: false,
        message: "Payment date cannot be before account creation date.",
      };
    }
  }

  return { isValid: true };
};
