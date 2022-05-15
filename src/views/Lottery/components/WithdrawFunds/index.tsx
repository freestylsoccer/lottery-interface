import styled from 'styled-components'
import { Heading, ModalContainer, ModalHeader, ModalTitle, ModalBody, ModalCloseButton } from '@pancakeswap/uikit'
import { useWeb3React } from '@web3-react/core'
import { useTranslation } from 'contexts/Localization'
import { useAppDispatch } from 'state'
import { useLottery } from 'state/lottery/hooks'
import { fetchUserLotteries } from 'state/lottery'
import WithdrawFundsInner from './WithdrawFundsInner'

const StyledModal = styled(ModalContainer)`
  position: relative;
  overflow: visible;

  ${({ theme }) => theme.mediaQueries.sm} {
    min-width: 380px;
  }
`

const StyledModalHeader = styled(ModalHeader)`
  background: ${({ theme }) => theme.colors.gradients.cardHeader};
  border-top-right-radius: 32px;
  border-top-left-radius: 32px;
`

const BunnyDecoration = styled.div`
  position: absolute;
  top: -116px; // line up bunny at the top of the modal
  left: 0px;
  text-align: center;
  width: 100%;
`

interface WithdrawModalModalProps {
  roundId: string
  onDismiss?: () => void
}

const WithdrawModal: React.FC<WithdrawModalModalProps> = ({ onDismiss, roundId }) => {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const { currentLotteryId } = useLottery()
  const dispatch = useAppDispatch()

  return (
    <StyledModal minWidth="280px">
      <BunnyDecoration>
        <img src="/images/decorations/prize-bunny.png" alt="bunny decoration" height="124px" width="168px" />
      </BunnyDecoration>
      <StyledModalHeader>
        <ModalTitle>
          <Heading>{t('Withdraw Funds')}</Heading>
        </ModalTitle>
        <ModalCloseButton onDismiss={onDismiss} />
      </StyledModalHeader>
      <ModalBody p="24px">
        <WithdrawFundsInner
          onSuccess={() => {
            dispatch(fetchUserLotteries({ account, currentLotteryId }))
            onDismiss?.()
          }}
          roundId={roundId}
        />
      </ModalBody>
    </StyledModal>
  )
}

export default WithdrawModal
