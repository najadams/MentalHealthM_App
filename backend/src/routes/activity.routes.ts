import express, { Response } from "express";
import { auth } from "../middleware/auth.middleware";
import { ActivityLog } from "../models/activity.model";
import { AuthRequest } from "../types";
import { format } from "date-fns";

const router = express.Router();

// Log activity
router.post("/log",auth, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "User not authenticated" });
    }
    console.log("user unauthenticated")

    // Validate request body
    const { activityType, duration, notes } = req.body;
    if (!activityType || !duration) {
      return res
        .status(400)
        .json({ error: "Activity type and duration are required" });
    }

    if (duration < 1) {
      return res.status(400).json({ error: "Duration must be greater than 0" });
    }

    const activityLog = new ActivityLog({
      activityType,
      duration,
      notes,
      userId: req.user._id,
    });

    await activityLog.save();

    res.status(201).json({
      success: true,
      data: activityLog,
      message: "Activity logged successfully",
    });
  } catch (error: any) {
    console.error("Error logging activity:", error);
    res.status(400).json({
      success: false,
      error: error.message || "Failed to log activity",
    });
  }
});

// Get activity history with pagination and filters
router.get("/history", auth, async (req: AuthRequest, res: Response) => {
  try {
    console.log("tried history")
    if (!req.user) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    // Check if date parameters are being passed in page and limit
    let page = 1;
    let limit = 10;
    let startDate, endDate;

    // Log the query parameters to debug
    console.log("Query parameters:", req.query);

    // Check if page and limit are actually dates
    if (req.query.page && typeof req.query.page === 'string' && req.query.page.includes('T')) {
      startDate = req.query.page;
    } else {
      page = parseInt(req.query.page as string) || 1;
    }

    if (req.query.limit && typeof req.query.limit === 'string' && req.query.limit.includes('T')) {
      endDate = req.query.limit;
    } else {
      limit = parseInt(req.query.limit as string) || 10;
    }

    // Use provided startDate and endDate if they exist
    if (req.query.startDate) {
      startDate = req.query.startDate as string;
    }
    
    if (req.query.endDate) {
      endDate = req.query.endDate as string;
    }

    const skip = (page - 1) * limit;
    const { activityType } = req.query;

    const query: any = { userId: req.user._id };
    
    // Add date range filter if both dates are available
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);

      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        return res.status(400).json({ error: "Invalid date format" });
      }

      query.createdAt = {
        $gte: start,
        $lte: end,
      };
    }

    // Add activity type filter
    if (activityType) {
      query.activityType = activityType;
    }

    const [activityLogs, total] = await Promise.all([
      ActivityLog.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
      ActivityLog.countDocuments(query),
    ]);

    console.log("Activity logs found:", activityLogs.length);
    res.json({
      success: true,
      data: activityLogs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error("Error fetching activity history:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to fetch activity history",
    });
  }
});

// Update activity status
router.patch("/:id/complete", auth, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const activityLog = await ActivityLog.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!activityLog) {
      return res.status(404).json({
        success: false,
        error: "Activity log not found",
      });
    }

    activityLog.completed = true;
    await activityLog.save();

    res.json({
      success: true,
      data: activityLog,
      message: "Activity marked as completed",
    });
  } catch (error: any) {
    console.error("Error updating activity status:", error);
    res.status(400).json({
      success: false,
      error: error.message || "Failed to update activity status",
    });
  }
});

export default router;
