import styled from 'styled-components'
import { Text, Flex, Box, CloseIcon, IconButton, useMatchBreakpoints } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { usePhishingBannerManager } from 'state/user/hooks'

const Container = styled(Flex)`
  overflow: hidden;
  height: 100%;
  padding: 12px;
  align-items: center;
  background: linear-gradient(0deg, rgba(39, 38, 44, 0.4), rgba(39, 38, 44, 0.4)),
    linear-gradient(180deg, #8051d6 0%, #492286 100%);
  ${({ theme }) => theme.mediaQueries.md} {
    padding: 0px;
    background: linear-gradient(180deg, #8051d6 0%, #492286 100%);
  }
`

const InnerContainer = styled(Flex)`
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
`

const SpeechBubble = styled.div`
  background: rgba(39, 38, 44, 0.4);
  border-radius: 16px;
  padding: 8px;
  width: 60%;
  height: 80%;
  display: flex;
  align-items: center;
  flex-wrap: wrap;

  & ${Text} {
    flex-shrink: 0;
    margin-right: 4px;
  }
`

const PhishingWarningBanner: React.FC = () => {
  const { t } = useTranslation()
  const [, hideBanner] = usePhishingBannerManager()
  const { isMobile, isMd } = useMatchBreakpoints()
  const warningText = t("please make sure you're visiting https://lottery.finance - check the URL carefully.")
  const warningTextAsParts = warningText.split(/(https:\/\/lottery.finance)/g)
  const warningTextComponent = (
    <>
      <Text as="span" color="warning" small bold textTransform="uppercase">
        {t('Phishing warning: ')}
      </Text>
      {warningTextAsParts.map((text, i) => (
        <Text
          // eslint-disable-next-line react/no-array-index-key
          key={i}
          small
          as="span"
          bold={text === 'https://lottery.finance'}
          color={text === 'https://lottery.finance' ? '#FFFFFF' : '#BDC2C4'}
        >
          {text}
        </Text>
      ))}
    </>
  )
  return (
    <Container className="warning-banner">
      {isMobile || isMd ? (
        <>
          <Box>{warningTextComponent}</Box>
          <IconButton onClick={hideBanner} variant="text">
            <CloseIcon color="#FFFFFF" />
          </IconButton>
        </>
      ) : (
        <>
          <InnerContainer>
            <picture>
              <source
                type="image/webp"
                srcSet="https://static.wixstatic.com/media/c524024639d04e6bac9378d27e236178.png/v1/fill/w_324,h_454,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/cerdo%20cubo%20con%20cubos%20de%20color%20amarillo.png"
              />
              <source
                type="image/png"
                srcSet="https://static.wixstatic.com/media/c524024639d04e6bac9378d27e236178.png/v1/fill/w_324,h_454,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/cerdo%20cubo%20con%20cubos%20de%20color%20amarillo.png"
              />
              <img
                src="https://static.wixstatic.com/media/c524024639d04e6bac9378d27e236178.png/v1/fill/w_324,h_454,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/cerdo%20cubo%20con%20cubos%20de%20color%20amarillo.png"
                alt="phishing-warning"
                width="52px"
              />
            </picture>
            <SpeechBubble>{warningTextComponent}</SpeechBubble>
          </InnerContainer>
          <IconButton onClick={hideBanner} variant="text">
            <CloseIcon color="#FFFFFF" />
          </IconButton>
        </>
      )}
    </Container>
  )
}

export default PhishingWarningBanner
