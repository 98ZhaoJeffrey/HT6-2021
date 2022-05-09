import { Flex, Heading, Button, Box, ButtonGroup, Spacer } from "@chakra-ui/react"
import { Step, Steps, useSteps } from "chakra-ui-steps"

interface Props {
  steps: string[],
  children: React.ReactNode
}
const steps = [{ label: "Step 1" }, { label: "Step 2" }, { label: "Step 3" }]

export const VSteps = (props: Props) => {
  const { nextStep, prevStep, reset, activeStep, setStep } = useSteps({
    initialStep: 0,
  })
  return (
    <>
      <Steps orientation="vertical" activeStep={activeStep} onClickStep={(step) => setStep(step)}>
        {props.steps.map((label , index) => (
          <Step width="100%" label={label} key={index}>
            <Box my={1}></Box>
          </Step>
        ))}
      </Steps>
      {activeStep === steps.length ? (
        <Flex px={4} py={4} width="100%" flexDirection="column">
          <Heading fontSize="xl" textAlign="center">
            Woohoo! All steps completed!
          </Heading>
          <ButtonGroup mt="2rem">
            {props.children}
            <Spacer/>
            <Button colorScheme='blue' onClick={reset}>
              Reset
            </Button>
          </ButtonGroup>
        </Flex>
      ) : (
        <Flex width="100%" justify="flex-end">
          <Button
            isDisabled={activeStep === 0}
            mr={4}
            onClick={prevStep}
            size="sm"
            variant="ghost"
          >
            Prev
          </Button>
          <Button size="sm" onClick={nextStep} colorScheme='blue'>
            {activeStep === steps.length - 1 ? "Finish" : "Next"}
          </Button>
        </Flex>
      )}
    </>
  )
}

export default VSteps