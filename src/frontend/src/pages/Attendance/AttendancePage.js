import { Card, Form, Input, Button, Select } from "antd";
import { useState, useEffect } from "react";
import { attendanceApi, workerApi, siteApi } from "../../api/attendanceApi";
import { useNotification } from "../../shared/useNotification";
import { errorToMessage } from "../../utils/errorToMessage";

const { Option } = Select;

function AttendancePage() {
  const [clockInForm] = Form.useForm();
  const [clockOutForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [workers, setWorkers] = useState([]);
  const [sites, setSites] = useState([]);
  const notify = useNotification();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [wRes, sRes] = await Promise.all([
          workerApi.getAllWorkers(),
          siteApi.getAllSites(),
        ]);
        setWorkers(wRes.data);
        setSites(sRes.data);
      } catch (e) {
        notify.error("Failed to load workers or sites");
      }
    };
    fetchData();
  }, [notify]);

  const onClockIn = async () => {
    try {
      const values = await clockInForm.validateFields();
      setLoading(true);

      const payload = {
        workerId: values.workerId,
        siteId: values.siteId,
        clockInTime: new Date().toISOString(),
      };
      console.log("Clock-in payload=====:", payload);
      await attendanceApi.clockIn(payload);
      notify.success("Worker clocked in successfully");
      clockInForm.resetFields();
    } catch (e) {
      if (e.errorFields) return;
      console.error("Clock-in error:", e);
      notify.error(errorToMessage(e));
    } finally {
      setLoading(false);
    }
  };

  const onClockOut = async () => {
    try {
      const values = await clockOutForm.validateFields();
      setLoading(true);

      const payload = {
        workerId: values.workerId,
        siteId: values.siteId,
        clockOutTime: new Date().toISOString(),
      };
      console.log("Clock-out payload:", payload);
      await attendanceApi.clockOut(payload);
      notify.success("Worker clocked out successfully");
      clockOutForm.resetFields();
    } catch (e) {
      if (e.errorFields) return;
      console.error("Clock-out error:", e);
      notify.error(errorToMessage(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Card title="Clock In">
        <Form form={clockInForm} layout="vertical">
          <Form.Item
            name="workerId"
            label="Worker"
            rules={[{ required: true, message: "Please select a worker!" }]}
          >
            <Select
              placeholder="Select Worker"
              showSearch
              optionFilterProp="children"
            >
              {workers.map((w) => (
                <Option key={w.id} value={w.id}>
                  {w.name} (ID: {w.id})
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="siteId"
            label="Site"
            rules={[{ required: true, message: "Please select a site!" }]}
          >
            <Select
              placeholder="Select Site"
              showSearch
              optionFilterProp="children"
            >
              {sites.map((s) => (
                <Option key={s.id} value={s.id}>
                  {s.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Button type="primary" onClick={onClockIn} loading={loading}>
            Clock In
          </Button>
        </Form>
      </Card>

      <Card title="Clock Out" style={{ marginTop: 16 }}>
        <Form form={clockOutForm} layout="vertical">
          <Form.Item
            name="workerId"
            label="Worker"
            rules={[{ required: true, message: "Please select a worker!" }]}
          >
            <Select
              placeholder="Select Worker"
              showSearch
              optionFilterProp="children"
            >
              {workers.map((w) => (
                <Option key={w.id} value={w.id}>
                  {w.name} (ID: {w.id})
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="siteId"
            label="Site"
            rules={[{ required: true, message: "Please select a site!" }]}
          >
            <Select
              placeholder="Select Site"
              showSearch
              optionFilterProp="children"
            >
              {sites.map((s) => (
                <Option key={s.id} value={s.id}>
                  {s.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Button onClick={onClockOut} loading={loading}>
            Clock Out
          </Button>
        </Form>
      </Card>
    </div>
  );
}

export default AttendancePage;
