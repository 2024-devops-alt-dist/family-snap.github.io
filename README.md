# Family Snap

A Progressive Web App for sharing family moments in real-time. Create events, share photos, and experience moments together with your family members.

## Features

- User Authentication

  - Email/password registration and login
  - Secure session management
  - Email verification
  - Password reset functionality

- Event Management

  - Create family photo events with unique codes
  - Join events via code
  - QR code generation for easy event sharing
  - Private event galleries
  - Real-time event updates

- Photo Capabilities

  - Take photos directly using device camera
  - Upload photos from gallery
  - Real-time photo sharing
  - Support for multiple image uploads
  - Automatic gallery updates

- User Interface

  - Modern, responsive design
  - Christmas theme with festive decorations
  - Notification system for user feedback
  - Multi-language support (English/French)
  - Intuitive navigation

- Progressive Web App Features
  - Offline access capability
  - Installable on devices
  - Service worker for caching
  - Background sync for uploads
  - Push notifications (coming soon)

## Technologies Used

- Frontend

  - HTML5
  - CSS3 with modern features
  - Vanilla JavaScript (ES6+)
  - PWA capabilities
  - QR Code generation

- Backend
  - Supabase for authentication
  - Supabase Storage for image storage
  - Supabase Database for data management
  - Real-time subscriptions

## Getting Started

1. Clone the repository:

```bash
git clone https://github.com/2024-devops-alt-dist/family-snap-bd-ez-lf-ml.git
cd family-snap-bd-ez-lf-ml
```

2. Set up Supabase:

   - Create a new Supabase project
   - Set up the following tables:
     - `events` table with fields:
       - `id` (uuid, primary key)
       - `title` (text, not null)
       - `description` (text)
       - `date` (date, not null)
       - `code` (text, not null, unique)
       - `user_id` (uuid, not null, references auth.users)
       - `created_at` (timestamp with time zone, default: now())
     - `photos` table with fields:
       - `id` (uuid, primary key)
       - `event_id` (uuid, references events.id)
       - `path` (text, not null)
       - `created_at` (timestamp with time zone, default: now())
   - Create a storage bucket named `event-images`
   - Set up appropriate RLS policies

3. Configure the application:

   - Copy `src/js/supabase-config.example.js` to `src/js/supabase-config.js`
   - Update with your Supabase project URL and anon key

4. Start the development server:

```bash
# If using live-server
live-server .
```

5. Open your browser and navigate to `http://localhost:8080`

## Project Structure

```
/
├── src/
│   ├── assets/                 # Images and icons
│   ├── css/
│   │   ├── style.css           # Base styles
│   │   └── christmas.css       # Theme styles
│   └── js/
│       ├── main.js             # Main application logic
│       ├── authentification.js # Auth handling
│       ├── images-handler.js   # Image upload/capture
│       ├── qrGenerator.js      # QR code generation
│       └── translations.js     # Language strings
├── index.html                  # Main HTML file
├── manifest.json               # PWA manifest
├── serviceWorker.js            # Service worker for PWA
└── README.md                   # Documentation
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Security

- All database access is controlled through Row Level Security (RLS)
- Images are stored securely in Supabase Storage
- Authentication tokens are handled securely
- CORS is properly configured
- Service Worker follows security best practices

## License

This project is licensed under the MIT License - see the LICENSE file for details

## Acknowledgments

- QR Code library: [qrcodejs](https://github.com/davidshimjs/qrcodejs)
- Supabase for backend services
- Contributors and testers
