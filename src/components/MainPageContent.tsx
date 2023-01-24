import { ConnectButton } from "@rainbow-me/rainbowkit";

import React, { useState } from 'react';
import { ToolOutlined, UserOutlined } from '@ant-design/icons';
import { Layout, Menu, theme } from 'antd';
import type { MenuProps } from 'antd';

import Account from "components/sections/Account";
import MyProfile from "components/sections/MyProfile";
import GeneratorInterface from "components/sections/GeneratorInterface"

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
    getItem('TTS', '9'),
  ]),
];

const MainPageContent = () => {
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
          {activeItem === '1' && <Account />}
          {activeItem === '2' && <MyProfile />}
          {activeItem === '3' && <MyProfile />}

          {activeItem === '5' && <GeneratorInterface mediaType="image" generatorName="create" />}
          {activeItem === '6' && <GeneratorInterface mediaType="video" generatorName="interpolate" />}
          {activeItem === '7' && <GeneratorInterface mediaType="video" generatorName="real2real" />}
          {activeItem === '8' && <GeneratorInterface mediaType="image" generatorName="remix" />}
          {activeItem === '9' && <GeneratorInterface mediaType="audio" generatorName="tts" />}

        </Content>
        <Footer style={{ textAlign: 'center' }}></Footer>
      </Layout>
    </Layout>
  );
};

export default MainPageContent;
