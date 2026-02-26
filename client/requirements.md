## Packages
@tiptap/react | Core React package for the rich text editor
@tiptap/starter-kit | Essential extensions for the rich text editor
@tiptap/extension-placeholder | Placeholder support for the rich text editor

## Notes
- Assumes the backend authenticates users via `/api/login` and provides user details at `/api/auth/user`.
- Uses Recharts for data visualization (already installed).
- Uses Framer Motion for page transitions (already installed).
- Assumes `user.role` is available on the authenticated user object, mapping to 'student', 'teacher', or 'admin'.
- Stock images used on the landing page are from Unsplash.
