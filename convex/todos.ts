// import { ConvexError, v } from "convex/values";
// import { mutation, query } from "./_generated/server";

// export const getTodos = query({
//   handler: async (ctx) => {
//     const todos = await ctx.db.query("todos").order("desc").collect();
//     return todos;
//   },
// });

// export const addTodo = mutation({
//   args: { text: v.string() },
//   handler: async (ctx, args) => {
//     const todoId = await ctx.db.insert("todos", {
//       text: args.text,
//       isCompleted: false,
//     });

//     return todoId;
//   },
// });

// export const toggleTodo = mutation({
//   args: { id: v.id("todos") },
//   handler: async (ctx, args) => {
//     const todo = await ctx.db.get(args.id);
//     if (!todo) throw new ConvexError("Todo not found");

//     await ctx.db.patch(args.id, {
//       isCompleted: !todo.isCompleted,
//     });
//   },
// });

// export const deleteTodo = mutation({
//   args: { id: v.id("todos") },
//   handler: async (ctx, args) => {
//     await ctx.db.delete(args.id);
//   },
// });

// export const updateTodo = mutation({
//   args: {
//     id: v.id("todos"),
//     text: v.string(),
//   },
//   handler: async (ctx, args) => {
//     await ctx.db.patch(args.id, {
//       text: args.text,
//     });
//   },
// });

// export const clearAllTodos = mutation({
//   handler: async (ctx) => {
//     const todos = await ctx.db.query("todos").collect();

//     // Delete all todos
//     for (const todo of todos) {
//       await ctx.db.delete(todo._id);
//     }

//     return { deletedCount: todos.length };
//   },
// });








///upldated 


import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";

// ----------------------------------------------------
// GET TODOS
// ----------------------------------------------------
export const getTodos = query({
  handler: async (ctx) => {
    const todos = await ctx.db.query("todos").order("desc").collect();
    return todos;
  },
});

// ----------------------------------------------------
// ADD TODO
// ----------------------------------------------------
export const addTodo = mutation({
  args: {
    text: v.string(),
    dueDate: v.optional(v.string()),
    repeatType: v.optional(v.string()),
    todoType: v.optional(v.string()),
    priority: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const todoId = await ctx.db.insert("todos", {
      text: args.text,
      isCompleted: false,
      dueDate: args.dueDate ?? undefined,
      repeatType: args.repeatType ?? "none",
      todoType: args.todoType ?? "personal",
      priority: args.priority ?? "medium",
      createdAt: Date.now(),
    });

    return todoId;
  },
});

// ----------------------------------------------------
// TOGGLE TODO COMPLETION
// ----------------------------------------------------
export const toggleTodo = mutation({
  args: { id: v.id("todos") },
  handler: async (ctx, args) => {
    const todo = await ctx.db.get(args.id);
    if (!todo) throw new ConvexError("Todo not found");

    await ctx.db.patch(args.id, {
      isCompleted: !todo.isCompleted,
    });
  },
});

// ----------------------------------------------------
// DELETE TODO
// ----------------------------------------------------
export const deleteTodo = mutation({
  args: { id: v.id("todos") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

// ----------------------------------------------------
// UPDATE TODO
// ----------------------------------------------------
export const updateTodo = mutation({
  args: {
    id: v.id("todos"),
    text: v.string(),
    dueDate: v.optional(v.string()),
    repeatType: v.optional(v.string()),
    todoType: v.optional(v.string()),
    priority: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const todo = await ctx.db.get(args.id);
    if (!todo) throw new ConvexError("Todo not found");

    await ctx.db.patch(args.id, {
      text: args.text,
      dueDate: args.dueDate ?? todo.dueDate,
      repeatType: args.repeatType ?? todo.repeatType,
      todoType: args.todoType ?? todo.todoType,
      priority: args.priority ?? todo.priority,
    });
  },
});

// ----------------------------------------------------
// CLEAR ALL TODOS
// ----------------------------------------------------
export const clearAllTodos = mutation({
  handler: async (ctx) => {
    const todos = await ctx.db.query("todos").collect();

    for (const todo of todos) {
      await ctx.db.delete(todo._id);
    }

    return { deletedCount: todos.length };
  },
});
