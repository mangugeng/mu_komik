# News Collection Setup Guide

## Overview
This guide explains how to set up the news collection in Firestore for the MU Komik platform.

## Prerequisites
- Node.js installed
- Firebase project configured
- Firebase CLI installed (optional, for deploying rules)

## Setup Instructions

### 1. Run the News Collection Setup Script

```bash
npm run setup-news
```

This script will:
- Connect to your Firebase project
- Create a `news` collection in Firestore
- Add 8 sample news articles with realistic data
- Include metadata like views, likes, tags, and timestamps

### 2. Sample News Data Structure

Each news document contains:
```typescript
{
  title: string;           // News title
  content: string;         // News content
  imageUrl?: string;       // Featured image URL
  author: string;          // Author name
  category: string;        // News category
  readTime: number;        // Estimated reading time in minutes
  status: string;          // "published" or "draft"
  tags: string[];          // Searchable tags
  views: number;           // View count
  likes: number;           // Like count
  publishedAt: Timestamp;  // Publication date
  createdAt: Timestamp;    // Creation date
  updatedAt: Timestamp;    // Last update date
}
```

### 3. Available Categories

- **Prestasi** - Achievement/recognition news
- **Fitur** - New feature announcements
- **Trending** - Popular content updates
- **Tips** - Tips and guides
- **Event** - Event announcements
- **Update** - App/platform updates
- **Wawancara** - Interview content
- **Analisis** - Analysis and insights

### 4. Firestore Security Rules

The news collection has the following security rules:
- **Read**: Public access (anyone can read news)
- **Create/Update/Delete**: Admin only
- **Update views/likes**: Authenticated users can increment these fields

### 5. API Functions Available

The `lib/newsService.ts` provides these functions:

```typescript
// Get latest news
getLatestNews(limit: number): Promise<NewsItem[]>

// Get news by category
getNewsByCategory(category: string, limit: number): Promise<NewsItem[]>

// Get single news by ID
getNewsById(id: string): Promise<NewsItem | null>

// Increment view count
incrementNewsViews(id: string): Promise<void>

// Increment like count
incrementNewsLikes(id: string): Promise<void>
```

### 6. Adding New News Articles

To add new news articles manually:

1. Go to Firebase Console
2. Navigate to Firestore Database
3. Select the `news` collection
4. Click "Add Document"
5. Fill in the required fields
6. Set `status` to "published" to make it visible

### 7. Customizing the Setup Script

To modify the sample data:

1. Edit `scripts/setup-news-collection.js`
2. Modify the `sampleNews` array
3. Run `npm run setup-news` again

**Note**: Running the script multiple times will create duplicate entries. Clear the collection first if needed.

### 8. Troubleshooting

**Common Issues:**

1. **Firebase connection error**
   - Check your Firebase config in `lib/firebase.ts`
   - Ensure your project ID is correct

2. **Permission denied**
   - Check Firestore security rules
   - Ensure you have admin access to the project

3. **Script not found**
   - Make sure you're in the project root directory
   - Run `npm install` to ensure all dependencies are installed

### 9. Deployment

To deploy the updated Firestore rules:

```bash
firebase deploy --only firestore:rules
```

## Support

If you encounter any issues, check:
1. Firebase Console for error logs
2. Browser console for client-side errors
3. Network tab for API request failures 