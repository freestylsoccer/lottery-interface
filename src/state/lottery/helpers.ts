import { BigNumber as EthersBigNumber } from '@ethersproject/bignumber'
import { LotteryStatus, LotteryTicket } from 'config/constants/types'
import lotteryV2Abi from 'config/abi/lotteryV2.json'
import { getLotteryV2Address } from 'utils/addressHelpers'
import { multicallv2 } from 'utils/multicall'
import { LotteryResponse } from 'state/types'
import { getLotteryV2Contract } from 'utils/contractHelpers'
import { ethersToSerializedBigNumber } from 'utils/bigNumber'
import { NUM_ROUNDS_TO_FETCH_FROM_NODES } from 'config/constants/lottery'

const lotteryContract = getLotteryV2Contract()

const processViewLotterySuccessResponse = (response, lotteryId: string): LotteryResponse => {
  const {
    status,
    startTime,
    endTime,
    priceTicketInCake,
    firstTicketId,
    lastTicketId,
    amountCollectedInCake,
    finalNumber,
    ticketsSold,
    prizes,
    minTicketsToSell,
    maxTicketsToSell,
    referralReward,
  } = response

  const statusKey = Object.keys(LotteryStatus)[status]
  const serializedPrizes = prizes.map((prize) => ethersToSerializedBigNumber(prize))

  let total: EthersBigNumber = EthersBigNumber.from(0)
  for (let i = 0; i < prizes.length; i++) {
    total = total.add(prizes[i])
  }

  return {
    isLoading: false,
    lotteryId,
    status: LotteryStatus[statusKey],
    startTime: startTime?.toString(),
    endTime: endTime?.toString(),
    priceTicketInCake: ethersToSerializedBigNumber(priceTicketInCake),
    firstTicketId: firstTicketId?.toString(),
    lastTicketId: lastTicketId?.toString(),
    amountCollectedInCake: ethersToSerializedBigNumber(amountCollectedInCake),
    finalNumber,
    prizes: serializedPrizes,
    ticketsSold: ethersToSerializedBigNumber(ticketsSold),
    minTicketsToSell: ethersToSerializedBigNumber(minTicketsToSell),
    maxTicketsToSell: ethersToSerializedBigNumber(maxTicketsToSell),
    referralReward: ethersToSerializedBigNumber(referralReward),
    totalInPrizes: ethersToSerializedBigNumber(total),
  }
}

const processViewLotteryErrorResponse = (lotteryId: string): LotteryResponse => {
  return {
    isLoading: true,
    lotteryId,
    status: LotteryStatus.PENDING,
    startTime: '',
    endTime: '',
    priceTicketInCake: '',
    firstTicketId: '',
    lastTicketId: '',
    amountCollectedInCake: '',
    finalNumber: null,
    ticketsSold: '',
    prizes: [],
    minTicketsToSell: '',
    maxTicketsToSell: '',
    referralReward: '',
    totalInPrizes: null,
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
    roundIds.push(currentIdAsInt - i)
  }
  return roundIds.map((roundId) => roundId.toString())
}

export const hasRoundBeenClaimed = (tickets: LotteryTicket[]): boolean => {
  const claimedTickets = tickets.filter((ticket) => ticket.status)
  return claimedTickets.length > 0
}
