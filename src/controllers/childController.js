const prisma = require('../config/database');

const getAllChildren = async (req, res, next) => {
  try {
    const children = await prisma.child.findMany({
      include: {
        parent: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(children);
  } catch (error) {
    next(error);
  }
};

const getChildById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const child = await prisma.child.findUnique({
      where: { id },
      include: {
        parent: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    if (!child) {
      return res.status(404).json({ error: 'Child not found' });
    }

    res.json(child);
  } catch (error) {
    next(error);
  }
};

const createChild = async (req, res, next) => {
  try {
    const { firstName, lastName, dateOfBirth, gender, parentId } = req.body;

    if (!firstName || !lastName || !dateOfBirth || !gender || !parentId) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const child = await prisma.child.create({
      data: {
        firstName,
        lastName,
        dateOfBirth: new Date(dateOfBirth),
        gender,
        parentId
      },
      include: {
        parent: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    res.status(201).json(child);
  } catch (error) {
    next(error);
  }
};

const updateChild = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, dateOfBirth, gender, parentId } = req.body;

    const updateData = {};
    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (dateOfBirth) updateData.dateOfBirth = new Date(dateOfBirth);
    if (gender) updateData.gender = gender;
    if (parentId) updateData.parentId = parentId;

    const child = await prisma.child.update({
      where: { id },
      data: updateData,
      include: {
        parent: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    res.json(child);
  } catch (error) {
    next(error);
  }
};

const deleteChild = async (req, res, next) => {
  try {
    const { id } = req.params;

    await prisma.child.delete({
      where: { id }
    });

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllChildren,
  getChildById,
  createChild,
  updateChild,
  deleteChild
};
