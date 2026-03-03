# React Native Notes Application

A mobile notes application built with React Native and Expo. Users can register, log in, and manage personal notes organised by categories (**Work**, **Study**, **Personal**). Data is persisted locally using AsyncStorage.

---

## Table of Contents

- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [How to Test the App](#how-to-test-the-app)
  - [1. Registration](#1-registration)
  - [2. Login](#2-login)
  - [3. Creating a Note](#3-creating-a-note)
  - [4. Viewing Notes](#4-viewing-notes)
  - [5. Editing a Note](#5-editing-a-note)
  - [6. Deleting a Note](#6-deleting-a-note)
  - [7. Searching Notes](#7-searching-notes)
  - [8. Sorting Notes](#8-sorting-notes)
  - [9. Filtering by Category](#9-filtering-by-category)
  - [10. Profile Management](#10-profile-management)
  - [11. Logout](#11-logout)
- [Running on Different Platforms](#running-on-different-platforms)
- [Tech Stack](#tech-stack)
- [Learn More](#learn-more)

---

## Prerequisites

Before running the app, ensure you have the following installed:

- **Node.js** (v18 or later) — [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Expo Go** app on your mobile device — [Android](https://play.google.com/store/apps/details?id=host.exp.exponent) | [iOS](https://apps.apple.com/app/expo-go/id982107779)
- (Optional) **Android Studio** for Android emulator
- (Optional) **Xcode** for iOS simulator (macOS only)

---

## Getting Started

1. **Clone the repository**

   ```bash
   git clone https://github.com/itumeleng-itu/ReactNativeNotesApplication.git
   cd ReactNativeNotesApplication
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npx expo start
   ```

   Or, to use tunnel mode (useful when your phone is on a different network):

   ```bash
   npx expo start --tunnel
   ```

4. **Open the app**

   - Scan the QR code with **Expo Go** (Android) or the Camera app (iOS).
   - Alternatively, press `a` for Android emulator or `i` for iOS simulator in the terminal.

---

## Project Structure

```
ReactNativeNotesApplication/
├── app/                    # Screen files (file-based routing)
│   ├── (tabs)/             # Tab-based screens
│   │   ├── _layout.tsx     # Tab navigator config
│   │   ├── index.tsx       # All Notes tab
│   │   ├── work.tsx        # Work Notes tab
│   │   ├── study.tsx       # Study Notes tab
│   │   └── personal.tsx    # Personal Notes tab
│   ├── _layout.tsx         # Root layout with auth guarding
│   ├── login.tsx           # Login screen
│   ├── register.tsx        # Registration screen
│   ├── note-detail.tsx     # Note detail view
│   ├── note-editor.tsx     # Create/edit note screen
│   └── profile.tsx         # Profile settings screen
├── components/             # Reusable UI components
│   └── NoteCard.tsx        # Note card component
├── context/                # React Context providers
│   ├── AuthContext.tsx      # Authentication state management
│   └── NotesContext.tsx     # Notes state management
├── constants/              # App constants
│   └── theme.ts            # Theme colours and fonts
├── types/                  # TypeScript type definitions
├── utils/                  # Utility functions
│   ├── helpers.ts          # Helper functions (validation, formatting)
│   └── storage.ts          # AsyncStorage wrapper
└── assets/                 # Images and static assets
```

---

## How to Test the App

Follow these steps to manually test all features of the application. Make sure the app is running on your device or emulator before proceeding.

### 1. Registration

1. When the app launches, you will see the **Login** screen.
2. Tap the **"Sign Up"** link at the bottom to navigate to the Registration screen.
3. Fill in the registration form:
   - **Username**: Enter a username (minimum 3 characters, e.g. `testuser`).
   - **Email**: Enter a valid email address (e.g. `test@example.com`).
   - **Password**: Enter a password (minimum 6 characters, e.g. `password123`).
   - **Confirm Password**: Re-enter the same password.
4. Tap **"Create Account"**.
5. **Expected result**: You should be redirected to the main **All Notes** tab screen.

**Error cases to test:**
- Leave any field empty → Should show "Please fill in all fields".
- Enter a username shorter than 3 characters → Should show "Username must be at least 3 characters".
- Enter an invalid email (e.g. `invalid`) → Should show "Please enter a valid email address".
- Enter a password shorter than 6 characters → Should show "Password must be at least 6 characters".
- Enter mismatched passwords → Should show "Passwords do not match".
- Register with an email that already exists → Should show "Email already exists or registration failed".

---

### 2. Login

1. If logged in, first log out (see [Logout](#11-logout)).
2. On the **Login** screen, enter the credentials you registered with:
   - **Email**: `test@example.com`
   - **Password**: `password123`
3. Tap **"Sign In"**.
4. **Expected result**: You should be redirected to the main **All Notes** tab screen with a greeting "Hello, testuser".

**Error cases to test:**
- Leave any field empty → Should show "Please fill in all fields".
- Enter wrong email or password → Should show "Invalid email or password".

---

### 3. Creating a Note

1. From any tab screen, tap the **white "+" floating action button** (bottom-right corner).
2. You will be taken to the **New Note** screen.
3. Select a **category** by tapping one of the three buttons: **Work**, **Study**, or **Personal**. The selected category will appear as a white button with black text.
4. (Optional) Enter a **title** for the note.
5. Enter the **content** of the note (this is required).
6. Tap the **"Save"** button in the top-right corner.
7. **Expected result**: You are navigated back and the new note appears in the list.

**Error cases to test:**
- Leave the content field empty and tap Save → Should show "Note content is required".

**Suggested test data — create at least one note per category:**

| Title | Content | Category |
|-------|---------|----------|
| Sprint Planning | Discuss Q2 roadmap and assign tasks | Work |
| React Hooks | Study useEffect cleanup patterns | Study |
| Grocery List | Milk, eggs, bread, butter | Personal |

---

### 4. Viewing Notes

1. Navigate between the four tabs at the bottom:
   - **All Notes** — Shows all notes across all categories.
   - **Work** — Shows only notes with the Work category.
   - **Study** — Shows only notes with the Study category.
   - **Personal** — Shows only notes with the Personal category.
2. Tap on any **note card** to view its full details.
3. **Expected result**: The **Note Details** screen shows the category badge, title, content, creation date, and last updated date (if edited).

**Things to verify:**
- Note count displayed in the header matches the number of notes shown.
- Each tab only shows notes of its respective category.
- The "All Notes" tab shows every note regardless of category.
- Empty states display correct messages when no notes exist (e.g. "No work notes yet").

---

### 5. Editing a Note

1. There are two ways to edit a note:
   - From the **note card**: Tap the **pencil (edit) icon** on the right side of the card header.
   - From the **Note Details** screen: Tap the **pencil icon** in the top-right header.
2. The **Edit Note** screen opens pre-filled with the existing note data.
3. Modify any field (title, content, or category).
4. Tap **"Save"**.
5. **Expected result**: You are navigated back and the note shows the updated content. An "Edited" badge appears in the note card footer.

**Things to verify:**
- The note's updated date changes after editing.
- Changing a note's category moves it to the correct tab.
- The original creation date remains unchanged.

---

### 6. Deleting a Note

1. There are two ways to delete a note:
   - From the **note card**: Tap the **trash (delete) icon** on the right side of the card header.
   - From the **Note Details** screen: Tap the **trash icon** in the top-right header.
2. A confirmation dialog appears: "Are you sure you want to delete this note?"
3. Tap **"Delete"** to confirm or **"Cancel"** to abort.
4. **Expected result**: The note is removed from the list and the note count updates.

**Things to verify:**
- The note disappears from all tabs (All Notes + its category tab).
- The note count in the header decreases by 1.
- Cancelling the deletion keeps the note intact.

---

### 7. Searching Notes

1. Go to the **All Notes** tab.
2. Tap the **search bar** at the top and type a search term (e.g. the title or content of a note).
3. **Expected result**: The note list filters in real-time to show only notes matching the search term.
4. Tap the **"X" clear button** to reset the search.

**Things to verify:**
- Search matches against both note titles and content.
- If no notes match, a "No notes found" empty state is displayed.
- Clearing the search shows all notes again.

---

### 8. Sorting Notes

1. On any tab, tap the **sort button** (showing "Newest First" or "Newest"/"Oldest").
2. **Expected result**: The note order toggles between newest first and oldest first.

**Things to verify:**
- Notes reorder correctly based on their creation date.
- The sort button label updates to reflect the current order.

---

### 9. Filtering by Category

1. Tap each tab at the bottom navigation: **All Notes**, **Work**, **Study**, **Personal**.
2. **Expected result**: Each tab shows only notes belonging to that category.

**Things to verify:**
- The header icon and title match the selected category.
- Note counts are accurate for each category.
- Empty state messages are category-specific (e.g. "No study notes yet").

---

### 10. Profile Management

1. Tap your **profile avatar** (the circle with your initial) in the top-right corner of the All Notes screen.
2. The **Profile Settings** screen shows your current username and email.

**Test updating the username:**
1. Change the username field to something new (e.g. `newuser`).
2. Tap **"Save Changes"**.
3. **Expected result**: A success message appears and the greeting on the home screen updates.

**Test updating the email:**
1. Change the email field to a new valid email.
2. Tap **"Save Changes"**.
3. **Expected result**: A success message appears. You can now log in with the new email.

**Test changing the password:**
1. Enter your **current password** in the "Current password" field.
2. Enter a **new password** (minimum 6 characters) in the "New password" field.
3. Tap **"Save Changes"**.
4. **Expected result**: A success message appears. You can now log in with the new password.

**Error cases to test:**
- Clear the username and save → Should show "Username is required".
- Enter an invalid email and save → Should show "Please enter a valid email address".
- Enter a wrong current password when changing password → Should show "Current password is incorrect".
- Save without making any changes → Should show "No changes to save".

---

### 11. Logout

1. From the **Profile Settings** screen, scroll down and tap **"Logout"**.
2. A confirmation dialog appears: "Are you sure you want to logout?"
3. Tap **"Logout"** to confirm.
4. **Expected result**: You are redirected to the **Login** screen.

**Things to verify:**
- After logging out, pressing the back button should not return to the authenticated screens.
- Logging back in shows all previously created notes (data persists locally).

---

## Running on Different Platforms

| Platform | Command | Notes |
|-|-|-|
| **Expo Go (phone)** | `npx expo start` | Scan QR code with Expo Go app |
| **Tunnel mode** | `npx expo start --tunnel` | Use when phone is on a different network |
| **Android emulator** | `npx expo start --android` | Requires Android Studio setup |
| **iOS simulator** | `npx expo start --ios` | Requires Xcode (macOS only) |
| **Web browser** | `npx expo start --web` | Opens in your default browser |

---

## Tech Stack

- **Framework**: [React Native](https://reactnative.dev/) with [Expo](https://expo.dev/) (SDK 54)
- **Routing**: [Expo Router](https://docs.expo.dev/router/introduction/) (file-based routing)
- **Navigation**: [React Navigation](https://reactnavigation.org/) (bottom tabs + stack)
- **Storage**: [AsyncStorage](https://react-native-async-storage.github.io/async-storage/) (local data persistence)
- **Language**: TypeScript
- **Icons**: [@expo/vector-icons](https://icons.expo.fyi/) (Ionicons)

---

## Learn More

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/docs/getting-started)
- [Expo Router Guide](https://docs.expo.dev/router/introduction/)
- [AsyncStorage Docs](https://react-native-async-storage.github.io/async-storage/)
