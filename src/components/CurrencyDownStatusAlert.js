// @flow
import type {
  TokenCurrency,
  CryptoCurrency,
} from "@ledgerhq/live-common/lib/types";

type Props = {
  currencies: Array<CryptoCurrency | TokenCurrency>,
};

const CurrencyDownStatusAlert = (_: Props) => {
  return null;
};

export default CurrencyDownStatusAlert;
