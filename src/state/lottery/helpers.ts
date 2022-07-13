import { BigNumber as EthersBigNumber } from '@ethersproject/bignumber'
import BigNumber from 'bignumber.js'
import { LotteryStatus, LotteryTicket } from 'config/constants/types'
import lotteryV2Abi from 'config/abi/lotteryV2.json'
import { getLotteryV2Address } from 'utils/addressHelpers'
import { multicallv2 } from 'utils/multicall'
import { LotteryResponse, WinningTickets, WinnersResponse, HasAmountToWitdraw, HasReferralRewards } from 'state/types'
import { getLotteryV2Contract } from 'utils/contractHelpers'
import { ethersToSerializedBigNumber } from 'utils/bigNumber'
import { NUM_ROUNDS_TO_FETCH_FROM_NODES } from 'config/constants/lottery'

const lotteryContract = getLotteryV2Contract()

const processViewLotterySuccessResponse = (response, lotteryId: string): LotteryResponse => {
  const {
    status,
    startTime,
    endTime,
    priceTicketInBusd,
    firstTicketId,
    lastTicketId,
    amountCollectedInBusd,
    finalNumber,
    ticketsSold,
    prizes,
    minTicketsToSell,
    maxTicketsToSell,
    referralReward,
  } = response

  const statusKey = Object.keys(LotteryStatus)[status]
  const serializedPrizes = prizes.map((prize) => ethersToSerializedBigNumber(prize))

  let total: BigNumber = new BigNumber(0)
  for (let i = 0; i < prizes.length; i++) {
    total = total.plus(new BigNumber(prizes[i].toString()))
  }

  return {
    isLoading: false,
    lotteryId,
    status: LotteryStatus[statusKey],
    startTime: startTime?.toString(),
    endTime: endTime?.toString(),
    priceTicketInBusd: ethersToSerializedBigNumber(priceTicketInBusd),
    firstTicketId: firstTicketId?.toString(),
    lastTicketId: lastTicketId?.toString(),
    amountCollectedInBusd: ethersToSerializedBigNumber(amountCollectedInBusd),
    finalNumber,
    prizes: serializedPrizes,
    ticketsSold: ethersToSerializedBigNumber(ticketsSold),
    minTicketsToSell: ethersToSerializedBigNumber(minTicketsToSell),
    maxTicketsToSell: ethersToSerializedBigNumber(maxTicketsToSell),
    referralReward: ethersToSerializedBigNumber(referralReward),
    totalInPrizes: total.toString(),
  }
}

const processViewLotteryErrorResponse = (lotteryId: string): LotteryResponse => {
  return {
    isLoading: true,
    lotteryId,
    status: LotteryStatus.PENDING,
    startTime: '',
    endTime: '',
    priceTicketInBusd: '',
    firstTicketId: '',
    lastTicketId: '',
    amountCollectedInBusd: '',
    finalNumber: null,
    ticketsSold: '',
    prizes: [],
    minTicketsToSell: '',
    maxTicketsToSell: '',
    referralReward: '',
    totalInPrizes: '',
  }
}

export const fetchLottery = async (lotteryId: string): Promise<LotteryResponse> => {
  try {
    const lotteryData = await lotteryContract.viewLottery(lotteryId)
    return processViewLotterySuccessResponse(lotteryData, lotteryId)
  } catch (error) {
    return processViewLotteryErrorResponse(lotteryId)
  }
}

const processHasAmountToWithdrawResponse = (response): HasAmountToWitdraw => {
  return {
    tickets: ethersToSerializedBigNumber(response?.[0]),
    amount: ethersToSerializedBigNumber(response?.[1]),
    hasWithdrawAmount: ethersToSerializedBigNumber(response?.[1]) !== '0',
  }
}

export const fetchHasAmountToWithdraw = async (lotteryId: string, account: string): Promise<HasAmountToWitdraw> => {
  try {
    const rawData = await lotteryContract.hasAmountToWithdraw(lotteryId, account)
    return processHasAmountToWithdrawResponse(rawData)
  } catch (error) {
    return {
      tickets: '',
      amount: '',
      hasWithdrawAmount: false,
    }
  }
}

const processHasReferralRewardsResponse = (response): HasReferralRewards => {
  return {
    isLoading: false,
    amount: ethersToSerializedBigNumber(response),
  }
}

