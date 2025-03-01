router.post("/", upload.single("resume"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        console.log("Uploaded File:", req.file);  // Debugging Log

        const newResume = new Resume({
            filename: req.file.originalname,
            contentType: req.file.mimetype,
            data: req.file.buffer,
        });

        await newResume.save();
        console.log("Resume saved in DB ✅");

        res.status(201).json({ message: "Resume uploaded successfully" });
    } catch (error) {
        console.error("Upload error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
