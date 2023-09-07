import express from 'express';
import connection from '../config/db-config.js';
import Employee from '../models/employeeModel.js';
const router = express.Router();

// Add new employee
router.post('/', async (req, res, next) => {
	const { name, role } = req.body;

	try {
		const newEmployee = await Employee.create({
			name,
			role,
		});

		if (!newEmployee) {
			return res
				.status(500)
				.send({ message: 'Fail to add new Employee!' });
		}

		return res
			.status(201)
			.send({ message: 'Successfully added new Employee' });
	} catch (err) {
		next(err);
	}
});

// Get all employees
router.get('/', async (req, res, next) => {
	try {
		const employees = await Employee.find();

		if (employees.length === 0) {
			throw Error('No employees recorded');
			// return res.status(404).send({ message: 'No employees recorded' });
		}

		const records = [];
		employees.forEach((emp) => {
			if (emp) {
				const empsRecord = {
					id: emp._id,
					name: emp.name,
					role: emp.role,
				};
				records.push(empsRecord);
			} else {
				return res
					.status(404)
					.send({ message: 'No employees recorded' });
			}
		});

		return res.status(200).json({
			count: records.length,
			data: records,
		});
	} catch (error) {
		next(error);
	}
});

// Get single employee based on id
router.get('/:id', async (req, res, next) => {
	try {
		const employee = await Employee.findById(req.params.id);

		if (!employee) {
			return res
				.status(404)
				.send({ message: `Employee with the given ID does not found` });
		}

		return res.status(200).json({ data: employee });
	} catch (error) {
		next(error);
	}
});

// Edit existing employee based on id
router.put('/:id', async (req, res, next) => {
	const { name, role } = req.body;
	const { id } = req.params;

	try {
		let currentRecord = await Employee.findById(id);

		if (!currentRecord) {
			return res
				.status(404)
				.send({ message: 'Employee record does not found' });
		}

		const updateEmpRecord = await Employee.findByIdAndUpdate(id, req.body, {
			new: true,
		});

		if (!updateEmpRecord) {
			return res
				.status(400)
				.send({ message: 'Fail to update employee record' });
		}

		return res.status(200).send({ message: 'Successfully updated record' });
	} catch (error) {
		next(error);
	}
});

// Delete employee based on id
router.delete('/:id', async (req, res, next) => {
	try {
		const emp = await Employee.findByIdAndDelete(req.params.id);
		return res.status(200).send({ message: 'Deleted record successfully' });
	} catch (error) {
		next(error);
	}
});

// Delete all employees
router.delete('/', async (req, res, next) => {
	try {
		const allEmps = await Employee.deleteMany({});
		return res
			.status(200)
			.send({ message: 'All employee records has been deleted' });
	} catch (error) {
		next(error);
	}
});

export default router;
