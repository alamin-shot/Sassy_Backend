import { Request, Response } from "express";

export const uploadProjectImage = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Return the file URL
    const imageUrl = `/uploads/projects/${req.file.filename}`;

    res.status(200).json({
      success: true,
      url: imageUrl,
      message: "Image uploaded successfully",
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: "Failed to upload image" });
  }
};
