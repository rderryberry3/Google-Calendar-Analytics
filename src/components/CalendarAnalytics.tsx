import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Paper,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Chip,
  Stack,
} from '@mui/material';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
} from 'chart.js';
import { startOfMonth, endOfMonth, format } from 'date-fns';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale);

interface CalendarData {
  id: string;
  summary: string;
  timeSpent: number;
  isVisible?: boolean;
}

const CalendarAnalytics = () => {
  const [selectedMonth, setSelectedMonth] = useState(new Date(2024, 0, 1));
  const [loading, setLoading] = useState(false);
  const [calendarData, setCalendarData] = useState<CalendarData[]>([]);

  const fetchCalendarData = async () => {
    const accessToken = localStorage.getItem('googleAccessToken');
    console.log('Access token available:', !!accessToken);
    if (!accessToken) return;

    setLoading(true);
    try {
      // First, get list of calendars
      console.log('Fetching calendar list...');
      const calendarResponse = await axios.get(
        'https://www.googleapis.com/calendar/v3/users/me/calendarList',
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      console.log('Calendars found:', calendarResponse.data.items.length);

      const startDate = startOfMonth(selectedMonth);
      const endDate = endOfMonth(selectedMonth);
      console.log('Fetching events for date range:', startDate, 'to', endDate);

      // Fetch events for each calendar
      const calendarsData = await Promise.all(
        calendarResponse.data.items.map(async (calendar: any) => {
          try {
            console.log('Fetching events for calendar:', calendar.summary);
            const eventsResponse = await axios.get(
              `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendar.id)}/events`,
              {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                },
                params: {
                  timeMin: startDate.toISOString(),
                  timeMax: endDate.toISOString(),
                  singleEvents: true,
                  maxResults: 2500, // Add maximum results parameter
                },
              }
            );
            console.log('Events found for', calendar.summary + ':', eventsResponse.data.items.length);

            // Calculate total time spent
            const timeSpent = eventsResponse.data.items.reduce((total: number, event: any) => {
              if (event.start?.dateTime && event.end?.dateTime) {
                const start = new Date(event.start.dateTime);
                const end = new Date(event.end.dateTime);
                return total + (end.getTime() - start.getTime()) / (1000 * 60 * 60); // Convert to hours
              }
              return total;
            }, 0);

            return {
              id: calendar.id,
              summary: calendar.summary,
              timeSpent,
              isVisible: true,
            };
          } catch (error: any) {
            console.error(`Error fetching events for calendar ${calendar.summary}:`, error.response?.data || error.message);
            // Return calendar with 0 time spent if there's an error
            return {
              id: calendar.id,
              summary: calendar.summary,
              timeSpent: 0,
              isVisible: true,
            };
          }
        })
      );

      const filteredData = calendarsData.filter(cal => cal.timeSpent > 0);
      console.log('Calendars with events:', filteredData.length);
      setCalendarData(filteredData);
    } catch (error: any) {
      console.error('Error fetching calendar data:', error.response?.data || error.message);
      // Show user-friendly error message
      setCalendarData([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleCalendarVisibility = (calendarId: string) => {
    setCalendarData(prevData =>
      prevData.map(cal =>
        cal.id === calendarId ? { ...cal, isVisible: !cal.isVisible } : cal
      )
    );
  };

  // Filter visible calendars for the chart
  const visibleCalendarData = calendarData.filter(cal => cal.isVisible);

  const chartData = {
    labels: visibleCalendarData.map(cal => cal.summary),
    datasets: [
      {
        data: visibleCalendarData.map(cal => cal.timeSpent),
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
        ],
      },
    ],
  };

  const months = [
    ...Array.from({ length: 12 }, (_, i) => {
      const date = new Date(2024, i, 1);
      return {
        value: date.toISOString(),
        label: format(date, 'MMMM yyyy'),
        date: date
      };
    }),
    ...Array.from({ length: 12 }, (_, i) => {
      const date = new Date(2025, i, 1);
      return {
        value: date.toISOString(),
        label: format(date, 'MMMM yyyy'),
        date: date
      };
    }),
  ];

  useEffect(() => {
    fetchCalendarData();
  }, [selectedMonth]);

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Calendar Time Analysis
      </Typography>
      
      <FormControl fullWidth sx={{ mb: 4 }}>
        <InputLabel>Select Month</InputLabel>
        <Select
          value={selectedMonth.toISOString()}
          onChange={(e) => setSelectedMonth(new Date(e.target.value))}
          label="Select Month"
        >
          {months.map((month) => (
            <MenuItem key={month.label} value={month.value}>
              {month.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Paper sx={{ p: 3 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : calendarData.length > 0 ? (
          <>
            <Typography variant="h6" gutterBottom>
              Time Spent per Calendar (Hours)
            </Typography>
            <Box sx={{ height: 400 }}>
              <Pie data={chartData} options={{ maintainAspectRatio: false }} />
            </Box>
            <Box sx={{ mt: 3 }}>
              <Stack direction="row" spacing={2} sx={{ mb: 2, flexWrap: 'wrap', gap: 1 }}>
                {calendarData.map((cal) => (
                  <Chip
                    key={cal.id}
                    label={`${cal.summary} (${cal.timeSpent.toFixed(1)}h)`}
                    onClick={() => toggleCalendarVisibility(cal.id)}
                    color={cal.isVisible ? "primary" : "default"}
                    variant={cal.isVisible ? "filled" : "outlined"}
                    sx={{ m: 0.5 }}
                  />
                ))}
              </Stack>
            </Box>
          </>
        ) : (
          <Typography>No calendar data found for the selected month.</Typography>
        )}
      </Paper>
    </Box>
  );
};

export default CalendarAnalytics; 