# To-Do List Assignment

A browser-based To-Do List application. The app is fully working — but it's written in JavaScript. Your job is to convert it to TypeScript.

## Getting Started

```bash
npm install
npm run dev
```

Open the URL shown in the terminal (usually `http://localhost:5173`).

Run the app in the browser and try it out — add, toggle, edit, delete, and filter tasks. Everything works. Now your goal is to make it type-safe.

## Architecture

```
src/
  main.js                   — coordinator that creates all objects and defines handlers
  store.js                  — reads/writes tasks in localStorage
  task-manager.js           — owns the task array, delegates persistence to TaskStore
  views/
    app-view.js             — builds the app shell (form, filter bar), owns TaskListView
    task-list-view.js       — renders the task list into <ul>
    task-edit-view.js       — enterEditMode() replaces a task row with an inline edit form
    utils.js                — escapeHtml helper
```

Data flows in one direction: **user action → handler → mutate data (TaskManager) → re-render (AppView)**.

## Your Task

Convert the JavaScript app to TypeScript, one file at a time. You'll rename each `.js` file to `.ts`, then fix the errors that VS Code shows you (red underlines). Work through the steps below in order — each step builds on the previous ones.

> [!TIP]
> When you rename a file to `.ts`, keep the `.js` extensions in its import paths (e.g., `import { TaskStore } from "./store.js"`). TypeScript resolves `.js` imports to the corresponding `.ts` files automatically. Do **not** change them to `.ts`.

### Step 1 — Create `src/types.ts`

Create a new file `src/types.ts`. Several files in the app work with the same data shapes — tasks, filter values, and handler callbacks. Defining shared types up front means you can import them in each file as you convert it.

Export these three types:

1. A `Task` interface — this is the core data shape passed around the entire app. Look at `task-manager.js` to discover what properties a task has.
2. A `FilterStatus` union type — used by the filter bar and the cancel button to track which tasks are shown. The `getFiltered()` method in `task-manager.js` has a switch statement with all the valid values. Use a union of string literals (e.g., `type FilterStatus = "a" | "b"`).
3. A `TaskHandlers` interface — open `main.js` and find the `handlers` variable. Later, when you convert `main.js` to TypeScript, you'll use this interface to type-annotate that variable. It has five methods (`onAdd`, `onToggle`, `onDelete`, `onEdit`, `onFilter`). Your interface should describe each method's name, parameters, and return type. The parameter types are mostly `string`, except `onFilter` which takes a `FilterStatus`.

### Step 2 — Convert `views/utils.ts`

Rename `src/views/utils.js` → `src/views/utils.ts`.

VS Code will show one error: the `str` parameter has an implicit `any` type. Add a type annotation to the parameter and a return type to the function.

### Step 3 — Convert `store.ts`

Rename `src/store.js` → `src/store.ts`.

- Import `Task` from your types file.
- Add a return type to `load()` and a type annotation to the `tasks` parameter in `save()`.

### Step 4 — Convert `task-manager.ts`

Rename `src/task-manager.js` → `src/task-manager.ts`.

- Import `Task`, `FilterStatus`, and `TaskStore` where needed.
- **Declare class properties** — TypeScript requires you to declare every property at the top of the class with its type before using it (e.g., `tasks: Task[] = [];` and `store: TaskStore;`).
- Add types to all method parameters and return types.

### Step 5 — Convert `views/task-edit-view.ts`

Rename `src/views/task-edit-view.js` → `src/views/task-edit-view.ts`.

- Import your types and add type annotations to the `enterEditMode` function parameters (`li`, `task`, `handlers`).
- **Type the DOM queries** — `querySelector` returns `Element | null`, but you need specific element types. Add a generic type parameter: `querySelector<HTMLInputElement>(".edit-title")`. The result is still `HTMLInputElement | null`, so TypeScript won't let you call `.value` or `.addEventListener()` on it — the element could be `null`. Since you know these elements exist (the HTML is right above in the same function), use the non-null assertion operator (`!`) to tell TypeScript it's safe.
- **Type cast** — in the cancel button handler, `dataset.filter` returns `string | undefined`, but you know it's a valid `FilterStatus`. Use `as FilterStatus` to tell TypeScript.

### Step 6 — Convert `views/task-list-view.ts`

Rename `src/views/task-list-view.js` → `src/views/task-list-view.ts`.

- Import your types and declare class properties (`root`, `handlers`) with their types.
- Type the constructor parameters.
- Type the `querySelector` calls and add `!` assertions, the same way you did in the previous step.

### Step 7 — Convert `views/app-view.ts`

Rename `src/views/app-view.js` → `src/views/app-view.ts`.

- Import your types and declare class properties (`filterBar`, `taskListView`).
- Type the `querySelector` calls with generics and `!` assertions.
- In the filter button click handler, cast `btn.dataset.filter as FilterStatus` — the same pattern you used in `task-edit-view.ts`.

### Step 8 — Convert `main.ts`

Rename `src/main.js` → `src/main.ts` and update `index.html` to match:

```html
<script type="module" src="/src/main.ts"></script>
```

- Import `FilterStatus` and `TaskHandlers` from your types file.
- Add type annotations to `currentFilter`, `appView`, and the handler method parameters.

## Checking Your Work

After each step, check that VS Code shows no red underlines in the file you just converted. When all eight steps are done, run the type checker from the `assignment/` folder:

```bash
npx tsc --noEmit
```

It should pass with zero errors. Then test the app in the browser — everything should still work exactly as before.

## Features

- Create tasks with a title and optional description
- Toggle task completion (checkbox + strikethrough)
- Edit tasks inline
- Delete tasks
- Filter by All / Pending / Completed
- Data persists across page refreshes (localStorage)
