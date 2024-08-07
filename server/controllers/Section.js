const Section = require("../models/Section");
const Course = require("../models/Course");

exports.createSection = async (req, res) => {
    try {
        const { sectionName, courseId } = req.body;
        if (!sectionName || !courseId) {
            return res.status(400).json({
                success: false,
                message: 'Missing Properties'
            })
        }

        const newSection = await Section.create({ sectionName });
        const updatedCourse = await Course.findByIdAndUpdate(courseId, {
            $push: {
                courseContent: newSection._id
            }
        }, { new: true });

        return res.status(200).json({
            success: true,
            message: 'Section Created Successfully',
            data: updatedCourse
        });


    } catch (err) {
        return res.status(500).json({
            success: false,
            message: 'Section Creation Failed, Please try later',
            error: err.message
        });
    }
}



exports.updateSection = async (req, res) => {
    try {
        const { sectionName, sectionId } = req.body;

        if (!sectionName || sectionId) {
            return res.status(404).json({
                success: false,
                message: 'Missing Properties'
            })
        }
        //update


        const newSection = await Section.findByIdAndUpdate(sectionId, {
            sectionName
        }, { new: true });


        return res.status(200).json({
            success: true,
            message: 'Section Updated Successfully'
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: 'Something Went Wrong During Updating Section'
        });
    }
}


exports.deleteSection = async (req, res) => {
    try {

        const { sectionId } = req.body;
        if (!sectionId) {
            return res.status(400).json({
                success: false,
                message: "All fields are mandatory"
            });
        }
        await Section.findByIdAndDelete(sectionId);

        return res.status(200).json({
            success: true,
            message: 'Section Deleted Successfully'
        });



    } catch (err) {
        return res.status(500).json({
            success: false,
            message: 'Something Went Wrong During Deleting Section',
            error: err.message
        });
    }
}