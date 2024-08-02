export const emailRegex =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

export const isValidCard = (number: string) => {
  const brand = validationFlag(number);
  if (!brand) return false;

  return true;
};

export const validationFlag = (number: string) => {
  if (!number) return null;
  const isFormatted = number.replace(/\s/g, '');

  if (/^4[0-9]{12}(?:[0-9]{3})?$/.test(isFormatted)) {
    return 'Visa';
  }
  if (/^5[1-5][0-9]{14}$|^2(?:2(?:2[1-9]|[3-9][0-9])|[3-6][0-9][0-9]|7(?:[01][0-9]|20))[0-9]{12}$/.test(isFormatted)) {
    return 'Mastercard';
  }
  if (/^3[47][0-9]{13}$/.test(isFormatted)) {
    return 'American Express';
  }
  if (
    /^65[4-9][0-9]{13}|64[4-9][0-9]{13}|6011[0-9]{12}|(622(?:12[6-9]|1[3-9][0-9]|[2-8][0-9][0-9]|9[01][0-9]|92[0-5])[0-9]{10})$/.test(isFormatted)
  ) {
    return 'Discover';
  }
  if (/^(5018|5081|5044|5020|5038|603845|6304|6759|676[1-3]|6799|6220|504834|504817|504645)[0-9]{8,15}$/.test(isFormatted)) {
    return 'Maestro';
  }
  if (/^(?:2131|1800|35[0-9]{3})[0-9]{11}$/.test(isFormatted)) {
    return 'JCB';
  }
  if (/^3(?:0[0-5]|[68][0-9])[0-9]{11}$/.test(isFormatted)) {
    return 'Diners Club';
  }

  return null;
};

export const CNPJ = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/;

export const TELEFONE = /^\(?\d{2}\)?\s?9?\d{5}-?\d{4}$/;


export const optionalTelefone = /^\(?\d{2}\)?\s?\d{4}-?\d{4}$/;

export const CPF = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;

export const DATE = /^\d{2}\/\d{2}\/\d{4}$/;

export const NUMBER = /^\d+$/;

