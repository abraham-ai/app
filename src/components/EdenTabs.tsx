import { ConnectButton } from "@rainbow-me/rainbowkit";

import React, { useState } from 'react';
import { ToolOutlined, UserOutlined } from '@ant-design/icons';
import { Layout, Menu, theme } from 'antd';
import type { MenuProps } from 'antd';

import AccountTab from "components/tabs/AccountTab/AccountTab";
import GenerateTab from "components/tabs/GenerateTab";
import InterpolateTab from "components/tabs/InterpolateTab";
import Real2RealTab from "components/tabs/Real2RealTab";
import RemixTab from "components/tabs/RemixTab";
import MyProfileTab from "components/tabs/MyProfileTab";

const { Header, Content, Footer, Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

const items: MenuItem[] = [
  getItem('User', 'sub1', <UserOutlined />, [
    getItem('My account', '1'),
    getItem('My creations', '2'),
    getItem('My collections', '3'),
  ]),
  getItem('App', 'sub2', <ToolOutlined />, [
    getItem('Create', '5'), 
    getItem('Interpolate', '6'),
    getItem('Real2Real', '7'),
    getItem('Remix', '8'),
  ]),
];

const EdenTabs: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const {token: { colorBgContainer }} = theme.useToken();

  const handleMenuClick = (e: any) => {
    setActiveItem(e.key);
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
        <div style={{ height: 32, margin: 16, background: 'rgba(255, 255, 255, 0.2)' }} />
        <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" items={items} onClick={handleMenuClick} />
      </Sider>
      <Layout className="site-layout">
        <Header style={{ padding: 16, background: colorBgContainer, marginLeft: "auto", marginRight: 20 }}>
          <ConnectButton />
        </Header>
        <Content style={{ margin: '0 16px', padding: "16px", background: colorBgContainer }}>          
          {activeItem === '1' && <AccountTab />}
          {activeItem === '2' && <MyProfileTab />}
          {activeItem === '3' && <MyProfileTab />}
          {activeItem === '5' && <GenerateTab />}
          {activeItem === '6' && <InterpolateTab />}
          {activeItem === '7' && <Real2RealTab />}
          {activeItem === '8' && <RemixTab />}
        </Content>
        <Footer style={{ textAlign: 'center' }}></Footer>
      </Layout>
    </Layout>
  );
};

export default EdenTabs;