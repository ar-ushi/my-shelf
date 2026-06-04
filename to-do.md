# To Do

1. Refactor code to remove inline styles.
2. Memoize API calls for the same book appearing multiple times, for example across different years.
3. Scope API calls by year/month to reduce long loading times.
4. Clean up the shelf/data flow so upload-backed shelves and preloaded public shelves share less conditional logic.
5. Add a script/command to generate `src/data/creators-shelf.json` from a local Goodreads or StoryGraph CSV.
6. Revisit the spine sizing and opened-cover interaction so face-out books feel more natural on the shelf.
7. Improve color assignment so adjacent spines avoid overly similar palette choices.
8. Surface richer book metadata in the UI, such as series and curated genres, when it adds value.
9. Add caching or persistence for parsed shelf data so repeated uploads of the same file do less work.
10. Introduce auth and user-specific persistence so shelves do not depend on session storage.
11. Add database-backed storage for shared book metadata to reduce repeated Open Library calls across users.
12. Support manual editing of book metadata, including moods, genres, reviews, and hiding irrelevant tags.
13. Add manual book entry so users can add books not present in their CSV exports.
14. Improve error handling and observability around CSV parsing and Open Library enrichment.
