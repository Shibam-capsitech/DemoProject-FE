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
  Legend,
  Rectangle,
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


  const completedThisMonth = 24;
  var completedLastMonth = 16;

  const isPositive = completedThisMonth >= completedLastMonth;

  const trendColor = isPositive ? '#28a745' : '#d32f2f';

  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await apiService.get('/Task/dashboard-stats');
        setStats(response);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);


  const {
    currentMonthCompleted = 0,
    previousMonthCompleted = 0,
    totalCompleted = 0,
    totalIncomplete = 0,
    totalBusinesses = 0,
  } = stats ?? {};


  const percentChange =
    previousMonthCompleted === 0
      ? 'N/A'
      : (((currentMonthCompleted - previousMonthCompleted) / previousMonthCompleted) * 100).toFixed(1);


  const isUp = percentChange !== 'N/A' && parseFloat(percentChange) >= 0;
  const trendIcon = (
    <FontIcon
      iconName={isUp ? 'CaretUpSolid8' : 'CaretDownSolid8'}
      style={{ color: isUp ? 'green' : 'red', fontSize: 16 }}
    />
  );

  const cardData = [
    {
      title: 'Total Completed Tasks',
      value: totalCompleted,
      icon: <FontIcon iconName="Completed" style={{ fontSize: 25, color: '#0078d4' }} />,
    },
    {
      title: 'Total Pending Tasks',
      value: totalIncomplete,
      icon: <FontIcon iconName="HourGlass" style={{ fontSize: 25, color: '#cf9800ff' }} />,
    },
    {
      title: 'Total Businesses',
      value: totalBusinesses,
      icon: <FontIcon iconName="BusinessCenterLogo" style={{ fontSize: 25, color: '#0099bc' }} />,
    },
  ];


  return (
    <Layout>
      <Stack tokens={{ childrenGap: 32 }} styles={{ root: { padding: 32, paddingTop: 10 } }}>
        <Stack>

          <Stack
            horizontal
            wrap
            tokens={{ childrenGap: 20 }}
            styles={{
              root: {
                display: 'flex',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
              },
            }}
          >
            <Stack
              tokens={{ childrenGap: 6 }}
              styles={{
                root: {
                  background: '#ffffff',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  borderRadius: 12,
                  padding: 20,
                  width: '220px', // Fixed width for uniformity
                  flexGrow: 1,
                  flexBasis: '220px',
                },
              }}
            >
              <Stack horizontal tokens={{ childrenGap: 10 }} verticalAlign="center">
                <FontIcon iconName="CompletedSolid" style={{ fontSize: 25, color: '#0078d4' }} />
                <Text variant="xLarge" styles={{ root: { fontWeight: 600 } }}>
                  {currentMonthCompleted} / {previousMonthCompleted}
                </Text>
              </Stack>
              <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 6 }}>
                {trendIcon}
                <Text variant="mediumPlus" styles={{ root: { color: '#666' } }}>
                  {percentChange === 'N/A'
                    ? 'No data for last month'
                    : `${percentChange}% from last month`}
                </Text>
              </Stack>
            </Stack>

            {cardData.map((card) => (
              <Stack
                key={card.title}
                tokens={{ childrenGap: 6 }}
                styles={{
                  root: {
                    background: '#ffffff',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                    borderRadius: 12,
                    padding: 20,
                    width: '220px', // Same fixed width
                    flexGrow: 1,
                    flexBasis: '220px',
                  },
                }}
              >
                <Stack horizontal tokens={{ childrenGap: 10 }} verticalAlign="center">
                  {card.icon}
                  <Text variant="xLarge" styles={{ root: { fontWeight: 600 } }}>{card.value}</Text>
                </Stack>
                <Text variant="mediumPlus" styles={{ root: { color: '#666' } }}>{card.title}</Text>
              </Stack>
            ))}
          </Stack>

        </Stack>
        <Stack >

          <Stack styles={{ root: { display: "flex", justifyContent: "end", alignItems: "end" } }}>
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
          Tasks created vs completed per user ({selectedMonth === 'thisMonth' ? 'This Month' : 'Last Month'})
        </Text>

        <div
          style={{
            background: '#fff',
            padding: 10,
            borderRadius: 12,
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          }}
        >
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={taskPerUser}
              margin={{ top: 10, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="creation_count"
                fill="#1a6ff7c5" 
                name="Created"
                activeBar={<Rectangle fill="#1a6df7" stroke="#1253c0" />} 
              />
              <Bar
                dataKey="completion_count"
                fill="#00b96cbb" // Fluent success green
                name="Completed"
                activeBar={<Rectangle fill="#00b96b" stroke="#008a55" />} 
              />

            </BarChart>
          </ResponsiveContainer>
        </div>

      </Stack>
    </Layout>
  );
};

export default Dashboard;
