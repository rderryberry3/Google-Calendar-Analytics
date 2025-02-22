# Google Calendar Analytics

A web application that visualizes how you spend time across different Google Calendars. This tool helps you analyze your time allocation by displaying a pie chart of hours spent in each calendar for any selected month.

## Features

- Google OAuth authentication
- Monthly time analysis
- Interactive pie chart visualization
- Detailed breakdown of hours per calendar
- Support for multiple calendars
- Real-time data fetching

## Technologies Used

- React
- TypeScript
- Material-UI
- Chart.js
- Google Calendar API
- Vite

## Setup

1. Clone the repository:
```bash
git clone https://github.com/rderryberry3/Google-Calendar-Analytics.git
cd Google-Calendar-Analytics
```

2. Install dependencies:
```bash
npm install
```

3. Create a Google Cloud Project and enable the Google Calendar API:
   - Go to the [Google Cloud Console](https://console.cloud.google.com)
   - Create a new project or select an existing one
   - Enable the Google Calendar API
   - Create OAuth 2.0 credentials
   - Add `http://localhost:5173` to the authorized JavaScript origins

4. Update the Google Client ID:
   - Open `src/App.tsx`
   - Replace `GOOGLE_CLIENT_ID` with your actual Google OAuth Client ID

5. Start the development server:
```bash
npm run dev
```

6. Open [http://localhost:5173](http://localhost:5173) in your browser

## Usage

1. Click "Sign in with Google" and authorize the application
2. Select a month from the dropdown menu
3. View the pie chart showing time allocation across your calendars
4. See the detailed breakdown of hours spent in each calendar

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](https://choosealicense.com/licenses/mit/)
