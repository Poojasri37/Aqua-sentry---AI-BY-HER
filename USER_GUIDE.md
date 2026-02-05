# Quick User Guide - New Features

## 🎯 How to Use the New Features

### 1. Register New Asset (User Dashboard)

**Steps:**
1. Navigate to **All Tanks** tab in the sidebar
2. Click the **"Register Asset"** button (top right)
3. Fill in the form:
   - Tank Name (e.g., Salem-Ward5-Tank1)
   - Ward Number (e.g., Ward 5)
   - Location Address
   - Latitude & Longitude coordinates
   - Capacity in Liters
   - Purpose (Residential/Commercial/Industrial/Agricultural)
4. Click **"Register Asset"**
5. You'll see a success message confirming registration
6. Admin will be automatically notified!

**What happens:**
- Your asset registration is saved
- Admin receives a notification with your details
- You can close the modal and continue working

---

### 2. View Asset Registration Notifications (Admin Dashboard)

**Steps:**
1. Login as Admin
2. Look for the **Bell icon** in the top right header
3. If there are new registrations, you'll see a **red notification badge**
4. Click the bell icon to open the notification panel
5. Each notification shows:
   - User name and email
   - Asset name
   - Ward and location
   - Timestamp
6. You can:
   - **Approve** the registration
   - **Reject** the registration
   - **Dismiss** individual notifications
   - **Clear All** notifications

---

### 3. View Ward Map (User Dashboard)

**Steps:**
1. Navigate to **Map View** tab in the sidebar
2. You'll now see:
   - **6 color-coded ward boundaries** with dashed lines
   - **Ward center markers** with ward names
   - **Tank markers** showing status (green/yellow/red)
3. Interact with the map:
   - Click on ward boundaries to see ward info
   - Click on ward center markers to see details
   - Click on tank markers to see tank status
   - Click "Detailed Analytics" in tank popup to view full details

**Ward Colors:**
- 🔵 Blue - Ward 1 (Suramangalam)
- 🟣 Purple - Ward 2 (Fairlands)
- 🩷 Pink - Ward 3 (Ammapet)
- 🟢 Green - Ward 4 (Hastampatti)
- 🟠 Orange - Ward 5 (Anna Nagar)
- 🔷 Cyan - Ward 6 (Swarnapuri)

---

### 4. Monitor Dynamic Alerts (User Dashboard)

**Steps:**
1. Navigate to **Alerts Hub** tab in the sidebar
2. You'll see:
   - **Live indicator** (green badge) when system is connected
   - **Alert count** in the header
   - **Real-time alerts** as they occur
3. Features:
   - Alerts update automatically (no refresh needed)
   - Click any alert to view tank details
   - Click **"Clear all alerts"** to dismiss all
   - Empty state shows "All Clear!" when no alerts

**Alert Types:**
- 🔴 Critical - Red background (immediate action needed)
- 🟡 Warning - Yellow background (observation required)

---

### 5. Report Issues (Tank Details Page)

**Steps:**
1. Navigate to any tank details page
2. Look for **"Operational Control"** section (right sidebar)
3. Click **"Report Issue"** button (red button)
4. Fill in the issue report form
5. Submit your report

**Note:** Button text changed from "Emergency Report" to "Report Issue"

---

### 6. Export Telemetry Data (Tank Details Page)

**Steps:**
1. Navigate to any tank details page
2. Look for **"Operational Control"** section (right sidebar)
3. Click **"Export Telemetry"** button (gray button)
4. A CSV file will automatically download with:
   - Tank metadata (ID, name, location, ward, status)
   - Current metrics (pH, turbidity, chlorine, temperature)
   - Water level and capacity
   - Last cleaned date
   - Historical data (last 24 hours)

**File naming:** `[TankID]_Telemetry_[Date].csv`

Example: `TN-SA-1001_Telemetry_2026-02-05.csv`

---

### 7. Bulk Export (User Dashboard)

**Steps:**
1. From the User Dashboard sidebar
2. Click **"Export Stats (CSV)"** in Quick Actions
3. Downloads CSV with all tanks data

**OR**

1. Click **"Generate PDF Report"**
2. Opens print dialog for PDF export

---

## 🔄 Real-Time Features

### Live Updates
- **Tank metrics** update automatically every 5 seconds
- **Alerts** appear in real-time when triggered
- **Connection status** shown in header (green = live, gray = offline)

### Visual Indicators
- 🟢 Green dot = Live/Connected
- 🔴 Red dot = Critical alert
- 🟡 Yellow dot = Warning
- Pulsing animations = Real-time activity

---

## 💡 Tips

1. **Keep the dashboard open** to receive real-time updates
2. **Check the bell icon** regularly for new asset registrations (admin)
3. **Use the map view** to get geographical context of your tanks
4. **Export telemetry regularly** for record-keeping and analysis
5. **Clear old alerts** to keep your dashboard clean

---

## 🐛 Troubleshooting

**Issue:** Register Asset button doesn't open modal
- **Solution:** Refresh the page and try again

**Issue:** Map doesn't show ward boundaries
- **Solution:** Zoom in/out or refresh the page

**Issue:** Export doesn't download
- **Solution:** Check browser download settings and popup blockers

**Issue:** Alerts not updating
- **Solution:** Check connection status (should show "LIVE" badge)

**Issue:** Admin notifications not showing
- **Solution:** Ensure user has registered an asset first

---

## 📱 Browser Compatibility

✅ Chrome (Recommended)
✅ Firefox
✅ Edge
✅ Safari

**Minimum Requirements:**
- Modern browser with JavaScript enabled
- LocalStorage enabled
- Pop-up blocker disabled for downloads

---

**Enjoy the enhanced AquaSentry experience! 🚰💧**
