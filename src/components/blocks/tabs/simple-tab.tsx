import { KeyboardArrowLeft } from '@mui/icons-material';
import { Tab, Tabs } from '@mui/material';

export function SimpleTab({
  tabs,
  activeTab,
  setActiveTab,
  mobileView
}: {
  tabs: { label: string; icon?: React.ReactNode; subLabel?: string }[];
  activeTab: number;
  setActiveTab: (value: number) => void;
  mobileView?: boolean;
}) {
  return (
    <>
      {mobileView && (
        <div className="flex flex-col gap-4 w-full md:hidden pb-6">
          {activeTab !== undefined ? (
            <div className="flex items-center gap-4">
              <KeyboardArrowLeft className="text-primary-700 cursor-pointer" onClick={() => setActiveTab(undefined)} />
              <p className="text-base-7 font-bold">{tabs[activeTab].label}</p>
            </div>
          ) : (
            tabs.map((tab, index) => (
              <div
                key={index}
                className="flex items-center gap-4 px-4 py-2 bg-primary-50 cursor-pointer rounded-lg"
                onClick={() => setActiveTab(index)}
              >
                <div className="flex items-center justify-center bg-primary-100 rounded-2xl p-4">{tab.icon}</div>
                <div>
                  <p className="text-base-7 font-bold">{tab.label}</p>
                  <p className="text-base-5 text-xs font-medium">{tab.subLabel}</p>
                </div>
              </div>
            ))
          )}
        </div>
      )}
      <div className={`flex gap-2 pt-4 pb-6 ${mobileView && 'hidden md:flex'} `}>
        {tabs.map((tab, index) => (
          <p
            key={index}
            onClick={() => setActiveTab(index)}
            className={`cursor-pointer  font-medium transition-all ${activeTab === index ? 'text-primary-700 !font-bold' : 'text-base-4'}`}
          >
            {tab.label}
          </p>
        ))}
      </div>
    </>
  );
}
