import { Tabs } from "antd";
import AuthTab from "components/tabs/AuthTab/AuthTab";
import GenerateTab from "components/tabs/GenerateTab";
import InterpolateTab from "components/tabs/InterpolateTab";
import Real2RealTab from "components/tabs/Real2RealTab";
import RemixTab from "components/tabs/RemixTab";
import React from "react";

const tabItems = [
  {
    label: "Authenticate",
    key: "tab1",
    children: <AuthTab />,
  },
  {
    label: "Generate",
    key: "tab2",
    children: <GenerateTab />,
  },
  {
    label: "Remix",
    key: "tab3",
    children: <RemixTab />,
  },
  {
    label: "Interpolate",
    key: "tab4",
    children: <InterpolateTab />,
  },
  {
    label: "Real2Real",
    key: "tab5",
    children: <Real2RealTab />,
  },
];

const EdenTabs = () => {
  return <Tabs defaultActiveKey="tab1" items={tabItems} />;
};

export default EdenTabs;
