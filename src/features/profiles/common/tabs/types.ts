export type TabItem = Readonly<{
  label: string;
  value: string;
  content: React.ReactNode;
}>;

export type TProfileTabs = Readonly<{
  tabs: TabItem[];
  activeTab?: string;
  onTabChange?: (value: string) => void;
  defaultValue?: string;
  className?: string;
}>;
