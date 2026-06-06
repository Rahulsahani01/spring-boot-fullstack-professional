import { Card, Form, Input, Button, Select, Space, Table } from "antd";
import { useState, useEffect } from "react";
import { workerApi, siteApi } from "../../api/attendanceApi";
import { useNotification } from "../../shared/useNotification";
import { errorToMessage } from "../../utils/errorToMessage";

const { Option } = Select;

export default function ManagementPage() {
  const [workerForm] = Form.useForm();
  const [siteForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [workers, setWorkers] = useState([]);
  const [sites, setSites] = useState([]);
  const notify = useNotification();

  const fetchData = async () => {
    try {
      const [wRes, sRes] = await Promise.all([
        workerApi.getAllWorkers(),
        siteApi.getAllSites(),
      ]);
      setWorkers(wRes.data);
      setSites(sRes.data);
    } catch (e) {
      notify.error(errorToMessage(e));
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onAddWorker = async (values) => {
    setLoading(true);
    try {
      await workerApi.addWorker(values);
      notify.success("Worker added successfully");
      workerForm.resetFields();
      fetchData();
    } catch (e) {
      notify.error(errorToMessage(e));
    } finally {
      setLoading(false);
    }
  };

  const onAddSite = async (values) => {
    setLoading(true);
    try {
      await siteApi.addSite(values);
      notify.success("Site added successfully");
      siteForm.resetFields();
      fetchData();
    } catch (e) {
      notify.error(errorToMessage(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <Card title="Add Worker">
        <Form form={workerForm} layout="vertical" onFinish={onAddWorker}>
          <Form.Item name="name" label="Name" rules={[{ required: true }]}>
            <Input placeholder="Full Name" />
          </Form.Item>
          <Form.Item name="phone" label="Phone" rules={[{ required: true }]}>
            <Input placeholder="Phone Number" />
          </Form.Item>
          <Form.Item
            name="designation"
            label="Designation"
            rules={[{ required: true }]}
          >
            <Select placeholder="Select Designation">
              <Option value="WORKER">Worker</Option>
              <Option value="SUPERVISOR">Supervisor</Option>
            </Select>
          </Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Add Worker
          </Button>
        </Form>
      </Card>

      <Card title="Add Site">
        <Form form={siteForm} layout="vertical" onFinish={onAddSite}>
          <Form.Item name="name" label="Site Name" rules={[{ required: true }]}>
            <Input placeholder="e.g. Building A" />
          </Form.Item>
          <Form.Item
            name="address"
            label="Address"
            rules={[{ required: true }]}
          >
            <Input placeholder="Site Address" />
          </Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Add Site
          </Button>
        </Form>
      </Card>

      <Card title="Existing Workers">
        <Table
          dataSource={workers}
          columns={[
            { title: "ID", dataIndex: "id", key: "id" },
            { title: "Name", dataIndex: "name", key: "name" },
            { title: "Phone", dataIndex: "phone", key: "phone" },
            {
              title: "Designation",
              dataIndex: "designation",
              key: "designation",
            },
          ]}
          rowKey="id"
          size="small"
        />
      </Card>

      <Card title="Existing Sites">
        <Table
          dataSource={sites}
          columns={[
            { title: "ID", dataIndex: "id", key: "id" },
            { title: "Name", dataIndex: "name", key: "name" },
            { title: "Address", dataIndex: "address", key: "address" },
          ]}
          rowKey="id"
          size="small"
        />
      </Card>
    </Space>
  );
}
