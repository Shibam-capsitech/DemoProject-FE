import React, { useEffect, useState } from 'react';
import {
  Stack,
  Text,
  Dropdown,
  type IDropdownOption,
  FontIcon,
} from '@fluentui/react';
import Layout from '../components/Layout/Layout';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';
import apiService from '../api/apiService';
import { format, eachDayOfInterval, startOfMonth, endOfMonth } from 'date-fns';
import { Group, Hourglass, SquareCheckBig, TrendingDown, TrendingUp, Users } from 'lucide-react';

const Dashboard: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = useState<'thisMonth' | 'lastMonth'>('thisMonth');
  const [taskPerDate, setTaskPerDate] = useState<{ date: string; count: number }[]>([]);
  const [taskPerUser, setTaskPerUser] = useState<{ name: string; count: number }[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      await fetchTaskPerDate();
      await fetchTaskPerUser();
    };
    fetchData();
  }, [selectedMonth]);

  const fetchTaskPerDate = async () => {
    try {
      const res = await apiService.get('/Task/get-tasks-creation-by-date-stats');

      const today = new Date();
      const targetDate =
        selectedMonth === 'thisMonth'
          ? today
          : new Date(today.getFullYear(), today.getMonth() - 1, 1);

      const monthDates = eachDayOfInterval({
        start: startOfMonth(targetDate),
        end: endOfMonth(targetDate),
      }).map(date => format(date, 'yyyy-MM-dd')); // Ensure same format as backend

      const dateCountsMap: Record<string, number> = {};
      const responseData = res[selectedMonth] || [];

      responseData.forEach((item: any) => {
        const date = format(new Date(item.date), 'yyyy-MM-dd'); // Normalize again
        dateCountsMap[date] = item.count;
      });

      const filledData = monthDates.map(date => ({
        date,
        count: dateCountsMap[date] || 0,
      }));

      setTaskPerDate(filledData);
    } catch (error) {
      console.error('Error fetching tasks per date:', error);
    }
  };

  const fetchTaskPerUser = async () => {
    try {
      const res = await apiService.get('/Task/get-tasks-creation-by-user-stats');
      setTaskPerUser(res[selectedMonth] || []);
    } catch (error) {
      console.error('Error fetching tasks per user:', error);
    }
  };

  const dropdownOptions: IDropdownOption[] = [
    { key: 'thisMonth', text: 'This Month' },
    { key: 'lastMonth', text: 'Last Month' },
  ];

  const cardData = [
    { title: 'Total Clients', value: 128, icon: <Users style={{ fontSize: 25, color: '#0078d4' }}/> },
    { title: 'Pending Tasks', value: 24, icon: <Hourglass style={{ fontSize: 25, color: '#0078d4' }}/> },
    { title: 'Completed Tasks', value: 76, icon: <SquareCheckBig style={{ fontSize: 25, color: '#0078d4' }}/> },
  ];
  const completedThisMonth = 24;
  var completedLastMonth = 16;
  const percentChange = completedLastMonth === 0
    ? 'N/A'
    : (((completedThisMonth - completedLastMonth) / completedLastMonth) * 100).toFixed(1);

  const isPositive = completedThisMonth >= completedLastMonth;
  const trendIcon = isPositive ? <TrendingUp /> : <TrendingDown />;
  const trendColor = isPositive ? '#28a745' : '#d32f2f';


  return (
    <Layout>
      <Stack tokens={{ childrenGap: 32 }} styles={{ root: { padding: 32, paddingTop: 10 } }}>
        <Stack>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: 20,
            }}
          >
            <div
              style={{
                background: '#ffffff',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                borderRadius: 12,
                padding: 20,
                display: 'flex',
                flexDirection: 'column',
                gap: 6,
              }}
            >
              <Stack styles={{root:{display:"flex", flexDirection:"row", gap:"10px"}}}>
              <FontIcon iconName="Completed" style={{ fontSize: 25, color: '#0078d4' }} />
              <Text variant="xLarge" styles={{ root: { fontWeight: 600 } }}>
                {completedThisMonth} / {completedLastMonth}
              </Text>
              </Stack>
              <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 6 }}>
                 {trendIcon}
                <Text variant="mediumPlus" styles={{ root: { color: '#666' } }}>
                  {percentChange === 'N/A' ? 'No data for last month' : `${percentChange}% from last month`}
                </Text>
              </Stack>
            </div>

            {cardData.map(card => (
              <div
                key={card.title}
                style={{
                  background: '#ffffff',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  borderRadius: 12,
                  padding: 20,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 6,
                }}
              >
                <Stack styles={{root:{display:"flex", flexDirection:"row", gap:"10px"}}}>
                  {card.icon}
                <Text variant="xLarge" styles={{ root: { fontWeight: 600 } }}>{card.value}</Text>
                </Stack>
                <Text variant="mediumPlus" styles={{ root: { color: '#666' } }}>{card.title}</Text>
              </div>
            ))}
          </div>
        </Stack>
        <Stack >

          <Stack styles={{root:{ display:"flex",justifyContent:"end", alignItems:"end" }}}>
            <Dropdown
            selectedKey={selectedMonth}
            options={dropdownOptions}
            onChange={(_, option) => setSelectedMonth(option?.key as 'thisMonth' | 'lastMonth')}
            
          />
          </Stack>
        </Stack>

        <Text variant="large" styles={{ root: { fontWeight: 600 } }}>
          Tasks created per day ({selectedMonth === 'thisMonth' ? 'This Month' : 'Last Month'})
        </Text>
        <div style={{ background: '#fff', padding: 10, borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          <ResponsiveContainer width="100%" height={250} style={{}}>
            <AreaChart data={taskPerDate}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tickFormatter={(tick) => tick.slice(5)} />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Area type="monotone" dataKey="count" stroke="#1a6df7" fill="#cce2ff" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <Text variant="large" styles={{ root: { fontWeight: 600, marginTop: 20 } }}>
          Tasks created per user ({selectedMonth === 'thisMonth' ? 'This Month' : 'Last Month'})
        </Text>
        <div style={{ background: '#fff', padding: 10, borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={taskPerUser}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#0078d4a6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Stack>
    </Layout>
  );
};

export default Dashboard;
