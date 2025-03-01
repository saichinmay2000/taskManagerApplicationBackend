const express = require("express")
const router = express.Router()
const Task = require("../models/Task")
const authMiddleware = require("../middlewares/authMiddleware")

// User New Task Creation
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { title, description } = req.body;
        const newTask = new Task({ userId: req.user.userId, title, description })
        await newTask.save();
        res.status(201).json(newTask)
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error!" })
    }
})

// Get User All Tasks
router.get('/' , authMiddleware, async (req, res) => {
    try {
        const tasks = await Task.find({ userId: req.user.userId }).sort({ createdAt: -1 });
        res.json(tasks)
    } catch (error) {
        res.status(500).json({ message: "Server error" })
    }
})

// Get a Single Task
router.get('/:id', authMiddleware, async (req, res) => {
    try {
        const task = await Task.findById(req.params.id)
        if(!task || task.userId.toString() !== req.user.userId){
            res.status(404).json({ message: "Task Not Found" })
        }
        res.json(task)
    } catch (error) {
        res.status(500).json({ message: "Server error" })
    }
})

// Delete a Task
router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        
        if (!task || task.userId.toString() !== req.user.userId) {
            return res.status(404).json({ message: "Task not found" });
        }

        await task.deleteOne();
        res.json({ message: "Task deleted successfully" });
    } catch (err) {
        console.log(err);
        
        res.status(500).json({ message: "Server error" });
    }
});

//Update a task
router.put("/:id", authMiddleware, async (req, res) => {
    try {
        const { title, description } = req.body;
        const task = await Task.findById(req.params.id);
        if (!task || task.userId.toString() !== req.user.userId) {
            return res.status(404).json({ message: "Task not found" });
        }

        task.title = title;
        task.description = description;
        await task.save()
        res.json(task);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router