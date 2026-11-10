
# Rich-Text Editor Selection

## 1. Overview

TipTap was selected as the rich-text editor for the Notes Management Application.

The main requirement was to provide users with a simple editing experience while ensuring that formatted note content could be stored, retrieved, and searched effectively.

TipTap was a good fit because it provides an approachable editor interface, structured JSON output, and the flexibility to extend editing functionality.

## 2. Why TipTap?

A few aspects made TipTap suitable for this application:

### Easy Integration and Customization

TipTap integrates well with React and provides a straightforward way to build an editor using reusable extensions.

Its extension-based approach made it convenient to add the formatting options required by the assessment without having to implement text-editing behaviour from scratch.

### Structured JSON Representation

One of the main reasons for using TipTap was its JSON document format.

Instead of storing formatted notes as an unstructured HTML string, TipTap represents the content as a structured document containing nodes and marks.

For example, a paragraph containing bold text is represented through a paragraph node and a text node with a bold mark.

This makes the content easier to process programmatically and preserves formatting when a note is reopened in the editor.

### Easier Content Searching

The structured JSON representation also provides a useful way to separate presentation from searchable content.

While the original TipTap JSON is stored to preserve formatting, the backend extracts a plain-text representation of the content and stores it in the `contentText` field.

This allows the application to search note content without having to parse rich-text formatting every time a search is performed.

The title and extracted plain text can then be used for searching, while the original JSON remains available for rendering and editing.

This was an important consideration because the application needed to support both rich-text editing and content-based search.

### Extensibility

TipTap uses an extension-based architecture.

This makes it possible to add or customize editor functionality as the application grows, without needing to replace the entire editor.

## 3. Implemented Formatting Features

The application currently supports:

- Bold text
- Italic text
- Heading levels
- Bullet lists
- Ordered lists
- Hyperlinks
- Code blocks

These features are implemented using TipTap extensions.

## 4. Content Storage and Autosave

The editor produces a JSON document that is sent to the backend when a note is created or updated.

The backend stores:

- `content`: the original TipTap JSON document, preserving formatting.
- `contentText`: extracted plain text, used for searching.

The frontend also implements debounced autosaving.

Instead of sending an API request after every keystroke, the application waits for a short period of inactivity before saving the latest editor content.

This reduces unnecessary API requests while allowing users to work without manually saving every change.

## 5. Licensing Considerations

The application uses TipTap's open-source React editor packages and extensions.

The selected packages are used under their respective open-source licences. The implementation does not depend on paid TipTap Pro extensions.

Package licence information should be checked against the installed package metadata and the official TipTap licensing documentation.

## 6. Alternatives Considered

Other rich-text editor options include:

- **Quill:** A popular rich-text editor with a relatively simple integration approach.
- **Draft.js:** A React-oriented rich-text framework that provides control over editor state.
- **Lexical:** An extensible editor framework designed for building rich-text experiences.

TipTap was a practical fit for this project because its React integration, JSON document representation, and extension-based approach aligned well with the application's requirements.

## 7. Conclusion

TipTap was selected because it offered a balance between ease of integration, flexibility, and structured content storage.

More importantly, its JSON representation allowed the application to preserve rich-text formatting while maintaining a separate plain-text field for searching.

This made it possible to support editing and searching without treating them as separate, unrelated features.
