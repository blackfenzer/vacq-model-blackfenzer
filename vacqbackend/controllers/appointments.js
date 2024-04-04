const Appointment = require("../models/Appointment");

exports.getAppointments = async (req, res, next) => {
  let query;
  try {
    if (req.user.role !== "admin") {
      console.log(error);
      query = Appointment.find({ user: req.user.id }).populate({
        path: "hospital",
        select: "name province tel",
      });
    } else {
      console.log(req.params.hospitalId);
      if (req.params.hospitalId) {
        console.log(req.params.hospitalId);
        query = Appointment.find({ hospital: req.params.hospitalId }).populate({
          path: "hospital",
          select: "name province tel",
        });
      } else {
        query = Appointment.find().populate({
          path: "hospital",
          select: "name province tel",
        });
      }
    }

    const appointments = await query;
    res
      .status(200)
      .json({ success: true, count: appointments.length, data: appointments });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

exports.addAppointment = async (req, res, next) => {
  try {
    req.body.user = req.user.id;

    const hospital = await Hospital.findById(req.params.hospitalId);

    if (!hospital) {
      return res
        .status(404)
        .json({
          success: false,
          message: `No hospital with the id of ${req.params.hospitalId}`,
        });
    }

    const appointment = await Appointment.create(req.body);

    res.status(200).json({ success: true, data: appointment });
  } catch (error) {
    console.log(error);

    return res
      .status(500)
      .json({ success: false, message: "Cannot create Appointment" });
  }
};

exports.getAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id).populate({
      path: "hospital",
      select: "name description tel",
    });
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: `No appointment with this id of ${req.params.id} `,
      });
    }
    res.status(200).json({
      success: true,
      data: appointment,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: `Cannot find appointment `,
    });
  }
};

exports.updateAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: `No appointment with this id of ${req.params.id} `,
      });
    }
    // here
    if (
      appointment.user.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(401).json({
        success: false,
        message: `User ${req.user.id} is not authorized to update this appointment`,
      });
    }

    appointment = await Appointment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      success: true,
      data: appointment,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: `Cannot update appointment `,
    });
  }
};

exports.deleteAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: `No appointment with the id of ${req.params.id} `,
      });
    }
    if (
      appointment.user.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(401).json({
        success: false,
        message: `User ${req.user.id} is not authorized to delete this appointment`,
      });
    }
    await Appointment.deleteOne();
    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: `Cannot delete appointment `,
    });
  }
};
