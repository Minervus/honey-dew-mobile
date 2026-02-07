# Honey-Do Mobile

A couples' task management application for mobile devices, converted from the original web app. Help partners share and track household responsibilities in a friendly, non-nagging way.

## 🎯 Features

- **Task Management**: Create, assign, and track tasks between partners
- **Couple Pairing**: Connect with your partner using invite codes
- **Priority Levels**: Set task priorities (Low, Medium, High)
- **Due Dates**: Set and track due dates for tasks
- **Gentle Nudges**: Send friendly reminders instead of nagging
- **Real-time Updates**: WebSocket integration for live task updates
- **Push Notifications**: Get notified about new tasks and nudges
- **Secure Authentication**: Token-based authentication with secure storage

## 📱 Screens

- **Landing**: Welcome screen with app overview
- **Login**: User authentication
- **Home**: Main task management with My Tasks/Partner's Tasks tabs
- **Create Task**: Add new tasks with priority and due dates
- **Setup Couple**: Partner pairing with invite codes
- **Profile**: User profile and settings

## 🛠 Tech Stack

### Core
- **React Native** (0.80.3)
- **Expo** (~54.0.33)
- **TypeScript** for type safety

### Navigation
- **React Navigation** (v6)
  - Native Stack Navigator
  - Bottom Tab Navigator

### State Management
- **TanStack Query** (React Query) for server state
- **React Hook Form** for form management
- **Zod** for validation

### UI & Styling
- Custom component library with honey-themed design
- Reusable components: Button, Input, Card, Typography
- Native styling with StyleSheet

### Storage & Security
- **Expo Secure Store** for token and user data
- **Expo Notifications** for push notifications
- **React Native Keychain** for enhanced security

### Real-time Features
- **WebSocket** integration for live updates
- **Push notifications** for task reminders and nudges

## 🏗 Project Structure

```
mobile/
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   └── Typography.tsx
│   ├── navigation/         # Navigation configuration
│   │   └── AppNavigator.tsx
│   ├── screens/           # App screens
│   │   ├── LandingScreen.tsx
│   │   ├── LoginScreen.tsx
│   │   ├── HomeScreen.tsx
│   │   ├── CreateTaskScreen.tsx
│   │   ├── SetupCoupleScreen.tsx
│   │   └── ProfileScreen.tsx
│   ├── services/          # API and external services
│   │   ├── api.ts
│   │   ├── storage.ts
│   │   ├── websocket.ts
│   │   └── notifications.ts
│   ├── hooks/            # Custom React hooks
│   │   ├── useAuth.tsx
│   │   └── useQuery.tsx
│   ├── types/            # TypeScript type definitions
│   │   └── index.ts
├── App.tsx              # Main app entry point
├── app.json            # Expo configuration
└── package.json        # Dependencies and scripts
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v20 or higher)
- Expo CLI
- Physical iOS/Android device or simulator

### Installation

1. Clone this repository:
```bash
git clone https://github.com/Minervus/honey-dew-mobile.git
cd honey-dew-mobile
```

2. Install dependencies:
```bash
yarn install
# or
npm install --legacy-peer-deps
```

3. Start the development server:
```bash
npx expo start
```

4. Run on your platform:
```bash
# For iOS
npx expo start --ios

# For Android
npx expo start --android

# For web (if needed)
npx expo start --web
```

## 🔧 Configuration

### API Configuration

Update the API base URL in `src/services/api.ts`:

```typescript
const API_BASE_URL = __DEV__ 
  ? 'http://localhost:3000/api'  // Development
  : 'https://your-production-url.com/api';  // Production
```

### WebSocket Configuration

Update the WebSocket URL in `src/services/websocket.ts`:

```typescript
const wsUrl = __DEV__ 
  ? `ws://localhost:3000/ws?token=${token}`
  : `wss://your-production-url.com/ws?token=${token}`;
```

## 🎨 Design System

### Colors (Honey Theme)
- **Primary**: #F59E0B (Amber)
- **Secondary**: #FEF3C7 (Light Amber)
- **Accent**: #92400E (Dark Amber)
- **Success**: #10B981 (Green)
- **Error**: #EF4444 (Red)
- **Background**: #FEF3C7 (Light Amber)

### Typography
- System fonts with proper scaling
- Consistent font weights and sizes
- Accessible color contrasts

## 📦 Scripts

```bash
# Start the development server
npx expo start

# Run on iOS Simulator
npx expo start --ios

# Run on Android Emulator
npx expo start --android

# Run in web browser
npx expo start --web

# Type checking
npm run type-check

# Linting
npm run lint
```

## 🔄 API Integration

The mobile app is designed to work with the existing backend API from the web app. All endpoints remain the same:

- `/api/auth/*` - Authentication
- `/api/couple/*` - Couple management
- `/api/tasks/*` - Task operations
- `/api/notifications/*` - Notification management

## 🚀 Production Deployment

### Expo Build Service

1. Build for production:
```bash
expo build:android
expo build:ios
```

2. Submit to app stores through Expo EAS

### Environment Variables

Set up environment variables for different environments in `app.json` or `eas.json`.

## 🤝 Contributing

1. Follow the existing code style and TypeScript patterns
2. Use the established component library
3. Test on both iOS and Android platforms
4. Maintain type safety throughout the application

## 📝 Notes

- The app uses Expo for easier development and deployment
- WebSocket connections are automatically managed and reconnected
- All sensitive data is stored securely using Expo Secure Store
- The app maintains the same feature parity as the web version
- Push notifications require proper Expo configuration for production

## 🐛 Troubleshooting

If you encounter issues:
- Make sure your backend API is running on port 3000
- Check that your phone and computer are on the same WiFi network
- Restart the Expo server if needed
- Clear cache with `npx expo start --clear`

Enjoy your Honey-Do mobile app! 🍯