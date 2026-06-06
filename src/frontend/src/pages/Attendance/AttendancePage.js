import { Card, Form, Input, Button } from "antd";
import { useState } from "react";
import { attendanceApi } from "../../api/attendanceApi";
import { useNotification } from "../../shared/useNotification";

function AttendancePage() {
  const [workerId, setWorkerId] = useState("");
  const [siteId, setSiteId] = useState("");
  const [loading, setLoading] = useState(false);
  const notify = useNotification();

  const onClockIn = async () => {
    setLoading(true);
    try {
      await attendanceApi.clockIn({
        workerId: Number(workerId),
        siteId: Number(siteId),
      });
      notify.success("Worker clocked in successfully");
    } catch (e) {
      notify.error(e?.message || "Clock-in failed");
    } finally {
      setLoading(false);
    }
  };

  const onClockOut = async () => {
    setLoading(true);
    try {
      await attendanceApi.clockOut({ workerId: Number(workerId) });
      notify.success("Worker clocked out successfully");
    } catch (e) {
      notify.error(e?.message || "Clock-out failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Card title="Clock In">
        <Form layout="vertical">
          <Form.Item label="Worker ID" required>
            <Input
              value={workerId}
              onChange={(e) => setWorkerId(e.target.value)}
              placeholder="e.g. 1"
            />
          </Form.Item>
          <Form.Item label="Site ID" required>
            <Input
              value={siteId}
              onChange={(e) => setSiteId(e.target.value)}
              placeholder="e.g. 1"
            />
          </Form.Item>
          <Button type="primary" onClick={onClockIn} loading={loading}>
            Clock In
          </Button>
        </Form>
      </Card>

      <Card title="Clock Out" style={{ marginTop: 16 }}>
        <Form layout="vertical">
          <Form.Item label="Worker ID" required>
            <Input
              value={workerId}
              onChange={(e) => setWorkerId(e.target.value)}
              placeholder="e.g. 1"
            />
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