export const fetchHasReferralRewards = async (lotteryId: string, account: string): Promise<HasReferralRewards> => {
  try {
    const rawData = await lotteryContract.hasReferralRewardsToClaim(lotteryId, account)
    return processHasReferralRewardsResponse(rawData)
  } catch (error) {
    return {
      isLoading: false,
      amount: '',
    }
  }
}

const proccesWinningTicketsResponse = (response, lotteryId: string): WinningTickets => {
  const some: string[] = response
    .filter((res) => ethersToSerializedBigNumber(res?.lotteryId) === lotteryId)
    .map((res) => {
      return ethersToSerializedBigNumber(res?.ticket)
    })

  return {
    lotteryId,
    ticketNumber: some,
  }
}

const processWinningTicketsErrorResponse = (): WinningTickets => {
  return {
    lotteryId: '',
    ticketNumber: [],
  }
}

export const fetchWinningTickets = async (lotteryId: string): Promise<WinningTickets> => {
  try {
    const winningTickets = await lotteryContract.getWinningTickets()
    return proccesWinningTicketsResponse(winningTickets, lotteryId)
  } catch (error) {
    return processWinningTicketsErrorResponse()
  }
}

const proccesWinnersResponse = (response, lotteryId: string): WinnersResponse => {
  const { ticket, owner, claimed, prize } = response

  return {
    lotteryId,
    ticketNumber: ticket?.toString(),
    prize,
    user: owner,
    claimed,
  }
}

const processWinnersErrorResponse = (): WinnersResponse => {
  return {
    lotteryId: '',
    ticketNumber: '',
    prize: undefined,
    user: '',
    claimed: undefined,
  }
}

export const fetchWinners = async (lotteryId: string): Promise<WinnersResponse[]> => {
  try {
    const winners = await lotteryContract.getWinningTickets()

    const response: WinnersResponse[] = []

    winners
      ?.filter((res) => ethersToSerializedBigNumber(res?.lotteryId) === lotteryId)
      .map((res) => response.push(proccesWinnersResponse(res, lotteryId)))

    return response
  } catch (error) {
    return [processWinnersErrorResponse()]
  }
}

export const fetchMultipleLotteries = async (lotteryIds: string[]): Promise<LotteryResponse[]> => {
  const calls = lotteryIds.map((id) => ({
    name: 'viewLottery',
    address: getLotteryV2Address(),
    params: [id],
  }))
  try {
    const multicallRes = await multicallv2(lotteryV2Abi, calls, { requireSuccess: false })
    const processedResponses = multicallRes.map((res, index) =>
      processViewLotterySuccessResponse(res[0], lotteryIds[index]),
    )
    return processedResponses
  } catch (error) {
    console.error(error)
    return calls.map((call, index) => processViewLotteryErrorResponse(lotteryIds[index]))
  }
}

export const fetchCurrentLotteryId = async (): Promise<EthersBigNumber> => {
  return lotteryContract.currentLotteryId()
}

export const fetchCurrentLotteryIdAndMaxBuy = async () => {
  try {
    const calls = ['currentLotteryId', 'maxNumberTicketsPerBuyOrClaim'].map((method) => ({
      address: getLotteryV2Address(),
      name: method,
    }))
    const [[currentLotteryId], [maxNumberTicketsPerBuyOrClaim]] = (await multicallv2(
      lotteryV2Abi,
      calls,
    )) as EthersBigNumber[][]

    return {
      currentLotteryId: currentLotteryId ? currentLotteryId.toString() : null,
      maxNumberTicketsPerBuyOrClaim: maxNumberTicketsPerBuyOrClaim ? maxNumberTicketsPerBuyOrClaim.toString() : null,
    }
  } catch (error) {
    return {
      currentLotteryId: null,
      maxNumberTicketsPerBuyOrClaim: null,
    }
  }
}

export const getRoundIdsArray = (currentLotteryId: string): string[] => {
  const currentIdAsInt = parseInt(currentLotteryId, 10)
  const roundIds = []
  for (let i = 0; i < NUM_ROUNDS_TO_FETCH_FROM_NODES; i++) {
    if (currentIdAsInt - i >= 0) roundIds.push(currentIdAsInt - i)
  }
  return roundIds.map((roundId) => roundId.toString())
}

export const hasRoundBeenClaimed = (tickets: LotteryTicket[]): boolean => {
  const claimedTickets = tickets.filter((ticket) => ticket.status)
  return claimedTickets.length > 0
}
