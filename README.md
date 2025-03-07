# Mouse Drag Scroll Directive

A simple Angular directive that enables horizontal scrolling via mouse dragging. Useful for scrollable containers where users can click and drag to navigate.

## Features
- Enables horizontal scrolling with mouse drag.
- Prevents unwanted text selection while dragging.
- Uses `requestAnimationFrame` for smooth scrolling.
- Automatically detects scrollability and applies necessary classes.
- Uses throttling to improve performance.

## Installation
1. Copy the `mouse-drag-scroll.directive.ts` file into your Angular project.
2. Declare the directive in your module:

```typescript
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MouseDragScrollDirective } from './mouse-drag-scroll.directive';

@NgModule({
  declarations: [MouseDragScrollDirective],
  imports: [BrowserModule],
  exports: [MouseDragScrollDirective]
})
export class AppModule {}
```

## Usage
Simply add the `mouseDragScroll` directive to any horizontally scrollable container:

```html
<div class="scroll-container" mouseDragScroll>
  <div class="scroll-content">
    <!-- Your content here -->
  </div>
</div>
```

## How It Works
- **Mouse Down:** Starts the drag and disables text selection.
- **Mouse Move:** Moves the scroll position based on the drag distance.
- **Mouse Up/Leave:** Stops the dragging and re-enables text selection.
- **Window Resize:** Adjusts scrollability status dynamically.

## Dependencies
- `lodash.throttle` (Optional but used for performance optimization)

Install it with:
```sh
npm install lodash
```

## License
This project is licensed under the MIT License.

