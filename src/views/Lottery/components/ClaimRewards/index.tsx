import styled from 'styled-components'
import { Heading, ModalContainer, ModalHeader, ModalTitle, ModalBody, ModalCloseButton } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import ClaimRewardsInner from './ClaimRewardsInner'

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

interface ClaimRewardsModalModalProps {
  roundId: string
  onDismiss?: () => void
}

const ClaimRewardsModal: React.FC<ClaimRewardsModalModalProps> = ({ onDismiss, roundId }) => {
  const { t } = useTranslation()

  return (
    <StyledModal minWidth="280px">
      <BunnyDecoration>
        <img src="/images/decorations/prize-bunny.png" alt="bunny decoration" height="124px" width="168px" />
      </BunnyDecoration>
      <StyledModalHeader>
        <ModalTitle>
          <Heading>{t('Claim Referral Rewards')}</Heading>
        </ModalTitle>
        <ModalCloseButton onDismiss={onDismiss} />
      </StyledModalHeader>
      <ModalBody p="24px">
        <ClaimRewardsInner
          onSuccess={() => {
            onDismiss?.()
          }}
          roundId={roundId}
        />
      </ModalBody>
    </StyledModal>
  )
}

export default ClaimRewardsModal
