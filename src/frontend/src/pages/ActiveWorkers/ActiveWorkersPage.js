import { Table, Input, Button, Space } from "antd";
import { useEffect, useMemo, useState } from "react";
import { attendanceApi } from "../../api/attendanceApi";

function ActiveWorkersPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await attendanceApi.getActiveWorkers();
      setRows(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const t = setInterval(fetchData, 30000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) => {
      return (
        String(r.id).includes(q) ||
        String(r.name || "")
          .toLowerCase()
          .includes(q)
      );
    });
  }, [rows, search]);

  const columns = [
    { title: "Worker ID", dataIndex: "id", key: "id" },
    { title: "Worker Name", dataIndex: "name", key: "name" },
    { title: "Site", dataIndex: "site", key: "site", render: () => "—" },
    {
      title: "Clock-In Time",
      dataIndex: "clockInTime",
      key: "clockInTime",
      render: () => "—",
    },
    { title: "Status", key: "status", render: () => "ON SITE" },
  ];

  return (
    <div>
      <Space style={{ marginBottom: 12 }}>
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by worker name/id"
          style={{ width: 320 }}
        />
        <Button onClick={() => fetchData()} loading={loading}>
          Refresh
        </Button>
      </Space>
      <Table
        loading={loading}
        rowKey={(r) => r.id}
        dataSource={filtered}
        columns={columns}
        pagination={{ pageSize: 50 }}
      />
    </div>
  );
}

export default ActiveWorkersPage;
