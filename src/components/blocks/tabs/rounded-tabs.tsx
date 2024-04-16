import { KeyboardArrowLeft } from '@mui/icons-material';
import { Box, Tab, Tabs } from '@mui/material';

export function RoundedTab({ tabs, activeTab, setActiveTab }: {
  tabs: { label: string,
    icon?: React.ReactNode,
    subLabel?: string,
    tabIndex?: number,
   }[],
  activeTab: number,
  setActiveTab: (value: number) => void,
}) {
  return (
    <> 
      <Box 
        className={`flex gap-2 overflow-x-auto scrollbar-hide bg-primary-50 rounded-full  md:w-fit me-[-32px] md:me-0 pr-4 md:pr-0`}
        sx={{
          '&::-webkit-scrollbar': {
            display: 'none'
          },
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none',
        }}
      >
        {
          tabs.map((tab, index) => (
            <p
              key={index}
              onClick={() => setActiveTab(tab.tabIndex || index)}
              className={`cursor-pointer  font-medium transition-all px-4 py-2
              flex-shrink-0
              ${
                activeTab === index ? 'bg-primary-600 text-base-1 !font-semibold rounded-[44px] ' : 'text-[#8A8A8A]'
              }`}
            >
              {tab.label}
            </p>
          ))
        }
      </Box>
    </>

  )
}