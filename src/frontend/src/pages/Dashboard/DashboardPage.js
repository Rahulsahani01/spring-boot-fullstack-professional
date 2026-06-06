import { Card, Row, Col, Button, Statistic } from "antd";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { attendanceApi, overtimeApi } from "../../api/overtimeApi";

// NOTE: overtime dashboard can be placeholders until proper endpoint usage is wired.

function DashboardPage() {
  const [activeWorkersCount, setActiveWorkersCount] = useState(null);

  useEffect(() => {
    // For now just load active workers.
    // (If you later want to add a proper API hook, we can refactor.)
    import("../../api/attendanceApi")
      .then(({ attendanceApi }) => attendanceApi.getActiveWorkers())
      .then((res) => setActiveWorkersCount(res.data.length))
      .catch(() => setActiveWorkersCount(null));
  }, []);

  return (
    <div>
      <Row gutter={16}>
        <Col xs={24} sm={12}>
          <Card title="Active Workers">
            <Statistic
              value={activeWorkersCount === null ? 0 : activeWorkersCount}
            />
            <div style={{ marginTop: 12 }}>
              <Link to="/active-workers">
                <Button type="primary">View Active Workers</Button>
              </Link>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12}>
          <Card title="Overtime Overview">
            <p style={{ marginBottom: 0 }}>
              Pending/placeholder until OT filters + endpoints are fully wired.
            </p>
            <div style={{ marginTop: 12 }}>
              <Link to="/overtime">
                <Button>Go to Overtime</Button>
              </Link>
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginTop: 16 }}>
        <Col xs={24} sm={12}>
          <Card>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <Link to="/attendance">
                <Button type="primary">Clock In / Clock Out</Button>
              </Link>
              <Link to="/settlement">
                <Button>Overtime Settlement</Button>
              </Link>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12}>
          <Card>
            <p style={{ marginBottom: 0 }}>
              This dashboard will be extended after Attendance History + OT
              Summary UI is implemented.
            </p>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default DashboardPage;
