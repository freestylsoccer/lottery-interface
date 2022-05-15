import BigNumber from 'bignumber.js'
import { LotteryResponse, LotteryRound, LotteryRoundUserTickets } from 'state/types'

/**
 * Remove the '1' and reverse the digits in a lottery number retrieved from the smart contract
 */
export const parseRetrievedNumber = (number: string): string => {
  const numberAsArray = number.split('')
  numberAsArray.splice(0, 1)
  // numberAsArray.reverse()
  return numberAsArray.join('')
}

export const getDrawnDate = (locale: string, endTime: string) => {
  const endTimeInMs = parseInt(endTime, 10) * 1000
  const endTimeAsDate = new Date(endTimeInMs)
  return endTimeAsDate.toLocaleDateString(locale, dateTimeOptions)
}

export const dateOptions: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
}

export const timeOptions: Intl.DateTimeFormatOptions = {
  hour: 'numeric',
  minute: 'numeric',
}

export const dateTimeOptions: Intl.DateTimeFormatOptions = {
  ...dateOptions,
  ...timeOptions,
}

export const processLotteryResponse = (
  lotteryData: LotteryResponse & { userTickets?: LotteryRoundUserTickets },
): LotteryRound => {
  const { priceTicketInBusd: priceTicketInBusdAsString, amountCollectedInBusd: amountCollectedInBusdAsString } =
    lotteryData

  const priceTicketInBusd = new BigNumber(priceTicketInBusdAsString)
  const amountCollectedInBusd = new BigNumber(amountCollectedInBusdAsString)

  return {
    isLoading: lotteryData.isLoading,
    lotteryId: lotteryData.lotteryId,
    userTickets: lotteryData.userTickets,
    status: lotteryData.status,
    startTime: lotteryData.startTime,
    endTime: lotteryData.endTime,
    priceTicketInBusd,
    firstTicketId: lotteryData.firstTicketId,
    lastTicketId: lotteryData.lastTicketId,
    amountCollectedInBusd,
    finalNumber: lotteryData.finalNumber,
    ticketsSold: lotteryData.ticketsSold,
    minTicketsToSell: lotteryData.minTicketsToSell,
    maxTicketsToSell: lotteryData.maxTicketsToSell,
    referralReward: lotteryData.referralReward,
    prizes: lotteryData.prizes,
  }
}
