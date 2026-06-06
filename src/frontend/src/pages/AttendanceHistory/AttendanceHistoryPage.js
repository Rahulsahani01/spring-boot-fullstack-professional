import { Card, Table, Tag } from "antd";
import { useEffect, useState } from "react";
import { attendanceApi } from "../../api/attendanceApi";
import { useNotification } from "../../shared/useNotification";
import { errorToMessage } from "../../utils/errorToMessage";

export default function AttendanceHistoryPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const notify = useNotification();

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const response = await attendanceApi.getHistory();
      setData(response.data);
    } catch (e) {
      notify.error(errorToMessage(e));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Worker ID",
      dataIndex: "workerId",
      key: "workerId",
    },
    {
      title: "Site ID",
      dataIndex: "siteId",
      key: "siteId",
    },
    {
      title: "Clock In",
      dataIndex: "clockInTime",
      key: "clockInTime",
      render: (text) => (text ? new Date(text).toLocaleString() : "-"),
    },
    {
      title: "Clock Out",
      dataIndex: "clockOutTime",
      key: "clockOutTime",
      render: (text) =>
        text ? (
          new Date(text).toLocaleString()
        ) : (
          <Tag color="orange">Active</Tag>
        ),
    },
    {
      title: "Overtime (min)",
      dataIndex: "overtimeMinutes",
      key: "overtimeMinutes",
    },
  ];

  return (
    <Card title="Attendance History">
      <Table
        dataSource={data}
        columns={columns}
        rowKey="id"
        loading={loading}
      />
    </Card>
  );
}
