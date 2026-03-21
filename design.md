🧭 1. Clarity, Deference, Depth (Core Principles)

Apple designs everything around three pillars:

✔️ Clarity

Text should always be readable

Icons should be simple and recognizable

Avoid clutter → every element must have a purpose

✔️ Deference

UI should not overpower content

Use subtle colors, blur, and spacing

Let content (like your worship songs list 👀) take center stage

✔️ Depth

Use layers, shadows, and motion to show hierarchy

Navigation should feel natural (like moving forward/back)

📱 2. Layout & Structure
Safe Areas

Avoid notches, rounded corners, home indicator

Always design within safe area constraints

Spacing

Use consistent padding (8pt grid system)

Maintain breathing room between elements

Alignment

Left-align most content (especially text-heavy apps)

Keep layouts predictable

🎯 3. Navigation Patterns
Use Standard Navigation Styles:

Tab Bar → for top-level sections (max ~5 tabs)

Navigation Bar → for hierarchy (back button, title)

Modal → for temporary tasks

👉 Avoid custom navigation unless necessary — users expect standard iOS behavior.

🧩 4. Touch & Interaction
Touch Targets

Minimum size: 44 × 44 pt

Space between tappable elements

Gestures

Support common gestures:

Swipe back

Pull to refresh

Tap, long press

Feedback

Always show response:

Button highlight

Loading indicators

Haptic feedback (if possible)

🎨 5. Typography
Use System Font:

San Francisco (automatically adapts)

Text Hierarchy:

Title

Headline

Body

Caption

👉 Use Dynamic Type so text scales with user settings

🌈 6. Colors & Appearance
System Colors

Use iOS semantic colors (they adapt to dark mode)

Dark Mode Support

Don’t just invert colors

Maintain contrast and readability

Contrast

Ensure accessibility (WCAG compliance)

🧱 7. Components (Use Native Patterns)

Prefer built-in UI styles:

Buttons → filled, tinted, or plain

Lists → grouped or inset grouped

Cards → subtle shadows, rounded corners

Toggles → standard iOS switches

👉 Users should feel like your app “belongs” on iOS

🔄 8. Motion & Animation

Keep animations fast and meaningful

Use transitions to show:

Cause → effect

Navigation flow

Avoid flashy or unnecessary motion

🔐 9. Permissions & Privacy

Ask permissions only when needed

Always explain why

Example: “We need access to notifications to remind you about worship sets”

♿ 10. Accessibility (Super Important)

Support VoiceOver

Use proper labels for buttons/icons

Maintain good contrast

Avoid relying only on color for meaning

⚡ 11. Performance & Responsiveness

UI should feel instant

Avoid laggy animations

Load content progressively

🧠 Practical Tips (For Your Worship App)

Since you're building a song selection app, here's how to apply this:

Use Tab Bar:

Songs | Playlists | Favourites | Settings

Use List UI:

Song title (bold)

Artist (secondary text)

Add:

Search bar (top)

Filters (key, tempo, language 👀)

Keep:

One primary action per screen (e.g., “Add to Setlist”)

🚫 Common Mistakes to Avoid

Overdesigning (too many colors, shadows)

Tiny buttons

Custom gestures users don’t understand

Ignoring dark mode

Cluttered screens