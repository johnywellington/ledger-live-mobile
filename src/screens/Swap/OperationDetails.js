import React, { useCallback } from "react";
import {
  ScrollView,
  StyleSheet,
  View,
  Linking,
  TouchableOpacity,
} from "react-native";
import type { MappedSwapOperation } from "@ledgerhq/live-common/lib/exchange/swap/types";
import {
  getAccountName,
  getAccountUnit,
  getAccountCurrency,
} from "@ledgerhq/live-common/lib/account/helpers";
import Icon from "react-native-vector-icons/dist/Ionicons";
import { Trans } from "react-i18next";
import { useSelector } from "react-redux";
import { flattenAccountsSelector } from "../../reducers/accounts";
import CurrencyUnitValue from "../../components/CurrencyUnitValue";
import LText from "../../components/LText";
import SectionSeparator from "../../components/SectionSeparator";
import CurrencyIcon from "../../components/CurrencyIcon";
import SwapStatusIndicator, { getStatusColor } from "./SwapStatusIndicator";
import colors from "../../colors";
import { urls } from "../../config/urls";
import { localeIds } from "../../languages";
import ExternalLink from "../../icons/ExternalLink";

type Props = {
  route: {
    params: {
      swapOperation: MappedSwapOperation,
    },
  },
};

const OperationDetails = ({ route }: Props) => {
  const { swapOperation } = route.params;
  const {
    swapId,
    provider,
    toAccount,
    fromAmount,
    toAmount,
    operation,
  } = swapOperation;

  const accounts = useSelector(flattenAccountsSelector);
  const fromAccount = accounts.find(a => a.id === swapOperation.fromAccount.id);
  const swap = fromAccount.swapHistory.find(s => s.swapId === swapId);
  const status = swap.status;

  const fromCurrency = getAccountCurrency(fromAccount);
  const toCurrency = getAccountCurrency(toAccount);
  const statusColor = getStatusColor(status);
  const dotStyles = { backgroundColor: statusColor };
  const textColorStyles = { color: statusColor };

  const openProvider = useCallback(() => {
    Linking.openURL(urls.swap.providers[provider].main);
  }, [provider]);

  return (
    <View style={styles.root}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
      >
        <SwapStatusIndicator status={status} />
        <LText tertiary style={styles.fromAmount}>
          <CurrencyUnitValue
            alwaysShowSign
            showCode
            unit={getAccountUnit(fromAccount)}
            value={fromAmount.times(-1)}
          />
        </LText>
        <View style={styles.arrow}>
          <Icon name={"ios-arrow-round-forward"} size={30} color={colors.fog} />
        </View>
        <LText tertiary style={styles.toAmount}>
          <CurrencyUnitValue
            alwaysShowSign
            showCode
            unit={getAccountUnit(toAccount)}
            value={toAmount}
          />
        </LText>
        <View style={styles.statusTextWrapper}>
          <View style={[styles.statusDot, dotStyles]} />
          <LText style={[styles.statusText, textColorStyles]}>{status}</LText>
        </View>
        <View style={styles.fieldsWrapper}>
          <LText style={styles.label}>
            <Trans i18nKey={"transfer.swap.operationDetails.swapId"} />
          </LText>
          <LText selectable style={styles.value}>
            {swapId}
          </LText>
          <LText style={styles.label}>
            <Trans i18nKey={"transfer.swap.operationDetails.provider"} />
          </LText>
          <TouchableOpacity
            style={styles.providerLinkContainer}
            onPress={openProvider}
          >
            <LText semiBold style={styles.providerLink}>
              {provider}
            </LText>
            <ExternalLink size={11} color={colors.live} />
          </TouchableOpacity>
          <LText style={styles.label}>
            <Trans i18nKey={"transfer.swap.operationDetails.date"} />
          </LText>
          <LText style={styles.value}>
            {operation.date.toLocaleDateString(localeIds, {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </LText>

          <SectionSeparator style={{ marginBottom: 32 }} />

          <LText style={styles.label}>
            <Trans i18nKey={"transfer.swap.operationDetails.from"} />
          </LText>
          <View style={styles.account}>
            <CurrencyIcon size={16} currency={fromCurrency} />
            <LText
              numberOfLines={1}
              ellipsizeMode="middle"
              semiBold
              style={styles.accountName}
            >
              {getAccountName(fromAccount)}
            </LText>
          </View>
          <LText style={styles.label}>
            <Trans i18nKey={"transfer.swap.operationDetails.fromAmount"} />
          </LText>
          <LText style={styles.value}>
            <CurrencyUnitValue
              showCode
              unit={getAccountUnit(fromAccount)}
              value={fromAmount}
            />
          </LText>

          <SectionSeparator style={{ marginBottom: 32 }} />

          <LText style={styles.label}>
            <Trans i18nKey={"transfer.swap.operationDetails.to"} />
          </LText>
          <View style={styles.account}>
            <CurrencyIcon size={16} currency={toCurrency} />
            <LText
              numberOfLines={1}
              ellipsizeMode="middle"
              semiBold
              style={styles.accountName}
            >
              {getAccountName(toAccount)}
            </LText>
          </View>
          <LText style={styles.label}>
            <Trans i18nKey={"transfer.swap.operationDetails.toAmount"} />
          </LText>
          <LText style={styles.value}>
            <CurrencyUnitValue
              showCode
              unit={getAccountUnit(toAccount)}
              value={toAmount}
            />
          </LText>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,

    backgroundColor: colors.white,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    padding: 24,
    alignItems: "center",
  },
  providerLinkContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 32,
  },

  providerLink: {
    textTransform: "capitalize",
    fontSize: 13,
    lineHeight: 22,
    textAlign: "center",
    color: colors.live,
    marginRight: 6,
  },
  status: {
    height: 54,
    width: 54,
    borderRadius: 54,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  statusTextWrapper: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginTop: 24,
  },
  statusDot: {
    height: 6,
    width: 6,
    marginRight: 8,
    borderRadius: 6,
    backgroundColor: "grey",
  },
  statusText: {
    fontSize: 16,
    lineHeight: 22,
    textTransform: "capitalize",
  },
  arrow: {
    transform: [{ rotate: "90deg" }],
    marginVertical: 8,
  },
  toAmount: {
    fontSize: 20,
    lineHeight: 24,
    color: colors.green,
  },
  fromAmount: {
    marginTop: 24,
    fontSize: 20,
    lineHeight: 24,
    color: colors.grey,
  },
  fieldsWrapper: {
    paddingTop: 32,
    alignSelf: "stretch",
    alignItems: "flex-start",
  },
  label: {
    marginBottom: 8,
    color: colors.grey,
    fontSize: 14,
    lineHeight: 19,
  },
  value: {
    marginBottom: 32,
    color: colors.darkBlue,
    fontSize: 14,
    lineHeight: 19,
  },
  account: {
    marginBottom: 32,
    flexDirection: "row",
    alignItems: "center",
  },
  accountName: {
    flex: 1,
    marginLeft: 8,
    color: colors.darkBlue,
  },
});

export default OperationDetails;
