const Job = require("../models/Job");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");
//CRUD
const getAllJobs = async (req, res) => {
  const jobs = await Job.find({ createdBy: req.user.userId }).sort("createdAt");

  res.status(StatusCodes.OK).json({ jobs, count: jobs.length });
};

// get job
const getJob = async (req, res) => {
  const {
    user: { userId },
    params: { id: jobID },
  } = req;

  const job = await Job.findOne({ _id: jobID, createdBy: userId });
  if (!job) {
    throw new NotFoundError(`No job with ID ${jobID} for this user`);
  }

  res.status(StatusCodes.OK).json({ job });
};

// create

const createJob = async (req, res) => {
  req.body.createdBy = req.user.userId;
  const job = await Job.create(req.body);

  res.status(StatusCodes.CREATED).json({ job });
};

// update
const updateJob = async (req, res) => {
  const {
    body: { company, position },
    user: { userId },
    params: { id: jobID },
  } = req;
  if (!company || !position) {
    throw new BadRequestError("please provide a company and position value");
  }
  const job = await Job.findOneAndUpdate(
    { _id: jobID, createdBy: userId },
    req.body,
    { new: true, runValidators: true }
  );
  if (!job) {
    throw new NotFoundError(`no job with id ${jobID}`);
  }

  res.status(StatusCodes.OK).json({ job });
};
const deleteJob = async (req, res) => {
  const {
    user: { userId },
    params: { id: jobID },
  } = req;
  const job = await Job.findOneAndRemove({ createdBy: userId, _id: jobID });
  if (!job) {
    throw new NotFoundError(`no job with id ${jobID}`);
  }
  res.status(StatusCodes.OK).send();
};

module.exports = { getAllJobs, getJob, updateJob, deleteJob, createJob };
