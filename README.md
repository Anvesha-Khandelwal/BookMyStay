# 🌍 BookMyStay

A lightweight, responsive hotel and resort booking website that helps travelers discover and compare stays with ease.

**BookMyStay** allows users to search accommodations by city, filter by price and rating, sort by preferences, and explore nearby attractions to make informed travel decisions.

---

## ✨ Features

- 🏙️ **City Search** — Find hotels and resorts across multiple destinations
- 💰 **Price Filter** — Set your budget with a dynamic price range slider
- ⭐ **Rating Filter** — Filter stays by minimum star rating
- 🔀 **Smart Sorting** — Sort by lowest price, highest price, or top-rated
- ❤️ **Save Favorites** — Bookmark stays using browser localStorage
- 🧭 **Nearby Attractions** — Discover things to do before booking
- 🌙 **Dark/Light Mode** — Toggle between themes for comfortable browsing
- 📱 **Fully Responsive** — Optimized for desktop, tablet, and mobile devices

---

## 🗂️ Project Structure

```
BookMyStay/
│
├── frontend/
│   ├── index.html          # Homepage with city search
│   ├── listings.html       # Search results & filters
│   ├── hotel.html          # Hotel details page
│   ├── booking.html        # Booking confirmation page
│   ├── style.css           # Styling & responsive design
│   └── script.js           # JavaScript logic
│
├── hotels.json             # Hotel database
├── assets/                 # Images and media
└── README.md               # This file
```

---

## 📄 Data Format

Hotel data is stored in `hotels.json` with the following structure:

```json
{
  "id": 1,
  "name": "Sea Breeze Resort",
  "city": "Bali",
  "location": "Bali, Indonesia",
  "price": 129,
  "rating": 4.8,
  "reviews": 324,
  "image": "assets/h1.jpg",
  "description": "Luxury beachside stay with pool, spa, and ocean view.",
  "attractions": [
    "Ubud Monkey Forest",
    "Tanah Lot Temple",
    "Mount Batur"
  ]
}
```

| Field | Description |
|-------|-------------|
| `id` | Unique hotel identifier |
| `name` | Hotel or resort name |
| `city` | City for search functionality |
| `location` | Full location text |
| `price` | Nightly rate (in USD) |
| `rating` | Guest rating (1-5 stars) |
| `reviews` | Number of guest reviews |
| `image` | Path to hotel image |
| `description` | Brief hotel description |
| `attractions` | Array of nearby attractions |

---

## 🚀 Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- No backend server or database required

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/BookMyStay.git
   cd BookMyStay
   ```

2. **Ensure proper file placement**
   - Keep `hotels.json` in the project root or `frontend/public/` folder
   - Keep the `assets/` folder with all hotel images

3. **Open in browser**
   - Double-click `frontend/index.html` to open locally
   - **Recommended:** Use [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) extension for smooth loading

4. **Start exploring!**
   - Enter a city name to search
   - Apply filters and sort options
   - Click on a hotel to see details and nearby attractions
   - Add hotels to favorites

---

## 💻 How It Works

### Homepage Flow
1. User enters a city name on the homepage (`index.html`)
2. City is saved to browser localStorage
3. Redirects to listings page

### Listings Page
1. Fetches all hotels from `hotels.json`
2. Filters by:
   - **City matching** — Shows only hotels in the searched city
   - **Price range** — Excludes hotels outside the selected budget
   - **Minimum rating** — Filters by star rating threshold
3. Applies sorting (price low-to-high, price high-to-low, top-rated)
4. Displays filtered results in a responsive grid

### Hotel Details
- Click any hotel card to view full details
- See nearby attractions
- Add to favorites (stored in localStorage)
- Proceed to booking

### Booking Page
- Displays booking summary
- Confirms reservation details
- Ready for payment integration

---

## 🎨 Design Features

- **Modern, Clean UI** — Professional travel website aesthetic
- **Premium Cards** — Rounded corners, shadows, and hover effects
- **Responsive Grid** — Adapts from 1 column (mobile) to 4 columns (desktop)
- **Smooth Interactions** — Subtle animations and transitions
- **Accessibility** — Semantic HTML and readable color contrast
- **Light & Dark Modes** — User preference-based theme switching

---

## 🛠️ Tech Stack

| Technology | Purpose |
|-----------|---------|
| **HTML5** | Semantic page structure |
| **CSS3** | Responsive styling & animations |
| **JavaScript (Vanilla)** | Dynamic filtering, sorting, storage |
| **localStorage API** | Client-side data persistence |
| **JSON** | Static hotel data storage |

---

## 📱 Browser Support

- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

---

## 🔮 Future Enhancements

- 🗺️ Interactive maps integration (Google Maps API)
- 💬 User reviews and ratings system
- 💳 Payment gateway integration (Stripe, PayPal)
- 🖼️ Image carousel galleries
- 📧 Booking confirmation emails
- 🔐 User authentication & profiles
- 📊 Admin dashboard for hotel management
- 🌐 Multi-language support

---

## 📝 Usage Tips

### Adding More Hotels
Edit `hotels.json` and add new hotel objects following the same structure.

### Customizing Styles
Modify `frontend/style.css` to change colors, fonts, or spacing.

### Deploying Online
- Upload to GitHub Pages
- Deploy on Netlify or Vercel
- Use GitHub Actions for continuous deployment

---

## 🤝 Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 💬 Support

Have questions or found a bug? Open an [Issue](https://github.com/yourusername/BookMyStay/issues) on GitHub.

---

## 🙏 Acknowledgments

- Designed for travel enthusiasts who value smart booking decisions
- Built with HTML5, CSS, and  JavaScript
- Inspired by modern travel platforms

---

**Made with ❤️ for travelers around the world**

⭐ If you find this useful, please star the repository!