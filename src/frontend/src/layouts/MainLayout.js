import { Layout, Menu, Breadcrumb } from "antd";
import {
  PieChartOutlined,
  UserOutlined,
  ClockCircleOutlined,
  HistoryOutlined,
  DollarOutlined,
  CheckCircleOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { Link, useLocation } from "react-router-dom";
import { useMemo, useState } from "react";
import "./MainLayout.css";

const { Sider, Content } = Layout;

const menuItems = [
  { key: "/", label: "Dashboard", icon: <PieChartOutlined /> },
  { key: "/attendance", label: "Attendance", icon: <ClockCircleOutlined /> },
  { key: "/active-workers", label: "Active Workers", icon: <UserOutlined /> },
  { key: "/management", label: "Management", icon: <SettingOutlined /> },
  {
    key: "/attendance-history",
    label: "Attendance History",
    icon: <HistoryOutlined />,
  },
  { key: "/overtime", label: "Overtime Summary", icon: <DollarOutlined /> },
  { key: "/settlement", label: "Settlement", icon: <CheckCircleOutlined /> },
];

function MainLayout({ children }) {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const selectedKey = useMemo(() => {
    // Use first matching route segment
    const path = location.pathname;
    const match = menuItems.find(
      (i) => i.key !== "/" && path.startsWith(i.key),
    );
    return match ? match.key : "/";
  }, [location.pathname]);

  const breadcrumbs = useMemo(() => {
    const item = menuItems.find((i) =>
      i.key === "/"
        ? location.pathname === "/"
        : location.pathname.startsWith(i.key),
    );
    const main = item?.label || "HRMS";
    return [main];
  }, [location.pathname]);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
        <div className="hrms-logo" />
        <Menu theme="dark" mode="inline" selectedKeys={[selectedKey]}>
          {menuItems.map((item) => (
            <Menu.Item key={item.key} icon={item.icon}>
              <Link to={item.key}>{item.label}</Link>
            </Menu.Item>
          ))}
        </Menu>
      </Sider>

      <Layout>
        <Content style={{ margin: "0 16px" }}>
          <Breadcrumb style={{ margin: "16px 0" }}>
            {breadcrumbs.map((b) => (
              <Breadcrumb.Item key={b}>{b}</Breadcrumb.Item>
            ))}
          </Breadcrumb>
          <div style={{ padding: 24, minHeight: 360, background: "#fff" }}>
            {children}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}

export default MainLayout;
