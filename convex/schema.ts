import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  todos: defineTable({
    text: v.string(),
    isCompleted: v.boolean(),
    dueDate: v.optional(v.string()),     // 🆕 ISO string date
    repeatType: v.optional(v.string()),  // 🆕 'none' | 'daily' | 'weekly' | 'monthly'
    todoType: v.optional(v.string()),    // 🆕 'personal' | 'public' | 'group'
    priority: v.optional(v.string()),    // 🆕 'low' | 'medium' | 'high'
    createdAt: v.optional(v.number()),   // 🆕 timestamp
  }),
});
