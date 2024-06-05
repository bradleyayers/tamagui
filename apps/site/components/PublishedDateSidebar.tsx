import { YStack, AnimatePresence, SizableText, Tabs, Anchor } from 'tamagui'
import { useEffect, useState } from 'react'
import type { StackProps, TabLayout, TabsTabProps } from 'tamagui'

export function PublishedDateSidebar({ mdxData, section }) {
  const [tabState, setTabState] = useState<{
    currentTab: string
    // Layout of the Tab user might intend to select (hovering / focusing)
    intentAt: TabLayout | null
    // Layout of the Tab user selected
    activeAt: TabLayout | null
  }>({
    activeAt: null,
    currentTab: `0-${mdxData[0].frontmatter.publishedAt}` as string,
    intentAt: null,
  })

  useEffect(() => {
    setTabState({ ...tabState, currentTab: section })
  }, [section])

  const setCurrentTab = (currentTab: string) => setTabState({ ...tabState, currentTab })
  const setIntentIndicator = (intentAt) => setTabState({ ...tabState, intentAt })
  const setActiveIndicator = (activeAt) => setTabState({ ...tabState, activeAt })

  const { activeAt, intentAt, currentTab } = tabState

  const handleOnInteraction: TabsTabProps['onInteraction'] = (type, layout) => {
    if (type === 'select') {
      setActiveIndicator(layout)
    } else {
      setIntentIndicator(layout)
    }
  }

  return (
    <Tabs
      orientation="vertical"
      size="$4"
      fd="column"
      br="$4"
      activationMode="manual"
      value={currentTab}
      onValueChange={setCurrentTab}
    >
      <YStack>
        <AnimatePresence>
          {intentAt && (
            <TabsRovingIndicator
              intentAt={!!intentAt}
              w={intentAt.width}
              h={intentAt.height}
              x={intentAt.x}
              y={intentAt.y}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {activeAt && (
            <TabsRovingIndicator
              activeAt={!!activeAt}
              w={activeAt.width}
              h={activeAt.height}
              x={activeAt.x}
              y={activeAt.y}
            />
          )}
        </AnimatePresence>

        <Tabs.List
          disablePassBorderRadius
          loop={false}
          aria-label="changelog-dates"
          gap="$0"
        >
          {mdxData.map((data, id) => (
            <Tabs.Tab
              key={`${id}-${data.frontmatter.publishedAt}`}
              unstyled
              px="$3"
              py="$2"
              value={`${id}-${data.frontmatter.publishedAt}`}
              onInteraction={handleOnInteraction}
              hoverStyle={{ scale: 1.025 }}
              pressStyle={{ scale: 0.95 }}
              scale={
                Number(currentTab.charAt(0)) < id
                  ? (10 - id + Number(currentTab.charAt(0))) / 10
                  : (10 + id - Number(currentTab.charAt(0))) / 10
              }
              {...(Number(currentTab.charAt(0)) === id && {
                scale: 1,
              })}
              {...(intentAt && {
                scale: 1,
              })}
              animation="quickest"
            >
              <Anchor href={`#${data.frontmatter.publishedAt}`}>
                <TabText
                  intentAt={!!intentAt}
                  currentTab={currentTab}
                  id={id}
                  publishedAt={data.frontmatter.publishedAt}
                />
              </Anchor>
            </Tabs.Tab>
          ))}
        </Tabs.List>
      </YStack>
    </Tabs>
  )
}

const TabsRovingIndicator = ({
  activeAt,
  intentAt,
  ...props
}: { activeAt?: boolean; intentAt?: boolean } & StackProps) => {
  return (
    <YStack
      pos="absolute"
      bc="$color10"
      bw="$1"
      br="$4"
      o={0.7}
      animation="100ms"
      enterStyle={{
        o: 0,
      }}
      exitStyle={{
        o: 0,
      }}
      {...(activeAt && {
        // bc: '$color12',
        // o: 0.5,
        o: 0,
      })}
      {...(intentAt && {
        // bc: '$color12',
        // o: 0.6,
        o: 0,
      })}
      {...props}
    />
  )
}

const TabText = ({
  intentAt,
  currentTab,
  id,
  publishedAt,
}: { intentAt?: boolean; currentTab: string; id: number; publishedAt: string }) => {
  return (
    <SizableText
      ta="right"
      fow="bold"
      col={
        `$color${
          Number(currentTab.charAt(0)) < id
            ? 12 - id + Number(currentTab.charAt(0))
            : 12 + id - Number(currentTab.charAt(0))
        }` as any
      }
      {...(Number(currentTab.charAt(0)) === id && {
        col: '$color12',
      })}
      {...(intentAt && {
        col: '$color10',
      })}
      {...(intentAt &&
        Number(currentTab.charAt(0)) === id && {
          col: '$color11',
        })}
      hoverStyle={{ col: '$color12' }}
      animation="100ms"
    >
      {Intl.DateTimeFormat('en-US', {
        month: 'short',
        year: 'numeric',
        day: 'numeric',
      }).format(new Date(publishedAt || ''))}
    </SizableText>
  )
}
