import React from 'react';
import { DashboardOutlined, InfoCircleFilled, QuestionCircleFilled } from '@ant-design/icons';
import { ProConfigProvider, ProSettings } from '@ant-design/pro-components';
import ProLayout from '@ant-design/pro-layout';
import ErrorBoundary from 'antd/es/alert/ErrorBoundary';
import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Settings } from 'utils';

import { useAppSelector, KeepAlive, useLocationListen, shallowEqual } from 'hooks';
import { getOperatingSystem } from 'utils';

import { Settings as layoutSetting } from '../../config/defaultSetting';

export const baseRouterList = [
  {
    label: 'Dashboard',
    key: 'dashboard',
    path: 'dashboard',
    icon: <DashboardOutlined />,
    filepath: 'pages/dashboard/index.tsx',
  },
];
export default () => {
  const user = useAppSelector((state) => state.user, shallowEqual);
  const navigate = useNavigate();
  const location = useLocation();
  const [pathname, setPathname] = useState(location.pathname);
  const [dark, setDark] = useState(
    getOperatingSystem() === 'mac' && window.matchMedia('(prefers-color-scheme: dark)').matches
  );

  useLocationListen((listener) => {
    setPathname(listener.pathname);
  });

  const settings: ProSettings | undefined = {
    title: Settings.title.slice(0, 11),
    ...layoutSetting,
    // contentWidth: 'Fluid',
    // splitMenus: true,
  };

  useEffect(() => {
    // 监听 Macos系统 颜色切换
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (event) => {
      if (event.matches) {
        setDark(true);
      } else {
        setDark(false);
      }
    });
  }, []);

  return (
    <ProConfigProvider dark={dark}>
      <div
        id="admin-pro-layout"
        style={{
          height: '100vh',
        }}
      >
        <ProLayout
          siderWidth={245}
          logo={null}
          style={{
            height: '100vh',
          }}
          ErrorBoundary={false}
          route={{}}
          {...settings}
          location={{
            pathname,
          }}
          appList={[]}
          menuFooterRender={(props) => {
            if (props?.collapsed || props?.isMobile) return undefined;
            return (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <QuestionCircleFilled key="QuestionCircleFilled" />
                <InfoCircleFilled key="InfoCircleFilled" />
              </div>
            );
          }}
          menuItemRender={(item, dom) => (
            <Link
              to={item?.path || '/'}
              onClick={() => {
                setPathname(item.path || '/');
              }}
            >
              {dom}
            </Link>
          )}
          onMenuHeaderClick={() => navigate('/')}
        >
          <ErrorBoundary>
            <KeepAlive include={[]} keys={[]} />
          </ErrorBoundary>
        </ProLayout>
      </div>
    </ProConfigProvider>
  );
};
