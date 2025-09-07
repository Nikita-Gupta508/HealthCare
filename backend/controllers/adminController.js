const express = require("express");
const router = express.Router();
const checkAdmin = require("../middlewares/checkAdmin");

const Doctor = require("../models/doctor");
const Nurse = require("../models/nurse");
const User = require("../models/user");
const Department = require("../models/department");
const ContactUs = require("../models/contactUs");
const newsLetter = require("../models/newsLetter");

// Apply admin middleware to all routes
router.use(checkAdmin());

router.get("/get-users", async (req, res) => {
  try {
    const users = await User.find({role:"patient"});
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/delete-user/:id", async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    res.json(deletedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/get-contacts", async (req, res) => {
  try {
    const contacts = await ContactUs.find({});

    res.json(contacts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/delete-contact/:id", async (req, res) => {
  try {
    const deletedContact = await ContactUs.findByIdAndDelete(req.params.id);
    res.json(deletedContact);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/add-department", async (req, res) => {
  const { name, description, head, staff } = req.body;
  try {
    const existingdept = await Department.findOne({ name });

    if (existingdept) {
      return res
        .status(400)
        .json({ error: "Department with same name already exists" });
    }
       
    // Prepare department data
    // Prepare department data
    const deptData = {
      name,
      description: description || "",
      staff: staff || [],
      head: head || null
    };  


    // Only add head if it's provided and not empty
    if (head && head.trim() !== "") {
      deptData.head = head;
    }

    const newDept = new Department(deptData);
    const savedDept = await newDept.save();
    res.status(200).json(savedDept);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/delete-department/:id", async (req, res) => {
  try {
    const deletedDept = await Department.findByIdAndDelete(req.params.id);
    res.json(deletedDept);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/get-department", async (req, res) => {
  try {
    const depts = await Department.find({}).populate("head", "name");
    depts;
    console.log("depart",depts);
    res.json(depts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});   
    

router.get("/get-count", async (req, res) => {
  try {
      const patientcou = await User.countDocuments({ role: "patient" }).exec();
      const queriescou = await ContactUs.countDocuments({}).exec();
      const deptcou = await Department.countDocuments({}).exec();
      const doccou = await Doctor.countDocuments({}).exec();
      const nursecou = await Nurse.countDocuments({}).exec();

      res.json({
          patientcou,
          queriescou,
          deptcou,
          doccou,
          nursecou,
      });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});


router.post("/new-letter",async(req,res)=>{
  const {email}=req.body
  try {
    const newletter = new newsLetter({
      email,
    });
    const savedletter = await newletter.save();
    res.status(200).json({status:"Saved",savedletter});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
})


router.get("/get-sent-newsletter",async(req,res)=>{
  try {
    const sentnews = await newsLetter.find();
    res.json(sentnews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
})

module.exports = router;
